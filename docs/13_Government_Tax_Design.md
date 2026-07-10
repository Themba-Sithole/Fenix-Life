# Fenix Life — Government & Tax Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Government, Taxation & Civic Systems Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Chief Economist  
**Audience:** Game Design, Engineering, UX, QA, Narrative, Live Ops  

---

## Document Authority

This document defines **how players experience taxation, government services, civic participation, and policy impact** in Fenix Life. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Financial literacy, institutional simulation, consequence |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Living World, Citizen Equality |
| [05_Economy_Design.md](./05_Economy_Design.md) | Player-facing macro economy framing (planned companion) |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Fiscal multiplier, automatic stabilizers, debt sustainability |
| [11_Banking_Finance_Design.md](./11_Banking_Finance_Design.md) | Withholding, refunds, transaction categories |
| [12_Investment_Markets_Design.md](./12_Investment_Markets_Design.md) | Capital gains, retirement tax treatment |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Government Engine §4.10, Tax Engine §4.11 |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | `TaxAssessment`, `TaxFiling`, policy entities |

**Division of authority:**

| Owns | Does Not Own |
|---|---|
| Player tax filing UX & education | Macro GDP formulas (Economy Engine) |
| Government services player access | Full legislative simulation depth (v2) |
| Policy impact player explanations | Banking ledger (Banking Engine) |
| Election player experience (v1 scope) | Corporate governance elections |
| Deduction/credit player workflows | NPC-only agency back-office |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Five Capitals Alignment](#2-philosophy--five-capitals-alignment)
3. [Design Goals & Anti-Goals](#3-design-goals--anti-goals)
4. [Government Hub Screen Architecture](#4-government-hub-screen-architecture)
5. [Tax System Overview](#5-tax-system-overview)
6. [Income Tax — Player View](#6-income-tax--player-view)
7. [Business & Corporate Tax](#7-business--corporate-tax)
8. [Property Tax](#8-property-tax)
9. [Sales & Consumption Tax](#9-sales--consumption-tax)
10. [Capital Gains & Investment Tax](#10-capital-gains--investment-tax)
11. [Payroll Tax & Withholding](#11-payroll-tax--withholding)
12. [Filing Returns — Player Flow](#12-filing-returns--player-flow)
13. [Deductions & Credits](#13-deductions--credits)
14. [Audits, Penalties & Disputes](#14-audits-penalties--disputes)
15. [Government Services](#15-government-services)
16. [Elections (v1 Scope)](#16-elections-v1-scope)
17. [Policy Impact on Player](#17-policy-impact-on-player)
18. [Living World Government](#18-living-world-government)
19. [Integration Contracts](#19-integration-contracts)
20. [Player Decision Flows](#20-player-decision-flows)
21. [Events & Notifications](#21-events--notifications)
22. [Accessibility & Financial Literacy](#22-accessibility--financial-literacy)
23. [v1 Scope & Future Expansion](#23-v1-scope--future-expansion)
24. [Acceptance Criteria](#24-acceptance-criteria)
25. [QA Scenarios](#25-qa-scenarios)
26. [Glossary](#26-glossary)

---

# 1. Executive Summary

Government & Tax is the **player's interface to civic obligation and public benefit**—where earned wealth meets societal contribution, where policy changes rewrite the rules of play, and where voting (when available) connects personal interest to collective outcome.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   GOVERNMENT & TAX — PLAYER JOURNEY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  EARN               COMPLY              OPTIMIZE            PARTICIPATE      │
│  ────               ──────              ────────            ───────────      │
│  Income flows   →   Withholding     →   Deductions     →  Vote (v1)         │
│  Business profit    File returns        Credits             Track policy     │
│  Investments        Pay on time       Retirement          Use services     │
│                                                                              │
│         ▲                    ▲                    ▲                        │
│         │                    │                    │                        │
│    Career Engine         Banking Engine       Economy Engine                 │
│    (W-2/1099)            (payments)           (fiscal policy)                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core player promise:** Taxes are not a hidden skim—they are visible, learnable, and optimizable within ethical bounds. Government is not a menu—it is an institution that responds to economic conditions and player votes.

| Pillar | Government/Tax Expression |
|---|---|
| **Obligation** | Everyone pays under same brackets |
| **Literacy** | Filing teaches real-world concepts |
| **Agency** | Deduction choices matter |
| **Consequence** | Late filing, audits, penalties real |
| **Civics** | Policy connects macro to pocketbook |

---

# 2. Philosophy & Five Capitals Alignment

## 2.1 Financial Capital — Primary

| Component | Tax/Government Touchpoint |
|---|---|
| Income | W-2, 1099, business income reporting |
| Expenses | Deductible categories reduce liability |
| Assets | Property tax on real estate |
| Investments | Capital gains, dividend tax |
| Cash flow | Refunds vs balance due affect liquidity |
| Net worth | Estate tax on large transfers (v1.5) |

## 2.2 Human Capital — Secondary

| Link | Mechanism |
|---|---|
| Education | Student loan interest deduction |
| Career | Professional license fees (government service) |
| Skills | Tax complexity unlocks accountant career path |
| Health | Healthcare subsidy eligibility (policy) |

## 2.3 Social Capital — Tertiary

| Link | Mechanism |
|---|---|
| Community services | Parks, libraries, transit quality |
| Political engagement | Elections, town halls |
| Reputation | Tax fraud scandal (Media Engine) |
| Family | Dependent credits, filing status |

## 2.4 Business Capital — Bridge

| Link | Mechanism |
|---|---|
| Corporate tax | Company profitability after tax |
| Business deductions | Operating expense optimization |
| Regulatory compliance | Government enforcement |
| Government contracts | B2G revenue opportunity (v2) |

## 2.5 Legacy Capital — Long Arc

| Mechanism | Role |
|---|---|
| Estate tax | Generational wealth transfer |
| Trust structures | v2 tax planning |
| Policy memory | World Memory archives rate changes |
| Inheritance basis | Step-up rules affect heirs |

## 2.6 Constitutional Checks

1. Does the AI citizen pay identical tax on identical income?
2. Can players trace tax owed to visible income sources?
3. Do policy changes emerge from government simulation, not designer whim?
4. Are government services quality-linked to tax revenue (Living World)?
5. Is tax optimization gameplay ethical (no fraud reward)?

---

# 3. Design Goals & Anti-Goals

## 3.1 Goals

| ID | Goal | Success Signal |
|---|---|---|
| G1 | Player understands annual tax obligation before filing | Pre-fill summary accuracy |
| G2 | Filing completes in < 15 minutes (simple return) | UX timing study |
| G3 | Policy change impact explained in pocketbook terms | Briefing engagement |
| G4 | Deduction choices show dollar impact | Live calculator |
| G5 | Government services feel responsive to funding | Service quality index |
| G6 | Elections (v1) connect vote to policy platform | Post-election survey |

## 3.2 Anti-Goals

| ID | Anti-Goal | Why |
|---|---|---|
| A1 | Opaque tax calculation | Violates literacy mission |
| A2 | Player tax immunity | Citizen Equality |
| A3 | Fraud as optimal strategy | Ethics + legal realism |
| A4 | Real political party branding | Neutrality + legal |
| A5 | Tax as pure punishment | Must show service return |
| A6 | 50-form nightmare in v1 | Progressive complexity |

---

# 4. Government Hub Screen Architecture

v1 introduces **Government Hub** as civic counterpart to BankingDashboard and StockMarket.

## 4.1 Screen Regions

| Region | Content | Data Source |
|---|---|---|
| Hero header | Jurisdiction name, tax year | `CitizenJurisdiction` |
| Tax summary card | YTD withheld, estimated liability, refund projection | `TaxEstimateSnapshot` |
| Filing status | Not started / In progress / Filed / Amended | `TaxFiling.status` |
| Policy briefing | Active policies affecting player | `PolicyRegime.activeRules` |
| Services grid | Available government services | `GovernmentService[]` |
| Civic panel | Election info, voter registration | `ElectionCalendar` |
| Documents | W-2, 1099, property tax bills | `TaxDocument[]` |

## 4.2 Navigation

| Route | Purpose |
|---|---|
| `/government` | Hub home |
| `/government/tax` | Tax center |
| `/government/tax/file` | Filing wizard |
| `/government/tax/documents` | Tax documents inbox |
| `/government/services` | Service directory |
| `/government/policy` | Policy tracker |
| `/government/elections` | Election center (v1) |
| `/government/audits` | Audit status (if applicable) |

## 4.3 Visual Language

Consistent with [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md):

| Element | Usage |
|---|---|
| Fenix Teal | Refunds, credits, positive civic outcomes |
| Fenix Gold | Deadlines, amounts due, warnings |
| Navy gradient | Official government header |
| Seal iconography | Jurisdiction branding (procedural) |

## 4.4 Tax Season Calendar Widget

| Period | Highlight |
|---|---|
| Jan 1 – Jan 31 | W-2/1099 arrival |
| Feb – Mar | Filing preparation |
| Apr 1 – Apr 15 | Peak filing (deadline) |
| Apr 16+ | Late filing penalties accrue |
| Oct 15 | Extension deadline |

Player notifications align with calendar.

---

# 5. Tax System Overview

## 5.1 Jurisdiction Model

v1: Single federal + state jurisdiction per world (configurable at world gen).

| Layer | Authority | Examples |
|---|---|---|
| Federal | National government | Income tax, payroll tax, corporate tax |
| State | State government | State income tax, sales tax |
| Local | City/county | Property tax, local income (some worlds) |

Player sees **combined effective rate** with drill-down by layer.

## 5.2 Tax Types Matrix (v1)

| Tax Type | ID | Base | Payer | Filing Frequency |
|---|---|---|---|---|
| Federal income | `fed_income` | Taxable income | Individual | Annual |
| State income | `state_income` | Taxable income | Individual | Annual |
| Payroll (FICA analog) | `payroll` | Wages | Employee+employer | Per paycheck |
| Corporate income | `corp_income` | Business profit | Company | Annual |
| Capital gains | `cap_gains` | Investment profit | Individual | Annual (+ estimated) |
| Dividend | `dividend` | Dividend income | Individual | Annual |
| Property | `property` | Assessed value | Owner | Annual/semi-annual |
| Sales/VAT | `sales` | Purchase price | Consumer (embedded) | Point of sale |
| Estate | `estate` | Estate value | Estate | On death (v1.5) |
| Gift | `gift` | Gift value | Donor | Annual (v1.5) |

## 5.3 Taxable Income Pipeline (Individual)

```
Gross Income (all sources)
  − Above-the-line deductions (IRA, student loan interest, etc.)
  = Adjusted Gross Income (AGI)
  − Standard or Itemized deductions
  − Qualified business income deduction (if applicable)
  = Taxable Income
  × Bracket rates (marginal)
  − Credits (child, education, energy, etc.)
  = Tax Liability
  − Withholding + estimated payments
  = Refund or Balance Due
```

Player sees each step in filing wizard with expandable explanations.

## 5.4 Marginal vs Effective Rate Education

| Rate Type | Definition | Display |
|---|---|---|
| Marginal | Tax on next dollar earned | Bracket chart highlight |
| Effective | Total tax / total income | Summary percentage |
| Cap gains | Separate schedule | Investment section |

Example tooltip: "Your marginal rate is 24% but your effective rate is 16.2% because lower brackets apply first."

## 5.5 Tax Year Alignment

Tax year = sim calendar year (Jan 1 – Dec 31). Filing due April 15 following year. Extensions to October 15.

---

# 6. Income Tax — Player View

## 6.1 Income Sources

| Source | Form Analog | Engine Source |
|---|---|---|
| W-2 wages | W-2 | Career Engine payroll |
| Self-employment | Schedule C | Company sole prop / freelance |
| Rental income | Schedule E | Housing Engine |
| Interest | 1099-INT | Banking Engine |
| Dividends | 1099-DIV | Investment Engine |
| Capital gains | 1099-B | Investment Engine |
| Unemployment | 1099-G | Career Engine |
| Social security | 1099-SSA | Government benefits (age) |
| Alimony | 1099 (legacy rules) | Family Engine |

## 6.2 W-2 Breakdown (Player Document)

| Box | Content | Player Relevance |
|---|---|---|
| Wages | Gross salary | Income starting point |
| Federal withheld | Tax already paid | Reduces balance due |
| State withheld | State prepayment | State return |
| Social security | FICA employee | Retirement benefit credit |
| Medicare | Medicare tax | Healthcare funding |
| Retirement deferral | 401(k) pre-tax | Reduces taxable wages |
| Health insurance | Pre-tax premium | Reduces taxable wages |

## 6.3 Filing Status

| Status | ID | Typical Use |
|---|---|---|
| Single | `single` | Unmarried |
| Married filing jointly | `mfj` | Married couple combined |
| Married filing separately | `mfs` | Rare, special cases |
| Head of household | `hoh` | Single with dependents |

Status affects brackets and credits. Family Engine marital state auto-suggests; player confirms.

## 6.4 Dependents

| Rule | Detail |
|---|---|
| Qualifying child | Age, relationship, support tests |
| Qualifying relative | Support, income limits |
| Credit | Child Tax Credit per dependent |
| Benefits | SNAP eligibility (policy) |

Dependent roster pulled from Family Engine.

## 6.5 Standard vs Itemized Decision Assistant

```
Standard deduction: $14,600

Your potential itemized:
  Mortgage interest     $12,400
  State/local taxes     $8,200 (capped at $10,000)
  Charitable gifts      $2,100
  Medical (> 7.5% AGI)  $0
  ─────────────────────────────
  Total itemized        $22,700

Recommendation: Itemize (saves ~$1,940 vs standard)
```

Player can override with acknowledgment.

## 6.6 Income Tax Brackets (Federal Analog v1)

| Bracket | Single Income | Rate |
|---|---|---|
| 1 | $0 – $11,600 | 10% |
| 2 | $11,601 – $47,150 | 12% |
| 3 | $47,151 – $100,525 | 22% |
| 4 | $100,526 – $191,950 | 24% |
| 5 | $191,951 – $243,725 | 32% |
| 6 | $243,726 – $609,350 | 35% |
| 7 | $609,351+ | 37% |

Brackets indexed annually to inflation per Government policy (Economy Engine linkage).

---

# 7. Business & Corporate Tax

## 7.1 Business Entity Types

| Entity | Tax Treatment | Player Context |
|---|---|---|
| Sole proprietorship | Schedule C on personal return | Side hustle |
| LLC (disregarded) | Pass-through to owner | Small business |
| S-Corporation | Pass-through, salary requirement | Growing company |
| C-Corporation | Entity-level 21% + dividend tax | Large company / IPO path |

## 7.2 Schedule C (Sole Prop) — Player View

| Line | Category | Examples |
|---|---|---|
| Income | Gross receipts | Sales, services |
| Expenses | COGS, rent, supplies, travel | Company Engine categories |
| Net profit | Income − expenses | Flows to Form 1040 |
| SE tax | Self-employment tax | 15.3% on 92.35% of net |

## 7.3 Corporate Tax Return (Form 1120 Analog)

Company Engine generates; player reviews if officer:

| Item | Detail |
|---|---|
| Gross revenue | Top line |
| Deductions | Salaries, depreciation, interest |
| Taxable income | Pre-tax profit |
| Tax rate | 21% federal flat (v1 analog) |
| Credits | R&D, energy (policy) |
| Tax due | Quarterly estimated payments |

## 7.4 Quarterly Estimated Taxes

Self-employed and investors with large gains must pay quarterly:

| Quarter | Due Date |
|---|---|
| Q1 | April 15 |
| Q2 | June 15 |
| Q3 | September 15 |
| Q4 | January 15 |

Underpayment penalty if < 90% of annual liability. Calculator in Government Hub.

## 7.5 Business Deductions (Common)

| Deduction | Rule | Player UI |
|---|---|---|
| Home office | Exclusive use test | Square footage calculator |
| Vehicle | Standard mileage or actual | Mileage log link |
| Equipment | Section 179 / depreciation | Asset purchase link |
| Meals | 50% deductible | Category tag |
| Interest | Business loan interest | Banking link |

## 7.6 Pass-Through Deduction (QBI)

20% deduction on qualified business income for eligible entities. Simplified eligibility wizard for player.

---

# 8. Property Tax

## 8.1 Assessment Model

```
annualPropertyTax = assessedValue × millRate

assessedValue = marketValue × assessmentRatio (typically 80–100%)
millRate = set by local government per $1,000 value
```

## 8.2 Player Property Tax Bill

| Field | Example |
|---|---|
| Property address | 742 Maple St |
| Assessed value | $420,000 |
| Mill rate | 18.5 mills |
| Annual tax | $7,770 |
| Payment schedule | Semi-annual (Apr/Oct) |
| Escrow | Included in mortgage? Y/N |

## 8.3 Assessment Appeals

Player may appeal if market value diverges:

| Step | Timeline |
|---|---|
| File appeal | Within 30 days of notice |
| Review | 30–60 sim-days |
| Outcome | Reduced assessment or upheld |

Housing Engine provides comparable sales data for appeal UI.

## 8.4 Property Tax Deduction

State and local tax (SALT) deduction capped at $10,000 on federal return. Player sees:

```
Property tax $7,770 + State income tax $5,200 = $12,970
SALT cap limits deduction to $10,000
```

## 8.5 Delinquency Consequences

| Stage | Consequence |
|---|---|
| 30 days late | Penalty + interest |
| 1 year | Tax lien on property |
| 3+ years | Tax sale / foreclosure risk |

---

# 9. Sales & Consumption Tax

## 9.1 Point-of-Sale Model

Sales tax applied at transaction (abstracted in purchase UI):

```
itemPrice = $100.00
salesTaxRate = 7.25% (state + local combined)
total = $107.25
```

Receipt shows tax line. No separate filing for consumers.

## 9.2 Rate Variation

| Jurisdiction | Combined Rate Range |
|---|---|
| State A | 5.0% – 9.5% |
| State B | 0% (no sales tax) |
| Local overlay | +0% – 3% |

Player relocating experiences rate change—teaches geographic tax planning.

## 9.3 Taxable vs Exempt Categories

| Category | Typical Treatment |
|---|---|
| Groceries | Exempt or reduced |
| Clothing | Taxable (varies) |
| Prescription drugs | Exempt |
| Services | Partially taxable |
| Digital goods | Taxable |
| Business inputs | Resale exemption (B2B) |

## 9.4 Business Sales Tax Collection

Company selling goods must collect and remit:

| Step | Detail |
|---|---|
| Register | Sales tax permit |
| Collect | At point of sale |
| File | Monthly/quarterly return |
| Remit | Payment to government |

Company Engine handles; player reviews as business owner.

## 9.5 VAT Analog (International Worlds)

Expansion worlds may use VAT instead of sales tax—displayed as inclusive price with VAT breakdown on receipt.

---

# 10. Capital Gains & Investment Tax

## 10.1 Gain Classification

| Type | Holding Period | Federal Rate (v1 analog) |
|---|---|---|
| Short-term | ≤ 12 months | Ordinary income brackets |
| Long-term | > 12 months | 0% / 15% / 20% |
| Collectibles | Any | 28% max |

## 10.2 Cost Basis Tracking

Investment Engine provides per-lot basis:

| Lot | Shares | Buy Date | Basis | Gain/Loss |
|---|---|---|---|---|
| 1 | 100 | 2022-03-15 | $15,000 | +$3,200 |
| 2 | 50 | 2024-01-10 | $9,500 | −$1,200 |

Default lot selection: FIFO (player can choose specific lot v1.5).

## 10.3 Wash Sale Rule

Sell at loss and rebuy within 30 days → loss disallowed, added to new basis.

```
"You sold FXAP at a $1,200 loss on Mar 1.
You repurchased Mar 15. Loss deferred to new shares."
```

## 10.4 Dividend Tax

| Type | Requirement | Rate |
|---|---|---|
| Qualified | US company, 60+ day hold | 0/15/20% |
| Ordinary | Non-qualified | Ordinary rates |

1099-DIV breakdown on tax documents.

## 10.5 Net Investment Income Tax (NIIT)

3.8% surtax on investment income if MAGI > $200K single / $250K MFJ. Calculator shows threshold proximity.

## 10.6 Tax-Loss Harvesting Integration

Investment Engine suggests harvests; Tax Engine validates wash sale and reports on return.

---

# 11. Payroll Tax & Withholding

## 11.1 Paycheck Withholding

Each payroll deposit:

```
Gross pay                    $5,000
− 401(k) pre-tax              −$300
− Health insurance            −$150
= Taxable wages              $4,550
− Federal income tax          −$680
− State income tax            −$210
− Social Security (6.2%)      −$282
− Medicare (1.45%)            −$66
= Net pay                    $3,312
```

Pay stub available in Career + Banking UI.

## 11.2 W-4 Equivalent Settings

Player adjusts withholding allowances:

| Setting | Effect |
|---|---|
| Filing status | Bracket tables |
| Dependents | Credit reduces withholding |
| Additional withholding | Extra $ per paycheck |
| Multiple jobs | Secondary job higher withholding |

Withholding estimator tool: "Will I owe or get refund?"

## 11.3 Employer Payroll Taxes (Business Owner View)

| Tax | Rate | Paid By |
|---|---|---|
| Social Security | 6.2% | Employer match |
| Medicare | 1.45% | Employer match |
| FUTA | 0.6% | Employer |
| SUTA | Varies | Employer |

Displayed in Company Engine payroll summary.

## 11.4 Year-End Reconciliation

```
Total tax liability (calculated on return):  $18,400
Total withholding + estimated payments:      $17,200
Balance due:                                 $1,200
```

Or refund if overpaid.

---

# 12. Filing Returns — Player Flow

## 12.1 Filing Wizard Stages

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Gather   │──►│ Review   │──►│ Deductions│──►│ Credits  │──►│ Submit   │
│ Documents│   │ Income   │   │ & Status │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

## 12.2 Stage 1 — Gather Documents

| Document | Auto-Import | Status |
|---|---|---|
| W-2 | ✅ Career Engine | Received Jan 31 |
| 1099-INT | ✅ Banking | Received |
| 1099-DIV | ✅ Investment | Received |
| 1099-B | ✅ Investment | Received |
| 1098 (mortgage interest) | ✅ Housing | Received |
| 1098-E (student loan) | ✅ Banking | Received |
| Property tax statement | ✅ Housing | Received |

Missing document: flag + estimate warning.

## 12.3 Stage 2 — Review Income

Aggregated income by category with drill-down to source transactions. Player confirms or flags error.

## 12.4 Stage 3 — Deductions & Status

- Filing status selection
- Dependent confirmation
- Standard vs itemized comparison
- Above-the-line deductions (IRA, HSA, student loan interest)

## 12.5 Stage 4 — Credits

| Credit | Eligibility Check |
|---|---|
| Child Tax Credit | Dependents under 17 |
| EITC | Income + dependents |
| Education (AOTC/LLC) | Tuition payments (Education Engine) |
| Energy | Home improvement (Housing) |
| EV | Vehicle purchase (Vehicle) |

Each credit: eligibility quiz → dollar amount.

## 12.6 Stage 5 — Submit

| Element | Detail |
|---|---|
| Summary | Liability, payments, refund/due |
| E-file | Instant submission |
| Payment | ACH from checking if balance due |
| Refund | Direct deposit in 10–21 sim-days |
| Confirmation | Filing receipt + PDF |

## 12.7 Filing Complexity Tiers

| Tier | Profile | Forms |
|---|---|---|
| Simple | W-2 only, standard deduction | 1040 (short) |
| Standard | W-2 + investments + mortgage | 1040 + schedules |
| Complex | Business + rental + multiple states | Full suite |
| Expert | Amended, prior year | Accountant NPC hire |

## 12.8 Extensions

File Form 4868 analog by April 15:

- Extends filing to October 15
- Does NOT extend payment obligation
- Estimate and pay balance due by April 15

## 12.9 Amended Returns

Discover error post-filing:

- File amended return within 3 years
- Additional refund or balance due
- Audit risk slight increase if large change

---

# 13. Deductions & Credits

## 13.1 Above-the-Line Deductions

| Deduction | Max (v1 analog) | Engine Link |
|---|---|---|
| Traditional IRA | $7,000 | Investment retirement |
| HSA | $4,150 / $8,300 family | Healthcare |
| Student loan interest | $2,500 | Education/Banking |
| Self-employment tax | 50% of SE tax | Schedule C |
| Educator expenses | $300 | Career |

## 13.2 Itemized Deductions

| Deduction | Cap/Rule |
|---|---|
| SALT | $10,000 combined |
| Mortgage interest | $750K loan limit (post-2017 homes) |
| Charitable | 60% AGI cash / 30% appreciated |
| Medical | > 7.5% AGI threshold |
| Casualty | Disaster-declared areas |

## 13.3 Credits vs Deductions Education

```
$1,000 credit  = $1,000 off tax bill (dollar for dollar)
$1,000 deduction at 22% bracket = $220 off tax bill

Credits are more valuable per dollar.
```

Interactive comparison in filing wizard.

## 13.4 Retirement Tax Advantages

| Account | Contribution | Withdrawal |
|---|---|---|
| Traditional 401(k)/IRA | Pre-tax (deductible) | Taxed as income |
| Roth 401(k)/IRA | After-tax | Tax-free |
| HSA (qualified) | Pre-tax | Tax-free for medical |

Lifetime tax savings projector for retirement contributions.

## 13.5 Charitable Giving

| Method | Deduction |
|---|---|
| Cash donation | Receipt from NPC charity |
| Appreciated stock | Fair market value, no cap gains |
| Volunteer mileage | $0.14/mile (not time) |

Donation tracker integrated with transaction categorization.

---

# 14. Audits, Penalties & Disputes

## 14.1 Audit Selection

Statistical model (not player-targeted):

```
auditProbability = f(income, deductions, random, anomalies)

anomaly flags:
  - Deductions > 150% peer average
  - Round numbers on Schedule C
  - Large charitable without documentation
  - Crypto-equivalent unreported (v2)
```

AI citizens audited under same rules.

## 14.2 Audit Flow

```
Notice of audit (mail + Government Hub)
    │
    ├─► 30 days to respond with documentation
    │
    ├─► Review period (30–90 sim-days)
    │
    ├─► Outcome:
    │       ├─ No change
    │       ├─ Additional tax + interest
    │       └─ Penalty (negligence or fraud)
    │
    └─► Appeal option (30 days)
```

## 14.3 Penalties

| Violation | Penalty |
|---|---|
| Late filing | 5%/month, max 25% |
| Late payment | 0.5%/month |
| Underpayment (estimated) | Interest + possible penalty |
| Negligence | 20% of underpayment |
| Fraud | 75% + criminal narrative (extreme) |

## 14.4 Interest on Balance Due

```
interestRate = federalShortTermRate + 3%
compounded daily
```

Displayed on penalty notice with calculation breakdown.

## 14.5 Payment Plans

Balance due > $1,000:

| Option | Terms |
|---|---|
| Short-term | 180 days, no setup fee |
| Installment agreement | Up to 72 months, setup fee |
| Offer in compromise | Rare, hardship-based (v2) |

## 14.6 Fraud Gameplay Boundary

**Intentional fraud is not rewarded.** Hidden income discovered in audit → penalties + reputation damage + Media scandal. Game teaches compliance, not evasion optimization.

---

# 15. Government Services

## 15.1 Service Quality Model

```
serviceQualityIndex = f(fundingLevel, policyPriority, economy.health, corruption)

fundingLevel = taxRevenue × allocationPercent
```

Player experiences quality through wait times, availability, and NPC feedback.

## 15.2 Service Catalog (v1)

| Service | Agency Analog | Player Use |
|---|---|---|
| DMV / Licensing | Motor Vehicles | Driver license, vehicle registration |
| Passport / ID | Civil Registry | Travel expansion hook |
| Unemployment benefits | Labor Dept | Career job loss |
| SNAP / Food assistance | Social Services | Low income support |
| Medicare / Medicaid | Health Services | Age/income eligibility |
| Social Security | Retirement Admin | Benefit statements |
| Small business permit | Commerce Dept | Company formation |
| Building permit | Zoning Office | Housing renovation |
| Public library | Cultural Services | Education boost |
| Parks & recreation | Parks Dept | Social capital |
| Public transit pass | Transit Authority | Transportation |
| Voting registration | Elections Office | Civic participation |
| Tax assistance | Revenue Service | Free filing help (income limit) |
| Disaster relief | Emergency Mgmt | Weather event response |

## 15.3 Service Interaction UI

| Element | Detail |
|---|---|
| Wait time | Sim-days based on quality index |
| Appointment | Schedule or walk-in |
| Fee | Service fee (some free) |
| Outcome | License issued, benefit approved/denied |
| Appeal | Denied benefits appeal path |

## 15.4 Benefit Eligibility

Example — Unemployment:

| Requirement | Check |
|---|---|
| Lost job through no fault | Career event |
| Worked 12+ months | Employment history |
| Actively seeking work | Job search actions |
| Weekly certification | Player checkbox weekly |

Benefits amount tied to prior wages (percentage cap).

## 15.5 Infrastructure Visibility

Government spending on infrastructure affects:

| Player Touchpoint | Effect |
|---|---|
| Commute time | Transportation Engine |
| Property values | Housing Engine |
| Business logistics | Company operating costs |
| Internet speed | Career remote work (flavor) |

Player sees infrastructure map with project status.

---

# 16. Elections (v1 Scope)

## 16.1 v1 Election Scope

v1 includes **simplified federal election cycle** every 4 sim-years:

| Office | Player Interaction |
|---|---|
| President / Executive | Vote on policy platform |
| Congressional analog | Regional representative (flavor) |
| Local mayor | City services funding (optional) |

**Not in v1:** Full primary season, campaign management career, gerrymandering simulation.

## 16.2 Policy Platforms

Fictional parties with procedural names:

| Party | Platform Summary | Tax Stance | Spending Stance |
|---|---|---|---|
| Progressive Alliance | Social investment | Higher on top earners | High services |
| Centrist Coalition | Balanced budget | Moderate | Moderate |
| Liberty Front | Low tax | Lower all brackets | Reduced services |
| Green Future | Climate focus | Carbon tax | Green infrastructure |

Platforms affect Government Engine policy weights if elected—not scripted player buffs.

## 16.3 Voter Registration

| Step | Detail |
|---|---|
| Register | Age 18+, citizenship, address |
| Status | Active / inactive |
| Method | Online (Government Hub) or in-person |
| Deadline | 30 days before election |

## 16.4 Election Day Flow

```
Election week notification
    │
    ├─► Review candidate platforms (policy comparison tool)
    │
    ├─► "How this affects your taxes" personalized estimate
    │
    ├─► Cast vote (in-person or mail-in/absentee)
    │
    ├─► Results night (Media Engine coverage)
    │
    └─► Policy transition (lame duck → inauguration)
```

## 16.5 Policy Comparison Tool

| Issue | Candidate A | Candidate B |
|---|---|---|
| Top tax bracket | 39.6% | 33% |
| Corporate tax | 28% | 18% |
| Healthcare spending | +15% | −5% |
| Infrastructure | +$50B | +$20B |
| Your estimated annual tax change | +$1,200 | −$800 |

Based on player's actual income/assets—not generic.

## 16.6 Non-Voter Consequences

No penalty for not voting (jurisdiction config). However:

- Social capital flavor dialogue from politically engaged NPCs
- Policy still changes based on aggregate NPC + player votes
- Living World: world moves regardless

## 16.7 Post-Election Policy Implementation

| Timeline | Event |
|---|---|
| Month 0 | Election results |
| Month 1–3 | Cabinet formation, budget proposal |
| Month 4–6 | Legislative passage (simplified) |
| Month 7+ | `government.policy_enacted` → Tax/Economy update |

Player briefing: "New tax brackets effective next tax year."

---

# 17. Policy Impact on Player

## 17.1 Policy Dimensions

| Policy Area | Player Impact Channel |
|---|---|
| Tax brackets | Filing liability |
| Standard deduction | Itemize decision |
| Corporate rate | Business profit |
| Capital gains rate | Investment strategy |
| Sales tax rate | Consumption cost |
| Property tax cap | SALT deduction |
| Minimum wage | Employee costs / wages |
| Interest deductibility | Mortgage benefit |
| Student loan forgiveness | Debt relief event |
| Carbon tax | Fuel, energy costs |
| Tariffs | Import prices (Economy) |
| Healthcare subsidy | Insurance premium |
| Retirement limits | 401(k)/IRA caps |

## 17.2 Policy Change Notification

```
Policy Change Briefing

Effective: January 1, next tax year
Change: Top marginal rate 37% → 39.6%
Your estimated impact: +$2,400/year based on current income
Reason: Progressive Alliance campaign promise enacted

[View Full Policy] [Adjust Withholding] [Talk to Accountant]
```

## 17.3 Pocketbook Calculator

Player enters hypothetical:

- Income change
- New dependent
- Home purchase
- Business expansion

Shows tax impact under current vs proposed policy.

## 17.4 Automatic Stabilizers (Player Visible)

During recession (Economy Engine):

| Stabilizer | Player Experience |
|---|---|
| Unemployment benefits | Automatic if eligible |
| Progressive tax | Lower liability as income drops |
| Stimulus check | One-time government payment (policy) |
| SNAP expansion | Easier eligibility |

During boom:

| Effect | Player Experience |
|---|---|
| Bracket creep | Higher effective rate if not indexed |
| Reduced benefits | Stimulus programs sunset |
| Rate hikes | Economy Engine monetary policy |

## 17.5 Debt Ceiling / Fiscal Crisis (Rare Event)

Government debt-to-GDP extreme → political crisis narrative:

- Potential government shutdown
- Service quality drops
- Delayed tax refunds
- Market volatility (Investment)

Emergent from simulation, not scheduled.

---

# 18. Living World Government

## 18.1 Offline Progression

While player away:

- Withholding continues per paycheck
- Property tax due dates advance
- Election cycles progress
- Audit timers count down
- Policy implementation proceeds
- Benefit certifications expire if not renewed

## 18.2 NPC Civic Behavior

AI citizens vote based on CDPS traits:

| Trait | Voting Tendency |
|---|---|
| Risk-averse | Stability platform |
| High openness | Progressive platform |
| Business owner | Low corporate tax |
| Low income | High services platform |

Aggregate determines election outcome alongside player vote.

## 18.3 Multi-Jurisdiction Relocation

Player moves states:

| Change | Detail |
|---|---|
| State income tax | New brackets |
| Sales tax | New rate |
| Property tax | New assessment |
| Services | Different quality index |
| Filing | Part-year resident forms |

---

# 19. Integration Contracts

## 19.1 Economy Engine (18)

| Direction | Data |
|---|---|
| Tax → Economy | `tax.revenue_reported` |
| Economy → Government | GDP, unemployment, inflation for policy |
| Economy → Tax | Bracket indexing, fiscal balance |

## 19.2 Banking Engine (11)

| Direction | Data |
|---|---|
| Tax → Banking | Refund deposit, balance due debit |
| Banking → Tax | Interest income, transaction categories |
| Withholding | Payroll net pay calculation |

## 19.3 Career Engine

| Direction | Data |
|---|---|
| Career → Tax | W-2 wages, unemployment |
| Tax → Career | Withholding settings |

## 19.4 Investment Engine (12)

| Direction | Data |
|---|---|
| Investment → Tax | 1099-B, 1099-DIV, cap gains |
| Tax → Investment | Wash sale validation |

## 19.5 Housing Engine

| Direction | Data |
|---|---|
| Housing → Tax | 1098, property tax, rental income |
| Tax → Housing | Mortgage interest deduction data |

## 19.6 Company Engine (19)

| Direction | Data |
|---|---|
| Company → Tax | Corporate return, 1099-NEC to contractors |
| Tax → Company | Quarterly estimated payments |

## 19.7 Government Engine

| Direction | Data |
|---|---|
| Government → Tax | Policy rules version |
| Tax → Government | Revenue for spending |
| Government → All | `government.policy_enacted` |

## 19.8 Event Bus

| Event | Publisher |
|---|---|
| `tax.withholding_assessed` | Tax |
| `tax.return_filed` | Tax |
| `tax.audit_opened` | Tax |
| `tax.refund_issued` | Tax |
| `tax.penalty_assessed` | Tax |
| `government.election_completed` | Government |
| `government.policy_enacted` | Government |

---

# 20. Player Decision Flows

## 20.1 Standard vs Itemize

```
                    ┌─────────────────┐
                    │ Sum itemizable  │
                    │ deductions      │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌────────────────┐           ┌────────────────┐
     │ Itemized >     │           │ Itemized ≤     │
     │ Standard       │           │ Standard       │
     └───────┬────────┘           └───────┬────────┘
             │                            │
             ▼                            ▼
     ┌────────────────┐           ┌────────────────┐
     │ Itemize        │           │ Take standard  │
     │ (save $X)      │           │ deduction      │
     └────────────────┘           └────────────────┘
```

## 20.2 Roth vs Traditional Retirement

| Condition | Suggestion |
|---|---|
| Low current bracket, expect higher | Roth |
| High current bracket, expect lower in retirement | Traditional |
| Maxing both | Traditional to limit, then Roth |
| Employer match available | 401(k) first regardless |

## 20.3 Estimated Tax Payments

```
                    ┌─────────────────┐
                    │ Self-employment │
                    │ or large gains? │
                    └────────┬────────┘
                             │ YES
                             ▼
                    ┌─────────────────┐
                    │ Will withholding │
                    │ cover 90% of    │
                    │ annual tax?     │
                    └────────┬────────┘
                             │ NO
                             ▼
                    ┌─────────────────┐
                    │ Pay quarterly   │
                    │ estimated taxes │
                    └─────────────────┘
```

## 20.4 Vote Decision Framework

Presented neutrally:

| Consider | Question |
|---|---|
| Tax burden | Which plan changes your liability? |
| Services | Do you use public services affected? |
| Business | Corporate rate impact on your company? |
| Values | Platform alignment (flavor, not preachy) |
| Economy | Proposed spending vs deficit |

## 20.5 Audit Response

```
Receive audit notice
    │
    ├─► Gather documentation (receipts, statements)
    │
    ├─► Hire accountant NPC? (optional, fee, better outcome odds)
    │
    ├─► Submit response by deadline
    │
    └─► Accept outcome or appeal
```

---

# 21. Events & Notifications

## 21.1 Tax Calendar Notifications

| Date | Notification |
|---|---|
| Jan 31 | "Tax documents arriving" |
| Mar 1 | "Filing season: 45 days to deadline" |
| Apr 1 | "2 weeks until tax deadline" |
| Apr 15 | "File today or request extension" |
| Oct 15 | "Extension deadline" |

## 21.2 Policy Notifications

| Trigger | Message |
|---|---|
| `government.policy_enacted` | Policy briefing with pocketbook impact |
| Bracket indexation | "Tax brackets adjusted for inflation" |
| New credit introduced | "You may qualify for EV credit" |

## 21.3 Service Notifications

| Trigger | Message |
|---|---|
| License expiring | "Renew driver's license in 30 days" |
| Benefit recertification | "Confirm unemployment search activity" |
| Permit approved | "Building permit ready for pickup" |

## 21.4 World Memory

| Event | Archive |
|---|---|
| First tax filing | Milestone |
| Largest refund | Personal best |
| Audit survived | Story entry |
| Election voted | Civic record |
| Policy benefiting player | Context for gratitude or criticism |

---

# 22. Accessibility & Financial Literacy

## 22.1 Plain Language Tax Terms

| Term | Plain |
|---|---|
| AGI | Income after some adjustments |
| Taxable income | Income that gets taxed |
| Withholding | Tax taken from paycheck early |
| Marginal rate | Tax on your next dollar |
| Effective rate | Average tax on all dollars |
| Credit | Dollar-for-dollar tax reduction |
| Deduction | Expense that reduces taxable income |

## 22.2 Filing Assistance Levels

| Level | Feature |
|---|---|
| Guided | Step-by-step wizard (default) |
| Express | W-2 only auto-file |
| Advanced | Manual schedule access |
| Accountant | NPC hire for complex returns |

## 22.3 Cognitive Accessibility

- One decision per screen in wizard
- Progress bar with save-and-resume
- Summary page before submit
- No time pressure (deadlines are sim-date, not real-time)

## 22.4 Disclaimer

"Fenix Life tax simulation is educational. Consult a real tax professional for actual filing."

---

# 23. v1 Scope & Future Expansion

## 23.1 v1 In Scope

| Feature | Status |
|---|---|
| Federal + state income tax | ✅ |
| W-2 withholding + annual filing | ✅ |
| Standard/itemized deductions | ✅ |
| Major credits (child, EITC, education) | ✅ |
| Property tax | ✅ |
| Sales tax at point of sale | ✅ |
| Capital gains / dividend tax | ✅ |
| Schedule C sole prop | ✅ |
| Corporate tax (21%) | ✅ |
| Quarterly estimated payments | ✅ |
| Audit sampling | ✅ |
| Government services directory | ✅ |
| Federal election (simplified) | ✅ |
| Policy impact briefing | ✅ |

## 23.2 v1 Out of Scope

| Feature | Target |
|---|---|
| Multi-state filing | v1.5 |
| Estate/gift tax depth | v1.5 |
| Campaign manager career | v2 |
| Full legislative simulation | v2 |
| International tax treaties | Expansion |
| Crypto tax reporting | v2 if asset class added |
| Property tax protest mini-game | v2 |

---

# 24. Acceptance Criteria

## 24.1 Income Tax

| ID | Criterion | Test |
|---|---|---|
| AC-T01 | W-2 auto-imports to filing wizard | Career integration |
| AC-T02 | Marginal bracket applied correctly | Bracket math test |
| AC-T03 | Standard vs itemized recommendation accurate | Scenario matrix |
| AC-T04 | Refund deposits to checking within 21 days | E2E filing |
| AC-T05 | Balance due debits checking on payment | Payment flow |

## 24.2 Business Tax

| ID | Criterion | Test |
|---|---|---|
| AC-T06 | Schedule C net flows to Form 1040 | Sole prop test |
| AC-T07 | Corporate 21% applied to taxable income | Company return |
| AC-T08 | Quarterly estimated penalty if underpaid | Underpayment sim |

## 24.3 Other Taxes

| ID | Criterion | Test |
|---|---|---|
| AC-T09 | Property tax bill matches assessment × rate | Housing integration |
| AC-T10 | Sales tax appears on purchase receipt | Transaction test |
| AC-T11 | Long-term cap gains at preferential rate | Investment sale |

## 24.4 Filing

| ID | Criterion | Test |
|---|---|---|
| AC-T12 | Filing wizard completable in guided mode | UX test |
| AC-T13 | Extension moves deadline to Oct 15 | Extension flow |
| AC-T14 | Amended return adjusts prior liability | Amendment test |

## 24.5 Audits & Penalties

| ID | Criterion | Test |
|---|---|---|
| AC-T15 | Audit selection uses same rules for AI citizens | Parity test |
| AC-T16 | Late filing penalty accrues post-deadline | Date injection |
| AC-T17 | Fraud penalty applies on hidden income discovery | Audit sim |

## 24.6 Government & Elections

| ID | Criterion | Test |
|---|---|---|
| AC-T18 | Election policy comparison shows personalized tax delta | Platform tool |
| AC-T19 | Winning platform enacts `government.policy_enacted` | Election sim |
| AC-T20 | Service quality correlates with funding level | Budget injection |
| AC-T21 | Unemployment benefits require weekly certification | Benefit flow |

## 24.7 Integration

| ID | Criterion | Test |
|---|---|---|
| AC-T22 | `tax.revenue_reported` feeds Economy fiscal balance | Event trace |
| AC-T23 | Brackets index when inflation policy active | Economy link |
| AC-T24 | 1099-B matches investment sales | Reconciliation |

---

# 25. QA Scenarios

## 25.1 Simple Filer

1. Single W-2 employee, standard deduction
2. Receive W-2 Jan 31
3. Complete express filing Feb 15
4. Receive refund Mar 5
5. Verify withholding math

## 25.2 Homeowner Investor

1. MFJ with mortgage, 2 dependents
2. Investment dividends + long-term cap gain
3. Itemize deductions (mortgage + SALT cap)
4. Claim child tax credit
5. Owe small balance, pay via ACH

## 25.3 Self-Employed

1. Side business Schedule C profit $40K
2. Pay quarterly estimated taxes
3. Deduct home office
4. SE tax calculated
5. Annual return reconciles estimates

## 25.4 Audit Scenario

1. Claim large charitable deduction
2. Flagged for audit
3. Provide documentation
4. Partial disallowance + penalty
5. Payment plan established

## 25.5 Election Impact

1. Vote for Liberty Front (low tax platform)
2. Candidate wins
3. Next tax year: lower brackets
4. Player briefing shows −$1,500 tax
5. Service quality index drops slightly

## 25.6 Recession Stabilizers

1. Economy enters recession
2. Player loses job
3. Unemployment benefits activate
4. Tax liability drops with income
5. Stimulus payment received (if policy active)

---

# 26. Glossary

| Term | Definition |
|---|---|
| AGI | Adjusted Gross Income — income after above-the-line deductions |
| Audit | Government review of tax return accuracy |
| Bracket | Income range taxed at a specific rate |
| Capital gain | Profit from selling an asset |
| Credit | Direct reduction of tax owed |
| Deduction | Expense that reduces taxable income |
| Effective tax rate | Total tax divided by total income |
| EITC | Earned Income Tax Credit — refundable credit for low-income workers |
| Extension | Additional time to file (not pay) |
| FICA | Payroll tax for Social Security and Medicare |
| Filing status | Category affecting brackets (single, married, etc.) |
| Itemized deduction | Specific expenses listed instead of standard deduction |
| Marginal tax rate | Tax rate on the next dollar of income |
| SALT deduction | State And Local Tax deduction (capped) |
| Standard deduction | Fixed deduction amount based on filing status |
| Taxable income | Income subject to tax after deductions |
| Withholding | Tax taken from paychecks before filing |
| W-2 | Form reporting wages and withholding from employer |

---

## Document Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Lead Systems Designer | Initial canonical release |

---

*End of Document 13 — Government & Tax Design*
