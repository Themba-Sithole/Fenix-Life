# Fenix Life — Company Simulation

**Document Version:** 1.0  
**Status:** Canonical — Corporate Simulation Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Principal Simulation Architect  
**Audience:** Engineering, Game Design, AI Systems, Economy, QA, Live Ops  

---

## Document Authority

The Company Simulation system defines **how businesses are founded, operated, grown, governed, financed, and dissolved** in every sovereign Fenix Life world. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Business pillar, entrepreneurship, consequence |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Business Capital, Citizen Equality, Symmetry |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | FSF Company Engine §4.6 |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Company module, APIs, DDD aggregates |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Company aggregates, cap table, employment |
| [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) | Founder/executive decision biases |
| [17_Time_Simulation_System.md](./17_Time_Simulation_System.md) | Daily/monthly/quarterly tick cadence |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Sector demand, macro cycles, credit environment |

When corporate design conflicts with Citizen Equality, **player-owned and AI-owned companies obey identical rules**—no hidden margin boosts or immune bankruptcy.

**What this document is:**

- The **complete corporate simulation model** for Fenix Life
- Specifications for departments, culture, governance, products, and finance
- The **NPC strategic AI** framework for competing businesses
- Integration contracts with Career, Banking, Investment, Media, and Tax engines

**What this document is not:**

