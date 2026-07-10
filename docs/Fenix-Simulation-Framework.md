# Fenix Simulation Framework (FSF)

**Document Version:** 1.0  
**Status:** Canonical — Simulation Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Chief Simulation Architect & Principal Systems Design  
**Audience:** Engineering, AI Systems, Game Design, QA, Live Ops, Data, Platform  

---

## Document Authority

The Fenix Simulation Framework (FSF) defines **how the living world of Fenix Life is created, advanced, remembered, and scaled** for the next decade. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Vision, pillars, emergence philosophy, living world |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Living World, Five Capitals, World Memory |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Platform architecture, deployment, modules, APIs |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Storage planes, event log, tiering, historical retention |

When simulation design conflicts with product philosophy, **align with philosophy first**, then document deliberate technical exceptions.

**What the FSF is:**

- The **simulation kernel** and **engine constellation** that powers every sovereign world instance
- The **contract layer** between domain systems (citizens, companies, governments, markets)
- The **temporal spine** that advances decades of in-game time with integrity
- The **scalability model** that makes millions of citizens computationally tractable

**What the FSF is not:**

- A game engine (rendering, input, audio belong to the client tier)
- A UI framework (dashboards consume projections; they do not own simulation state)
- A scripting language for bespoke narrative (events emerge from systems)
- A multiplayer authority server (multiplayer touches sovereign worlds through contracts only)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Simulation-First Design Philosophy](#2-simulation-first-design-philosophy)
3. [Framework Architecture](#3-framework-architecture)
4. [Engine Specifications](#4-engine-specifications)
5. [Simulation Lifecycle](#5-simulation-lifecycle)
6. [Inter-Engine Communication](#6-inter-engine-communication)
7. [Scalability Architecture](#7-scalability-architecture)
8. [Debugging & Developer Tooling](#8-debugging--developer-tooling)
9. [Governance & Evolution](#9-governance--evolution)

---

# 1. Executive Summary

Fenix Life is a **simulation-first platform**. The FSF is its heart: a collection of loosely coupled **engines** coordinated by a **Time Engine** and **Tick Orchestrator**, communicating through an **in-process domain event bus** per sovereign `WorldInstance`.

Every citizen—player or AI—exists inside the same rule universe. Every institution—bank, university, company, government—obeys the same economic and legal physics. Every consequential action appends to **World Memory** and may cascade across engines without hard-coded narrative.

The FSF is engineered for four non-negotiable outcomes:

| Outcome | Mechanism |
|---|---|
| **Believability** | Symmetry Principle — one rule engine for all citizens |
| **Continuity** | Living World — simulation advances offline and between sessions |
| **Emergence** | System interaction produces stories no designer authored |
| **Longevity** | Deterministic ticks, versioned events, tiered fidelity, archival rollups |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FENIX SIMULATION FRAMEWORK                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────────┐ │
│  │ Time Engine │───►│ Tick Orchestrator │───►│ Engine Scheduler (P0–P3)   │ │
│  └─────────────┘    └──────────────────┘    └──────────────┬──────────────┘ │
│                                                               │               │
│         ┌─────────────────────────────────────────────────────┼───────────┐   │
│         ▼                     ▼                     ▼         ▼           ▼   │
│   ┌───────────┐        ┌───────────┐        ┌───────────┐ ┌─────────┐ ┌─────┐ │
│   │ Citizen   │        │ Economy   │        │ Government│ │ Media   │ │ ... │ │
│   │ Family    │        │ Banking   │        │ Tax       │ │ History │ │     │ │
│   │ Career    │        │ Company   │        │ Healthcare│ │ Legacy  │ │     │ │
│   └─────┬─────┘        └─────┬─────┘        └─────┬─────┘ └────┬────┘ └──┬──┘ │
│         └────────────────────┴────────────────────┴────────────┴─────────┘   │
│                                         │                                     │
│                              ┌──────────▼──────────┐                          │
│                              │   Domain Event Bus   │                          │
│                              │  (sync + outbox)     │                          │
│                              └──────────┬──────────┘                          │
│                    ┌────────────────────┼────────────────────┐                │
│                    ▼                    ▼                    ▼                │
│            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│            │ World Memory │    │ CQRS         │    │ Analytics    │          │
│            │ (append log) │    │ Projections  │    │ Outbox       │          │
│            └──────────────┘    └──────────────┘    └──────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 2. Simulation-First Design Philosophy

## 2.1 Definition

**Simulation-first design** means that gameplay is not a sequence of authored scenes with systemic dressing. Gameplay is the **observable surface** of a deep, interacting model of modern life. Mechanics exist because underlying systems produce them—not because a designer scheduled them.

In Fenix Life, the correct question is never *"What event should happen at age 30?"*  
The correct question is *"What systems, given this citizen's history, skills, relationships, and macro conditions, make age 30 meaningfully different from age 29?"*

## 2.2 Why Emergence Over Script

### 2.2.1 Replayability at Decade Scale

Scripted beats exhaust themselves. A player who has seen "the inheritance surprise" three times recognizes the puppet strings. Systemic outcomes combinatorially explode: the same bankruptcy can stem from medical debt, failed expansion, divorce settlement, fraud exposure, or sector collapse—each with different recovery paths, media coverage, and family consequences.

### 2.2.2 Living World Integrity

The Constitution demands that the world does not wait. Scripted events tied to player presence violate Article II. Emergent events arise from **macro state + agent decisions + institutional rules**, whether or not the player is watching. A competitor's IPO is believable because their company engine ran the same rules as the player's.

### 2.2.3 Citizen Equality

If the player receives bespoke narrative privileges, the Symmetry Principle breaks. Simulation-first design ensures the player's story feels special because **their choices intersected with a real world**, not because a quest flag fired.

### 2.2.4 Teachable Consequences

The Product Bible promises financial literacy through consequence. Scripted windfalls teach nothing. A loan denial that traces to credit history, debt-to-income ratio, and sector risk teaches permanently.

### 2.2.5 World Memory & Legacy

Dynamic History (Constitution Article IX) requires that past events **explain** present conditions. Emergent chains produce encyclopedia entries, newspaper archives, and family reputations that feel earned. Scripted events leave no fossil record.

## 2.3 The Emergence Stack

Every major mechanic must emerge from at least three interacting layers:

| Layer | Examples |
|---|---|
| **Agent state** | Skills, health, personality, relationships, reputation |
| **Institutional rules** | Lending standards, tax code, labor law, accreditation |
| **Macro conditions** | Interest rates, sector cycles, weather, migration, policy regime |

**Approved design pattern:** A housing crisis emerges when Housing Engine supply tightens, Banking Engine credit loosens then tightens, Economy Engine unemployment rises, and Media Engine sentiment shifts—producing foreclosures, bankruptcies, and political pressure without a "Crisis Event" card.

**Rejected design pattern:** A popup at year 10 that says "Housing market crashes" and applies a flat −30% modifier unrelated to prior simulation state.

## 2.4 Where Script Is Permitted

Script is a **spice**, not the meal:

| Permitted | Forbidden |
|---|---|
| Flavor text templates parameterized by systemic outcomes | Branching scenes that ignore simulation state |
| Tutorial scaffolding that mirrors real systems | Player-only lucky breaks |
| Cultural flavor packs (names, locales, institutions) | Hard-coded wins for engagement metrics |
| Milestone **recognition** (achievements) when systems cross thresholds | Milestone **fabrication** that bypasses systems |

## 2.5 The Five Capitals as Emergence Lenses

Every engine must declare which of the Five Capitals it transforms. Emergent stories often arise from **capital tradeoffs**:

- Maximizing Financial Capital through leverage while Human Capital (health) decays
- Building Social Capital through politics at the cost of Family Capital
- Converting Business Capital into Legacy Capital through succession—or destroying it through scandal

No engine optimizes a single capital in isolation without constitutional review.

## 2.6 Simulation-First Review Questions

Before any mechanic ships:

1. What systems produce this outcome without custom logic?
2. Could an AI citizen experience the same outcome?
3. Will this leave a trace in World Memory?
4. If we removed the UI, would the simulation still compute the same result?
5. Can a player explain *why* it happened using in-game information?

---

# 3. Framework Architecture

## 3.1 Architectural Principles

| Principle | Meaning |
|---|---|
| **Sovereign worlds** | Each `WorldInstance` is authoritative; no peer directly mutates another |
| **Event notification, not delegation** | Engines publish facts; they do not call each other synchronously |
| **Single writer per aggregate** | A citizen's vitals belong to Citizen Engine; banking mutates via events and commands |
| **Deterministic ticks** | Same seed + inputs + version → same outcomes (debugging, anti-cheat) |
| **Tiered fidelity** | Not every citizen is fully simulated every tick |
| **Append-only memory** | Consequential facts are never deleted—only superseded or compensated |
| **Projections are disposable** | Dashboards rebuild from events; snapshots are performance caches |

## 3.2 Layer Model

```
┌────────────────────────────────────────────────────────┐
│ L4 — Presentation Bridge (client, NOT part of FSF)   │
│      View models, notifications, "While You Were Away" │
├────────────────────────────────────────────────────────┤
│ L3 — Projections & Queries (CQRS read models)        │
│      Net worth, news feed, leaderboards, dashboards    │
├────────────────────────────────────────────────────────┤
│ L2 — Domain Engines (FSF core)                       │
│      Citizen, Company, Economy, Government, ...       │
├────────────────────────────────────────────────────────┤
│ L1 — Kernel (FSF spine)                              │
│      Time Engine, Tick Orchestrator, Event Bus, Rules  │
├────────────────────────────────────────────────────────┤
│ L0 — Persistence Adapters                            │
│      Save snapshots, event log, blob archives          │
└────────────────────────────────────────────────────────┘
```

Engines live at **L2**. They never import UI. They never query another engine's internal state directly—they request **read interfaces** backed by projections or publish **commands** that the owning engine validates.

## 3.3 The Kernel

### Time Engine

The **only engine with no upstream simulation dependency**. It owns the simulation clock, calendar, speed modes, pause policy, and tick phase boundaries. It does not compute payroll, aging, or markets—it **schedules** who does.

### Tick Orchestrator

Sits between Time Engine and all domain engines. Responsibilities:

- Enforce **blocking decision gates** before time advances (margin calls, death, legal summons, partnership votes)
- Dispatch tick phases in **dependency-resolved order**
- Apply **priority queues** (P0 player-blocking → P3 aggregate)
- Collect per-phase timing metrics for profiling
- Commit or rollback a tick as an **atomic unit** from the perspective of game time

### Domain Event Bus

In-process, synchronous dispatch per world instance. Handlers may enqueue async work via **outbox** (Fenix Network, analytics, cloud catch-up)—but **authoritative state mutation** for a tick completes before the tick commits.

### Rule Registry

Central catalog of **versioned rule sets**: tax brackets, lending formulas, aging curves, industry templates, policy definitions. Engines read rules; they do not hard-code constants. Mods and live ops tune via data packs within bounded guardrails.

## 3.4 Engine Taxonomy

Engines are grouped by domain. Groups communicate only through events and shared projections—not through group-internal APIs.

| Domain | Engines |
|---|---|
| **Temporal** | Time Engine |
| **Agents** | Citizen, Family |
| **Human Development** | Education, Career, Healthcare |
| **Commerce** | Company, Banking, Investment, Economy |
| **Civic** | Government, Tax |
| **Infrastructure** | Housing, Transportation |
| **Information** | Media, Event, Analytics |
| **Environment** | Weather |
| **Memory** | Legacy, History |
| **Network** | Multiplayer |

## 3.5 Agent Fidelity Tiers

The FSF does not simulate millions of citizens at full fidelity. It simulates **the right citizens at the right depth at the right time**.

| Tier | Population | Fidelity | Promotion Triggers |
|---|---|---|---|
| **T0 — Sovereign** | Player + active heirs | Full engine participation | Player control, succession |
| **T1 — Inner Circle** | ~500 | Named, relationship graph, career, finances | Hiring, romance, rivalry, litigation |
| **T2 — Active Market** | ~50,000 | Statistical agent, hireable, competes | Job market match, investment, media mention |
| **T3 — Aggregate** | Millions | Sector counts, flows, distributions | Never individually promoted unless systemic anomaly |

**Demotion** occurs when agents leave player adjacency (employee quits and moves cities, ex-spouse fades) to reclaim budget.

## 3.6 WorldInstance Boundary

Everything inside the FSF operates within one `WorldInstance`:

- One simulation seed and ruleset version chain
- One authoritative event log
- One clock
- One citizen equality domain

Fenix Network (Multiplayer Engine) projects **contracts** across instances—it never becomes a second authority inside a peer's world.

---

# 4. Engine Specifications

Each engine follows a standard contract. **Update frequency** refers to the deepest tick at which the engine performs meaningful work for its active population tier—not every engine runs heavy logic on every sub-tick.

---

## 4.1 Time Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Simulation calendar; clock speed; pause/run modes; tick phase emission; decision gate registry; offline Δt calculation; time-travel bounds (dev only) |
| **Inputs** | Player commands (pause, advance, speed); orchestrator completion signals; `WorldInstance` config (start date, calendar rules) |
| **Outputs** | `simulationTime` state; `TickPhaseStarted` / `TickPhaseCompleted`; `TimeAdvanced` with delta metadata |
| **Dependencies** | None (kernel) |
| **Events published** | `time.advanced`, `time.tick_phase_started`, `time.tick_phase_completed`, `time.paused`, `time.resumed`, `time.speed_changed` |
| **Events consumed** | `orchestrator.tick_blocked`, `orchestrator.tick_committed` (gate advancement) |
| **Update frequency** | Continuous (command-driven); emits sub-ticks on calendar boundaries |
| **Performance** | O(1) per command; must never block on domain engines; phase scheduling is table-driven |

**Philosophy note:** Pause is a **player affordance**, not world default. Offline progression uses Time Engine to compute elapsed simulation time without requiring active session.

---

## 4.2 Citizen Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Identity, vitals, aging, personality, skills, needs (energy, stress), reputation scores, dreams/aspirations, memory of significant experiences, death eligibility, tier assignment |
| **Inputs** | Rule Registry (aging curves, skill decay); healthcare outcomes; education credentials; career performance signals; relationship deltas; economic stress |
| **Outputs** | Citizen aggregate state mutations; promotion/demotion between tiers; biographical fact streams |
| **Dependencies** | Time Engine (tick boundaries); Rule Registry |
| **Events published** | `citizen.born`, `citizen.aged`, `citizen.skill_changed`, `citizen.reputation_changed`, `citizen.stress_threshold_crossed`, `citizen.died`, `citizen.tier_promoted`, `citizen.tier_demoted` |
| **Events consumed** | `education.graduated`, `career.employed`, `career.terminated`, `family.married`, `family.divorced`, `healthcare.diagnosis`, `banking.defaulted`, `media.scandal_exposed`, `legal.convicted` |
| **Update frequency** | Daily (vitals, stress); Yearly (aging, skill decay); On-event (birth, death, major memory) |
| **Performance** | T0/T1: full update. T2: batch utility updates. T3: no per-citizen representation—feeds aggregate counts to Economy. Use typed arrays for bulk T2 stats. Target: <2ms daily for T0+T1 combined |

**Symmetry Principle:** Player citizens use identical rules. UI may surface more detail; it may not alter formulas.

---

## 4.3 Family Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Marriage contracts, divorce settlements, childbirth, adoption, guardianship, inheritance structures, dynasty reputation, family tree integrity, prenuptial terms, estrangement |
| **Inputs** | Citizen identities; relationship states; legal policy (Government); asset registry snapshots; tax rules |
| **Outputs** | Family units; lineage graph; inheritance plans; pending succession workflows |
| **Dependencies** | Citizen Engine; Government Engine (marriage law); Banking Engine (asset transfer); Tax Engine |
| **Events published** | `family.married`, `family.divorced`, `family.child_born`, `family.adoption_finalized`, `family.estate_opened`, `family.inheritance_disputed`, `family.dynasty_reputation_changed` |
| **Events consumed** | `citizen.born`, `citizen.died`, `citizen.aged`, `relationship.partnered`, `banking.account_frozen`, `legal.will_probated`, `tax.estate_tax_assessed` |
| **Update frequency** | Weekly (relationship maintenance within family); On-event (marriage, birth, death); Generational (succession) |
| **Performance** | Graph operations localized to affected family IDs; avoid full-tree walks per tick. Inheritance triggers saga, not synchronous deep recursion |

---

## 4.4 Education Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Enrollment, curricula, grades, graduation, credentials, prestige decay, student debt, university institutions (as participant), research output hooks, alumni networks |
| **Inputs** | Citizen age and skills; family financial state; institution capacity (Living World institutions); government funding policy |
| **Outputs** | Credentials; skill bundles; labor pool graduate cohorts; research events |
| **Dependencies** | Citizen, Family, Economy (tuition), Government, Banking (student loans) |
| **Events published** | `education.enrolled`, `education.graduated`, `education.dropped_out`, `education.credential_earned`, `education.research_breakthrough`, `education.cohort_released` |
| **Events consumed** | `citizen.born`, `citizen.aged`, `family.child_born`, `banking.loan_disbursed`, `government.policy_enacted`, `economy.tuition_index_adjusted` |
| **Update frequency** | Monthly (semester progress); Yearly (graduation cohorts, prestige decay); Daily during exam periods (T0/T1 only) |
| **Performance** | Batch semester updates by institution; T2 graduates as statistical cohorts without individual class simulation |

---

## 4.5 Career Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Job search, applications, interviews, offers, employment contracts, performance, promotion, termination, unemployment, retirement, side gigs, burnout, labor market matching |
| **Inputs** | Citizen skills and credentials; company job postings; economy unemployment and wage indices; company performance |
| **Outputs** | Employment records; income schedules; performance ratings; labor market flows |
| **Dependencies** | Citizen, Education, Company, Economy, Banking (payroll accounts) |
| **Events published** | `career.job_applied`, `career.hired`, `career.promoted`, `career.terminated`, `career.unemployed`, `career.retired`, `career.salary_changed`, `career.burnout_critical` |
| **Events consumed** | `education.graduated`, `company.job_posted`, `company.layoff`, `company.bankrupt`, `economy.sector_demand_changed`, `citizen.stress_threshold_crossed`, `healthcare.disability_declared` |
| **Update frequency** | Weekly (T0 job actions, interview pipelines); Monthly (payroll performance); Yearly (retirement eligibility) |
| **Performance** | Matching algorithm runs in batches at weekly boundary. T2 hiring uses statistical fit scores, not full interview simulation unless promoted |

---

## 4.6 Company Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Founding, cap table, departments, products, operations, P&L, valuation, IPO, M&A, bankruptcy, NPC strategic AI, market share, R&D pipelines |
| **Inputs** | Economy demand; employee supply; banking credit; government regulation; investment flows; transportation and housing costs |
| **Outputs** | Company financials; job postings; products; competitor pressure; historical corporate records |
| **Dependencies** | Economy, Banking, Career, Investment, Government, Tax, Media |
| **Events published** | `company.founded`, `company.funding_round_closed`, `company.product_launched`, `company.ipo_completed`, `company.acquired`, `company.bankrupt`, `company.earnings_reported`, `company.job_posted`, `company.layoff` |
| **Events consumed** | `economy.sector_demand_changed`, `banking.loan_approved`, `banking.loan_defaulted`, `investment.order_filled`, `government.policy_enacted`, `career.hired`, `media.scandal_exposed`, `weather.supply_chain_disrupted` |
| **Update frequency** | Daily (active projects); Monthly (P&L, payroll); Quarterly (earnings); Weekly (NPC strategy for T1/T2 firms) |
| **Performance** | Player company: full resolution. T2 NPC firms: sampled operations. T3: sector aggregate supply/demand only. Dirty-flag P&L recompute |

---

## 4.7 Banking Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Accounts, ledger (double-entry), loans, credit scores, interest accrual, foreclosure, mergers, payment rails, fraud flags, transaction history |
| **Inputs** | Citizen/company financial facts; economy interest rates; government deposit insurance policy; tax withholding directives |
| **Outputs** | Balances; creditworthiness; loan contracts; ledger entries (immutable) |
| **Dependencies** | Economy (rates), Government (regulation), Tax (withholding), Citizen/Company aggregates |
| **Events published** | `banking.account_opened`, `banking.transaction_posted`, `banking.loan_approved`, `banking.loan_payment_missed`, `banking.defaulted`, `banking.foreclosure_initiated`, `banking.credit_score_changed` |
| **Events consumed** | `career.salary_changed`, `company.payroll_due`, `tax.withholding_assessed`, `investment.margin_call`, `family.inheritance_disputed`, `economy.rate_changed` |
| **Update frequency** | Daily (transaction processing); Monthly (loan payments, statements); On-event (loan applications) |
| **Performance** | Ledger writes batched at tick commit. Credit score recompute on dirty citizens only. Never scan all accounts per daily tick |

---

## 4.8 Investment Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Securities, portfolios, orders, market microstructure abstraction, dividends, margin, private equity stakes, fund vehicles, insider restrictions |
| **Inputs** | Economy indices and sector prices; company fundamentals; banking buying power; government securities regulation |
| **Outputs** | Holdings; trade executions; portfolio risk metrics; corporate ownership stakes |
| **Dependencies** | Banking, Economy, Company, Government, Tax |
| **Events published** | `investment.order_placed`, `investment.order_filled`, `investment.dividend_received`, `investment.margin_call`, `investment.stake_acquired`, `investment.insider_violation_flagged` |
| **Events consumed** | `company.ipo_completed`, `company.earnings_reported`, `economy.market_crash`, `economy.rate_changed`, `banking.account_frozen`, `government.policy_enacted` |
| **Update frequency** | Daily (price marks, order matching abstraction); Monthly (dividends); Quarterly (fund reporting) |
| **Performance** | Price updates at economy tier. Individual portfolios updated on dirty flag. T3 citizens hold aggregate index exposure, not tick-by-tick portfolios |

---

## 4.9 Economy Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Macro cycles, inflation, unemployment, wage indices, sector demand, trade flows, consumer confidence, labor pool statistics, market indices |
| **Inputs** | Government policy; tax receipts; company aggregate output; citizen consumption; weather (agriculture/energy); transportation costs; media sentiment |
| **Outputs** | Macro state vector; price indices; sector health; shock propagation |
| **Dependencies** | Government, Tax, Company (aggregates), Citizen (aggregates), Weather, Transportation |
| **Events published** | `economy.rate_changed`, `economy.inflation_index_updated`, `economy.sector_demand_changed`, `economy.recession_entered`, `economy.recession_exited`, `economy.market_crash`, `economy.wage_index_adjusted` |
| **Events consumed** | `government.policy_enacted`, `government.election_completed`, `tax.revenue_reported`, `company.bankrupt`, `weather.crop_yield_changed`, `media.sentiment_shifted`, `transportation.fuel_price_changed` |
| **Update frequency** | Monthly (indices); Quarterly (cycle checks); Yearly (structural adjustments) |
| **Performance** | Macro state is small fixed vector—cache between sub-ticks. Sector detail lazy-loaded. Shocks propagate via event fan-out, not global synchronous recompute |

---

## 4.10 Government Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Elections, legislation, regulation, agencies, public spending, law enforcement hooks, citizenship rules, international treaty hooks (expansion) |
| **Inputs** | Economy conditions; media sentiment; citizen political engagement; tax revenue |
| **Outputs** | Policy regimes; regulatory constraints; public institutions; election results |
| **Dependencies** | Economy, Tax, Media, Citizen (political careers) |
| **Events published** | `government.election_completed`, `government.policy_enacted`, `government.regulation_enforced`, `government.spending_program_launched`, `government.crisis_declared` |
| **Events consumed** | `economy.recession_entered`, `media.scandal_exposed`, `tax.revenue_shortfall`, `citizen.died` (office succession), `company.antitrust_complaint` |
| **Update frequency** | Yearly (elections); On-cycle (policy review); Event-driven (crisis response) |
| **Performance** | Policy changes are infrequent but fan out widely—use versioned policy IDs so engines cache applicable rules per tick |

---

## 4.11 Tax Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Income tax, corporate tax, capital gains, estate tax, VAT/sales tax, withholding, filing, audits, penalties, refunds |
| **Inputs** | Government tax policy; citizen/company financial facts; banking transaction categories; family status |
| **Outputs** | Tax assessments; withholding schedules; audit flags; government revenue events |
| **Dependencies** | Government, Banking, Career, Company, Investment, Family |
| **Events published** | `tax.withholding_assessed`, `tax.return_filed`, `tax.audit_opened`, `tax.penalty_assessed`, `tax.estate_tax_assessed`, `tax.refund_issued`, `tax.revenue_reported` |
| **Events consumed** | `career.salary_changed`, `company.earnings_reported`, `investment.order_filled`, `family.divorced`, `family.estate_opened`, `government.policy_enacted`, `banking.transaction_posted` |
| **Update frequency** | Monthly (withholding); Quarterly (estimated payments); Yearly (filing); On-event (estate) |
| **Performance** | Rule evaluation is data-driven. Batch assessments per jurisdiction. Audit selection uses statistical sampling for T2/T3 |

---

## 4.12 Healthcare Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Health state, insurance, medical events, chronic conditions, mental health, disability, life expectancy modifiers, healthcare industry demand |
| **Inputs** | Citizen age and lifestyle; weather epidemics; government healthcare policy; family genetics hooks |
| **Outputs** | Diagnoses; treatment costs; disability status; mortality risk contributions |
| **Dependencies** | Citizen, Banking, Insurance hooks, Government, Weather |
| **Events published** | `healthcare.insurance_enrolled`, `healthcare.diagnosis`, `healthcare.treatment_completed`, `healthcare.disability_declared`, `healthcare.mortality_risk_elevated` |
| **Events consumed** | `citizen.aged`, `citizen.stress_threshold_crossed`, `weather.epidemic_started`, `economy.healthcare_cost_index_changed`, `government.policy_enacted` |
| **Update frequency** | Daily (T0 acute recovery); Monthly (chronic progression); Yearly (age-related risk) |
| **Performance** | Full medical simulation for T0/T1 only. T2/T3 use actuarial tables for population health aggregates |

---

## 4.13 Housing Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Property inventory, titles, mortgages, rent, development, zoning, vacancy, price indices, foreclosure transfers, household formation |
| **Inputs** | Economy rates and income; banking mortgage products; government zoning; transportation accessibility; weather disaster risk |
| **Outputs** | Property transactions; rent rolls; housing supply metrics; title changes |
| **Dependencies** | Banking, Economy, Government, Tax, Family, Transportation, Weather |
| **Events published** | `housing.property_listed`, `housing.sale_closed`, `housing.rent_due`, `housing.foreclosure_completed`, `housing.development_completed`, `housing.price_index_updated` |
| **Events consumed** | `banking.loan_approved`, `banking.foreclosure_initiated`, `family.married`, `family.divorced`, `economy.rate_changed`, `government.zoning_changed`, `weather.disaster_struck` |
| **Update frequency** | Monthly (rent, mortgage); Weekly (listings turnover for active markets); On-event (transactions) |
| **Performance** | Spatial indexing by city region. Player-adjacent markets fully simulated; distant markets as price index + statistical transactions |

---

## 4.14 Transportation Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Personal vehicles, public transit, logistics costs, fuel prices, commute time modifiers, supply chain delays, airline/rail hooks (expansion) |
| **Inputs** | Economy fuel indices; government infrastructure spending; weather disruptions; company shipping demand |
| **Outputs** | Mobility state; logistics cost multipliers; commute effects on citizen time budgets |
| **Dependencies** | Economy, Government, Weather, Company, Citizen |
| **Events published** | `transportation.vehicle_acquired`, `transportation.commute_burden_changed`, `transportation.fuel_price_changed`, `transportation.supply_chain_delayed` |
| **Events consumed** | `economy.sector_demand_changed`, `weather.storm_severe`, `government.infrastructure_completed`, `company.product_launched` |
| **Update frequency** | Monthly (fuel, maintenance); Weekly (commute recalc for T0/T1); Event-driven (disasters) |
| **Performance** | Aggregate logistics as economy multipliers. Individual vehicle ownership only T0/T1 |

---

## 4.15 Media Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | News generation, sentiment, scoops, reputation amplification, social trends, obituaries, investigative delays, platform algorithms (abstracted) |
| **Inputs** | Significant events from all engines; citizen fame; company public status; government activity |
| **Outputs** | News articles; sentiment indices; notification candidates; World Memory narrative artifacts |
| **Dependencies** | All engines (subscriber); History Engine (archival); Citizen (reputation) |
| **Events published** | `media.article_published`, `media.sentiment_shifted`, `media.scandal_exposed`, `media.trend_started`, `media.obituary_published` |
| **Events consumed** | All milestone domain events (curated subscription list); `history.milestone_recorded` |
| **Update frequency** | Daily (news cycle); Weekly (trend evolution); On-event (breaking news) |
| **Performance** | Template-based generation from event payloads—no LLM in hot path. Batch articles at daily boundary. Player notifications prioritized P0 |

**Constitutional alignment:** Media explains the world; it does not replace simulation. Articles reference real event IDs.

---

## 4.16 Event Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | **Systemic** hazard and opportunity orchestration—natural disasters, accidents, discoveries, black swan shocks—not scripted narrative. Samples from distributions conditioned on macro and regional state |
| **Inputs** | Weather; economy stress; regional infrastructure; citizen risk profiles; government preparedness |
| **Outputs** | Hazard events with structured payloads for downstream engines |
| **Dependencies** | Weather, Economy, Government, Citizen aggregates |
| **Events published** | `event.disaster_triggered`, `event.accident_occurred`, `event.serendipity_triggered`, `event.black_swan_initiated` |
| **Events consumed** | `weather.disaster_struck`, `economy.recession_entered`, `government.crisis_declared` |
| **Update frequency** | Daily (micro-risk sampling for T0/T1); Monthly (regional hazard rolls); Rare event tables yearly |
| **Performance** | Poisson-style draws with seeded RNG per region. Never roll per T3 citizen individually |

**Distinction from Media:** Event Engine **causes**; Media Engine **reports**.

---

## 4.17 Weather Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Regional climate, seasons, storms, droughts, epidemics (environmental triggers), climate trend hooks (expansion) |
| **Inputs** | Geographic region config; yearly climate drift; government environmental policy (expansion) |
| **Outputs** | Regional weather state; disaster triggers; agricultural yield modifiers |
| **Dependencies** | Time Engine (seasonality); Rule Registry (climate tables) |
| **Events published** | `weather.season_changed`, `weather.storm_severe`, `weather.drought_active`, `weather.disaster_struck`, `weather.crop_yield_changed`, `weather.epidemic_started` |
| **Events consumed** | `time.advanced` (season boundaries) |
| **Update frequency** | Daily (regional conditions); Weekly (storm tracks); Seasonal (climate shifts) |
| **Performance** | Region-level simulation only—not per-tile physics. Compatible with 2D map abstraction |

---

## 4.18 Analytics Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | In-world analytics (company KPIs, economic dashboards for player), simulation telemetry aggregation, balance health metrics, dev profiling feeds |
| **Inputs** | Event stream; projection snapshots; tick timing metrics |
| **Outputs** | Dashboard datasets; telemetry batches (privacy-gated); design-facing economy health reports |
| **Dependencies** | Event Bus (read-only tap); all projections |
| **Events published** | `analytics.metric_computed`, `analytics.anomaly_detected` (dev/balance) |
| **Events consumed** | `orchestrator.tick_committed`, domain milestone events (sampled) |
| **Update frequency** | Continuous (async outbox); Monthly (rollup reports) |
| **Performance** | Never blocks tick commit. Sampling for T3. Ring buffers for dev profiling |

---

## 4.19 Legacy Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Legacy score across Five Capitals, achievements, heir eligibility, will execution, dynasty perks (non-pay-to-win), Hall of Legends candidacy |
| **Inputs** | Citizen lifetime facts; family structure; company continuity; history milestones |
| **Outputs** | Legacy ratings; succession gates; heir buffs that are **informational or relational**, never raw simulation advantages |
| **Dependencies** | Citizen, Family, History, Banking, Company |
| **Events published** | `legacy.score_updated`, `legacy.heir_eligible`, `legacy.dynasty_milestone`, `legacy.hall_inducted` |
| **Events consumed** | `citizen.died`, `family.inheritance_disputed`, `company.acquired`, `history.biography_published`, `media.obituary_published` |
| **Update frequency** | Yearly (score annualization); On-event (death, major milestone) |
| **Performance** | Score computation from projection caches, not full life replay |

**Constitutional guardrail:** Legacy Engine may not grant hidden player stat boosts. Dynasty reputation affects **how NPCs treat you**, not lending formula constants.

---

## 4.20 History Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | World Memory curation—encyclopedia entries, timelines, biographies, corporate histories, crisis records, newspaper archive indexing |
| **Inputs** | Immutable event log; media articles; significant domain events |
| **Outputs** | Historical artifacts; searchable archives; milestone records |
| **Dependencies** | Event log (L0); Media; all milestone publishers |
| **Events published** | `history.milestone_recorded`, `history.biography_published`, `history.encyclopedia_entry_created`, `history.archive_rolled_up` |
| **Events consumed** | All canonical milestone events; `media.article_published` |
| **Update frequency** | On-event (milestones); Yearly (rollup compression); Lazy (on-demand hydration) |
| **Performance** | Append-only writes at event time. Yearly compression merges noise. Cold storage per Database Design Document |

---

## 4.21 Multiplayer Engine

| Aspect | Specification |
|---|---|
| **Responsibilities** | Fenix Network contract layer—gifts, visits, partnerships, cross-investment offers, profile sync, transfer limits, anti-abuse hooks |
| **Inputs** | Outbox from sovereign world; platform auth; peer contracts |
| **Outputs** | Validated cross-instance contract events; async notifications to peers |
| **Dependencies** | Platform services (not in-world); Banking contract abstraction; Moderation |
| **Events published** | `network.gift_transferred`, `network.partnership_formed`, `network.investment_offer_accepted`, `network.visit_scheduled` |
| **Events consumed** | `company.ipo_completed` (public metrics), save sync events, player-initiated contract commands |
| **Update frequency** | Async (real-time wall clock); not tied to simulation tick |
| **Performance** | Never on tick hot path. Outbox drain async. Contract validation O(1) per transaction |

**Sovereignty rule:** Multiplayer Engine proposes **contract commands** to a world; it does not mutate peer saves directly.

---

## 4.22 Cross-Engine Dependency Graph (Simplified)

```
Time ──► Orchestrator ──► [all engines]
Citizen ◄──► Family ◄──► Career ◄──► Company
                │              │           │
                ▼              ▼           ▼
            Banking ◄──── Economy ────► Investment
                │              ▲           │
                ▼              │           ▼
              Tax ◄── Government      Media ──► History
                │              │           │
                ▼              ▼           ▼
            Housing ◄── Transportation   Legacy
                ▲              │
                └── Weather ◄──┘
                     │
                  Event (hazards)
Analytics (observes all)    Multiplayer (async boundary)
```

Cycles are forbidden in **synchronous** calls. Apparent cycles (economy ↔ company) resolve through **ordered tick phases** and **events**.

---

# 5. Simulation Lifecycle

## 5.1 Lifecycle Overview

A `WorldInstance` progresses through **initialization → operational ticks → generational transitions → archival continuity**. Each phase is deterministic given seed, rules version, and input command log.

```
World Seed
    │
    ▼
┌───────────────┐     ┌──────────────────────────────────────────┐
│ Initialization│────►│ Operational Loop (ticks)                  │
└───────────────┘     │  Daily → Weekly → Monthly → Quarterly →  │
                      │  Annual → [Generational when triggered]   │
                      └──────────────┬───────────────────────────┘
                                     │
                      ┌──────────────▼───────────────────────────┐
                      │ End-of-Life → Legacy → Succession         │
                      └──────────────┬───────────────────────────┘
                                     │
                      ┌──────────────▼───────────────────────────┐
                      │ History archival → Continue world         │
                      └──────────────────────────────────────────┘
```

## 5.2 World Initialization

**Purpose:** Create a believable world with past, present, and momentum—not a blank spreadsheet.

### Phase I — Kernel Bootstrap

1. Load `WorldInstance` metadata: seed, schema version, ruleset version, mod manifest hash
2. Initialize Time Engine at configured start date
3. Wire Event Bus and Rule Registry
4. Hydrate save snapshot OR generate new world from **worldgen pipeline**

### Phase II — Structural Generation

1. **Geography & regions** — cities, jurisdictions, climate zones
2. **Institutions** — governments, universities, banks, hospitals (aggregate)
3. **Historical backfill** — 20–50 years of compressed **synthetic history** from seed (prior crises, famous companies, demographic baselines) per Constitution Article IX
4. **Population seeding** — T3 aggregates + sampled T1/T2 named citizens
5. **Economy initial state** — macro vector, sector indices, policy regime

### Phase III — Player Entry

1. Player citizen created or selected (heir) at T0
2. Promotion rules wire player adjacency
3. Initial projections built (CQRS warm cache)
4. `world.initialized` event appended to log

**Outputs:** Playable world with newspapers that already have archives, companies with histories, and labor markets with supply.

## 5.3 Daily Simulation

**Boundary:** One in-game day.

| Stage | Actions |
|---|---|
| **Pre-daily** | Time Engine emits `time.tick_phase_started(daily)` |
| **P0** | Resolve blocking player decisions; process margin calls; acute health |
| **P1** | Player citizen vitals; player company daily ops; active construction |
| **P2** | T1 relationship micro-drift; interview pipeline ticks; local weather |
| **P3** | Aggregate sentiment noise; regional weather rolls |
| **Post-daily** | Media notification queue; Event Engine micro-risk draws |
| **Commit** | `orchestrator.tick_committed(daily)`; dirty projection refresh (async) |

**Budget target:** < 5ms client-side for active tiers (TDD §4.2.1).

## 5.4 Weekly Simulation

**Boundary:** End of in-game week (day 7 cascade).

| Focus | Engines |
|---|---|
| Social maintenance | Family, Citizen (relationships) |
| Labor market | Career (applications, interviews) |
| Organization morale | Company (employee satisfaction) |
| Information cycle | Media (rumors, trend seeds) |
| Mobility | Transportation (commute recalc) |
| Rent (if weekly terms) | Housing |

Weekly ticks **rollup** daily micro-changes where appropriate to prevent double application.

## 5.5 Monthly Simulation

**Boundary:** Calendar month end—the **primary player planning rhythm** (Product Bible §7).

| Focus | Engines |
|---|---|
| **Finance** | Payroll, loan payments, rent, investment marks |
| **Business** | Company P&L resolution, layoffs/hiring batches |
| **Fiscal** | Tax withholding, statements |
| **Markets** | Economy index updates, housing price indices |
| **Education** | Semester progress |
| **Healthcare** | Chronic condition progression |
| **Persistence** | Autosave trigger (mandatory) |

**Budget target:** < 200ms client mid-game (TDD §10.1).

Monthly tick is the **default offline catch-up unit** for short absences.

## 5.6 Quarterly Simulation

**Boundary:** Fiscal quarter end.

| Focus | Engines |
|---|---|
| **Public markets** | Company earnings reports, guidance |
| **Tax** | Estimated tax payments (jurisdictions requiring) |
| **Governance** | Board reviews, dividend declarations |
| **Investment** | Fund performance reporting |
| **Analytics** | KPI rollups for player dashboards |

Quarterly results **feed Media Engine** for earnings season narratives.

## 5.7 Annual Simulation

**Boundary:** Calendar year end—the **structural evolution** beat.

| Focus | Engines |
|---|---|
| **Life course** | Aging, education graduation cohorts, retirement eligibility |
| **Economy** | Inflation adjustment, wage index, cycle phase check |
| **Policy** | Government policy review, election cycles if applicable |
| **Credentials** | Education prestige decay |
| **Legacy** | Annual legacy score computation |
| **History** | Yearly archive snapshot, encyclopedia rollup |
| **Population** | Birth/death statistical reconciliation for T3 |
| **Rules** | Apply annual rule registry updates if scheduled |

Annual tick triggers **yearly compression** of event log per Database Design Document.

## 5.8 Generational Simulation

**Boundary:** Not calendar-driven alone—triggered by **succession events**.

### Triggers

- Player citizen death with eligible heir
- Player voluntary succession (retirement handoff)
- Dynasty challenge events (disputed inheritance)

### Phases

1. **Death processing** — Citizen Engine `citizen.died`; Healthcare ceases; Career terminates
2. **Estate opening** — Family Engine `family.estate_opened`
3. **Saga: Inheritance** — coordinated workflow:
   - Will validation (Government/legal hooks)
   - Asset inventory snapshot (Banking, Investment, Housing, Company stakes)
   - Tax assessment (Tax Engine)
   - Distribution or dispute (Family Engine)
   - Credit and reputation inheritance rules
4. **Heir promotion** — New T0 citizen; prior citizen demoted to historical
5. **Legacy update** — Legacy Engine records continuity
6. **History** — Biography, obituary, encyclopedia update
7. **Player handoff** — UI bridge presents succession screen; simulation already authoritative

**World continues** through generational transition—no world reset.

## 5.9 End-of-Life Processing

Death is a **first-class simulation event**, not a game over screen.

| Step | Owner |
|---|---|
| Mortality resolution | Healthcare + Citizen |
| Employment termination | Career |
| Account freeze / beneficiary routing | Banking |
| Relationship grief effects | Family, Citizen |
| Stock succession / buy-sell agreements | Company, Investment |
| Media obituary | Media |
| Achievement finalization | Legacy |
| Biography generation | History |

All steps emit events. Order enforced by **Inheritance Saga** orchestration with compensating actions on partial failure.

## 5.10 Legacy Creation

Legacy is **computed**, not granted:

| Capital | Legacy Artifacts |
|---|---|
| Financial | Estates, trusts, endowments, debt bombs |
| Human | Mentorship trees, published research, trained successors |
| Social | Reputation, dynastic name weight, institutional influence |
| Business | Ongoing companies, brands, patents |
| Legacy | Hall of Legends, historical recognition, multi-generational narrative |

Legacy Engine writes **scores and eligibility**. History Engine writes **permanent records**. Family Engine writes **structural continuity** (heirs, trusts).

---

# 6. Inter-Engine Communication

## 6.1 Event-Driven Model

The FSF mandates **event notification** over direct calls:

```
Engine A                    Event Bus                    Engine B
   │                            │                            │
   │── publish(LoanApproved) ──►│                            │
   │                            │── dispatch ───────────────►│
   │                            │                            │── handler
   │                            │                            │── mutate own aggregate
   │                            │◄── publish(AccountCredited)│
   │◄── dispatch ───────────────│                            │
```

Engine A does not know Engine B exists. It knows only that `banking.loan_approved` is a fact.

## 6.2 Event Contract (Canonical)

Every event carries (per TDD §3.2):

| Field | Purpose |
|---|---|
| `eventId` | Idempotency |
| `eventType` | Namespaced type (`company.bankrupt`) |
| `aggregateId` | Root entity |
| `aggregateType` | `Citizen`, `Company`, etc. |
| `worldInstanceId` | Sovereign scope |
| `simulationTime` | In-game timestamp |
| `realTime` | Wall clock |
| `schemaVersion` | Evolution |
| `payload` | Typed body |
| `causationId` | Parent event (chain tracing) |
| `correlationId` | Saga/workflow trace |

## 6.3 Decoupling Patterns

| Pattern | Use |
|---|---|
| **Fire-and-forget publish** | Single-writer state change |
| **Idempotent handlers** | `processedEventIds` set per consumer |
| **No circular sync calls** | B responds with new event, not return value |
| **Sagas** | Multi-step: inheritance, IPO, bankruptcy, partnership dissolution |
| **CQRS projections** | UI reads views, not live aggregate graph walks |
| **Outbox** | Fenix Network, analytics—async after tick commit |

## 6.4 Tick Phase Ordering

To prevent race conditions without locks, the Orchestrator enforces **phase order**:

1. **Environment** — Weather, Event hazards
2. **Macro** — Economy, Government policy effects
3. **Institutions** — Banking rates, Tax rules application
4. **Agents** — Citizen vitals, Family, Career
5. **Organizations** — Company operations
6. **Markets** — Investment, Housing transactions
7. **Information** — Media, History recording
8. **Memory** — Analytics sampling, projection invalidation flags

Within a phase, engines are **parallelizable** if they share no aggregate writers.

## 6.5 Cascading Event Examples

### Example A — Company Bankruptcy Chain

```
company.earnings_reported (miss)
  → investment.order_filled (sell pressure)
    → economy.sector_demand_changed
      → company.layoff
        → career.terminated (×N)
          → banking.loan_payment_missed (mortgages)
            → housing.foreclosure_initiated
              → media.article_published
                → history.milestone_recorded
                  → citizen.stress_threshold_crossed
```

Each hop is a separate event. Media does not "decide" to report—the article template reads payload facts.

### Example B — Policy Response to Recession

```
economy.recession_entered
  → government.crisis_declared
    → government.policy_enacted (stimulus)
      → tax.withholding_adjusted
        → banking.loan_approved (SBA-style program)
          → company.founded (×statistical)
            → education.enrolled (retraining)
              → media.sentiment_shifted
```

### Example C — Player Death and Succession

```
citizen.died
  → career.terminated
  → company.board_seat_vacated (if CEO)
  → family.estate_opened
    → banking.account_frozen
    → tax.estate_tax_assessed
    → family.inheritance_disputed (if applicable)
      → investment.stake_transferred
        → legacy.heir_eligible
          → history.biography_published
            → media.obituary_published
```

Saga orchestrator ensures estate cannot distribute before tax assessment.

### Example D — Weather Disaster

```
weather.disaster_struck
  → event.disaster_triggered
    → housing.property_damaged
      → banking.insurance_claim_processed
        → company.supply_chain_disrupted
          → economy.sector_demand_changed
            → government.crisis_declared
              → media.article_published
```

## 6.6 Commands vs Events

| Mechanism | Direction | Example |
|---|---|---|
| **Command** | External intent → owning engine validates | `ApplyForLoan` → Banking |
| **Event** | Fact emitted after state change | `banking.loan_approved` |
| **Query** | Read projection | `GetNetWorth` → CQRS view |

Player actions and AI decisions issue **commands**. Engines emit **events**. Other engines never call `approveLoan()` directly.

## 6.7 Failure Handling

| Failure Type | Response |
|---|---|
| Handler exception | Roll back tick phase; log; dev builds halt |
| Saga step failure | Compensating event (e.g., `inheritance.reverted`) |
| Outbox delivery failure | Retry with backoff; dead letter queue |
| Schema mismatch | Version adapter; reject if incompatible |

---

# 7. Scalability Architecture

## 7.1 Scale Targets

| Dimension | Target |
|---|---|
| In-game time | 50–80 years per citizen life; multi-generational |
| Citizens | Millions (T3 aggregate); 50k T2; 500 T1; 1+ T0 |
| Companies | Millions aggregate; thousands active |
| Event log | Decades compressed; hot index 50 in-game years |
| Offline catch-up | 1 in-game year in < 30s cloud (TDD §10.1) |
| Monthly tick | < 200ms client mid-game |

## 7.2 Tiered Fidelity (Primary Lever)

The FSF scales because **full simulation is a privilege earned by relevance**, not a default:

- **Promotion** materializes detail when a statistical agent becomes important
- **Demotion** returns agents to pools when adjacency ends
- **T3** never stores individual balance sheets—only distributions

## 7.3 Spatial & Sector Partitioning

| Partition | Purpose |
|---|---|
| **City regions** | Weather, housing, labor market scoped |
| **Industry sectors** | Company aggregate competition |
| **Jurisdiction** | Tax, government policy |
| **Tick phase shards** | Parallelize independent regions within a phase |

## 7.4 Dirty Tracking & Memoization

- Aggregates mark **dirty** on inbound events affecting them
- Economy macro vector **memoized** between sub-ticks
- P&L recomputed only for companies with activity flags
- Credit scores lazily rebuilt on financial events

## 7.5 Batch-Oriented Persistence

Per Database Design Document:

- Writes flush at **tick commit**, not per micro-action
- Ledger entries batch insert
- Projections rebuild async post-commit
- Historical rollups yearly

## 7.6 Background Simulation

| Mode | When | Behavior |
|---|---|---|
| **Embedded** | Client active | Web Worker / WASM tick runtime |
| **Cloud catch-up** | Away > 24h real time | BullMQ `simulation:catchup` queue |
| **Hybrid validation** | Sync | Checksum compare; never dual authority |

Background workers run **monthly units** for long absences, with daily granularity for recent period if settings demand.

## 7.7 Save and Resume

### Save Package Contents

- Authoritative snapshot (compressed aggregates)
- Event log tail since last snapshot
- Clock state, seed, rules versions
- Processed saga checkpoints
- Outbox pending

### Resume Flow

1. Load snapshot + replay events since checkpoint OR hydrate full blob
2. Rebuild projections (async, UI shows loading)
3. If offline Δt > threshold, enqueue catch-up before interactive play
4. Present digest

**15+ year schema survival** via versioned migrations (TDD §7).

## 7.8 Offline Progression

Constitution Article II: world continues.

1. On session end: persist `lastSimulationTime`, checksum, outbox
2. Optional cloud worker advances per account policy
3. On return: compute Δt, catch-up if needed
4. **"While You Were Away"** digest from event log queries

Player pause ≠ world pause (except explicit player mode).

## 7.9 Cloud Synchronization

| Data | Strategy |
|---|---|
| Save blob | Azure Blob; ZSTD compression |
| Metadata | PostgreSQL index |
| Conflict | Last-write-wins with checksum mismatch flag OR manual resolve (TDD §7) |
| Fenix Network | Outbox only—never tick sync |
| Event log tail | Incremental upload optional for cloud saves |

Sovereign rule: **one authority per world instance** at any moment.

## 7.10 Determinism & Anti-Cheat

Given identical:

- World seed
- Ruleset version
- Command log
- Engine version

→ Outcomes must match. Enables replay debugging and server-side validation of suspicious saves.

## 7.11 Horizontal vs Vertical Scale

| Layer | Scale approach |
|---|---|
| Platform (accounts) | Horizontal replicas |
| World simulation | Vertical + tiering; one worker per heavy catch-up job |
| Event log | Partition by `worldInstanceId` + year |
| Projections | Rebuild workers horizontal |

---

# 8. Debugging & Developer Tooling

## 8.1 Design Goals

| Goal | Tooling |
|---|---|
| Explain why | Event causation chains |
| Reproduce bugs | Deterministic replay |
| Find lag | Per-engine tick profiler |
| Balance economy | Macro dashboards |
| Audit fairness | Citizen symmetry diff viewer |

## 8.2 Simulation Inspector

**Dev-only** overlay exposing:

- Current simulation time, tick phase, speed
- Active tier counts (T0/T1/T2/T3)
- Pending blocking decisions
- Last 20 events with payloads (redacted in prod)
- Engine dirty flags
- Macro state vector

**Actions:** Force promote/demote agent (dev), step one tick phase, inject command.

## 8.3 Event Tracing

| Feature | Description |
|---|---|
| **Causation graph** | Walk `causationId` chains from any event |
| **Correlation view** | All events in a saga (`correlationId`) |
| **Subscription debugger** | Which handlers ran, timing, errors |
| **Event log export** | JSONL for bug reports |

Production: sampled tracing only; full log in dev builds.

## 8.4 Replay System

1. Record: seed + rules version + command log + engine version
2. Replay: headless FSF run in CI or local
3. Diff: aggregate checksums at each monthly boundary
4. Use cases: regression tests, exploit investigation, balance patches

## 8.5 Time Travel (Dev Only)

- Snapshot checkpoints every monthly tick (dev config)
- Seek to date; inspect projections
- **Never** in production multiplayer contexts

## 8.6 Performance Profiler

Per tick phase breakdown:

```
Monthly Tick — 142ms total
├── Economy        12ms
├── Company        48ms  ⚠
├── Banking        22ms
├── Career         18ms
├── Citizen         8ms
├── Media           6ms
└── ...
```

Chrome Performance API (client) + Application Insights (cloud). Ring buffer in Analytics Engine.

## 8.7 Developer Dashboards

| Dashboard | Audience |
|---|---|
| **Macro health** | Economy team—inflation, unemployment, bankruptcy rate |
| **Engine balance** | Design—promotion rates, tier distribution |
| **Event throughput** | Engineering—events/sec, handler failures |
| **Catch-up performance** | Platform—job duration, queue depth |
| **Symmetry audit** | QA—player vs AI formula parity |

## 8.8 Scenario Fixtures

Declarative **world scenarios** for CI:

- `recession_2031.json` — macro initial conditions
- `inheritance_dispute.json` — family saga test
- `ipo_pipeline.json` — company lifecycle

Fixtures seed worlds without playing 20 years manually.

## 8.9 Logging Standards

Structured logs (TDD §11.1):

- `worldInstanceId`, `correlationId`, `simulationDate`, `eventType`, `durationMs`
- Crash breadcrumbs: last 50 player commands (no PII)
- Sentry integration client/server

## 8.10 Balance Tuning Workflow

1. Analytics Engine detects anomaly (`bankruptcy_rate > 2σ`)
2. Designer adjusts Rule Registry parameters (bounded)
3. Replay fixture suite validates
4. Live ops flag for gradual rollout

**Never** hot-patch engine code for balance—tune rules data.

---

# 9. Governance & Evolution

## 9.1 FSF Change Control

| Change Type | Process |
|---|---|
| New engine | Constitution integration review; TDD module addition |
| New event type | Schema registry; version bump; subscriber audit |
| Rule formula change | Replay regression; changelog |
| Tier policy change | Performance benchmark |
| Breaking schema | Migration plan; N/N-1 readers |

## 9.2 Mod API Boundary

Mods may:

- Add industries, careers, countries (data packs)
- Tune bounded formula parameters
- Register event **handlers** on stable hooks

Mods may not:

- Override Symmetry Principle
- Inject player-only advantages
- Bypass World Memory
- Mutate peer worlds directly

## 9.3 Expansion Integration

Per Constitution Article X, expansions add **engines or sub-engines** that:

1. Publish/consume events on the bus
2. Declare capital impacts
3. Write to History
4. Support AI citizens at T2/T3

Example: **Politics expansion** extends Government + Career + Media—not a separate "Politics Mode."

## 9.4 Document Map

| Question | Document |
|---|---|
| Why does this exist? | Product Bible |
| Is it constitutional? | Design Constitution |
| How is it built/deployed? | TDD |
| How is it stored? | Database Design Document |
| How does the world simulate? | **This document (FSF)** |

## 9.5 Closing Declaration

The Fenix Simulation Framework exists so that Fenix Life remains **one living world**—not a collection of minigames, not a visual novel with spreadsheets, not a player-centric power fantasy.

It simulates citizens equally. It advances time honestly. It remembers. It scales. It explains itself.

When engineering faces a trade-off between **fast scripting** and **slow emergence**, the FSF chooses emergence—because that is what Fenix Life promises.

---

*End of Fenix Simulation Framework v1.0*
