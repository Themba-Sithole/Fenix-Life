# Fenix Life — Game Design Document (GDD)

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Gameplay Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Creative Direction  
**Audience:** Game Design, Narrative, UX, Art, Audio, QA, Product, Community, Live Ops  

---

## Document Authority

This Game Design Document (GDD) is the **canonical translation** of the Fenix Life vision into mechanic-level, player-facing gameplay design. It sits in the documentation hierarchy as **Document 02** and defines *what players experience*, *how systems feel*, and *what success means*—not how engineers implement them.

| Hierarchy | Document | Role |
|---|---|---|
| **00** | [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Vision, pillars, philosophy, audience |
| **01** | [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Immutable design law — Citizen Equality, Living World, Five Capitals |
| **02** | **This document** | Mechanic-level gameplay design, loops, flows, acceptance criteria |
| **05–13** | Domain Design Specs (companion) | Deep dives per domain — economy, business, career, etc. |
| **14–24** | Simulation & Engine Specs | Technical simulation contracts — referenced, not duplicated |
| **34** | [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | Screen layout, navigation, interaction standards |

**When conflicts arise:**

1. Align with **01 Design Constitution** (non-negotiable).
2. Align with **00 Product Bible** (vision and pillars).
3. Resolve within **02 GDD** or escalate to formal amendment.

**What this document is:**

- The **player experience blueprint** for Fenix Life v1.0 Early Access and beyond
- The **mechanic vocabulary** designers, UX, and QA share when shipping features
- The **acceptance criteria authority** for major gameplay systems

**What this document is not:**

- An engineering specification (see 03 TDD, 14 FSF, 17–24 engine docs)
- A database schema (see 04 DDD)
- A feature backlog (see 38_Backlog.md)
- Marketing copy or a tutorial script

**Amendment rule:** GDD changes that alter constitutional principles require Constitution amendment. GDD changes that alter vision require Product Bible amendment. All other GDD changes are versioned here (minor: clarifications; major: new mechanics or scope shifts).

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Game Overview & Pillars Mapping](#2-game-overview--pillars-mapping)
3. [Core Gameplay Loops](#3-core-gameplay-loops)
4. [Life Stages](#4-life-stages)
5. [Five Capitals — Gameplay Integration](#5-five-capitals--gameplay-integration)
6. [Player Archetypes & Onboarding Paths](#6-player-archetypes--onboarding-paths)
7. [Win Conditions & Success Definitions](#7-win-conditions--success-definitions)
8. [Difficulty & Starting Backgrounds](#8-difficulty--starting-backgrounds)
9. [Time & Pacing — Player Perspective](#9-time--pacing--player-perspective)
10. [Decision Taxonomy](#10-decision-taxonomy)
11. [Screen-by-Screen Gameplay Flows](#11-screen-by-screen-gameplay-flows)
12. [Progression Systems](#12-progression-systems)
13. [Failure States & Recovery Mechanics](#13-failure-states--recovery-mechanics)
14. [Generational Play & Succession](#14-generational-play--succession)
15. [Multiplayer Touchpoints — Player-Facing](#15-multiplayer-touchpoints--player-facing)
16. [Content Scope — v1.0 EA vs Future](#16-content-scope--v10-ea-vs-future)
17. [Balancing Philosophy](#17-balancing-philosophy)
18. [Anti-Patterns — Forbidden Designs](#18-anti-patterns--forbidden-designs)
19. [Cross-Reference Index](#19-cross-reference-index)
20. [Acceptance Criteria — Major Features](#20-acceptance-criteria--major-features)
21. [Appendices](#21-appendices)

---

# 1. Executive Summary

Fenix Life is a **premium life and business simulation** where the player lives one believable human life—and optionally many generations—inside a world that evolves whether they are watching or not. The player is **one citizen among millions**, subject to the same rules as AI citizens: the same labor markets, lending standards, relationship dynamics, aging curves, and mortality.

There is **no single win condition**. Success is expressed through **Five Capitals**—Financial, Human, Social, Business, and Legacy—and each player defines victory through the life they choose to build. A tenure-track professor, a bootstrapped founder, a dynasty matriarch, and a index-fund millionaire can all "succeed" by different measures while sharing the same simulation.

**Core player fantasy:** *I am living a real modern life inside a world that remembers me.*

**Core design promise:** *Clarity at the surface, depth beneath. Fun through mastery, not through noise.*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FENIX LIFE — PLAYER EXPERIENCE STACK                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   L4  META          Legacy Score · Hall of Legends · Achievements · Seasons │
│   L3  ARC           Decades · Career arcs · Dynasty · Retirement · Death    │
│   L2  SESSION       Monthly planning · Hiring sprints · Exam seasons        │
│   L1  MOMENT        Approve loan · Attend interview · Reply to message    │
│   L0  WORLD         Living economy · AI citizens · News · Offline advance   │
│                                                                              │
│   Horizontal axis: Five Capitals (every layer touches ≥1 capital)           │
│   Vertical axis:  Nested loops (micro → meso → macro)                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**v1.0 Early Access scope (player-facing):** One sovereign world instance, one primary metro region, full personal finance loop, career and education paths, company founding through growth stage, real estate and vehicles, stock market, family and relationships, aging and death, playable succession (heir continuation), Fenix Network social layer (friends, profiles, visits, limited transfers), and offline world continuation.

**Emotional journey target:**

```
Curiosity → Competence → Confidence → Crisis → Adaptation → Mastery → Reflection → Legacy
```

Every mechanic in this GDD must trace to at least one **Core Pillar** (Product Bible §4) and at least one **Capital** (Constitution Article III). Mechanics that serve neither are cut.

---

# 2. Game Overview & Pillars Mapping

## 2.1 Elevator Pitch

Fenix Life is *The Sims* meets *Bloomberg Terminal* meets *generational dynasty builder*—a 2D life simulation where you manage health, relationships, career, and wealth through professional-grade dashboards while AI citizens, companies, and governments evolve around you. When you die, the world remembers—and your heir inherits opportunity, obligation, and your name.

## 2.2 Genre & Platform

| Attribute | Definition |
|---|---|
| **Genre** | Premium life / business simulation |
| **Perspective** | 2D navigable city + diegetic UI dashboards |
| **Platform (EA)** | PC-first (Windows, macOS); tablet-friendly layouts where applicable |
| **Session length** | 10 minutes (check-in) to 3+ hours (year planning) |
| **Play style** | Single-player sovereign world + optional Fenix Network social layer |
| **Monetization (design constraint)** | Premium base game; no pay-to-win; no simulation advantages for spend |

## 2.3 Core Pillars — Feature Mapping

Every shipped feature must map to ≥1 pillar. Features mapping to none are cut. Features mapping to many are prioritized.

| Pillar | Player-Facing Essence | Primary Mechanics | Example Player Moment |
|---|---|---|---|
| **I — The Living Life** | Human stakes: health, love, identity, mortality | Vitals, relationships, marriage, children, aging, death, stress | High stress reduces interview performance; spouse asks for more time |
| **II — The Living Economy** | Money obeys rules; policy matters | Inflation, credit, taxes, housing cycles, unemployment | Rate hike makes mortgage painful but savings attractive |
| **III — The Living Company** | Build, operate, compete, exit | Incorporation, hiring, product, fundraising, bankruptcy | Rushed launch boosts revenue then craters reputation in news |
| **IV — The Living World** | NPCs and institutions evolve off-screen | AI competitors, graduating students, city growth, news | Competitor IPO headline while player is in university |
| **V — The Living Network** | Real humans at the edges | Profiles, visits, gifts, investments, partnerships, leaderboards | Friend invests seed capital via contract; returns depend on performance |
| **VI — The Living Legacy** | Wealth and wisdom outlive one character | Inheritance, trusts, succession, dynasty reputation | Choose equal inheritance vs meritocratic company control |

## 2.4 Constitutional Alignment — Non-Negotiables

These principles from the Design Constitution govern every section of this GDD:

| Principle | Player-Facing Implication |
|---|---|
| **Citizen Equality** | Player has no hidden stat boosts, immunity, or exclusive events |
| **Living World** | World advances offline; competitors act while player sleeps |
| **Five Capitals** | No single "score" defines success; dashboards surface capital tradeoffs |
| **Legacy Philosophy** | Death is transition, not game over; inheritance has friction |
| **World Memory** | Credit history, scandals, and favors persist and resurface |
| **Emergent Storytelling** | Stories arise from systems; scripted beats are seasoning only |
| **Ethical Design** | Grinding and exploit loops are forbidden; consequences teach |

## 2.5 Design Tenets — Gameplay Translation

| Tenet (Product Bible §3) | Gameplay Rule |
|---|---|
| Information rich, never cluttered | Every screen: 1 primary decision + 3 key numbers + context channel |
| Meaningful choice | Options must diverge in capital outcomes, not cosmetic dialogue |
| Emergence over script | Events report simulation state; popups never bypass physics |
| Pacing with breathing room | After crisis, surface recovery tools—not only punishment |
| Diegetic interface | Banking is a bank portal; company ops is a company dashboard |

---

# 3. Core Gameplay Loops

Fenix Life runs **nested loops** because life is not turn-based in one domain only. Players simultaneously manage personal, professional, financial, corporate, and social layers.

## 3.1 Loop Hierarchy Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOOP HIERARCHY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MACRO (Life)     Birth → Childhood → Adulthood → Aging → Death/Succession  │
│       │                    │                                                 │
│       ▼                    ▼                                                 │
│  MESO (Monthly)   Observe → Plan → Act → Resolve → Advance Time → React   │
│       │                    │                                                 │
│       ▼                    ▼                                                 │
│  MICRO (Daily/    Interview · Date · Pitch · Buy · Study · Vote · Treat    │
│   Event)                                                                     │
│                                                                              │
│  PARALLEL AXES: Personal │ Professional │ Financial │ Corporate │ Social   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Macro Loop — The Life Arc

**Cadence:** Years and decades  
**Primary emotion:** Reflection, legacy, identity  
**Time control:** Player selects speed; critical gates block advance (see §9)

| Phase | Player Agency | System Behavior | Capital Emphasis |
|---|---|---|---|
| **Character Creation** | Name, appearance, background, starting city | World already populated; synthetic history loaded | All (starting distribution) |
| **Childhood (0–12)** | Limited — education focus, family bonds, hobbies | Personality traits emerge; foundational skills seeded | Human, Social |
| **Adolescence (13–17)** | Expanding — school choices, first jobs, social life | Peer networks form; credential paths open | Human, Social |
| **Young Adulthood (18–30)** | Full — career, romance, first business, debt | High learning rate; mistakes cheaper; identity locks | Human, Financial |
| **Mid-Career (31–50)** | Peak agency — company scale, family, investments | Compounding consequences; specialization depth | Business, Financial, Social |
| **Late Career (51–65)** | Transition — succession planning, mentorship, health | Physical Human Capital declines; wisdom transfers | Legacy, Social, Human |
| **Retirement (65+)** | Reduced work; portfolio and family focus | Pension, healthcare costs, estate planning | Financial, Legacy |
| **Death** | Succession choices; epilogue | World Memory records life; heir selection | Legacy |
| **Succession (optional)** | Play as heir or new citizen | Inheritance resolves; dynasty continues | Legacy, all |

**Macro loop exit conditions:** Player chooses to end run (retire from game), character dies without playable heir, or player starts new life in same/different world.

## 3.3 Meso Loop — The Monthly Operational Beat

**Cadence:** In-game months (default operational rhythm)  
**Primary emotion:** Competence, control, anticipation  
**Trigger:** Calendar month boundary OR player-initiated "End Month" with unresolved items flagged

### Meso Loop Phases — Detailed

| Phase | Player Actions | World Actions (Simultaneous) | Outputs |
|---|---|---|---|
| **Observe** | Review Home dashboard, Banking cash flow, Company KPIs, News feed, notifications, "While You Were Away" summary | Markets tick daily; NPC companies submit filings; AI citizens job-search | Priority queue of decisions |
| **Plan** | Set monthly budget; schedule education; queue hiring; allocate investments; plan social time | Policy announcements; competitor product launches; rate changes | Committed intentions (soft queue) |
| **Act** | Execute micro decisions: interviews, purchases, pitches, dates, product changes | Applications process; deals progress; relationship events fire | State mutations, partial progress |
| **Resolve** | Payroll runs; loan payments; exam results; performance reviews; tax withholdings | Events cascade: layoffs, promotions, defaults, births | Domain events logged to Timeline |
| **Advance** | Confirm time advance (or auto at month end if no blockers) | Full tick: economy, companies, citizens, media | New month state |
| **React** | Read news; adjust plan; respond to blocking gates | Emergent composites may surface (sector slowdown, housing pressure) | Updated Observe phase |

**Meso loop design rule:** A month must never end with *nothing to react to*. If systems produce no events, ambient life generates emails, social prompts, market noise, or training opportunities.

### Monthly Player Checklist (Suggested UX — Not Mandatory)

| Domain | Questions the Player Should Answer |
|---|---|
| **Personal** | Are vitals stable? Any relationship decay? |
| **Financial** | Cash runway? Bills due? Credit trajectory? |
| **Professional** | Job performance? Promotion path? |
| **Corporate** | Revenue trend? Hiring needs? Product pipeline? |
| **Investment** | Portfolio allocation? Real estate yield? |
| **Legacy** | Estate updated? Children developing? |

## 3.4 Micro Loop — Daily & Event Interactions

**Cadence:** Individual actions within a day or triggered event  
**Primary emotion:** Agency, immediacy, social connection  
**Resolution:** Same-day or multi-day progress bars feeding meso outcomes

| Micro Loop Category | Examples | Meso Output |
|---|---|---|
| **Career** | Job interview, performance task, networking event | Employment status, skill XP, reputation delta |
| **Business** | Hire candidate, set price, approve R&D, pitch investor | Company metrics, pipeline progress |
| **Financial** | Pay bill, transfer funds, place trade, apply for loan | Cash, credit, holdings |
| **Social** | Date, gift, argument, mentorship session | Relationship strength, Social Capital |
| **Education** | Attend class, study session, take exam | GPA, credentials, Human Capital |
| **Life maintenance** | Doctor visit, vacation, purchase, repair | Health, happiness, asset condition |
| **Civic** | Vote (future), donate, attend town hall | Reputation, policy influence |

**Micro loop design rule:** Every micro action must feed at least one meso metric. Purely cosmetic interactions are limited to EA scope (appearance, home decor) and must not substitute for systemic depth.

## 3.5 Parallel Loops — Simultaneous Management

```
                    ┌──────────────┐
                    │    PLAYER    │
                    │   ATTENTION  │
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  PERSONAL  │  │ PROFESSIONAL│  │ FINANCIAL  │
    │  vitals    │  │  job/career │  │  cash/credit│
    │  relations │  │  skills     │  │  assets     │
    └─────┬──────┘  └──────┬──────┘  └──────┬──────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
              ┌────────────────────────┐
              │  CORPORATE (if owner) │
              │  hiring · product · P&L│
              └────────────┬───────────┘
                           ▼
              ┌────────────────────────┐
              │  SOCIAL NETWORK        │
              │  friends · reputation  │
              │  Fenix Network         │
              └────────────────────────┘
```

**Cross-loop coupling examples (must exist in simulation):**

| Personal State | Professional Effect |
|---|---|
| High stress | Reduced leadership effectiveness; interview penalty |
| Low energy | Fewer micro actions per day |
| Relationship crisis | Distraction debuff; potential asset division |

| Financial State | Business Effect |
|---|---|
| Low credit | Higher loan rates; investor skepticism |
| Strong net worth | Personal guarantee capacity for business loans |
| Bankruptcy history | Director disqualification periods |

## 3.6 Loop Anti-Patterns (Forbidden)

| Anti-Pattern | Player Experience Failure | Design Fix |
|---|---|---|
| Idle waiting | Nothing to do for real-time minutes | Events, emails, news, training, social prompts |
| Mandatory micromanagement at scale | CEO clicking every PO at 500 employees | Managers, automation policies, delegation |
| Surprise instant death | "You died" with no telegraphing | Health trends, checkups, warnings |
| Separate "business mode" | Life pauses when opening company | Shared calendar, vitals affect work |
| Skippable unresolved gates | Miss margin call by fast-forwarding | Blocking decision gates (§9) |

---

# 4. Life Stages

Life stages structure **agency**, **system density**, and **teaching cadence**. The player experiences different decision menus and automation defaults at each stage. AI citizens follow identical stage rules.

## 4.1 Stage Overview Table

| Stage | Age Range | Agency Level | Systems Active | Tutorial Density |
|---|---|---|---|---|
| **Infancy** | 0–2 | None (narrative summary) | Family bonds only | None — time-skip or summary |
| **Childhood** | 3–12 | Low | Education basics, family, hobbies, allowance | High — guided choices |
| **Adolescence** | 13–17 | Medium | School paths, part-time work, social, sports/clubs | Medium — branching paths |
| **Young Adult** | 18–25 | High | Full education, career entry, romance, first credit | Medium — first real consequences |
| **Establishment** | 26–40 | Full | Business founding, marriage, children, investing | Low — systems teach via feedback |
| **Peak** | 41–55 | Full | Scale, M&A, leadership, teen children | Low |
| **Pre-Retirement** | 56–64 | High (strategic) | Succession, estate, health management | Low |
| **Retirement** | 65–79 | Medium | Portfolio, family, philanthropy, hobbies | Low |
| **Elder** | 80+ | Medium-Low | Health focus, legacy, mentorship | Low |
| **Death** | Terminal | Choice window | Succession, epilogue, Legacy Score update | N/A |

## 4.2 Childhood (Ages 3–12)

**Design intent:** Establish personality affinities, family bonds, and educational foundations without overwhelming new players.

**Player decisions (limited menu):**

- After-school activity (sports, arts, coding club) → skill affinity seeds
- Study effort level → academic trajectory
- Friend interactions → early Social Capital
- Allowance spending vs saving → first Financial literacy beat

**Automated/simulated:**

- Parent NPC behavior (unless player is orphan background)
- School progression and grades (influenced by effort)
- Personality trait emergence from CDPS (see doc 16)

**Constitutional note:** Childhood is not a "mini-game skip." It is 10–15 in-game years that shape ceilings and affinities. Time may be accelerated (2×–8×) but not skipped without player confirmation and summary of outcomes.

## 4.3 Adolescence (Ages 13–17)

**Design intent:** Branching identity — college vs trade vs early work; first romantic and social complexity.

**Unlocks:**

- Part-time employment
- Dating (age-gated by region rules)
- Driver's license / vehicle access
- Social media profile (diegetic — future smartphone app)
- Extracurricular specialization

**Key forks (meaningful, not cosmetic):**

| Fork | Long-Term Effect |
|---|---|
| University track | Credential gates, debt, alumni network |
| Trade/certification track | Faster income, different ceiling, skilled labor market |
| Early entrepreneurship | Business Capital seed; Financial risk |
| Gap / travel year | Human Capital breadth; delayed credentials |

## 4.4 Young Adulthood (Ages 18–30)

**Design intent:** Maximum learning velocity; mistakes are costly but recoverable; identity solidifies.

**Full system unlocks:**

- Full employment market
- Independent housing
- Credit products (cards, student loans, auto loans)
- Company incorporation
- Stock market (age/account gated)
- Marriage and cohabitation
- Investment property (with credit requirements)

**Pacing:** Events density highest — promotions, breakups, first failures, first wins. News feed introduces player to living world competitors.

## 4.5 Mid-Career (Ages 31–50)

**Design intent:** Compounding — specialization, family obligations, business scale, wealth acceleration or stagnation.

**Plateau design:** Mid-career stagnation is intentional mirroring real life. Side paths must exist:

- Career pivot via re-education
- Side business while employed
- Board seats and advisory income
- Real estate portfolio scaling

**Family layer peak:** Children require time investment; neglect has Social and Legacy consequences visible in teen years.

## 4.6 Late Career & Retirement (Ages 51+)

**Design intent:** Transition from accumulation to preservation, transfer, and meaning.

**Mechanics emphasis:**

- Succession planning UI surfaces
- Health events increase frequency (telegraphed)
- Mentorship actions transfer Human Capital to heirs/protégés
- Estate and trust instruments unlock
- Work optional — retirement decision is player choice with pension/tradeoffs

## 4.7 Death & End-of-Life

**Design intent:** Death is dignified, explainable, and transitional — never a random "game over" screen.

**Death triggers (all telegraphed or choice-driven):**

| Cause Category | Telegraphing | Player Mitigation |
|---|---|---|
| Age-related | Health trend decline | Healthcare, lifestyle, genetics (background) |
| Illness | Diagnosis events, treatment options | Insurance, savings, experimental care |
| Accident | Low probability hazards | Insurance; not fully eliminable |
| Stress/burnout | Stress meter, warnings | Rest, therapy, workload reduction |
| Violence/crime (future) | Region risk profile | Avoidance, security — rare in EA |

**Death sequence (player-facing):**

1. **Terminal event** — diagnosis or final decline notification
2. **Final months window** — reduced action set; legacy focus
3. **Estate resolution preview** — taxes, debts, disputes
4. **Succession choice** — heir, new citizen, or epilogue-only
5. **Life epilogue** — Timeline summary, Legacy Score update, Hall of Legends eligibility
6. **Continue or return to menu**

---

# 5. Five Capitals — Gameplay Integration

The Five Capitals are the **success coordinate system** of Fenix Life. Every major screen, achievement, and leaderboard category maps to at least one capital. Players optimize tradeoffs, not a single bar.

## 5.1 Capital Interaction Matrix

```
                    Financial ◄────────────────► Business
                        ▲                           ▲
                        │                           │
                        │         LEGACY            │
                        │            ▲              │
                        │            │              │
                        ▼            │              ▼
                     Human ◄───────►│◄────────► Social
```

**Capital tension examples (designed, not accidental):**

| Player Strategy | Capital Gained | Capital Risked |
|---|---|---|
| 80-hour founder grind | Business, Financial | Human (health), Social (family) |
| Tenure + index funds | Human, Financial | Business (none), slower Financial |
| Politician path | Social, Legacy | Financial (salary cap), reputation fragility |
| Philanthropy focus | Social, Legacy | Financial (outflow) |
| Nepotism hiring | Short-term Business | Social, Legacy (reputation hit) |

## 5.2 Financial Capital — Player Surface

**Primary screens:** Banking Dashboard, Real Estate, Stock Market, Company financials  
**Companion spec:** [05_Economy_Design.md](./05_Economy_Design.md), [11_Banking_Finance_Design.md](./11_Banking_Finance_Design.md), [12_Investment_Markets_Design.md](./12_Investment_Markets_Design.md)

| Component | Player Visibility | Gameplay Lever |
|---|---|---|
| Cash & accounts | Banking Dashboard hero metric | Runway planning |
| Income streams | Cash flow chart | Diversification |
| Assets | Net worth breakdown | Collateral, appreciation |
| Debt | Liability schedule | Leverage, credit score |
| Credit score | Banking quick action | Access gating |
| Business valuation | Company dashboard | Exit, fundraising |

**Teaching principle:** Inflation erodes idle cash. Debt enables growth with risk. UI shows real rates, amortization, and DTI — not abstract "credit points."

## 5.3 Human Capital — Player Surface

**Primary screens:** Education, Home vitals, Employee self-view, Healthcare (future)  
**Companion spec:** [07_Career_Employment_Design.md](./07_Career_Employment_Design.md), [08_Education_Design.md](./08_Education_Design.md)

| Component | Player Visibility | Gameplay Lever |
|---|---|---|
| Skills | Education + career panels | Job fit, business capability |
| Credentials | Education credentials list | Hard gates (bar, medical license) |
| Health & energy | Home character card | Action capacity, longevity |
| Experience | Career timeline | Salary, board eligibility |
| Leadership | Derived from skills + performance | Hiring, company scale |

**Scarcity rule:** Player cannot max all skills. Specialization defines identity. Respec is expensive (time + money), not impossible.

## 5.4 Social Capital — Player Surface

**Primary screens:** Family, Phone messages, News mentions, Network graph (future)  
**Companion spec:** [09_Family_Relationships_Design.md](./09_Family_Relationships_Design.md)

| Component | Player Visibility | Gameplay Lever |
|---|---|---|
| Relationships | Family tree + relationship meters | Support in crisis, deals |
| Reputation | News, credit-adjacent social score | Hiring, fundraising |
| Network | Professional contacts | Job offers before public listing |
| Trust | Transaction history with NPCs | Loan terms, partnership |
| Influence | Civic and media presence | Policy, brand |

**Earned slowly, lost quickly:** Betrayal, scandal, and public failure have long half-lives in World Memory.

## 5.5 Business Capital — Player Surface

**Primary screens:** Company Dashboard, Employee Management, Product pipeline (future)  
**Companion spec:** [06_Business_Systems_Design.md](./06_Business_Systems_Design.md)

| Component | Player Visibility | Gameplay Lever |
|---|---|---|
| Companies owned | Company selector / list | Income, identity |
| Brand strength | Reputation sub-score | Pricing power |
| Products | Product catalog | Revenue mix |
| Employees | Roster | Capacity, culture |
| Market share | Industry comparison | Competitive pressure |
| IP / patents (future) | R&D outputs | Moats, licensing |

**Systemic rule:** Business exists in the economy — hires from labor pool, borrows from banks, competes with AI firms. Isolated "business sandbox" violates Constitution.

## 5.6 Legacy Capital — Player Surface

**Primary screens:** Timeline, Family legacy preview, Hall of Legends, Succession wizard  
**Companion spec:** [09_Family_Relationships_Design.md](./09_Family_Relationships_Design.md)

| Component | Player Visibility | Gameplay Lever |
|---|---|---|
| Dynasty reputation | Family surname modifier | Heir starting doors + scrutiny |
| Institutions founded | Timeline markers | Persistent world entities |
| Philanthropy | Legacy ledger | Scholarships, foundations |
| Generational wealth | Estate planner | Transfer efficiency |
| Historical achievements | Hall of Legends | Meta unlocks, bragging rights |

**Ultimate measure:** Legacy Capital is slowest to build, hardest to destroy. Legacy Score (§12) weights all five capitals — not net worth alone.

## 5.7 Capital Dashboard — Home Screen Integration

The Home Screen presents a **Five Capitals summary strip** (toggleable in Settings per doc 34):

| Capital | Summary Metric (Example) |
|---|---|
| Financial | Net worth + monthly cash flow |
| Human | Top 3 skills + health status |
| Social | Relationship health avg + reputation tier |
| Business | Company value or "Employed" status |
| Legacy | Dynasty score + heir readiness |

---

# 6. Player Archetypes & Onboarding Paths

Players are **not locked into classes**. Archetypes describe motivation, not mechanics. Multi-archetype builds are expected and celebrated.

## 6.1 Archetype Definitions

| Archetype | Core Motivation | Signature Systems | Suggested Success Path |
|---|---|---|---|
| **The Builder** | Create products and companies | R&D, hiring, operations | Profitable exit or durable private company |
| **The Climber** | Career prestige and income | Jobs, education, networking | C-suite or industry recognition |
| **The Investor** | Wealth via markets and assets | Stocks, real estate, portfolios | FIRE-style independence or fund manager |
| **The Patriarch/Matriarch** | Family dynasty | Relationships, inheritance, succession | Multi-gen dynasty with strong Legacy Score |
| **The Explorer** | Discover world content | City map, travel, news, events | Completionist achievements, encyclopedia entries |
| **The Competitor** | Rank and status | Leaderboards, acquisitions, net worth races | Seasonal leaderboard titles |
| **The Storyteller** | Emergent narrative | Choices, relationships, scandals | Unique Timeline arc, content creator shareability |

## 6.2 Onboarding — First 30 In-Game Minutes (Real-Time)

**Goal:** Player understands they are a citizen in a living world, knows where to look, and makes first meaningful choice.

| Step | Screen / System | Player Action | Teaching Moment |
|---|---|---|---|
| 1 | Main Menu | New Life | World is persistent |
| 2 | Character Creation | Background choice | Tradeoffs, not power |
| 3 | Childhood summary or start | Confirm or play 1 year | Time control intro |
| 4 | Home Screen tour | Tap each quick action | Diegetic domains |
| 5 | Banking | View accounts | Three numbers rule |
| 6 | News Feed | Read 1 headline | World doesn't wait |
| 7 | Education or Career | Enroll or apply | Human Capital investment |
| 8 | First micro decision | Study or interview | Micro → meso link |
| 9 | End first month | Advance time | Meso loop complete |
| 10 | Notification | "While You Were Away" preview | Offline continuation teaser |

## 6.3 Archetype-Suggested Paths (Optional Wizard)

Character Creation may offer **"Suggested path"** toggles — never hard locks:

| Path Toggle | Starting Nudge | Systems Highlighted |
|---|---|---|
| Business Founder | Entrepreneurship family background suggested | Company, Banking |
| Corporate Ladder | Middle-class + university track | Education, Career |
| Market Wizard | Finance club in adolescence | Stocks, Banking |
| Family First | Strong family background | Family, Legacy |
| Free Spirit | Explorer tutorial pins on city map | City, News |

**Rule:** Any path achievable from any background — paths are UX hints only.

## 6.4 Returning Player Onboarding

After absence (real-time days):

1. **While You Were Away** summary — max 8 bullet events, prioritized by capital impact
2. **Blocking gates** surfaced first — margin calls, legal summons, partner votes
3. **Archetype-agnostic** — summary highlights what changed, not what player "should" do

---

# 7. Win Conditions & Success Definitions

Fenix Life has **no single win screen**. Victory is player-defined, tracked through achievements, Legacy Score, and self-narrative. The game **recognizes** diverse successes without declaring one canonical ending.

## 7.1 Philosophy

| Principle | Implementation |
|---|---|
| No game over (except optional permadeath mode future) | Death → succession |
| Multiple victory paths | Achievement categories per archetype |
| Failure is data | Bankruptcy, divorce, scandal — recoverable arcs |
| Legacy is the deepest win | Multi-generational Legacy Score threshold |

## 7.2 Victory Path Catalog

| Victory Path | Definition | Primary Capitals | Recognition |
|---|---|---|---|
| **Self-Made Fortune** | Net worth threshold with zero inheritance | Financial | Achievement + leaderboard |
| **Exit Legend** | Sell company or IPO above threshold | Business, Financial | News feature + Hall of Legends |
| **Tenured Master** | Reach top credential in field | Human | Professional achievement |
| **Beloved Citizen** | Reputation + relationship thresholds | Social | Community achievement |
| **Dynasty Founder** | 3+ generations with positive Legacy Score | Legacy | Dynasty badge |
| **Philanthropist** | Cumulative giving threshold | Social, Legacy | Foundation naming |
| **Survivor** | Recover from bankruptcy to positive net worth | Financial, Human | Comeback achievement |
| **Renaissance Life** | Minimum threshold in all five capitals | All | Rare "Balanced Life" achievement |
| **Centenarian** | Reach age 100 with health > threshold | Human, Legacy | Longevity achievement |
| **World Shaper** | Found institution persisting 50+ in-game years | Legacy, Business | Encyclopedia entry |

## 7.3 Soft Fail States (Not Loss)

| State | Player Experience | Recovery Path |
|---|---|---|
| Bankruptcy | Constrained credit; stigma in World Memory | Rebuild via employment, smaller ventures |
| Divorce | Asset split; relationship network shift | Time, co-parenting, new relationships |
| Unemployment | Income stop; skill decay risk | Job search, retraining, gig work |
| Company failure | Equity loss; reputation hit | New venture, employment, advisory |
| Estranged family | Weak heir candidates; inheritance disputes | Reconciliation events (hard, systemic) |
| Health crisis | Medical costs; reduced capacity | Treatment, lifestyle, insurance |
| Scandal | Reputation crash; media cycle | PR, time, demonstrated change |

## 7.4 End-of-Life Scoring — Legacy Score Preview

At death, player sees **Legacy Score breakdown** (not a "you win/lose" binary):

| Component | Weight (EA Baseline) |
|---|---|
| Financial Capital at death (adjusted for debt) | 20% |
| Human Capital peak + credentials | 15% |
| Social Capital (relationships + reputation) | 20% |
| Business Capital (companies built/sold) | 20% |
| Legacy Capital (institutions, dynasty, philanthropy) | 25% |

Weights tunable via balancing — philosophy fixed: Legacy Capital heaviest.

---

# 8. Difficulty & Starting Backgrounds

Difficulty modifies **starting conditions and macro volatility**, not player rules or hidden boosts.

## 8.1 Difficulty Dimensions

| Dimension | Easy | Standard | Hard | Realist (Future) |
|---|---|---|---|---|
| **Macro volatility** | Smoother cycles | Normal cycles | Sharp booms/busts | Historical scenario packs |
| **Event frequency** | Fewer hazards | Normal | More hazards | Full hazard tables |
| **AI competitiveness** | Slower AI scaling | Normal | Aggressive AI | Same rules, smarter AI |
| **Recovery assistance** | More grants/programs | Normal | Fewer safety nets | Minimal intervention |
| **Tutorialization** | More inline hints | Standard | Minimal hints | None |

**Constitutional rule:** Difficulty never grants player simulation advantages on Easy or removes Citizen Equality on Hard.

## 8.2 Starting Backgrounds

Selected at Character Creation. Alters **starting capital and access**, not **ceiling**.

| Background | Starting Cash | Education | Relationships | Advantages | Disadvantages | Difficulty |
|---|---|---|---|---|---|---|
| **Wealthy Family** | High | Private school track | Connected parents | Seed capital access, network | Expectations, reputation scrutiny | Standard |
| **Middle Class** | Moderate | Public school → university path | Stable family | Balanced | No major boosts | Standard |
| **Working Class** | Low | Trade/public options | Hardworking family | Work ethic affinity | Credit constraints | Standard–Hard |
| **Orphan** | Minimal | Foster system variance | Weak early network | Independence traits | No safety net | Hard |
| **Immigrant** | Low–Moderate | Credential transfer challenge | Diaspora network | Cultural Human Capital | Legal/credential friction | Hard |
| **Entrepreneur Family** | Moderate | Business exposure early | Business contacts | Early incorporation knowledge | Comparison to parent | Standard |

**Orphan → billionaire** must remain theoretically possible — difficulty is path, not permission.

## 8.3 World-Level Difficulty Modifiers (New Life Setup)

| Modifier | Effect |
|---|---|
| **Boom Economy Start** | Lower unemployment; higher asset prices — harder entry, easier growth |
| **Recession Start** | Cheaper assets; hiring hard — contrarian opportunity |
| **High Inflation Region** | Cash erodes faster |
| **Tech Hub City** | Higher salaries; higher cost of living |
| **Regulated Market** | More compliance gameplay |

---

# 9. Time & Pacing — Player Perspective

Time is the **primary resource**. Players experience time through controls, gates, and feedback — not through engine internals (see doc 17 for simulation spec).

## 9.1 Player Time Controls

| Control | Player Effect | World Effect |
|---|---|---|
| **Pause** | Player actions only; world frozen at last committed tick | Explicit player choice |
| **1× (Real-time day)** | ~24 real min = 1 game day (tunable) | Normal tick rate |
| **2×–8×** | Accelerated days | Full simulation continues |
| **End Day / Week / Month** | Jump to boundary after resolving gates | Batch tick |
| **End Year** | Annual summary + planning | Major rollups |

**Default new world:** RUNNING at 1× (Constitution: world does not wait).

## 9.2 Blocking Decision Gates

Time **cannot advance** until player resolves (P0 priority):

| Gate | Trigger | Player Must |
|---|---|---|
| **Margin call** | Portfolio below maintenance | Sell, deposit, or restructure |
| **Loan covenant breach** | Company ratio violation | Cure or renegotiate |
| **Legal summons** | Lawsuit, audit, divorce filing | Respond or default |
| **Partnership vote** | Co-founder proposal (multiplayer) | Accept, reject, counter |
| **Death imminence** | Terminal diagnosis | Confirm care choices |
| **Succession deadline** | Estate tax window | Name heirs, allocate |
| **Critical relationship** | Partner ultimatum (systemic threshold) | Address or accept consequence |

**UX rule:** Unresolved gates listed in notification center with capital impact preview.

## 9.3 Offline Progression — Player Experience

When player closes game:

1. Simulation clock **persists** — world does not pause unless player enabled pause-before-quit
2. On return: **catch-up simulation** runs (may take loading seconds)
3. **While You Were Away** presents prioritized outcomes
4. **No retroactive undo** — decisions made during catch-up follow queued policies/automation

| Offline Duration | Player Expectation |
|---|---|
| < 1 hour | Minor market moves |
| 1–24 hours | News events, competitor actions possible |
| 1–7 days | Meaningful world delta; gates may await |
| > 7 days | Summary mode + emphasis on blocking gates |

## 9.4 Pacing Curve — Content Density by Life Stage

```
Event Density
     ▲
     │         ╭─── Peak (30-45)
     │        ╱     ╲
     │       ╱       ╲___
     │      ╱              ╲___
     │  ___╱                    ╲___
     └────────────────────────────────► Age
        0   12   18   30   50   65   80
```

**Breathing room rule:** After 2+ crisis months, system bias toward stabilization opportunities (refinance offers, training grants, reconciliation events) — not immunity.

## 9.5 Session Pacing Targets

| Session Type | Target Duration | Satisfying End State |
|---|---|---|
| Check-in | 10–15 min | Bills paid, 1 micro loop resolved |
| Planning | 45–90 min | Month advanced, plan set |
| Deep dive | 2–3 hours | Year advanced, major milestone |
| Legacy session | 3+ hours | Succession completed, new heir started |

---

# 10. Decision Taxonomy

Clear boundary between **player decisions**, **delegated decisions**, and **automated simulation** prevents both micromanagement hell and loss of agency.

## 10.1 Decision Classes

| Class | Definition | Examples | Default Owner |
|---|---|---|---|
| **D1 — Strategic** | Irreversible or high-impact; player must confirm | Incorporate, sell company, divorce, major asset sale | Player |
| **D2 — Tactical** | Recurring operational choices | Hire/fire, pricing, budget allocation, study schedule | Player (can delegate) |
| **D3 — Routine** | Low-impact recurring | Pay standard bills, routine payroll | Automation default |
| **D4 — Policy** | Standing rules player sets | "Maintain 6-month runway", "Hire when revenue > X" | Player sets; system executes |
| **D5 — Autonomous** | NPC/world simulation | AI competitor pricing, government rate change | System |
| **D6 — Emergent** | Threshold-triggered events requiring response | Margin call, job offer, disaster | Player notified |

## 10.2 Automation & Delegation Unlocks

| Life/Business Stage | Automation Available |
|---|---|
| Solo employee | Bill autopay, savings sweep |
| Manager | Department budget delegation |
| Small business (1–10) | HR manager handles screening |
| Medium business (11–50) | COO role — D3 operations |
| Large business (51+) | Policy engine (D4) dominant; player D1/D2 focus |

**Constitutional note:** Automation reduces tedium — it does not grant superhuman efficiency. Delegates make mistakes, have agendas, and require oversight (Human Capital investment in leadership).

## 10.3 Decision Flow Diagram

```
                    ┌─────────────────┐
                    │  Event Occurs   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
              ┌────│  Gate Priority? │────┐
              │    └─────────────────┘    │
              ▼                             ▼
       ┌────────────┐              ┌────────────┐
       │ P0 BLOCK   │              │ Notify     │
       │ Player must│              │ player     │
       │ decide     │              └─────┬──────┘
       └────────────┘                    ▼
                                 ┌────────────┐
                                 │ Policy     │
                                 │ matches?   │
                                 └─────┬──────┘
                          Yes ◄───────┴───────► No
                           ▼                      ▼
                    ┌────────────┐         ┌────────────┐
                    │ Auto-      │         │ Queue for  │
                    │ execute    │         │ player     │
                    └────────────┘         └────────────┘
```

## 10.4 Player vs System — Domain Split

| Domain | Player Decides | System Resolves |
|---|---|---|
| **Personal health** | Treatment, lifestyle, work hours | Aging, disease progression |
| **Relationships** | Time allocation, gifts, commitments | NPC autonomous behavior |
| **Career** | Apply, interview prep, accept offers | Employer decisions, market demand |
| **Finance** | Allocation, loan applications | Bank approval, rates, inflation |
| **Business** | Strategy, hires, product | Market response, competitor actions |
| **Investments** | Orders, portfolio policy | Price formation, dividends |
| **Legal/tax** | Structure choices, deductions | Audit probability, enforcement |
| **World** | Vote (future), relocate | Policy, cycles, disasters |

---

# 11. Screen-by-Screen Gameplay Flows

Screen layout and visual standards: **doc 34**. This section defines **gameplay purpose, decisions, and flows**.

## 11.1 Navigation Architecture

```
Layer 0: Main Menu (out of world)
Layer 1: Home Screen (life hub)
Layer 2: Domain dashboards
Layer 3: Task detail
Layer 4: Modal confirmations
```

**Rule:** ≤3 taps from Home to any primary domain.

## 11.2 Main Menu (`/`)

**Primary decision:** Start, continue, or configure.

| Action | Gameplay Flow |
|---|---|
| **New Life** | → World select (EA: single template) → Character Creation |
| **Continue** | → Load save → While You Were Away → Home |
| **Multiplayer** | → Fenix Network hub (friends, messages, leaderboards) |
| **Achievements** | → Archetype progress, capital milestones |
| **Leaderboards** | → Opt-in ranked lists (multi-capital) |
| **Settings** | → Difficulty, accessibility, automation defaults |

## 11.3 Character Creation (`/character-creation`)

**Primary decision:** Define citizen identity and starting conditions.

**Flow:**

```
Identity (name, gender, birthday, nationality)
    → Origin (country, city)
    → Appearance (cosmetic)
    → Background (starting package)
    → [Optional] Archetype path hint
    → Summary + difficulty confirmation
    → Start Life → Childhood or Young Adult per skip preference
```

**Gameplay outputs:** Starting cash, relationships, education track, connection NPCs, difficulty rating, dynasty slot assignment.

## 11.4 Home Screen (`/home`)

**Primary decision:** What life domain to engage next?

**Key zones and capital mapping:**

| Zone | Capitals | Decisions Enabled |
|---|---|---|
| Character card | Human | Rest, doctor, hobby |
| Financial strip | Financial | Navigate to Banking |
| Quick actions (8) | All | Route to domains |
| Activity feed | All | Review, deep link |
| Calendar | All | Prioritize upcoming gates |
| Five Capitals strip | All | Assess balance |

## 11.5 Banking Dashboard (`/banking`)

**Primary decision:** Where is money, and what moves next?

**Three key numbers:** Net worth, monthly cash flow, credit score.

| Flow | Steps | Outcome |
|---|---|---|
| **Apply loan** | Product select → terms preview → submit → wait → accept/reject | Debt, credit impact |
| **Transfer** | Account select → amount → confirm | Liquidity move |
| **Pay bill** | Bill list → pay/manual/autopay | Obligation cleared |
| **Credit check** | View factors → improvement suggestions | Human-readable causes |

## 11.6 Company Dashboard (`/company`)

**Primary decision:** Is the business healthy, and what lever to pull?

**Three key numbers:** Revenue, profit margin, employee count.

| Flow | Steps | Outcome |
|---|---|---|
| **Incorporate** | Entity type → name → capital → register | Business Capital born |
| **Launch product** | Concept → dev time → QA choice → launch | Revenue/reputation tradeoff |
| **Seek funding** | Pitch deck (auto) → investor match → terms | Equity dilution |
| **Hire** | Post job → review candidates → interview → offer | Human Capital in business |
| **Pay dividends** | Board approval (solo or NPC board) → payout | Financial to player, cash out |

## 11.7 Employee Management (`/employees`)

**Primary decision:** Who to hire, promote, train, or release?

**Termination flow:** Select → consequence preview (morale, legal risk) → typed confirm → execute.

## 11.8 Stock Market (`/stocks`)

**Primary decision:** Buy, sell, or hold?

**Three key numbers:** Portfolio value, day change, available cash.

| Flow | Gates |
|---|---|
| **Market order** | Margin warning if leveraged |
| **Limit order** | Queued until price |
| **IPO subscribe** | Allocation lottery + credit check |

## 11.9 Real Estate (`/real-estate`)

**Primary decision:** Acquire, improve, rent, or divest?

| Flow | Key Mechanics |
|---|---|
| **Purchase** | Mortgage pre-approval, down payment, closing costs |
| **Rent out** | Tenant matching, maintenance, vacancy risk |
| **Renovate** | CapEx, value add, time cost |

## 11.10 Education (`/education`)

**Primary decision:** What to study, when, at what cost?

| Flow | Outcome |
|---|---|
| **Enroll** | Tuition, loans, schedule conflict with work |
| **Study session** | Skill XP, energy cost |
| **Exam** | Grade, credential progress |
| **Graduate** | Credential unlock, alumni network |

## 11.11 Family (`/family`)

**Primary decision:** Invest in relationships or address conflict?

| Flow | Capital Impact |
|---|---|
| **Date → Marry** | Social, Financial (event cost) |
| **Children** | Legacy, time sink, Social |
| **Divorce** | Financial split, Social, Legacy |
| **Will / estate** | Legacy planning |
| **Gift to heir** | Financial → Legacy transfer; tax |

## 11.12 Timeline (`/timeline`)

**Primary decision:** Reflect — read-only World Memory.

No undo. Events link to entities (person, company, asset). Capital chips on each event.

## 11.13 News Feed (`/news`)

**Primary decision:** What world events require response?

Impact tags deep link: "Affects your sector" → Company dashboard; "Mentions you" → reputation detail.

## 11.14 City Map (`/city`)

**Primary decision:** Where to go?

Phaser 2D navigation. Pins: home, work, school, businesses. Location triggers micro loops (shop, interview venue).

## 11.15 Smartphone (`/phone`)

**Primary decision:** Access diegetic apps.

| App | Routes To | Future |
|---|---|---|
| Bank | Banking | — |
| Stocks | Stock Market | — |
| News | News Feed | — |
| Messages | DMs | Fenix Network |
| Social | Profile feed | Fenix Network |
| Calendar | Events | — |

## 11.16 Settings (`/settings`)

Gameplay-relevant: time speed defaults, automation policies, capital strip toggle, difficulty (if allowed mid-life — default locked), offline behavior (pause vs continue on quit).

---

# 12. Progression Systems

Progression is **multidimensional, uneven, and permanent** unless explicitly reversible (Product Bible §8).

## 12.1 Skills & Knowledge

| Property | Rule |
|---|---|
| Categories | Hard (finance, coding, medicine) + Soft (leadership, negotiation) |
| Growth | Time + effort + quality of challenge |
| Decay | Slow decay if unused (tunable off in accessibility) |
| Synergies | Finance + Leadership → better CFO performance |
| Visibility | Skill bars + "recently used" indicator |

## 12.2 Credentials

| Property | Rule |
|---|---|
| Function | Hard gates — cannot practice law without bar |
| Acquisition | Education paths, exams, continuing education |
| Depreciation | Outdated tech certs lose market value |
| Display | Profile, resume, company founder credibility |

## 12.3 Wealth & Net Worth

| Property | Rule |
|---|---|
| Non-linear power | First $100k unlocks mortgage tier; $1M unlocks angel investing |
| Components | Cash, securities, real estate, business equity, collectibles |
| Psychological beats | Milestone achievements at meaningful thresholds |
| Regression | Bankruptcy, divorce, market crash |

## 12.4 Career Capital

| Property | Rule |
|---|---|
| Components | Title, employer prestige, industry reputation, publications |
| Unlocks | Board seats, speaking fees, advisory roles |
| Loss | Scandal, termination for cause, industry blacklist |

## 12.5 Social & Family Capital

| Property | Rule |
|---|---|
| Components | Relationship quality, children development, dynasty reputation |
| Unlocks | Nepotism options (with backlash), inheritance willingness |
| Loss | Neglect, betrayal, public failure |

## 12.6 Legacy Score — Meta Progression

**Scope:** Cross-life, cross-generation meta score on world save.

| Property | Rule |
|---|---|
| Accumulation | Death snapshot + dynasty continuity bonuses |
| Uses | Hall of Legends, cosmetic unlocks, starting scenario unlocks |
| Never | Raw pay-to-win, stat boosts, simulation advantages |
| Dynasty bonus | +X% for each generation above Legacy threshold Y |

## 12.7 Achievements — Archetype Coverage

Achievements must span all archetypes so no playstyle dominates "100% completion."

| Category | Example Achievements |
|---|---|
| Builder | First incorporation, $1M revenue, first hire |
| Climber | First promotion, C-suite, industry award |
| Investor | First dividend, portfolio $500k, survived crash |
| Dynasty | First heir played, 3-generation business, scholarship fund |
| Explorer | Visit all districts, 100 news articles read |
| Competitor | Top 100 seasonal net worth |
| Storyteller | Survived scandal, reconciliation, comeback |

---

# 13. Failure States & Recovery Mechanics

Failure is **informative, fair, and recoverable** — not punitive randomness.

## 13.1 Failure State Catalog

| Failure | Trigger | Immediate Consequences | Recovery Mechanics |
|---|---|---|---|
| **Personal bankruptcy** | Debts exceed assets + protection | Credit crash, asset liquidation, stigma | Chapters 7/13 style paths; employment; time |
| **Business bankruptcy** | Insolvency, covenant breach | Company dissolved or restructured; job loss if CEO-only income | NewCo, acqui-hire, employment |
| **Foreclosure** | Mortgage default | Property loss, credit hit | Rent, rebuild credit, repurchase later |
| **Unemployment** | Fired, quit without job, company closed | Income stop, stress | Job search, gig, retraining grants |
| **Divorce** | Relationship failure threshold | Asset split, custody, social graph | Time, legal, new relationships |
| **Health collapse** | Neglected health + hazard | Medical costs, reduced capacity | Treatment, insurance, lifestyle |
| **Scandal** | Ethics violation surfaced | Reputation, stock price, job loss | PR campaign, years of good behavior |
| **Failed startup** | Runway exhausted | Equity loss, investor relationships | Learn skills, pivot, new pitch |
| **Estranged heirs** | Neglected children | Weak succession, disputes | Reconciliation (hard) |
| **Margin call** | Leverage breach | Forced sale or deposit | De-lever, diversify |

## 13.2 Failure UX Principles

| Principle | Implementation |
|---|---|
| **Explain why** | Causal chain in Timeline + "What happened" panel |
| **Show path forward** | Recovery checklist — not game over |
| **World Memory persists** | Bankruptcy on record 20 years — higher loan rates |
| **No shame mechanics** | Tone professional, not mocking |
| **Teachable** | Link to in-game glossary / tooltips on concepts (APR, DTI) |

## 13.3 Recovery Arc — Example Flow (Personal Bankruptcy)

```
Trigger: Missed payments → collections → court
    → Player chooses Chapter 7 or 13 equivalent
    → Asset liquidation / payment plan
    → Credit score floor applied
    → Employment or small business path unlocked
    → Secured credit card → rebuild
    → Achievement: "Phoenix" on recovery threshold
```

## 13.4 Preventative Systems (Pre-Failure)

| System | Player Tool |
|---|---|
| Cash runway alert | Banking dashboard warning at <3 months |
| Stress warning | Home vitals yellow/red |
| Covenant monitor | Company dashboard compliance strip |
| Relationship decay | Family meter + suggested actions |
| Diversification hint | Portfolio concentration warning |

---

# 14. Generational Play & Succession

Generational play is **first-class**, not epilogue. Death is a transition mechanic (Constitution Article IV).

## 14.1 Succession Triggers

| Trigger | Player Choice |
|---|---|
| Natural death | Select heir or create new citizen |
| Early death (optional) | Same |
| Voluntary retirement + step back | Play as promoted heir CEO |
| Dynasty challenge (future) | Contested inheritance event |

## 14.2 Heir Selection

**Eligible heirs:** Children, spouse (jurisdiction-dependent), designated non-family (will), business partner (by contract).

| Factor | Effect |
|---|---|
| Relationship quality | Acceptance, dispute probability |
| Competence (Human Capital) | Company survival under heir |
| Player prep (mentorship) | Skill transfer bonus |
| Dynasty reputation | Starting doors + scrutiny |

## 14.3 Inheritance Mechanics

| Element | Rule |
|---|---|
| **Estate tax** | Progressive; teaches planning |
| **Debts** | Paid before distribution |
| **Disputes** | Systemic if relationship poor + ambiguous will |
| **Trusts** | Player-established pre-death; reduces tax, controls timing |
| **Business succession** | Separate from cash — voting control vs economic interest |
| **Philanthropic pledges** | Binding on estate |

## 14.4 Playing the Heir

| Aspect | Design |
|---|---|
| **Starting age** | Young adult default; player may choose |
| **Knowledge transfer** | Partial skill inheritance via mentorship — not 100% |
| **Name effects** | Dynasty reputation modifier |
| **Fresh agency** | Heir has own personality (CDPS); not player clone |
| **Timeline** | Continuous — parent's life archived, heir chapter begins |

## 14.5 Dynasty End Conditions

| Condition | Result |
|---|---|
| No eligible heirs + no new citizen | Life archive; Legacy Score finalized |
| Dynasty achievement thresholds met | Hall of Legends entry |
| Player starts new life same world | New citizen; old dynasty persists in world |

## 14.6 Generational Loop Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Generation 1│────►│  Generation 2│────►│  Generation 3│
│  Found wealth│     │  Grow / risk │     │  Institutionalize│
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
                            ▼
                   ┌─────────────────┐
                   │ Legacy Score    │
                   │ Dynasty rep     │
                   │ World Memory    │
                   └─────────────────┘
```

---

# 15. Multiplayer Touchpoints — Player-Facing

Fenix Life is **single-player sovereign simulation + Fenix Network social layer** (Product Bible §9, doc 24). Multiplayer never merges worlds or grants hidden advantages.

## 15.1 Player Mental Model

> *My world is mine. Friends appear at the edges — profiles, deals, visits — not in my street as MMO avatars.*

## 15.2 Feature Catalog — Player Experience

| Feature | What Player Does | What Player Does NOT Get |
|---|---|---|
| **Friends list** | Add, block, message | Free money, stat boosts |
| **Public profile** | Showcase career, company, achievements | Forced exposure of all finances |
| **Company profile** | Publish verified metrics | Fake numbers without flag |
| **Visit** | Tour friend's business (read-only) | Steal employees, loot |
| **Gift** | Send capped celebratory transfer | Unlimited laundering |
| **Money transfer** | Contractual help / loan | Instant whale boosting |
| **Partnership** | Co-found with contract terms | God-mode control of partner's sim |
| **Investment** | Angel check via contract | Guaranteed returns |
| **Leaderboards** | Opt-in rank by capital type | Mandatory competitive pressure |
| **Messaging** | Coordinate deals, roleplay | Unmoderated harassment |

## 15.3 Economic Transfer Rules — Player Visible

| Rule | Player-Facing Display |
|---|---|
| Daily/weekly caps | Transfer UI shows limit remaining |
| Relationship age gate | "Friend for 14 more days to unlock" |
| Gift tax | Preview before confirm |
| Cooling period | "Funds available in 72 hours" |
| Purpose tagging | Gift vs investment vs loan — different forms |

## 15.4 Async Deal Flow — Investment Example

```
Player A (investor)                    Player B (founder)
      │                                       │
      │  Browse company profile on Network    │
      │─────────── investment offer ─────────►│
      │                                       │ Review in-company notification
      │◄──────── accept / reject ─────────────│
      │                                       │
      │  Contract recorded on Network         │
      │  Both worlds apply locally            │
      │                                       │
      │  Returns on exit / dividend           │
      │◄─────── per performance ──────────────│
```

## 15.5 Privacy Controls

| Setting | Options |
|---|---|
| Net worth visibility | Private / friends / public |
| Family details | Private default |
| Company financials | Aggregated public / detailed friends / private |
| Online presence | Show/hide |

## 15.6 Fairness Test — Player Communication

In onboarding and transfer UIs, surface Constitution principle:

> *Connected players cannot earn simulation advantages unavailable to solo players through legitimate play.*

---

# 16. Content Scope — v1.0 EA vs Future

## 16.1 v1.0 Early Access — In Scope

| Domain | EA Content |
|---|---|
| **World** | 1 metro region, synthetic history, AI population |
| **Life** | Full aging, vitals, relationships, marriage, children, death |
| **Education** | School, university, 3–5 certification paths |
| **Career** | 8–12 job tracks, promotion, unemployment |
| **Finance** | Banking, credit, loans, bills, bankruptcy |
| **Business** | Incorporate, hire, product, revenue, seed/Series A, closure |
| **Investments** | Stock market, index funds, margin (limited) |
| **Real estate** | Buy, sell, rent, mortgage |
| **Vehicles** | Buy, finance, maintain |
| **Family** | Dating, marriage, divorce, children, basic will |
| **Succession** | Play heir, inheritance, dynasty score |
| **World sim** | NPC companies, news, economy cycles, offline advance |
| **Multiplayer** | Friends, profiles, visits, gifts (capped), leaderboards |
| **UI** | All screens in doc 34 §5 except future phone apps |

## 16.2 v1.0 EA — Out of Scope / Stub

| Domain | Status |
|---|---|
| International / FX | Future DLC |
| Crypto assets | Not planned EA |
| Political office gameplay | Stub only |
| Advanced supply chain | Simplified ops |
| Unions / collective bargaining | Future |
| Criminal justice arc | Future |
| Real-time co-op living | Not v1 |
| Mod marketplace | Post-EA per roadmap |
| Mental health deep sim | Basic stress only EA |

## 16.3 Post-EA Roadmap Themes (Player-Facing)

| Theme | Player Promise |
|---|---|
| **New regions** | Different economies, laws, cultures |
| **Institution builder** | Found university, hospital, league |
| **Advanced governance** | Elections, policy crafting |
| **Deeper healthcare** | Insurance gameplay, chronic illness |
| **Investment clubs** | Syndicate with friends |
| **Family constitution** | Dynasty governance document |
| **Historical scenarios** | Start in 1980, 2008, etc. |

---

# 17. Balancing Philosophy

## 17.1 Core Principles

| Principle | Application |
|---|---|
| **Honest economy** | Money conserved; sinks and sources explicit |
| **No solved meta** | Multiple viable strategies per era |
| **Regression possible** | Crashes, bankruptcy, divorce |
| **Time > grinding** | Long-term beats repetitive clicks |
| **AI symmetry** | NPC success/failure rates match player constraints |
| **Capitals trade off** | Cannot max all five without extreme time investment |

## 17.2 Balancing Levers (Designer-Facing Labels)

| Lever | Player-Facing Effect |
|---|---|
| Interest rate curves | Save vs borrow incentive |
| Wage indices | Career vs business attractiveness |
| Skill XP rates | Education ROI |
| Event hazard tables | Risk tolerance reward |
| AI aggression | Competitive pressure |
| Tax brackets | Optimization depth |
| Relationship decay rates | Social time cost |
| Legacy Score weights | Define "true" success emphasis |

## 17.3 Era Balancing — Economic Cycle

```
        Boom          Peak         Bust        Recovery
         │             │            │             │
   Hire easy      Asset high    Credit tight   Distressed
   Wages up       IPO window    Layoffs       opportunities
   Risk rewarded  Euphoria      Survival      Consolidation
```

Players who only know boom must learn bust — and vice versa.

## 17.4 Playtesting Metrics

| Metric | Healthy Range (EA Target) |
|---|---|
| Average first bankruptcy age | 35–50 (optional path) |
| % reaching retirement | 40%+ of long sessions |
| Heir continuation rate | 30%+ of deaths |
| Session 2 retention trigger | First job or first incorporation |
| Capital diversity in Hall of Legends | No capital >60% of entries |

---

# 18. Anti-Patterns — Forbidden Designs

Features exhibiting these patterns **must be redesigned** before ship (Constitution + Product Bible loop anti-patterns).

## 18.1 Gameplay Anti-Patterns

| ID | Anti-Pattern | Why Forbidden | Example Violation |
|---|---|---|---|
| AP-01 | Player-only lucky windfalls | Breaks Citizen Equality | "You found $10,000" random popup |
| AP-02 | Click-to-win business | No mastery, no teaching | "MAKE MONEY" button |
| AP-03 | Frozen world on menu | Violates Living World | AI pauses when player opens bank |
| AP-04 | Illusion of choice | Destroys trust | Two dialogue options, same outcome |
| AP-05 | Mandatory grinding | Unethical engagement | Repeat same action 100× for tier |
| AP-06 | Pay-to-win monetization | Citizen Equality | Buy credit score boost |
| AP-07 | Instant unexplained death | Unfair failure | Random heart attack at 30, no history |
| AP-08 | Quest log primary UI | Not emergent | Fetch quests disconnected from sim |
| AP-09 | Separate business tycoon mode | Breaks parallel loops | Life pauses in "company view" |
| AP-10 | Whale boosting via alts | Multiplayer corruption | Uncapped cross-account transfers |
| AP-11 | Stat inflation gear | Wrong progression model | "+5% all income" hat |
| AP-12 | Scripted global crisis | Not emergent | "Year 12 recession" always |
| AP-13 | NPC vending machine | Not believable life | Shopkeeper with no history |
| AP-14 | Magic money | Breaks economy | Unlabeled cash injection |
| AP-15 | Legacy erasure | World Memory violation | Reputation reset without cause |

## 18.2 UX Anti-Patterns

| ID | Anti-Pattern | Fix |
|---|---|---|
| UX-01 | Cluttered dashboard | F-pattern hierarchy (doc 34) |
| UX-02 | Hidden causal chain | Timeline + "why" panels |
| UX-03 | Game menu for diegetic systems | Use bank portal, not "Finance Menu" |
| UX-04 | Surprise irreversible action | Confirm + preview |
| UX-05 | Unreadable charts | Three-number rule |

## 18.3 Review Gate

Before feature ship, designer answers:

1. Does this violate any AP-ID above?
2. Which capital(s) does it strengthen/weaken?
3. Which loop layer (macro/meso/micro)?
4. Could an AI citizen use the same mechanic?
5. Does it leave World Memory trace?

---

# 19. Cross-Reference Index

## 19.1 Foundation Documents

| ID | Document | GDD Relationship |
|---|---|---|
| **00** | [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Vision, pillars, audience — parent |
| **01** | [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Law — cannot contradict |
| **02** | This document | Canonical gameplay spec |
| **03** | [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Implementation — referenced for scope |
| **04** | [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Persistence — not gameplay |

## 19.2 Companion Domain Specs (05–13) — Planned

When authored, these deepen GDD sections without replacing them:

| ID | Document | GDD Sections Enhanced |
|---|---|---|
| **05** | [05_Economy_Design.md](./05_Economy_Design.md) | §5.2, §8, §13, §17 |
| **06** | [06_Business_Systems_Design.md](./06_Business_Systems_Design.md) | §3, §5.5, §11.6–11.7 |
| **07** | [07_Career_Employment_Design.md](./07_Career_Employment_Design.md) | §4, §12.1, §12.4 |
| **08** | [08_Education_Design.md](./08_Education_Design.md) | §4.2–4.3, §11.10, §12.2 |
| **09** | [09_Family_Relationships_Design.md](./09_Family_Relationships_Design.md) | §5.4, §11.11, §14 |
| **10** | [10_Real_Estate_Housing_Design.md](./10_Real_Estate_Housing_Design.md) | §11.8, §5.2 |
| **11** | [11_Banking_Finance_Design.md](./11_Banking_Finance_Design.md) | §11.5, §13 |
| **12** | [12_Investment_Markets_Design.md](./12_Investment_Markets_Design.md) | §11.7, §5.2 |
| **13** | [13_Government_Tax_Design.md](./13_Government_Tax_Design.md) | §10, §14.3, §17 |

## 19.3 Simulation Core (14–16)

| ID | Document | GDD Relationship |
|---|---|---|
| **14** | [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Engine architecture — simulation implements GDD |
| **15** | [Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | World start, synthetic history |
| **16** | [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) | Personality, AI behavior, inheritance |

## 19.4 Core Simulation (17–24)

| ID | Document | GDD Relationship |
|---|---|---|
| **17** | [17_Time_Simulation_System.md](./17_Time_Simulation_System.md) | §9 time controls, gates, offline |
| **18** | [18_Economy_Engine.md](./18_Economy_Engine.md) | §5.2, §17 economy forces |
| **19** | [19_Company_Simulation.md](./19_Company_Simulation.md) | §3, §5.5, §11.6 |
| **20** | [20_Citizen_AI.md](./20_Citizen_AI.md) | Citizen Equality, NPC behavior |
| **21** | [21_Event_System.md](./21_Event_System.md) | §13 failures, emergence |
| **22** | [22_History_Engine.md](./22_History_Engine.md) | §11.12 Timeline, World Memory |
| **23** | [23_News_Engine.md](./23_News_Engine.md) | §11.13 News Feed |
| **24** | [24_Multiplayer_Architecture.md](./24_Multiplayer_Architecture.md) | §15 Fenix Network |

## 19.5 Production & Studio

| ID | Document | GDD Relationship |
|---|---|---|
| **34** | [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | §11 all screens — layout authority |
| **32** | [32_Art_Direction.md](./32_Art_Direction.md) | Visual execution |
| **33** | [33_Audio_Direction.md](./33_Audio_Direction.md) | Notification tiers |
| **37** | [37_Roadmap.md](./37_Roadmap.md) | §16 scope timing |
| **38** | [38_Backlog.md](./38_Backlog.md) | Feature inventory |
| **39** | [39_Project_Master_Index.md](./39_Project_Master_Index.md) | Doc registry |
| **41** | [41_Fenix_Glossary.md](./41_Fenix_Glossary.md) | Terminology |

---

# 20. Acceptance Criteria — Major Features

Tables define **player-facing done** for QA and design review. Engineering SLOs live in docs 17, 25, 29.

## 20.1 Character Creation & New Life

| ID | Criterion | Pass Condition |
|---|---|---|
| CC-01 | Background tradeoffs visible | Each background shows cash, education, connections, difficulty |
| CC-02 | No hidden player boosts | Simulation treats created citizen identically to AI equivalents |
| CC-03 | Preview updates live | Appearance and stats reflect selections |
| CC-04 | Confirmation gate | Summary screen before life start |
| CC-05 | World populated | News shows NPC activity on first day |

## 20.2 Home Screen & Navigation

| ID | Criterion | Pass Condition |
|---|---|---|
| HM-01 | Three-tap rule | All primary domains reachable in ≤3 taps |
| HM-02 | Five Capitals strip | Toggleable summary of all capitals |
| HM-03 | Activity feed | Shows last 10 events with deep links |
| HM-04 | Blocking gates visible | P0 notifications pinned above fold |
| HM-05 | Vitals affect gameplay | Low energy limits daily micro actions |

## 20.3 Time & Offline

| ID | Criterion | Pass Condition |
|---|---|---|
| TM-01 | Default running | New world time advances at 1× without pause |
| TM-02 | Gate blocking | Cannot advance past margin call unresolved |
| TM-03 | While You Were Away | Shows after 1+ hour offline |
| TM-04 | Catch-up integrity | Competitor/world events occurred during offline |
| TM-05 | Pause explicit | Pause stops world; quit-without-pause option in settings |

## 20.4 Banking & Personal Finance

| ID | Criterion | Pass Condition |
|---|---|---|
| BK-01 | Three key numbers | Net worth, cash flow, credit score above fold |
| BK-02 | Loan denial explained | Rejection shows DTI, credit, income factors |
| BK-03 | Autopay | Player can automate D3 bill pay |
| BK-04 | Bankruptcy path | Player can enter bankruptcy with explained chapters |
| BK-05 | Inflation effect | Idle cash loses purchasing power over years |

## 20.5 Company & Business

| ID | Criterion | Pass Condition |
|---|---|---|
| CO-01 | Symmetry | NPC companies use same incorporation rules |
| CO-02 | Hire pipeline | Post → candidates → interview → offer flow |
| CO-03 | Product quality tradeoff | Rush launch affects reputation in news |
| CO-04 | Delegation unlock | Manager role handles screening at threshold |
| CO-05 | Failure state | Insolvency triggers bankruptcy flow |

## 20.6 Career & Education

| ID | Criterion | Pass Condition |
|---|---|---|
| CE-01 | Credential gates | Licensed professions block unlicensed work |
| CE-02 | Skill decay | Optional; visible when enabled |
| CE-03 | Promotion systemic | Performance + skill + relationship, not random |
| CE-04 | Education ROI | Degree unlocks measurably different jobs |
| CE-05 | Unemployment | Job loss triggers search mechanics |

## 20.7 Investments & Real Estate

| ID | Criterion | Pass Condition |
|---|---|---|
| IN-01 | Margin call gate | Leverage breach blocks time advance |
| IN-02 | Price formation | Stock moves trace to earnings/sentiment |
| RE-01 | Mortgage approval | Credit and income checked |
| RE-02 | Rental income | Property generates cash flow with vacancy risk |
| RE-03 | Foreclosure | Default triggers recovery arc |

## 20.8 Family & Relationships

| ID | Criterion | Pass Condition |
|---|---|---|
| FA-01 | Relationship decay | Neglect reduces meter over time |
| FA-02 | Marriage economic effect | Shared assets, tax, expense changes |
| FA-03 | Children development | Time investment affects teen outcomes |
| FA-04 | Divorce consequence | Asset split, reputation, Timeline entry |
| FA-05 | Will / estate | Pre-death planning affects succession |

## 20.9 Life Stages & Death

| ID | Criterion | Pass Condition |
|---|---|---|
| LS-01 | Stage-appropriate agency | Childhood limited menu; adulthood full |
| LS-02 | Death telegraphed | No random death without health history |
| LS-03 | Epilogue | Timeline summary + Legacy Score shown |
| LS-04 | Succession choice | Heir or new citizen selectable |
| LS-05 | World Memory | Deceased citizen remains in news/history |

## 20.10 Living World & News

| ID | Criterion | Pass Condition |
|---|---|---|
| LW-01 | NPC independence | AI companies act while player in education |
| LW-02 | News causality | Headlines link to simulation events |
| LW-03 | Sector cycles | Boom/bust affects jobs and assets |
| LW-04 | Graduate pipeline | University releases workers to labor pool |
| LW-05 | No player centrality | World events occur without player involvement |

## 20.11 Multiplayer — Fenix Network

| ID | Criterion | Pass Condition |
|---|---|---|
| MP-01 | Sovereign worlds | Friend visit does not mutate local sim state |
| MP-02 | Transfer caps visible | UI shows limits and tax preview |
| MP-03 | Opt-in leaderboards | Default not forced competitive |
| MP-04 | Fairness test pass | No exclusive connected-player buffs |
| MP-05 | Async deals | Investment offer expires; no require online together |

## 20.12 Legacy & Meta

| ID | Criterion | Pass Condition |
|---|---|---|
| LG-01 | Legacy Score weights | All five capitals contribute |
| LG-02 | Dynasty persistence | Family name affects heir opportunities |
| LG-03 | Hall of Legends | Multiple achievement categories represented |
| LG-04 | No pay-to-win meta | Legacy unlocks cosmetic/scenario only |
| LG-05 | Inheritance friction | Tax, debt, disputes possible |

---

# 21. Appendices

## 21.1 Glossary — Core Gameplay Terms

| Term | Definition |
|---|---|
| **Citizen** | Any simulated person — player or AI |
| **Capital** | One of five success dimensions (Financial, Human, Social, Business, Legacy) |
| **World Memory** | Persistent historical record of consequential events |
| **Sovereign world** | Player's authoritative simulation instance |
| **Fenix Network** | Social and economic contract layer between worlds |
| **Gate (P0)** | Blocking decision preventing time advance |
| **Meso loop** | Monthly operational gameplay rhythm |
| **Legacy Score** | Cross-life meta progression metric |
| **Symmetry** | Player and AI obey same rules |

Full glossary: doc 41.

## 21.2 Feature → Pillar → Capital Map (Sample)

| Feature | Pillars | Capitals |
|---|---|---|
| Stock trading | II, IV | Financial |
| Marriage | I, VI | Social, Legacy |
| Incorporation | III, IV | Business, Financial |
| University | I, IV | Human |
| Succession | I, VI | Legacy, all |
| Leaderboards | V, VI | All (category-specific) |
| News feed | IV | All (context) |

## 21.3 Document Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Lead Systems Designer | Initial canonical GDD — full gameplay spec |

---

**End of Document 02 — Fenix Life Game Design Document v1.0**

*This document translates the Product Bible (00) and Design Constitution (01) into player-facing mechanics. Companion domain specs (05–13) will deepen individual systems. Simulation docs (14–24) implement this design. UI doc (34) defines presentation.*

— Fenix Life Creative Direction & Systems Design