- Individual citizen career decisions (Career Engine, Document 20)
- Macro sector indices (Economy Engine — Document 18)
- Securities order matching (Investment Engine)
- Detailed manufacturing physics simulation (abstracted to capacity/utilization)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Architectural Overview](#3-architectural-overview)
4. [Company Lifecycle](#4-company-lifecycle)
5. [Corporate Entity Model](#5-corporate-entity-model)
6. [Cap Table & Ownership](#6-cap-table--ownership)
7. [Departments & Org Structure](#7-departments--org-structure)
8. [Corporate Culture](#8-corporate-culture)
9. [Board of Directors](#9-board-of-directors)
10. [Investors & Funding Rounds](#10-investors--funding-rounds)
11. [Hiring & Talent](#11-hiring--talent)
12. [Performance & Promotions](#12-performance--promotions)
13. [Layoffs & Restructuring](#13-layoffs--restructuring)
14. [Compensation & Payroll](#14-compensation--payroll)
15. [Products & Services](#15-products--services)
16. [Manufacturing, Marketing & R&D](#16-manufacturing-marketing--rd)
17. [Financial Management](#17-financial-management)
18. [Valuation & Metrics](#18-valuation--metrics)
19. [Acquisitions & M&A](#19-acquisitions--ma)
20. [Initial Public Offerings](#20-initial-public-offerings)
21. [Bankruptcy & Dissolution](#21-bankruptcy--dissolution)
22. [Corporate Reputation](#22-corporate-reputation)
23. [NPC Strategic AI](#23-npc-strategic-ai)
24. [Tiered Fidelity](#24-tiered-fidelity)
25. [Events & Integration](#25-events--integration)
26. [Performance & Budgets](#26-performance--budgets)
27. [Governance & Evolution](#27-governance--evolution)

---

# 1. Executive Summary

Companies are **first-class citizens** of the Fenix simulation—institutional agents with balance sheets, employees, reputations, and strategies that evolve whether the player watches or not. The Company Simulation system implements FSF §4.6 and provides the deepest gameplay loop for Business Capital accumulation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPANY SIMULATION — ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
│  │   Org &     │   │  Products   │   │  Financial  │   │ Governance  │     │
│  │   Culture   │   │  & Ops      │   │  Engine     │   │  & Capital  │     │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘     │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                                    │                                         │
│                          ┌─────────▼─────────┐                              │
│                          │  Company Aggregate  │                              │
│                          │  (single writer)    │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         ▼                          ▼                          ▼             │
│    Career Engine            Banking Engine            Economy Engine        │
│    (employees)              (accounts, credit)        (sector demand)       │
│    Investment Engine        Media Engine              Tax Engine            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core outcomes:**

| Outcome | Mechanism |
|---|---|
| **Believable competition** | NPC companies run same P&L rules as player |
| **Emergent industry stories** | M&A, IPOs, bankruptcies from systemic pressure |
| **Meaningful management** | Departments, culture, and people matter |
| **Legacy** | Corporate history in World Memory |
| **Scale** | Tiered fidelity for millions of aggregate firms |

---

# 2. Philosophy & Constitutional Alignment

## 2.1 Business Capital

Per Constitution Article III, Business Capital includes:

- Companies built or led
- Equity stakes and enterprise value
- Industry reputation and brand
- Operational excellence and innovation
- Employment impact and institutional continuity

Company Simulation is the **primary engine** for Business Capital transformation.

## 2.2 Symmetry Principle

| Rule | Player Company | NPC Company |
|---|---|---|
| P&L formulas | Identical | Identical |
| Bankruptcy thresholds | Identical | Identical |
| Hiring market | Same labor pool | Same labor pool |
| Credit standards | Same Banking rules | Same Banking rules |
| IPO requirements | Same SEC analog | Same SEC analog |
| Tax obligations | Same Tax Engine | Same Tax Engine |

**Forbidden:** Player-only profit multipliers, AI-only infinite runway.

## 2.3 Living World Corporations

While player sleeps:

- NPC competitors launch products
- Earnings reports publish quarterly
- Layoffs ripple through labor market
- Acquisitions close
- Startups fail or raise rounds

## 2.4 Emergence Over Script

**Approved:** Player bankruptcy from over-leverage during rate hike cycle affecting all leveraged firms.

**Rejected:** Scripted "rival wins" event ignoring competitor financials.

## 2.5 Design Review Questions

1. Does this mechanic apply to all companies regardless of owner?
2. What Economy macro variable modulates this?
3. Does outcome append to World Memory?
4. Can player investigate cause via financial statements?
5. What tier fidelity applies at scale?

---

# 3. Architectural Overview

## 3.1 Aggregate Ownership

Per FSF single-writer principle:

```typescript
/** Root aggregate — Company Engine exclusive mutator */
interface Company {
  companyId: string;
  worldInstanceId: string;
  legalName: string;
  tradeName: string;
  foundedDate: string;
  status: CompanyStatus;
  primarySector: SectorId;
  secondarySectors: SectorId[];
  jurisdictionId: string;
  tier: CompanyTier;

  // Nested value objects / child entities
  capTable: CapTable;
  orgStructure: OrgStructure;
  culture: CorporateCulture;
  board: BoardOfDirectors;
  productPortfolio: ProductPortfolio;
  operations: OperationsState;
  financials: CompanyFinancials;
  reputation: CorporateReputation;
  strategicPlan: StrategicPlan;

  rulesetVersion: string;
  updatedAt: string;
}

type CompanyStatus =
  | 'pre_revenue'
  | 'operating'
  | 'distressed'
  | 'bankruptcy_proceeding'
  | 'acquired'
  | 'dissolved'
  | 'public'
  | 'private';

type CompanyTier =
  | 'T0_PLAYER'      // Player-controlled
  | 'T1_NAMED'       // Significant NPC (competitor, partner)
  | 'T2_SAMPLE'      // Statistical operations
  | 'T3_AGGREGATE';  // Sector supply only
```

## 3.2 Module Structure

```
CompanyModule (NestJS)
├── domain/
│   ├── CompanyAggregate
│   ├── Department
│   ├── Product
│   ├── CapTable
│   ├── Board
│   └── CultureModel
├── application/
│   ├── FoundCompanyHandler
│   ├── MonthlyPlResolution
│   ├── QuarterlyEarningsHandler
│   ├── HiringBatchProcessor
│   ├── NpcStrategyOrchestrator
│   └── BankruptcyWorkflow
├── infrastructure/
│   └── CompanyRepository (Prisma)
└── interfaces/
    ├── ICompanyQuery
    └── ICompanyCommand
```

## 3.3 Command/Query Separation

| Commands | Queries |
|---|---|
| `FoundCompany` | `GetCompanyDashboard` |
| `HireEmployee` | `ListJobPostings` |
| `LaunchProduct` | `GetFinancialStatements` |
| `RaiseFundingRound` | `GetCapTable` |
| `InitiateIPO` | `GetCompetitorLandscape` |
| `AcquireCompany` | `GetBoardResolutions` |

Commands mutate aggregate; queries read CQRS projections.

---

# 4. Company Lifecycle

## 4.1 Lifecycle Stages

```
IDEA → FOUNDING → PRE_REVENUE → OPERATING → [GROWTH PATHS]
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              BOOTSTRAPPED              VC_BACKED                   PUBLIC
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              ▼
                                    MATURE / DECLINE / DISTRESSED
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
               ACQUIRED                  BANKRUPT                  DISSOLVED
```

## 4.2 Founding

### Requirements

| Requirement | Validation |
|---|---|
| Founder citizen | Age ≥ 18, not bankrupt (unless ruleset exception) |
| Business plan | Sector, initial product/service concept |
| Capital | Minimum seed (personal or investor) |
| Jurisdiction | Registered address, legal structure |
| Name uniqueness | Per region registry |

### Founding Event Flow

```
1. Founder issues FoundCompany command
2. Company Engine validates eligibility (Banking, Government)
3. Cap table initialized (founder 100% or split with co-founders)
4. Banking account opened (company entity)
5. company.founded event → World Memory
6. Optional: company.job_posted for initial hires
```

### Legal Structures

| Structure | Liability | Tax Treatment | Complexity |
|---|---|---|---|
| Sole proprietorship | Unlimited personal | Pass-through | Low |
| LLC | Limited | Pass-through option | Medium |
| C-Corp | Limited | Corporate + dividend | High |
| S-Corp | Limited | Pass-through (constraints) | Medium |

Structure affects Tax Engine and Investment Engine eligibility.

## 4.3 Operating Phase

Default state. Monthly P&L resolution, payroll, product cycles, strategic decisions.

## 4.4 Exit Paths

| Exit | Trigger | Outcome |
|---|---|---|
| **IPO** | Meets listing requirements | Public status, liquidity |
| **Acquisition** | Offer accepted | `acquired` status, payout to shareholders |
| **Management buyout** | Internal purchase | Private again |
| **Bankruptcy** | Insolvency | Restructure or dissolve |
| **Voluntary dissolution** | Owner decision | Wind-down |

---

# 5. Corporate Entity Model

## 5.1 Identity Fields

```typescript
interface CompanyIdentity {
  companyId: string;
  ein: string;                    // tax identifier
  duns?: string;                  // business credit analog
  logoAssetId?: string;
  website?: string;
  hqRegionId: string;
  employeeCount: number;
  employeeCountFte: number;       // full-time equivalent
}
```

## 5.2 Company Size Classes

| Class | Employees | Revenue (indexed) | Simulation Depth |
|---|---|---|---|
| **Micro** | 1–9 | < $1M | Full if player/T1 |
| **Small** | 10–49 | $1M–$10M | Full if player/T1 |
| **Medium** | 50–249 | $10M–$100M | Full if player/T1; sampled T2 |
| **Large** | 250–999 | $100M–$1B | Full if player; statistical T1 |
| **Enterprise** | 1000+ | > $1B | Full if player; sector aggregate components |

## 5.3 Subsidiaries & Holdings

```typescript
interface CorporateStructure {
  parentCompanyId?: string;
  subsidiaries: string[];
  ownershipType: 'independent' | 'subsidiary' | 'holding';
  consolidationMethod: 'full' | 'equity' | 'none';
}
```

Consolidated financials roll up monthly for holding companies.

---

# 6. Cap Table & Ownership

## 6.1 Cap Table Structure

```typescript
interface CapTable {
  authorizedShares: number;
  issuedShares: number;
  shareClasses: ShareClass[];
  stakeholders: StakeholderEntry[];
  optionPool: OptionPool;
  lastUpdated: string;
}

interface ShareClass {
  classId: string;
  name: string;           // Common, Series A Preferred, etc.
  votesPerShare: number;
  liquidationPreference: number;
  participation: boolean;
  antiDilution: 'none' | 'weighted_average' | 'full_ratchet';
}

interface StakeholderEntry {
  stakeholderId: string;
  stakeholderType: 'citizen' | 'company' | 'fund' | 'employee_pool';
  shareClassId: string;
  shares: number;
  percentOwnership: number;
  vestingSchedule?: VestingSchedule;
  acquisitionDate: string;
}

interface OptionPool {
  reservedShares: number;
  allocated: number;
  grants: StockOptionGrant[];
}
```

## 6.2 Dilution Mechanics

On funding round:

```
newInvestorOwnership = investmentAmount / postMoneyValuation
founderDilution = priorOwnership × (1 - newInvestorOwnership - optionPoolIncrease)
```

All shareholders subject to pro-rata rights if modeled (ruleset flag).

## 6.3 Dividends

Board declares dividends quarterly:

```
dividendPerShare = declaredAmount / issuedShares
payout sourced from retained earnings (Banking transfer)
```

Preferred shareholders receive preference per share class terms.

## 6.4 Ownership Stakes Bridge

Investment Engine holds `StakePosition` records referencing `companyId`. Cap table is authoritative; Investment reconciles on `company.funding_round_closed` and `company.ipo_completed`.

---

# 7. Departments & Org Structure

## 7.1 Standard Departments

```typescript
enum DepartmentType {
  EXECUTIVE = 'executive',
  FINANCE = 'finance',
  HR = 'hr',
  LEGAL = 'legal',
  OPERATIONS = 'operations',
  MANUFACTURING = 'manufacturing',
  R_AND_D = 'r_and_d',
  MARKETING = 'marketing',
  SALES = 'sales',
  CUSTOMER_SUCCESS = 'customer_success',
  IT = 'it',
  PROCUREMENT = 'procurement',
}

interface Department {
  departmentId: string;
  type: DepartmentType;
  headEmployeeId?: string;
  headcount: number;
  budgetMonthly: number;
  morale: number;           // 0–100
  efficiency: number;       // 0–100
  capacity: number;         // output units / month
  skillProfile: SkillVector;
}
```

## 7.2 Org Chart

```typescript
interface OrgStructure {
  ceoEmployeeId: string;
  departments: Department[];
  reportingLines: ReportingLine[];
  spanOfControl: number;    // avg direct reports
  layers: number;           // hierarchy depth
}

interface ReportingLine {
  managerEmployeeId: string;
  reportEmployeeId: string;
}
```

## 7.3 Department Functions

| Department | Primary Outputs |
|---|---|
| **Executive** | Strategy, board relations, culture tone |
| **Finance** | Budgeting, reporting, treasury, audit quality |
| **HR** | Hiring velocity, retention, training, morale |
| **Legal** | Compliance, contract risk, litigation exposure |
| **Operations** | Process efficiency, cost control |
| **Manufacturing** | Unit output, quality, COGS |
| **R&D** | Product pipeline, innovation points |
| **Marketing** | Brand awareness, lead generation |
| **Sales** | Revenue conversion, pipeline |
| **Customer Success** | Retention, churn reduction, NPS |
| **IT** | Infrastructure reliability, security |
| **Procurement** | Supplier costs, supply chain risk |

## 7.4 Department Efficiency

Monthly update:

```
efficiency_d = baseEfficiency_d × headSkillFit_d × moraleModifier(morale_d) × cultureModifier × toolingInvestment_d
```

Low efficiency increases COGS or reduces output capacity.

## 7.5 Reorganization

Player/NPC may issue `ReorganizeDepartments` command:

- Merge/split departments
- Reassign heads
- Temporary morale penalty (change fatigue)
- Efficiency dip 1–3 months

---

# 8. Corporate Culture

## 8.1 Culture Vector

```typescript
interface CorporateCulture {
  // 0–100 scales
  innovation: number;        // risk-taking, experimentation
  execution: number;         // delivery focus, process
  collaboration: number;     // cross-team cooperation
  customerFocus: number;     // customer-centric decisions
  integrity: number;         // ethical baseline
  workLifeBalance: number;   // hours, burnout risk
  diversity: number;         // inclusion index
  agility: number;           // adaptability to change

  // Derived
  cultureArchetype: CultureArchetype;
  toxicityRisk: number;      // 0–100
  employerBrand: number;     // 0–100
}

type CultureArchetype =
  | 'startup_scrappy'
  | 'corporate_formal'
  | 'innovation_lab'
  | 'sales_driven'
  | 'mission_driven'
  | 'toxic_high_performance'
  | 'family_friendly'
  | 'balanced';
```

## 8.2 Culture Formation

Initial culture seeded from:

- Founder CDPS traits (Entrepreneurial instinct, Integrity, Leadership)
- Early hires (first 10 employees weighted 2×)
- Explicit player culture policies

## 8.3 Culture Drift

Monthly drift from:

| Factor | Effect |
|---|---|
| CEO behavior | Tone from the top |
| Layoffs | ↓ trust, ↑ toxicity |
| Wins (product launch) | ↑ morale archetype alignment |
| Scandals | ↓ integrity, ↓ employer brand |
| Overwork policy | ↓ workLifeBalance |
| Diversity hiring | ↑ diversity |

## 8.4 Culture Gameplay Effects

| Culture Profile | Effect |
|---|---|
| High innovation | Faster R&D; higher failure rate |
| High execution | Lower COGS variance; slower experimentation |
| Low integrity | Fraud risk; scandal probability |
| Low workLifeBalance | Burnout → turnover ↑ |
| High employer brand | Hiring quality ↑; wage discount |

## 8.5 Culture vs CDPS

Employee citizens have personal CDPS; **culture fit** computed:

```
fit = cosineSimilarity(employeeTraitVector, cultureImplicitTraits)
```

Low fit → faster turnover, lower performance.

---

# 9. Board of Directors

## 9.1 Board Composition

```typescript
interface BoardOfDirectors {
  members: BoardMember[];
  chairId: string;
  meetingsPerYear: number;
  nextMeetingDate: string;
  committees: BoardCommittee[];
}

interface BoardMember {
  citizenId: string;
  role: 'chair' | 'independent' | 'investor' | 'founder' | 'executive';
  electedDate: string;
  termEndDate: string;
  votes: number;
  attendanceRate: number;
  alignment: number;        // with CEO, 0–100
}

interface BoardCommittee {
  type: 'audit' | 'compensation' | 'governance' | 'risk';
  memberIds: string[];
}
```

## 9.2 Board Authority

| Decision | Board Vote Required |
|---|---|
| CEO hire/fire | Yes |
| Funding round > threshold | Yes |
| Acquisition > 20% market cap | Yes |
| IPO approval | Yes |
| Dividend declaration | Yes |
| Annual budget | Yes (public companies) |
| Option pool expansion | Yes |
| Bankruptcy filing | Yes |

## 9.3 Voting Mechanics

```typescript
function resolveBoardVote(
  members: BoardMember[],
  proposal: BoardProposal,
  ceoInfluence: number,
): VoteResult {
  let votesFor = 0;
  let votesAgainst = 0;
  for (const m of members) {
    const utility = boardMemberUtility(m, proposal, ceoInfluence);
    if (utility > 0) votesFor += m.votes;
    else votesAgainst += m.votes;
  }
  return votesFor > votesAgainst ? 'approved' : 'rejected';
}
```

Player companies: player may cast founder votes; AI board members use CDPS + investor interest utility.

## 9.4 Board Relationships

Low `alignment` triggers:

- CEO replacement pressure
- Strategy disputes (Media coverage)
- Activist investor events (Investment Engine)

## 9.5 Decision Gates

Major votes create **Time Engine decision gates** (Document 17) until player votes or AI resolves.

---

# 10. Investors & Funding Rounds

## 10.1 Funding Stages

| Stage | Typical Size (indexed) | Investors |
|---|---|---|
| **Pre-seed** | $50K–$500K | Angels, founders, F&F |
| **Seed** | $500K–$3M | Seed funds, angels |
| **Series A** | $3M–$15M | VC firms |
| **Series B+** | $15M+ | Growth equity, VC |
| **Debt round** | Varies | Banks, private credit |
| **Grant** | Non-dilutive | Government programs |

## 10.2 Round Structure

```typescript
interface FundingRound {
  roundId: string;
  stage: FundingStage;
  preMoneyValuation: number;
  investmentAmount: number;
  postMoneyValuation: number;
  leadInvestorId: string;
  participants: InvestorAllocation[];
  terms: RoundTerms;
  closedDate?: string;
  status: 'proposed' | 'open' | 'closed' | 'failed';
}

interface RoundTerms {
  liquidationPreference: number;
  antiDilution: string;
  boardSeat: boolean;
  protectiveProvisions: string[];
  dragAlong: boolean;
  proRataRights: boolean;
}
```

## 10.3 Valuation Model

Pre-money valuation from:

```
valuation = revenueRunRate × sectorMultiple × growthAdjustment × teamQuality × tractionScore
```

| Factor | Source |
|---|---|
| `sectorMultiple` | Economy sector demand + Investment comparables |
| `growthAdjustment` | Revenue growth rate |
| `teamQuality` | Employee skill aggregate |
| `tractionScore` | Users, retention, market share |

## 10.4 Investor AI

NPC investors (T1 funds, angels) evaluate deals via:

- Sector cycle phase (Economy)
- Portfolio diversification
- Expected IRR utility
- Founder CDPS (Ambition, Integrity history)
- Media hype factor

**Symmetry:** Player can invest as angel using same rules via Investment Engine.

## 10.5 Round Failure

Failed round if:

- Valuation gap unbridgeable
- Sector in contraction (investor risk-off)
- Founder reputation damaged

Consequences: runway pressure, layoffs, down-round attempt, bankruptcy risk.

---

# 11. Hiring & Talent

## 11.1 Job Postings

```typescript
interface JobPosting {
  postingId: string;
  companyId: string;
  departmentType: DepartmentType;
  title: string;
  level: JobLevel;
  salaryRangeMin: number;
  salaryRangeMax: number;
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  remote: boolean;
  postedDate: string;
  expiresDate: string;
  status: 'open' | 'filled' | 'cancelled';
}

type JobLevel =
  | 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'director' | 'vp' | 'c_level';
```

## 11.2 Hiring Pipeline

```
Job Posted → Applications (Career Engine) → Screening → Interview → Offer → Hire
```

Weekly tick advances pipeline (Document 17).

## 11.3 Matching Algorithm

```typescript
function candidateFitScore(
  candidate: CitizenProfile,
  posting: JobPosting,
  company: Company,
): number {
  const skillFit = computeSkillMatch(candidate.skills, posting.requiredSkills);
  const cultureFit = computeCultureFit(candidate, company.culture);
  const salaryFit = salaryAcceptance(candidate, posting.salaryRangeMin, posting.salaryRangeMax);
  const commuteFit = commuteAcceptance(candidate, company.hqRegionId);
  const reputationFit = company.reputation.employerBrand / 100;

  return (
    skillFit * 0.35 +
    cultureFit * 0.20 +
    salaryFit * 0.25 +
    commuteFit * 0.10 +
    reputationFit * 0.10
  );
}
```

## 11.4 Hiring Constraints

| Constraint | Source |
|---|---|
| Budget | Finance department approval |
| Headcount plan | Strategic plan |
| Labor market | Economy unemployment (tight market → longer fill) |
| Visa/work authorization | Government (future) |
| Non-compete | Legal risk |

## 11.5 Employer Brand

High `employerBrand` reduces time-to-fill and salary premium required.

## 11.6 Events

| Event | Publisher |
|---|---|
| `company.job_posted` | Company |
| `career.hired` | Career (on acceptance) |
| `company.headcount_changed` | Company |

---

# 12. Performance & Promotions

## 12.1 Employee Performance

```typescript
interface EmployeeRecord {
  employeeId: string;
  companyId: string;
  departmentType: DepartmentType;
  level: JobLevel;
  performanceRating: number;    // 0–100, monthly
  tenureMonths: number;
  morale: number;
  burnoutRisk: number;
  lastPromotionDate?: string;
}
```

## 12.2 Performance Calculation

Monthly:

```
performance = baseOutput × skillEffectiveness × moraleModifier × managerQuality × cultureExecutionBonus - burnoutPenalty
```

## 12.3 Promotion Eligibility

| Criterion | Threshold |
|---|---|
| Performance rating | > 75 for 3 consecutive months |
| Tenure | Level-dependent minimum |
| Department budget | Headcount at level available |
| Manager recommendation | Performance > 70 |

## 12.4 Promotion Effects

- Salary increase (wage index adjusted)
- `career.promoted` event
- Morale boost (employee + department)
- CDPS Confidence + for employee (Citizen Engine)

## 12.5 Player as Employee

If player works at NPC company (pre-founder), same performance rules apply—no shortcuts.

---

# 13. Layoffs & Restructuring

## 13.1 Layoff Triggers

| Trigger | Source |
|---|---|
| Cash runway < 6 months | Financial distress |
| Revenue miss > 20% | Quarterly earnings |
| Sector contraction | Economy recession |
| Acquisition synergy | M&A integration |
| Strategic pivot | Board decision |
| Automation investment | Manufacturing efficiency |

## 13.2 Layoff Process

```typescript
interface LayoffBatch {
  layoffId: string;
  companyId: string;
  reason: LayoffReason;
  affectedEmployees: string[];
  severanceWeeksPerYear: number;
  announcementDate: string;
  effectiveDate: string;
  WARNCompliance: boolean;
}
```

## 13.3 Selection Algorithm

NPC layoffs use **performance-weighted selection** with legal constraints:

```
layoffProbability(employee) = f(inversePerformance, tenure, protectedClass flags, departmentPriority)
```

**Ethical ruleset:** Protected characteristics never explicit input—Constitution compliance.

## 13.4 Consequences

| Stakeholder | Effect |
|---|---|
| **Laid-off citizens** | `career.terminated`; CDPS trauma memory |
| **Remaining employees** | Morale ↓; survivor guilt |
| **Culture** | Trust ↓ if perceived unfair |
| **Reputation** | Media coverage; employer brand ↓ |
| **Labor market** | Supply ↑ (Career Engine) |
| **Economy** | Unemployment contribution |

## 13.5 Restructuring

Department elimination, location closure, bankruptcy reorganization—multi-month saga with board oversight.

## 13.6 Events

`company.layoff` → Career, Media, Economy, Citizen CDPS.

---

# 14. Compensation & Payroll

## 14.1 Compensation Components

```typescript
interface CompensationPackage {
  baseSalary: number;
  bonusTarget: number;          // % of base
  equityGrant?: StockOptionGrant;
  benefitsValue: number;
  totalComp: number;
}
```

## 14.2 Payroll Processing

Monthly tick (Document 17):

```
1. Compute gross pay per employee
2. Tax withholding (Tax Engine)
3. Benefits deductions
4. Banking disbursement (company account → employee accounts)
5. Accrue bonus pools
```

## 14.3 Bonus Pools

Quarterly board-declared bonus pool:

```
individualBonus = poolSize × (performanceRating / Σ performanceRatings) × levelMultiplier
```

## 14.4 Equity Compensation

Stock options from `optionPool`:

- Vesting cliff (typically 1 year) + monthly vest
- Exercise via Investment Engine
- Dilution reflected in cap table on exercise

## 14.5 Payroll Failure

Insufficient company cash:

- Partial payroll (ruleset: illegal in some jurisdictions → penalties)
- Employee morale collapse
- Key employee departure risk
- `company.payroll_failed` event

---

# 15. Products & Services

## 15.1 Product Model

```typescript
interface Product {
  productId: string;
  companyId: string;
  name: string;
  category: ProductCategory;
  lifecycle: ProductLifecycle;
  price: number;
  unitCost: number;
  quality: number;              // 0–100
  brandStrength: number;        // 0–100
  marketShare: number;          // 0–1 in segment
  monthlyUnitsSold: number;
  monthlyRevenue: number;
  launchedDate?: string;
  discontinuedDate?: string;
}

type ProductLifecycle =
  | 'concept'
  | 'development'
  | 'beta'
  | 'growth'
  | 'maturity'
  | 'decline'
  | 'discontinued';

type ProductCategory =
  | 'physical_goods'
  | 'digital_goods'
  | 'subscription'
  | 'service'
  | 'marketplace'
  | 'franchise';
```

## 15.2 Product Portfolio

```typescript
interface ProductPortfolio {
  products: Product[];
  pipeline: ProductConcept[];
  flagshipProductId?: string;
  portfolioDiversification: number;
}
```

## 15.3 Revenue Model

```
monthlyRevenue_p = unitsSold_p × price_p × (1 - churnRate_p)   // subscription
monthlyRevenue_p = unitsSold_p × price_p                        // goods
```

`unitsSold` derived from marketing spend, product quality, sector demand, competition.

## 15.4 Pricing Strategy

| Strategy | Condition |
|---|---|
| **Penetration** | Low price, high volume (startup) |
| **Premium** | High quality + brand |
| **Competitive** | Match sector price index |
| **Dynamic** | Adjust monthly to demand |

NPC AI selects strategy from `strategicPlan` and cycle phase.

## 15.5 Product Launch

```
1. Development complete (R&D)
2. Launch command → marketing burst spend
3. company.product_launched event
4. Media coverage
5. Initial sales ramp (3–6 months)
```

## 15.6 Product Failure

Low sales + high COGS → discontinue:

- Inventory write-down
- R&D sunk cost
- Reputation impact (moderate)

---

# 16. Manufacturing, Marketing & R&D

## 16.1 Operations State

```typescript
interface OperationsState {
  facilities: Facility[];
  totalCapacity: number;
  utilization: number;
  qualityControl: number;
  supplyChainRisk: number;
  inventoryLevel: number;
  defectRate: number;
}
```

**Production:** `output = min(demandForecast, capacity × utilization) × qualityModifier`; `unitCOGS = materials + labor + overhead + waste`.

**Capacity investment:** Capex via Banking; 6–18 month construction lag; monthly depreciation. **Automation** reduces labor cost, increases capex, may trigger layoffs.

**Supply chain:** Economy/Weather shocks raise `supplyChainRisk` → material costs ↑, delivery delays → revenue miss.

## 16.2 Marketing & Sales

```typescript
interface MarketingState {
  monthlyBudget: number;
  brandAwareness: number;
  leadGeneration: number;
  customerAcquisitionCost: number;
  channelMix: { digital: number; traditional: number; pr: number };
}
```

`awarenessDelta = f(budget, channels, productQuality, mediaHype)` → leads → customers via `salesCloseRate`. B2B uses longer `salesCycleDays`; B2C is volume-driven. `brandAwareness` feeds `corporateReputation.brandEquity`.

## 16.3 Research & Development

```typescript
interface ProductConcept {
  conceptId: string;
  progress: number;
  innovationPoints: number;
  estimatedDevMonths: number;
  assignedHeadcount: number;
}
```

`monthlyProgress = baseVelocity × headcount × avgSkill × culture.innovation × budget`. Breakthroughs publish `company.research_breakthrough`; cancellation writes off sunk cost and hits R&D morale.

---

# 17. Financial Management

## 17.1 Financial Statements

```typescript
interface CompanyFinancials {
  // Income Statement (monthly)
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: OpExBreakdown;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  taxExpense: number;
  netIncome: number;

  // Balance Sheet
  cash: number;
  accountsReceivable: number;
  inventory: number;
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalLiabilities: number;
  shareholdersEquity: number;

  // Cash Flow
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  freeCashFlow: number;

  // Derived
  grossMargin: number;
  operatingMargin: number;
  currentRatio: number;
  debtToEquity: number;
  runwayMonths: number;

  asOfDate: string;
}
```

## 17.2 Monthly P&L Resolution

Monthly tick pipeline:

```
1. Aggregate product revenues
2. Compute COGS from operations
3. Sum OpEx (payroll, marketing, facilities, R&D, G&A)
4. Apply depreciation
5. Interest from Banking loans
6. Tax provision (Tax Engine)
7. Net income → retained earnings
8. company.earnings_reported (if quarter end)
```

## 17.3 Cash Management

Treasury decisions:

- Maintain cash buffer (target months runway)
- Pay down debt vs invest
- Dividend vs retain
- Credit line draw

NPC treasury AI optimizes for survival + growth per strategic plan.

## 17.4 Accounts & Banking

Company maintains accounts in Banking Engine:

- Operating account
- Payroll account (optional separate)
- Credit facilities
- Merchant processing

All transactions via `banking.transaction_posted` events.

---

# 18. Valuation & Metrics

## 20.1 Valuation Methods

| Method | Use Case |
|---|---|
| **Revenue multiple** | Growth companies |
| **EBITDA multiple** | Mature operating |
| **DCF** | Large NPC / acquisition |
| **Book value** | Distressed |
| **Market cap** | Public companies |

```typescript
function estimateValuation(company: Company, economy: MacroStateVector): number {
  if (company.status === 'public') {
    return marketCapFromInvestmentEngine(company.companyId);
  }
  const multiple = sectorRevenueMultiple(company.primarySector, economy.cyclePhase);
  return company.financials.revenue * 12 * multiple * growthAdjustment(company);
}
```

## 20.2 KPI Dashboard

| KPI | Formula |
|---|---|
| **MRR/ARR** | Subscription revenue |
| **Churn rate** | Lost customers / total |
| **LTV** | ARPU × avg lifetime |
| **CAC** | Marketing spend / new customers |
| **LTV/CAC** | Unit economics health |
| **NPS** | Customer success surveys |
| **Employee turnover** | Departures / avg headcount |

## 20.3 Quarterly Earnings

Quarterly tick publishes:

```typescript
interface EarningsReport {
  companyId: string;
  quarter: string;
  revenue: number;
  eps: number;
  guidance: EarningsGuidance;
  beatMiss: 'beat' | 'meet' | 'miss';
  stockImpact: number;
}
```

Media Engine generates coverage; Investment Engine adjusts price.

---

# 19. Acquisitions & M&A

M&A types: acqui-hire, horizontal, vertical, conglomerate, hostile, merger of equals. `AcquisitionOffer` carries price, consideration (cash/stock/mixed), premium, and regulatory status. Target board accepts when `offerUtility = offerPrice - standaloneValuation + synergy - integrationRisk - cultureClash > threshold`. Post-close integration (3–12 months): synergy layoffs, culture clash, systems cost, cross-sell upside. Government Engine antitrust may block or require divestiture. Publishes `company.acquired`.

---

# 20. Initial Public Offerings

**Requirements:** revenue > $50M indexed, profitability or growth exception, independent board majority, clean audit, minimum float, favorable market conditions. **Process:** board approval → underwriters → S-1 filing → roadshow → price range → lock-up → pricing gate → `company.ipo_completed` → public trading via Investment Engine. **Post-IPO:** mandatory quarterly earnings, insider windows, compliance cost, activist exposure. NPC competitor IPOs run full process during offline catch-up.

---

# 21. Bankruptcy & Dissolution

**Insolvency tests:** cash-flow failure within 90 days, liabilities > assets, unwaived covenant breach. **Chapters analog:** Ch.11 reorganization, Ch.7 liquidation, pre-packaged. Process: board filing → automatic stay → restructure or liquidate → creditor waterfall → equity often wiped → `company.bankrupt`. Stakeholders: employees laid off, creditors recover by seniority, founder CDPS bankruptcy memory. Player bankruptcy uses identical rules; recovery via credit repair arc.

---

# 22. Corporate Reputation

## 24.1 Reputation Dimensions

```typescript
interface CorporateReputation {
  employerBrand: number;        // 0–100
  customerTrust: number;
  industryStanding: number;
  mediaSentiment: number;       // -100 to +100
  esgScore: number;             // environmental, social, governance
  scandalSeverity: number;      // 0–100 active
  scandalDecay: number;
  brandEquity: number;
}
```

## 24.2 Reputation Sources

| Source | Effect |
|---|---|
| Product quality | customerTrust |
| Fair layoffs vs harsh | employerBrand |
| Market leadership | industryStanding |
| Media coverage | mediaSentiment |
| Environmental record | esgScore |
| Fraud/scandal | scandalSeverity spike |

## 24.3 Scandal Dynamics

```
company.scandal_exposed (from Media or Legal)
  → scandalSeverity ↑
  → customerTrust ↓
  → stock price ↓ (if public)
  → CEO/board pressure
  → scandalDecay over months with PR spend + Integrity culture
```

## 24.4 Reputation Gameplay

- High reputation: pricing power, hiring advantage, partnership opportunities
- Low reputation: customer churn, investor flight, regulatory scrutiny

## 24.5 World Memory

Major reputation events archived in History Engine—"Enron analog" persists decades.

---

# 23. NPC Strategic AI

T1/T2 NPC companies run `NpcStrategyOrchestrator` weekly: assess runway/margins → read Economy → generate actions → score via utility → execute if above threshold. `StrategicPlan` defines goal (growth/profitability/survival/exit), priorities, and risk appetite. Actions: hire, layoff, launch product, raise round, acquire, cut marketing, expand, IPO, bankruptcy—each with preconditions. NPC utility = goal alignment + financial impact − risk penalty + macro fit + noise. T1 CEO citizens apply CDPS bias (Ambition, Integrity, Patience). **Parity:** NPCs face identical cash, demand, and credit constraints as player.

---

# 24. Tiered Fidelity

| Tier | Simulation |
|---|---|
| **T0_PLAYER** | Full resolution |
| **T1_NAMED** | Full P&L + strategic AI (~50–200) |
| **T2_SAMPLE** | Statistical monthly P&L (~5,000) |
| **T3_AGGREGATE** | Sector supply only (millions) |

Promotion: player acquires, competitor adjacency, media coverage. Demotion: 2+ years no interaction, region exit, acquisition absorption. T2 uses `revenue = sectorDemand × marketShareProxy × baseline`.

---

# 25. Events & Integration

**Publishes:** `company.founded`, `funding_round_closed`, `product_launched`, `ipo_completed`, `acquired`, `bankrupt`, `earnings_reported`, `job_posted`, `layoff`, `scandal_exposed`, `headcount_changed`. **Consumes:** economy sector/recession, banking loan events, career hire/terminate, media scandal, weather supply chain, government policy. **Tick schedule:** daily (player ops), weekly (NPC strategy), monthly (P&L/payroll), quarterly (earnings).

---

# 26. Performance & Budgets

Player company daily: 8ms; T1 monthly each: 2ms; T2 batch 1000: 50ms. Dirty flags on product sale, hire/fire, funding, shocks. CQRS projections cached for financials and competitor landscape.

---

# 27. Governance & Evolution

Ruleset `company/v{version}.json` tunes IPO thresholds, bankruptcy tests, sector multiples, layoff rules. **Anti-patterns rejected:** infinite player cash, recession-immune NPCs, scripted wins, instant launches. Future: international subsidiaries, franchises, cooperatives, unions.

---

## Appendix A — Monthly P&L Pseudocode

See §17.2 pipeline: aggregate product revenue → COGS → OpEx → EBITDA → interest → tax → net income → `company.earnings_reported` at quarter end.

---

*End of Document 19 — Company Simulation*
