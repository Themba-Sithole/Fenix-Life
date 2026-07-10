# Fenix Life — Economy Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Economy Game Design Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Chief Economist  
**Audience:** Game Design, UX, Narrative, QA, Live Ops, Engineering (reference only)  

---

## Document Authority

This document defines **what the player experiences, decides, and sees** in Fenix Life's economy. It is a **domain game design spec**, not an engine implementation document.

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) | Economy philosophy, financial literacy as gameplay |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) | Five Capitals, Citizen Equality, Living World |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) (14) | Engine constellation, tick cadence |
| [18_Economy_Engine.md](./18_Economy_Engine.md) (18) | **Implementation authority** — formulas, macro vector, integration contracts |

**Hierarchy:** When player-facing design conflicts with engine capability, either (a) revise this document, or (b) extend Document 18 via RFC. When player-facing design conflicts with Citizen Equality, **the player must never receive hidden economic advantages** — UI clarity is permitted; simulation subsidies are not.

**What this document is:**

- Player-visible prices, indices, and economic signals
- Cost-of-living presentation and household budget UX
- Job market information architecture from the citizen's perspective
- Sector opportunity discovery and interpretation
- Economic news literacy — how headlines map to player decisions
- Strategic playbooks for booms, recessions, and transitions
- Acceptance criteria for economy-facing features

**What this document is not:**

