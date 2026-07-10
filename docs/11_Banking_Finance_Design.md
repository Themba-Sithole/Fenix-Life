# Fenix Life — Banking & Finance Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Banking & Personal Finance Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Chief Economist  
**Audience:** Game Design, Engineering, UX, QA, Narrative, Live Ops  

---

## Document Authority

This document defines **how players experience banking, credit, debt, and personal financial management** in Fenix Life. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Financial literacy through consequence; personal finance pillars |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Citizen Equality, Living World |
| [05_Economy_Design.md](./05_Economy_Design.md) | Player-facing macro economy framing (planned companion) |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Policy rates, inflation, credit cycles, rate transmission |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Banking Engine §4.7 responsibilities and events |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | `Account`, `Loan`, `CreditProfile`, ledger entities |
| [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | Executive-app visual language |
| [BankingDashboard screen](../src/app/screens/BankingDashboard.tsx) | v0 UI reference implementation |

**Division of authority:**

| Owns | Does Not Own |
|---|---|
| Player banking UX flows | Macro policy rate formulas (Economy Engine) |
| Account product definitions | Corporate GAAP accounting (Company Engine) |
| Loan application player journey | Tax assessment rules (Tax Engine) |
| Credit score player explanation layer | Securities pricing (Investment Engine) |
| Bankruptcy player experience framing | Property title transfer (Housing Engine) |

When banking design conflicts with Citizen Equality, **player and AI citizens use identical underwriting physics**—UI may explain more clearly; simulation may not cheat.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Five Capitals Alignment](#2-philosophy--five-capitals-alignment)
3. [Design Goals & Anti-Goals](#3-design-goals--anti-goals)
4. [BankingDashboard Screen Architecture](#4-bankingdashboard-screen-architecture)
5. [Account Products](#5-account-products)
6. [Transaction Ledger & Cash Flow](#6-transaction-ledger--cash-flow)
7. [Net Worth & Financial Snapshot](#7-net-worth--financial-snapshot)
8. [Credit Cards](#8-credit-cards)
9. [Credit Score — Player View](#9-credit-score--player-view)
10. [Interest Rates Explained to the Player](#10-interest-rates-explained-to-the-player)
11. [Loan Products](#11-loan-products)
12. [Loan Application Flows](#12-loan-application-flows)
13. [Underwriting — Player-Facing Rules](#13-underwriting--player-facing-rules)
14. [Loan Servicing & Modifications](#14-loan-servicing--modifications)
15. [Bankruptcy — Player Experience](#15-bankruptcy--player-experience)
16. [Living World Banking](#16-living-world-banking)
17. [Integration Contracts](#17-integration-contracts)
18. [Player Decision Flows](#18-player-decision-flows)
19. [Events & Notifications](#19-events--notifications)
20. [Accessibility & Financial Literacy](#20-accessibility--financial-literacy)
21. [v1 Scope & Future Expansion](#21-v1-scope--future-expansion)
22. [Acceptance Criteria](#22-acceptance-criteria)
23. [QA Scenarios](#23-qa-scenarios)
24. [Glossary](#24-glossary)

---

# 1. Executive Summary

Banking & Finance is the **player's daily money interface**—the place where salary lands, bills leave, credit is earned or destroyed, and major life purchases are financed. It must feel like a premium fintech app embedded inside a living simulation, not a spreadsheet with buttons.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BANKING & FINANCE — PLAYER JOURNEY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DISCOVER          MANAGE              BORROW              RECOVER           │
│  ────────          ──────              ──────              ───────           │
│  Open accounts  →  Track cash flow  →  Apply for loans →  Restructure       │
│  Choose bank       Budget surplus      Build credit         Bankruptcy       │
│  Link payroll      Pay bills           Finance home         Rebuild score    │
│                    Invest surplus      Fund business                         │
│                                                                              │
│         ▲                    ▲                    ▲                        │
│         │                    │                    │                        │
│    Career Engine        Tax Engine          Economy Engine                   │
│    (income)             (withholding)       (rates, cycles)                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core player promise:** Every dollar has a story. Every loan has terms the player can inspect. Every credit score change has traceable causes. Bankruptcy is a real chapter, not a game-over screen.

| Pillar | Banking Expression |
|---|---|
| **Consequence** | Missed payments echo for years in credit history |
| **Literacy** | APR, APY, DTI, utilization explained in context |
| **Symmetry** | NPC citizens denied for same DTI the player would be |
| **Living World** | Banks tighten credit while player sleeps |
| **Legacy** | Debt and assets transfer through succession rules |

---

# 2. Philosophy & Five Capitals Alignment

## 2.1 Financial Capital — Primary

Banking is the **operational layer of Financial Capital**:

| Component | Banking Touchpoint |
|---|---|
| Cash & liquid reserves | Checking, savings balances |
| Income streams | Payroll deposits, dividend credits |
| Debt | Loans, credit cards, lines of credit |
| Credit score | `CreditProfile` with factor breakdown |
| Net worth | Aggregated dashboard (includes non-bank assets via links) |

## 2.2 Human Capital — Secondary

| Link | Mechanism |
|---|---|
| Career income | Salary deposits enable loan qualification |
| Education | Student loan products tied to Education Engine |
| Health | Medical debt and insurance premiums as transactions |
| Discipline | Consistent savings behavior unlocks better products |

## 2.3 Social Capital — Tertiary

| Link | Mechanism |
|---|---|
| Co-signers | Family members can guarantee loans (Family Engine) |
| Reputation | Public bankruptcy filings affect social standing |
| Business relationships | Bank relationship manager for business accounts |

## 2.4 Business Capital — Bridge

Business operating accounts, business credit lines, and commercial loans bridge personal and company finance. Player sees **separate ledgers** but unified net worth on dashboard header.

## 2.5 Legacy Capital — Long Arc

| Mechanism | Banking Role |
|---|---|
| Inheritance | Beneficiary accounts, estate settlement holds |
| Generational debt | Co-signed student loans survive transitions |
| Trust accounts | v2 — separate legal entity accounts |
| World Memory | `DefaultRecord`, foreclosure events archived |

## 2.6 Constitutional Checks

Before shipping any banking feature, answer:

1. Does the AI citizen face the same rate and approval rules?
2. Can the player trace this outcome to a prior decision?
3. Does idle cash lose purchasing power via inflation (Economy Engine)?
4. Is the UI teaching or merely displaying?
5. Does this connect to at least one other capital?

---

# 3. Design Goals & Anti-Goals

## 3.1 Goals

| ID | Goal | Success Signal |
|---|---|---|
| G1 | Player understands cash position in < 10 seconds | Dashboard scan test |
| G2 | Credit score changes are explainable | 90% players identify top factor in survey |
| G3 | Loan rejection teaches improvement path | Rejection screen shows 3 actionable items |
| G4 | Interest environment feels macro-driven | Rate change notification cites central bank |
| G5 | Bankruptcy is survivable with plan | 70% bankrupt players reach "fair" credit within 10 sim-years |
| G6 | Transactions tell life story | Recent activity readable as narrative |

## 3.2 Anti-Goals

| ID | Anti-Goal | Why |
|---|---|---|
| A1 | Infinite credit for player | Violates Citizen Equality |
| A2 | Hidden fees | Violates financial honesty principle |
| A3 | Instant credit score repair microtransactions | Pay-to-win |
| A4 | Generic "loan approved" without terms review | Teaches bad habits |
| A5 | Bankruptcy as instant reset | Must carry multi-year consequences |
| A6 | Real-world bank branding | Legal/trademark risk |

---

# 4. BankingDashboard Screen Architecture

The `BankingDashboard` screen is the **canonical v1 layout reference**. Production implementation must preserve information hierarchy while connecting to live simulation data.

## 4.1 Screen Regions

| Region | v0 Reference | Live Data Source |
|---|---|---|
| Hero header | Net worth headline | `CitizenFinancialSnapshot.netWorth` |
| Account grid | 4 account cards | `Account[]` filtered by owner |
| Balance history chart | 6-month area chart | `AccountBalanceHistory` |
| Income vs expenses | Bar chart | Aggregated credits/debits by month |
| Loans & credit panel | Mortgage + card summary | `Loan[]`, `CreditCardAccount` |
| Recent transactions | Scrollable list | `LedgerEntry[]` last 30 days |

## 4.2 Navigation & Entry Points

| Entry Point | Route | Context Preserved |
|---|---|---|
| Home hub | `/banking` | Default dashboard |
| Notification tap | `/banking/transactions/:id` | Deep link to transaction |
| Loan reminder | `/banking/loans/:loanId` | Payment due context |
| Credit alert | `/banking/credit` | Score change detail |
| Company finance | `/banking/business` | Business account filter |

## 4.3 Visual Language

Per [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md):

| Element | Token | Usage |
|---|---|---|
| Positive money | `#2EC4B6` (Fenix Teal) | Credits, available credit, gains |
| Caution / expense | `#F4B400` (Fenix Gold) | Expenses, utilization warnings |
| Primary text | `#1C2541` | Balances, labels |
| Hero gradient | `#0B132B` → `#1C2541` | Header backgrounds |

## 4.4 Account Card Interaction

```
Tap account card
    │
    ├─► Account detail sheet
    │       ├─ Current balance
    │       ├─ Available balance (if holds)
    │       ├─ Interest rate (if applicable)
    │       ├─ YTD interest earned/paid
    │       └─ [Transfer] [Statements] [Settings]
    │
    └─► Filter transactions to account
```

## 4.5 Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Desktop (≥1280px) | 4-column account grid, 2+1 chart layout |
| Tablet (768–1279px) | 2-column account grid, stacked charts |
| Mobile (<768px) | Single column; swipeable account carousel |

## 4.6 Empty States

| State | Copy | CTA |
|---|---|---|
| No accounts | "You haven't opened a bank account yet." | [Choose a Bank] |
| No transactions | "No activity this month." | [Link Income Source] |
| No loans | "You're debt-free." | [Explore Loan Options] |
| Frozen account | "This account is frozen pending review." | [View Notice] |

---

# 5. Account Products

## 5.1 Product Catalog (v1)

| Product ID | Display Name | Purpose | Interest | Monthly Fee | Min Balance |
|---|---|---|---|---|---|
| `checking_standard` | Checking Account | Daily spending, bill pay | 0% APY | $0–$12 | $0 |
| `checking_premium` | Premium Checking | Higher limits, fee waiver | 0.01% APY | $0 (w/ $2,500 min) | $2,500 |
| `savings_basic` | Savings Account | Emergency fund, goals | Economy-linked APY | $0 | $0 |
| `savings_high_yield` | High-Yield Savings | Competitive saver product | Prime − 0.5% APY | $0 | $500 |
| `business_operating` | Business Account | Company receipts/disbursements | 0% APY | $15–$35 | $0 |
| `investment_cash` | Investment Cash | Settlement account for trades | 0.1% APY | $0 | $0 |

**Note:** Investment securities holdings display on Stock Market screen; `investment_cash` is the banking settlement layer per Investment Engine integration.

## 5.2 Account Opening Flow

| Step | Player Action | System Validation |
|---|---|---|
| 1 | Select bank institution | Citizenship, age ≥ 16 (emancipated) or 18 |
| 2 | Choose product type | Product eligibility rules |
| 3 | Identity verification | Citizen identity record |
| 4 | Initial deposit (optional) | Sufficient funds in source |
| 5 | Terms acceptance | — |
| 6 | Account activated | `banking.account_opened` event |

## 5.3 Checking Account — Detail

**Primary use cases:**

- Salary direct deposit
- Bill autopay source
- Debit card spending (abstracted as categorized transactions)
- Peer transfers (Fenix Network, v1 async)

**Features:**

| Feature | v1 | v2+ |
|---|---|---|
| Direct deposit | ✅ | — |
| Bill pay | ✅ | — |
| Overdraft protection | ✅ (linked savings) | — |
| Mobile deposit | ✅ (abstracted) | Check image mini-game |
| Joint accounts | ❌ | Family Engine link |
| Minor custodial | ❌ | Family Engine link |

## 5.4 Savings Account — Detail

**Interest accrual:**

```
dailyInterest = balance × (APY / 365)
monthlyPost = sum(dailyInterest) credited last day of month
```

APY displayed to player updates when `economy.rate_changed` propagates to bank product tables (typically within 1 sim-month lag per institution policy).

**Savings goals (v1 lightweight):**

| Goal Type | UI | Mechanism |
|---|---|---|
| Emergency fund | Progress ring | Target amount, optional auto-transfer |
| Purchase goal | Named bucket | "House down payment" |
| Generic | Freeform label | Player-defined |

## 5.5 Business Account — Detail

Linked to `Company` entity when player is founder/officer with signing authority.

| Rule | Detail |
|---|---|
| Separation | Business expenses must not auto-mix with personal (warnings on miscategorization) |
| Signers | Multiple officers can require dual approval (v2) |
| Payroll | Outbound batch to employee accounts via Career Engine |
| Loan linkage | Business loans disburse to business operating account |

## 5.6 Account Limits & Holds

| Hold Type | Trigger | Player Visibility |
|---|---|---|
| Pending transaction | Card authorization | "Pending" badge, reduced available |
| Legal freeze | Court order, audit | Notification + reason code |
| Collateral lien | Secured loan | Loan detail link |
| Estate hold | Death in progress | Succession UI |

---

# 6. Transaction Ledger & Cash Flow

## 6.1 Ledger Principles

All money movement uses **immutable double-entry ledger** per Database Design:

| Property | Rule |
|---|---|
| Immutability | Corrections via reversing entries, never edits |
| Traceability | Every entry links to source event ID |
| Categorization | MCC-style category for tax and budgeting |
| Timestamp | Sim-date + sequence number |

## 6.2 Transaction Display Model

Player-facing transaction row:

| Field | Example | Source |
|---|---|---|
| Date | Jul 10 | `postedAt` |
| Description | Salary - TechVentures | `memo` + counterparty |
| Amount | +$8,500 | Signed decimal |
| Type | credit / debit | Derived |
| Category | Income > Salary | `categoryId` |
| Account | Checking ••4821 | `accountId` |
| Status | Posted / Pending | `status` |

## 6.3 Income vs Expenses Chart

Monthly aggregation for dashboard bar chart:

```
income[month]   = sum(credits where category != 'transfer_internal')
expenses[month] = sum(debits where category != 'transfer_internal')
netCashFlow     = income - expenses
```

**Excluded from expense bar:** Transfers between own accounts, investment purchases (classified as asset transfer).

## 6.4 Cash Flow Categories (v1)

| Category Group | Examples | Tax Relevance |
|---|---|---|
| Income | Salary, bonus, rental, dividend | Withholding |
| Housing | Rent, mortgage, HOA | Deduction potential |
| Transportation | Car payment, fuel, insurance | — |
| Food | Groceries, dining | — |
| Healthcare | Premiums, copays | Deduction potential |
| Education | Tuition, books | Credit potential |
| Debt Service | Loan principal+interest split | Interest deduction |
| Entertainment | Subscriptions, events | — |
| Taxes | Estimated payments, refunds | — |
| Transfers | Internal, gifts, investments | Varies |

## 6.5 Search & Filter

| Filter | Options |
|---|---|
| Date range | 7d, 30d, 90d, YTD, custom |
| Account | All, per account |
| Category | Multi-select |
| Amount | Min/max |
| Type | Credit, debit, pending |
| Search | Description text |

## 6.6 Disputes & Errors (v1)

Player can flag transaction → creates `DisputeTicket` (async resolution in 3–10 sim-days). Outcomes: upheld, merchant credit, fraud reversal. Fraud reversals may trigger temporary card freeze.

---

# 7. Net Worth & Financial Snapshot

## 7.1 Net Worth Formula (Dashboard Header)

```
netWorth = totalAssets - totalLiabilities

totalAssets =
  bankAccountBalances
  + investmentMarketValue (link to Investment Engine)
  + propertyEquity (Housing Engine)
  + vehicleValue (Vehicle domain)
  + businessEquityStake (Company Engine)
  + otherAssets

totalLiabilities =
  loanPrincipalBalances
  + creditCardBalances
  + taxLiabilitiesOutstanding
  + otherPayables
```

## 7.2 Snapshot Cadence

| Metric | Update Frequency | History |
|---|---|---|
| Account balances | Real-time on transaction | Daily snapshot |
| Net worth | Daily recompute | Monthly archive |
| Cash flow | Monthly rollup | 24-month retention in UI |

## 7.3 Balance History Chart

6-month default view (extendable to 1Y, 5Y, All):

- Plots total liquid + semi-liquid bank balances
- Optional overlay: net worth line (toggle)
- Annotations for major events (loan origination, inheritance, bankruptcy discharge)

## 7.4 Financial Health Indicators

| Indicator | Formula | Display |
|---|---|---|
| Emergency fund ratio | Savings / monthly expenses | Months covered badge |
| Debt-to-income (DTI) | Monthly debt payments / gross monthly income | Gauge with bands |
| Credit utilization | Card balances / total limits | % bar |
| Savings rate | (Income − expenses) / income | Monthly % |

Bands: **Healthy** (green), **Caution** (gold), **Risk** (red) — thresholds vary by life stage (young adult vs mid-career).

---

# 8. Credit Cards

## 8.1 Card Products (v1)

| Tier | Typical Limit | APR Range | Annual Fee | Perks |
|---|---|---|---|---|
| Starter | $500–$2,000 | Prime + 12–18% | $0 | Credit building |
| Standard | $2,000–$15,000 | Prime + 8–14% | $0–$95 | Cashback 1% |
| Rewards | $5,000–$50,000 | Prime + 10–16% | $95–$450 | Category multipliers |
| Business | $10,000–$100,000 | Prime + 6–12% | $0–$595 | Expense tools |

## 8.2 Application Flow

```
Player initiates application
    │
    ├─► Soft pull (no score impact) — pre-qualification estimate
    │       └─► Show likely limit range
    │
    ├─► Player confirms hard pull
    │       └─► Credit inquiry recorded (−3 to −8 points typical)
    │
    ├─► Underwriting decision
    │       ├─ Approved → limit, APR, product tier
    │       ├─ Counter-offer → lower limit / secured card
    │       └─ Denied → reason codes + improvement plan
    │
    └─► Card activated → appears in Loans & Credit panel
```

## 8.3 Billing Cycle

| Element | Rule |
|---|---|
| Statement close | Fixed day each month |
| Grace period | 21–25 days for purchases |
| Minimum payment | Greater of $25 or 1% balance + interest |
| APR application | Daily periodic rate on carried balance |
| Cash advance | Higher APR, no grace, fee |

## 8.4 Player UI — Loans & Credit Panel

Per BankingDashboard reference:

| Display | Example |
|---|---|
| Product name | Credit Card |
| Balance | $2,450 |
| Limit | $50,000 |
| Utilization | 4.9% used |
| Available credit | $47,550 |
| APR | 18.24% variable |
| Payment due | Aug 5 — $75 min |

## 8.5 Utilization & Score Impact

| Utilization Band | Score Impact |
|---|---|
| 0–9% | Optimal |
| 10–29% | Good |
| 30–49% | Moderate drag |
| 50–74% | Significant drag |
| 75%+ | Severe drag |

Player tooltip: "Lenders prefer utilization under 30%. Paying before statement close can help."

## 8.6 Secured Card Path

For thin-file or damaged credit:

- Player deposits $200–$5,000 as collateral
- Limit equals deposit
- Graduate to unsecured after 12–18 months on-time payments

---

# 9. Credit Score — Player View

## 9.1 Score Range

| Band | Range | Player Label | Typical Access |
|---|---|---|---|
| Poor | 300–579 | Rebuilding | Secured products only |
| Fair | 580–669 | Fair | Higher APR, lower limits |
| Good | 670–739 | Good | Standard products |
| Very Good | 740–799 | Very Good | Preferred rates |
| Excellent | 800–850 | Excellent | Best terms |

Simulation uses same 300–850 scale as US FICO analog for player familiarity. World config may shift label thresholds per jurisdiction.

## 9.2 Score Factors Display

Player-facing factor breakdown (mirrors `CreditProfile.factors`):

| Factor | Weight | What Player Sees |
|---|---|---|
| Payment history | 35% | On-time %, missed payments count |
| Amounts owed | 30% | Utilization, loan balances |
| Length of history | 15% | Oldest account age, average age |
| New credit | 10% | Recent inquiries, new accounts |
| Credit mix | 10% | Installment vs revolving diversity |

Each factor shows: **rating** (Excellent/Good/Fair/Poor), **trend** (↑↓→), **top driver** (one sentence).

## 9.3 Credit Report Screen

| Section | Content |
|---|---|
| Score headline | Current score + 24-month chart |
| Factor cards | 5 factors with drill-down |
| Accounts | All tradelines with status |
| Inquiries | Hard pulls last 24 months |
| Public records | Bankruptcy, liens, judgments |
| Tips | Personalized 3 recommendations |

## 9.4 Score Change Notifications

When `banking.credit_score_changed` fires:

```
Notification: "Your credit score changed: 712 → 698 (−14)"

Tap to see:
  Primary reason: "High utilization on Rewards Card (62%)"
  Secondary: "New inquiry from Auto Loan application"
  [View Full Report] [Learn What Changed]
```

## 9.5 Inquiry Policy

| Type | Score Impact | Visibility |
|---|---|---|
| Soft pull | None | Not listed |
| Hard pull | −3 to −8 each | 24-month inquiry list |
| Rate shopping window | Multiple auto/mortgage inquiries in 14 days count as one | Explained in UI |

## 9.6 Dispute Flow (v1 Simplified)

Player disputes tradeline accuracy → investigation sim-days → correction or upheld. Intentional fraud by player citizens is anti-abuse territory (not v1 PvP focus).

---

# 10. Interest Rates Explained to the Player

## 10.1 Design Principle

Players must understand **why rates change** without reading an economics textbook. Every rate display includes a "Why this rate?" expandable section linking macro context.

## 10.2 Rate Types & Player Labels

| Rate | Player Label | What It Affects |
|---|---|---|
| Policy rate | Central Bank Rate | Economy anchor (from Economy Engine) |
| Prime rate | Bank Prime | Variable loan/card base |
| APY | Savings Yield | Money earned on deposits |
| APR | Borrowing Cost | Loans, cards |
| Real rate | Inflation-Adjusted | Advanced tooltip |

## 10.3 Rate Composition Tooltip

For a 30-year fixed mortgage at 6.8% APR:

```
Your rate: 6.80% APR

Breakdown:
  Central bank policy rate     4.25%
  Bank funding spread          1.50%
  Your credit risk premium     0.75%
  Loan term premium            0.30%
  ─────────────────────────────────
  Total                        6.80%

"Policy rate rose 0.50% last quarter after inflation
remained above target. See [Economic Briefing]."
```

## 10.4 Fixed vs Variable

| Type | Player Explanation | Reset Trigger |
|---|---|---|
| Fixed | "Your rate stays the same for the loan term." | Refinance only |
| Variable | "Your rate adjusts with market conditions." | `economy.rate_changed` + contract spread |
| Hybrid ARM | "Fixed for 5 years, then adjusts annually." | Schedule in loan contract |

## 10.5 Real Interest Rate Education

When inflation > savings APY:

```
Alert: "Inflation (3.4%) is outpacing your savings yield (2.1%).
Your money's purchasing power is shrinking by ~1.3% this year."

[Learn about inflation hedging] → links Investment/Housing education
```

## 10.6 Rate Change Notifications

| Event | Player Message |
|---|---|
| `economy.rate_changed` (+0.25%) | "Central bank raised rates. Variable loans may increase next cycle." |
| Card APR increase | "Your card APR is now 19.49% due to market rate changes. You have 45 days to opt out of future increases by closing the account." |
| Savings APY increase | "Your High-Yield Savings APY increased to 4.2%." |

## 10.7 Historical Rate Chart

Player-accessible chart: policy rate vs their mortgage rate vs savings APY over 5 sim-years. Teaches correlation without requiring external research.

---

# 11. Loan Products

## 11.1 Product Matrix (v1)

| Loan Type | ID | Term Range | Collateral | Typical Use |
|---|---|---|---|---|
| Personal | `personal_unsecured` | 1–7 years | None | Consolidation, emergency |
| Auto | `auto_secured` | 2–7 years | Vehicle | Car purchase |
| Mortgage | `mortgage_fixed` / `mortgage_arm` | 15–30 years | Property | Home purchase |
| Mortgage refi | `mortgage_refinance` | 15–30 years | Property | Rate/term change |
| Business term | `business_term` | 1–10 years | Optional | Expansion, equipment |
| Line of credit | `line_of_credit` | Revolving | Optional | Working capital |
| Student | `student_federal` / `student_private` | 10–25 years | None | Education |

## 11.2 Personal Loan

| Attribute | Value |
|---|---|
| Principal range | $1,000 – $50,000 |
| Rate | Prime + 3% – 12% based on credit |
| Fees | Origination 0–5% |
| Prepayment | Allowed, no penalty |
| DTI cap | 40% total DTI typically |

## 11.3 Auto Loan

| Attribute | Value |
|---|---|
| Principal range | $5,000 – $150,000 |
| Rate | Prime + 2% – 10% |
| LTV cap | 100–120% (new vs used) |
| Term effect | Longer term = higher total interest (shown in comparison) |
| Repo consequence | Vehicle seizure, credit damage, deficiency balance |

## 11.4 Mortgage

| Attribute | Value |
|---|---|
| Principal range | $50,000 – $2,000,000+ (DTI/income constrained) |
| Down payment min | 3% (FHA analog) – 20% (no PMI) |
| PMI | Required if LTV > 80% |
| Escrow | Property tax + insurance monthly |
| Foreclosure timeline | 90–180 days delinquent → process |

## 11.5 Business Loan

| Attribute | Value |
|---|---|
| Principal range | $10,000 – $5,000,000 |
| Underwriting | Business revenue, time in business, personal guarantee |
| Collateral | Equipment, receivables, real estate |
| Covenants | Debt service coverage ratio (DSCR) monitoring (v1 display only) |

## 11.6 Student Loan

| Attribute | Value |
|---|---|
| Federal vs private | Federal: income-driven repayment options; Private: credit-based |
| Deferment | In-school deferment while enrolled |
| Forgiveness | Government policy dependent (Government Engine) |

---

# 12. Loan Application Flows

## 12.1 Universal Application Stages

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Intent   │───►│ Pre-qual │───►│ Full App │───►│ Decision │───►│ Fund     │
│ Select   │    │ (soft)   │    │ (hard)   │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## 12.2 Personal Loan Flow

| Step | Player Input | System Output |
|---|---|---|
| 1 | Desired amount, purpose | Product recommendation |
| 2 | Income confirmation | Auto-fill from Career Engine |
| 3 | Employment verification | Tenure, employer stability score |
| 4 | Debt inventory | Auto-list existing obligations |
| 5 | Pre-qual | Estimated rate range, no inquiry |
| 6 | Full application | Hard pull, final offer |
| 7 | Review terms | APR, payment, total interest, fees |
| 8 | Accept & fund | Deposit to checking |

**Decision timer:** 1–3 sim-days for NPC bank processing (instant for UX option in tutorial year only).

## 12.3 Auto Loan Flow

| Step | Detail |
|---|---|
| Vehicle selection | From dealer or private party (Vehicle Engine) |
| Down payment | Cash or trade-in equity |
| Term selection | 36/48/60/72 months with payment comparison table |
| GAP insurance offer | Optional product (Insurance Engine) |
| Funding | Direct to dealer or player checking |

## 12.4 Mortgage Flow

| Step | Detail |
|---|---|
| Pre-approval | Soft/hard pull, max purchase price, rate lock 60–90 days |
| Property selection | Housing Engine listing |
| Appraisal | Simulated delay 2–4 weeks; value may differ from price |
| Underwriting | Income, assets, credit, property review |
| Closing disclosure | 3-day review period (regulatory flavor) |
| Closing | Down payment + closing costs debited, loan funded, title transferred |

## 12.5 Business Loan Flow

| Step | Detail |
|---|---|
| Business financials | Pull from Company Engine P&L, balance sheet |
| Business plan | Optional narrative (affects relationship manager favor) |
| Personal guarantee | Required for most SMB products |
| Collateral appraisal | If secured |
| Committee review | 5–15 sim-days for large loans |

## 12.6 Application Status Tracker

| Status | Player Display |
|---|---|
| `draft` | Continue application |
| `submitted` | Under review |
| `pending_docs` | Upload required (pay stubs, tax returns) |
| `approved` | Review offer (expires in X days) |
| `counter_offer` | Alternative terms proposed |
| `denied` | See reasons + next steps |
| `withdrawn` | Player cancelled |
| `expired` | Rate lock or offer expired |

## 12.7 Loan Comparison Tool

Before accepting, player sees side-by-side:

| Metric | 36 mo | 48 mo | 60 mo |
|---|---|---|---|
| Monthly payment | $X | $Y | $Z |
| Total interest | $A | $B | $C |
| Total cost | $D | $E | $F |

Highlighted recommendation based on player's stated cash flow preference.

---

# 13. Underwriting — Player-Facing Rules

## 13.1 Transparency Principle

Players see **the same factors** banks use, not a black-box percentage. Denial reasons use plain language mapped to improvement actions.

## 13.2 Key Ratios

| Ratio | Formula | Typical Threshold |
|---|---|---|
| DTI | Monthly debt / gross monthly income | ≤ 43% (mortgage), ≤ 40% (personal) |
| LTV | Loan amount / collateral value | ≤ 80% (no PMI), ≤ 97% (FHA) |
| Housing ratio | PITI / gross income | ≤ 28% |
| DSCR (business) | Net operating income / debt service | ≥ 1.25 |

## 13.3 Credit Score Gates

| Product | Minimum Score (typical) |
|---|---|
| Starter card | 580 (secured below) |
| Standard card | 670 |
| Rewards card | 740 |
| Personal loan | 640 |
| Auto loan | 620 |
| Mortgage | 620 (FHA), 680 (conventional preferred) |
| Business loan | 680 + business metrics |

Thresholds shift with `creditAvailability` from Economy Engine credit cycle.

## 13.4 Denial Reason Codes → Player Actions

| Code | Player Message | Action |
|---|---|---|
| `DTI_HIGH` | Debt payments are 48% of income | Pay down cards, increase income |
| `SCORE_LOW` | Score 612 below 640 minimum | On-time payments 6+ months |
| `INCOME_INSUFFICIENT` | Verified income below requirement | Add co-signer, smaller loan |
| `COLLATERAL_LOW` | Appraisal below purchase price | Larger down payment, renegotiate |
| `EMPLOYMENT_SHORT` | Employment < 2 years | Wait or provide history |
| `RECENT_DELINQUENCY` | Missed payment in last 12 months | Build clean history |
| `BANKRUPTCY_RECENT` | Discharge < 4 years ago | See bankruptcy timeline |

## 13.5 Co-Signer Mechanics

| Element | Rule |
|---|---|
| Eligibility | Family member with sufficient credit/income |
| Liability | Co-signer equally responsible |
| Relationship impact | Default damages both scores (Family/Social) |
| Release | After 12–24 on-time payments (product dependent) |

## 13.6 Rate Shopping Protection

Multiple hard pulls for same loan type within 14 sim-days → single inquiry impact on score.

---

# 14. Loan Servicing & Modifications

## 14.1 Payment Schedule

Standard amortization displayed:

| Column | Content |
|---|---|
| Payment # | 1–360 |
| Date | Due date |
| Principal | Portion reducing balance |
| Interest | Portion to lender |
| Balance | Remaining principal |
| Cumulative interest | Running total |

## 14.2 Autopay

| Option | Incentive |
|---|---|
| Manual | — |
| Autopay from checking | 0.25% APR reduction (many products) |
| Bi-weekly autopay | Equivalent 13th payment annually (mortgage) |

## 14.3 Missed Payment Escalation

| Day | System Action | Player Notification |
|---|---|---|
| 1 | Grace period ends | Reminder |
| 15 | Late fee assessed | Fee notice + score warning |
| 30 | Reported delinquent | Credit impact warning |
| 60 | Collections outreach | Call/email narrative |
| 90+ | Default proceedings | Foreclosure/repo initiation |

## 14.4 Refinance

Player initiates when:

- Rates dropped ≥ 0.75% vs current
- Credit improved
- Want cash-out equity

Flow mirrors mortgage application with payoff of existing loan.

## 14.5 Modification & Hardship

| Program | Eligibility | Effect |
|---|---|---|
| Forbearance | Temporary hardship | Payments paused, interest accrues |
| Rate reduction | Lender program | Lower APR, extend term |
| Principal deferral | Rare | Back-load principal |

Triggered by unemployment event (Career Engine) or medical crisis.

## 14.6 Early Payoff

Player pays remaining principal + accrued interest. Prepayment penalty only on specific commercial products (disclosed upfront).

---

# 15. Bankruptcy — Player Experience

## 15.1 Design Intent

Bankruptcy is a **real failure state with a recovery path**—not game over, not a minor debuff. It teaches long-tail consequences of unsustainable debt.

## 15.2 Eligibility Trigger

Player (or AI citizen) may file when:

```
insolvent = (liquidAssets + disposableIncome × 60 months) < totalUnsecuredDebt
OR
foreclosure/repo imminent AND no modification available
```

UI presents **bankruptcy counselor** NPC consult before filing (optional but recommended).

## 15.3 Chapter Analogs (v1)

| Chapter | Name | Who | Outcome |
|---|---|---|---|
| Ch 7 analog | Liquidation | Individuals | Non-exempt assets sold, most unsecured debt discharged |
| Ch 13 analog | Reorganization | Individuals | 3–5 year payment plan, keep assets |
| Ch 11 analog | Business reorg | Companies | Business continues, creditors restructured |

## 15.4 Player Filing Flow

```
┌────────────────┐
│ Financial      │
│ Distress       │──► Bills overdue, collections, wage garnishment risk
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Consultation   │──► Review options: cut expenses, debt consolidation,
│ Screen         │    negotiate, bankruptcy
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Chapter        │──► Means test (Ch 7 vs 13), asset inventory,
│ Selection      │    exempt property rules
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Filing         │──► Automatic stay: collections halt
│                │    Public record on credit report
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Proceedings    │──► 3–6 sim-months: creditor meeting, plan confirmation
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Discharge      │──► Debts discharged per chapter rules
│                │    Credit score drops 130–240 points typical
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Recovery       │──► Secured card, on-time payments, time passage
│ Roadmap        │    Bankruptcy on report 7–10 years
└────────────────┘
```

## 15.5 Consequences Table

| Domain | Consequence |
|---|---|
| Credit score | Immediate severe drop; bankruptcy flag |
| Credit report | Public record 7–10 sim-years |
| Housing | Mortgage denial 2–4 years; rental scrutiny |
| Employment | Some careers affected (finance, government) |
| Business | Ch 11 stigma; investor relationships damaged |
| Social | Family tension events; reputation hit |
| Assets | Ch 7: non-exempt liquidated |
| Future loans | Higher rates, shorter terms, co-signer required |

## 15.6 Exempt Assets (Ch 7 analog)

| Asset | Typical Treatment |
|---|---|
| Primary residence equity | Homestead exemption up to limit |
| Retirement accounts | Protected |
| Tools of trade | Partial protection |
| Vehicle | One vehicle up to value cap |
| Luxury assets | Non-exempt, liquidated |

## 15.7 Recovery Roadmap UI

Post-discharge screen shows phased plan:

| Phase | Timeframe | Goals |
|---|---|---|
| Stabilize | 0–6 months | Budget, secured card, emergency fund start |
| Rebuild | 6–24 months | Score 600+, on-time payments |
| Re-qualify | 2–4 years | Auto loan, rental approval |
| Normalize | 4–7 years | Mortgage possible, standard rates |
| Archive | 7–10 years | Bankruptcy falls off report |

## 15.8 AI Citizen Parity

AI citizens file bankruptcy under same rules. Media Engine may report local bankruptcy rates during recessions.

---

# 16. Living World Banking

## 16.1 Offline Progression

While player is away:

- Interest accrues on savings/loans
- Autopay executes
- Variable rates adjust on schedule
- Delinquency counters advance
- Bank policy tables may tighten (Economy credit cycle)

## 16.2 Bank Institution Behavior

NPC banks compete on:

| Dimension | Variation |
|---|---|
| Savings APY | ±0.25% from market |
| Loan rates | ±0.5% from market |
| Fees | Fee-free vs fee-heavy |
| Relationship | Long customer → better terms |
| Stability | Bank failure rare event (insured deposits) |

## 16.3 Deposit Insurance

Government policy sets insurance cap (e.g., $250,000 analog). Bank failure event:

- Insured deposits restored at new institution
- Uninsured excess lost
- Teaches concentration risk

## 16.4 Merger & Acquisition

Weak banks acquired by stronger institutions → account migration narrative, possible product changes.

---

# 17. Integration Contracts

## 17.1 Economy Engine (18)

| Economy Output | Banking Consumer |
|---|---|
| `policyRate` | Prime rate base |
| `annualInflationRate` | Real rate education, payment burden |
| `creditAvailability` | Underwriting strictness multiplier |
| `cyclePhase` | Default rate expectations |
| `housingPriceIndex` | LTV calculations |

| Banking Output | Economy Consumer |
|---|---|
| `banking.defaulted` | Credit spread input |
| Aggregate lending volume | Credit cycle feedback |

## 17.2 Tax Engine (13)

| Integration | Detail |
|---|---|
| Withholding | Payroll deposits net of tax |
| Interest income | 1099-INT analog reporting |
| Mortgage interest | Deduction data to tax filing |
| Early withdrawal penalties | Retirement account (Investment link) |

## 17.3 Investment Engine (12)

| Integration | Detail |
|---|---|
| Investment cash account | Settlement for trades |
| Margin loan | Appears as liability on dashboard |
| Dividend deposits | Credit transactions |

## 17.4 Career Engine

| Integration | Detail |
|---|---|
| Payroll direct deposit | Recurring credit |
| Garnishment | Court-ordered debit |

## 17.5 Housing Engine

| Integration | Detail |
|---|---|
| Mortgage origination | Collateral link |
| Escrow payments | Tax/insurance disbursement |
| Foreclosure | Title transfer, eviction narrative |

## 17.6 Company Engine

| Integration | Detail |
|---|---|
| Business accounts | Operating cash |
| Business loans | Company liability |
| Payroll batch | Outbound transfers |

## 17.7 Event Bus Summary

| Event | Direction |
|---|---|
| `banking.account_opened` | Publish |
| `banking.transaction_posted` | Publish |
| `banking.loan_approved` | Publish |
| `banking.loan_payment_missed` | Publish |
| `banking.defaulted` | Publish |
| `banking.credit_score_changed` | Publish |
| `economy.rate_changed` | Consume |
| `career.salary_changed` | Consume |
| `tax.withholding_assessed` | Consume |

---

# 18. Player Decision Flows

## 18.1 Should I Save or Pay Debt?

```
                    ┌─────────────────┐
                    │ Surplus cash    │
                    │ this month?     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌────────────────┐           ┌────────────────┐
     │ Emergency fund │           │ High-interest  │
     │ < 3 months?    │           │ debt > 8% APR? │
     └───────┬────────┘           └───────┬────────┘
             │ YES                        │ YES
             ▼                            ▼
     ┌────────────────┐           ┌────────────────┐
     │ Save to HYSA   │           │ Pay down debt  │
     └────────────────┘           └────────────────┘
             │ NO                         │ NO
             └──────────────┬───────────────┘
                            ▼
                   ┌────────────────┐
                   │ Compare savings│
                   │ APY vs debt APR│
                   └───────┬────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌────────────────┐        ┌────────────────┐
     │ APY < debt APR │        │ APY ≥ debt APR │
     │ → Pay debt     │        │ → Save/invest  │
     └────────────────┘        └────────────────┘
```

## 18.2 Should I Refinance My Mortgage?

| Condition | Recommendation |
|---|---|
| New rate ≥ 0.75% lower | Consider refinance |
| Break-even < planned years in home | Favorable |
| Credit score improved 40+ pts | Shop rates |
| ARM reset imminent | Evaluate fixed refi |

Player tool calculates break-even months including closing costs.

## 18.3 Credit Card Payoff Strategy

| Strategy | Best For | UI Support |
|---|---|---|
| Avalanche | Math optimal (highest APR first) | Auto-allocate slider |
| Snowball | Motivation (smallest balance first) | Balance-sorted list |
| Statement balance | Avoid interest | Pay-in-full reminder |
| Minimum only | Cash crisis (warn) | Cost of minimum calculator |

## 18.4 Loan Term Trade-off

```
Shorter term ──► Higher payment, less total interest, faster equity
Longer term  ──► Lower payment, more total interest, more flexibility
```

Interactive slider shows payment vs total interest in real time.

## 18.5 Bankruptcy vs Debt Workout

| Situation | Suggested Path |
|---|---|
| Temporary job loss | Forbearance, cut expenses |
| High income, high debt | Ch 13 reorganization |
| No income, high unsecured | Ch 7 evaluation |
| Business salvageable | Ch 11 |

Counselor NPC provides neutral comparison—not legal advice disclaimer displayed.

---

# 19. Events & Notifications

## 19.1 Notification Priority

| Priority | Examples |
|---|---|
| Critical | Overdraft, fraud alert, foreclosure notice |
| High | Payment due in 3 days, rate lock expiring |
| Medium | Statement ready, credit score change |
| Low | APY increase, product offer |

## 19.2 Notification Channels

| Channel | Use |
|---|---|
| In-app badge | All |
| Phone notification (in-world) | High+ |
| Email (in-world) | Statements, legal |
| Mail (in-world) | Discharge papers, denial letters |

## 19.3 World Memory Hooks

| Event | Archive |
|---|---|
| First account opened | Milestone |
| First loan | Milestone |
| Loan paid off | Celebration + history |
| Default | `DefaultRecord` |
| Bankruptcy discharge | Major inflection |
| Millionaire net worth | Optional milestone |

---

# 20. Accessibility & Financial Literacy

## 20.1 Plain Language Mode

Toggle replaces jargon:

| Standard | Plain |
|---|---|
| APR | Yearly borrowing cost |
| APY | Yearly savings earnings |
| DTI | Debt compared to income |
| Utilization | How much credit you're using |
| Amortization | Payment schedule over time |

## 20.2 Glossary Integration

Tap any underlined term → glossary popup per Product Bible § accessibility.

## 20.3 Visual Accessibility

| Requirement | Implementation |
|---|---|
| Color-blind safe | Teal/gold not sole indicator; patterns on charts |
| Screen reader | Account cards announce balance + type |
| Large text | Scales to 150% without layout break |
| Cognitive load | Progressive disclosure; advanced tabs |

## 20.4 Tutorial Integration

First bank visit triggers optional 3-step tour:

1. "This is your cash home base."
2. "Watch money in and out here."
3. "Your credit story lives here."

Skippable; never blocks simulation.

---

# 21. v1 Scope & Future Expansion

## 21.1 v1 In Scope

| Feature | Status |
|---|---|
| Checking, savings, business accounts | ✅ |
| Credit cards (3 tiers) | ✅ |
| Personal, auto, mortgage, business loans | ✅ |
| Credit score + factors | ✅ |
| Bankruptcy Ch 7/13 analog | ✅ |
| BankingDashboard layout | ✅ |
| Rate education tooltips | ✅ |
| Transaction history + categories | ✅ |

## 21.2 v1 Out of Scope

| Feature | Target |
|---|---|
| Joint/custodial accounts | v1.5 + Family |
| Crypto wallets | v2+ if approved |
| International wire FX | Trade expansion |
| P2P real-time payments | Fenix Network v2 |
| Full bank failure minigame | v2 |
| Credit repair scams (fraud edu) | v2 narrative |

## 21.3 Future: Relationship Banking

Long-tenure customers unlock:

- Dedicated relationship manager NPC
- Fee waivers
- Preferential rates (within symmetry rules)

---

# 22. Acceptance Criteria

## 22.1 Account Management

| ID | Criterion | Test |
|---|---|---|
| AC-B01 | Player can open checking and savings at NPC bank | E2E account creation |
| AC-B02 | Savings APY updates within 1 month of policy rate change | Event injection |
| AC-B03 | Transfers between own accounts post instantly | Ledger verification |
| AC-B04 | Business account requires company officer role | Permission test |

## 22.2 Credit & Cards

| ID | Criterion | Test |
|---|---|---|
| AC-B05 | Credit score displays 5 factors with ratings | UI inspection |
| AC-B06 | Hard pull reduces score and appears in inquiries | Score delta test |
| AC-B07 | Utilization > 30% triggers caution tooltip | Boundary test |
| AC-B08 | Minimum payment calculation matches disclosed formula | Math verification |

## 22.3 Loans

| ID | Criterion | Test |
|---|---|---|
| AC-B09 | Denied application shows ≥ 1 reason code + action | Denial flow |
| AC-B10 | Approved mortgage shows full amortization schedule | Schedule export |
| AC-B11 | Missed payment day 30 impacts credit score | Delinquency sim |
| AC-B12 | Auto repo triggers after contract threshold | Default sim |
| AC-B13 | Co-signer default impacts both credit profiles | Multi-citizen test |

## 22.4 Rates & Education

| ID | Criterion | Test |
|---|---|---|
| AC-B14 | Every loan product shows APR breakdown tooltip | UI audit |
| AC-B15 | Real rate alert when inflation > savings APY | Macro injection |
| AC-B16 | Rate change notification cites policy rate delta | Event trace |

## 22.5 Bankruptcy

| ID | Criterion | Test |
|---|---|---|
| AC-B17 | Filing triggers automatic stay on collections | State verification |
| AC-B18 | Ch 7 liquidates non-exempt assets per rules | Asset inventory |
| AC-B19 | Bankruptcy remains on credit report for 7–10 years | History query |
| AC-B20 | Recovery roadmap displays post-discharge | UI flow |

## 22.6 Parity & Integration

| ID | Criterion | Test |
|---|---|---|
| AC-B21 | AI citizen denied at same DTI threshold as player | Parity test |
| AC-B22 | `economy.rate_changed` propagates to variable APR within 1 cycle | Integration |
| AC-B23 | Payroll deposit net of tax withholding | Tax integration |
| AC-B24 | Dashboard net worth matches sum of linked engines | Reconciliation |

## 22.7 Performance

| ID | Criterion | Test |
|---|---|---|
| AC-B25 | Dashboard loads < 500ms with 1000 transactions | Perf test |
| AC-B26 | Credit score recompute only on dirty citizens | Profiler |

---

# 23. QA Scenarios

## 23.1 Happy Path — New Graduate

1. Open checking at age 22
2. Receive first salary deposit
3. Open starter credit card, make small purchases
4. Pay statement in full 6 months
5. Score rises above 700
6. Pre-qualify for auto loan
7. Purchase vehicle at 60-month term
8. Verify dashboard reflects all accounts

## 23.2 Stress Path — Recession

1. Economy enters recession (`economy.recession_entered`)
2. Player loses job (Career Engine)
3. Miss 2 mortgage payments
4. Credit score drops; collections contact
5. Attempt refinance — denied (DTI, employment)
6. Evaluate bankruptcy counselor options

## 23.3 Exploit Attempt — Credit Gaming

1. Player opens 10 cards in 30 days
2. System applies inquiry impact + velocity flags
3. Subsequent approvals denied (`NEW_CREDIT_VELOCITY`)
4. Verify no player-only bypass

## 23.4 Business Owner Path

1. Open business account on incorporation
2. Receive revenue deposits
3. Apply for line of credit with personal guarantee
4. Miss business LOC payment
5. Personal credit impacted (guarantee link)

## 23.5 Succession Path

1. Player dies with outstanding mortgage
2. Estate settlement holds account
3. Beneficiary assumes loan or pays off
4. Verify ledger continuity in World Memory

---

# 24. Glossary

| Term | Definition |
|---|---|
| APR | Annual Percentage Rate — yearly cost of borrowing including certain fees |
| APY | Annual Percentage Yield — effective yearly return on savings including compounding |
| Amortization | Gradual repayment of loan principal over time via scheduled payments |
| Automatic stay | Legal halt on collection actions upon bankruptcy filing |
| Collateral | Asset pledged to secure a loan |
| DTI | Debt-to-Income ratio — monthly debt payments divided by gross monthly income |
| Escrow | Funds held by lender for property tax and insurance payments |
| Foreclosure | Lender seizure of property after mortgage default |
| Hard pull | Credit inquiry that affects score |
| LTV | Loan-to-Value ratio — loan amount divided by collateral value |
| PMI | Private Mortgage Insurance — required when LTV > 80% |
| Prime rate | Base lending rate banks charge preferred customers |
| Principal | Original loan amount or remaining balance excluding interest |
| Soft pull | Credit check that does not affect score |
| Utilization | Credit card balances as percentage of total limits |
| Variable rate | Interest rate that adjusts with market conditions |

---

## Document Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Lead Systems Designer | Initial canonical release |

---

*End of Document 11 — Banking & Finance Design*
