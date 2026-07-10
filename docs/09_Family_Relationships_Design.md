# Fenix Life — Family & Relationships Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Family & Relationships Domain Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Social/Legacy Design Lead  
**Audience:** Game Design, Engineering, Content, QA, Live Ops, UX  

---

## Document Authority

The Family & Relationships Design document defines **how players experience dating, partnership, marriage, divorce, children, parenting, relationship meters, family events, inheritance, and dynasty play** as gameplay, UI flows, consequences, and content requirements. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) | Family Philosophy §13, Legacy pillar |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) | Five Capitals, Citizen Equality, Legacy Philosophy |
| [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) (16) | Traits, genetics, family inheritance, values |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) (14) | Family Engine §4.3 boundaries |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) (04) | `Family`, `Relationship`, `MarriageRecord`, `InheritancePlan` |
| [20_Citizen_AI.md](./20_Citizen_AI.md) | Life course AI, partnership utility |
| [22_History_Engine.md](./22_History_Engine.md) | Biographies, dynasty timeline |
| [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | `/family` screen zones |
| [08_Education_Design.md](./08_Education_Design.md) | Parent-funded child education |
| [10_Real_Estate_Housing_Design.md](./10_Real_Estate_Housing_Design.md) | Household formation, marital property |

When family design conflicts with Citizen Equality, **player and AI citizens face identical relationship physics, marriage law, and inheritance rules**—no hidden romance boosts or rigged divorce outcomes.

**What this document is:**

- The **complete player-facing family and relationship gameplay spec**
- Relationship meter model, partnership lifecycle, and parenting systems
- Inheritance and succession from the **player's perspective**
- Dynasty reputation and multi-generational play design
- Acceptance criteria for Family Engine MVP and `/family` screen wiring

**What this document is not:**

- Banking ledger and trust accounting implementation (Document 11 planned)
- Tax estate calculation formulas (Document 13 planned)
- Legal engine procedural code (Government Engine — FSF §4.10)
- Multiplayer privacy implementation (Document 24 — references only)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Relationship Model Overview](#3-relationship-model-overview)
4. [Relationship Meters](#4-relationship-meters)
5. [Dating & Courtship](#5-dating--courtship)
6. [Cohabitation & Partnership](#6-cohabitation--partnership)
7. [Marriage & Legal Union](#7-marriage--legal-union)
8. [Prenuptial Agreements & Asset Regimes](#8-prenuptial-agreements--asset-regimes)
9. [Divorce & Separation](#9-divorce--separation)
10. [Children — Conception to Adulthood](#10-children--conception-to-adulthood)
11. [Parenting Styles & Consequences](#11-parenting-styles--consequences)
12. [Extended Family & Household](#12-extended-family--household)
13. [Family Events & Rituals](#13-family-events--rituals)
14. [Household Economics](#14-household-economics)
15. [Inheritance & Estate Planning](#15-inheritance--estate-planning)
16. [Dynasty Play & Succession](#16-dynasty-play--succession)
17. [Family Reputation & Legacy](#17-family-reputation--legacy)
18. [Dark Realism & Player Agency](#18-dark-realism--player-agency)
19. [Player Flows & Decision Points](#19-player-flows--decision-points)
20. [Family Screen (`/family`)](#20-family-screen-family)
21. [Notifications & Diegetic Feedback](#21-notifications--diegetic-feedback)
22. [AI Citizen Family Parity](#22-ai-citizen-family-parity)
23. [Events & Timeline Integration](#23-events--timeline-integration)
24. [Content Requirements](#24-content-requirements)
25. [Mod & Cultural Variation Hooks](#25-mod--cultural-variation-hooks)
26. [Balance & Tuning Parameters](#26-balance--tuning-parameters)
27. [Acceptance Criteria](#27-acceptance-criteria)
28. [Appendices](#28-appendices)

---

# 1. Executive Summary

Family in Fenix Life is **a parallel wealth and meaning system**. Love, obligation, genetics, conflict, and inheritance shape gameplay as profoundly as any balance sheet. Relationships are bidirectional meters with history; dynasty play extends consequences across generations.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              FAMILY & RELATIONSHIPS — PLAYER ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER              PLAYER EXPERIENCE              CAPITALS                  │
│  ─────              ─────────────────              ────────                  │
│  Dating             Meet, date, commit             Social                    │
│  Partnership        Cohabitation, dual income      Social, Financial         │
│  Marriage           Legal union, regimes           Social, Legacy            │
│  Parenting          Raise heirs, fund education    Social, Legacy, Human     │
│  Inheritance        Wills, disputes, succession    Legacy, Financial         │
│  Dynasty            Multi-gen reputation           Legacy                    │
│                                                                              │
│         ┌──────────────────────────────────────────────────┐                │
│         │                 /family Screen                    │                │
│         │  Tree │ Members │ Actions │ Legacy Preview       │                │
│         └──────────────────────────┬───────────────────────┘                │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         ▼                          ▼                          ▼             │
│    CDPS (traits/values)    Banking/Tax (assets)      History/Timeline       │
│    Education (child ed)    Company (nepotism)        Legacy Engine          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core design outcomes:**

| Outcome | Mechanism |
|---|---|
| **Emotional + economic stakes** | Divorce splits assets; neglect erodes succession eligibility |
| **Bidirectional relationships** | Partner's meters toward player matter, not just player's view |
| **Playable heirs** | Death or retirement → continue as chosen child |
| **Dynasty identity** | Family name reputation opens political and business doors |
| **Tasteful realism** | Infidelity, estrangement exist with agency and consequence |
| **Achievement parity** | Family path achievements equal business path prestige |

---

# 2. Philosophy & Constitutional Alignment

## 2.1 Social & Legacy Capitals

Per Constitution Article III:

| Capital | Family System Contribution |
|---|---|
| **Social** | Relationships, trust, network through family |
| **Legacy** | Dynasty reputation, generational wealth, heir continuity |
| **Financial** | Dual income, inheritance, divorce settlements |
| **Human** | Child development, genetics + nurture |

## 2.2 Citizen Equality

| Rule | Player | AI Citizen |
|---|---|---|
| Relationship meter drift formulas | Identical | Identical |
| Marriage eligibility (age, law) | Same | Same |
| Divorce asset split rules | Same | Same |
| Inheritance tax treatment | Same | Same |
| Child trait inheritance blend | Same genetics model | Same |
| Nepotism hiring penalties | Same if unqualified | Same |

**Forbidden:** Player-only romance success rates, AI-only perfect marriages, rigged inheritance to player heirs.

## 2.3 Living World Families

While the player sleeps:

- Partners maintain relationships (drift, conflict, reconciliation)
- Children age and develop
- Extended family may initiate contact events
- Estate plans execute on death
- AI dynasties rise and fall in same world

## 2.4 Product Bible Alignment (§13)

| Bible Principle | Design Implementation |
|---|---|
| Family parallel to economy | `/family` shows happiness AND household expenses |
| Bidirectional meters | Partner view accessible in member detail |
| Children as characters | Full citizens with CDPS profiles |
| Playable handoff | Succession choice at death/retirement |
| Dynasty systems | Family reputation meter separate from personal |
| Dark but tasteful | Mature themes with skip/support options where needed |
| Multiplayer privacy | Family data private by default (Network 24) |

## 2.5 Design Review Questions

1. Does this choice affect both Social and at least one other Capital?
2. Are both parties' meters and AI utility considered?
3. Does inheritance interact with Banking and Tax correctly?
4. Can neglect or conflict create emergent story without scripted cards?
5. Are family achievements comparable to business achievements?

---

# 3. Relationship Model Overview

## 3.1 Relationship Edge Types

| Type | Description | Legal Implications |
|---|---|---|
| `acquaintance` | Weak tie | None |
| `friend` | Platonic bond | Gift tax thresholds only |
| `romantic_interest` | Dating | None until cohabitation |
| `partner` | Committed relationship | Varies by jurisdiction |
| `spouse` | Married | Full marital property regime |
| `ex_spouse` | Post-divorce | Alimony, custody |
| `child` | Parent ↔ child | Custody, support |
| `parent` | Child ↔ parent | Inheritance, support |
| `sibling` | Shared parentage | Inheritance share |
| `extended` | Aunt, uncle, cousin | Cultural obligation events |

## 3.2 Relationship Lifecycle (Romantic)

```
Meet → Acquaintance → Dating → Committed → Cohabiting?
  → Proposal → Engagement → Marriage
  OR: Breakup at any stage
  OR: Divorce from marriage → Ex-spouse
```

## 3.3 Bidirectionality Requirement

Every romantic/family edge stores **two meter sets**:

- `metersAtoB`: how A feels about B
- `metersBtoA`: how B feels about A

Player UI defaults to **how others feel about player** and **how player feels about others** in paired display. Asymmetry drives conflict gameplay (one-sided love, resentment).

## 3.4 Relationship History

Significant interactions append to `InteractionLog` (immutable):

- First date, proposal, wedding, birth, betrayal, gift, argument, reconciliation
- Used by History Engine for biography chapters
- Influences memory weights in CDPS decision model

---

# 4. Relationship Meters

## 4.1 Core Meters (0–100)

| Meter | Meaning | Primary Drivers |
|---|---|---|
| **Trust** | Reliability belief | Honesty, financial stability, kept promises |
| **Romance** | Romantic attraction | Dates, gifts, fidelity, appearance, compatibility |
| **Respect** | Admiration | Achievement, integrity, parenting, career |
| **Conflict** | Active tension (high = bad) | Arguments, neglect, betrayal, competing goals |
| **Dependency** | Emotional/financial reliance | Support during crisis, imbalance |

## 4.2 Derived Scores (UI)

| Display | Formula (Conceptual) |
|---|---|
| **Relationship Health** | `(Trust + Romance + Respect) / 3 - Conflict` |
| **Family Happiness** (household) | Weighted avg of member pair health toward player |
| **Succession Bond** (parent-child) | `Trust × 0.4 + Respect × 0.4 + (100 - Conflict) × 0.2` |

## 4.3 Meter Drift (Passive)

Without interaction, meters drift monthly:

```
trustDrift = -0.5 + (integrityBonus) - (neglectPenalty)
romanceDrift = -1.0 + (sharedExperiences) - (routinePenalty)
conflictDrift = +0.3 if unresolvedArgumentFlag
```

CDPS traits modify drift (Patience slows conflict rise; Impulsivity accelerates fights).

## 4.4 Active Interactions

| Action | Trust | Romance | Respect | Conflict | Cost |
|---|---|---|---|---|---|
| Quality time date | +3 | +5 | +1 | −2 | Time, money |
| Thoughtful gift | +2 | +4 | +1 | −1 | Money |
| Honest conversation | +5 | +1 | +3 | −3 | Time |
| Neglect (no action) | −4 | −6 | −2 | +4 | — |
| Apology after fight | +4 | +1 | +2 | −5 | Ego (pride trait) |
| Financial support | +3 | +0 | +2 | −1 | Money |
| Public embarrassment | −8 | −4 | −10 | +12 | — |
| Infidelity (if discovered) | −40 | −30 | −20 | +50 | — |

## 4.5 Threshold Events

| Threshold | Event |
|---|---|
| Trust < 20 | "Considering leaving" partner AI event |
| Romance < 15 (married) | Dead bedroom narrative; divorce risk |
| Conflict > 75 | Explosive argument; temporary actions blocked |
| Trust > 85 + Romance > 80 | Proposal eligibility unlocked |
| Succession Bond < 30 | Heir refuses succession role |

---

# 5. Dating & Courtship

## 5.1 Meeting Partners

| Channel | Context | Success Modifier |
|---|---|---|
| Workplace | Colleague | Company policy may forbid |
| University | Classmate | Shared major bonus |
| Social event | Party, gala | Charisma trait |
| Dating app (phone) | Random pool | Volume, low initial trust |
| Introduction | Friend/family | +Trust start |
| Reconnect | Ex, childhood friend | Memory history |

## 5.2 Dating Gameplay Loop

```
Ask out → Date event → Meter updates → Repeat or escalate
  → Define relationship (exclusive) → Meet family optional
  → Cohabitation decision → Marriage path OR breakup
```

## 5.3 Date Types

| Date | Cost | Romance | Social Risk |
|---|---|---|---|
| Coffee | Low | +2 | Low |
| Dinner | Medium | +4 | Low |
| Concert / event | Medium–high | +5 | Medium |
| Weekend trip | High | +8 | Medium |
| Cheap/no effort | Minimal | +0 | Neglect if repeated |

## 5.4 Compatibility Factors (Hidden Aggregate → Player Hints)

| Factor | Source |
|---|---|
| Value alignment | CDPS Values vector cosine similarity |
| Life stage | Age, career ambition, desireForChild |
| Financial habits | Spending vs. saving traits |
| Family approval | Parent meters if traditional culture |

Player receives **qualitative hints** ("You disagree on having children") not exact scores—discovery through play.

## 5.5 Breakup (Pre-Marriage)

| Aspect | Rule |
|---|---|
| Initiator | Either party (player or AI proposal) |
| Asset split | Minimal unless shared lease/property |
| Meter aftermath | Trust crater; possible friendship recovery over years |
| Shared workplace | Awkwardness debuff temporary |
| Memory | `BetrayalRecord` if infidelity involved |

---

# 6. Cohabitation & Partnership

## 6.1 Moving In Together

| Decision | Consequence |
|---|---|
| Share lease / buy together | Housing cost split; title complexity on breakup |
| Keep separate residences | Lower romance drift reduction |
| Joint bank account (optional) | Convenience; divorce complexity |

## 6.2 Domestic Partnership (Jurisdiction-Dependent)

Some regions offer **registered partnership** with partial legal benefits without full marriage—content flag per country template.

## 6.3 Dual Income Household

```
householdIncome = incomeA + incomeB - childcare - sharedExpenses
```

Displayed on `/family` overview (matches prototype: "Household Expenses $6,500/mo").

## 6.4 Chore & Lifestyle Friction

Low micromanagement: quarterly **household harmony** check:

- Mismatch on cleanliness, spending, socializing → Conflict +
- Alignment → Trust +, Romance stable

Player resolves via conversation action or ignore (Conflict rises).

---

# 7. Marriage & Legal Union

## 7.1 Proposal Flow

| Step | Requirement |
|---|---|
| 1. Proposal action | Romance ≥ 75, Trust ≥ 70, both adults |
| 2. Partner response | AI utility evaluation; player partner chooses |
| 3. Engagement period | Optional 1–12 months; wedding planning events |
| 4. Ceremony | Cost tier; family attendance affects Social |
| 5. `family.married` event | Legal status; timeline; name change optional |

## 7.2 Wedding Tiers

| Tier | Cost | Social Capital | Family Relationship Boost |
|---|---|---|---|
| Courthouse | $500–$2K | Minimal | Small |
| Standard | $15K–$40K | Moderate | Moderate |
| Luxury | $100K–$500K+ | High | Large; media coverage if famous |

## 7.3 Name & Identity

| Choice | Effect |
|---|---|
| Player takes partner name | Dynasty name change if patrilineal setting |
| Partner takes player name | Family reputation attaches to player dynasty |
| Hyphenated | Both names in family tree |
| No change | Neutral |

## 7.4 Marital Status Flags

Unlocks:

- Joint tax filing (Tax Engine)
- Spousal health insurance
- Automatic inheritance default (without will)
- Immigration / visa hooks (expansion)

---

# 8. Prenuptial Agreements & Asset Regimes

## 8.1 Marriage Property Regimes

| Regime | Label | Divorce Split |
|---|---|---|
| Community property | Shared marital assets 50/50 | Equal split of marital pool |
| Separate property | Pre-marital stays separate | Each keeps own; marital divided |
| Prenuptial custom | Contract terms | Per agreement (within law) |

## 8.2 Prenup Negotiation (Player Flow)

```
Proposal accepted → Optional prenup prompt
  → Partner acceptance utility (trust, wealth gap, Integrity)
  → Terms: asset protection, alimony cap, business exclusion
  → Sign or waive → Marriage proceeds
```

## 8.3 Prenup Terms (Selectable Clauses)

| Clause | Protects | Partner Acceptance Penalty |
|---|---|---|
| Business equity separate | Founder's company | High if partner sacrificed career |
| Inheritance separate | Family wealth | Medium |
| Alimony cap | High earner | High if income gap |
| Infidelity penalty | Monogamy expectation | Depends on values |

## 8.4 Gameplay Purpose

Teach **financial planning before emotional commitment**—aligned with Product Bible financial literacy pillar.

---

# 9. Divorce & Separation

## 9.1 Grounds & Initiation

| Path | Trigger |
|---|---|
| Player initiates | `/family` → Divorce (destructive confirm) |
| Partner initiates | AI utility: Conflict high, Trust low, alternative partner |
| Mutual | Negotiated amicable; lower legal fees |

## 9.2 Divorce Process Phases

```
File → Automatic temporary orders (support, residence)
  → Asset inventory snapshot
  → Negotiation OR litigation
  → Settlement → `family.divorced`
  → Meter states → ex_spouse; custody active if children
```

## 9.3 Asset Division

| Asset Type | Typical Treatment |
|---|---|
| Marital home | Sell and split OR buyout OR defer (custody) |
| Retirement accounts | Split per regime |
| Business equity | Valuation fight; prenup may exclude |
| Debt | Marital debt shared |
| Gifts/inheritance during marriage | Regime-dependent |

## 9.4 Alimony & Child Support

```
childSupport = f(custodySplit, incomes, childNeeds, jurisdictionTable)
alimony = f(marriageDuration, incomeGap, prenup, careerSacrifice)
```

Player sees **monthly obligation** before confirming settlement.

## 9.5 Custody Models

| Model | Gameplay |
|---|---|
| Joint | Both parents interact; child bond maintained |
| Primary to player | Partner visitation events |
| Primary to ex | Reduced child interaction; support payments |
| Shared 50/50 | Alternating household (housing implication) |

## 9.6 Relationship Aftermath

- Meters reset to hostile baseline toward ex unless amicable
- Children: Conflict may rise; **co-parenting** actions reduce
- Media scandal if public figure
- Achievement: "Clean Break" vs. "War of Roses"

---

# 10. Children — Conception to Adulthood

## 10.1 Having Children

| Path | Requirement |
|---|---|
| Biological | Partner relationship; `desireForChild` alignment; fertility age window |
| Adoption | Application; home study analog; fees |
| Surrogacy | Expansion; legal jurisdiction |
| Step-child | Marriage to partner with existing children |

## 10.2 Pregnancy & Birth (Abstracted)

- Pregnancy: 9-month term; health events possible
- Birth creates new `Citizen` with `FamilyMembership`
- `family.child_born` event; Timeline; happiness spike

## 10.3 Child as Full Citizen

Each child has:

- CDPS genotype (blended from parents per §16 CDPS)
- Baseline temperament emerging age 6–8
- Skills, education enrollment, relationship meters to each parent
- Tier assignment (T0 if heir candidate; T1 if named in story)

## 10.4 Aging Stages (Player Interaction Density)

| Age | Player Focus |
|---|---|
| 0–5 | Nurture, childcare cost, sleep deprivation (stress) |
| 6–11 | School quality, extracurricular funding |
| 12–17 | Relationship building, discipline, college planning |
| 18+ | Adult relationship; succession candidate |
| Any | Neglect → meter collapse; estrangement path |

## 10.5 Favoritism Detection

System tracks **spend + time + gift asymmetry** between siblings:

- Estranged sibling events
- Inheritance dispute probability ↑
- Dynasty reputation: "Unfair" tag if public

---

# 11. Parenting Styles & Consequences

## 11.1 Parenting Actions

| Style / Action | Child Effect | Trait Drift |
|---|---|---|
| Supportive | +Trust, +Happiness | +Empathy, +Resilience |
| Authoritarian | +Discipline skill, −Trust | +Discipline, −Adaptability |
| Permissive | +Happiness short-term | −Discipline |
| Neglectful | −All meters | +Conflict, risk behaviors |
| Tiger (high pressure) | +GPA, +Stress | +Ambition, −Resilience |
| Mentor | +Career readiness | +Leadership |

## 11.2 Genetics vs. Nurture (CDPS)

```
childTraitPrior = 0.35 × geneticPrior + 0.45 × parentingVector + 0.20 × familyValues
```

Non-deterministic: rebel mechanic against high conformity pressure.

## 11.3 Major Parenting Events

| Event | Player Choice | Long-term |
|---|---|---|
| Child bullied | Intervene / teach coping / ignore | Trust, Resilience |
| Teen rebellion | Punish / negotiate / support | Relationship arc |
| College funding | Full / partial / none | Debt, Trust, Education 08 |
| Career pressure | Push family business / support passion | Succession willingness |
| Coming out / identity | Support / reject | Permanent meter impact |

---

# 12. Extended Family & Household

## 12.1 Household Unit

`Household` aggregates cohabiting citizens for:

- Shared expense budget
- Housing assignment (one primary residence)
- Tax filing unit

## 12.2 Extended Family Gameplay

| Relative | Typical Interaction |
|---|---|
| Parents (player's) | Elder care costs; inheritance expectation |
| Siblings | Rivalry, business partnership, loan requests |
| In-laws | Approval meters; holiday events |
| Cousins | Weak ties; occasional networking |
| Grandchildren | Legacy joy; dynasty continuation |

## 12.3 Cultural Obligation Events

Region templates may trigger:

- Expected financial support to parents
- Arranged introduction (not forced marriage—player always chooses)
- Multi-generational housing pressure

## 12.4 Estrangement

Prolonged Conflict > 80 + Trust < 15:

- Contact ceases except legal (inheritance)
- Reconciliation possible via extended quest-like effort chain
- Obituary may note estrangement (History Engine)

---

# 13. Family Events & Rituals

## 13.1 Calendar Events

| Event | Frequency | Gameplay |
|---|---|---|
| Birthday | Annual per member | Gift, party tier, meter boost |
| Anniversary | Annual (couple) | Date quality affects Romance |
| Holidays | Seasonal | Family gathering; conflict risk |
| Graduation | Once per child | Attendance matters (Education 08) |
| Wedding (family) | Occasional | Network expansion |
| Funeral | On death | Grief; inheritance trigger |
| Reunion | Player-initiated | Cost; relationship repair |

## 13.2 Event Planning (Player)

From member card → **Plan Event**:

- Select type, budget, attendees
- Success: meter boosts scaled by spend + Charisma
- Failure: no-show, argument → Conflict +

## 13.3 Upcoming Events Panel

Matches UI prototype pattern:

- "Emma's Birthday — July 25"
- Reminder notifications 7 days / 1 day prior
- Ignored birthday → Romance/Trust penalty

---

# 14. Household Economics

## 14.1 Expense Categories

| Category | Notes |
|---|---|
| Housing | Rent/mortgage (Doc 10) |
| Utilities | Scale with property |
| Food | Household size |
| Childcare | Age 0–12 |
| Education | Tuition, tutors (Doc 08) |
| Healthcare | Insurance premiums |
| Discretionary | Gifts, events, travel |

## 14.2 Income Pooling

| Mode | Rule |
|---|---|
| Fully pooled | One budget; transparency |
| Split bills | Fixed shares |
| Separate finances | Lower trust drift penalty if agreed |

## 14.3 Financial Secrets

Hidden debt or secret account:

- Discovery event on audit, divorce, or random
- Trust −50; possible divorce initiation

## 14.4 Life Insurance

| Type | Purpose |
|---|---|
| Term | Payout on death; beneficiary selection |
| Whole life | Investment component; estate planning |

Cross-reference Banking/Insurance (Document 11 planned).

---

# 15. Inheritance & Estate Planning

## 15.1 Default Intestate Rules

If no will at death, jurisdiction table applies:

- Spouse + children: split per law
- No spouse: children equal
- No heirs: escheat to government (extreme edge case event)

## 15.2 Will & Trust (Player Tools)

| Instrument | Player Control | Effect |
|---|---|---|
| Simple will | Beneficiary % per asset class | Executed on death |
| Trust | Delayed distribution; conditions | Tax optimization; child age gates |
| Family foundation | Philanthropy + dynasty prestige | Legacy Engine |
| Power of attorney | If incapacitated | Partner manages assets |

## 15.3 Inheritance Flow (Player Experience)

```
Death event → Estate opened notification
  → Inventory snapshot (read-only)
  → Probate period (time pass)
  → If will: distribution per plan
  → If dispute: negotiation / litigation mini-flow
  → Assets transfer; tax assessed
  → Heir selection if playable succession
```

## 15.4 Inheritance Disputes

| Cause | Resolution Path |
|---|---|
| Unequal splits | Sibling challenges will; Integrity + legal skill |
| Undue influence allegation | Court event |
| Hidden heir appears | Rare narrative event; DNA test analog |
| Business voting control | Equal splits → stalemate (Product Bible example) |

Player as heir may **accept, negotiate, or dispute**—CDPS Integrity and financial need influence AI siblings similarly.

## 15.5 Estate Tax (Player-Facing)

- Threshold per jurisdiction
- Exemption trusts teach planning
- Preview on `/family` Legacy tab: "Estimated tax at current net worth"

## 15.6 Inheritance & Company Control

Unequal share splits may leave player with **minority stake but no control**:

- Board conflict events
- Buyout offer from siblings
- Opportunity to purchase their shares

---

# 16. Dynasty Play & Succession

## 16.1 Playable Succession Triggers

| Trigger | Player Experience |
|---|---|
| Death | Obituary; heir choice screen |
| Voluntary retirement | Graceful handoff |
| Incapacitation | Rare; POA until recovery or death |
| Challenge mode | Start as adult heir mid-game (scenario) |

## 16.2 Heir Selection UI

Eligible heirs filtered by:

- Age ≥ 18 (configurable)
- Succession Bond ≥ threshold OR designated in will
- Alive and mentally capable

Display per heir:

- Age, traits summary, relationship to deceased
- Starting assets inherited
- Career/education status
- **Dynasty continuity preview**

## 16.3 Handoff Consequences

| Aspect | Behavior |
|---|---|
| Timeline | Prior life collapses to chapter summary |
| Assets | Transfer per inheritance |
| Relationships | Meters persist; grief modifiers |
| Company control | Per cap table inheritance |
| Player identity | New citizen; same save/world |
| Achievements | Dynasty-scoped stats accumulate |

## 16.4 Declined Succession

If no willing heir:

- NPC executor liquidates per will
- Game may offer **create distant cousin** or **end dynasty run**
- Legacy score still computed

## 16.5 Multi-Generation Goals

| Goal Type | Example |
|---|---|
| Dynasty wealth | $100M across 3 generations |
| Political dynasty | 3 mayors in family |
| Business dynasty | Same company 100 years |
| Philanthropic | Foundation endures 50 years |

Tracked in Legacy Engine; Hall of Legends eligibility.

---

# 17. Family Reputation & Legacy

## 17.1 Dynasty Reputation (0–100)

Separate from personal reputation:

| Source | Effect |
|---|---|
| Generational wealth | +prestige |
| Scandal (any member) | −prestige |
| Philanthropy | +prestige |
| Public service | +prestige |
| Infighting / lawsuits | −prestige |
| Longevity | +prestige per generation survived |

## 17.2 Reputation Doors

| Score Band | Unlocks |
|---|---|
| 80+ | Elite social invitations; political donor access |
| 60–79 | Business club membership |
| 40–59 | Neutral |
| 20–39 | Skepticism in media |
| <20 | "Fallen dynasty" narrative events |

## 17.3 Legacy Assets

| Asset | Description |
|---|---|
| Family home | Emotional + financial anchor |
| Crest / name | Cosmetic + NPC recognition |
| Family business | Multi-gen company |
| Foundation | Recurring philanthropy actions |
| Trust fund | Passive income for heirs |

## 17.4 Hall of Legends

Dynasty milestones feed History Engine 22:

- "The Chen Dynasty — 4 generations, $2.1B peak net worth"
- Diegetic hall UI; not raw leaderboard

---

# 18. Dark Realism & Player Agency

## 18.1 Mature Themes Policy

| Theme | Handling |
|---|---|
| Infidelity | Consequence-driven; not gratuitous scenes |
| Addiction (family member) | Support actions; treatment costs |
| Domestic conflict | Meter-based; no graphic violence |
| Death | Obituary; grief meters; always has UI support resource link in settings |
| Child neglect | Systemic consequences; not rewarded |

## 18.2 Player Opt-Outs (Accessibility)

- Reduce random negative family events frequency
- Skip courtship minigames (auto-resolve with summary)
- Content filters for infidelity storylines

Must not remove **economic consequences** of marriage/divorce/inheritance—only narrative intensity.

## 18.3 Agency Principle

No forced marriage, forced pregnancy, or forced heir. AI proposes; player decides.

---

# 19. Player Flows & Decision Points

## 19.1 Flow: Date to Marriage

| Step | Location | Decision |
|---|---|---|
| 1 | Phone / social | Meet candidate |
| 2 | Repeat dates | Invest time/money |
| 3 | `/family` or partner | Define relationship |
| 4 | Housing | Move in together? |
| 5 | Proposal | Ring tier; prenup? |
| 6 | Wedding | Ceremony tier |
| 7 | Timeline | `Married {name}` |

## 19.2 Flow: Have and Raise Child

| Step | Action |
|---|---|
| 1 | Discuss with partner (desire alignment) |
| 2 | Conceive / adopt |
| 3 | Birth event |
| 4 | Ongoing parenting actions + education funding |
| 5 | Age 18: succession candidate flag |

## 19.3 Flow: Estate Planning

| Step | Action |
|---|---|
| 1 | `/family` → Legacy → Create Will |
| 2 | Assign beneficiaries per asset |
| 3 | Optional trust setup (legal fee) |
| 4 | Review tax preview |
| 5 | Update after major life events (marriage, divorce, birth) |

## 19.4 Flow: Play as Heir

| Step | Action |
|---|---|
| 1 | Death/retirement event |
| 2 | Heir selection screen |
| 3 | Confirm inheritance summary |
| 4 | Load new citizen perspective |
| 5 | Dynasty overlay on timeline |

---

# 20. Family Screen (`/family`)

## 20.1 Primary Decision

**Invest in relationships or address conflict?**

## 20.2 Layout Zones (per UI 34 §5.11)

| Zone | Content | Maps to Prototype |
|---|---|---|
| **Tree** | Family graph, relationship strength edges | Future expansion |
| **Members** | Cards: name, role, age, happiness | ✅ Family member cards |
| **Actions** | Date, marry, children, divorce, gift, will | ✅ Gift / Plan Event buttons |
| **Legacy preview** | Inheritance estimate, dispute risk | Planned panel |

## 20.3 Header / Overview Metrics

| Metric | Prototype Reference |
|---|---|
| Family name | "The Chen Family" |
| Member count | "4" |
| Family happiness | "90%" (derived score) |
| Household expenses | "$6,500/mo" |

## 20.4 Member Card Detail

Tap member → sheet with:

- All meters (trust, romance, etc.) toward player
- Recent interactions
- Actions: Gift, Plan Event, Conversation, (romantic actions if applicable)
- Education link for children
- Career link for adults

## 20.5 Family Tree Visualization

- **V1:** List + generational grouping
- **V1.2:** Interactive graph with zoom
- Color edges by relationship health
- Deceased members greyed; click for biography link

## 20.6 Empty / Edge States

| State | CTA |
|---|---|
| Single, no children | "Explore dating" → Phone/social |
| Estranged family | "Attempt reconciliation" |
| Post-divorce | Co-parenting panel |
| Deceased player (spectator) | Heir selection (blocking) |

---

# 21. Notifications & Diegetic Feedback

| Event | Channel |
|---|---|
| Partner wants to talk | Phone P0 |
| Birthday reminder | Phone P1 |
| Divorce petition | Phone P0 + legal email |
| Child milestone | Timeline + banner |
| Inheritance dispute filed | Phone P0 |
| Succession available | Full-screen interstitial |
| Family scandal in news | News feed |

---

# 22. AI Citizen Family Parity

## 22.1 AI Partnership Formation

Same meeting channels; utility per Citizen AI 20:

```
U(partnership) = affinity + trust + financialStability + valuesMatch
               + memories + familyPressure + desireForChild + noise
```

## 22.2 AI Parenting

AI parents fund education, attend events stochastically based on traits (Integrity, Empathy).

## 22.3 AI Dynasty Competition

Rival NPC dynasties:

- Compete for same political offices
- May marry into player's family (alliance or conflict)

## 22.4 Nepotism

Player may hire family at company (Doc 19):

- If unqualified: morale −, scandal risk
- If qualified: legitimate dynasty advantage (earned)

---

# 23. Events & Timeline Integration

## 23.1 Domain Events

| Event | Player Impact |
|---|---|
| `family.married` | Legal union; tax; insurance |
| `family.divorced` | Settlement; meters |
| `family.child_born` | New citizen; expenses |
| `family.adoption_finalized` | Same as birth legally |
| `family.estate_opened` | Inheritance UI |
| `family.inheritance_disputed` | Litigation flow |
| `family.dynasty_reputation_changed` | Doors update |
| `relationship.partnered` | Pre-marriage milestone |

## 23.2 Timeline Capital Chips

- Social: weddings, reconciliations
- Legacy: dynasty milestones, inheritance
- Financial: divorce settlements, support obligations

---

# 24. Content Requirements

## 24.1 Launch Targets

| Content | Minimum |
|---|---|
| Wedding ceremony templates | 8 |
| Gift catalog items | 30 |
| Family event templates | 20 |
| Jurisdiction marriage regimes | 3 per country |
| Default intestate tables | 1 per country |
| Holiday calendar events | 12 |

## 24.2 Narrative Templates

Event Engine may trigger family-flavored personal events using templates—not scripted outcomes, parameterized by relationship state.

---

# 25. Mod & Cultural Variation Hooks

| Mod Surface | Example |
|---|---|
| `marriageAge` | Regional law |
| `inheritanceRules` | Primogeniture vs equal split |
| `obligationEvents` | Elder care expectations |
| `datingNorms` | App prevalence |

Per Mod Framework 27; must not violate Citizen Equality without explicit scenario tag.

---

# 26. Balance & Tuning Parameters

| Parameter | Default |
|---|---|
| `meterMonthlyDriftRomance` | −1.0 |
| `proposalMinRomance` | 75 |
| `proposalMinTrust` | 70 |
| `successionMinBond` | 40 |
| `favoritismThreshold` | 25% spend asymmetry |
| `divorceLegalFeeBase` | $5K indexed |
| `childSupportFormulaVersion` | v1 |
| `dynastyReputationDecay` | 0.5/mo without positive event |

---

# 27. Acceptance Criteria

## 27.1 Relationships

| ID | Criterion | Verification |
|---|---|---|
| FAM-AC-001 | Bidirectional meters stored and displayed for romantic relationships | Unit + UI |
| FAM-AC-002 | Date actions modify meters within documented ranges | Golden test |
| FAM-AC-003 | Neglect causes passive drift without player action | Time tick |
| FAM-AC-004 | AI partner accepts/rejects proposal via utility, not script | Symmetry |

## 27.2 Marriage & Divorce

| ID | Criterion | Verification |
|---|---|---|
| FAM-AC-010 | Marriage requires eligibility thresholds | E2E |
| FAM-AC-011 | Prenup terms affect divorce settlement | Integration |
| FAM-AC-012 | Divorce asset split respects property regime | Unit |
| FAM-AC-013 | Child support displays before settlement confirm | UX |
| FAM-AC-014 | Destructive confirm on divorce per UI 34 | UX |

## 27.3 Children & Parenting

| ID | Criterion | Verification |
|---|---|---|
| FAM-AC-020 | Birth creates citizen with blended CDPS prior | CDPS cross-test |
| FAM-AC-021 | Parenting actions affect child traits over time | Long sim |
| FAM-AC-022 | Favoritism triggers measurable sibling meter divergence | Simulation |
| FAM-AC-023 | Child age 18 can become succession candidate | Integration |

## 27.4 Inheritance & Dynasty

| ID | Criterion | Verification |
|---|---|---|
| FAM-AC-030 | Will execution distributes per beneficiary % | Integration |
| FAM-AC-031 | Intestate fallback uses jurisdiction table | Unit |
| FAM-AC-032 | Dispute flow available to player and AI heirs | Symmetry |
| FAM-AC-033 | Heir handoff preserves timeline chapter summary | E2E |
| FAM-AC-034 | Dynasty reputation updates on milestone events | Integration |

## 27.5 UI

| ID | Criterion | Verification |
|---|---|---|
| FAM-AC-040 | `/family` shows overview metrics matching UI 34 §5.11 | Visual QA |
| FAM-AC-041 | Member cards support Gift and Plan Event | E2E |
| FAM-AC-042 | Legacy preview shows inheritance estimate | UI |
| FAM-AC-043 | Upcoming events panel lists birthdays | UI |

## 27.6 Integration

| ID | Criterion | Verification |
|---|---|---|
| FAM-AC-050 | Marriage affects tax filing status hook | Tax stub |
| FAM-AC-051 | Child education funding links to Education 08 | Cross-doc |
| FAM-AC-052 | Household expenses include housing from Doc 10 | Cross-doc |
| FAM-AC-053 | Death triggers History biography update | History Engine |

---

# 28. Appendices

## Appendix A — Meter Starting Values (New Relationship)

| Source | Trust | Romance | Respect |
|---|---|---|---|
| Dating app | 25 | 40 | 20 |
| Friend introduction | 50 | 35 | 45 |
| Workplace (risky) | 35 | 45 | 50 |
| Reconnect ex | 30 | 50 | 40 |

## Appendix B — Dynasty Achievement Examples

| Achievement | Condition |
|---|---|
| "Generational Wealth" | Net worth increases 3 consecutive generations |
| "Self-Made Dynasty" | Zero inheritance; founder achieves threshold |
| "United Front" | No active disputes during estate settlement |
| "Fall and Rise" | Dynasty rep <20 then >80 later |

## Appendix C — Cross-Reference Index

| Topic | Doc |
|---|---|
| Genetics | 16 CDPS §11 |
| Education funding | 08 Education §16 |
| Housing household | 10 Real Estate §14 |
| UI layout | 34 §5.11 |
| Engine spec | FSF §4.3 |
| AI life course | 20 §16 |

---

*End of Document 09 — Family & Relationships Design v1.0*
