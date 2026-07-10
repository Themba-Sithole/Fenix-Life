# Fenix Life — Citizen AI

**Document Version:** 1.0  
**Status:** Canonical — Runtime Behavioural Orchestration Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead AI Designer & Principal Simulation Architect  
**Audience:** Engineering, AI Systems, Game Design, Narrative, Economy, QA  

---

## Document Authority

Citizen AI defines **how every citizen in Fenix Life perceives, decides, acts, and adapts at runtime**—the orchestration layer that turns CDPS psychology into simulation behaviour. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Emergence, symmetry, meaningful choice |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Five Capitals, Living World |
| [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) | Traits, values, memories, goals — **static psychology** |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Citizen Engine §4.2, tiers, events |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Module boundaries, performance |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | `CitizenProfile`, memory storage |
| [17_Time_Simulation_System.md](./17_Time_Simulation_System.md) | Tick cadence, decision gates, offline |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Price indices, confidence, cycles |
| [19_Company_Simulation.md](./19_Company_Simulation.md) | Employment, corporate decisions |

**Relationship to CDPS:**

| CDPS (Document) | Citizen AI (This Document) |
|---|---|
| What citizens *are* psychologically | What citizens *do* each tick |
| Trait definitions & evolution rules | Decision scheduling & execution |
| Memory formation | Memory retrieval in decisions |
| Goals & values schema | Goal pursuit orchestration |
| Birth genetics | Runtime utility evaluation |

When behavioural design conflicts with Citizen Equality, **player commands and AI orchestration use identical decision pipelines**—UI reveals more; it does not alter formulas.

**What Citizen AI is:**

- The **runtime decision orchestrator** for all citizens (T0–T3)
- The **action scheduler** connecting psychology to engine commands
- The **offline behaviour resolver** when player is away
- The **symmetry enforcer** — player issues explicit commands; AI uses same validators

**What Citizen AI is not:**

