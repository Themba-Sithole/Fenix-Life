# Fenix Life — Investment & Markets Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Investment & Capital Markets Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Chief Economist  
**Audience:** Game Design, Engineering, UX, QA, Narrative, Live Ops  

---

## Document Authority

This document defines **how players discover, research, buy, hold, and sell financial assets** in Fenix Life. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Investor archetype, financial literacy, market consequence |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Citizen Equality, Living World |
| [05_Economy_Design.md](./05_Economy_Design.md) | Player-facing macro economy framing (planned companion) |
| [11_Banking_Finance_Design.md](./11_Banking_Finance_Design.md) | Settlement accounts, margin loans, net worth |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Market indices, sector returns, rate transmission |
| [19_Company_Simulation.md](./19_Company_Simulation.md) | Earnings, IPO, corporate actions |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Investment Engine §4.8 responsibilities |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | `Security`, `Order`, `Trade`, portfolio entities |
| [StockMarket screen](../src/app/screens/StockMarket.tsx) | v0 UI reference implementation |

**Division of authority:**

| Owns | Does Not Own |
|---|---|
| Player investment UX & order flows | Macro index formulas (Economy Engine) |
| Portfolio presentation & research UI | Corporate governance (Company Engine) |
| Risk tolerance profiling | Banking ledger (Banking Engine) |
| Retirement account rules (player view) | Tax calculation (Tax Engine) |
| IPO subscription player journey | Private company cap tables (Company Engine) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Five Capitals Alignment](#2-philosophy--five-capitals-alignment)
3. [Design Goals & Anti-Goals](#3-design-goals--anti-goals)
4. [StockMarket Screen Architecture](#4-stockmarket-screen-architecture)
5. [Asset Classes Overview](#5-asset-classes-overview)
6. [Equities — Stocks](#6-equities--stocks)
7. [Bonds](#7-bonds)
8. [ETFs & Index Funds](#8-etfs--index-funds)
9. [IPO Participation](#9-ipo-participation)
10. [Dividends & Corporate Actions](#10-dividends--corporate-actions)
11. [Order Types & Execution](#11-order-types--execution)
12. [Portfolio Management](#12-portfolio-management)
13. [Research & Market Intelligence](#13-research--market-intelligence)
14. [Risk Tolerance System](#14-risk-tolerance-system)
15. [Retirement Accounts](#15-retirement-accounts)
16. [Margin & Advanced Products](#16-margin--advanced-products)
17. [Living World Markets](#17-living-world-markets)
18. [Integration Contracts](#18-integration-contracts)
19. [Player Decision Flows](#19-player-decision-flows)
20. [Events & Notifications](#20-events--notifications)
21. [Accessibility & Financial Literacy](#21-accessibility--financial-literacy)
22. [v1 Scope & Future Expansion](#22-v1-scope--future-expansion)
23. [Acceptance Criteria](#23-acceptance-criteria)
24. [QA Scenarios](#24-qa-scenarios)
25. [Glossary](#25-glossary)

---

# 1. Executive Summary

Investment & Markets is the **player's gateway to compound growth, sector bets, and ownership stakes** in the simulated economy. It must feel like a modern brokerage terminal—clean, data-rich, consequential—embedded in a world where companies earn, fail, and IPO on the same rules for player and AI.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  INVESTMENT & MARKETS — PLAYER JOURNEY                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LEARN              ALLOCATE            MONITOR             ADJUST           │
│  ─────              ────────            ───────             ──────           │
│  Research stocks →  Build portfolio →  Track returns   →  Rebalance         │
│  Understand risk    Diversify           Dividend income     Tax-loss harvest │
│  Read earnings      IPO subscribe       Mark-to-market      Exit strategy    │
│                                                                              │
│         ▲                    ▲                    ▲                        │
│         │                    │                    │                        │
│    News Engine          Economy Engine        Banking Engine                 │
│    (sentiment)          (indices, rates)      (buying power)                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core player promise:** Markets reward patience and punish panic—but never arbitrarily. Every price move traces to earnings, rates, or sector demand the player can investigate.

| Pillar | Investment Expression |
|---|---|
| **Long-term wealth** | Index funds vs stock-picking tradeoffs |
| **Risk education** | Volatility shown, not hidden |
| **Ownership** | IPO and stake acquisition feel meaningful |
| **Symmetry** | AI fund managers face same market physics |
| **Consequence** | Margin calls, delistings, bankruptcies real |

---

# 2. Philosophy & Five Capitals Alignment

## 2.1 Financial Capital — Primary

| Component | Investment Touchpoint |
|---|---|
| Portfolio value | Holdings marked daily |
| Income streams | Dividends, bond coupons |
| Asset appreciation | Unrealized gains/losses |
| Risk exposure | Beta, sector concentration |
| Liquidity | Cash vs invested ratio |

## 2.2 Human Capital — Secondary

| Link | Mechanism |
|---|---|
| Financial literacy trait | Unlocks advanced order types |
| Career in finance | Insider knowledge boundaries (regulated) |
| Education | Business/finance degrees improve research quality |
| Discipline trait | Panic-sell resistance in downturns |

## 2.3 Social Capital — Tertiary

| Link | Mechanism |
|---|---|
| Investment clubs | v2 — group decisions |
| Reputation | Public portfolio performance (opt-in Fenix Network) |
| Mentor NPC | Unlocks after portfolio milestone |

## 2.4 Business Capital — Bridge

| Link | Mechanism |
|---|---|
| Founder equity | Pre-IPO private stake in own company |
| Angel investing | Seed rounds in NPC/player companies |
| Board seats | v2 — governance mini-loop |
| Insider restrictions | Trading windows around earnings |

## 2.5 Legacy Capital — Long Arc

| Mechanism | Role |
|---|---|
| Inherited portfolios | Step-up basis rules (Tax Engine) |
| Trust-held assets | v2 |
| Generational wealth | Decade-scale compound growth |
| World Memory | IPO participation, crash survival archived |

## 2.6 Constitutional Checks

1. Can AI citizens panic-sell under same fear triggers?
2. Does market crash emerge from economy state, not scripted card?
3. Are insider advantages forbidden for player?
4. Does idle cash erosion (inflation) motivate investing?
5. Can a non-CEO player still "win" via index investing?

---

# 3. Design Goals & Anti-Goals

## 3.1 Goals

| ID | Goal | Success Signal |
|---|---|---|
| G1 | Player places first trade in < 5 minutes | Onboarding funnel |
| G2 | Portfolio risk visible at glance | Risk badge on dashboard |
| G3 | Dividend income feels like cash flow | YTD dividend headline |
| G4 | IPO process teaches allocation scarcity | Oversubscription experience |
| G5 | Research connects price to fundamentals | Earnings drill-down usage |
| G6 | Retirement accounts teach tax-advantaged saving | Contribution funnel |

## 3.2 Anti-Goals

| ID | Anti-Goal | Why |
|---|---|---|
| A1 | Guaranteed stock tips | Removes skill and research |
| A2 | Player-only market timing buffs | Citizen Equality violation |
| A3 | Infinite margin without consequences | Teaches reckless leverage |
| A4 | Real ticker trademark infringement | Use fictional companies |
| A5 | Day-trading as only viable strategy | Contradicts decade-scale play |
| A6 | Crypto speculation without regulation | v2 gated if ever added |

---

# 4. StockMarket Screen Architecture

The `StockMarket` screen is the **canonical v1 layout reference**.

## 4.1 Screen Regions

| Region | v0 Reference | Live Data Source |
|---|---|---|
| Hero header | Portfolio value | `PortfolioSnapshot.totalValue` |
| Summary card | Value, gain, holdings count, dividends YTD | Aggregated portfolio metrics |
| Performance chart | 1D/1W/1M/1Y toggle line chart | `PortfolioValueHistory` |
| Trending stocks | Top movers panel | `MarketMover[]` daily |
| Holdings grid | Per-stock cards with buy/sell | `Holding[]` |
| Explore CTA | Market browse entry | Exchange listing index |

## 4.2 Navigation & Entry Points

| Entry Point | Route | Context |
|---|---|---|
| Home hub | `/investments` | Default portfolio view |
| Company detail | `/investments/symbol/:ticker` | From news or company page |
| IPO calendar | `/investments/ipo` | Upcoming offerings |
| Retirement | `/investments/retirement` | 401k/IRA analog |
| Research | `/investments/research` | Screener, reports |
| Order ticket | `/investments/trade/:symbol` | Pre-filled symbol |

## 4.3 Holdings Card Anatomy

Per StockMarket reference, each holding shows:

| Field | Example | Purpose |
|---|---|---|
| Symbol | AAPL analog | Quick identification |
| Company name | Apple Inc. analog | Context |
| Logo | Emoji/brand mark | Visual scan |
| Price | $182.45 | Current mark |
| Change | +$2.35 (+1.31%) | Daily movement |
| Shares | 250 | Position size |
| Position value | $45,612 | Mark-to-market |
| Buy / Sell | Actions | Order entry |

## 4.4 Portfolio Summary Metrics

| Metric | Calculation | Display |
|---|---|---|
| Portfolio value | Σ (shares × price) + cash | Hero + summary card |
| Day change | Today's value − yesterday close | $ and % |
| Total gain | Value − cost basis | All-time $ and % |
| Holdings count | Distinct positions | Count badge |
| Dividends YTD | Sum dividend credits | Gold accent |
| Cash available | Investment cash account | Buy power |

## 4.5 Chart Timeframes

| Range | Data Granularity | Use Case |
|---|---|---|
| 1D | 5-min or hourly | Intraday volatility |
| 1W | Daily | Recent trend |
| 1M | Daily | Monthly performance |
| 1Y | Daily/weekly | Annual return |
| 5Y | Monthly | Long-term investor view |
| All | Monthly | Lifetime arc |

## 4.6 Empty States

| State | Copy | CTA |
|---|---|---|
| No holdings | "Your portfolio is empty. The market is open." | [Explore Stocks] |
| No cash | "Insufficient buying power." | [Transfer from Bank] |
| Market closed | "Markets reopen at 9:30 AM sim-time." | [Set Alert] |
| Halted symbol | "Trading halted pending news." | [Read Announcement] |

---

# 5. Asset Classes Overview

## 5.1 v1 Asset Universe

| Asset Class | ID Prefix | Exchange | v1 Status |
|---|---|---|---|
| Common stock | `EQ` | FNX Exchange | ✅ Full |
| Preferred stock | `PFD` | FNX Exchange | ✅ Display only |
| Government bond | `GOV` | Bond desk | ✅ Full |
| Corporate bond | `CORP` | Bond desk | ✅ Full |
| ETF | `ETF` | FNX Exchange | ✅ Full |
| Index fund (mutual) | `IDX` | Fund platform | ✅ Full |
| Money market fund | `MMF` | Fund platform | ✅ Full |
| Private equity | `PE` | OTC | ✅ Via Company Engine |
| Options | `OPT` | — | ❌ v2 |
| REIT | `REIT` | FNX Exchange | ✅ Sector ETF proxy v1 |

## 5.2 Risk-Return Spectrum (Player Education)

```
Lower Risk ◄────────────────────────────────────────────► Higher Risk

Money Market   Gov Bonds   Corp Bonds   Index ETF   Blue Chip   Growth   IPO
   ~1-3%         ~2-5%       ~4-7%        ~7-10%      ~8-12%    ~12-20%  ~???
```

Displayed as educational spectrum chart in onboarding—not a guarantee.

## 5.3 Liquidity Tiers

| Tier | Settlement | Examples |
|---|---|---|
| T+0 | Same day | Money market |
| T+1 | Next trading day | Stocks, ETFs |
| T+2 | Two days | Bonds (v1 abstraction) |
| Illiquid | Lockup periods | IPO lockup, private equity |

## 5.4 Currency

v1 worlds use single sovereign currency per jurisdiction. Multi-currency FX investing is expansion scope.

---

# 6. Equities — Stocks

## 6.1 Listed Company Universe

Companies list on FNX Exchange when:

| Trigger | Requirement |
|---|---|
| IPO | Company Engine `company.ipo_completed` |
| Direct listing | Alternative path, no raise |
| Spin-off | Parent company action |
| Delisting | Bankruptcy, merger, compliance failure |

All tickers are **fictional** (e.g., `FXAP` not `AAPL`) to avoid trademark issues. UI may use emoji/logo placeholders per v0.

## 6.2 Stock Detail Page

| Section | Content |
|---|---|
| Header | Price, change, market cap, volume |
| Chart | Interactive price history |
| Fundamentals | P/E, EPS, revenue growth, dividend yield |
| Earnings | Last 4 quarters, next report date |
| Ownership | Institutional % (aggregate NPC) |
| News | Filtered News Engine feed |
| Analyst consensus | NPC analyst ratings (buy/hold/sell) |
| Your position | Shares, cost basis, gain |

## 6.3 Price Formation (Player-Facing Explanation)

Players see simplified price drivers:

```
Today's price change driven by:
  Sector sentiment        +1.2%
  Company earnings beat   +0.8%
  Broad market (FNX-500)  +0.5%
  Interest rate effect    −0.3%
  ─────────────────────────────
  Net                     +2.2%
```

Underlying simulation: Economy sector returns + company-specific alpha from earnings.

## 6.4 Market Indices

| Index | Composition | Player Use |
|---|---|---|
| FNX-500 | Top 500 companies by cap | Benchmark |
| FNX-Tech | Technology sector | Sector bet |
| FNX-Value | Value factor tilt | Style bet |
| FNX-Growth | Growth factor tilt | Style bet |
| FNX-Div | High dividend yield | Income focus |

Index levels published by Economy Engine §20. ETF products track indices with tracking error.

## 6.5 Short Selling

v1: **Not available to retail player** (educational tooltip explains concept). v2 institutional career path may unlock.

## 6.6 Penny Stocks / OTC

Low-cap OTC stocks available with warning banner:

> "Speculative securities. High volatility, limited disclosure. You may lose your entire investment."

---

# 7. Bonds

## 7.1 Bond Product Types

| Type | Issuer | Risk | Typical Yield |
|---|---|---|---|
| Treasury bill | Government | Lowest | Policy rate − spread |
| Treasury note | Government | Low | Yield curve |
| Municipal bond | Local government | Low–med | Tax-advantaged (Tax Engine) |
| Investment grade corp | NPC companies | Medium | Credit spread + treasury |
| High yield (junk) | Risky companies | High | Wide spread |

## 7.2 Bond Key Metrics (Player Display)

| Metric | Definition | Player Tooltip |
|---|---|---|
| Face value | Par at maturity | "Amount repaid at end" |
| Coupon rate | Annual interest % | "Income you receive yearly" |
| Yield to maturity | Total return if held | "True return including price" |
| Duration | Interest rate sensitivity | "Price drops ~X% if rates rise 1%" |
| Credit rating | AAA to D scale | "Issuer's ability to pay" |

## 7.3 Bond Trading UI

Simpler than stocks—emphasize income:

| Field | Display |
|---|---|
| Bond name | "FXN 10Y Treasury 4.25%" |
| Price | $98.50 (discount to par) |
| Current yield | 4.31% |
| Maturity | Mar 2036 |
| Min purchase | $1,000 face |

## 7.4 Rate Environment Education

When `economy.rate_changed`:

```
"Bond prices move opposite to interest rates.
Your 10-year bond may lose ~8% value if rates rise 1%.
Consider shorter duration if you need liquidity soon."
```

## 7.5 Default Risk

Corporate bond issuers can default (Company bankruptcy). Recovery rate 20–60% of face value. Player notification + World Memory event.

---

# 8. ETFs & Index Funds

## 8.1 ETF vs Mutual Fund (Player Education)

| Feature | ETF | Index Fund (Mutual) |
|---|---|---|
| Trades | Intraday on exchange | End-of-day NAV |
| Min investment | 1 share (~$50–$500) | Often $1,000+ |
| Expense ratio | 0.03%–0.20% | 0.05%–0.50% |
| Tax efficiency | Generally higher | Lower |
| Best for | Flexible traders | Set-and-forget DCA |

## 8.2 Core ETF Products (v1)

| Ticker | Name | Tracks | Expense Ratio |
|---|---|---|---|
| `FNX500` | FNX Total Market ETF | FNX-500 | 0.03% |
| `FNXTCH` | FNX Technology ETF | FNX-Tech | 0.08% |
| `FNXBND` | FNX Aggregate Bond ETF | Bond index | 0.04% |
| `FNXDIV` | FNX Dividend Aristocrats | High yield | 0.10% |
| `FNXINT` | FNX International Developed | Trade index | 0.12% |

## 8.3 Index Fund Products

| Fund | Min Investment | Auto-Invest |
|---|---|---|
| FNX 500 Index Fund | $1,000 | ✅ Monthly |
| FNX Bond Index Fund | $1,000 | ✅ Monthly |
| FNX Target Date 2050 | $500 | ✅ Payroll deduction |

## 8.4 Dollar-Cost Averaging (DCA)

Player enables auto-invest:

| Setting | Options |
|---|---|
| Amount | $50–$10,000/month |
| Frequency | Weekly, bi-weekly, monthly |
| Source | Checking or investment cash |
| Destination | Fund or ETF |

UI shows projected value at 5/10/20 year horizons (assumption disclosed).

## 8.5 Expense Ratio Impact Calculator

```
$10,000 invested over 30 years at 8% return:
  With 0.03% expense: $100,627
  With 1.00% expense:  $76,123
  Difference:          $24,504 lost to fees
```

Interactive slider teaches fee drag.

---

# 9. IPO Participation

## 9.1 IPO Calendar

| Column | Content |
|---|---|
| Company | Name + sector |
| Expected date | Pricing week |
| Price range | $18–$22 per share |
| Offering size | $500M raise |
| Status | Open / Closed / Priced / Trading |

## 9.2 Retail Subscription Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Browse IPO   │───►│ Read         │───►│ Indicate     │───►│ Allocation   │
│ Calendar     │    │ Prospectus   │    │ Interest     │    │ Notification │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │ Lockup period│
                                       │ (90–180 days)│
                                       └──────────────┘
```

## 9.3 Prospectus Summary (Player View)

| Section | Content |
|---|---|
| Business overview | What company does |
| Financials | Revenue, profit, growth rate |
| Risk factors | Bullet list (competition, regulation) |
| Use of proceeds | R&D, debt paydown, expansion |
| Valuation context | P/E vs sector peers |
| Lockup terms | When insiders can sell |

## 9.4 Allocation Mechanics

| Rule | Detail |
|---|---|
| Oversubscription | Typical 3–10× demand |
| Retail allocation | Pro-rata or lottery |
| Max shares | Per-account cap |
| Funding hold | Cash reserved on indication |
| Pricing | Final price may differ from range |

Player experience: Indicate 500 shares at $20 → allocated 75 shares at $22 → charged $1,650.

## 9.5 First Day Trading

| Phenomenon | Player Education |
|---|---|
| Pop | "IPOs often open above offer price" |
| Volatility | Warning banner first 5 days |
| Lockup | "Insider selling may pressure price after lockup expires" |

## 9.6 Founder/IPO Path

Player-founded companies follow same IPO rules via Company Engine—no shortcut. Player must meet:

| Requirement | Threshold |
|---|---|
| Revenue | 4 consecutive profitable quarters OR $50M ARR |
| Audited financials | Yes |
| Float minimum | 15% public float |
| Underwriter | NPC bank engagement |

---

# 10. Dividends & Corporate Actions

## 10.1 Dividend Types

| Type | Player Experience |
|---|---|
| Cash dividend | Credit to investment cash account |
| Stock dividend | Additional shares deposited |
| Special dividend | One-time larger payment |

## 10.2 Dividend Timeline UI

| Date | Event |
|---|---|
| Declaration | Announced amount |
| Ex-dividend | Buy after → no dividend |
| Record | Holder of record |
| Payment | Cash arrives |

Player calendar integration with push notification.

## 10.3 Dividend Reinvestment (DRIP)

| Option | Behavior |
|---|---|
| Off | Cash to investment account |
| On | Auto-buy fractional shares |
| Partial | % to reinvest, % to cash |

## 10.4 Stock Splits

| Event | Player Impact |
|---|---|
| 2:1 split | Shares double, price halves |
| Reverse split | Shares reduce, price rises |

Cost basis adjusts automatically. Educational modal on first occurrence.

## 10.5 Mergers & Acquisitions

| Type | Player Outcome |
|---|---|
| Cash acquisition | Shares converted to cash at offer price |
| Stock acquisition | Shares converted to acquirer stock |
| Mixed | Cash + stock |

Player may vote on M&A if shareholder (v2 governance).

## 10.6 Bankruptcy & Delisting

| Stage | Player Action |
|---|---|
| Warning | News + position flagged red |
| Chapter 11 | Trading may continue (speculative) |
| Chapter 7 / delist | Position marked worthless or recovery % |
| Write-off | Loss realizes for tax (Tax Engine) |

---

# 11. Order Types & Execution

## 11.1 v1 Order Types

| Type | ID | Behavior | Player Level |
|---|---|---|---|
| Market | `market` | Execute at current price | Beginner |
| Limit | `limit` | Execute at price or better | Standard |
| Stop loss | `stop` | Trigger market sell below price | Standard |
| Stop limit | `stop_limit` | Trigger limit sell | Advanced |
| Trailing stop | `trailing` | Dynamic stop % | Advanced |

## 11.2 Order Ticket UI

| Field | Validation |
|---|---|
| Symbol | Active listing |
| Action | Buy / Sell |
| Quantity | Whole shares (fractional v1.5) |
| Order type | Per above |
| Limit price | Required for limit orders |
| Time in force | Day, GTC (good-til-canceled) |
| Estimated cost | Shares × price + fees |
| Buying power check | Must have cash or margin |

## 11.3 Market Order Flow

```
Player submits market buy 100 shares
    │
    ├─► Pre-trade check: buying power, halted status
    │
    ├─► Simulated matching (abstraction, not full LOB v1)
    │       └─► Fill price = current ask + slippage (large orders)
    │
    ├─► Settlement T+1: cash debited, shares credited
    │
    └─► Confirmation + trade receipt
```

## 11.4 Limit Order Flow

| State | Player Display |
|---|---|
| `pending` | Open order in queue |
| `partial` | Partially filled |
| `filled` | Complete |
| `cancelled` | Player cancelled |
| `expired` | GTC expired (90 days) |

## 11.5 Fees & Commissions

| Product | Commission v1 |
|---|---|
| Stocks/ETFs | $0 |
| Bonds | $1 per $1,000 face (min $10) |
| Mutual funds | $0 for no-load funds |
| IPO | No retail fee |

Revenue model: payment for order flow abstraction (invisible to player), spread on bonds.

## 11.6 Slippage Education

Large orders relative to daily volume:

```
"Your order is 5% of today's volume.
Estimated slippage: 0.3–0.8% above current price."
```

## 11.7 Pattern Day Trader Rule (Analog)

4+ day trades in 5 days with account < $25,000 → flagged. Must deposit or wait. Educational reference to real-world rule.

---

# 12. Portfolio Management

## 12.1 Portfolio Dashboard Metrics

| Metric | Formula | Purpose |
|---|---|---|
| Total value | Holdings + cash | Wealth snapshot |
| Cost basis | Σ purchase price × shares | Tax reference |
| Unrealized gain | Value − cost basis | Paper profit |
| Realized gain YTD | Closed trades this year | Tax reference |
| Beta | Portfolio vs FNX-500 | Risk measure |
| Sharpe ratio | v1.5 advanced | Risk-adjusted return |
| Sector allocation | % by sector | Diversification |
| Dividend yield | Annual div / value | Income rate |

## 12.2 Allocation Pie Chart

| Sector | Color | Target % (optional) |
|---|---|---|
| Technology | Teal | 25% |
| Healthcare | Blue | 15% |
| Financials | Gold | 10% |
| Consumer | Purple | 20% |
| Energy | Orange | 5% |
| Bonds | Gray | 15% |
| Cash | White | 10% |

Player sets target allocation → rebalance suggestions.

## 12.3 Rebalancing

| Trigger | Suggestion |
|---|---|
| Drift > 5% from target | "Rebalance to targets?" |
| Life event | Risk tolerance review |
| Age milestone | Target date fund shift |

One-click rebalance generates sell/buy orders with tax impact preview.

## 12.4 Tax-Loss Harvesting (v1.5)

When holding at loss:

```
"Harvest $2,400 loss to offset gains?
Warning: Wash sale rule applies if you rebuy within 30 days."
```

Links to Tax Engine capital gains rules.

## 12.5 Watchlists

| Feature | Detail |
|---|---|
| Multiple lists | "Dividend ideas", "IPO watch" |
| Price alerts | Above/below threshold |
| Earnings alerts | 1 day before report |
| News alerts | Company-specific |

## 12.6 Performance Attribution

Monthly report:

| Source | Contribution |
|---|---|
| Stock selection | +2.1% |
| Sector allocation | +0.8% |
| Market timing | −0.3% |
| Dividends | +0.4% |
| Fees | −0.1% |
| **Total** | **+2.9%** |

---

# 13. Research & Market Intelligence

## 13.1 Research Hub Layout

| Tab | Content |
|---|---|
| Screener | Filter stocks by metrics |
| Sectors | Sector performance heatmap |
| Earnings calendar | Upcoming reports |
| Analyst reports | NPC-generated summaries |
| Economic briefing | Link to macro dashboard |
| Education | Investing 101 articles |

## 13.2 Stock Screener Filters

| Filter | Range |
|---|---|
| Market cap | Micro to mega |
| P/E ratio | < 10 to > 50 |
| Dividend yield | 0% to 8%+ |
| Revenue growth | YoY % |
| Sector | Multi-select |
| Beta | 0.5 to 2.0 |
| Price | $1 to $1000+ |

Results exportable to watchlist.

## 13.3 Earnings Report Experience

```
Day before: "FXAP reports earnings tomorrow after close."
Day of:     Trading volume elevated warning
Release:    Beat/miss headline + price reaction
Next day:   "Gap up 6.2% on earnings beat"
```

Player can read simplified income statement and guidance.

## 13.4 Analyst Ratings

| Rating | Meaning | Player Tooltip |
|---|---|---|
| Strong Buy | High conviction bullish | "Analyst expects significant upside" |
| Buy | Bullish | — |
| Hold | Neutral | — |
| Sell | Bearish | — |
| Strong Sell | High conviction bearish | — |

Consensus displayed as distribution bar—not a recommendation to follow blindly.

## 13.5 News Integration

News Engine feeds filtered by:

- Portfolio holdings
- Watchlist
- Sector
- Macro events

Sentiment tag: Bullish / Neutral / Bearish (algorithmic, may be wrong—teaches skepticism).

## 13.6 Economic Briefing Link

Macro dashboard shows:

| Indicator | Current | Trend |
|---|---|---|
| Policy rate | 4.25% | ↑ |
| Inflation | 3.1% | ↓ |
| Unemployment | 4.8% | ↑ |
| FNX-500 YTD | +8.2% | — |
| Yield curve | Inverted | ⚠ |

"How this affects your portfolio" personalized paragraph.

---

# 14. Risk Tolerance System

## 14.1 Purpose

Risk tolerance drives **default portfolio suggestions, warnings, and retirement glide paths**—not hard gates (player can always override with acknowledgment).

## 14.2 Assessment Questionnaire (v1)

10 questions covering:

| Dimension | Example Question |
|---|---|
| Time horizon | "When will you need this money?" |
| Loss reaction | "Portfolio drops 20%—you:" |
| Experience | "Years investing?" |
| Income stability | "Job security level?" |
| Goals | "Primary objective?" |

## 14.3 Risk Profiles

| Profile | Equity % | Bond % | Cash % | Label |
|---|---|---|---|---|
| Conservative | 30 | 50 | 20 | Capital preservation |
| Moderate | 60 | 30 | 10 | Balanced growth |
| Aggressive | 85 | 10 | 5 | Maximum growth |
| Speculative | 95+ | 0 | 5 | High risk (requires ack) |

## 14.4 Portfolio Risk Score

Displayed as 1–10 gauge computed from:

```
riskScore = f(beta, concentration, volatility, leverage, assetClass)
```

| Score | Label | Action |
|---|---|---|
| 1–3 | Low | Standard monitoring |
| 4–6 | Moderate | — |
| 7–8 | High | Quarterly review prompt |
| 9–10 | Very High | Warning banner + education link |

## 14.5 Mismatch Warnings

```
"Your portfolio risk (8.2) exceeds your stated tolerance (Moderate).
Consider reducing tech concentration from 45% to 25%."
```

Player: [Acknowledge] [View Suggestions] [Retake Assessment]

## 14.6 Life Event Triggers

| Event | Suggested Review |
|---|---|
| Marriage | Joint goals |
| Child birth | College fund allocation |
| Job loss | Reduce risk temporarily |
| Inheritance | Lump sum deployment plan |
| Age 50 | Catch-up contributions |
| Age 60 | Pre-retirement glide |

---

# 15. Retirement Accounts

## 15.1 Account Types (US-Analog v1)

| Account | ID | Tax Treatment | Contribution Limit (annual) |
|---|---|---|---|
| 401(k) | `ret_401k` | Pre-tax | $23,000 (+ catch-up 50+) |
| Roth 401(k) | `ret_roth_401k` | After-tax, tax-free growth | $23,000 |
| Traditional IRA | `ret_ira` | Pre-tax | $7,000 |
| Roth IRA | `ret_roth_ira` | After-tax | $7,000 (income limits) |
| SEP IRA | `ret_sep` | Self-employed | 25% of income |
| HSA (investment) | `ret_hsa` | Triple tax advantage | $4,150 individual |

Limits indexed to Economy inflation per government policy.

## 15.2 Employer 401(k) Flow

```
Career Engine: employer offers plan
    │
    ├─► Enrollment wizard at hire / open enrollment
    │
    ├─► Select contribution % (1–100% up to limit)
    │
    ├─► Choose investments (target date funds default)
    │
    ├─► Employer match (e.g., 50% up to 6%)
    │
    └─► Payroll deduction auto-invests each pay period
```

## 15.3 Employer Match Education

```
"You contribute 6% ($300/paycheck).
Employer matches 50% of first 6% = $150 free money.
Not contributing 6% leaves $150/paycheck on the table."
```

## 15.4 Target Date Funds

| Fund | Glide Path |
|---|---|
| FNX Target 2040 | 90% equity → 50% at 2040 |
| FNX Target 2050 | 92% equity → 50% at 2050 |
| FNX Target 2060 | 95% equity → 50% at 2060 |

Auto-rebalancing within fund—ideal for passive investors.

## 15.5 Early Withdrawal Penalties

| Account | Penalty | Exceptions |
|---|---|---|
| 401(k) pre-59½ | 10% + income tax | Hardship, SEPP |
| Traditional IRA | 10% + tax | First home, education |
| Roth IRA contributions | Tax-free anytime | — |
| Roth earnings | 10% if < 5 years and < 59½ | — |

Penalty calculator in withdrawal flow.

## 15.6 Required Minimum Distributions (RMD)

At age 73 (configurable):

```
"You must withdraw $X this year or face 25% penalty."
```

Auto-calculation from account balance and IRS table analog.

## 15.7 Retirement Dashboard

| Metric | Display |
|---|---|
| Total retirement balance | All accounts sum |
| Projected monthly income | 4% rule estimate (disclosed assumption) |
| Contribution YTD | vs limit progress bar |
| Employer match YTD | "Free money" total |
| Asset allocation | Pie chart |
| Years to retirement | Countdown |

---

# 16. Margin & Advanced Products

## 16.1 Margin Account (v1 Optional Unlock)

| Requirement | Detail |
|---|---|
| Min account value | $25,000 |
| Experience | Risk assessment + margin agreement |
| Interest rate | Prime + 2–4% |

## 16.2 Buying Power

```
cashBuyingPower = investmentCash
marginBuyingPower = cash + (eligibleSecurities × marginRate) − marginLoan
```

Typical margin rate: 50% initial, 25% maintenance.

## 16.3 Margin Call Flow

```
Portfolio value drops below maintenance requirement
    │
    ├─► Day 1: Margin call notification
    │       "Deposit $5,200 or sell positions by 4 PM tomorrow"
    │
    ├─► Day 2: Restricted to closing transactions only
    │
    └─► Day 3: Forced liquidation of positions (worst tax lots first)
```

## 16.4 Margin Interest

Accrues daily, charged monthly. Displayed on statement with APR.

## 16.5 v2 Advanced Products (Out of Scope v1)

| Product | Note |
|---|---|
| Options | Covered calls first |
| Futures | Institutional only |
| Structured products | Bank partnership |
| Crypto ETP | If approved by governance |

---

# 17. Living World Markets

## 17.1 Market Hours

| Session | Hours (Sim) |
|---|---|
| Pre-market | 7:00–9:30 |
| Regular | 9:30–16:00 |
| After-hours | 16:00–20:00 |

Orders queue outside hours; fills at next open (limit) or opening price (market).

## 17.2 Offline Price Movement

While player away:

- Holdings marked to market daily
- Dividends deposit on payment dates
- Limit orders may fill
- Margin calls may trigger
- IPO allocations may arrive

## 17.3 NPC Market Participants

| Actor | Behavior |
|---|---|
| Index funds | Passive flow, stabilizing |
| Pension funds | Long horizon, rebalancing |
| Hedge funds | Volatility in small caps |
| Retail NPCs | Sentiment-driven (Media) |
| Company buybacks | Support price (Company Engine) |

Player is < 0.01% of market—cannot manipulate FNX-500 alone.

## 17.4 Market Crashes

Triggered by Economy Engine `economy.market_crash`:

| Phase | Player Experience |
|---|---|
| Initial drop | Red portfolio, news flood |
| Volatility | Circuit breakers (trading halts) |
| Recovery | Months to years |
| Opportunity | Contrarian NPC narratives |

No player immunity. Panic-sell is a choice with consequences.

---

# 18. Integration Contracts

## 18.1 Economy Engine (18)

| Input | Use |
|---|---|
| `FNX-500` level | Benchmark, ETF tracking |
| Sector returns | Stock price components |
| `policyRate` | Bond yields, discount rates |
| `cyclePhase` | Risk appetite NPC flows |
| `economy.market_crash` | Crash handling |

## 18.2 Banking Engine (11)

| Integration | Detail |
|---|---|
| Investment cash account | Settlement |
| Margin loan | Liability |
| Dividend deposit | Credit transaction |
| Wire to checking | Withdrawal |

## 18.3 Company Engine (19)

| Integration | Detail |
|---|---|
| `company.ipo_completed` | New listing |
| `company.earnings_reported` | Price reaction |
| `company.bankrupt` | Delisting |
| Buyback programs | Demand support |

## 18.4 Tax Engine (13)

| Integration | Detail |
|---|---|
| Capital gains | Realized on sale |
| Dividend tax | Qualified vs ordinary |
| Wash sale | 30-day rule |
| Retirement tax | Withdrawal taxation |

## 18.5 News Engine (23)

| Integration | Detail |
|---|---|
| Earnings headlines | Research feed |
| Macro news | Economic briefing |
| Scandal | Price impact |

## 18.6 Event Bus

| Event | Direction |
|---|---|
| `investment.order_placed` | Publish |
| `investment.order_filled` | Publish |
| `investment.dividend_received` | Publish |
| `investment.margin_call` | Publish |
| `economy.rate_changed` | Consume |
| `company.ipo_completed` | Consume |
| `banking.account_frozen` | Consume |

---

# 19. Player Decision Flows

## 19.1 Active vs Passive Investing

```
                    ┌─────────────────┐
                    │ Time & interest │
                    │ in markets?     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌────────────────┐           ┌────────────────┐
     │ Low time       │           │ High interest  │
     │ Passive path   │           │ Active path    │
     └───────┬────────┘           └───────┬────────┘
             │                            │
             ▼                            ▼
     ┌────────────────┐           ┌────────────────┐
     │ Target date /  │           │ Research stocks│
     │ index fund DCA │           │ Sector bets    │
     └────────────────┘           └────────────────┘
```

## 19.2 Sell or Hold After Crash

| Factor | Hold Signal | Sell Signal |
|---|---|---|
| Time horizon | 10+ years | < 3 years needed |
| Fundamentals | Company intact | Bankruptcy likely |
| Allocation | Still diversified | Concentrated bet failed |
| Cash need | Emergency fund separate | Need liquidity now |
| Tax | Large unrealized gain | Harvest loss |

Decision assistant presents checklist—not advice.

## 19.3 IPO Participate or Wait?

| Participate | Wait for trading |
|---|---|
| Believe in long-term story | Prefer known price |
| Accept lockup | Want liquidity |
| Can afford loss | Risk-averse |

## 19.4 Retirement Contribution Optimization

```
1. Contribute to 401(k) up to employer match (free money)
2. Pay high-interest debt (> 8%)
3. Max HSA if eligible (triple tax advantage)
4. Max IRA (Roth if young/low tax bracket)
5. Max remaining 401(k)
6. Taxable brokerage for additional savings
```

Displayed as ordered checklist in retirement hub.

---

# 20. Events & Notifications

## 20.1 Priority Levels

| Priority | Examples |
|---|---|
| Critical | Margin call, delisting warning |
| High | Earnings today, IPO allocation |
| Medium | Dividend payment, order filled |
| Low | Watchlist price alert, analyst upgrade |

## 20.2 Milestone Celebrations

| Milestone | Recognition |
|---|---|
| First investment | Tutorial completion |
| $100K portfolio | Optional share card |
| First dividend | "Passive income started" |
| 10-year hold | Loyalty badge |
| Beat FNX-500 5 years | Investor achievement |

---

# 21. Accessibility & Financial Literacy

## 21.1 Plain Language

| Term | Plain |
|---|---|
| P/E ratio | Price compared to earnings |
| Beta | How much stock moves vs market |
| Dividend yield | Yearly income % from dividends |
| Cost basis | What you paid |
| Unrealized gain | Paper profit (not sold yet) |

## 21.2 Color Accessibility

Gains not green-only; losses not red-only. Icons + labels on all direction indicators.

## 21.3 Simulation Disclaimer

In-world footer: "Fenix Life markets are simulated for education. Not financial advice."

---

# 22. v1 Scope & Future Expansion

## 22.1 v1 In Scope

| Feature | Status |
|---|---|
| Stocks, ETFs, index funds, bonds | ✅ |
| Market/limit/stop orders | ✅ |
| Portfolio dashboard + chart | ✅ |
| Dividends + DRIP | ✅ |
| IPO subscription | ✅ |
| Research screener + earnings | ✅ |
| Risk tolerance assessment | ✅ |
| 401(k), IRA, Roth analogs | ✅ |
| Margin (unlockable) | ✅ |

## 22.2 v1 Out of Scope

| Feature | Target |
|---|---|
| Options trading | v2 |
| Fractional shares | v1.5 |
| International exchanges | Expansion |
| Investment clubs (multiplayer) | v2 |
| Robo-advisor NPC | v1.5 |
| ESG scoring | v2 |

---

# 23. Acceptance Criteria

## 23.1 Trading

| ID | Criterion | Test |
|---|---|---|
| AC-I01 | Player can buy stock with sufficient buying power | Market order E2E |
| AC-I02 | Limit order fills when price reached | Price injection |
| AC-I03 | Insufficient funds blocks order with message | Negative test |
| AC-I04 | Halted symbol rejects new buys | Halt injection |

## 23.2 Portfolio

| ID | Criterion | Test |
|---|---|---|
| AC-I05 | Portfolio value = Σ holdings + cash | Reconciliation |
| AC-I06 | Cost basis tracks per-lot | Multi-buy test |
| AC-I07 | Sector allocation chart matches holdings | Visual audit |
| AC-I08 | Day change calculates from prior close | Market open test |

## 23.3 Dividends & Actions

| ID | Criterion | Test |
|---|---|---|
| AC-I09 | Cash dividend credits investment account | Dividend event |
| AC-I10 | DRIP purchases fractional shares (v1.5) or rounds | DRIP test |
| AC-I11 | Stock split adjusts shares and cost basis | Split event |

## 23.4 IPO

| ID | Criterion | Test |
|---|---|---|
| AC-I12 | Player can indicate interest in open IPO | Subscription flow |
| AC-I13 | Oversubscription pro-rata allocation | Demand test |
| AC-I14 | Lockup prevents sale until expiry | Sell rejection |

## 23.5 Retirement

| ID | Criterion | Test |
|---|---|---|
| AC-I15 | 401(k) payroll deduction invests per election | Career integration |
| AC-I16 | Employer match credits correctly | Match formula test |
| AC-I17 | Early withdrawal shows penalty estimate | Withdrawal flow |

## 23.6 Risk & Research

| ID | Criterion | Test |
|---|---|---|
| AC-I18 | Risk score updates when allocation changes | Rebalance test |
| AC-I19 | Screener filters return correct subset | Filter matrix |
| AC-I20 | Earnings beat/miss moves price per rules | Earnings injection |

## 23.7 Integration & Parity

| ID | Criterion | Test |
|---|---|---|
| AC-I21 | `economy.market_crash` reduces portfolio value | Crash sim |
| AC-I22 | AI citizens face same market prices | Parity test |
| AC-I23 | Capital gains event sent to Tax Engine on sale | Tax integration |
| AC-I24 | Margin call fires at maintenance breach | Margin sim |

---

# 24. QA Scenarios

## 24.1 Passive Investor Path

1. Enroll in employer 401(k) at 6% with match
2. Select FNX Target 2050 fund
3. Play 5 sim-years without trading
4. Verify balance grew with contributions + market
5. Compare to FNX-500 benchmark

## 24.2 Active Trader Path

1. Research tech sector via screener
2. Buy 3 stocks + 1 ETF
3. Set stop-loss on speculative position
4. Stop triggers during correction
5. Harvest tax loss (v1.5)

## 24.3 IPO Path

1. Subscribe to IPO at max indication
2. Receive partial allocation
3. First day pop → unrealized gain
4. Attempt sell during lockup → blocked
5. Sell after lockup expires

## 24.4 Crash Survival

1. Economy crash −25%
2. Portfolio drops proportionally
3. Margin account receives call (if applicable)
4. Player holds 2 years through recovery
5. Verify no player-only bailout

## 24.5 Retirement Withdrawal

1. Age citizen to 73
2. RMD notification appears
3. Withdraw required amount
4. Tax withholding applied
5. Penalty if skipped

---

# 25. Glossary

| Term | Definition |
|---|---|
| Alpha | Return above benchmark |
| Beta | Volatility relative to market |
| Cost basis | Original purchase price for tax purposes |
| DRIP | Dividend Reinvestment Plan |
| ETF | Exchange-Traded Fund |
| Ex-dividend date | Cutoff to receive upcoming dividend |
| IPO | Initial Public Offering — first sale of stock to public |
| Limit order | Order to buy/sell at specified price or better |
| Market order | Order to execute immediately at current price |
| NAV | Net Asset Value — fund price per share |
| P/E ratio | Price-to-Earnings — price divided by earnings per share |
| Portfolio | Collection of investment holdings |
| RMD | Required Minimum Distribution from retirement accounts |
| Sector | Industry grouping (technology, healthcare, etc.) |
| Slippage | Difference between expected and actual fill price |
| Stop loss | Order to sell when price falls to trigger level |
| Yield | Income return from dividends or bond coupons |

---

## Document Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Lead Systems Designer | Initial canonical release |

---

*End of Document 12 — Investment & Markets Design*