- Macro formulas, CPI weights, or Okun's law coefficients (see Document 18)
- Banking ledger rules (see Document 11 when authored)
- Tax bracket definitions (see Document 13 when authored)
- Stock order matching (see Document 12 when authored)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy & Five Capitals Lens](#2-design-philosophy--five-capitals-lens)
3. [Player Economic Mental Model](#3-player-economic-mental-model)
4. [The Economic Surface — What Players See](#4-the-economic-surface--what-players-see)
5. [Prices & Inflation — Felt in the UI](#5-prices--inflation--felt-in-the-ui)
6. [Cost of Living & Household Budget](#6-cost-of-living--household-budget)
7. [Labor Market — Player View](#7-labor-market--player-view)
8. [Wages, Raises & Real Income](#8-wages-raises--real-income)
9. [Interest Rates & Credit Environment](#9-interest-rates--credit-environment)
10. [Sector Opportunities & Industry Health](#10-sector-opportunities--industry-health)
11. [Regional & City Economies](#11-regional--city-economies)
12. [Economic News — Reading & Acting](#12-economic-news--reading--acting)
13. [Business Cycle Phases — Player Experience](#13-business-cycle-phases--player-experience)
14. [Boom Strategies — Player Playbook](#14-boom-strategies--player-playbook)
15. [Recession Strategies — Player Playbook](#15-recession-strategies--player-playbook)
16. [Inflation & Stagflation Strategies](#16-inflation--stagflation-strategies)
17. [Consumer Confidence & Sentiment](#17-consumer-confidence--sentiment)
18. [Energy, Fuel & Cost Shocks](#18-energy-fuel--cost-shocks)
19. [Housing Market Signals (Economy Lens)](#19-housing-market-signals-economy-lens)
20. [International Trade & Import Prices](#20-international-trade--import-prices)
21. [Player Flows & Decision Gates](#21-player-flows--decision-gates)
22. [UI Screens & Information Architecture](#22-ui-screens--information-architecture)
23. [Notifications & Alerts](#23-notifications--alerts)
24. [Onboarding & Economic Literacy](#24-onboarding--economic-literacy)
25. [Difficulty & Starting Conditions](#25-difficulty--starting-conditions)
26. [Multiplayer & Fenix Network Economy Touches](#26-multiplayer--fenix-network-economy-touches)
27. [Accessibility & Clarity Standards](#27-accessibility--clarity-standards)
28. [Acceptance Criteria](#28-acceptance-criteria)
29. [Edge Cases & Failure States](#29-edge-cases--failure-states)
30. [Traceability Matrix](#30-traceability-matrix)
31. [Governance & Changelog](#31-governance--changelog)

---

# 1. Executive Summary

The Fenix Life economy is not a background number generator. It is the **terrain on which every life decision is made** — whether the player is a barista saving for school, a VP negotiating a relocation package, or a founder watching sector demand collapse during a rate hike.

Players experience the economy through **diegetic professional interfaces**: bank portals show real purchasing power erosion; job boards reflect hiring freezes; news feeds explain *why* rent jumped; company dashboards forecast revenue against sector health. The design goal is **clarity at the surface, depth beneath** — three numbers to decide, with drill-down for mastery.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLAYER ECONOMY EXPERIENCE — LAYER MAP                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DAILY TOUCHPOINTS          WEEKLY/MONTHLY              STRATEGIC (YEARS)    │
│  ─────────────────          ──────────────              ─────────────────    │
│  Grocery prices             Paycheck vs COL index       Career sector bets   │
│  Gas station sign           Job market heat map         Business timing      │
│  Rent renewal notice        Economic news digest        Asset allocation     │
│  Loan rate quote            Sector opportunity cards    Generational wealth  │
│                                                                              │
│         ▲                           ▲                           ▲            │
│         └───────────────────────────┴───────────────────────────┘            │
│                         All fed by Economy Engine (Doc 18)                  │
│                         Player sees indices; engine computes physics         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core player promises:**

| Promise | Player Experience |
|---|---|
| **Honest money** | Cash loses value during inflation; debt behaves realistically |
| **Traceable cause** | Headlines link to prior policy, earnings, or shocks |
| **Equal rules** | NPC competitors face same credit tightening |
| **Teachable failure** | Bankruptcy and squeeze explain *what macro variable hurt* |
| **Strategic depth** | Boom/recession playbooks reward preparation, not luck |

---

# 2. Design Philosophy & Five Capitals Lens

## 2.1 Constitutional Alignment

Per Document 01, Financial Capital must be **honest**. This design document ensures the **player interface never lies** about economic reality:

- Nominal balances and real purchasing power are **both shown** where decisions depend on them
- Inflation is felt in recurring expenses before it appears in net worth charts
- The player never receives a hidden "+10% income" during recessions

## 2.2 Five Capitals Economic Touchpoints

| Capital | Primary Economy UX | Secondary Touchpoints |
|---|---|---|
| **Financial** | Banking dashboard, COL tracker, loan rates | Investment returns, business cash flow |
| **Human** | Job market difficulty, wage growth vs skills | Education ROI signals, unemployment duration |
| **Social** | Consumer confidence mood, community cost index | Charity affordability, lifestyle peer pressure |
| **Business** | Sector demand cards, hiring cost index | Competitor news, supplier price alerts |
| **Legacy** | Generational wealth erosion/preservation charts | Inheritance timing vs cycle phase |

Every economy-facing screen must declare which capital(s) it primarily serves (per Document 34 UX chips).

## 2.3 Product Bible Alignment

From Document 00 §11:

> *The economy is a closed-but-open system: money is conserved with intentional sinks and sources, markets express belief about the future, and policy reshapes incentives.*

**Player translation:**

| Bible Principle | Player-Facing Expression |
|---|---|
| No magic money | Windfalls always have source labels (inheritance, grant, sale) |
| Financial literacy as gameplay | Tooltips explain APR impact using *player's* numbers |
| Regional economies | City comparison cards on relocation decisions |
| Market manipulation safeguards | Order book depth warnings on illiquid stocks |

## 2.4 Living World Principle

While the player sleeps or fast-forwards:

- Rent indices update; lease renewals queue as notifications
- Job postings expire; new ones appear from NPC hiring
- Central bank analog announces rate decisions in news feed
- Sector cards change color (expansion → peak → contraction)

The player returns to a **changed economic landscape**, not a frozen menu.

## 2.5 Design Review Questions

Before shipping any economy-facing feature, design must answer:

1. What **three numbers** does the player need to decide?
2. Can the player **trace** this change to a prior cause within 2 UI taps?
3. Does this feature teach a **real-world concept** without a lecture?
4. Would an AI citizen facing the same situation see the **same prices and rates**?

---

# 3. Player Economic Mental Model

## 3.1 Target Competence Curve

| Life Stage | Expected Player Understanding | Supported By |
|---|---|---|
| **18–22** | Prices vary; paycheck covers bills or not | Budget bar, first job COL comparison |
| **23–30** | Inflation erodes savings; credit costs matter | Real wage chart, loan calculator |
| **31–45** | Cycles affect career and business timing | Sector cards, recession playbook unlock |
| **46–60** | Portfolio and property hedge inflation | Asset class correlation hints |
| **60+** | Fixed income vs rising healthcare costs | Retirement stress test UI |

## 3.2 Concepts Players Should Internalize

| Concept | How the Game Teaches It |
|---|---|
| **Nominal vs real** | Dual display on savings goal progress |
| **Opportunity cost** | "If you buy this car, runway drops 4 months" |
| **Leverage** | Mortgage amplifies both gain and foreclosure risk |
| **Counter-cyclical thinking** | News archive shows past recovery timelines |
| **Sector rotation** | Industry health timeline on career pivot screen |
| **Sticky wages** | Raise lag indicator after inflation spike |

## 3.3 Anti-Patterns (Forbidden UX)

| Anti-Pattern | Why Forbidden |
|---|---|
| Single "Economy Score" replacing indices | Hides teachable causality |
| Random ±5% price jitter | Breaks trust; not traceable |
| Player-only recession immunity | Violates Citizen Equality |
| Pop-up lectures before every purchase | Violates "systems teach by feedback" |
| Hiding unemployment rate during job search | Obscures legitimate difficulty |

---

# 4. The Economic Surface — What Players See

## 4.1 Global Economic Indicators (Always Available)

Accessible from **Home Screen → Economy Pulse** widget and **News Feed → Economy tab**.

| Indicator | Display Format | Update Cadence | Player Use |
|---|---|---|---|
| **CPI (YoY)** | `+3.2%` with 12-month sparkline | Monthly | Inflation expectations |
| **Policy Rate** | `4.75%` with last change arrow | On central bank decision | Loan/mortgage planning |
| **Unemployment** | `5.8%` national + regional | Monthly | Job search difficulty |
| **GDP Growth** | `+1.4% annualized` | Quarterly | Cycle phase context |
| **Consumer Confidence** | Index `98` (baseline 100) | Monthly | Discretionary spending mood |
| **Housing Index** | Regional composite | Monthly | Rent/buy decisions |
| **Fuel Price** | Per litre/gallon at stations | Weekly | Commute & logistics costs |

## 4.2 Cycle Phase Badge

Players see a **plain-language cycle label**, not internal engine state names:

| Engine Phase | Player Label | Color | Typical News Tone |
|---|---|---|---|
| Recovery | "Rebuilding" | Teal | Cautious optimism |
| Expansion | "Growing" | Green | Hiring, IPO headlines |
| Peak | "Overheating" | Amber | Rate hike warnings |
| Contraction | "Slowdown" | Orange | Layoffs, profit warnings |
| Recession | "Recession" | Red | Policy debate, defaults |
| Trough | "Bottoming" | Purple | Bargain hunting narratives |

Badge appears on: Home Screen, Job Board header, Company Dashboard (if owner), Banking overview.

## 4.3 Personal Economic Dashboard

**Route:** `/banking` → **My Economy** tab (alongside Accounts, Transactions, Loans)

| Section | Contents |
|---|---|
| **Purchasing Power** | Real net worth vs 1/5/10 years ago (inflation-adjusted toggle) |
| **Income vs Expenses** | Monthly waterfall; fixed vs discretionary split |
| **COL Index** | Player's city vs national average (100 = average) |
| **Debt Burden** | DTI ratio with stress-test at +1% rate shock |
| **Runway** | Months of expenses covered by liquid assets |
| **Economic Exposure** | Pie: employment sector, investments, property, business |

## 4.4 Price Surfaces by Domain

| Domain | Where Prices Appear | Index Used |
|---|---|---|
| Groceries | Shopping UI, receipt line items | Food CPI component |
| Rent | Lease renewal notice, listings | Housing rent index |
| Tuition | Education screen | Education CPI |
| Vehicles | Dealership stickers | Transportation + import |
| Healthcare | Clinic bills, insurance premiums | Healthcare index |
| Utilities | Monthly bill notification | Energy + services |
| Business inputs | Company ops supplier quotes | Sector PPI |

---

# 5. Prices & Inflation — Felt in the UI

## 5.1 Design Intent

Inflation must be **felt before it is studied**. Players who ignore macro news still notice grocery totals creeping up and rent renewal quotes exceeding last year's payment.

## 5.2 Nominal vs Real Display Rules

| Context | Nominal | Real (Inflation-Adjusted) |
|---|---|---|
| Bank balance | Primary | Toggle in charts |
| Salary offer | Primary | Secondary: "≈ $X in today's dollars vs median" |
| Historical net worth chart | Toggle default OFF | Tooltip recommends ON for 5+ year view |
| Savings goal | Both: "$50K target ($46.2K real progress)" | Required |
| Rent comparison | Nominal monthly | COL-adjusted if comparing cities |

## 5.3 Inflation Feedback Channels

| Channel | Trigger | Player Message Example |
|---|---|---|
| **Receipt delta** | Category CPI +2% over 6 months | "Groceries: +$18/mo vs last year" |
| **Lease renewal** | Rent index adjustment | "Landlord proposes +6.2% — market avg +5.8%" |
| **Wage stagnation** | CPI > wage growth 3 months | "Your raise didn't keep pace with inflation" |
| **Savings goal slip** | Real progress negative | "Inflation pushed your goal 3 months further" |
| **News push** | CPI print release | "Inflation cooled to 3.1% — rate cuts speculated" |

## 5.4 Category-Level Inflation Table (Player Reference Card)

Unlocks after first lease renewal or age 21. Available in Economy Pulse → **Inflation Breakdown**.

| Category | Typical Weight in Budget | Player Feeling | Hedge Options (Hint) |
|---|---|---|---|
| Housing | 30–40% | Rent/mortgage renewals | Fixed-rate mortgage, property |
| Food | 12–15% | Weekly grocery total | Discount shopping, meal planning |
| Energy | 6–10% | Utility + fuel | Efficiency upgrades, remote work |
| Healthcare | 8–12% | Premiums, copays | Insurance plan choice, HSA analog |
| Transportation | 10–15% | Car payment, commute | Public transit, relocation |
| Education | 0–20% (life stage) | Tuition bills | Grants, in-state options |

## 5.5 Deflation (Rare) Player Experience

When annual inflation negative 3+ months:

| UI Change | Player Interpretation |
|---|---|
| "Prices falling" news tone | Mixed blessing — debt harder in real terms |
| Debt stress indicator ↑ | Fixed payments hurt when income may fall |
| Bargain labels on discretionary | Delayed purchase rewarded |
| Employment warning | Deflation often coincides with recession |

---

# 6. Cost of Living & Household Budget

## 6.1 COL Index Presentation

Each city/region displays a **Cost of Living Index** (baseline 100 = national average).

| City Tier | Example Index Range | Player Signal |
|---|---|---|
| Affordable metro | 85–95 | Green — savings easier |
| Average | 98–102 | Neutral |
| Expensive hub | 115–140 | Amber — salary must compensate |
| Superstar city | 145+ | Red — wealth display, not savings |

**COL Card fields:**

- Index score
- vs Player's current city (if browsing relocation)
- Top 3 drivers (housing, taxes, transport)
- Median rent (1BR, 2BR)
- Median salary for player's job title (if employed)

## 6.2 Household Budget UX

**Route:** `/banking` → **Budget** or Home Screen widget

```
┌──────────────────────────────────────────────────────────────┐
│ MONTHLY BUDGET — July 2026                    Status: TIGHT  │
├──────────────────────────────────────────────────────────────┤
│ Income (net)                              $4,850             │
│ Fixed expenses                            −$3,920            │
│   Rent          $1,650  │  Loans      $680  │  Insurance $210│
│ Discretionary cap                         $930               │
│ Savings target (15%)                      −$728  ⚠ SHORT $98 │
├──────────────────────────────────────────────────────────────┤
│ [Adjust targets]  [View COL breakdown]  [Stress test +1%]    │
└──────────────────────────────────────────────────────────────┘
```

## 6.3 Budget Status Bands

| Status | Condition | UI Treatment |
|---|---|---|
| **Healthy** | Savings target met; runway > 6 mo | Green badge |
| **Tight** | Savings short <10%; runway 3–6 mo | Amber badge |
| **Stressed** | Fixed > 95% income OR runway < 3 mo | Red badge + decision gate option |
| **Crisis** | Missed payment risk next 30 days | Blocking notification; relief options surfaced |

## 6.4 COL-Driven Life Decisions

| Decision | COL Data Shown |
|---|---|
| Accept job offer | Salary vs COL in target city; real disposable income |
| Relocate | Moving cost + new COL + break-even months |
| Go to university | Tuition + living cost vs in-state alternative |
| Start business | Operating cost index for sector + city |
| Retire | Fixed income vs projected COL + healthcare |

## 6.5 Lifestyle Inflation (Player Choice)

After promotion or windfall, optional **Lifestyle Review** gate:

| Option | Effect |
|---|---|
| **Maintain lifestyle** | Excess to savings; +Financial discipline satisfaction |
| **Upgrade modestly** | Small discretionary bump; social capital mild ↑ |
| **Upgrade significantly** | Lifestyle creep; harder to downshift later |
| **Invest windfall** | Skips lifestyle; business/investment unlock hints |

Not a blocking gate — player may dismiss. Reappears on windfalls > 3× monthly income.

---

# 7. Labor Market — Player View

## 7.1 Job Market Heat Map

**Route:** Smartphone → **Careers** app → **Market**

| Element | Description |
|---|---|
| **National gauge** | Hiring Ease Index 0–100 (100 = employer's market for workers) |
| **Sector rows** | 12 sectors with demand arrow (↑ → ↓) |
| **Regional filter** | Player city + comparables |
| **Unemployment overlay** | Color intensity on map |
| **Your profile fit** | Highlight sectors matching player skills |

**Hiring Ease Index formula (player-visible tooltip):**  
*"Combines unemployment, job openings, and wage growth in your area. Below 40 means fewer openings and more applicants per role."*

## 7.2 Job Board Presentation

| Field | Always Visible | Premium Detail (unlock via career level) |
|---|---|---|
| Title & company | ✓ | — |
| Salary range | ✓ | Percentile vs market |
| Location / remote | ✓ | Commute time estimate |
| Requirements | ✓ | Skill gap analysis |
| Posted date | ✓ | Applicant competition estimate |
| Company health | — | Sector demand, layoff news link |
| Growth potential | — | Promotion velocity at firm |

## 7.3 Application Competition Signals

| Applicants/Opening | Player Label | UX |
|---|---|---|
| < 5 | "Low competition" | Green |
| 5–20 | "Moderate" | Neutral |
| 20–50 | "Competitive" | Amber |
| 50+ | "Very competitive" | Red; suggests networking |

## 7.4 Unemployment Player Experience

See Document 07 for full career spec. Economy lens:

| Duration | UI Escalation |
|---|---|
| Week 1–2 | Job board emphasis; savings runway prominent |
| Week 3–8 | Benefits eligibility check (if jurisdiction has UI analog) |
| Week 9+ | "Extended search" tips; side hustle suggestions |
| 6+ months | Skill refresh prompts; relocation COL comparison |

## 7.5 Labor Market Notifications

| Event | Notification |
|---|---|
| Sector hiring surge | "Tech hiring +12% — your skills match 34 new roles" |
| Local layoffs | "3 firms in your sector announced cuts — competition may rise" |
| Wage index jump | "Market wages for [title] up 4% — consider renegotiation" |
| Minimum wage change | "New minimum wage effective Jan 1 — affects offers" |

---

# 8. Wages, Raises & Real Income

## 8.1 Paycheck Presentation

Each pay stub shows:

| Line | Purpose |
|---|---|
| Gross pay | Nominal |
| Taxes & deductions | Transparency |
| Net pay | Cash flow |
| YTD vs last year | Nominal comparison |
| **Real wage trend** | Sparkline: net pay / COL index |

## 8.2 Raise Negotiation Economic Context

When player initiates raise request or receives offer:

| Data Panel | Source |
|---|---|
| Market wage band for role | Labor market index |
| Company financial health | Public filings or inferred |
| Sector wage growth | Economy sector table |
| Inflation since last raise | CPI delta |
| **Suggested range** | Advisory only — not guaranteed |

## 8.3 Wage Stickiness (Player Education)

After inflation spike, UI may show **Raise Lag** indicator:

> *"Prices rose 4.2% since your last raise. Your purchasing power fell 1.8%."*

This is not a bug — it teaches sticky wages. Player responses: negotiate, switch jobs, side income, cut expenses.

## 8.4 Multiple Income Streams View

**Route:** Banking → Income tab

| Stream | Type Badge | Cycle Sensitivity |
|---|---|---|
| Primary employment | W2 analog | Sector demand |
| Secondary job | W2 | Gig economy index |
| Side hustle | 1099 analog | Consumer confidence |
| Business draw | Owner compensation | Company + sector |
| Investments | Passive | Market cycle |
| Rental | Passive | Housing index |

---

# 9. Interest Rates & Credit Environment

## 9.1 Rate Environment Badge

| Environment | Policy Rate Trend | Player Label | Credit UX |
|---|---|---|---|
| Accommodative | Falling/stable low | "Cheap money" | Pre-approval offers ↑ |
| Neutral | Stable mid | "Normal" | Standard underwriting |
| Tightening | Rising | "Rates rising" | ARM warnings, refi urgency |
| Restrictive | High/stable high | "Expensive money" | Fewer approvals, higher APR |

## 9.2 Player-Facing Rate Types

| Rate | Where Shown | Decision Impact |
|---|---|---|
| **Policy rate** | News, Economy Pulse | Macro context |
| **Prime rate** | Loan offers | Variable loan pricing |
| **Mortgage 30Y** | Real estate, banking | Home purchase |
| **Savings APY** | Banking products | Emergency fund incentive |
| **Credit card APR** | Card statements | Revolving debt cost |
| **Business line rate** | Company finance | Runway & expansion |

## 9.3 Rate Change Player Flow

```
News: "Central bank raises rates 0.25%"
    → Notification with personal impact summary
    → "Your variable loan payment may increase ~$42/mo"
    → Actions: [View loans] [Consider refi] [Dismiss]
```

## 9.4 Credit Cycle Player Experience

| Phase | Player Feeling | Opportunities | Risks |
|---|---|---|---|
| Easy credit | Approvals fast; low APR | Leverage, expand business | Over-extension |
| Tight credit | Denials; covenants | Distressed asset buys | Refi failures, layoffs |

---

# 10. Sector Opportunities & Industry Health

## 10.1 Sector Opportunity Cards

**Route:** Economy Pulse → **Sectors** or Company founding wizard

Each of 12 core sectors displays:

| Field | Example |
|---|---|
| Sector name | Technology |
| Demand index | 1.24 (24% above baseline) |
| Trend | ↑ Expanding (18 months) |
| Employment growth | +3.2% YoY |
| Avg margin proxy | High |
| Risk flag | None / "Regulatory review" |
| **Player actions** | [Find jobs] [Start company] [Invest in ETF] |

## 10.2 Sector List (Player-Facing)

| Sector | Player Examples | Boom Indicator | Bust Indicator |
|---|---|---|---|
| Technology | Software, hardware, IT services | VC funding news, hiring surge | Layoffs, rate sensitivity |
| Healthcare | Hospitals, pharma, clinics | Aging population, policy | Reimbursement cuts |
| Finance | Banks, insurance, fintech | Credit expansion | Defaults, regulation |
| Real Estate | Development, REITs, brokerage | Low rates, migration | Rate hikes, oversupply |
| Energy | Oil, renewables, utilities | Fuel price spike | Transition policy |
| Consumer Discretionary | Retail, restaurants, travel | Confidence high | Recession pullback |
| Consumer Staples | Grocery, household | Defensive strength | Margin squeeze |
| Industrials | Manufacturing, logistics | Infrastructure spend | Order backlog drop |
| Materials | Mining, chemicals | Construction boom | Demand collapse |
| Communications | Media, telecom | Ad spend up | Cord-cutting, disruption |
| Education | Schools, edtech | Enrollment growth | Funding cuts |
| Government/Public | Public sector jobs | Stimulus | Austerity |

## 10.3 Sector Timing for Life Decisions

| Decision | Sector Card Use |
|---|---|
| Choose major | 5-year demand forecast |
| Accept job offer | Employer's sector trend |
| Found company | Demand index + competition density |
| Invest | Sector ETF correlation to cycle |
| Career pivot | Reskilling ROI by sector growth |

## 10.4 Sector News Integration

Sector cards link to filtered news feed:

> *"Technology sector: 12 articles this week — NovaTech IPO, chip shortage easing"*

---

# 11. Regional & City Economies

## 11.1 Multi-City Economic Comparison

**Route:** City Map → Select city → **Economy** tab

| Metric | City A | City B | National |
|---|---|---|---|
| COL Index | 132 | 89 | 100 |
| Unemployment | 3.8% | 6.2% | 5.1% |
| Housing Index | 145 | 78 | 100 |
| Dominant sectors | Tech, Finance | Manufacturing | — |
| Migration trend | Inflow | Outflow | — |
| Tax burden | High | Moderate | — |

## 11.2 Relocation Economic Gate

When player considers move for job or lifestyle:

| Step | Player Sees |
|---|---|
| 1. Offer salary | Nominal |
| 2. COL adjustment | Real disposable income delta |
| 3. Housing cost | Rent/buy comparison |
| 4. Spouse job market | If applicable |
| 5. Break-even timeline | Months until move pays off |
| 6. Confirm / negotiate / decline | Actions |

## 11.3 District-Level Variation (Within City)

City map districts show micro-indices:

| District Type | Typical Signal |
|---|---|
| Financial core | High COL, high wages |
| Industrial | Lower COL, sector jobs |
| University | Education economy, rental demand |
| Suburban | Housing-led, commute trade-off |

---

# 12. Economic News — Reading & Acting

## 12.1 News as Decision Input

Per Document 00 Living World philosophy, headlines are **reports of simulation**, not random events. Players learn to read news as actionable intelligence.

## 12.2 Headline Categories (Economy Tab)

| Category | Icon | Player Action Path |
|---|---|---|
| **Monetary Policy** | 🏛 | Loans, savings, mortgage |
| **Labor** | 👔 | Job board, negotiation |
| **Sector** | 📊 | Career, company, investments |
| **Housing** | 🏠 | Real estate, rent |
| **Trade** | 🌐 | Import prices, business costs |
| **Fiscal** | 📋 | Tax planning, contracts |
| **Shock** | ⚡ | Risk review, diversification |

## 12.3 Headline → Action Mapping Table

| Example Headline | Underlying Cause (Investigation Link) | Suggested Player Actions |
|---|---|---|
| "Central bank holds rates steady" | Inflation near target | Lock refi decisions; status quo |
| "Tech layoffs accelerate" | Sector demand −15%; rates up | Avoid leverage; update resume |
| "Housing starts plunge" | Rates + oversupply | Renters wait; builders cautious |
| "Fuel prices spike 20%" | Supply shock | Reduce commute; logistics costs ↑ |
| "Unemployment falls to 3.5%" | Expansion peak | Negotiate raise; watch overheating |
| "Deflation fears grow" | Trough phase | Preserve cash; debt caution |
| "Stimulus package passed" | Fiscal expansion | Sector grants; consumer stocks |
| "Trade tariffs announced" | Import price + | Supply chain review for business |

## 12.4 News Investigation UX

Tap headline → **Story** panel:

1. **What happened** — 2-sentence summary
2. **Why it matters to you** — Personalized impact (if applicable)
3. **Cause chain** — Collapsible timeline (optional depth)
4. **Related indicators** — Links to Economy Pulse metrics
5. **Actions** — Contextual buttons

## 12.5 Misinformation & Noise

Occasionally media sensationalizes. Player with high **Financial Literacy** skill (Human Capital) sees:

- "Sensational" badge on exaggerated headlines
- Calm data view alongside clickbait

This teaches media literacy without breaking immersion.

---

# 13. Business Cycle Phases — Player Experience

## 13.1 Phase Transition Player Narrative

| From → To | Typical Player Feeling | Dominant News |
|---|---|---|
| Trough → Recovery | Cautious hope | "Green shoots" |
| Recovery → Expansion | Opportunity | Hiring, IPOs |
| Expansion → Peak | FOMO, pressure | Asset bubbles, rate fears |
| Peak → Contraction | Anxiety | Earnings misses |
| Contraction → Recession | Fear, loss | Layoffs, defaults |
| Recession → Trough | Exhaustion | Bargains, policy response |

## 13.2 Phase Duration Expectations

Player-facing **Cycle Almanac** (unlock year 3 or after first recession):

| Phase | Typical Duration | Player Guidance |
|---|---|---|
| Expansion | 3–8 years | Build reserves near peak |
| Peak | 6–18 months | Reduce leverage |
| Recession | 6–24 months | Protect income, buy quality assets |
| Recovery | 1–3 years | Re-enter risk carefully |

*Note: Durations are emergent — almanac shows historical world data, not guarantees.*

## 13.3 Cycle Phase UI Treatments

| UI Element | Expansion | Recession |
|---|---|---|
| Economy Pulse background | Subtle green gradient | Subtle red gradient |
| Job board count | High | Reduced |
| Loan offers | Aggressive | Conservative |
| News tone mix | Optimistic bias | Cautious bias |
| NPC dialogue | "Market's hot" | "Tough times" |

---

# 14. Boom Strategies — Player Playbook

## 14.1 Expansion Phase Playbook

| Player Archetype | Recommended Actions | Risks to Avoid |
|---|---|---|
| **Employee** | Negotiate raise; build skills in hot sector | Lifestyle inflation |
| **Founder** | Scale hiring; secure growth capital | Over-hiring before peak |
| **Investor** | Equities, sector ETFs, real estate | Buying at peak euphoria |
| **Renter** | Lock long lease if rent-controlled analog | Waiting too long to buy if planning |
| **Homeowner** | Build equity; cautious HELOC use | Cash-out refi splurge |

## 14.2 Peak Phase Playbook

| Signal | Player Response |
|---|---|
| Rates rising fast | Fix variable debt; delay marginal purchases |
| Sector demand > 1.3 | Take profits; diversify |
| Media "can't lose" stories | Contrarian caution |
| Personal DTI > 40% | Deleverage immediately |
| Company runway < 12 mo | Cut burn before funding winter |

## 14.3 Overheating Warnings (Player Alerts)

System surfaces **Peak Risk** alerts when 3+ conditions met:

- Policy rate rose 1%+ in 12 months
- Sector demand index > 1.25 in player's industry
- Consumer confidence > 115
- Player leverage above personal threshold

Alert is advisory, not blocking.

---

# 15. Recession Strategies — Player Playbook

## 15.1 Contraction Phase Playbook

| Priority | Actions |
|---|---|
| **1. Income protection** | Job performance focus; network; side income |
| **2. Liquidity** | Build cash; avoid illiquid bets |
| **3. Fixed costs** | Renegotiate rent; cut discretionary |
| **4. Debt** | Avoid new variable debt; communicate with lenders |
| **5. Opportunity scan** | Watch distressed assets (later phase) |

## 15.2 Recession Phase Playbook

| Player Archetype | Survival | Opportunity |
|---|---|---|
| **Employee** | Skill proof; accept furlough vs quit carefully | Acquire skills cheap (courses on sale) |
| **Founder** | Cut burn; pivot if needed; bridge financing | Acquire weak competitors |
| **Investor** | Don't panic sell quality | Dollar-cost average |
| **Unemployed** | Benefits; broaden search; relocation | Retrain for counter-cyclical sectors |
| **Retiree** | Withdrawal rate cut; delay large expenses | Dividend stocks may dip |

## 15.3 Recession UI Support Features

| Feature | Purpose |
|---|---|
| **Runway calculator** | Prominent on Home Screen |
| **Bill priority advisor** | Which bills to pay first if short |
| **Relief programs** | Government grants, forbearance options |
| **Recovery timeline** | Historical world recessions for perspective |
| **Mental health hook** | Stress link to life stats (not preachy) |

## 15.4 Bankruptcy as Economic Outcome

If player enters bankruptcy:

| Requirement | Player Experience |
|---|---|
| Explanation screen | Which macro + personal factors combined |
| Consequence summary | Credit, reputation, asset loss |
| Recovery path | Timeline to rebuild credit |
| No shame loop | Framed as systemic + personal lesson |

---

# 16. Inflation & Stagflation Strategies

## 16.1 High Inflation (Non-Recession)

| Asset/Action | Typical Behavior | Player Hint |
|---|---|---|
| Cash | Loses real value | Move to I-bonds analog, TIPS |
| Fixed-rate debt | Real burden falls | Don't prepay aggressively |
| Variable debt | Payment shock | Refi to fixed if possible |
| Real estate | Often appreciates | Hedge but illiquid |
| Wages | Lag CPI | Job switch or negotiate |
| Staples stocks | Relative outperformance | Defensive tilt |

## 16.2 Stagflation (Inflation + Weak Growth)

Hardest scenario — UI shows **Stagflation Alert**:

| Challenge | Player Guidance |
|---|---|
| Rising costs + job risk | Dual focus: income + expense |
| Rates may stay high | Avoid variable debt |
| Sector rotation | Staples, energy historically defensive |
| Business | Pricing power matters — sector card flag |

---

# 17. Consumer Confidence & Sentiment

## 17.1 Confidence Index Player Use

| Index Level | Label | Discretionary Spending UI |
|---|---|---|
| 110+ | Euphoric | "Good time for major purchase?" prompts |
| 100–110 | Optimistic | Normal |
| 90–100 | Cautious | Side hustle ads reduced |
| < 90 | Fearful | Luxury categories show discounts |

## 17.2 Personal Sentiment vs National

Player's **Personal Economic Sentiment** (optional widget) combines:

- Job security
- Net worth trend
- Recent news exposure
- Stress stat

Divergence from national confidence teaches that macro ≠ micro.

---

# 18. Energy, Fuel & Cost Shocks

## 18.1 Fuel Price Display

| Location | Format |
|---|---|
| City map gas stations | Per unit price sign |
| Commute summary | Monthly fuel cost estimate |
| Business logistics | Shipping cost index (if owner) |

## 18.2 Shock Event Player Flow

```
Fuel +20% shock
  → News headline
  → Personal impact: "Commute +$34/mo"
  → Business impact: "Shipping costs +8%" (if applicable)
  → Actions: [Remote work request] [Efficiency upgrade] [Pass-through pricing]
```

---

# 19. Housing Market Signals (Economy Lens)

*Full housing gameplay in Document 10. Economy lens only.*

| Signal | Where Shown | Decision |
|---|---|---|
| Housing Index | Economy Pulse, Real Estate | Buy/sell timing |
| Mortgage rate | Banking, listings | Affordability |
| Rent index | Lease renewals | Renegotiate or move |
| Vacancy rate | City economy tab | Landlord vs tenant power |
| Building permits | News, city tab | Supply pipeline |

---

# 20. International Trade & Import Prices

## 20.1 Import Price Player Visibility

| UI | When Relevant |
|---|---|
| "Import costs rising" news | Tariff/shock events |
| Vehicle prices | Transportation purchases |
| Business supplier quotes | Manufacturing, retail |

## 20.2 FX (If Enabled in World)

| Element | Player Use |
|---|---|
| Exchange rate chart | Travel, import business |
| Currency risk badge | International contracts |

---

# 21. Player Flows & Decision Gates

## 21.1 Flow: First Paycheck → Budget Setup

```
Receive first job paycheck
  → Notification: "Set up your budget"
  → Guided flow: income, rent, essentials
  → Show COL index for city
  → Set savings target (slider, default 10%)
  → Confirm → Home Screen budget widget live
```

## 21.2 Flow: Lease Renewal During Inflation

```
30 days before lease end
  → Notification with proposed rent
  → Compare: old rent, proposed, market avg
  → Options: Accept | Negotiate | Search listings
  → Negotiate mini-game (Document 07 social skills)
  → Outcome updates budget projection
```

## 21.3 Flow: Recession Enters

```
Cycle phase → Recession
  → News banner (once)
  → Home Screen: Economy Pulse turns red
  → Optional gate: "Review your financial plan"
  → Checklist: runway, debt, job security, expenses
  → Player dismisses or completes
```

## 21.4 Flow: Sector Opportunity Alert

```
Player skill matches booming sector
  → Notification: "Healthcare hiring surge"
  → Tap → Sector card + filtered jobs
  → Actions: Apply | Save for later | Dismiss
```

## 21.5 Decision Gate Summary Table

| Gate | Blocking? | Trigger |
|---|---|---|
| Budget crisis | Soft block | Runway < 1 month |
| Lease renewal | Soft block | 14 days before expiry |
| Rate shock review | Non-blocking | Variable payment +10% |
| Recession review | Non-blocking | Phase → Recession |
| Peak risk alert | Non-blocking | 3+ overheating signals |

---

# 22. UI Screens & Information Architecture

## 22.1 Screen Registry (Economy Domain)

| Screen | Route | Primary Decision |
|---|---|---|
| Economy Pulse | `/economy` or Home widget | "How healthy is the world economy?" |
| My Economy | `/banking/economy` | "How exposed am I?" |
| Budget | `/banking/budget` | "Can I afford this month?" |
| Job Market | `/careers/market` | "Where should I work?" |
| Sector Explorer | `/economy/sectors` | "Where is opportunity?" |
| City Economy | `/city/:id/economy` | "Should I relocate?" |
| News Economy | `/news?tab=economy` | "What happened and why?" |
| Cycle Almanac | `/economy/almanac` | "What phase are we in?" |

## 22.2 Economy Pulse Wireframe (Conceptual)

```
┌──────────────────────────────────────────────────────────────┐
│ ECONOMY PULSE                    Cycle: Growing ▲  [Almanac] │
├──────────────────────────────────────────────────────────────┤
│ CPI +3.1%  │  Unemployment 5.2%  │  Policy Rate 4.5%  │ Conf 102 │
├───────────────────────────────┬──────────────────────────────┤
│ 12-MONTH CPI CHART            │ SECTOR HEATMAP               │
│                               │ Tech ↑  Health →  Retail ↓   │
├───────────────────────────────┴──────────────────────────────┤
│ TOP HEADLINES                              [View all news]   │
│ • Central bank holds rates...                                │
│ • Tech hiring up 8% in Metro...                              │
└──────────────────────────────────────────────────────────────┘
```

## 22.3 Three-Number Rule Compliance

| Screen | Three Numbers |
|---|---|
| Economy Pulse | CPI, Unemployment, Policy Rate |
| My Economy | Runway, Real net worth Δ, DTI |
| Budget | Income, Fixed costs, Savings gap |
| Job Market | Hiring Ease, Open roles (filtered), Median wage |
| Sector Card | Demand index, Employment growth, Trend duration |

---

# 23. Notifications & Alerts

## 23.1 Priority Tiers

| Tier | Examples | Delivery |
|---|---|---|
| **P0 Critical** | Payment failure imminent, foreclosure | Blocking + push |
| **P1 Important** | Lease renewal, rate change, layoff news in sector | Banner + feed |
| **P2 Informational** | CPI release, sector opportunity | Feed only |
| **P3 Ambient** | Minor price changes | Digest weekly |

## 23.2 Notification Content Standards

Every economic notification includes:

1. **What changed** (number + direction)
2. **Why it matters to you** (if personalized)
3. **One tap action** (view detail, adjust plan)

---

# 24. Onboarding & Economic Literacy

## 24.1 Tutorial Philosophy

No economics lectures. **Learn by doing:**

| Milestone | Lesson |
|---|---|
| First purchase | Money decreases |
| First paycheck | Income vs expenses |
| First rent increase | Inflation exists |
| First loan | Interest costs money |
| First recession (world) | Cycles happen |
| First sector boom | Opportunity timing |

## 24.2 Glossary Integration

Terms (CPI, DTI, real vs nominal) link to **Fenix Glossary** (Document 41) via inline `?` icons — never modal walls of text.

## 24.3 Advisor NPC (Optional)

Settings → **Economic Advisor**: Off / Minimal / Full

- **Off**: Pure systems
- **Minimal**: Crisis-only hints
- **Full**: Proactive suggestions (may reduce mastery reward — player choice)

---

# 25. Difficulty & Starting Conditions

## 25.1 Economic Difficulty Modifiers

| Setting | Player Effect |
|---|---|
| **Forgiving** | Slower cycle swings; gentler unemployment |
| **Standard** | Canonical emergent economy |
| **Brutal** | Faster shocks; stickier unemployment |

*Modifiers affect world generation seed parameters — not player-only buffs.*

## 25.2 Starting Background Economic Lens

| Background | Economic Starting Condition |
|---|---|
| Wealthy family | Higher assets; higher lifestyle expectations |
| Working class | Tight budget; strong motivation hooks |
| Immigrant | Credential friction; growth city options |
| Entrepreneur family | Network + business literacy; pressure to perform |

Ceiling unchanged — starting conditions affect **access**, not **rules**.

---

# 26. Multiplayer & Fenix Network Economy Touches

Per Document 00 §9, economies are **sovereign per world**. Economy design implications:

| Feature | Economy Behavior |
|---|---|
| Friend company visit | Public metrics only — no cross-world prices |
| Leaderboards | Nominal net worth with inflation disclaimer |
| Gifts/transfers | Capped; no cross-world arbitrage |
| News | May reference "global trends" as flavor — not synced prices |

---

# 27. Accessibility & Clarity Standards

| Requirement | Implementation |
|---|---|
| Color-blind safe cycle badges | Icon + text, not color alone |
| Screen reader | All indices have text equivalents |
| Number formatting | Locale-aware; consistent decimals |
| Cognitive load | Default simple view; advanced toggle |
| Font scaling | Charts reflow; no clipped labels |

---

# 28. Acceptance Criteria

## 28.1 Core Economy UX

| ID | Criterion | Test Method |
|---|---|---|
| ECO-UX-001 | Player can view CPI, unemployment, policy rate within 2 taps from Home | UX audit |
| ECO-UX-002 | Budget shows nominal income and fixed expense total | Functional |
| ECO-UX-003 | Lease renewal shows market comparison data | Scenario test |
| ECO-UX-004 | Recession phase changes cycle badge and news tone | Simulation test |
| ECO-UX-005 | Sector cards show demand index and 12-month trend | Data validation |
| ECO-UX-006 | Headlines link to cause chain investigation | Content QA |
| ECO-UX-007 | Player and NPC companies see same sector demand on same date | Symmetry test |
| ECO-UX-008 | Inflation increases grocery line items over 12-month sim | Integration |
| ECO-UX-009 | Variable loan notification on rate hike | Event test |
| ECO-UX-010 | COL index affects job offer comparison screen | Functional |

## 28.2 Strategic Playbooks

| ID | Criterion | Test Method |
|---|---|---|
| ECO-ST-001 | Peak risk alert fires when 3+ overheating conditions met | Simulation |
| ECO-ST-002 | Recession review gate offers runway checklist | Functional |
| ECO-ST-003 | Cycle Almanac shows historical phase durations for world | Data check |
| ECO-ST-004 | Stagflation alert displays when inflation high + GDP negative | Integration |

## 28.3 Literacy & Onboarding

| ID | Criterion | Test Method |
|---|---|---|
| ECO-ED-001 | First paycheck triggers budget setup flow | New life test |
| ECO-ED-002 | Glossary links work for CPI, DTI, real/nominal | Link audit |
| ECO-ED-003 | Raise lag indicator appears when CPI > wage growth 3 months | Scenario |

## 28.4 Accessibility

| ID | Criterion | Test Method |
|---|---|---|
| ECO-A11Y-001 | Cycle badge readable without color | Visual QA |
| ECO-A11Y-002 | Screen reader announces index changes | A11y audit |

---

# 29. Edge Cases & Failure States

| Scenario | Expected Player Experience |
|---|---|
| Hyperinflation world seed | Extreme COL; teaching moment; difficulty warning at creation |
| Deflation + high debt player | Debt stress UI; advisory content |
| Player ignores all economy UI | Still feels prices in purchases — cannot opt out of physics |
| Save from old version | Migration preserves nominal balances; indices recalibrated with note |
| 0 unemployment (edge) | "Full employment" label; wage pressure news |
| All sectors contracting | Rare; "Broad slowdown" alert; diversified survival tips |

---

# 30. Traceability Matrix

| Bible Section | Constitution Article | Engine Doc 18 Section | This Doc Section |
|---|---|---|---|
| §11 Economy Philosophy | Financial Capital | §5 Inflation | §5 Prices & Inflation |
| §11 Labor market | Human Capital | §7 Labor Market | §7–8 Labor & Wages |
| §10 Living World | Living World | §16 Business Cycles | §13–15 Cycles & Playbooks |
| §11 Regional economies | — | §13 Housing Integration | §11 Regional |
| §11 Financial literacy | — | §15 Consumer Confidence | §17 Sentiment |
| Pillar II Living Economy | Five Capitals | §19 Sector Model | §10 Sectors |

---

# 31. Governance & Changelog

## 31.1 Amendment Process

Changes require:

1. Design review against Documents 00, 01
2. Engineering feasibility check against Document 18
3. UX review against Document 34
4. Version bump in this file and Document 39 index

## 31.2 Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Lead Systems Designer | Initial canonical release |

---

*End of Document 05 — Economy Design*