- An LLM roleplay layer in the simulation hot path
- A separate rule set for NPCs
- The trait/memory schema (see CDPS)
- Rendering or dialogue generation (client presentation)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Architectural Overview](#3-architectural-overview)
4. [Orchestration Model](#4-orchestration-model)
5. [Perception Layer](#5-perception-layer)
6. [Goals & Desires](#6-goals--desires)
7. [Habits & Routines](#7-habits--routines)
8. [Memory Retrieval](#8-memory-retrieval)
9. [Emotional State Runtime](#9-emotional-state-runtime)
10. [Decision Engine](#10-decision-engine)
11. [Decision Classes](#11-decision-classes)
12. [Relationships & Social AI](#12-relationships--social-ai)
13. [Career AI](#13-career-ai)
14. [Spending & Consumption AI](#14-spending--consumption-ai)
15. [Investment AI](#15-investment-ai)
16. [Family & Life Course AI](#16-family--life-course-ai)
17. [Health & Lifestyle AI](#17-health--lifestyle-ai)
18. [Entrepreneurship AI](#18-entrepreneurship-ai)
19. [Player Command Bridge](#19-player-command-bridge)
20. [Offline & Catch-Up AI](#20-offline--catch-up-ai)
21. [Tiered Fidelity](#21-tiered-fidelity)
22. [Events & Integration](#22-events--integration)
23. [Performance & Budgets](#23-performance--budgets)
24. [Debugging & Explainability](#24-debugging--explainability)
25. [Governance & Ethics](#25-governance--ethics)

---

# 1. Executive Summary

Citizen AI is the **runtime brain** of Fenix Life. While CDPS defines the psychological substrate, Citizen AI decides—each simulation tick—which actions citizens take to pursue goals, honor habits, respond to emotions, and react to a living world.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CITIZEN AI — RUNTIME STACK                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ Perception  │───►│  Motivation │───►│  Decision   │───►│   Action    │  │
│  │  (context)  │    │  (goals +   │    │  Engine     │    │  Dispatch   │  │
│  │             │    │   desires)  │    │  (utility)  │    │  (commands) │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         ▲                  ▲                  ▲                  │          │
│         │                  │                  │                  ▼          │
│  ┌──────┴──────────────────┴──────────────────┴──────┐    ┌─────────────┐  │
│  │              CDPS Substrate (read-only)            │    │ Domain      │  │
│  │  Traits · Values · Memories · Habits · Goals       │    │ Engines     │  │
│  └────────────────────────────────────────────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Symmetry Principle:** When the player clicks "Accept Job Offer," the same `AcceptJobOffer` command validator runs as when AI citizen `citizen-48291` accepts. The player chooses explicitly; AI chooses via utility maximization + noise. **The pipeline is identical.**

---

# 2. Philosophy & Constitutional Alignment

## 2.1 One Brain, Two Input Modes

| Input Mode | Source | Processing |
|---|---|---|
| **Player explicit** | UI commands | Validate → execute (no utility roll) |
| **AI orchestrated** | Citizen AI scheduler | Generate options → utility → select → execute |
| **Gate resolution** | Offline/blocking | AI utility with `allowAiResolve` policy |

Both modes produce **domain commands** consumed by Career, Banking, Family, etc.

## 2.2 Believable, Not Optimal

Citizen AI implements **bounded rationality** (Product Bible §10):

- Citizens do not omnisciently know global optima
- Information limited to perception layer
- Emotional state distorts weights
- Habits shortcut deliberation
- Noise prevents predictability

## 2.3 Living World Behaviour

AI citizens continue living offline:

- Pay bills or default
- Accept/reject job offers
- Maintain or neglect relationships
- Invest or panic-sell
- Found companies or play it safe

## 2.4 Explainability Test

When AI surprises, investigation reveals:

- Trait lean + active memory + financial pressure + goal conflict
- Not opaque RNG

Debug tools expose utility breakdown (dev only).

## 2.5 Five Capitals Action Lens

| Capital | Citizen AI Domains |
|---|---|
| **Financial** | Spending, saving, investing, debt |
| **Human** | Education, health, skill development |
| **Social** | Relationships, networking, reputation |
| **Business** | Career, entrepreneurship, side gigs |
| **Legacy** | Family planning, succession, philanthropy |

---

# 3. Architectural Overview

## 3.1 Component Placement

```
CitizenModule (NestJS)
├── domain/
│   ├── CitizenAggregate          // CDPS state owner
│   └── CitizenAiState            // runtime scheduler state
├── application/
│   ├── CitizenAiOrchestrator     // main tick entry
│   ├── PerceptionService
│   ├── DecisionEngine
│   ├── ActionDispatcher
│   ├── HabitExecutor
│   ├── OfflineAiResolver
│   └── TierCompressor
├── infrastructure/
│   └── CitizenRepository
└── interfaces/
    ├── ICitizenAiTickParticipant
    └── ICitizenCommandBridge
```

## 3.2 Runtime State (Ephemeral + Persisted)

```typescript
/** Persisted per citizen — lightweight scheduler state */
interface CitizenAiState {
  citizenId: string;
  lastDecisionDate: string;
  pendingDecisions: PendingDecision[];
  activeRoutine: DailyRoutine | null;
  perceptionCache: PerceptionSnapshot | null;
  perceptionCacheDayIndex: number;
  deferredActions: DeferredAction[];
  decisionCooldowns: Record<DecisionClass, number>;
}

interface PendingDecision {
  decisionId: string;
  decisionClass: DecisionClass;
  options: DecisionOption[];
  deadline: string;
  gateId?: string;
  createdAt: string;
}
```

## 3.3 Orchestrator Entry Point

```typescript
interface ICitizenAiOrchestrator {
  /** Called by Citizen Engine on tick phases */
  processCitizen(citizen: Citizen, ctx: TickPhaseContext): Promise<CitizenAiResult>;

  /** Resolve blocking gate for player or offline */
  resolveGate(citizen: Citizen, gate: DecisionGate): Promise<CommandResult>;

  /** Player explicit command — bypass utility, still validate */
  executePlayerCommand(citizen: Citizen, command: CitizenCommand): Promise<CommandResult>;
}

interface CitizenAiResult {
  commandsIssued: CitizenCommand[];
  decisionsDeferred: number;
  habitsExecuted: number;
  utilityEvaluations: number;
  durationMs: number;
}
```

---

# 4. Orchestration Model

## 4.1 Tick Integration

Citizen AI runs within Citizen Engine tick participation:

| Phase | Citizen AI Work |
|---|---|
| **Daily** | Routines, vitals-linked decisions, habit execution |
| **Weekly** | Job search, social maintenance, major purchase evaluation |
| **Monthly** | Budget review, investment rebalance, goal progress |
| **Annual** | Life course (education choice, retirement), goal refresh |

## 4.2 Processing Pipeline

```
1. Load Citizen + CDPS profile + AiState
2. Build perception snapshot (if stale)
3. Update emotional decay (daily)
4. Check pending decisions / gates
5. Execute habits (reduce decision load)
6. Schedule new decisions by priority
7. For each decision slot: generate options → utility → select
8. Dispatch commands to domain engines
9. Persist AiState + CDPS mutations
```

## 4.3 Decision Budget Per Citizen

| Tier | Max Utility Evaluations / Daily |
|---|---|
| T0 | Unlimited (player may issue commands directly) |
| T1 | 8 |
| T2 | 1 (batch) |
| T3 | 0 (statistical only) |

Prevents combinatorial explosion.

## 4.4 Priority Queue

| Priority | Decision Classes |
|---|---|
| **P0** | Survival (pay rent, food), gate responses |
| **P1** | Employment, critical health |
| **P2** | Relationships, education, major purchases |
| **P3** | Discretionary, luxury, exploration |

---

# 5. Perception Layer

## 5.1 Purpose

Citizens do not see the full simulation state—only **perceived context** within information limits.

## 5.2 Perception Snapshot

```typescript
interface PerceptionSnapshot {
  asOfDate: string;
  citizenId: string;

  // Financial perception
  liquidAssets: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  debtPayments: number;
  runwayMonths: number;
  creditScoreBand: 'poor' | 'fair' | 'good' | 'excellent';

  // Economic perception
  localUnemployment: number;
  inflationFeeling: number;       // subjective vs actual
  consumerConfidence: number;

  // Career perception
  employed: boolean;
  employerStability: number;
  promotionProbability: number;
  jobOffersVisible: JobOfferSummary[];

  // Social perception
  closeRelationships: RelationshipSummary[];
  reputationSelf: number;
  recentSocialEvents: string[];

  // Health perception
  healthStatus: number;
  stressLevel: number;
  insuranceCoverage: boolean;

  // Macro awareness (trait-modulated)
  marketSentiment: number;
  sectorOutlook: Record<SectorId, 'bullish' | 'neutral' | 'bearish'>;

  // Information quality
  financialLiteracy: number;      // from skills + education
  informationBias: number;        // optimism/pessimism distortion
}
```

## 5.3 Information Limits

| Citizen Profile | Information Access |
|---|---|
| High financial literacy | Better investment risk understanding |
| Low literacy | Underestimates compound interest, fees |
| Industry insider (career) | Superior sector outlook in domain |
| Media follower | Sentiment overweight |
| Isolated (low sociability) | Stale job market info |

## 5.4 Perception Cache

Rebuilt daily or on major event (`banking.defaulted`, `career.terminated`):

```
if (ctx.dayIndex > aiState.perceptionCacheDayIndex) {
  perception = perceptionService.build(citizen);
}
```

Budget: < 0.3ms per T1 citizen.

---

# 6. Goals & Desires

## 6.1 CDPS Goals (Read)

CDPS defines `ActiveGoal[]` on `CitizenProfile`:

```typescript
interface ActiveGoal {
  goalId: string;
  type: GoalType;
  capital: CapitalType;
  priority: number;           // 1–10
  targetMetric: string;
  targetValue: number;
  currentProgress: number;
  deadline?: string;
  status: 'active' | 'achieved' | 'abandoned' | 'failed';
  createdAt: string;
}

type GoalType =
  | 'wealth_target'
  | 'career_position'
  | 'family_size'
  | 'home_ownership'
  | 'education_degree'
  | 'business_founding'
  | 'early_retirement'
  | 'fame_threshold'
  | 'debt_free'
  | 'philanthropy'
  | 'mastery_skill';
```

## 6.2 Desires (Short-Term)

**Desires** are volatile wants distinct from long-term goals:

```typescript
interface ActiveDesire {
  desireId: string;
  category: DesireCategory;
  intensity: number;          // 0–100
  expiresAt: string;
  source: 'trait' | 'memory' | 'social' | 'media' | 'event';
}

type DesireCategory =
  | 'status_display'      // luxury purchase
  | 'comfort'
  | 'adventure'
  | 'romance'
  | 'revenge'
  | 'security'
  | 'recognition'
  | 'indulgence';
```

### Desire Generation (Weekly)

```
P(desire) = baseRate × traitModifiers + eventTriggers + socialComparison
```

Examples:

- High Ambition + peer IPO → `status_display` desire
- Bankruptcy memory + low runway → `security` desire
- New relationship → `romance` desire

## 6.3 Goal Pursuit Orchestration

Monthly, Citizen AI maps goals to **decision class priorities**:

| Goal Type | Elevated Decision Classes |
|---|---|
| `wealth_target` | Investment, career salary, spending cut |
| `business_founding` | Entrepreneurship, spending (seed savings) |
| `family_size` | Romance, housing, spending |
| `home_ownership` | Spending (down payment), career stability |
| `early_retirement` | Investment, spending discipline |

```typescript
function goalDecisionBoost(goal: ActiveGoal, decisionClass: DecisionClass): number {
  const mapping = GOAL_DECISION_MAP[goal.type];
  if (!mapping.includes(decisionClass)) return 0;
  return goal.priority * (1 - goal.currentProgress / goal.targetValue);
}
```

## 6.4 Goal Lifecycle

| Transition | Condition |
|---|---|
| active → achieved | `currentProgress >= targetValue` |
| active → abandoned | Priority drops below threshold 6 months; trait shift |
| active → failed | Deadline passed without progress |
| new goal born | Life event, age milestone, achievement |

Goal changes publish `citizen.goal_changed` → World Memory.

---

# 7. Habits & Routines

## 7.1 Habits (CDPS Read)

CDPS stores `CitizenHabit[]` — Citizen AI **executes** them:

```typescript
interface CitizenHabit {
  habitId: string;
  category: HabitCategory;
  strength: number;             // 0–100
  cue: HabitCue;
  defaultAction: HabitAction;
  formedAt: string;
  lastExecuted: string;
}

type HabitAction =
  | { type: 'auto_save'; amount: number }
  | { type: 'exercise'; durationMin: number }
  | { type: 'social_call'; targetCitizenId: string }
  | { type: 'study'; skillId: string }
  | { type: 'gamble'; stake: number }
  | { type: 'overwork'; hours: number };
```

## 7.2 Habit Execution (Daily)

```
for habit in citizen.habits where cueMatches(habit.cue, ctx):
  if habit.strength > 50:
    execute(habit.defaultAction)  // skips utility evaluation
  else if habit.strength > 25:
  maybeExecute with probability habit.strength/100
```

**Performance win:** Strong habits bypass expensive utility for routine behaviours.

## 7.3 Habit Breaking

Life shocks break habits:

| Shock | Effect |
|---|---|
| Job loss | Work habits disrupted |
| Health crisis | Exercise habits |
| Relocation | Social habits |
| Bankruptcy | Auto-save habit may strengthen OR break |

## 7.4 Daily Routines (T0/T1)

```typescript
interface DailyRoutine {
  wakeHour: number;
  sleepHour: number;
  workBlock: TimeBlock;
  commuteMode: 'car' | 'transit' | 'remote' | 'walk';
  mealBudget: number;
  leisureSlots: TimeBlock[];
  flexibility: number;          // trait-derived
}
```

Routines schedule **time allocation** affecting energy and stress (Citizen Engine vitals).

## 7.5 Routine Disruption

| Event | Disruption |
|---|---|
| New job | Commute recalc |
| Newborn | Sleep ↓, leisure ↓ |
| Burnout | Work block shrinks |
| Vacation | Leisure ↑ (player command or AI) |

---

# 8. Memory Retrieval

## 8.1 CDPS Memories (Read)

CDPS defines memory schema and formation rules. Citizen AI **retrieves** relevant memories per decision:

```typescript
function retrieveRelevantMemories(
  citizen: Citizen,
  decisionClass: DecisionClass,
  context: PerceptionSnapshot,
): ScoredMemory[] {
  return citizen.memories
    .filter(m => m.currentWeight >= WEIGHT_THRESHOLD)
    .filter(m => memoryTagsMatchDecision(m.tags, decisionClass))
    .map(m => ({
      memory: m,
      relevance: computeRelevance(m, context, decisionClass),
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, MAX_MEMORIES_PER_DECISION);  // default 3
}
```

## 8.2 Memory Utility Contribution

```typescript
function memoryUtility(memory: CitizenMemory, option: DecisionOption): number {
  const tagMatch = option.tags.filter(t => memory.tags.includes(t)).length;
  const valenceEffect = memory.emotionalValence / 100 * tagMatch;
  const weight = memory.currentWeight / 100;
  return valenceEffect * weight * MEMORY_INFLUENCE_SCALE;
}
```

Examples:

- Bankruptcy memory + new loan option → large negative utility
- Mentorship memory + hiring junior → positive utility
- Betrayal memory + ex-partner business option → strong negative

## 8.3 Memory Decay (Runtime Trigger)

Daily emotional decay (Citizen Engine) calls CDPS decay formulas:

```
currentWeight *= exp(-ln(2) / halfLifeMonths)
```

Resilience trait extends half-life for negative memories.

## 8.4 Memory Formation (Event Hook)

On domain events, Citizen Engine invokes CDPS memory formation:

```
onEvent(event) → cdps.evaluateMemoryFormation(citizen, event) → optional new memory
```

Citizen AI does not create memories directly—reacts to them.

---

# 9. Emotional State Runtime

## 9.1 State Variables (CDPS)

| Variable | Range | Citizen AI Usage |
|---|---|---|
| **Mood** | −50 to +50 | Optimism bias in perception |
| **Stress** | 0–100 | Integrity reduction, patience reduction |
| **Energy** | 0–100 | Decision deferral if low |
| **Grief** | 0–100 | Social withdrawal |
| **Euphoria** | 0–100 | Risk tolerance boost |

## 9.2 Daily Decay

```typescript
function decayEmotionalState(state: EmotionalState, traits: TraitVector): EmotionalState {
  return {
    mood: towardZero(state.mood, 0.15),
    stress: Math.max(0, state.stress - 5 * traits.emotionalResilience / 100),
    energy: computeEnergyFromSleep(state, citizen.routine),
    grief: Math.max(0, state.grief - 2 * traits.emotionalResilience / 100),
    euphoria: Math.max(0, state.euphoria - 8),
  };
}
```

## 9.3 Emotional Modifiers on Traits

Temporary trait weight adjustments during utility evaluation:

```typescript
function emotionalTraitModifier(trait: TraitId, state: EmotionalState): number {
  if (state.stress > 70) {
    if (trait === 'patience') return -0.2;
    if (trait === 'integrity') return -0.15;
    if (trait === 'riskTolerance') return +0.1;  // desperation
  }
  if (state.euphoria > 60) {
    if (trait === 'riskTolerance') return +0.25;
    if (trait === 'financialDiscipline') return -0.15;
  }
  if (state.grief > 50) {
    if (trait === 'sociability') return -0.3;
  }
  return 0;
}
```

## 9.4 Decision Deferral

If `energy < 20` or `stress > 90`:

- Non-P0 decisions deferred to next day
- Habits may fail
- Player sees "Too exhausted to decide" (T0 only)

---

# 10. Decision Engine

## 10.1 Core Utility Function

Per CDPS §10, implemented in Citizen AI runtime:

```typescript
function evaluateOption(
  citizen: Citizen,
  option: DecisionOption,
  decisionClass: DecisionClass,
  perception: PerceptionSnapshot,
  memories: ScoredMemory[],
  goals: ActiveGoal[],
  desires: ActiveDesire[],
  emotional: EmotionalState,
  macro: MacroStateVector,
): number {
  let utility = 0;

  // Trait contributions
  for (const [trait, weight] of TRAIT_DECISION_WEIGHTS[decisionClass]) {
    const modifier = emotionalTraitModifier(trait, emotional);
    const effectiveTrait = citizen.traits[trait] / 100 + modifier;
    utility += weight * effectiveTrait * option.traitScores[trait];
  }

  // Value alignment
  utility += valuesAlignment(citizen.values, option) * VALUES_WEIGHT;

  // Memories
  for (const { memory } of memories) {
    utility += memoryUtility(memory, option);
  }

  // Goals
  for (const goal of goals) {
    utility += goalDecisionBoost(goal, decisionClass) * option.goalAlignment[goal.type];
  }

  // Desires
  for (const desire of desires) {
    if (option.desireCategories.includes(desire.category)) {
      utility += desire.intensity / 100 * DESIRE_WEIGHT;
    }
  }

  // Financial feasibility perception
  utility += financialUtility(perception, option);

  // Macro context
  utility += macroContextUtility(macro, option, decisionClass);

  // Emotional state direct
  utility += emotional.directUtilityBias(option, emotional);

  // Stochastic noise (bounded)
  utility += gaussianNoise(citizen.citizenId, decisionClass) * NOISE_SCALE;

  return utility;
}
```

## 10.2 Hard Filters

Before utility evaluation:

```typescript
function filterOptions(
  options: DecisionOption[],
  citizen: Citizen,
  perception: PerceptionSnapshot,
): DecisionOption[] {
  return options.filter(opt => {
    if (opt.cost > perception.liquidAssets && !opt.allowsFinancing) return false;
    if (opt.illegal && citizen.traits.integrity > 60) return false;
    if (opt.requiredSkill && !hasSkill(citizen, opt.requiredSkill)) return false;
    if (opt.minAge && citizen.age < opt.minAge) return false;
    return true;
  });
}
```

## 10.3 Selection Policy

```typescript
function selectOption(scored: ScoredOption[]): DecisionOption {
  // Softmax with temperature from risk tolerance
  const temperature = 0.5 + (1 - citizen.traits.riskTolerance / 100);
  return softmaxSelect(scored, temperature);
}
```

High risk tolerance → flatter distribution → more surprises.

## 10.4 Command Emission

Selected option maps to domain command:

```typescript
const command = option.toCommand(citizen.citizenId);
await actionDispatcher.dispatch(command);
```

---

# 11. Decision Classes

## 11.1 Taxonomy

```typescript
enum DecisionClass {
  // P0 Survival
  PAY_BILLS = 'pay_bills',
  EMERGENCY_LIQUIDITY = 'emergency_liquidity',
  HEALTH_URGENT = 'health_urgent',

  // P1 Career & Income
  JOB_APPLY = 'job_apply',
  JOB_OFFER_RESPONSE = 'job_offer_response',
  QUIT_JOB = 'quit_job',
  ASK_PROMOTION = 'ask_promotion',
  SIDE_GIG = 'side_gig',

  // P1 Financial
  DEBT_PAYMENT = 'debt_payment',
  LOAN_APPLICATION = 'loan_application',
  BANKRUPTCY_FILING = 'bankruptcy_filing',

  // P2 Consumption
  HOUSING_MOVE = 'housing_move',
  VEHICLE_PURCHASE = 'vehicle_purchase',
  DISCRETIONARY_SPEND = 'discretionary_spend',
  SUBSCRIPTION_RENEW = 'subscription_renew',

  // P2 Investment
  INVEST_ALLOCATE = 'invest_allocate',
  INVEST_LIQUIDATE = 'invest_liquidate',
  RETIREMENT_CONTRIBUTION = 'retirement_contribution',

  // P2 Social
  RELATIONSHIP_INITIATE = 'relationship_initiate',
  RELATIONSHIP_MAINTAIN = 'relationship_maintain',
  RELATIONSHIP_END = 'relationship_end',
  MARRIAGE_PROPOSAL = 'marriage_proposal',
  CONFLICT_RESPONSE = 'conflict_response',

  // P2 Family
  CHILDBIRTH_PLANNING = 'childbirth_planning',
  EDUCATION_CHOICE = 'education_choice',
  INHERITANCE_RESPONSE = 'inheritance_response',

  // P3 Entrepreneurship
  FOUND_COMPANY = 'found_company',
  RAISE_FUNDING = 'raise_funding',
  BUSINESS_PIVOT = 'business_pivot',

  // P3 Lifestyle
  VACATION = 'vacation',
  HOBBY_INVEST = 'hobby_invest',
  PHILANTHROPY = 'philanthropy',
}
```

## 11.2 Scheduling Frequencies

| Class | Evaluation Cadence |
|---|---|
| PAY_BILLS | Daily if due |
| JOB_APPLY | Weekly if unemployed |
| INVEST_ALLOCATE | Monthly |
| HOUSING_MOVE | Annual or on trigger |
| FOUND_COMPANY | On opportunity + cooldown 180 days |

## 11.3 Cooldowns

Prevent thrashing:

```typescript
const DECISION_COOLDOWNS: Partial<Record<DecisionClass, number>> = {
  [DecisionClass.QUIT_JOB]: 90,
  [DecisionClass.FOUND_COMPANY]: 180,
  [DecisionClass.MARRIAGE_PROPOSAL]: 365,
  [DecisionClass.VEHICLE_PURCHASE]: 730,
};
```

---

# 12. Relationships & Social AI

## 12.1 Relationship Graph

Citizen AI reads relationship edges from Family/Relationship engines:

```typescript
interface RelationshipSummary {
  citizenId: string;
  type: 'spouse' | 'partner' | 'child' | 'parent' | 'sibling' | 'friend' | 'rival' | 'colleague' | 'mentor';
  affinity: number;           // -100 to +100
  trust: number;
  lastInteraction: string;
  memorySummary: string;
}
```

## 12.2 Social Maintenance (Weekly)

For each close relationship below maintenance threshold:

```
generateOptions: [reach_out, gift, ignore, confront]
utility weighted by empathy, sociability, affinity, memories
```

Neglect → affinity decay (Family Engine).

## 12.3 Romance AI

Partner selection utility:

| Factor | Weight Source |
|---|---|
| Physical/personality compatibility | Trait match |
| Financial stability | Perception |
| Family approval | Values + family pressure |
| Social status | Ambition, reputation |
| Past relationship memories | Memory retrieval |

## 12.4 Conflict Response

On conflict event:

```
options: [apologize, escalate, mediate, estrange]
integrity and empathy weight heavily
betrayal memories bias toward estrange
```

## 12.5 Networking (Career-Linked)

High sociability + ambition citizens:

- Weekly `RELATIONSHIP_INITIATE` toward industry leaders
- Boosts career opportunity perception

---

# 13. Career AI

## 13.1 Employment State Machine

```
UNEMPLOYED → SEARCHING → INTERVIEWING → OFFERED → EMPLOYED
                ↑                              │
                └──────── QUIT / LAYOFF ───────┘
```

## 13.2 Job Search (Weekly if Unemployed)

```typescript
function jobSearchIntensity(citizen: Citizen, perception: PerceptionSnapshot): number {
  const financialPressure = 1 / Math.max(perception.runwayMonths, 0.5);
  const ambitionDrive = citizen.traits.ambition / 100;
  const stressMultiplier = 1 + perception.stressLevel / 200;
  return clamp(financialPressure * ambitionDrive * stressMultiplier, 0.1, 1.0);
}
```

Applications issued to Career Engine proportional to intensity × openings visible.

## 13.3 Job Offer Evaluation

```typescript
interface JobOfferOption extends DecisionOption {
  salary: number;
  title: JobLevel;
  companyReputation: number;
  commuteMinutes: number;
  growthPotential: number;
  cultureFit: number;
}

function jobOfferUtility(citizen: Citizen, offer: JobOfferOption): number {
  return (
    salaryScore(offer.salary, citizen) * 0.30 +
    prestigeScore(offer.title, citizen.traits.ambition) * 0.20 +
    stabilityScore(offer.companyReputation) * 0.15 +
    commuteScore(offer.commuteMinutes, citizen.traits.patience) * 0.10 +
    growthScore(offer.growthPotential, citizen.traits.ambition) * 0.15 +
    cultureScore(offer.cultureFit) * 0.10
  );
}
```

## 13.4 Quit Decision

Consider quitting when:

- Stress > 80 sustained
- Better offer pending
- Goal mismatch (entrepreneurship desire)
- Toxic workplace memory

Utility vs financial runway constraint.

## 13.5 Retirement

At eligibility age:

```
retireUtility = desireForFreedom + burnout - ambitionPenalty - financialNeed
```

Financial need computed from retirement savings projection.

---

# 14. Spending & Consumption AI

## 14.1 Budget Model

```typescript
interface CitizenBudget {
  monthlyIncome: number;
  fixedExpenses: number;
  savingsTarget: number;
  discretionaryPool: number;
  categories: Record<SpendCategory, number>;
}

type SpendCategory =
  | 'housing' | 'food' | 'transport' | 'healthcare' | 'utilities'
  | 'entertainment' | 'apparel' | 'education' | 'gifts' | 'luxury' | 'charity';
```

## 14.2 Monthly Budget Review

```
1. Compute income (Career + passive)
2. Deduct fixed (rent, loans, insurance)
3. Apply savings target (financial discipline trait)
4. Allocate discretionary by goals/desires
5. Publish spending commands to Banking
```

## 14.3 Propensity to Consume

```typescript
function mpc(citizen: Citizen, perception: PerceptionSnapshot): number {
  const base = 0.7 - citizen.traits.financialDiscipline / 200;
  const confidenceBoost = (perception.consumerConfidence - 100) / 500;
  const stressSpending = perception.stressLevel > 70 ? 0.05 : 0;
  return clamp(base + confidenceBoost + stressSpending, 0.4, 0.95);
}
```

## 14.4 Lifestyle Inflation

Windfall or promotion:

```
desireForUpgrade = f(incomeDelta, sociability, mediaInfluence)
resist = financialDiscipline + bankruptcyMemories
```

## 14.5 Major Purchases

Housing, vehicle decisions use multi-month evaluation:

- Affordability (Banking pre-approval perception)
- Goal alignment (`home_ownership`)
- Macro rate environment (Economy)
- Memory: foreclosure avoidance

## 14.6 Price Sensitivity

Citizens consume Economy price indices:

```
realCost = nominalPrice × (1 + citizen.inflationFeeling)
```

High financial literacy → `inflationFeeling` closer to actual CPI.

---

# 15. Investment AI

## 15.1 Portfolio Philosophy

Derived from traits + memories + goals:

| Profile | Traits | Strategy |
|---|---|---|
| **Conservative** | Low risk, high discipline | Bonds, index funds |
| **Balanced** | Moderate risk | 60/40 analog |
| **Aggressive** | High risk, high ambition | Growth stocks, startup equity |
| **Speculator** | High risk, low discipline | Trading, crypto-equivalents |
| **Avoidant** | Bankruptcy memory | Cash-heavy |

## 15.2 Monthly Allocation

```typescript
function investmentAllocation(citizen: Citizen, perception: PerceptionSnapshot): Allocation {
  const riskBudget = citizen.traits.riskTolerance / 100;
  const macroModifier = macroRiskModifier(perception.marketSentiment);
  const goalModifier = goal.type === 'wealth_target' ? 0.1 : 0;

  const equityWeight = clamp(riskBudget + macroModifier + goalModifier, 0, 0.9);
  return { equity: equityWeight, bonds: 1 - equityWeight - cashWeight, cash: cashWeight };
}
```

## 15.3 Panic Selling

Recession + market crash + low emotional resilience:

```
P(panicSell) = f(stress, euphoriaReversal, lossAversion, bankruptcyMemory)
```

Symmetry: Player may panic-sell manually; AI may auto-sell via same Investment commands.

## 15.4 Retirement Accounts

Tax-advantaged contribution decisions monthly:

- Max contribution if `early_retirement` goal active
- Skip if runway < 3 months

## 15.5 Startup Angel Investing

High entrepreneurial instinct citizens:

- Evaluate seed deals (Company Engine)
- Utility from sector outlook + founder relationship + FOMO desire

---

# 16. Family & Life Course AI

**Partnership:** utility from affinity, trust, financial stability, values, memories, family pressure. **Childbirth:** `desireForChild` vs career ambition and runway. **Education (age 18):** university/trade/employment/entrepreneurship utility from traits + macro hiring demand. **Inheritance:** accept/dispute via integrity, values, financial need. **Elder care:** relationship maintenance ↑, healthcare spending ↑, caregiver stress.

---

# 17. Health & Lifestyle AI

Preventive care utility from `healthAwareness`, `discipline`, negative health memories. Exercise/diet via habits or weekly decisions. High stress + low resilience increases coping habits (alcohol, gambling) with long-term health cost. Burnout (stress > 85): quit utility ↑, vacation desire, healthcare utilization ↑.

---

# 18. Entrepreneurship AI

Founding probability from `entrepreneurialInstinct`, `ambition`, runway, sector opportunity, business memories, bankruptcy penalty. Sector/type selection by skill match and Economy demand. Bootstrap vs raise funding per runway and risk profile. NPC founders use identical `FoundCompany` validation as player.

---

# 19. Player Command Bridge

## 19.1 Symmetry Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Player UI     │         │  Citizen AI     │
│   Commands      │         │  Decisions      │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
         ┌───────────────────────┐
         │  Command Validator    │  ← same rules
         │  (domain engines)     │
         └───────────────────────┘
```

## 19.2 Player-Only Affordances (Non-Simulation)

| Affordance | Allowed | Simulation Impact |
|---|---|---|
| Detailed financial breakdown | Yes | None |
| Decision explanation hints | Yes | None |
| Undo | No | — |
| Cheaper loans | No | Violates symmetry |
| See NPC utilities | Dev only | — |

## 19.3 Explicit vs Delegated

Player may configure **delegation policies** for T0 citizen:

```typescript
interface DelegationPolicy {
  payBills: 'manual' | 'auto';
  jobOffers: 'manual' | 'auto_conservative' | 'auto_ambitious';
  investments: 'manual' | 'auto_index';
  routineSpending: 'manual' | 'auto_budget';
}
```

`auto` modes use **identical AI utility** as NPC—player is not forced to micro-manage (accessibility).

## 19.4 Command Validation

```typescript
async function executePlayerCommand(
  citizen: Citizen,
  command: CitizenCommand,
): Promise<CommandResult> {
  // NO utility evaluation — player intent is authoritative
  const validation = await domainValidator.validate(command, citizen);
  if (!validation.ok) return { success: false, reason: validation.reason };
  return await actionDispatcher.dispatch(command);
}
```

Rejected commands return real reasons (insufficient funds, unqualified)—same as AI would fail.

---

# 20. Offline & Catch-Up AI

## 20.1 Offline Resolution Policy

When player away (Document 17), Citizen AI resolves T0 citizen via:

1. Delegation policies if set
2. Else `allowAiResolve` gate policy
3. Else full AI orchestration at monthly granularity

## 20.2 Compressed Offline Decisions

| Decision | Offline Handling |
|---|---|
| Pay bills | Auto-execute if funds |
| Job offers | Utility resolve at receipt |
| Investments | Monthly allocation only |
| Relationships | Weekly rollup |
| Discretionary | Statistical spend |

## 20.3 Major Event Notification

Events too consequential for silent resolution:

- Bankruptcy filing
- Marriage/divorce
- Job loss at player employer
- Inheritance
- Health crisis

Queued for player review on return—even if AI already resolved.

## 20.4 Catch-Up Integrity

T0 citizen receives **full fidelity** during catch-up (Document 17)—no statistical compression for player citizen.

---

# 21. Tiered Fidelity

## 21.1 Tier Processing

| Tier | Citizen AI Behaviour |
|---|---|
| **T0** | Full pipeline; player commands + AI for delegated |
| **T1** | Full utility; 8 evals/day max |
| **T2** | Batch monthly: employment status, spending aggregate, relationship drift |
| **T3** | No Citizen AI; Economy aggregate consumption only |

## 21.2 T2 Batch Compression

```typescript
function t2MonthlyBatch(citizens: Citizen[], sector: SectorId): void {
  const unemployment = economy.getUnemployment();
  const demand = economy.getSectorDemand(sector);

  for (const c of citizens) {
    // Employment transition probability
    if (!c.employed) {
      c.employed = rng() < hireProbability(c.statisticalProfile, demand, unemployment);
    } else {
      c.employed = rng() > layoffProbability(demand, unemployment);
    }
    // Spending
    c.monthlySpend = c.income * mpc(c.statisticalProfile, macro);
  }
}
```

## 21.3 Promotion to T1

When T2 citizen enters player adjacency:

- Hydrate full CDPS if not present (from statistical profile)
- Generate synthetic memories from summary (WGS backfill rules)
- Enable full Citizen AI from promotion date forward

## 21.4 Demotion

T1 → T2 when leaving adjacency:

- Freeze CDPS snapshot to statistical summary
- Cease full utility evaluations

---

# 22. Events & Integration

## 22.1 Citizen AI Consumes

| Event | AI Response |
|---|---|
| `career.job_offered` | Schedule JOB_OFFER_RESPONSE |
| `banking.defaulted` | Memory formation; spending cut |
| `economy.recession_entered` | Risk reduction; job search ↑ |
| `family.married` | Goal update; budget recalc |
| `healthcare.diagnosis` | Health decision priority ↑ |
| `company.layoff` (if employee) | JOB_SEARCH urgency |
| `media.scandal_exposed` (if subject) | Stress ↑; social decisions |

## 22.2 Citizen AI Publishes (via Commands)

Commands generate domain events—not Citizen AI directly:

- `career.job_applied`
- `banking.transaction_posted`
- `investment.order_placed`
- `family.relationship_action`

## 22.3 CDPS Feedback Loop

Significant command outcomes trigger CDPS evolution:

```
commandResult → cdps.applyExperienceEvent(citizen, event) → trait delta / new memory
```

---

# 23. Performance & Budgets

## 23.1 Targets (FSF Aligned)

| Scope | Budget |
|---|---|
| T0 + T1 daily combined | < 2ms |
| Single T1 utility evaluation | < 0.15ms |
| Perception build (T1) | < 0.3ms |
| T2 batch (1000 citizens) | < 20ms |
| Offline monthly catch-up (T0) | < 50ms |

## 23.2 Optimization Techniques

| Technique | Application |
|---|---|
| Habit short-circuit | Skip utility for strong habits |
| Perception cache | Daily rebuild only |
| Decision cooldowns | Prevent repeated evals |
| Early hard filter | Remove illegal options cheaply |
| Tier batching | T2 statistical rollup |
| Memoized trait weights | Per decision class |

## 23.3 Profiling

```typescript
interface CitizenAiPerfRecord {
  citizenId: string;
  tier: CitizenTier;
  utilityEvals: number;
  habitsRun: number;
  commandsIssued: number;
  durationMs: number;
}
```

---

# 24. Debugging & Explainability

## 24.1 Decision Trace (Dev Only)

```typescript
interface DecisionTrace {
  decisionClass: DecisionClass;
  options: { id: string; utility: number; breakdown: UtilityBreakdown }[];
  selected: string;
  noise: number;
  memoriesUsed: string[];
  goalsUsed: string[];
}
```

## 24.2 Player-Facing Hints (Limited)

Optional "Advisor" feature suggests reasoning without revealing exact utility:

> "You're stressed about runway — that might make a stable job appealing."

Not simulation logic—UI hint layer.

## 24.3 Replay

Decision traces logged to dev event log for deterministic replay validation.

## 24.4 QA Scenarios

| Scenario | Expected Behaviour |
|---|---|
| High ambition, low discipline | Risky career moves, debt accumulation |
| Bankruptcy memory | Debt avoidance, cash hoarding |
| Recession + low resilience | Panic sell, job cling |
| Delegation auto-invest | Matches NPC index strategy |

---

# 25. Governance & Ethics

## 25.1 Prohibited Patterns

| Pattern | Reason |
|---|---|
| NPC-only fraud immunity | Symmetry violation |
| Player mind-reading (omniscient AI) | Breaks believability |
| LLM in tick hot path | Non-deterministic, non-budgeted |
| Demographic discrimination in hiring utility | Constitutional |
| Predatory targeting of player | Living World ≠ hostile |

## 25.2 Bias Auditing

Quarterly audit of statistical outcomes by region/background:

- Employment rates
- Loan approval rates
- Promotion rates

Outcomes may differ from choices—but **inputs to utility must not use protected classes**.

## 25.3 Modding Boundaries

Mods may adjust trait weights within guardrails—not single-player shortcuts.

## 25.4 Evolution Path

| Future | Notes |
|---|---|
| LLM dialogue layer | Client-only, cosmetic |
| Deeper theory-of-mind | T1 relationship modeling |
| Group decision dynamics | Family/household unit |

---

## Appendix A — Utility Weight Tables (Career)

| Trait | JOB_OFFER | QUIT_JOB | JOB_APPLY |
|---|---|---|---|
| Ambition | +0.25 | −0.10 | +0.20 |
| Risk tolerance | +0.10 | +0.15 | +0.05 |
| Financial discipline | +0.10 | −0.20 | +0.15 |
| Confidence | +0.15 | +0.10 | +0.20 |

---

## Appendix B — Daily Orchestration (Summary)

Daily pipeline: load state → build perception → decay emotions → P0 bills → execute habits → resolve pending gates → evaluate decision classes (tier budget) → dispatch commands. See §4.2 for full sequence.

---

*End of Document 20 — Citizen AI*
