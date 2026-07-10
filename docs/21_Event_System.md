# Fenix Life — Event System (FES)

**Document Version:** 1.0  
**Status:** Canonical — Event Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Principal Simulation Architect  
**Audience:** Engineering, Game Design, AI Systems, Economy Design, Narrative, QA, Live Ops, Data  

---

## Document Authority

The Fenix Event System (FES) defines **how consequential moments enter, propagate through, and persist within sovereign Fenix Life worlds**. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Emergence philosophy, living world, consequence loops |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Living World, Five Capitals, World Memory, Emergent Storytelling |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Event Engine (§4.16), Event Bus, tick orchestration, engine contracts |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Event-driven architecture (§3), domain event catalog |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Event log, World Memory, tiering, retention |
| [Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | Synthetic historical events at world birth |

When event design conflicts with simulation philosophy, **align with philosophy first**. Events must **cause** systemic change—not replace it with scripted outcomes.

**What the FES is:**

- The **taxonomy and contract layer** for all simulation events—domain, hazard, emergent, and synthetic
- The **trigger and propagation model** that ensures events cascade believably across engines
- The **World Memory integration spec** that makes every consequential moment auditable and narratively accessible
- The **governance framework** for adding new event types without breaking determinism or Citizen Equality

**What the FES is not:**

- A quest system or narrative script runner
- A popup notification framework (that consumes events; it does not define them)
- A multiplayer authority layer (Fenix Network uses outbox contracts, not in-world event mutation)
- A replacement for engine-specific business logic (events signal outcomes; engines compute them)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Event Philosophy](#2-event-philosophy)
3. [Event Taxonomy](#3-event-taxonomy)
4. [Event Architecture in FSF](#4-event-architecture-in-fsf)
5. [Trigger Model](#5-trigger-model)
6. [Propagation & Cascades](#6-propagation--cascades)
7. [Event Contracts & Schemas](#7-event-contracts--schemas)
8. [Category Specifications](#8-category-specifications)
9. [World Memory Integration](#9-world-memory-integration)
10. [Cadence & Scheduling](#10-cadence--scheduling)
11. [Performance & Fidelity Tiers](#11-performance--fidelity-tiers)
12. [Determinism & Replay](#12-determinism--replay)
13. [Synthetic & Historical Events](#13-synthetic--historical-events)
14. [Player Experience Surface](#14-player-experience-surface)
15. [Debugging & Developer Tooling](#15-debugging--developer-tooling)
16. [Governance & Evolution](#16-governance--evolution)

---

# 1. Executive Summary

Fenix Life is **event-driven at every layer**. Citizens marry because relationship systems cross thresholds—not because a designer placed a wedding card. Markets crash because credit, liquidity, and sentiment align—not because year twelve always triggers a recession. The Event System is the **nervous system** that carries those moments from computation to consequence to memory.

The FES distinguishes three layers that engineers and designers must never conflate:

| Layer | Name | Role |
|---|---|---|
| **L0** | Domain Events | Authoritative facts emitted by engines after state mutation (`company.bankrupt`, `citizen.died`) |
| **L1** | Hazard Events | Systemic shocks sampled by Event Engine from conditioned distributions (`event.disaster_triggered`) |
| **L2** | Emergent Composites | Detected patterns across event streams (`emergent.housing_crisis_forming`)—never direct mutation |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FENIX EVENT SYSTEM (FES)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │   Triggers   │───►│  Event Engine │───►│   Hazard     │                  │
│   │ (macro, RNG, │    │  + Domain     │    │   Payloads   │                  │
│   │  thresholds) │    │  Aggregates   │    └──────┬───────┘                  │
│   └──────────────┘    └──────┬───────┘           │                          │
│                              │                   ▼                          │
│                              ▼           ┌──────────────┐                   │
│                     ┌──────────────┐     │ Downstream   │                   │
│                     │ Domain Event │────►│ Engines      │                   │
│                     │     Bus      │     │ (Banking,    │                   │
│                     └──────┬───────┘     │  Housing,    │                   │
│                            │             │  Media...)   │                   │
│              ┌─────────────┼─────────────┴──────┬───────┘                   │
│              ▼             ▼                      ▼                           │
│       ┌──────────┐  ┌──────────┐         ┌──────────┐                       │
│       │ CQRS     │  │ Outbox   │         │ World    │                       │
│       │Projections│  │ (Network)│         │ Memory   │                       │
│       └──────────┘  └──────────┘         └──────────┘                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Non-negotiable outcomes:**

| Outcome | Mechanism |
|---|---|
| **Believability** | Every event traces to engine state or conditioned hazard—not arbitrary script |
| **Citizen Equality** | Player and AI citizens subscribe to identical trigger and propagation rules |
| **Living World** | Events fire during offline catch-up; no player-presence gate |
| **World Memory** | Consequential events append to immutable log with causal chain |
| **Emergence** | Composites detect patterns; they never bypass engine physics |

---

# 2. Event Philosophy

## 2.1 Events Cause; They Do Not Decorate

An event in Fenix Life is a **recorded fact that something changed** or **a structured signal that downstream systems must react**. Events are not flavor text, not UI triggers alone, and not narrative permission slips.

**Approved pattern:** `banking.loan_defaulted` carries `{ citizenId, loanId, outstandingBalance, creditImpact }`. Banking Engine mutates credit score. Media Engine may publish an article referencing the event ID. History Engine indexes the default in the citizen's financial timeline.

**Rejected pattern:** A designer script fires `showBankruptcyPopup` with no preceding domain event, no ledger mutation, and no World Memory entry.

## 2.2 Emergence Over Script

Constitution Article VI requires stories to emerge from system interaction. The FES implements this through:

1. **Threshold triggers** — When macro + agent state crosses bounds, domain engines emit events
2. **Conditioned hazards** — Event Engine samples disasters and accidents from distributions shaped by real world state
3. **Composite detection** — Analytics/Emergence layer identifies multi-event patterns for Media and History without forcing outcomes

Scripted "story beats" are permitted only as **spice** (Constitution Article VI, FSF §2.4):

| Permitted | Forbidden |
|---|---|
| Tutorial onboarding events with `tutorial: true` metadata | Player-only windfalls unrelated to simulation |
| Worldgen synthetic history with `synthetic: true` debug flag | Fixed-timeline global crises ignoring macro state |
| Seasonal cosmetic festivals with negligible economic impact | Hidden stat boosts gated by narrative flags |
| Achievement unlock notifications | Quest chains that bypass lending or legal rules |

## 2.3 The Symmetry Principle in Events

Article I demands equal rules. Event implications:

- AI citizens are subject to the same hazard tables as players (tier-adjusted fidelity, not tier-adjusted rules)
- Player actions do not receive immunity from propagation (e.g., a player's company bankruptcy triggers the same employee layoff cascade as an AI competitor's)
- Notification priority may favor the player for UX; **simulation outcomes may not**

## 2.4 Living World Event Continuity

Article II requires the world to advance offline. Event scheduling therefore:

- Queues hazard draws for missed daily ticks during catch-up
- Caps catch-up hazard volume per session to prevent death spirals (configurable difficulty)
- Never skips monthly financial events because the player was absent
- Records `simulationTime` on every event—not wall clock—as the authoritative timestamp

## 2.5 Five Capitals Event Mapping

Every event type must declare which capitals it primarily affects:

| Capital | Example Event Types |
|---|---|
| **Financial** | `banking.loan_defaulted`, `economy.recession_entered`, `investment.dividend_paid` |
| **Human** | `education.degree_earned`, `healthcare.diagnosis_made`, `career.skill_certified` |
| **Social** | `family.married`, `citizen.reputation_changed`, `media.scandal_exposed` |
| **Business** | `company.founded`, `company.product_launched`, `company.acquired` |
| **Legacy** | `legacy.hall_inducted`, `history.biography_published`, `family.inheritance_disputed` |

Feature reviews must include a Five Capitals impact row for any new event type.

## 2.6 World Memory as Event Destination

Article V: the world remembers. Consequential events **must** append to World Memory (event log L0). Non-consequential noise (e.g., `citizen.aged` for T3 aggregates) may rollup without individual retention per Database Design Document tiering rules.

---

# 3. Event Taxonomy

## 3.1 Top-Level Classification

```
Event
├── Domain Events (L0) — authoritative state changes
│   ├── Citizen Lifecycle
│   ├── Family & Relationships
│   ├── Career & Education
│   ├── Company & Employment
│   ├── Banking & Finance
│   ├── Economy & Markets
│   ├── Government & Policy
│   ├── Housing & Property
│   ├── Healthcare
│   ├── Transportation
│   └── Legacy & Succession
├── Hazard Events (L1) — Event Engine orchestrated shocks
│   ├── Natural Disasters
│   ├── Accidents & Casualties
│   ├── Epidemics (environmental trigger)
│   ├── Black Swan Macro Shocks
│   └── Serendipity (positive rare draws)
├── Emergent Composites (L2) — pattern detection only
│   ├── Sector Crises
│   ├── Housing Crises
│   ├── Political Realignments
│   ├── Cultural Trends
│   └── Dynasty Inflection Points
├── Synthetic Events (worldgen) — compressed past
│   └── Historical backfill with synthetic metadata
└── Network Events (platform) — Fenix Network contracts
    └── Async; never mutates peer world directly
```

## 3.2 Domain Events (L0)

Domain events are emitted **after** aggregate mutation within an engine. They are the primary input to World Memory, CQRS projections, and cross-engine subscriptions.

**Naming convention:** `{domain}.{past_tense_verb}` or `{domain}.{noun}_{past_tense}`

Examples: `citizen.born`, `company.ipo_completed`, `government.policy_enacted`

## 3.3 Hazard Events (L1)

Hazard events are **proposed shocks** sampled by the Event Engine. They carry intent and parameters; downstream engines **resolve** physical and economic effects.

**Naming convention:** `event.{hazard_type}`

Examples: `event.disaster_triggered`, `event.accident_occurred`, `event.black_swan_initiated`

**Critical distinction:** `event.disaster_triggered` is not yet `housing.property_destroyed`. Weather Engine and Housing Engine consume the hazard and emit domain events.

## 3.4 Emergent Composites (L2)

Composites are **read-only pattern announcements**. They inform Media sentiment, History milestone indexing, and analytics—they never apply modifiers directly.

**Naming convention:** `emergent.{pattern_name}`

Examples: `emergent.banking_stress_elevated`, `emergent.tech_bubble_forming`

## 3.5 Event Severity Tiers

| Tier | Code | Description | World Memory | Player Notify |
|---|---|---|---|---|
| **Trace** | T0 | Aggregate noise, statistical drift | Rollup only | Never |
| **Minor** | T1 | Individual micro-events (T1 NPC) | Sampled retention | Low priority |
| **Significant** | T2 | Player-adjacent, company milestones | Full retention | Normal |
| **Major** | T3 | Life inflection, bankruptcy, disaster | Full + milestone index | High |
| **Epoch** | T4 | Generational, market crash, war (expansion) | Full + encyclopedia | Banner + archive |

## 3.6 Event Scope

| Scope | Description | Example |
|---|---|---|
| **Citizen** | Single agent | `citizen.promoted` |
| **Household** | Family unit | `family.inheritance_disputed` |
| **Organization** | Company, bank, university | `company.bankrupt` |
| **Regional** | City, state, climate zone | `weather.disaster_struck` |
| **National** | Country-wide policy/market | `economy.recession_entered` |
| **Global** | World macro (future expansion) | `economy.global_shock` |

---

# 4. Event Architecture in FSF

## 4.1 Event Engine vs Domain Event Bus

The FSF defines two cooperating mechanisms (FSF §4.16, §6):

| Component | Responsibility |
|---|---|
| **Event Engine** | Samples hazards from conditioned distributions; publishes L1 events |
| **Domain Event Bus** | Synchronous in-process dispatch of L0 events per `WorldInstance` |
| **Emergence Detector** | Subscribes to bus; publishes L2 composites (async, non-blocking) |

```
Tick Orchestrator
       │
       ├──► [Engine Phase N] ──► mutate state ──► publish L0 events
       │
       ├──► [Event Engine Phase] ──► sample hazards ──► publish L1 events
       │                                      │
       │                                      ▼
       │                            [Weather, Housing, Economy consume]
       │
       └──► tick_committed ──► outbox drain (async)
```

## 4.2 Event Bus Semantics

Per TDD §3.1:

- **Synchronous dispatch** within tick boundary for L0 handlers
- Handlers may not publish recursive L0 events in the same handler stack deeper than **3 levels** (configurable guard against cascade loops)
- Failed handlers mark tick as **partial failure**; compensating saga required for financial events
- **Outbox** queues Network and analytics events post-commit

## 4.3 Publisher Registry

Every engine registers its published event types in the **Rule Registry** at world initialization:

```typescript
interface EventPublisherRegistration {
  engineId: string;
  eventTypes: EventTypeDefinition[];
  schemaVersion: number;
}

interface EventTypeDefinition {
  eventType: string;
  severityDefault: SeverityTier;
  scope: EventScope;
  capitals: CapitalType[];
  retentionPolicy: RetentionPolicy;
  subscribers: string[]; // engine IDs
}
```

## 4.4 Subscription Model

Engines subscribe explicitly—no wildcard global listeners in production hot path.

| Subscriber | Typical Subscriptions |
|---|---|
| **Media Engine** | Milestone catalog (§8 cross-ref); all T2+ domain events for player-adjacent entities |
| **History Engine** | T2+ events; all T3+; all `media.article_published` |
| **Banking Engine** | `economy.rate_changed`, `company.earnings_reported`, `citizen.income_changed` |
| **Legacy Engine** | `citizen.died`, `history.biography_published`, `company.acquired` |
| **Notification Projector** | Curated UX-facing subset |

## 4.5 Event Engine Placement in Tick Schedule

Per FSF §5.3–5.7:

| Tick Boundary | Event Engine Activity |
|---|---|
| **Daily** | Micro-risk draws for T0/T1 citizens in active regions; accident sampling |
| **Weekly** | Rumor seed events (Media); relationship incident hazards |
| **Monthly** | Regional disaster rolls; sector stress checks |
| **Quarterly** | Black swan eligibility assessment (macro stress dependent) |
| **Annual** | Rare event table (pandemic eligibility, major earthquake decade roll) |

Event Engine runs **after** macro state updates for the boundary, **before** `tick_committed`.

---

# 5. Trigger Model

## 5.1 Trigger Types

| Trigger Type | Description | Deterministic |
|---|---|---|
| **State Threshold** | Agent or macro variable crosses bound | Yes |
| **Scheduled Calendar** | Elections, tax deadlines, lease renewals | Yes |
| **Poisson Draw** | Hazard sampling with rate λ conditioned on state | Yes (seeded) |
| **Compound Gate** | AND/OR of multiple conditions | Yes |
| **Player Command** | Explicit player action validated by engine | Yes |
| **Network Contract** | Async platform command accepted locally | Yes (contract ID) |
| **Composite Detection** | Pattern match on event stream | Yes (rule version) |

## 5.2 State Threshold Triggers

Most domain events use threshold triggers internal to engines:

```
IF citizen.creditScore < 580
AND citizen.delinquencyDays > 90
AND loan.status == 'active'
THEN emit banking.loan_defaulted
```

Thresholds live in **Rule Registry**—data-driven, moddable, versioned.

## 5.3 Conditioned Poisson Hazards

Event Engine hazard rate:

```
λ_effective = λ_base × regionalModifier × macroStress × preparednessFactor
P(event in interval) = 1 - e^(-λ_effective × Δt)
```

Draw uses **deterministic RNG** stream: `hash(worldSeed, regionId, simulationDay, hazardTableId)`

## 5.4 Compound Gates

Example: `emergent.housing_crisis_forming` requires:

- Housing affordability index < 0.65 for 6 consecutive months
- Foreclosure rate > 2× trailing 5-year average
- Media sentiment on housing < -0.4
- Unemployment rising 3 months consecutive

All inputs are projection-readable; no hidden state.

## 5.5 Player Command Triggers

Player actions validate through command handlers, not raw event injection:

```
PlayerCommand: ProposeMarriage
  → Relationships Engine validates
  → IF accepted: emit family.married
  → ELSE: emit family.proposal_rejected (T1)
```

## 5.6 Trigger Fairness Rules

1. No trigger may check `isPlayerControlled` for **outcome** logic (UX branching allowed)
2. Hazard λ modifiers may not reduce player risk below AI peers in same region/class
3. Tutorial hazards must be labeled `tutorial: true` and excluded from legacy scoring
4. Difficulty settings may adjust λ within published bounds documented to player

## 5.7 Trigger Debugging Metadata

Every emitted event includes trigger provenance in debug builds:

```typescript
interface TriggerProvenance {
  triggerType: TriggerType;
  ruleId: string;
  ruleVersion: number;
  inputSnapshotHash?: string; // dev only
}
```

Production strips `inputSnapshotHash`; retains `ruleId` for audit.

---

# 6. Propagation & Cascades

## 6.1 Propagation Philosophy

Events propagate **downstream through subscriptions**, not through centralized orchestration scripts. Cascades emerge from engine reactions—designers specify engine rules, not cascade graphs.

## 6.2 Cascade Phases Within a Tick

```
Phase 1: Time advancement
Phase 2: Financial settlement (monthly boundary)
Phase 3: Engine domain updates (ordered DAG)
Phase 4: Hazard sampling (Event Engine)
Phase 5: Hazard resolution engines
Phase 6: Media/History subscribers (post-domain)
Phase 7: Commit + outbox
```

**Ordering rule:** Apparent cycles (Economy ↔ Company) resolve via **phase order**, never synchronous re-entrancy.

## 6.3 Example Cascade: Regional Flood

```
1. event.disaster_triggered { type: 'flood', regionId, severity: 0.72 }
2. weather.disaster_struck { ... }           [Weather Engine]
3. housing.property_damaged { ... }          [Housing Engine, N properties]
4. banking.claim_filed { ... }               [Banking, per insured property]
5. company.supply_chain_disrupted { ... }  [Company, regional firms]
6. economy.regional_output_shock { ... }     [Economy Engine]
7. government.emergency_declared { ... }     [Government, if threshold met]
8. media.article_published { ... }         [Media, references 1-7 event IDs]
9. history.milestone_recorded { ... }        [History Engine]
```

Each step emits independent L0 events with `causationId` pointing upstream.

## 6.4 Cascade Depth Limits

| Limit | Value | Rationale |
|---|---|---|
| Max handler stack depth | 3 | Prevent infinite loops |
| Max events per tick (soft) | 10,000 | Performance guard |
| Max events per tick (hard) | 50,000 | Abort with telemetry |
| Catch-up batch ceiling | 500 major events | Offline fairness |

## 6.5 Dampening & Negative Feedback

Systems must include stabilizers—pure positive feedback cascades violate design constitution:

- Government emergency funds reduce unemployment spiral velocity
- Banking workout programs trigger after N defaults in region
- Media fatigue reduces sentiment impact of repeated crisis coverage

## 6.6 Propagation to Player Experience

Not every propagated event surfaces to player:

| Surface | Criteria |
|---|---|
| **Smartphone notification** | T2+ player-adjacent, or T3+ world events affecting portfolio |
| **Newspaper** | Media Engine selection; significance + timeliness |
| **Dashboard alert** | Player entity directly referenced |
| **Silent log** | T1 NPC events, background market drift |

---

# 7. Event Contracts & Schemas

## 7.1 Universal Event Envelope

Per TDD §3.2, all events share:

| Field | Type | Required | Purpose |
|---|---|---|---|
| `eventId` | UUID | Yes | Idempotency key |
| `eventType` | string | Yes | Namespaced type |
| `aggregateId` | string | Yes | Root entity |
| `aggregateType` | string | Yes | Entity class |
| `worldInstanceId` | UUID | Yes | Sovereign instance |
| `simulationTime` | ISO date | Yes | In-game timestamp |
| `realTime` | ISO datetime | Yes | Wall clock audit |
| `schemaVersion` | int | Yes | Migration |
| `payload` | object | Yes | Typed body |
| `severity` | enum | Yes | T0–T4 |
| `scope` | enum | Yes | Citizen–Global |
| `capitals` | CapitalType[] | Yes | Five Capitals |
| `causationId` | UUID | No | Parent event |
| `correlationId` | UUID | No | Saga trace |
| `metadata` | object | No | synthetic, tutorial, mod |

## 7.2 Payload Design Rules

1. Payloads contain **facts**, not instructions ("damageAmount: 45000" not "destroyProperty: true")
2. Reference entities by ID, not embedded snapshots (except audit snapshots at T3+)
3. Include `rulesVersion` when calculation may vary across patches
4. Nullable fields explicit; no sentinel magic numbers
5. Breaking changes increment `schemaVersion`; migrations transform old log entries on read

## 7.3 Idempotency

Handlers must be idempotent on `eventId`. Replay and catch-up may re-deliver events from log tail.

```typescript
async function handleLoanDefaulted(event: DomainEvent): Promise<void> {
  if (await processedEvents.exists(event.eventId)) return;
  // ... apply ...
  await processedEvents.mark(event.eventId);
}
```

## 7.4 Schema Registry

Central `EventSchemaRegistry` loaded at boot:

- JSON Schema definitions per `eventType` + `schemaVersion`
- Validation on publish (dev: throw; prod: log + quarantine)
- OpenAPI-style docs generated for tooling

## 7.5 Version Migration

When schema changes:

1. Register new version alongside old
2. Publishers emit new version from effective simulation date
3. History readers implement `normalize(event) → latest schema`
4. Never mutate stored log entries in place

---

# 8. Category Specifications

## 8.1 Random Events

**Definition:** Outcomes sampled from stochastic tables where probability is **fully conditioned** on observable simulation state.

### 8.1.1 Random Event Subtypes

| Subtype | Engine | Typical Cadence |
|---|---|---|
| Traffic accident | Event Engine | Daily λ for commuters |
| Workplace injury | Event Engine | Weekly employment-weighted |
| Lottery win (small) | Event Engine | Monthly low λ |
| Inheritance from distant relative | Event Engine | Life Poisson |
| Equipment failure | Event Engine | Business asset age weighted |
| Chance meeting (relationship) | Citizen/Family | Weekly social graph |

### 8.1.2 Random Event Rules

- Must declare `random: true` in metadata
- Must log `ruleId` and RNG stream ID for replay
- Expected value of financial random events ≈ 0 over cohort (no hidden player subsidy)
- Premium items never drop from unconditioned tables

### 8.1.3 Example Payload: Serendipity

```json
{
  "eventType": "event.serendipity_triggered",
  "payload": {
    "serendipityType": "distant_inheritance",
    "citizenId": "cit_8a2f...",
    "grossAmount": 12500,
    "currency": "USD",
    "sourceEntityId": "estate_agg_44",
    "taxable": true,
    "ruleId": "serendipity.inheritance_distant.v2"
  }
}
```

## 8.2 Historical Events

**Definition:** Events representing the past—either **synthetic** (worldgen) or **player-epoch** (simulation time before current session).

See §13 for synthetic pipeline. Historical events in live simulation use the same L0 envelope with `simulationTime` in the past during catch-up or worldgen replay.

### 8.2.1 Historical Event Sources

| Source | Metadata | Player Visible |
|---|---|---|
| Worldgen synthetic | `synthetic: true` | Yes (as past news) |
| Pre-patch migration | `migrated: true` | Archive only |
| Generational predecessor | normal | Family tree, biography |

## 8.3 Emergent Events

**Definition:** Patterns recognized when multiple domain events satisfy composite rules—**L2 only**.

### 8.3.1 Emergent Pattern Catalog (Representative)

| Pattern | Inputs | Outputs |
|---|---|---|
| `emergent.banking_stress_elevated` | NPL ratio, credit spread, default cluster | Media tone, History milestone |
| `emergent.housing_crisis_forming` | Affordability, foreclosures, sentiment | Government pressure events |
| `emergent.tech_sector_euphoria` | Valuations, IPO rate, hiring | Event Engine bubble hazard ↑ |
| `emergent.dynasty_inflection` | Multi-gen wealth, scandals, philanthropy | Legacy Engine attention |

Emergent events **never** directly modify credit formulas or prices—they may adjust hazard λ only through registered Rule Registry indirection.

## 8.4 Natural Disasters

**Owner:** Event Engine initiates; Weather + Housing + Economy resolve.

### 8.4.1 Disaster Types

| Type | Regional Preconditions | Primary Effects |
|---|---|---|
| **Flood** | River/coastal, saturation index | Housing damage, insurance claims |
| **Hurricane/Typhoon** | Coastal, season window | Wide property damage, business closure |
| **Earthquake** | Seismic zone | Infrastructure, housing, casualty |
| **Drought** | Agricultural region | Crop yield, food prices |
| **Wildfire** | Dry biome, urban-wild interface | Property loss, health |
| **Blizzard** | Northern winter | Transport, business interruption |
| **Heat wave** | Urban density | Health, energy costs |
| **Pandemic** | Global connectivity (expansion) | Labor supply, healthcare load |

### 8.4.2 Disaster Severity Model

```
severity ∈ [0, 1]
affectedRadius = f(severity, regionDensity)
damageDraw(property) ~ LogNormal(μ(severity), σ)
casualtyDraw ~ Binomial(population, p(severity)) // T1 only; T3 statistical
```

### 8.4.3 Disaster Preparedness Modifiers

Government infrastructure spending and citizen insurance penetration reduce effective severity—not eliminate disasters.

## 8.5 Political Events

**Owner:** Government Engine (domain); Event Engine (external shocks).

### 8.5.1 Political Event Types

| Event | Trigger | Downstream |
|---|---|---|
| `government.election_completed` | Calendar | Policy regime change |
| `government.policy_enacted` | Legislative process | Tax, Economy, Company compliance |
| `government.scandal_exposed` | Media + investigation lag | Approval rating, career |
| `government.protest_major` | Composite: inequality + sentiment | Policy pressure |
| `government.emergency_declared` | Disaster or crisis composite | Spending, rights modifiers |
| `government.leader_assassinated` | Rare hazard (expansion) | Succession crisis |

Political events respect Citizen Equality—a player politician uses the same approval and scandal rules as AI officeholders.

## 8.6 Business Events

**Owner:** Company Engine, Economy Engine, Banking Engine.

### 8.6.1 Business Event Types

| Event | Severity | World Memory |
|---|---|---|
| `company.founded` | T2 | Yes |
| `company.product_launched` | T2 | Yes |
| `company.ipo_completed` | T3 | Yes + milestone |
| `company.earnings_beat` / `_miss` | T2 | Sampled |
| `company.acquired` | T3 | Yes + milestone |
| `company.bankrupt` | T3 | Yes + milestone |
| `company.layoff_wave` | T2 | Yes |
| `company.fraud_discovered` | T3 | Yes |
| `company.patent_granted` | T2 | Yes |

### 8.6.2 Business Event Propagation

IPO triggers: Stock Market listing, Media coverage, Investment unlock, History corporate timeline entry.

Bankruptcy triggers: Employee termination cascade, Banking loss recognition, Supplier default risk, Media post-mortem, Legacy score impact.

## 8.7 Personal Events

**Owner:** Citizen, Family, Career, Healthcare engines.

### 8.7.1 Personal Life Event Types

| Category | Events |
|---|---|
| **Birth & Death** | `citizen.born`, `citizen.died`, `family.child_born` |
| **Relationships** | `family.married`, `family.divorced`, `family.engaged`, `citizen.relationship_formed` |
| **Career** | `career.promoted`, `career.fired`, `career.retired`, `career.job_changed` |
| **Education** | `education.enrolled`, `education.graduated`, `education.dropped_out` |
| **Health** | `healthcare.diagnosis_made`, `healthcare.surgery_completed`, `healthcare.addiction_relapse` |
| **Legal** | `legal.arrested`, `legal.convicted`, `legal.lawsuit_filed` |
| **Personal Milestone** | `citizen.moved_city`, `citizen.bought_first_home` |

Personal events for player citizen always notify at T2+; AI personal events simulated at tier fidelity without per-event UI.

---

# 9. World Memory Integration

## 9.1 Append-Only Event Log

World Memory L0 is the **authoritative chronological record** per Database Design Document. Every T2+ domain event appends at commit.

```
WorldMemoryLog
├── partition by simulationYear
├── indexed by aggregateId, eventType, severity
└── cold archive after rollup (yearly)
```

## 9.2 Retention Policies

| Severity | Hot Storage | Warm Archive | Cold Rollup |
|---|---|---|---|
| T0 | 7 days | Merge to stats | Discard detail |
| T1 | 90 days | Sample 10% | Aggregate counts |
| T2 | Full life | Full life | Narrative summary at death |
| T3 | Permanent | Permanent | Milestone index |
| T4 | Permanent | Permanent | Encyclopedia required |

## 9.3 Causal Chain Integrity

`causationId` and `correlationId` enable:

- Biography "why" explanations
- Anti-cheat audit ("how did wealth spike?")
- Developer replay debugging
- History Engine timeline rendering

## 9.4 Event Log → Projections

CQRS projections consume events idempotently:

| Projection | Consumer |
|---|---|
| `CitizenTimelineProjection` | UI life timeline |
| `CompanyHistoryProjection` | Corporate encyclopedia |
| `CreditReportProjection` | Banking UI |
| `NewsArchiveProjection` | Media browser |
| `MilestoneIndexProjection` | History Engine |

## 9.5 Event Log → Media → History Pipeline

```
L0 domain event
    │
    ├──► Media Engine (article candidate)
    │         │
    │         └──► media.article_published (L0)
    │                    │
    └──► History Engine ◄─┘
              │
              └──► history.milestone_recorded
                   history.encyclopedia_entry_created
```

## 9.6 Query APIs

| API | Purpose |
|---|---|
| `getEventsByAggregate(id, from, to)` | Entity timeline |
| `getEventsByType(type, window)` | Analytics |
| `getCausalChain(eventId)` | Debug/narrative |
| `searchEvents(fullText)` | History browser |

---

# 10. Cadence & Scheduling

## 10.1 Simulation Calendar Events

Fixed calendar triggers independent of hazard:

| Event | Frequency |
|---|---|
| Tax filing deadlines | Annual |
| Loan payment due | Monthly |
| Rent due | Monthly |
| Board meetings | Quarterly |
| Elections | Configurable cycle |
| Insurance renewal | Annual |
| Visa/status review | Annual (expansion) |

## 10.2 Event Engine Schedule Matrix

| Boundary | Hazard Families |
|---|---|
| Daily | Commute accidents, petty crime, equipment micro-failure |
| Weekly | Social incidents, minor workplace events |
| Monthly | Property crime wave, regional disaster roll, health incident |
| Quarterly | Sector shock eligibility, fraud discovery rolls |
| Annual | Major disaster decade table, pandemic eligibility, rare serendipity cohort |

## 10.3 Offline Catch-Up Event Processing

When player returns after absence:

1. Time Engine advances N days/months in batches
2. Each batch runs full tick pipeline including Event Engine
3. Major events (T3+) collected for **catch-up summary UI**
4. Minor events applied silently; projections updated
5. Event log append order preserved by simulation time

## 10.4 Event Notification Batching

Media notifications batch at daily boundary unless `breaking: true` flag on event metadata (T3+ disasters, player company bankruptcy).

---

# 11. Performance & Fidelity Tiers

## 11.1 Agent Tiers (TDD Cross-Ref)

| Tier | Population | Event Fidelity |
|---|---|---|
| **T0** | Player + heir | Every event individual |
| **T1** | Named NPCs (~500) | Individual L0 events |
| **T2** | Statistical pool (~50K) | Sampled representatives |
| **T3** | Aggregate millions | Region/sector events only |

## 11.2 Event Engine Performance Rules

1. Never roll Poisson per T3 citizen—region aggregates only
2. Batch property damage in disasters: O(affected) not O(all properties)
3. Media/Histor subscribers async post-commit for non-player entities
4. Index writes batched at tick commit

## 11.3 Budget Targets

| Operation | Budget |
|---|---|
| Daily event dispatch | < 2ms amortized |
| Monthly hazard rolls | < 15ms |
| Disaster cascade (major city) | < 100ms |
| Catch-up month offline | < 200ms |

## 11.4 Event Sampling for T2

T2 citizens use **representative sampling**: 1:100 events fully simulated; remainder applied as statistical adjustment to pool aggregates with matching expected value.

---

# 12. Determinism & Replay

## 12.1 Determinism Requirements

Given `(worldSeed, rulesVersion, commandLog)` → event sequence must be identical.

## 12.2 RNG Stream Allocation

| Stream ID | Purpose |
|---|---|
| `hazard.regional` | Disaster rolls |
| `hazard.personal` | Personal accidents |
| `serendipity` | Positive random |
| `synthetic.worldgen` | Pre-play history |

## 12.3 Replay Mode (Dev/QA)

- Rebuild world from seed + command log
- Diff event log hash against golden master
- Step-through cascade debugger

## 12.4 Anti-Tamper

Client saves HMAC-signed. Event log tail included in checksum. Anomalous event injection detected on cloud sync validation.

---

# 13. Synthetic & Historical Events

## 13.1 Worldgen Synthetic Events

Per World Generation System §8:

- 20–50 years compressed history generates 500–5000 synthetic events
- Metadata: `{ synthetic: true, worldgenPhase: string }`
- Indistinguishable to player in presentation
- Must pass **plausibility validator** (no impossible timelines)

## 13.2 Synthetic → Live Handoff

At `world.initialized`:

1. Synthetic events appended to log as historical partition
2. Projections hydrate from synthetic tail
3. Media archive pre-populated
4. History encyclopedia seeded

## 13.3 Historical Event Backfill on Migration

Schema migrations may synthesize missing events for new projection fields—must use `migrated: true` and never overwrite existing facts.

---

# 14. Player Experience Surface

## 14.1 Diegetic Event Presentation

Events surface through in-world channels (see News Engine doc 23):

- Smartphone push (in-game)
- Newspaper headlines
- TV breaking news (major)
- Email from institutions
- Dashboard alerts (financial)

**Never** raw event type strings in player UI.

## 14.2 Catch-Up Summary

After long absence, player receives **Life While Away** digest:

- Top 10 T3+ events affecting player entities
- Portfolio delta summary
- Relationship changes
- Optional full archive link

## 14.3 Event-Driven Achievements

Achievements subscribe to events—never parallel hidden state:

```
ON company.ipo_completed WHERE citizenId == player
  → unlock achievement "Public Offering"
```

---

# 15. Debugging & Developer Tooling

## 15.1 Event Inspector

Dev overlay shows:

- Last 100 events with causal tree
- Pending hazard rolls (λ values)
- Suppressed events (tier sampling)

## 15.2 Event Injector (Dev Only)

`dev.injectEvent` bypasses triggers for QA—disabled in production builds, excluded from leaderboards.

## 15.3 Cascade Visualizer

Graph view of causation chain from selected eventId.

## 15.4 Balance Telemetry

Aggregate histograms:

- Events per category per 1000 citizen-years
- Default rates vs design targets
- Hazard λ calibration drift

---

# 16. Governance & Evolution

## 16.1 Adding a New Event Type Checklist

- [ ] Maps to Five Capitals
- [ ] Severity tier assigned
- [ ] Retention policy defined
- [ ] Schema registered with version
- [ ] Publishers and subscribers declared
- [ ] Citizen Equality review passed
- [ ] World Memory append confirmed
- [ ] Media presentation rule (if public)
- [ ] Performance tier behavior documented
- [ ] Mod compatibility assessed

## 16.2 Deprecation Policy

1. Mark event type deprecated in registry
2. Stop emission from effective simulation date
3. Readers support old schema indefinitely for archives
4. Never delete log entries

## 16.3 Constitutional Compliance Matrix

| Article | Event System Obligation |
|---|---|
| I Citizen Equality | Symmetric triggers |
| II Living World | Offline scheduling |
| III Five Capitals | Capital tags required |
| V World Memory | L0 append for T2+ |
| VI Emergent Storytelling | No scripted bypass |
| VIII Multiplayer Fairness | Network events async, capped |

## 16.4 Document Cross-References

| Topic | Document |
|---|---|
| History archival | [22_History_Engine.md](./22_History_Engine.md) |
| Media presentation | [23_News_Engine.md](./23_News_Engine.md) |
| Network contracts | [24_Multiplayer_Architecture.md](./24_Multiplayer_Architecture.md) |
| Engine contracts | [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) |
| Event log storage | [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) |

---

**End of Document 21 — Event System (FES)**
