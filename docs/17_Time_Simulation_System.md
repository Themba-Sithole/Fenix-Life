# Fenix Life — Time Simulation System

**Document Version:** 1.0  
**Status:** Canonical — Temporal Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Chief Simulation Architect & Principal Systems Design  
**Audience:** Engineering, AI Systems, Game Design, QA, Live Ops, Platform  

---

## Document Authority

The Time Simulation System defines **how in-game time advances, pauses, accelerates, schedules, and coordinates every engine in Fenix Life**. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Living world, decade-scale play, offline progression |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Living World, World Memory |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | FSF Time Engine, Tick Orchestrator, engine constellation |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Client worker runtime, cloud catch-up, performance SLOs |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Clock persistence, tick checkpoints, event log boundaries |
| [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) | Citizen decision gates, daily vitals cadence |
| [Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | World start date, historical backfill timeline |

When temporal design conflicts with the Living World philosophy, **the world continues**—player pause is an affordance, not the default universe state.

**What this document is:**

- The **operational specification** for the FSF Time Engine and Tick Orchestrator
- The **tick phase contract** that all domain engines must implement
- The **offline simulation playbook** for session gaps and cloud catch-up
- The **performance budget authority** for temporal workloads

**What this document is not:**

- Domain logic for economy, companies, or citizens (see documents 18–20)
- UI time controls implementation (client presentation layer)
- Multiplayer clock synchronization (Fenix Network handles contracts, not authority)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Architectural Overview](#3-architectural-overview)
4. [Game Clock & Calendar](#4-game-clock--calendar)
5. [Time Modes & Player Controls](#5-time-modes--player-controls)
6. [Tick Hierarchy & Phase Model](#6-tick-hierarchy--phase-model)
7. [Tick Orchestrator](#7-tick-orchestrator)
8. [Daily Simulation Cycle](#8-daily-simulation-cycle)
9. [Weekly Simulation Cycle](#9-weekly-simulation-cycle)
10. [Monthly Simulation Cycle](#10-monthly-simulation-cycle)
11. [Quarterly Simulation Cycle](#11-quarterly-simulation-cycle)
12. [Annual Simulation Cycle](#12-annual-simulation-cycle)
13. [Generational & Event-Triggered Ticks](#13-generational--event-triggered-ticks)
14. [Offline Simulation & Catch-Up](#14-offline-simulation--catch-up)
15. [Decision Gates & Blocking Time](#15-decision-gates--blocking-time)
16. [Scheduling & Priority Queues](#16-scheduling--priority-queues)
17. [Performance Budgets & Profiling](#17-performance-budgets--profiling)
18. [Determinism & Replay](#18-determinism--replay)
19. [Persistence & Checkpoints](#19-persistence--checkpoints)
20. [Integration Contracts](#20-integration-contracts)
21. [Developer Tooling](#21-developer-tooling)
22. [Governance & Evolution](#22-governance--evolution)

---

# 1. Executive Summary

Time is the **spine** of Fenix Life. Every marriage, bankruptcy, graduation, election, and product launch is anchored to a simulation calendar that advances whether the player watches or not. The Time Simulation System implements FSF §4.1 (Time Engine) and the Tick Orchestrator layer that sequences twenty-plus domain engines across nested tick boundaries.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TIME SIMULATION SYSTEM — CONTROL PLANE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐      ┌───────────────────┐      ┌─────────────────────┐  │
│   │  Game Clock  │─────►│  Tick Orchestrator │─────►│  Engine Scheduler   │  │
│   │  (calendar)  │      │  (phase dispatch)  │      │  P0 → P1 → P2 → P3  │  │
│   └──────┬───────┘      └─────────┬─────────┘      └──────────┬──────────┘  │
│          │                        │                              │            │
│          │    ┌───────────────────┼───────────────────┐          │            │
│          │    ▼                   ▼                   ▼          ▼            │
│          │  Daily              Weekly              Monthly    Annual          │
│          │    │                   │                   │          │            │
│          │    └───────────────────┴───────────────────┴──────────┘            │
│          │                              │                                     │
│          ▼                              ▼                                     │
│   ┌──────────────┐            ┌─────────────────┐                            │
│   │ Offline Δt   │            │  Tick Commit    │                            │
│   │ Calculator   │            │  + World Memory │                            │
│   └──────────────┘            └─────────────────┘                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core guarantees:**

| Guarantee | Mechanism |
|---|---|
| **Living World** | Offline Δt computed on session resume; catch-up runs before interactive play |
| **Citizen Equality** | Player and AI citizens processed in same tick phases; no "player-only days" |
| **World Memory** | Every committed tick appends phase metadata to event log tail |
| **Determinism** | Seeded RNG per tick phase; versioned ruleset; reproducible replay |
| **Performance** | Tiered fidelity; priority queues; phase budgets enforced at orchestrator |

The Time Engine owns **when** things happen. Domain engines own **what** happens. The Tick Orchestrator owns **order** and **atomicity**.

---

# 2. Philosophy & Constitutional Alignment

## 2.1 The World Does Not Wait

Constitution Article II requires continuous evolution. The Time Simulation System encodes this as:

| Principle | Implementation |
|---|---|
| **Default is running** | New worlds start in `RUNNING` mode at 1× speed |
| **Pause is explicit** | Player invokes pause; world state frozen at last committed tick |
| **Offline ≠ paused** | Session end persists clock; cloud or next session advances Δt |
| **No frozen NPCs** | AI citizens do not enter suspended animation when player is inactive |

**Rejected pattern:** Auto-pause all AI when player opens a menu (except explicit player pause mode).

**Approved pattern:** Player opens financial dashboard while time continues at selected speed; notifications queue for margin calls.

## 2.2 Symmetry Principle

Player citizens receive **no temporal privileges**:

- Same daily vitals tick as T1 AI citizens
- Same monthly payroll cycle
- Same decision gate blocking rules
- Same offline catch-up exposure (competitor IPOs while away)

UI may show countdown timers and calendar projections; it may not skip AI processing.

## 2.3 World Memory & Temporal Fossils

Every committed tick produces auditable temporal facts:

- `time.advanced` events with `deltaDays`, `phase`, `rulesetVersion`
- Engine outputs timestamped to simulation date
- History Engine rollups keyed to calendar boundaries

A newspaper article dated "March 14, 2042" must trace to events committed on that simulation day—not fabricated at read time.

## 2.4 Five Capitals Temporal Lens

Time transforms capitals; the clock does not favor any:

| Capital | Temporal Pressure |
|---|---|
| **Financial** | Compound interest, loan amortization, market cycles |
| **Human** | Aging, skill decay, health progression |
| **Social** | Relationship drift, reputation half-life |
| **Business** | Product cycles, quarterly earnings, corporate aging |
| **Legacy** | Generational ticks, succession, dynasty decay |

## 2.5 Design Review Questions

Before any temporal feature ships:

1. Which tick phase owns this update?
2. Can it double-apply across daily→weekly rollups?
3. Does offline catch-up need a compressed formula?
4. Is there a decision gate that must block time?
5. What is the P0–P3 priority class?

---

# 3. Architectural Overview

## 3.1 Component Map

```
┌────────────────────────────────────────────────────────────────────────┐
│ WorldInstance (sovereign boundary)                                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ L2 — Simulation Kernel                                           │   │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐  │   │
│  │  │ Time Engine │  │ Tick Orchestrator │  │ Decision Gate    │  │   │
│  │  │             │  │                   │  │ Registry         │  │   │
│  │  └─────────────┘  └──────────────────┘  └──────────────────┘  │   │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐  │   │
│  │  │ Phase Table │  │ Priority Scheduler│  │ Perf Telemetry   │  │   │
│  │  └─────────────┘  └──────────────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ L1 — Domain Engines (subscribe to tick phases)                   │   │
│  │  Citizen · Economy · Company · Banking · Career · Family · ... │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ L0 — World Memory + Event Bus + Rule Registry                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Ownership Boundaries

| Component | Owns | Does Not Own |
|---|---|---|
| **Time Engine** | `SimulationClock`, calendar math, speed modes, phase emission | Payroll, aging formulas, market prices |
| **Tick Orchestrator** | Phase order, commit/rollback, gate enforcement, perf budgets | Domain state mutations |
| **Domain Engines** | Aggregate updates for their domain | Clock advancement |
| **Client UI** | Speed controls, pause button, calendar display | Authoritative time (reads projection) |

## 3.3 Runtime Placement

| Deployment | Time Runtime Location |
|---|---|
| **Client-active play** | Web Worker / WASM simulation runtime (TDD §4) |
| **Cloud catch-up** | BullMQ `simulation:catchup` worker (NestJS) |
| **Dev tools** | In-process with time-travel bounds |

**Single authority rule:** One runtime advances a `WorldInstance` at any moment. Cloud catch-up acquires exclusive lock before processing.

## 3.4 Core TypeScript Interfaces

```typescript
/** Authoritative simulation clock state — owned exclusively by Time Engine */
interface SimulationClock {
  worldInstanceId: string;
  /** ISO 8601 date in simulation calendar (no timezone — calendar-local) */
  currentDate: string;
  /** 0–23 simulation hour; sub-daily granularity for routines */
  currentHour: number;
  /** Cumulative simulation days since world epoch */
  dayIndex: number;
  /** Active speed mode */
  speedMode: TimeSpeedMode;
  /** Whether player explicitly paused */
  isPaused: boolean;
  /** Last real-world timestamp when clock was persisted */
  lastPersistedAt: string;
  /** Ruleset version active for temporal calculations */
  rulesetVersion: string;
  /** RNG stream offset for determinism checkpoint */
  rngCheckpoint: bigint;
}

type TimeSpeedMode =
  | 'PAUSED'
  | 'REAL_TIME'      // 1 game day ≈ configurable real minutes (default: 24 min)
  | 'FAST'           // 2×
  | 'VERY_FAST'      // 5×
  | 'ULTRA'          // 10× (unlocked mid-game)
  | 'CATCH_UP';      // batch mode — no interactive delay

type TickPhase =
  | 'micro'      // sub-daily (optional, T0 routines)
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'generational';

interface TickPhaseContext {
  phase: TickPhase;
  startDate: string;
  endDate: string;
  dayIndex: number;
  isCatchUp: boolean;
  catchUpRemainingDays?: number;
  priority: 0 | 1 | 2 | 3;
  rulesetVersion: string;
  rngSeed: number;
}

interface TickCommitResult {
  phase: TickPhase;
  committedAt: string;
  durationMs: number;
  enginesExecuted: string[];
  eventsAppended: number;
  budgetViolations: BudgetViolation[];
  nextPhase: TickPhase | null;
}

interface BudgetViolation {
  engineId: string;
  budgetMs: number;
  actualMs: number;
  severity: 'warn' | 'error';
}
```

---

# 4. Game Clock & Calendar

## 4.1 Calendar Model

Fenix Life uses a **Gregorian simulation calendar** with configurable world start date (default: January 1, 2000). Leap years follow standard rules. Fiscal year may differ per jurisdiction (Government Engine)—the Time Engine tracks **calendar date**; Tax Engine maps to fiscal periods.

| Field | Specification |
|---|---|
| **Epoch** | World-configured `startDate` |
| **Resolution** | Day primary; hour for routines (T0/T1); no sub-hour combat ticks |
| **Maximum span** | 150 in-game years per world instance (soft cap with archival) |
| **Date format** | `YYYY-MM-DD` simulation-local |

## 4.2 Day Index

Internal `dayIndex` is monotonic (0 at epoch). All RNG seeds and scheduled jobs key off `dayIndex` for determinism:

```
rngSeed(phase, engineId) = hash(worldSeed, dayIndex, phaseOrdinal, engineId)
```

## 4.3 Hour Model (Routines)

Hours 0–23 enable **daily routines** without full real-time simulation:

| Hour Block | Typical Activity (T0/T1) |
|---|---|
| 00–05 | Sleep recovery, energy restoration |
| 06–08 | Morning routine, commute prep |
| 09–17 | Work/school block |
| 18–20 | Family, social, errands |
| 21–23 | Leisure, side projects, rest |

T2/T3 citizens skip hourly resolution—daily rollup applies statistical activity allocation.

## 4.4 Calendar Boundaries

| Boundary | Detection Rule |
|---|---|
| **Week end** | `dayIndex % 7 === 6` (configurable week start) |
| **Month end** | Calendar last day of month |
| **Quarter end** | Mar 31, Jun 30, Sep 30, Dec 31 |
| **Year end** | Dec 31 |

Boundary detection runs at **daily tick commit**—cascading phases fire in same orchestration cycle (daily → weekly → monthly if all boundaries align).

## 4.5 Time Advancement Formula

For interactive play with speed mode:

```
gameDaysPerRealSecond = baseDaysPerSecond × speedMultiplier
```

Default `baseDaysPerSecond` at REAL_TIME: `1 / (24 × 60)` — one game day per 24 real minutes.

For catch-up batch:

```
daysToAdvance = min(offlineGameDays, catchUpCap, playerPolicyLimit)
```

Process in chunks of `catchUpChunkSize` (default: 30 days) with monthly phase at chunk boundaries.

---

# 5. Time Modes & Player Controls

## 5.1 Speed Modes

| Mode | Multiplier | Unlock | Notes |
|---|---|---|---|
| **PAUSED** | 0 | Always | Explicit player action; gates may still display |
| **REAL_TIME** | 1× | Always | Default; one day ≈ 24 minutes |
| **FAST** | 2× | Always | Early game convenience |
| **VERY_FAST** | 5× | Age 18+ or Year 3 | Skips non-blocking micro animations |
| **ULTRA** | 10× | Business owner or Age 25+ | P0 gates still block |
| **CATCH_UP** | N/A | System | Batch processing; no frame budget |

## 5.2 Speed Mode Side Effects

Higher speeds **do not** alter simulation outcomes—only wall-clock compression:

- Same formulas at FAST and REAL_TIME
- Decision gates still block at all speeds
- Notifications may batch at VERY_FAST+ (UI only)

## 5.3 Pause Semantics

When `isPaused === true`:

1. Time Engine stops emitting advance ticks
2. Last committed `currentDate` remains authoritative
3. Domain engines do not receive new phase signals
4. Pending player decisions remain valid
5. Cloud catch-up **does not run** if player policy is "pause while away" (opt-in; not default)

**Constitutional default:** Offline progression continues (Living World). Pause applies only during active session when player chooses.

## 5.4 Player Time Policies

Configurable per save in `WorldInstanceSettings`:

| Policy | Default | Description |
|---|---|---|
| `offlineProgressionEnabled` | `true` | World advances while logged out |
| `offlineProgressionCapDays` | `365` | Max game days per absence |
| `catchUpGranularity` | `monthly` | `daily` for recent 7d, else monthly |
| `pauseWhileAway` | `false` | If true, clock stops at logout (anti-constitutional; tutorial only) |
| `notifyOnCatchUpComplete` | `true` | Push/email for cloud catch-up |

## 5.5 Time Control Events

| Event | Publisher | Payload |
|---|---|---|
| `time.paused` | Time Engine | `{ atDate, reason }` |
| `time.resumed` | Time Engine | `{ atDate, speedMode }` |
| `time.speed_changed` | Time Engine | `{ from, to, atDate }` |
| `time.advanced` | Time Engine | `{ fromDate, toDate, deltaDays, mode }` |

---

# 6. Tick Hierarchy & Phase Model

## 6.1 Phase Nesting

Ticks nest from fine to coarse. A single orchestration cycle may execute multiple phases:

```
Daily (always, per game day advanced)
  └─► Weekly (if week boundary)
        └─► Monthly (if month boundary)
              └─► Quarterly (if quarter boundary)
                    └─► Annual (if year boundary)
```

**Generational** ticks are event-triggered, not calendar-nested.

## 6.2 Phase Responsibilities Matrix

| Phase | Primary Purpose | Default Engines |
|---|---|---|
| **Micro** | T0 hourly routines (optional) | Citizen, Transportation |
| **Daily** | Vitals, transactions, micro-events | Citizen, Banking, Healthcare, Weather, Media queue |
| **Weekly** | Social drift, job market, interviews | Career, Family, Company morale |
| **Monthly** | Payroll, P&L, rent, loan payments | Company, Banking, Economy indices, Tax withholding, Housing |
| **Quarterly** | Earnings, dividends, estimated tax | Company, Investment, Tax, Government review |
| **Annual** | Aging, inflation, elections, graduation | Citizen, Economy, Education, Government, Legacy |
| **Generational** | Succession, inheritance sagas | Family, Banking, Tax, Legacy, History |

## 6.3 Phase Emission Protocol

```typescript
interface ITimeEngine {
  /** Advance clock by N days; may cascade phases */
  advanceDays(days: number, mode: TimeSpeedMode): Promise<TickCommitResult[]>;

  /** Emit single phase without day advance (dev/replay) */
  emitPhase(phase: TickPhase, ctx: TickPhaseContext): Promise<TickCommitResult>;

  /** Calculate offline delta from last session */
  computeOfflineDelta(lastSession: SessionMetadata): OfflineDeltaResult;

  registerGate(gate: DecisionGate): void;
  unregisterGate(gateId: string): void;
}

interface OfflineDeltaResult {
  realSecondsElapsed: number;
  gameDaysElapsed: number;
  cappedDays: number;
  requiresCatchUp: boolean;
  recommendedChunkSize: number;
}
```

## 6.4 Phase Ordering Invariant

**Invariant T1:** Within a phase, engines execute in dependency-resolved topological order (FSF §6).

**Invariant T2:** A child phase (weekly) never commits unless its parent daily ticks for all days in the period have committed.

**Invariant T3:** Monthly financial resolution never runs before daily transactions for that month are recorded.

---

# 7. Tick Orchestrator

## 7.1 Responsibilities

The Tick Orchestrator is the **conductor** between Time Engine and domain engines:

1. Receive `time.tick_phase_started` from Time Engine
2. Resolve engine execution order from **Phase Table**
3. Enforce **decision gates** before P0 work
4. Dispatch engines in **P0 → P1 → P2 → P3** priority bands
5. Collect timing metrics per engine
6. **Commit or rollback** atomically from game-time perspective
7. Emit `orchestrator.tick_committed` or `orchestrator.tick_blocked`

## 7.2 Orchestration State Machine

```
                    ┌─────────────┐
                    │   IDLE      │
                    └──────┬──────┘
                           │ phase_started
                           ▼
                    ┌─────────────┐
              ┌────►│ GATE_CHECK  │──── blocking gates? ──► BLOCKED
              │     └──────┬──────┘
              │            │ clear
              │            ▼
              │     ┌─────────────┐
              │     │  P0_DISPATCH│
              │     └──────┬──────┘
              │            ▼
              │     ┌─────────────┐
              │     │  P1_DISPATCH│
              │     └──────┬──────┘
              │            ▼
              │     ┌─────────────┐
              │     │  P2_DISPATCH│
              │     └──────┬──────┘
              │            ▼
              │     ┌─────────────┐
              │     │  P3_DISPATCH│
              │     └──────┬──────┘
              │            ▼
              │     ┌─────────────┐
              │     │   COMMIT    │──► append events, update clock
              │     └──────┬──────┘
              │            │
              └────────────┘ (next phase or complete)
```

## 7.3 Phase Table (Excerpt — Daily)

| Order | Engine | Priority | Budget (ms) |
|---|---|---|---|
| 1 | Decision Gate Resolution | P0 | 5 |
| 2 | Healthcare (acute) | P0 | 3 |
| 3 | Banking (margin calls) | P0 | 5 |
| 4 | Citizen (T0 vitals) | P1 | 2 |
| 5 | Company (player daily ops) | P1 | 8 |
| 6 | Banking (daily transactions) | P1 | 10 |
| 7 | Career (T0 actions) | P1 | 5 |
| 8 | Citizen (T1 vitals) | P2 | 15 |
| 9 | Family (relationship micro) | P2 | 8 |
| 10 | Weather | P2 | 2 |
| 11 | Transportation | P2 | 3 |
| 12 | Media (notification queue) | P2 | 5 |
| 13 | Event Engine (micro-risk) | P3 | 3 |
| 14 | Analytics (dirty flags) | P3 | 2 |

Full phase tables maintained in `config/tick-phases/v{version}.json` per Rule Registry.

## 7.4 Commit Semantics

On `COMMIT`:

1. All domain mutations for this phase are visible
2. Event bus handlers complete synchronously
3. Outbox entries queued for async (Fenix Network, projections)
4. `WorldMemory` appends phase boundary marker
5. Dirty projection flags set for CQRS rebuild
6. Perf telemetry flushed

On `ROLLBACK` (dev/test only; production uses forward-fix):

1. Restore pre-phase snapshots for affected aggregates
2. Discard uncommitted events
3. Emit `orchestrator.tick_rolled_back`

## 7.5 Orchestrator Interface

```typescript
interface ITickOrchestrator {
  onPhaseStarted(ctx: TickPhaseContext): Promise<TickCommitResult>;

  /** Register engine handler for phase */
  registerHandler(
    engineId: string,
    phases: TickPhase[],
    priority: 0 | 1 | 2 | 3,
    handler: TickHandler,
    budgetMs: number,
  ): void;

  getBlockedGates(): DecisionGate[];
  forceCommitDevOnly(override: string): never; // gated behind dev flag
}

type TickHandler = (
  ctx: TickPhaseContext,
  bus: DomainEventBus,
) => Promise<TickHandlerResult>;

interface TickHandlerResult {
  eventsPublished: DomainEvent[];
  aggregatesMutated: string[];
  deferToPhase?: TickPhase; // schedule follow-up
}
```

---

# 8. Daily Simulation Cycle

## 8.1 Purpose

The **daily tick** is the heartbeat of the living world. One in-game day passes; vitals update; transactions settle; micro-events fire.

## 8.2 Daily Timeline

```
00:00 ─── Phase start: time.tick_phase_started(daily)
00:01 ─── P0: Blocking gates, margin calls, acute health
00:02 ─── P1: Player citizen + company daily ops
00:03 ─── P2: T1 relationships, weather, commutes
00:04 ─── P3: Aggregate noise, analytics
00:05 ─── Commit: orchestrator.tick_committed(daily)
00:06 ─── Cascade check: weekly? monthly? ...
```

## 8.3 Daily Work by Tier

| Tier | Daily Processing |
|---|---|
| **T0** | Full vitals, energy/stress, routine slots, player decisions |
| **T1** | Full vitals, relationship micro-drift, career pipeline |
| **T2** | Batch utility update (statistical stress/employment) |
| **T3** | No per-citizen daily processing; aggregate birth/death noise |

## 8.4 Daily Budget

| Context | Target | Hard Cap |
|---|---|---|
| Client T0+T1 daily | < 5ms | 15ms |
| Cloud catch-up daily (batched) | < 1ms amortized | 3ms |

## 8.5 Daily Event Catalog

| Event | Engine | Typical Trigger |
|---|---|---|
| `citizen.vitals_updated` | Citizen | Daily boundary |
| `banking.transaction_posted` | Banking | Scheduled payments |
| `healthcare.recovery_tick` | Healthcare | Treatment in progress |
| `weather.daily_conditions` | Weather | Regional roll |
| `media.notification_queued` | Media | Scandal ripeness, earnings preview |

---

# 9. Weekly Simulation Cycle

## 9.1 Purpose

Weekly ticks **rollup** social and labor market motion that would be wasteful daily at full fidelity.

## 9.2 Weekly Focus Areas

| Domain | Weekly Actions |
|---|---|
| **Career** | Job applications processed; interview stages advance |
| **Family** | Relationship maintenance within household |
| **Company** | Employee morale drift; internal rumor seeds |
| **Media** | Trend seeds; rumor propagation |
| **Transportation** | Commute time recalculation |
| **Housing** | Listing turnover (if weekly lease terms) |

## 9.3 Rollup Invariant

Weekly changes **must not double-apply** daily micro-drift:

```
weeklyRelationshipDelta = targetDrift - sum(dailyMicroDriftThisWeek)
```

Engines maintain `weekAccumulator` fields cleared on weekly commit.

## 9.3 Weekly Budget

Target: < 25ms client (included in weekly day's total).

---

# 10. Monthly Simulation Cycle

## 10.1 Purpose

The **monthly tick** is the primary **player planning rhythm** (Product Bible §7). Finances resolve; businesses report; markets update.

## 10.2 Monthly Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONTHLY TICK PIPELINE                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Payroll disbursement (Career → Banking)                      │
│  2. Loan payment processing (Banking)                            │
│  3. Rent & mortgage servicing (Housing → Banking)                │
│  4. Company P&L resolution (Company)                             │
│  5. Economy index update (Economy)                               │
│  6. Tax withholding (Tax)                                        │
│  7. Investment marks (Investment)                                  │
│  8. Education semester progress (Education)                      │
│  9. Healthcare chronic progression (Healthcare)                  │
│ 10. Housing price index (Housing)                                 │
│ 11. Autosave trigger (Persistence)                               │
│ 12. CDPS motivation refresh (Citizen)                              │
└─────────────────────────────────────────────────────────────────┘
```

## 10.3 Monthly as Offline Default

Short absences (< 7 real days) typically catch up to **month boundary** with daily skipped:

| Absence Length | Catch-Up Strategy |
|---|---|
| < 6 hours | No catch-up; resume in-session |
| 6h – 24h | Daily ticks for last 3 days + month if boundary crossed |
| 1 – 7 days | Weekly + monthly boundaries only |
| 7 – 30 days | Monthly chunks |
| > 30 days | Monthly chunks + annual if crossed; digest summary |

## 10.4 Monthly Budget

| Context | Target | Hard Cap |
|---|---|---|
| Client mid-game | < 200ms | 500ms |
| Cloud catch-up (per month) | < 50ms | 150ms |

## 10.5 Monthly Autosave

Mandatory autosave fires **after** monthly commit succeeds:

- Snapshot aggregates
- Event log tail since last snapshot
- Clock state + RNG checkpoint
- Upload to cloud if enabled

---

# 11. Quarterly Simulation Cycle

## 11.1 Purpose

Quarterly ticks align with **capital markets rhythm**: earnings season, dividends, estimated taxes, board reviews.

## 11.2 Quarterly Actions

| Engine | Actions |
|---|---|
| **Company** | Earnings reports, guidance, dividend declarations |
| **Investment** | Fund performance reporting, portfolio statements |
| **Tax** | Estimated quarterly payments (US-style jurisdictions) |
| **Government** | Fiscal quarter review, spending adjustments |
| **Media** | Earnings season narratives, analyst coverage |
| **Economy** | Cycle phase check, sector rotation signals |

## 11.3 Player Company Earnings Flow

```
Company P&L finalize
    → company.earnings_reported
        → Media Engine (coverage)
        → Investment Engine (price impact)
        → Career Engine (morale, bonus pools)
        → Tax Engine (corporate estimated)
```

## 11.4 Quarterly Budget

Target: < 80ms incremental on quarter boundary day.

---

# 12. Annual Simulation Cycle

## 12.1 Purpose

Annual ticks drive **structural evolution**: aging, policy, inflation, graduation cohorts, legacy scoring.

## 12.2 Annual Processing Matrix

| Engine | Annual Actions |
|---|---|
| **Citizen** | Age increment, skill decay, retirement eligibility |
| **Economy** | Inflation adjustment, wage index, recession/boom check |
| **Education** | Graduation cohorts, prestige decay |
| **Government** | Elections (if cycle year), policy review |
| **Tax** | Annual filing period opens, bracket adjustments |
| **Healthcare** | Age-risk recalculation |
| **Legacy** | Annual legacy score |
| **History** | Year archive, encyclopedia rollup |
| **Population** | T3 birth/death reconciliation |

## 12.3 Inflation & Index Adjustment

Annual boundary triggers Economy Engine structural adjustment (see Document 18):

```
wageIndex_new = wageIndex_old × (1 + annualInflationTarget + laborMarketAdjustment)
priceIndex_new = priceIndex_old × (1 + realizedInflation)
```

## 12.4 Event Log Compression

Per Database Design Document, annual tick triggers **yearly compression**:

- Events older than 50 in-game years roll to summary records
- Hot index retains 50 years full fidelity
- Projections rebuild from compressed + hot tail

## 12.5 Annual Budget

Target: < 300ms on year boundary (amortized; may spread across 3 frames).

---

# 13. Generational & Event-Triggered Ticks

## 13.1 Generational Tick

Not calendar-driven alone—triggered by **succession events**:

| Trigger | Source |
|---|---|
| Player death with heir | Citizen Engine |
| Voluntary succession | Player command |
| Dynasty dispute | Family Engine saga |

### Generational Phases

1. Death processing
2. Estate opening
3. Inheritance saga (multi-step workflow)
4. Heir promotion to T0
5. Legacy update
6. History biography
7. Player handoff UI bridge

**Time Engine behavior:** May pause interactive advance at saga blocking gates until inheritance resolved or timeout policy applies.

## 13.2 Event-Triggered Micro-Ticks

Some events require **immediate phase dispatch** without day advance:

| Event | Phase |
|---|---|
| Margin call | Banking P0 (intra-day) |
| Acute medical crisis | Healthcare P0 |
| Court summons | Government P0 |
| Partnership vote deadline | Company P0 |

These insert **synthetic P0 dispatch** at current date without incrementing `dayIndex`.

---

# 14. Offline Simulation & Catch-Up

## 14.1 Living World Offline Model

```
Session End                    Session Resume
     │                              │
     ▼                              ▼
┌─────────────┐              ┌─────────────┐
│ Persist     │              │ Load clock  │
│ clock +     │              │ + compute   │
│ checksum    │              │ offline Δt  │
└──────┬──────┘              └──────┬──────┘
       │                            │
       ▼                            ▼
┌─────────────┐              ┌─────────────┐
│ Cloud worker│              │ Catch-up    │
│ (optional)  │──────────────►│ queue job   │
└─────────────┘              └──────┬──────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │ Interactive │
                             │ play        │
                             └─────────────┘
```

## 14.2 Offline Delta Calculation

```typescript
function computeOfflineGameDays(
  lastSession: SessionMetadata,
  now: Date,
  settings: WorldInstanceSettings,
  speedPolicy: OfflineSpeedPolicy,
): number {
  if (!settings.offlineProgressionEnabled) return 0;

  const realElapsedMs = now.getTime() - lastSession.endedAt.getTime();
  const realElapsedDays = realElapsedMs / (1000 * 60 * 60 * 24);

  // Convert real time to game time using policy curve
  const gameDays = realElapsedDays * speedPolicy.gameDaysPerRealDay;

  return Math.min(
    Math.floor(gameDays),
    settings.offlineProgressionCapDays,
  );
}
```

**Default policy:** 1 real day away ≈ 7 game days (configurable per difficulty).

## 14.3 Catch-Up Execution Modes

| Mode | When | Behavior |
|---|---|---|
| **Embedded** | Client resume, Δt < 30 days | In-worker batch before UI |
| **Cloud** | Away > 24h real time | BullMQ `simulation:catchup` |
| **Hybrid** | Cloud completes before login | Client validates checksum |

## 14.4 Catch-Up Chunking

Long catch-up processes in chunks to avoid timeout:

```typescript
interface CatchUpJob {
  worldInstanceId: string;
  fromDate: string;
  toDate: string;
  chunkSizeDays: number;       // default 30
  granularity: 'daily' | 'monthly' | 'mixed';
  priority: 'background' | 'blocking';
}

async function processCatchUpChunk(job: CatchUpJob): Promise<void> {
  let cursor = job.fromDate;
  while (cursor < job.toDate) {
    const chunkEnd = addDays(cursor, job.chunkSizeDays);
    if (shouldUseMonthlyGranularity(cursor, job)) {
      await orchestrator.runMonthlyCatchUp(cursor, chunkEnd);
    } else {
      await orchestrator.runDailyCatchUp(cursor, chunkEnd);
    }
    cursor = chunkEnd;
    await persistCheckpoint(cursor);
  }
}
```

## 14.5 Catch-Up SLO

| Metric | Target |
|---|---|
| 1 in-game year catch-up (cloud) | < 30 seconds |
| 1 in-game month (client embedded) | < 200ms |
| Digest generation | < 2 seconds after catch-up |

## 14.6 "While You Were Away" Digest

After catch-up, query event log for player-relevant facts:

| Category | Query |
|---|---|
| **Player finances** | Banking events on player accounts |
| **Player company** | Company events for owned entities |
| **Relationships** | Family/Career events involving T1 graph |
| **Macro** | Economy recession/boom, rate changes |
| **Competitors** | Media coverage of rival IPOs, bankruptcies |
| **Personal** | Health, legal, inheritance warnings |

Digest is **projection**—authoritative facts already in World Memory.

## 14.7 Compressed Formulas

Monthly catch-up may use compressed formulas for T2/T3 (not T0/T1):

| Domain | Full Fidelity | Compressed |
|---|---|---|
| Citizen vitals | Daily | Monthly statistical |
| Company P&L | Line-item | Sector aggregate + player company full |
| Investment | Daily marks | Monthly marks |
| Career | Weekly matching | Monthly employment flow |

**Invariant:** T0 and player-owned companies always receive full fidelity regardless of catch-up mode.

---

# 15. Decision Gates & Blocking Time

## 15.1 Gate Types

| Gate Type | Blocks | Example |
|---|---|---|
| **Player decision** | All advance | Accept job offer |
| **Financial** | Advance past date | Margin call resolution |
| **Legal** | Advance past date | Court appearance |
| **Corporate** | Advance past date | Board vote, IPO pricing |
| **Health** | Advance past date | Surgery consent |
| **Succession** | Advance until resolved | Heir selection |

## 15.2 Gate Interface

```typescript
interface DecisionGate {
  gateId: string;
  type: GateType;
  createdAt: string;
  expiresAt?: string;
  blockingPhase: TickPhase | 'all';
  priority: 0;
  citizenId?: string;
  companyId?: string;
  payload: Record<string, unknown>;
  autoResolvePolicy?: AutoResolvePolicy;
}

interface AutoResolvePolicy {
  /** AI resolves if player inactive (offline catch-up only) */
  allowAiResolve: boolean;
  resolveStrategy: 'conservative' | 'personality-driven' | 'random-safe';
  timeoutDays?: number;
}
```

## 15.3 Offline Gate Resolution

When catch-up encounters blocking player gate:

1. If `allowAiResolve` and player away: resolve via CDPS utility (same rules as AI citizens)
2. If not resolvable: pause catch-up at gate date; resume on login
3. Critical financial gates (margin call): auto-liquidate per policy if timeout exceeded

**Symmetry:** AI citizens face identical gates resolved by Citizen AI orchestration (Document 20).

## 15.4 Gate Registry

Time Engine maintains active gate set. Orchestrator queries before each phase:

```
if any gate where gate.blockingPhase >= currentPhase:
  emit orchestrator.tick_blocked
  return
```

---

# 16. Scheduling & Priority Queues

## 16.1 Priority Bands

| Priority | Population | Latency Requirement |
|---|---|---|
| **P0** | Player-blocking, systemic risk | Immediate same frame |
| **P1** | T0, player company, active projects | Same tick, < 20ms total |
| **P2** | T1, regional systems | Same tick, best effort |
| **P3** | Aggregates, analytics, T3 | Same tick or deferred to phase end |

## 16.2 Deferred Work Queue

P3 work exceeding budget spills to `deferredQueue`:

- Processed after P2 complete
- If still over budget: mark `projectionStale` and async rebuild
- Never skip P0/P1 for P3

## 16.3 Scheduled Future Events

Engines register future callbacks via **Time Engine scheduler** (not setTimeout):

```typescript
interface ScheduledEvent {
  id: string;
  fireOnDayIndex: number;
  engineId: string;
  eventType: string;
  payload: unknown;
  recurring?: RecurrenceRule;
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  untilDayIndex?: number;
}
```

Fired at daily phase start before P0 dispatch.

## 16.4 Spatial Sharding (Parallelism)

Independent city regions may process P2/P3 in parallel within a phase:

```
Promise.all(regions.map(r => processRegion(r, ctx)))
```

**Constraint:** Cross-region events (national economy) run single-threaded in P1.

---

# 17. Performance Budgets & Profiling

## 17.1 Budget Hierarchy

| Scope | Budget |
|---|---|
| Single daily tick (client) | 5ms |
| Single monthly tick (client) | 200ms |
| Single annual tick (client) | 300ms |
| 1 year catch-up (cloud) | 30s |
| Time Engine overhead per tick | < 0.1ms |

## 17.2 Per-Engine Budgets (Daily Phase)

| Engine | Budget (ms) |
|---|---|
| Citizen (T0+T1) | 2 |
| Company (player) | 8 |
| Banking | 10 |
| Career | 5 |
| Healthcare | 3 |
| Weather | 2 |
| All P3 combined | 5 |

## 17.3 Telemetry Schema

```typescript
interface TickPerfRecord {
  worldInstanceId: string;
  phase: TickPhase;
  dayIndex: number;
  totalMs: number;
  engineBreakdown: Record<string, number>;
  budgetViolations: BudgetViolation[];
  citizenTierCounts: { t0: number; t1: number; t2: number };
  timestamp: string;
}
```

## 17.4 Profiling Tools

| Tool | Purpose |
|---|---|
| **Tick Flamegraph** | Per-engine time visualization |
| **Budget Dashboard** | Live violation alerts (dev) |
| **Replay Profiler** | Deterministic replay with timing |
| **Catch-Up Estimator** | Predict cloud job duration |

## 17.5 Degradation Strategies

When budgets exceeded:

1. **Warn** — log, continue (dev/staging)
2. **Demote** — T1 → T2 for non-adjacent citizens this tick
3. **Defer** — P3 to async projection rebuild
4. **Never** — skip P0/P1 or alter outcomes

---

# 18. Determinism & Replay

## 18.1 Determinism Requirements

Same inputs must produce same outputs:

| Input | Source |
|---|---|
| `worldSeed` | WorldInstance |
| `dayIndex` | Time Engine |
| `rulesetVersion` | Rule Registry |
| `phase` | Orchestrator |
| Player/AI commands | Event log |

## 18.2 RNG Stream Discipline

```typescript
function createPhaseRng(
  worldSeed: bigint,
  dayIndex: number,
  phase: TickPhase,
  engineId: string,
): SeededRng {
  const hash = fnv1a64(
    worldSeed,
    BigInt(dayIndex),
  phaseOrdinal(phase),
    engineId,
  );
  return new SeededRng(hash);
}
```

**Prohibited:** `Math.random()` in simulation hot path.

## 18.3 Replay Mode

Developer replay loads event log from checkpoint:

1. Hydrate snapshot at `replayStartDay`
2. Disable cloud/outbox side effects
3. Re-execute ticks with recorded commands
4. Compare checksum at `replayEndDay`

Used for bug reports, anti-cheat validation, QA regression.

## 18.4 Version Migration

Ruleset changes mid-world:

- `rulesetVersion` stamped on each tick commit
- Migrations apply **prospectively** at next annual boundary unless emergency
- Event log preserves historical version for replay accuracy

---

# 19. Persistence & Checkpoints

## 19.1 Clock Persistence Fields

Stored in `WorldInstance` aggregate (PostgreSQL + save blob):

| Field | Purpose |
|---|---|
| `currentDate` | Authoritative simulation date |
| `dayIndex` | Monotonic counter |
| `speedMode` | Last player speed |
| `isPaused` | Pause state |
| `lastSessionEndedAt` | Real time for offline Δt |
| `rngCheckpoint` | Determinism restore |
| `lastCommittedPhase` | Recovery validation |
| `pendingGates` | Serialized gate registry |

## 19.2 Tick Checkpoints

Catch-up persists checkpoint every `chunkSizeDays`:

```typescript
interface TickCheckpoint {
  worldInstanceId: string;
  date: string;
  dayIndex: number;
  eventLogOffset: bigint;
  aggregateSnapshotHash: string;
  rngCheckpoint: bigint;
  catchUpJobId?: string;
}
```

## 19.3 Crash Recovery

On crash mid-tick:

1. Load last committed checkpoint (not partial tick)
2. Replay event log tail if any uncommitted events logged
3. Resume catch-up from checkpoint date
4. Surface integrity warning if checksum mismatch

**Invariant:** Partial ticks never become authoritative.

---

# 20. Integration Contracts

## 20.1 Engine Registration

All domain engines implement:

```typescript
interface ITickParticipant {
  readonly engineId: string;
  readonly phases: TickPhase[];
  readonly priority: 0 | 1 | 2 | 3;

  onTick(ctx: TickPhaseContext, bus: DomainEventBus): Promise<TickHandlerResult>;
  onGateBlocked?(gate: DecisionGate): void;
}
```

## 20.2 Event Subscriptions (Time Engine)

| Consumes | Action |
|---|---|
| `orchestrator.tick_committed` | Advance boundary cascade check |
| `orchestrator.tick_blocked` | Hold clock; notify client |
| `player.pause` | Set `isPaused` |
| `player.resume` | Clear pause; restore speed |
| `player.set_speed` | Update `speedMode` |

## 20.3 Event Publications (Time Engine)

| Publishes | Subscribers |
|---|---|
| `time.tick_phase_started` | Tick Orchestrator |
| `time.advanced` | All engines (invalidate caches) |
| `time.paused` | Client UI, Analytics |
| `time.speed_changed` | Client UI |

## 20.4 CQRS Projection Invalidation

On tick commit, projection service receives:

```typescript
interface ProjectionInvalidation {
  worldInstanceId: string;
  phase: TickPhase;
  date: string;
  dirtyDomains: string[];
}
```

Client dashboards rebuild from projections—never compute domain logic in UI.

## 20.5 Cross-Document References

| Topic | Document |
|---|---|
| Economy monthly indices | [18_Economy_Engine.md](./18_Economy_Engine.md) |
| Company quarterly earnings | [19_Company_Simulation.md](./19_Company_Simulation.md) |
| Citizen decision gates | [20_Citizen_AI.md](./20_Citizen_AI.md) |
| FSF engine specs | [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) |

---

# 21. Developer Tooling

## 21.1 Time Travel (Dev Only)

Bounded rewind for debugging:

| Control | Limit |
|---|---|
| Rewind days | Max 30 days |
| Forward skip | Max 365 days (with digest) |
| Phase injection | Single phase at current date |

Requires `DEV_TIME_TRAVEL` flag; disabled in production builds.

## 21.2 Tick Inspector

Real-time overlay showing:

- Current date, speed, paused state
- Active gates
- Last phase timing breakdown
- Pending scheduled events
- Catch-up progress bar

## 21.3 Simulation Console Commands

```
/time status
/time pause|resume
/time speed <mode>
/time advance <days>
/time catchup <toDate>
/tick replay <from> <to>
/tick profile <phase>
/gates list|clear <id>
```

## 21.4 Test Harness

Automated tests:

- Boundary cascade (daily on Dec 31 → annual fires)
- Offline Δt cap enforcement
- Gate blocking and release
- Deterministic replay checksum
- Budget violation detection

---

# 22. Governance & Evolution

## 22.1 Change Control

| Change Type | Approval |
|---|---|
| New tick phase | Chief Simulation Architect + TDD review |
| Budget adjustment | Performance lead + QA benchmark |
| Offline policy default | Product + Constitution review |
| Gate type addition | Game design + engineering |

## 22.2 Versioning

Phase tables versioned in Rule Registry:

```
config/tick-phases/v1.0.0.json
config/tick-phases/v1.1.0.json  // adds engine to monthly
```

Worlds pin to version at creation; migration at annual boundary.

## 22.3 Anti-Patterns

| Anti-Pattern | Why Rejected |
|---|---|
| UI-driven clock | Violates single authority |
| Per-engine timers | Race conditions; use orchestrator |
| Skip AI during FAST speed | Violates Symmetry |
| Pause world on menu open | Violates Living World |
| Non-deterministic RNG | Breaks replay and anti-cheat |

## 22.4 Future Extensions

| Extension | Notes |
|---|---|
| Sub-hour combat/events | Requires micro-phase generalization |
| Multi-timezone regions | Calendar-local with UTC bridge |
| Historical scenario mode | Frozen clock with scripted start |
| Collaborative world clock | Fenix Network contract, not shared authority |

---

## Appendix A — Phase Cascade Example

**Date:** December 31, 2042 (Wednesday, week end, month end, quarter end, year end)

```
1. Daily tick commits (day 15706)
2. Weekly tick cascades (week 2243)
3. Monthly tick cascades (December 2042)
4. Quarterly tick cascades (Q4 2042)
5. Annual tick cascades (Year 2042)
6. Event log yearly compression triggers
7. Total budget: 300ms + 200ms + 80ms + 5ms ≈ 585ms (spread across 3 frames)
```

---

## Appendix B — Offline Catch-Up Pseudocode

```typescript
async function resumeWorld(session: Session): Promise<ResumeResult> {
  const clock = await loadClock(session.worldInstanceId);
  const delta = timeEngine.computeOfflineDelta(session.metadata);

  if (delta.requiresCatchUp) {
    if (delta.cappedDays > 90 && session.cloudEnabled) {
      await enqueueCloudCatchUp(session.worldInstanceId, delta);
      await waitForCatchUpOrProgress(session.worldInstanceId);
    } else {
      await embeddedCatchUp(clock, delta.cappedDays);
    }
  }

  const digest = await buildWhileYouWereAwayDigest(session.worldInstanceId);
  return { clock: await loadClock(session.worldInstanceId), digest };
}
```

---

## Appendix C — Glossary

| Term | Definition |
|---|---|
| **Tick** | Single execution of a tick phase at a simulation boundary |
| **Phase** | Category of work (daily, monthly, etc.) |
| **Catch-up** | Batch tick execution for offline elapsed time |
| **Gate** | Condition blocking clock advance until resolved |
| **Commit** | Atomic completion of a tick phase |
| **Δt** | Elapsed time (real or simulation) |
| **T0–T3** | Citizen fidelity tiers |

---

*End of Document 17 — Time Simulation System*
