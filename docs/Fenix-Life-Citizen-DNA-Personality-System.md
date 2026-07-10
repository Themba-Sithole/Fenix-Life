# Fenix Life — Official Citizen DNA & Personality System (CDPS)

**Document Version:** 1.0  
**Status:** Canonical — Behavioural Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead AI Designer & Behavioural Simulation Architecture  
**Audience:** Engineering, AI Systems, Game Design, Narrative, Economy, QA  

---

## Document Authority

The Citizen DNA & Personality System (CDPS) defines **how every citizen in Fenix Life thinks, feels, remembers, decides, and changes** across a lifetime. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Emergence, symmetry, meaningful choice, living world |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Five Capitals, Human Capital |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Citizen Engine ownership, events, tiers |
| [Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | Birth personality vectors, family inheritance |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | `CitizenProfile`, genetics seed, memory storage |

When behavioural design conflicts with Citizen Equality, **the player and AI must use identical CDPS rules**. UI may reveal more detail; it may not alter formulas.

**What the CDPS is:**

- The **behavioural foundation** for all citizens (T0–T1 full; T2 compressed; T3 statistical)
- The **decision substrate** consumed by Career, Family, Company, Investment, and Education engines
- The **identity engine** that makes citizens surprising yet coherent over decades

**What the CDPS is not:**

- A scripted dialogue tree or quest personality selector
- A deterministic fate calculator ("high Ambition = CEO")
- A player-only stat screen with hidden AI shortcuts
- An LLM roleplay layer in the simulation hot path

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Philosophy](#2-core-philosophy)
3. [Architectural Model](#3-architectural-model)
4. [DNA Trait Catalog](#4-dna-trait-catalog)
5. [Trait Interactions](#5-trait-interactions)
6. [Values, Motivations & Goals](#6-values-motivations--goals)
7. [Habits & Emotional State](#7-habits--emotional-state)
8. [Personality Evolution](#8-personality-evolution)
9. [Memory System](#9-memory-system)
10. [Decision-Making Model](#10-decision-making-model)
11. [Family Inheritance](#11-family-inheritance)
12. [Tier Representation & Performance](#12-tier-representation--performance)
13. [Integration with FSF](#13-integration-with-fsf)
14. [Governance & Ethics](#14-governance--ethics)

---

# 1. Executive Summary

Fenix Life citizens are **psychological agents**, not stat blocks with names.

Each citizen carries a **Genotype** (inherited biological seed), a **Baseline Temperament** (stable tendencies at birth), an **Expressed Personality** (current trait profile that drifts over decades), **Values** (slow-changing moral and life priorities), **Memories** (significant experiences that bias future choices), and **Goals** (active aspirations across the Five Capitals).

> **DNA influences behaviour. It never completely determines it.**

The CDPS implements this through **bounded utility decision-making**: citizens evaluate real options using traits, memories, finances, relationships, and macro context—then apply **stochastic noise** within rational bounds so behaviour remains believable without becoming predictable.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CITIZEN BEHAVIOURAL STACK                    │
├─────────────────────────────────────────────────────────────────┤
│  Goals & Dreams          ←── Five Capitals aspirations          │
│  Values                  ←── Identity anchors (slow)            │
│  Expressed Personality   ←── 18 traits (evolving)               │
│  Baseline Temperament    ←── Birth + early childhood            │
│  Genotype                ←── Genetics seed (stable)             │
├─────────────────────────────────────────────────────────────────┤
│  Memories (active)       ←── Event-linked biases                │
│  Habits                  ←── Reinforced behaviours              │
│  Emotional State         ←── Stress, mood, energy (short-term)│
├─────────────────────────────────────────────────────────────────┤
│  Decision Engine         ←── Utility + noise + constraints      │
└─────────────────────────────────────────────────────────────────┘
         ▲                              │
         │         Life experiences     │
         └──────────────────────────────┘
    Education · Family · Career · Trauma · Success · Aging ...
```

**Symmetry Principle:** The player's citizen uses this stack. AI citizens use this stack. The difference is **who issues commands**—not which formulas run.

---

# 2. Core Philosophy

## 2.1 A Citizen Is More Than Statistics

Constitution Article I requires every citizen to possess personality, dreams, skills, relationships, memories, and legacy. The CDPS is the **psychological layer** that makes those domains coherent.

| Domain | CDPS Role |
|---|---|
| **Personality** | Trait profile shapes default preferences |
| **Values** | Filters which preferences feel "right" or shameful |
| **Talents & weaknesses** | Trait + skill affinities, not destiny |
| **Motivations** | Goals translate traits into action |
| **Habits** | Repeated decisions become low-friction defaults |
| **Memories** | Past events weight future utilities |
| **Emotional tendencies** | Stress resilience, optimism bias under pressure |
| **Long-term goals** | Career, family, wealth, fame, mastery, freedom, service |
| **Decision biases** | Systematic deviations from pure rationality |

## 2.2 Influence, Not Determinism

| Principle | Meaning |
|---|---|
| **Probabilistic, not scripted** | High Ambition raises startup attempt rate; it does not guarantee success |
| **Context overrides trait** | Low Integrity may still refuse fraud if reputation risk exceeds threshold |
| **Experience rewires expression** | Bankruptcy can increase Risk Tolerance (desperation) or decrease it (trauma) |
| **Caps are soft** | Traits range 0–100 but rarely sit at extremes; regression toward experience-adjusted mean |
| **Surprise is designed** | Controlled noise prevents "I always know what this NPC will do" |

## 2.3 Believable Over Optimal

AI citizens use **bounded rationality** (Product Bible §10): they do not omnisciently pick global maxima. They pick the best option **they perceive**, given information limits, emotional state, and cognitive biases—matching human decision patterns.

## 2.4 The Explainability Test

When a citizen makes a surprising choice, a player investigating (news, relationship history, employee profile) should find **plausible causes**:

- Trait lean + memory + financial pressure + relationship incentive
- Not "the AI rolled random"

## 2.5 Connection to Five Capitals

| Capital | Primary CDPS Drivers |
|---|---|
| **Human** | Learning speed, discipline, creativity, health awareness |
| **Social** | Empathy, sociability, integrity, leadership |
| **Financial** | Risk tolerance, financial discipline, ambition |
| **Business** | Entrepreneurial instinct, patience, adaptability |
| **Legacy** | Integrity, ambition, empathy (succession values) |

---

# 3. Architectural Model

## 3.1 Entity Ownership (Citizen Engine)

Per Database Design Document and FSF:

| Entity | Owner | Contents |
|---|---|---|
| `Citizen` | Citizen Engine | Identity, genetics seed, birth date |
| `CitizenProfile` | Citizen Engine | Baseline, expressed traits, values, goals |
| `CitizenStats` | Citizen Engine | Energy, stress, happiness, health snapshot |
| `CitizenMemory[]` | Citizen Engine | Active and faded memories |
| `CitizenHabit[]` | Citizen Engine | Reinforced behaviour patterns |
| `CitizenTimeline` | Projection | UI milestones from events + memories |

## 3.2 Trait Value Scale

All DNA traits use **0–100** with population mean **50** and standard deviation **12** at generation.

| Band | Label | Population % (approx.) |
|---|---|---|
| 0–20 | Very low | 5% |
| 21–35 | Low | 15% |
| 36–64 | Average | 60% |
| 65–79 | High | 15% |
| 80–100 | Very high | 5% |

**Expressed traits** drift over life; **baseline** changes slowly (see §8). **Genotype** is stable except epigenetic hooks (expansion).

## 3.3 Expressed vs Baseline

| Layer | Volatility | Description |
|---|---|---|
| **Genotype** | Fixed at birth | Inherited seed; partial trait priors |
| **Baseline Temperament** | Very slow | Set by age 6–8; culture + family + genetics |
| **Expressed Personality** | Moderate | Current trait values; primary decision input |
| **Situational Modifiers** | Fast (days–weeks) | Stress, grief, euphoria, burnout |

**Reversion:** Expressed traits drift toward **experience-adjusted baseline**, not raw birth baseline. Trauma and success permanently shift the target baseline slightly.

## 3.4 Decision Pipeline (Conceptual)

```
1. Perceive available options (engine provides real choices)
2. Filter by hard constraints (money, law, health, time)
3. Score each option (utility function)
4. Apply memory biases and emotional modifiers
5. Apply stochastic noise (tier-dependent magnitude)
6. Select action; emit command to owning engine
7. On outcome → evaluate memory formation / trait drift
```

## 3.5 Anti-Predictability Mechanisms

| Mechanism | Purpose |
|---|---|
| **Utility noise** | ±5–15% score jitter per decision |
| **Tie-breaking entropy** | Seeded hash(citizenId, simulationDate, decisionClass) |
| **Hidden information** | Citizens don't know competitor private data |
| **Mood swings** | Short-term emotional state shifts weights |
| **Value conflicts** | Integrity vs Ambition creates genuine dilemmas |
| **Memory fade** | Old patterns weaken; citizens "move on" |

---

# 4. DNA Trait Catalog

Eighteen core traits form the **Fenix Trait Model (FTM-18)**. Each trait is independent at generation but **correlates** through genotype and culture matrices—never perfectly.

---

## 4.1 Ambition

| Aspect | Specification |
|---|---|
| **Meaning** | Drive to achieve status, power, wealth, or impact beyond current station |
| **Range** | 0 (contentment with present) → 100 (relentless upward drive) |
| **Gameplay effects** | Promotion pursuit rate; overtime acceptance; political candidacy; willingness to relocate; stress from stagnation; dissatisfaction in dead-end jobs |
| **Evolution** | ↑ success, mentorship, competitive environments; ↓ burnout, repeated failure without recovery, contentment life events (parenthood optional) |
| **Interactions** | Amplifies Leadership, Entrepreneurial instinct; conflicts with Patience; modulated by Integrity (cutthroat vs honorable ambition) |

---

## 4.2 Curiosity

| Aspect | Specification |
|---|---|
| **Meaning** | Desire to explore ideas, careers, places, and knowledge for intrinsic interest |
| **Range** | 0 (prefers familiar) → 100 (restlessly exploratory) |
| **Gameplay effects** | Skill diversification; career pivot probability; education continuation; travel; early adoption of industries; distraction from specialization |
| **Evolution** | ↑ broad education, travel, diverse friendships; ↓ routine jobs, financial crisis (forced focus), aging (mild natural decline) |
| **Interactions** | Pairs with Learning speed and Creativity; tensions with Discipline and Financial discipline (expensive hobbies) |

---

## 4.3 Creativity

| Aspect | Specification |
|---|---|
| **Meaning** | Capacity for novel solutions, artistic expression, and unconventional problem framing |
| **Range** | 0 (procedural, conventional) → 100 (highly original) |
| **Gameplay effects** | R&D output; product differentiation; marketing flair; non-linear career paths; friction in rigid corporate cultures |
| **Evolution** | ↑ arts education, creative careers, autonomy; ↓ bureaucratic punishment of failure, burnout, strict compliance cultures |
| **Interactions** | Boosted by Curiosity; needs Confidence to act; constrained by Integrity (ethical innovation vs fraud) |

---

## 4.4 Discipline

| Aspect | Specification |
|---|---|
| **Meaning** | Ability to sustain effort, routines, and long-term plans despite discomfort |
| **Range** | 0 (impulsive, inconsistent) → 100 (iron consistency) |
| **Gameplay effects** | Skill gain rate multiplier; debt paydown reliability; fitness maintenance; project completion; lower variance in performance reviews |
| **Evolution** | ↑ military/structured education, successful habit loops; ↓ addiction, depression episodes, chaotic relationships |
| **Interactions** | Complements Patience and Financial discipline; suppresses Risk tolerance extremes; required for high Discipline + high Ambition (sustainable grind) |

---

## 4.5 Patience

| Aspect | Specification |
|---|---|
| **Meaning** | Tolerance for delayed gratification and slow outcomes |
| **Range** | 0 (demands immediate results) → 100 (comfortable with decade horizons) |
| **Gameplay effects** | Long-term investment hold; startup persistence; relationship stability; negotiation outcomes; resistance to panic selling |
| **Evolution** | ↑ successful delayed rewards, aging; ↓ acute financial stress, betrayal, get-rich-quick scams (if victimized, may ↓ permanently) |
| **Interactions** | Essential with Financial discipline; opposes high Risk tolerance + low Integrity (gambling); enables Patience + Ambition (dynasty builders) |

---

## 4.6 Risk Tolerance

| Aspect | Specification |
|---|---|
| **Meaning** | Comfort with uncertainty, volatility, and potential loss |
| **Range** | 0 (loss-averse) → 100 (seeks volatility) |
| **Gameplay effects** | Leverage use; startup founding; speculative investments; career jumps; insurance uptake (inverse); bankruptcy recovery paths |
| **Evolution** | ↑ windfalls, youth, peer norms; ↓ bankruptcy, trauma, parenthood, aging; **bimodal**: some trauma increases desperation risk-taking |
| **Interactions** | Drives Entrepreneurial instinct; dangerous with low Financial discipline; moderated by Confidence and Emotional resilience |

---

## 4.7 Leadership

| Aspect | Specification |
|---|---|
| **Meaning** | Ability to inspire, coordinate, and take responsibility for group outcomes |
| **Range** | 0 (follower preference) → 100 (natural commander) |
| **Gameplay effects** | Management promotion; company founding team role; political appeal; union/strike leadership; family decision dominance |
| **Evolution** | ↑ successful team outcomes, mentorship received; ↓ public failure, scandal, social isolation |
| **Interactions** | Amplified by Confidence and Sociability; hollow without Integrity (toxic boss arc); needs Empathy for sustainable leadership |

---

## 4.8 Confidence

| Aspect | Specification |
|---|---|
| **Meaning** | Self-belief in capability and right to act |
| **Range** | 0 (self-doubting) → 100 (bold self-assurance) |
| **Gameplay effects** | Negotiation outcomes; interview performance; public speaking; asking for raises; overcommitment risk; resilience after setbacks |
| **Evolution** | ↑ achievements, praise, education prestige; ↓ rejection streaks, abuse, bankruptcy, media humiliation |
| **Interactions** | Multiplies Ambition and Entrepreneurial instinct; **overconfidence trap** when Confidence >> skill; Integrity checks bravado |

---

## 4.9 Empathy

| Aspect | Specification |
|---|---|
| **Meaning** | Sensitivity to others' emotions and welfare |
| **Range** | 0 (self-focused) → 100 (deeply attuned) |
| **Gameplay effects** | Relationship depth; employee retention as manager; customer service quality; philanthropy; susceptibility to manipulation; conflict avoidance |
| **Evolution** | ↑ nurturing relationships, parenthood, caregiving; ↓ betrayal, cutthroat environments, burnout compassion fatigue |
| **Interactions** | Core for Social Capital; tensions with high Ambition + low Integrity (ruthless climb); supports Leadership quality |

---

## 4.10 Integrity

| Aspect | Specification |
|---|---|
| **Meaning** | Commitment to honesty, fairness, and internal moral code |
| **Range** | 0 (pragmatic/amoral) → 100 (principled) |
| **Gameplay effects** | Fraud likelihood (inverse); whistleblowing; contract trust; scandal recovery; premium for "trusted" reputation; foregone profitable shortcuts |
| **Evolution** | ↑ ethical mentors, religious/cultural values, accountability; ↓ survival pressure, corrupt environments, unpunished cheating |
| **Interactions** | Gates Ambition paths; with low Integrity + high Risk tolerance → crime/fraud arcs; with high Integrity + high Ambition → honorable empire builder |

---

## 4.11 Optimism

| Aspect | Specification |
|---|---|
| **Meaning** | Default expectation of positive outcomes |
| **Range** | 0 (pessimistic) → 100 (unwaveringly hopeful) |
| **Gameplay effects** | Stress recovery; persistence after failure; consumer spending; health outcomes (minor); underestimation of risk |
| **Evolution** | ↑ success streaks, supportive relationships; ↓ trauma, recession unemployment, bereavement |
| **Interactions** | Buffers Emotional resilience; dangerous with Risk tolerance (underpriced danger); shapes Optimism + Ambition rebound narratives |

---

## 4.12 Adaptability

| Aspect | Specification |
|---|---|
| **Meaning** | Flexibility when plans fail or environments shift |
| **Range** | 0 (rigid) → 100 (fluid) |
| **Gameplay effects** | Career reinvention after layoff; industry pivot; immigration/migration; crisis management; lower sunk-cost fallacy |
| **Evolution** | ↑ diverse experiences, forced change; ↓ age (mild), long tenure comfort zones |
| **Interactions** | Complements Curiosity; enables Adaptability + low Patience (pivot king); critical for recession survival |

---

## 4.13 Sociability

| Aspect | Specification |
|---|---|
| **Meaning** | Energy and preference for social interaction |
| **Range** | 0 (solitary) → 100 (highly gregarious) |
| **Gameplay effects** | Network growth rate; sales career fit; loneliness stress; event attendance; partnership formation probability |
| **Evolution** | ↑ positive social feedback; ↓ rejection, depression, remote-work habits |
| **Interactions** | Feeds Leadership and Social Capital; low Sociability + high Ambition → lone wolf entrepreneur |

---

## 4.14 Emotional Resilience

| Aspect | Specification |
|---|---|
| **Meaning** | Speed and completeness of recovery from psychological setbacks |
| **Range** | 0 (fragile) → 100 (unshakeable) |
| **Gameplay effects** | Post-trauma trait drift magnitude; burnout recovery; divorce recovery; performance after failure; mental health episode duration |
| **Evolution** | ↑ therapy, supportive network, mastered hardships; ↓ accumulated unprocessed trauma, isolation |
| **Interactions** | Dampens negative memory weight over time; pairs with Optimism; without Integrity, may become cynical resilience |

---

## 4.15 Learning Speed

| Aspect | Specification |
|---|---|
| **Meaning** | Rate of skill and knowledge acquisition |
| **Range** | 0 (slow learner) → 100 (rapid absorber) |
| **Gameplay effects** | Education completion time; skill XP multiplier; training ROI; technology adoption; **not** a substitute for Discipline |
| **Evolution** | ↑ quality education, cognitive health; ↓ age (gradual decline), brain injury, chronic stress |
| **Interactions** | Amplifies Curiosity ROI; Learning speed + low Discipline → "brilliant but flaky" archetype |

---

## 4.16 Entrepreneurial Instinct

| Aspect | Specification |
|---|---|
| **Meaning** | Innate pull toward identifying opportunities, founding ventures, and owning outcomes |
| **Range** | 0 (employee mindset) → 100 (serial founder drive) |
| **Gameplay effects** | Startup attempt rate; side hustle probability; franchise vs own-brand preference; acquisition hunger |
| **Evolution** | ↑ founder success, entrepreneurial parents (partial); ↓ bankruptcy, family pressure for stability |
| **Interactions** | Requires Risk tolerance and Confidence; Financial discipline determines survival; distinct from Ambition (instinct vs drive) |

---

## 4.17 Financial Discipline

| Aspect | Specification |
|---|---|
| **Meaning** | Habitual control of spending, saving, and debt |
| **Range** | 0 (spender/debtor) → 100 (austere planner) |
| **Gameplay effects** | Savings rate; credit score stability; bankruptcy avoidance; investment horizon; lifestyle inflation resistance |
| **Evolution** | ↑ financial literacy education, hardship, mentors; ↓ windfalls (lifestyle creep), social spending pressure |
| **Interactions** | Stabilizes Risk tolerance; low Financial discipline + high Risk tolerance → debt spiral archetype |

---

## 4.18 Health Awareness

| Aspect | Specification |
|---|---|
| **Meaning** | Proactive attention to physical and mental health |
| **Range** | 0 (neglectful) → 100 (vigilant) |
| **Gameplay effects** | Preventive care uptake; exercise habits; burnout avoidance; healthcare spending; longevity modifier |
| **Evolution** | ↑ health scare, fitness culture peers; ↓ time poverty, depression, hubris after long health |
| **Interactions** | Enables Discipline in fitness; conflicts with high Ambition + low Patience (overwork); supports Human Capital retention |

---

# 5. Trait Interactions

## 5.1 Synergy Clusters (Archetype Seeds)

Archetypes emerge from clusters—they are **not** player classes:

| Cluster | Traits | Emergent Archetype |
|---|---|---|
| **Founder DNA** | Entrepreneurial instinct, Ambition, Risk tolerance, Confidence | Startup founder |
| **Steward DNA** | Patience, Financial discipline, Integrity, Discipline | Long-horizon wealth builder |
| **Magnet DNA** | Sociability, Empathy, Leadership, Confidence | Network executive |
| **Scholar DNA** | Curiosity, Learning speed, Discipline, Creativity | Researcher, innovator |
| **Survivor DNA** | Adaptability, Emotional resilience, low Optimism | Post-crisis reinventor |
| **Caution DNA** | Low risk, high Financial discipline, Patience | Index investor, tenured employee |

Citizens rarely align perfectly with one cluster—**misaligned traits create internal conflict** and richer stories.

## 5.2 Antagonistic Pairs

| Pair | Tension |
|---|---|
| Ambition vs Integrity | Ruthless climb vs ethical limits |
| Risk tolerance vs Financial discipline | Speculation vs security |
| Curiosity vs Discipline | Jack-of-all-trades vs mastery |
| Confidence vs Empathy | Overbearing vs collaborative |
| Patience vs Entrepreneurial instinct | Wait vs act now |
| Sociability vs Discipline | Social time vs deep work |

Decision engine treats tension as **multi-objective utility**, not automatic trade winner.

## 5.3 Correlation at Birth (Not Binding)

WGS applies weak correlated sampling from genotype:

| Correlation | Strength |
|---|---|
| Learning speed ↔ Curiosity | +0.35 |
| Leadership ↔ Sociability | +0.30 |
| Integrity ↔ Empathy | +0.25 |
| Risk tolerance ↔ Entrepreneurial instinct | +0.40 |
| Discipline ↔ Financial discipline | +0.45 |

Correlations are **priors**, not locks. Life can diverge.

---

# 6. Values, Motivations & Goals

## 6.1 Values (Slow Identity Anchors)

Separate from traits, **Values** are moral and life priorities that change slowly (years):

| Value Dimension | Poles |
|---|---|
| **Security ↔ Freedom** | Stability vs autonomy |
| **Tradition ↔ Progress** | Heritage vs innovation |
| **Individualism ↔ Collectivism** | Self vs community |
| **Materialism ↔ Purpose** | Wealth vs meaning |
| **Authority ↔ Egalitarianism** | Hierarchy vs fairness |

Values filter shame, pride, and willingness to violate Integrity for Ambition.

## 6.2 Motivations (Dynamic Drives)

Motivations are **short-to-medium term pressures** updated monthly:

| Motivation | Triggers |
|---|---|
| Financial survival | Low runway, debt stress |
| Status recognition | Peer success, media fame |
| Family obligation | Birth, illness, dynasty pressure |
| Revenge/proving | Betrayal, humiliation memory |
| Mastery | Skill plateau desire |
| Escape | Burnout, bad marriage |

## 6.3 Dreams & Long-Term Goals

Per Constitution, citizens possess **dreams**—aspirations across life:

| Dream Type | Examples |
|---|---|
| Wealth | Billionaire, comfortable retirement |
| Family | Large dynasty, devoted parent |
| Fame | Celebrity, industry titan |
| Mastery | Best surgeon, top engineer |
| Freedom | Early retirement, nomad |
| Service | Mayor, nonprofit leader |

**1–3 active dreams** per T0/T1 citizen. Dreams weight decision utilities. Dreams can **die** (achieved, abandoned, impossible) and **birth** (mid-life reinvention).

---

# 7. Habits & Emotional State

## 7.1 Habits

**Habits** form when behaviours repeat under similar cues (≥3 times in 6 months):

| Habit Category | Examples | Effect |
|---|---|---|
| Productivity | Early rising, deep-work blocks | Performance modifier |
| Health | Gym, meal prep | Health awareness boost |
| Financial | Auto-save, budget review | Discipline assist |
| Social | Weekly networking | Sociability maintenance |
| Risk | Weekly trading, gambling | Risk normalization |
| Coping | Alcohol, overwork | Stress relief + health cost |

Habits reduce decision compute (default action) but can be **broken** by life shocks.

## 7.2 Emotional State (Short-Term)

| Variable | Range | Decay |
|---|---|---|
| **Mood** | −50 to +50 | Daily toward 0 |
| **Stress** | 0–100 | Daily recovery (trait-modified) |
| **Energy** | 0–100 | Daily sleep/work cycle |
| **Grief** | 0–100 | Months (resilience-modified) |
| **Euphoria** | 0–100 | Weeks after major win |

Emotional state **temporarily shifts** expressed trait weights (e.g., high stress reduces Patience and Integrity).

---

# 8. Personality Evolution

Expressed traits drift through **Experience Events** that apply `TraitDelta` packets. Baseline temperament adjusts **10–20%** of any permanent delta (the "you changed" effect).

## 8.1 Education

| Experience | Typical Trait Shifts |
|---|---|
| University completion | +Learning speed (small), +Confidence, +Curiosity |
| Elite institution | +Confidence, +Ambition; risk of −Empathy (bubble) |
| Trade/vocational | +Discipline, +Financial discipline |
| Bullying / failure | −Confidence, −Sociability; +Resilience if overcome |
| Humanities | +Empathy, +Creativity |
| STEM | +Discipline, +Learning speed |

## 8.2 Family

| Experience | Typical Trait Shifts |
|---|---|
| Supportive childhood | +Optimism, +Confidence, +Emotional resilience |
| Neglect / abuse | −Trust proxies (−Empathy or −Sociability), −Resilience; trauma memories |
| Wealthy upbringing | +Confidence; −Financial discipline risk |
| Poverty | +Adaptability, +Ambition or −Optimism |
| Sibling rivalry | +Ambition or −Confidence |

## 8.3 Friends & Peers

| Experience | Typical Trait Shifts |
|---|---|
| Ambitious peer group | +Ambition, +Risk tolerance |
| Stable friendships | +Emotional resilience, +Integrity |
| Toxic friends | −Integrity, −Financial discipline |
| Mentorship | Targeted trait boost (+Leadership, +Discipline) |
| Betrayal | −Sociability, −Optimism; +Adaptability |

## 8.4 Career

| Experience | Typical Trait Shifts |
|---|---|
| Promotion | +Confidence, +Ambition |
| Layoff | −Confidence; +Adaptability or −Risk tolerance |
| Toxic workplace | −Integrity, −Empathy, −Health awareness |
| Entrepreneurial win | +Entrepreneurial instinct, +Risk tolerance |
| Burnout | −Ambition, −Discipline, −Health awareness |

## 8.5 Marriage & Partnership

| Experience | Typical Trait Shifts |
|---|---|
| Loving marriage | +Emotional resilience, +Financial discipline |
| Conflict marriage | −Patience, −Optimism |
| Wealthy spouse | Lifestyle pressure on Financial discipline |
| Divorce | −Optimism, −Confidence; memory formation |
| Widowhood | Grief state; long-term −Sociability possible |

## 8.6 Parenthood

| Experience | Typical Trait Shifts |
|---|---|
| New parent | +Empathy, +Health awareness; −Risk tolerance (mild) |
| Struggling parent | +Adaptability; −Optimism |
| Proud parent | +Integrity (role model), +Ambition (provider) |
| Absent parent guilt | −Confidence, memory weight |

## 8.7 Trauma

| Experience | Typical Trait Shifts |
|---|---|
| Bankruptcy | Bimodal: +Risk desperation OR −Risk tolerance |
| Accident / health crisis | +Health awareness; −Optimism short-term |
| Crime victim | −Sociability; +Emotional resilience if recovered |
| War/economic collapse | +Adaptability, −Optimism |
| Public scandal | −Confidence, −Sociability |

Trauma always creates **strong negative memory** with long decay half-life.

## 8.8 Success

| Experience | Typical Trait Shifts |
|---|---|
| Windfall | −Financial discipline risk, +Confidence |
| IPO / exit | +Ambition, +Sociability, +Risk tolerance |
| Award / fame | +Confidence; −Empathy risk (entourage) |
| Championship | +Discipline, +Confidence |

## 8.9 Failure

| Experience | Typical Trait Shifts |
|---|---|
| Failed startup | +Adaptability OR −Entrepreneurial instinct |
| Rejected promotion | −Confidence (temporary) |
| Investment loss | −Risk tolerance if Patience low |
| Public humiliation | −Confidence, −Sociability |

## 8.10 Financial Hardship

| Experience | Typical Trait Shifts |
|---|---|
| Chronic debt | −Optimism, −Integrity risk (desperation) |
| Recovery from debt | +Financial discipline, +Patience |
| Generational poverty escape | +Ambition, +Discipline |

## 8.11 Fame

| Experience | Typical Trait Shifts |
|---|---|
| Rising fame | +Confidence, +Sociability |
| Sustained celebrity | −Integrity risk, −Empathy risk |
| Cancelled / fallen | −Confidence, +Emotional resilience or collapse |

## 8.12 Aging

| Life Stage | Typical Drift |
|---|---|
| **Young adult (18–30)** | Traits plastic; identity formation |
| **Mid-life (30–50)** | Specialization; slight ↓ Risk, ↑ Patience |
| **Late career (50–65)** | ↑ Leadership (wisdom), ↓ Learning speed (mild) |
| **Elder (65+)** | ↓ Ambition (optional), ↑ Patience; health traits dominate |

**Plasticity rule:** Trait deltas before 25 are **1.5×**; after 55 are **0.5×**.

---

# 9. Memory System

## 9.1 Design Principles

| Principle | Meaning |
|---|---|
| **Memories are scarce** | T0/T1 cap: 15 active, 50 archived |
| **Memories bias decisions** | Not hard overrides |
| **Memories fade** | Emotional weight decays; facts may archive to timeline |
| **Memories are causal** | Link to `source_event_id` |
| **Public vs private** | Reputation is social memory; personal memory is internal |

## 9.2 Memory Structure

| Field | Purpose |
|---|---|
| `memoryId` | Stable ID |
| `type` | Positive, negative, relational, business, public |
| `emotionalValence` | −100 to +100 |
| `salience` | 0–100 (initial impact) |
| `currentWeight` | Decays over time |
| `halfLifeMonths` | Fade speed (resilience-modified) |
| `participants` | Other citizen/company IDs |
| `tags` | `betrayal`, `mentorship`, `bankruptcy`, `wedding`, etc. |
| `sourceEventId` | World Memory link |
| `traitImprint` | Optional permanent micro-delta |

## 9.3 Positive Memories

| Type | Examples | Effects |
|---|---|---|
| **Achievement** | Graduation, promotion, exit | +Confidence utility on similar actions |
| **Bonding** | Wedding, reconciliation | +Trust toward participant |
| **Windfall** | Inheritance, lottery (taxed) | Risk tolerance modifier |
| **Mentorship** | Great boss, teacher | Skill gain boost in domain |

## 9.4 Negative Memories

| Type | Examples | Effects |
|---|---|---|
| **Betrayal** | Partner affair, business fraud | −Trust; avoidance of similar partners |
| **Failure** | Bankrupt, fired | Hesitation in same industry |
| **Loss** | Death, disaster | Grief state; health awareness |
| **Humiliation** | Media scandal | Sociability reduction in public contexts |

## 9.5 Forgotten Memories

Memories below `weightThreshold` (default 5):

- Move to **archived** (biography/timeline only)
- Stop affecting decisions
- May resurface if triggered (meeting ex-partner, returning to city)

**Therapy / time / success** accelerate fade of negative memories (resilience-gated).

## 9.6 Relationship Memories

Bidirectional edges store **relationship memory summary**:

- First meeting context
- Peak positive/negative moment
- Last interaction tone

Feeds Family and Relationship engines for reconciliation or estrangement.

## 9.7 Business Memories

| Type | Examples |
|---|---|
| First job | Career identity anchor |
| Founded company | Entrepreneurial identity |
| Betrayed by partner | Partnership trust |
| IPO day | Peak financial memory |
| Layoff | Employer distrust |

## 9.8 Public Reputation (Social Memory)

**Reputation** is what others believe—distinct from private memory:

| Layer | Scope |
|---|---|
| Industry reputation | Professional trust |
| Community reputation | Local standing |
| Media narrative | Public figure distortion |

High Integrity + scandal = slower reputation recovery. Low Integrity + success = "controversial genius" arc.

## 9.9 Long-Term Consequences

Memories can trigger **latent behaviours** years later:

- Father's bankruptcy → son avoids debt but may overcorrect into risk aversion
- Mentor memory → citizen mentors others (pay-it-forward utility boost)
- Rival memory → competitive sabotage when paths cross

---

# 10. Decision-Making Model

## 10.1 Utility Function (Conceptual)

For decision class `D` with options `O`:

```
U(citizen, O) = Σ (traitWeight_i × trait_i × optionScore_i)
              + Σ (memoryWeight_m × memoryMatch_m)
              + Σ (goalWeight_g × goalAlignment_g)
              + macroContext
              + emotionalModifier
              + noise(citizenId, date, D)
```

**Hard filters** remove illegal, unaffordable, or physically impossible options first.

## 10.2 Decision Classes

### Careers (Education & Field Choice)

| Input | Weight Source |
|---|---|
| Curiosity, Learning speed | Field interest fit |
| Ambition | Prestige/career ceiling |
| Risk tolerance | Entrepreneurial vs safe paths |
| Family values | Expected career pressure |
| Macro | Hiring demand by sector |

### Partners (Romance & Marriage)

| Input | Weight Source |
|---|---|
| Empathy, Sociability | Compatibility |
| Integrity | Trust requirements |
| Ambition | Power-couple vs nurturing |
| Memories | Past relationship tags |
| Family | Dynasty approval, class |

### Jobs (Offers & Quitting)

| Input | Weight Source |
|---|---|
| Ambition, Confidence | Title/salary pursuit |
| Patience | Long-term vs quick jump |
| Memories | Employer trust history |
| Commute, health | Practical constraints |
| Stress | Burnout quit threshold |

### Investments

| Input | Weight Source |
|---|---|
| Risk tolerance, Patience | Asset class fit |
| Financial discipline | Leverage limits |
| Optimism | Bubble participation |
| Memories | Past loss aversion |
| Macro | Cycle awareness (bounded) |

### Purchases (Housing, Consumer)

| Input | Weight Source |
|---|---|
| Financial discipline | Budget adherence |
| Sociability | Status purchases |
| Health awareness | Health spending |
| Family size | Housing needs |

### Friendships

| Input | Weight Source |
|---|---|
| Sociability | Initiation rate |
| Empathy | Depth maintenance |
| Integrity | Loyalty under pressure |
| Shared memories | Bond reinforcement |

### Companies (Founding & Strategy)

| Input | Weight Source |
|---|---|
| Entrepreneurial instinct | Found vs buy |
| Risk tolerance | Market entry timing |
| Creativity | Differentiation |
| Leadership | Team building |
| Memories | Past founder trauma |

### Education (Continue vs Enter Workforce)

| Input | Weight Source |
|---|---|
| Learning speed | ROI perception |
| Patience | Delayed gratification |
| Financial pressure | Debt fear |
| Family expectations | Values filter |
| Dreams | Mastery goals |

### Risk (General)

Risk decisions compute **perceived** downside × **trait-modulated** fear + **memory** of past losses—not actuarial perfection.

### Entrepreneurship

Composite of Entrepreneurial instinct, Risk tolerance, Confidence, Ambition—gated by Financial discipline (runway check) and macro conditions.

## 10.3 Player vs AI

| Aspect | Player | AI |
|---|---|---|
| Formula | Identical | Identical |
| Option presentation | UI clarity | Internal option set |
| Noise magnitude | Same | Same |
| Command issuance | Player click | Autonomous when uncontrolled |

Player **cannot** see utility scores in base game (optional advanced mode for education).

---

# 11. Family Inheritance

## 11.1 Non-Deterministic Inheritance Principle

> **Children should surprise the player while remaining believable.**

No child is a clone. No child is random noise. Inheritance is **partial, noisy, and environment-dominated**.

## 11.2 Inheritance Components

| Component | Heritability | Volatility |
|---|---|---|
| **Genetics (genotype seed)** | ~30–40% trait prior | Fixed at conception |
| **Family values** | Strong childhood influence | Ages 0–18 |
| **Upbringing quality** | Stress, wealth, attention | Event-driven |
| **Culture / region pack** | Naming, norms, education pressure | Static per world |
| **Education exposure** | School choice, peers | Player-influencable for heirs |
| **Environment (city, era)** | Macro, district character | Continuous |

**Effective formula (conceptual):**

```
childTraitPrior = 0.35 × geneticPrior
                + 0.25 × parentExpressedAverage
                + 0.20 × familyValuesVector
                + 0.20 × cultureBaseline
                + noise(±8)
```

Then childhood experiences dominate until age 18.

## 11.3 Genetics vs Expression

| Layer | What's Inherited |
|---|---|
| **Genotype** | Seeded correlations; health predispositions; learning priors |
| **Not inherited directly** | Wealth (except estate), reputation (partial dynasty), memories |
| **Epigenetic hooks (expansion)** | Trauma markers weakly affect next generation resilience |

## 11.4 Family Values Transmission

Families have `FamilyValuesVector` (security, tradition, ambition emphasis):

- High-pressure dynasty → child +Ambition, −Optimism risk
- Nurturing family → +Empathy, +Resilience
- **Rebellion mechanic:** high conformity pressure → teen Adaptability spike away from family values

## 11.5 Sibling Variance

Siblings share genetics partially but receive:

- Independent noise vectors
- Birth-order effects (firstborn +Responsibility proxy; later +Risk tolerance mild)
- Different peer groups

## 11.6 Player Heir Gameplay

When player succeeds to heir:

- Full CDPS profile visible
- Player guides via education, parenting time, financial environment
- **Cannot** assign trait points at birth
- Can shape through **experience**, not stat editing

---

# 12. Tier Representation & Performance

| Tier | CDPS Representation |
|---|---|
| **T0** | Full FTM-18, values, goals, memories, habits, emotional state |
| **T1** | Full CDPS; 3–15 seed memories; active decision autonomy |
| **T2** | `lifeVector`: 6–8 dominant traits + 1 dream + 2 memory tags; utility simplified |
| **T3** | Population trait distributions only; no individual decisions |

**Promotion T2→T1:** Materialize full profile from `promotionSeed` + lifeVector + synthetic history (WGS algorithm).

**Daily CDPS budget (T0+T1):** < 2ms combined (FSF Citizen Engine target).

---

# 13. Integration with FSF

## 13.1 Engine Consumption

| Engine | CDPS Usage |
|---|---|
| **Citizen** | Owner; trait drift, memory, emotional state |
| **Career** | Job utility, burnout, performance variance |
| **Family** | Partner matching, parenting, inheritance values |
| **Education** | Field choice, completion probability |
| **Company** | NPC founder/CEO strategy; culture fit hiring |
| **Banking** | Credit behaviour; fraud risk (Integrity-gated) |
| **Investment** | Portfolio risk; panic sell |
| **Healthcare** | Preventive uptake; stress illness |
| **Media** | Scandal vulnerability; fame effects |

## 13.2 Events Published

| Event | Trigger |
|---|---|
| `citizen.trait_changed` | Expressed trait crosses band or delta > threshold |
| `citizen.memory_formed` | Salience > threshold |
| `citizen.memory_faded` | Archived |
| `citizen.goal_changed` | Dream achieved/abandoned |
| `citizen.stress_threshold_crossed` | Burnout, breakdown |
| `citizen.habit_formed` / `citizen.habit_broken` | Habit lifecycle |

## 13.3 Events Consumed

All milestone life events from Education, Career, Family, Banking, Healthcare, Media feed CDPS evolution and memory formation.

---

# 14. Governance & Ethics

## 14.1 Constitutional Compliance

| Rule | CDPS Enforcement |
|---|---|
| Citizen Equality | Same formulas for player and AI |
| No engagement exploitation | Traits don't force microtransaction triggers |
| Ethical modelling | Unethical paths modeled with full cost; not glamorized |
| Human Capital scarcity | Traits cap skill throughput; can't max everything |

## 14.2 Sensitive Content

Trauma, abuse, and mental health use **abstracted mechanics** with content settings:

- Memory formation without graphic depiction
- Recovery paths always exist (resilience, therapy hooks)
- Accessibility: optional reduce negative memory salience

## 14.3 QA Personas

| Persona ID | Trait Signature | Test Scenario |
|---|---|---|
| `CDPS-FOUNDER` | High EI, RT, Ambition | Startup under recession |
| `CDPS-STOIC` | High Discipline, Patience, FD | Debt recovery |
| `CDPS-BURNOUT` | High Ambition, low Health awareness | Mid-career collapse |
| `CDPS-HEIR` | Dynasty child rebellion | Generational play |

## 14.4 Document Map

| Question | Document |
|---|---|
| Who owns citizen psychology? | **CDPS (this document)** |
| How do citizens act in the world? | FSF engines + CDPS utilities |
| How are citizens born? | WGS + §11 Family Inheritance |
| How is it stored? | Database Design `CitizenProfile` |

## 14.5 Closing Declaration

The Citizen DNA & Personality System exists so that every face in Fenix Life hides a **mind with history**—capable of growth, contradiction, surprise, and regret.

Citizens are not dice rolls with portraits. They are **biased, remembering, evolving agents** who win, fail, love, betray, rebuild, and pass something of themselves forward.

DNA whispers. Experience shouts. Character is the argument between them.

---

*End of Fenix Life Citizen DNA & Personality System v1.0*
