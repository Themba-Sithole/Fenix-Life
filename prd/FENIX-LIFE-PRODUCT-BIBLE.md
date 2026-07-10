# Fenix Life — Official Product Bible

**Document Version:** 1.0  
**Status:** Canonical — Single Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Creative Direction & Product Leadership  
**Audience:** Design, Engineering, Art, Audio, QA, Marketing, Live Ops, Community, Partners  

---

## Document Authority

This Product Bible is the **root document** for the entire Fenix Life project. Every future artifact—feature specs, technical design documents, database schemas, API contracts, UI screens, narrative content, balancing spreadsheets, marketing copy, and QA test plans—**must trace back to a section of this document**.

When a future decision conflicts with this Bible, one of three outcomes is permitted:

1. **Align the decision** with the Bible (preferred).
2. **Document a deliberate exception** in the relevant feature spec, citing the Bible section being modified and the rationale.
3. **Amend this Bible** through a formal versioned revision (major philosophy changes only).

No feature ships without identifying which Core Pillar(s) it serves.

---

## Table of Contents

1. [Vision Statement](#1-vision-statement)
2. [Mission Statement](#2-mission-statement)
3. [Design Philosophy](#3-design-philosophy)
4. [Core Pillars](#4-core-pillars)
5. [Player Experience](#5-player-experience)
6. [Target Audience](#6-target-audience)
7. [Core Gameplay Loop](#7-core-gameplay-loop)
8. [Progression Philosophy](#8-progression-philosophy)
9. [Multiplayer Philosophy](#9-multiplayer-philosophy)
10. [Living World Philosophy](#10-living-world-philosophy)
11. [Economy Philosophy](#11-economy-philosophy)
12. [Business Philosophy](#12-business-philosophy)
13. [Family Philosophy](#13-family-philosophy)
14. [Education Philosophy](#14-education-philosophy)
15. [Long-term Expansion Philosophy](#15-long-term-expansion-philosophy)
16. [Future DLC Philosophy](#16-future-dlc-philosophy)
17. [Mod Support Philosophy](#17-mod-support-philosophy)
18. [Accessibility Philosophy](#18-accessibility-philosophy)
19. [Ethical Monetization Philosophy](#19-ethical-monetization-philosophy)
20. [What Makes Fenix Life Different](#20-what-makes-fenix-life-different)

---

# 1. Vision Statement

## Statement

**Fenix Life is the deepest, most believable life and business simulation ever built—a premium 2D experience where one human life spans education, career, entrepreneurship, investment, family, and legacy across generations, inside a world that evolves whether the player is watching or not.**

## Why This Exists

Vision statements exist to prevent scope drift. Fenix Life is not a casual tap game, not an MMO, not a pure tycoon spreadsheet, and not a narrative visual novel. The vision anchors every trade-off: when engineering asks whether to simplify the loan approval system, the answer is measured against **depth + believability**, not against development speed alone.

The phoenix metaphor is intentional: players fail, rebuild, reinvest, and pass wealth and wisdom forward. The game celebrates **resilience and reinvention** across a lifetime—not a single jackpot moment.

## How It Affects Gameplay

- **Time is the primary resource.** Days, months, years, and decades matter. Short-term gains that destroy long-term potential must often be the wrong choice.
- **Systems interlock.** A player's credit score affects their mortgage, which affects cash flow, which affects whether they can hire, which affects company growth, which affects their stock price, which affects retirement timing.
- **Consequences persist.** Bankruptcy at 28 should still echo at 45. A neglected child should not magically become a loyal successor. Reputation is a slow asset and a fast liability.
- **Generational play is first-class.** Ending a life is not ending the game—it is a transition mechanic.

## How Future Systems Must Follow This

Any new system proposal must answer:

> *Does this make the simulation deeper, more believable, or more interconnected—or does it add noise?*

**Approved example:** A patent system where R&D outputs create defensible moats, licensing revenue, and litigation risk.  
**Rejected example:** A slot machine mini-game disconnected from the economy, added only for engagement metrics.

## Examples

| Player Moment | Vision Alignment |
|---|---|
| Player incorporates at 22, burns out at 27, takes a corporate job, buys a franchise at 35, exits at 52, mentors their child CEO at 60 | Full arc: depth, failure, recovery, legacy |
| Player skips education, wins a lottery event, buys everything, never interacts with business systems | **Misaligned** unless lottery is rare, taxed, and socially consequential |
| World news reports a competitor's IPO while player is in university | Believable living world; player feels embedded in an economy |

---

# 2. Mission Statement

## Statement

**We will deliver a premium, intelligently simulated modern life where players learn real-world thinking—financial literacy, leadership, planning, and ethics—by making meaningful choices inside a world that feels alive, fair, and worth returning to for years.**

## Why This Exists

Mission translates vision into **player-facing promise**. It tells us what we owe the player: not just content volume, but **competence, respect, and longevity**.

Fenix Life is positioned as a **premium** product. Premium does not mean pay-to-win; it means polish, coherence, depth, and trust.

## How It Affects Gameplay

- **Tutorialization through systems, not lectures.** Players learn compound interest because savings accounts and loan amortization behave correctly—not because a popup explains APR.
- **Fair failure.** Players should understand *why* they failed. Opaque random death events are antithetical to the mission unless they model genuine risk with mitigations.
- **Respect for time.** Quality-of-life tools (automation, delegation, notifications, fast-forward with limits) are mission-critical, not luxuries.

## How Future Systems Must Follow This

Every feature ships with:

1. **A teachable moment** (what real-world concept does this reinforce?)
2. **A failure explanation** (what telemetry or UI helps the player learn?)
3. **A long-term hook** (why does this matter 10 in-game years later?)

**Example — Hiring:**  
Mission-aligned: Interview pipeline, skill fit, culture mismatch, counteroffers, onboarding time.  
Mission-violating: Tap "Hire Best Employee" for gems.

## Examples

- A player who never starts a company can still "win" their definition of life via tenure, index investing, and family legacy.
- A player who embezzles funds faces legal, reputational, and relationship consequences—teaching trade-offs without moralizing cutscenes.

---

# 3. Design Philosophy

## Statement

**Clarity at the surface, depth beneath. Professional presentation, systemic soul. Fun through mastery, not through noise.**

## Why This Exists

Life sims often fail in one of two directions:

1. **Spreadsheet sims** — accurate but cold, alienating casual players.
2. **Event sims** — flavorful but shallow, with choices that do not compound.

Fenix Life must be a **third category**: a game that *looks and reads* like executive software (banking apps, Bloomberg terminals, HR dashboards) while *behaving* like an interconnected simulation engine.

## Core Design Tenets

### 3.1 — Information Rich, Never Cluttered

Every screen has hierarchy: primary decision → supporting data → contextual news/history.

**Why:** Business and life management are data-heavy. Hiding data creates distrust; dumping data creates paralysis.

**Gameplay effect:** Players feel like operators, not tourists.

**Future rule:** New UI must pass the "CEO Test"—would a competent adult recognize this layout from real professional tools?

### 3.2 — Meaningful Choice, Not Illusion of Choice

If two options lead to the same outcome within a rounding error, they should not be presented as distinct moral or strategic forks.

**Why:** Players detect fakery quickly in long-form sims.

**Gameplay effect:** Branching is expensive; we spend branching budget on careers, relationships, capital allocation, and ethics—not cosmetic dialogue.

### 3.3 — Emergence Over Script

Prefer systemic outcomes over bespoke scenes.

**Why:** Replayability and the Living World depend on combinatorial outcomes.

**Gameplay effect:** "My friend got acquired by a AI startup that pivoted from healthcare" should be a plausible sentence.

### 3.4 — Pacing With Breathing Room

Tension cycles: plan → execute → react → recover.

**Why:** Constant crisis fatigue destroys long sessions.

**Gameplay effect:** After a market crash, provide reconstruction tools (restructuring, refinancing, training grants) rather than only punishment.

### 3.5 — Diegetic Interface

Phone apps, bank portals, company dashboards, and news feeds are **in-world artifacts**.

**Why:** Immersion and modularity—new features often arrive as new apps or departments.

**Gameplay effect:** Unlocking "Investor Relations" feels like gaining capability, not clicking a tutorial checkbox.

## How Future Systems Must Follow This

Design reviews ask:

- What is the **primary decision** this screen supports?
- What **three numbers** must a player see to decide well?
- What **emergent story** can this system produce without custom writing?

## Examples

| System | Surface | Depth |
|---|---|---|
| Stock Market | Watchlist, charts, news | Sector cycles, insider reputation, margin calls, dividend policy |
| Family | Tree, birthdays, happiness | Inheritance law, divorce settlements, estrangement, nepotism risk |
| Education | Grades, schedule | Network effects, degree prestige decay, skills vs. credentials |

---

# 4. Core Pillars

## Statement

Six pillars hold the product up. **Every feature must map to at least one pillar.** Features that map to none are cut. Features that map to many are prioritized.

---

## Pillar I — **The Living Life**

*Live a complete human arc: health, relationships, identity, time, mortality.*

**Why:** Without human stakes, business is abstract. Without mortality, legacy is meaningless.

**Gameplay:** Aging, energy, stress, happiness, health events, marriage, children, retirement, death, playable heirs.

**Future systems:** Mental health, caregiving, immigration, criminal justice, hobbies—all must feed life stats and opportunity access.

**Example:** High stress reduces leadership effectiveness and increases medical costs—linking life to business.

---

## Pillar II — **The Living Economy**

*Money moves with rules. Markets breathe. Policy matters.*

**Why:** Wealth building is a fantasy players want to believe. Broken economies break trust.

**Gameplay:** Inflation, interest rates, credit, taxes, housing cycles, unemployment, sector booms/busts.

**Future systems:** Central bank decisions, trade policy, crypto/regulated assets (if added), pensions.

**Example:** Raising rates makes mortgages painful but savings attractive—forcing real trade-offs.

---

## Pillar III — **The Living Company**

*Build, operate, compete, delegate, exit.*

**Why:** Entrepreneurship is a core fantasy and the highest-expression mastery path.

**Gameplay:** Incorporation, hiring, product, marketing, operations, fundraising, M&A, IPO, bankruptcy.

**Future systems:** Supply chains, unions, regulatory compliance, ESG scoring.

**Example:** A rushed product launch boosts revenue then craters reputation when quality issues surface in news.

---

## Pillar IV — **The Living World**

*NPCs, institutions, and cities evolve off-screen.*

**Why:** Solipsistic worlds feel like Skinner boxes. Fenix Life must feel populated.

**Gameplay:** AI competitors, graduating students, resignations, city growth, government budgets, news.

**Future systems:** Elections, disasters, infrastructure, university research spillovers.

**Example:** A university produces engineers; local startups hire them; housing near campus appreciates.

---

## Pillar V — **The Living Network**

*Other players are real humans at the edges of your simulation.*

**Why:** Social proof, competition, cooperation, and status extend retention without MMO chaos.

**Gameplay:** Profiles, visits, gifts, investments, partnerships, leaderboards—with anti-abuse.

**Future systems:** Investment clubs, co-founder matching, asynchronous deal rooms.

**Example:** Friend invests seed capital; their public profile shows portfolio performance, not god-mode interference.

---

## Pillar VI — **The Living Legacy**

*Wealth, knowledge, and institutions outlive one character.*

**Why:** Generational play is the ultimate long-term retention and differentiation hook.

**Gameplay:** Inheritance, trusts, family offices, succession planning, dynastic reputation.

**Future systems:** Family constitutions, philanthropic foundations, contested wills.

**Example:** Player chooses between equal inheritance (fairness) and meritocratic control (company survival).

---

# 5. Player Experience

## Statement

**The player should feel like a citizen inside a believable modern economy—sometimes empowered, sometimes constrained, always able to see the next lever to pull.**

## Why This Exists

Experience is the **felt output** of all systems. Pillars describe structure; experience describes sensation.

Target adjectives (from product direction):

| Adjective | Meaning in Fenix Life |
|---|---|
| **Alive** | News changes behavior; NPCs act; markets move overnight |
| **Dynamic** | No solved meta for all playstyles |
| **Professional** | UI and language respect intelligence |
| **Immersive** | Diegetic tools, coherent world tone |
| **Rewarding** | Milestones, legacy score, social recognition |
| **Intelligent** | Systems respond logically to player strategy |
| **Realistic** | Friction, delay, bureaucracy—tempered for fun |
| **Fun** | Agency, surprise, mastery, expression |

## Experience Layers

### Layer 1 — Moment-to-Moment (seconds)

Taps, reads, micro-decisions: reply to email, approve PO, attend class.

**Design obligation:** Low friction, clear affordances, mobile-friendly where applicable.

### Layer 2 — Session (minutes to hours)

Monthly planning, hiring sprint, exam season, fundraising roadshow.

**Design obligation:** Clear goals, progress bars that mean something, natural stopping points.

### Layer 3 — Arc (in-game years)

Degree → career → business → wealth event → family → retirement.

**Design obligation:** Arc-specific content density without forcing scripts.

### Layer 4 — Meta (weeks of real time)

Achievements, leaderboards, legacy across lives, DLC regions, mods.

**Design obligation:** Respect returning players with summaries and "what changed while away."

## Emotional Journey

```
Curiosity → Competence → Confidence → Crisis → Adaptation → Mastery → Reflection → Legacy
```

**Why:** Matches real life entrepreneurship and adulthood.

**Gameplay:** Early game is forgiving with visible tutorials in systems; mid-game introduces compound consequences; late-game introduces succession and macro risk.

## How Future Systems Must Follow This

Ship features with an **Experience Note**:

- What emotion does this create?
- When in the arc is it strongest?
- What does the player tell a friend afterward?

## Examples

- **Good moment:** Board vote on acquisition; projected P&L impact shown; news covers outcome next week.
- **Bad moment:** Random popup "You feel sad -5 happiness" with no cause or remedy path.

---

# 6. Target Audience

## Statement

**Primary:** Adults 18–40 who enjoy systems-heavy simulation, career fantasy, and long-form progression.  
**Secondary:** Older strategy/tycoon players, finance-curious learners, cozy sim audiences seeking more depth.  
**Tertiary:** Content creators and education communities seeking emergent stories.

## Why This Exists

Audience definition prevents **false compromises**—we do not chase every demographic.

## Player Archetypes (Not Classes)

Players are not locked into archetypes; these are motivations.

| Archetype | Motivation | Systems Emphasis |
|---|---|---|
| **The Builder** | Create companies and products | R&D, hiring, operations |
| **The Climber** | Career prestige and income | Jobs, education, networking |
| **The Investor** | Wealth via markets and assets | Stocks, real estate, portfolios |
| **The Patriarch/Matriarch** | Family dynasty | Relationships, inheritance, legacy |
| **The Explorer** | Discover world content | City map, travel, events, news |
| **The Competitor** | Rank and status | Leaderboards, net worth races, acquisitions |
| **The Storyteller** | Emergent narrative | Choices, relationships, news feed |

## Why Archetypes Matter for Gameplay

- Onboarding can **suggest** paths without railroading.
- Achievements span archetypes so no single playstyle dominates "completion."
- Difficulty modifiers can target pain points (e.g., "Volatile Economy" for investors).

## Accessibility of Audience Goals

"Premium" assumes:

- PC-first with potential tablet support.
- Sessions from 10 minutes (phone checks) to 3 hours (year planning).
- Players comfortable reading charts and text.

## How Future Systems Must Follow This

- **Never require** one archetype to play another's content to win their own definition of success.
- **Always allow** multi-archetype builds (CEO investor parent).
- Localize for regions without stripping economic realism—adjust names, currency display, and legal flavor, not core logic.

## Examples

- Achievement: "Self-Made" (zero inheritance, net worth threshold) vs. "Born Ready" (turn family business around from near-bankruptcy).
- Creator content: 100-year dynasty timelapse vs. speedrun to IPO.

---

# 7. Core Gameplay Loop

## Statement

**Observe → Plan → Act → Resolve → Advance Time → React to World → Repeat—across life, work, and wealth layers simultaneously.**

## Why This Exists

Loops define what players **literally do** every minute. Fenix Life runs **nested loops** because life is not turn-based in one domain only.

## Macro Loop (Life)

```
Birth / Create Character
    → Childhood & Education (guided autonomy)
    → Adulthood (full agency)
    → Career & Business Layer active
    → Family Layer active
    → Aging & Retirement
    → Death / Succession
    → Play as Heir (optional continuation)
```

**Time cadence:** Real-time with pause, or player-controlled time advance (day/week/month/year) depending on mode—**time advancement must never skip unresolved critical decisions without warning.**

## Meso Loop (Monthly — Default Operational Beat)

| Phase | Player Actions | World Actions |
|---|---|---|
| **Observe** | Review dashboards, news, notifications | Markets tick, NPC companies act |
| **Plan** | Budget, hiring, courses, investments | Policy announcements, competitor moves |
| **Act** | Job tasks, business commands, social actions | Applications processed, deals progress |
| **Resolve** | Payroll, loan payments, exams, reviews | Events fire, relationships update |
| **Advance** | End month | Economy simulation step |

## Micro Loop (Daily / Event)

Individual interactions: interview, date, pitch investor, buy vehicle, attend lecture.

**Design rule:** Micro loops must **feed meso outcomes** (skill XP, relationship delta, deal progress %).

## Parallel Loops

Players simultaneously manage:

1. **Personal** — health, relationships, happiness
2. **Professional** — job or unemployment path
3. **Financial** — cash, credit, assets, liabilities
4. **Corporate** — if applicable, full company sim
5. **Social Network** — friends, reputation, online profile

**Why parallel:** Prevents "business mode" from feeling like a separate game glued on.

## Loop Anti-Patterns (Forbidden)

- **Idle waiting** with nothing to plan (fix: events, emails, news, training).
- **Mandatory micromanagement** at empire scale (fix: managers, automation, delegation).
- **Surprise instant death** without telegraphing.

## How Future Systems Must Follow This

New mechanics must declare:

- Which loop layer they belong to.
- What triggers their resolution.
- What they output to other loops.

## Examples

**Month start:** Player sees "Cash runway: 4 months" + "Employee morale declining" + "Exam in 2 weeks."  
**Player acts:** Raises prices, schedules team event, studies twice.  
**Month end:** Revenue up, one employee still quits, grade improves, competitor undercuts in news.

---

# 8. Progression Philosophy

## Statement

**Progression is multidimensional, uneven, and permanent unless explicitly reversible. Power comes from knowledge, assets, relationships, and reputation—not from character level alone.**

## Why This Exists

Single-axis progression (XP → level) cannot model life. Fenix Life progression must feel **organic**.

## Progression Axes

### 8.1 — Skills & Knowledge

Hard skills (coding, finance, medicine), soft skills (leadership, charisma, negotiation).

**Properties:** Decay if unused (tunable), synergize in combos (finance + leadership → better CFO performance).

### 8.2 — Credentials

Degrees, certifications, licenses.

**Properties:** Gate access (cannot practice law without bar), depreciate if outdated (tech certs).

### 8.3 — Wealth & Net Worth

Cash, equities, real estate, business equity, collectibles.

**Properties:** Non-linear power—first $100k matters more psychologically than tenth million for some systems.

### 8.4 — Career Capital

Title, network, industry reputation, publication history.

**Properties:** Unlocks board seats, speaking fees, advisor roles.

### 8.5 — Social & Family Capital

Relationship quality, children stats, dynasty reputation.

**Properties:** Affects inheritance willingness, nepotism backlash, political connections.

### 8.6 — Legacy Score

Meta progression across lives—documented achievements, family continuity, institutions founded.

**Properties:** Cosmetic + unlocks (family traits, starting scenarios), never raw pay-to-win.

## Pacing Principles

1. **Early wins, escalating complexity** — first job, first savings goal, first hire.
2. **Step-function unlocks** — incorporation, mortgage approval, IPO eligibility.
3. **Plateaus are real** — mid-career stagnation mirrors life; provide side paths.
4. **Regression is possible** — bankruptcy, divorce, scandal, market crash.

## Difficulty & Starting Backgrounds

Starting conditions (wealthy family, orphan, immigrant, entrepreneur family) alter **starting capital and access**, not **ceiling**. Orphan → billionaire must remain theoretically possible, just harder.

## How Future Systems Must Follow This

- Declare which axis(es) a reward affects.
- Avoid "+5% to everything" gear-style rewards.
- Prefer unlocks that **change available decisions**, not flat stat inflation.

## Examples

| Event | Progression Impact |
|---|---|
| MBA completion | Credential gate + network NPC pool |
| Failed startup | Skill gain, reputation hit, investor relationship damage |
| Child graduates | Family capital + optional successor candidate |

---

# 9. Multiplayer Philosophy

## Statement

**Fenix Life is a single-player simulation with a social layer—not an MMO. Each player owns their world instance. The Fenix Network connects lives at intentional, moderated touchpoints.**

## Why This Exists

MMO life sims collapse under synchrony, griefing, and narrative incoherence. Pure offline sims miss status, cooperation, and async delight.

Fenix Network is the **bridge**: friends are real; economies are personal.

## Core Principles

### 9.1 — Sovereign Simulation

Your bank, your city simulation, your employees resolve locally. Friends do not "walk into your simulation" as avatars in the street.

**Why:** Preserves time control, mod support, and performance.

**Gameplay:** Visiting a friend's business is a **curated presentation layer** (showroom, public metrics, optional tour)—not full world merge.

### 9.2 — Opt-In Visibility

Profiles, companies, and assets are public, friends-only, or private by default sensibly (private by default for minors if youth content ever exists).

### 9.3 — Limited Economic Transfer

Gifts and money sends are **emotionally meaningful because capped and monitored**.

### 9.4 — Cooperation Without Carry

Partnerships and investments help both sides but cannot trivialize solo progression for new accounts receiving whale transfers.

### 9.5 — Competitive Status, Not Combat

Leaderboards: net worth, legacy, company valuation, philanthropy, education achievements—not PvP raids.

## Fenix Network Feature Set

| Feature | Purpose | Abuse Risk |
|---|---|---|
| Friends list | Social graph | Harassment → block/report |
| Public profiles | Status & discovery | Privacy → granular settings |
| Company profiles | Showcase & fundraising | Misrepresentation → verified metrics flag |
| Business visits | Aspiration & learning | N/A (read-only) |
| Gifts | Celebration | RMT, laundering → limits |
| Limited money transfer | Help / deals | Boosting → caps, fees, delays |
| Business partnerships | Revenue share deals | Collusion → audit triggers |
| Invest in friends' companies | Angel sim | Pump-and-dump → holding periods, disclosures |
| Investment groups | Syndicates | Ring schemes → group limits |
| Leaderboards | Competition | Smurf accounts → rank tiers by account age |

## Anti-Abuse Framework (Design-Level)

All large transfers must pass:

1. **Relationship age gate** — known friends longer than X days.
2. **Velocity caps** — daily/weekly/monthly send limits by account tier.
3. **Purpose tagging** — gift vs. investment vs. loan (loans use contract system).
4. **Cooling periods** — funds not instantly withdrawable to alt accounts.
5. **Anomaly detection** — circular transfers, mule patterns.
6. **Optional tax/friction** — large gifts incur in-game gift tax (teaches realism + sinks value).

**Why:** Protects economy integrity and leaderboard meaning.

## Asynchronous by Default

No requirement to be online simultaneously. Deal proposals, investment offers, and visit logs are async.

## How Future Systems Must Follow This

- Multiplayer touches **never** become mandatory for core solo progression.
- New social features ship with **privacy + abuse review** alongside fun design.
- Cross-player economic effects are **indirect** (market sentiment, news) unless explicitly opted in.

## Examples

- Player A visits Player B's auto dealership chain; sees public satisfaction rating and decor—cannot steal employees.
- Player A invests in Player B's seed round via Fenix Network contract; returns paid when B's company profitable or at exit.
- Player tries to send $10M to new alt → blocked; flagged for review.

---

# 10. Living World Philosophy

## Statement

**The world simulates forward continuously. Institutions have agendas. NPCs have careers. Cities have land use. History accumulates. Nothing important should feel like it existed only because the player looked.**

## Why This Exists

This is the **primary technical and creative differentiator**. Scripted life sims exhaust content; living worlds scale through systems.

## Simulation Layers

### 10.1 — Institutional Layer

Governments, banks, universities, regulators, media.

- Governments: tax policy, zoning, grants, enforcement.
- Banks: underwriting models, rate changes, foreclosure.
- Universities: admissions, research output, alumni networks.
- Media: news generation from real events.

### 10.2 — Corporate Layer (NPC)

Companies hire, fire, launch products, fail, merge.

- Same rules as player companies wherever possible (**symmetry principle**).
- Asymmetric advantages only where human creativity warrants (player-led pivots).

### 10.3 — Labor Layer

Individuals seek jobs, quit, retire, skill up.

- Talent pools are spatially and sectorally distributed.
- Poaching is a real mechanic.

### 10.4 — Urban Layer

Cities grow: residential demand, commercial rents, traffic (abstracted), districts.

- Inspired by Cities: Skylines **outcomes**, not 1:1 city builder gameplay.
- Map is navigable 2D Fenix city; simulation is region-based.

### 10.5 — Market Layer

Stocks, commodities (if any), real estate indices.

- Prices emerge from earnings, sentiment, policy, shocks.

## The Symmetry Principle

**If the player can do it, the world should be able to do it too** (incorporate, IPO, default, get acquired).

**Why:** Prevents "player is the only real agent" syndrome.

## Event Generation Model

Events are **reports of simulation**, not dice rolls from nowhere.

**Bad:** "Random event: you found $500."  
**Good:** "Neighborhood redevelopment increased your property value 8% following city council vote reported last month."

## Off-Screen Continuation

When player advances time, world ticks:

- Competitor R&D completes.
- Friend's public company files earnings (from their save via Network abstraction).
- University releases graduates into workforce pool.

## How Future Systems Must Follow This

- Every event needs a **cause graph** (even if hidden until investigation/news).
- NPC agents use **bounded rationality**, not omniscient cheating—unless villain scenarios.
- Performance budgets use aggregation at city/sector level with detail on interaction.

## Examples

| Headline | Underlying Simulation |
|---|---|
| "NovaTech lays off 12% amid sector slowdown" | NPC firm missed earnings; rates up; demand down |
| "Metro U expands CS program" | City tech jobs grew; grants approved |
| "Housing affordability crisis in Bay District" | Zoning restrictive + high-paid migration |

---

# 11. Economy Philosophy

## Statement

**The economy is a closed-but-open system: money is conserved with intentional sinks and sources, markets express belief about the future, and policy reshapes incentives—not a slot machine with dollar signs.**

## Why This Exists

Broken sim economies destroy late game. Players are financially literate; they will exploit arbitrage unless designers respect their intelligence.

## Currency & Accounting

- **Personal finance:** cash, checking, savings, credit, loans, assets at fair value.
- **Corporate finance:** GAAP-inspired simplification—revenue recognition, opex, capex, depreciation, tax.
- **No magic money** except explicitly labeled grants, cheats, or narrative scenarios.

## Core Economic Forces

| Force | Player Feeling | Design Lever |
|---|---|---|
| Inflation | Cash erodes | Wage index, price indices |
| Interest rates | Borrowing/saving trade-off | Central bank NPC |
| Credit cycle | Easy then tight money | Bank lending standards |
| Labor market | Hiring easy/hard | Unemployment, skills mismatch |
| Asset cycles | FOMO and regret | Bubbles with fundamentals underneath |
| Taxation | Optimization gameplay | Brackets, deductions, corporate tax |
| Bankruptcy | Real failure state | Chapters with different consequences |

## Sinks & Sources (Long-Term Balance)

**Sources:** wages, business profit, dividends, asset appreciation, inheritance, gifts (limited).

**Sinks:** consumption, taxes, maintenance, depreciation, interest, fees, fines, healthcare, education, gift tax, transaction costs.

**Why:** Prevents hyperinflation of wealth in multi-generational play.

## Financial Literacy as Gameplay

Players who understand:

- Compound interest → win slowly.
- Leverage → win fast or die fast.
- Diversification → survive crashes.
- Runway → survive startup phase.

**No homework required**—systems teach by feedback.

## Market Manipulation Safeguards

Player and NPC actions move prices within **liquidity constraints**. Pumping penny stocks is possible but self-limiting via regulation, float, and insider rules.

## Regional Economies

Multiple cities/regions can differ in cost of living, industry mix, policy.

**Future expansion:** International markets with FX (DLC or base scope decision per roadmap).

## How Future Systems Must Follow This

- New assets must have **valuation logic**, not static prices.
- Economic patches require **save compatibility plan** or migration.
- All formulas documented in Economy Spec derived from this philosophy.

## Examples

- Player keeps cash during inflationary era → net worth lags peers in real estate.
- Player leverages rentals before rate hike → cash flow crisis triggers forced sale headline.

---

# 12. Business Philosophy

## Statement

**Building a company is the game's highest-expression mastery path—combining people, product, capital, and strategy inside the same rules the world uses.**

## Why This Exists

Business sim fans are a core constituency (Game Dev Tycoon, Startup Company, Software Inc., Capitalism Lab). Fenix Life integrates business **into life**, not beside it.

## Company Lifecycle

```
Idea → Validation → Formation → Team → Product/Service → Go-to-Market
    → Growth → Optional Funding Rounds → Scale → Maturity
    → Exit (IPO, Acquisition, Family Succession) OR Decline → Bankruptcy
```

Each stage changes dominant UI and decisions.

## Departments as Gameplay Vectors

| Department | Decisions | Failure Mode |
|---|---|---|
| **Product/R&D** | Features, quality, roadmap | Obsolescence, bugs scandal |
| **Marketing** | Brand, campaigns, CAC | Cash burn, false promises |
| **Sales** | Pricing, channels, deals | Revenue miss |
| **Operations** | Capacity, suppliers, logistics | Bottlenecks, quality drift |
| **HR** | Hire, train, culture, comp | Turnover, unionization |
| **Finance** | Budget, runway, fundraising | Insolvency |
| **Legal/Compliance** | Contracts, IP, regulatory | Fines, lawsuits |
| **Executive** | Strategy, M&A, board relations | Misalignment, coup |

## People Are Not Spreadsheets

Employees have stats (productivity, creativity, leadership, loyalty, stress) but also **preferences and history**.

Inspired by Football Manager: depth on individuals matters at scale with delegation.

## Funding & Ownership

- Bootstrapping, friends & family, angels, VC, PE, IPO.
- Dilution is real; cap table tracked.
- Investor relations is relationship management, not a menu click.

## Competition & Moats

Moats from brand, patents, network effects, scale, switching costs—**earned in simulation**, not trait cards.

## Ethics & Reputation

Cutting corners boosts short-term margin; long-term risk via regulation, employee whistleblowing, customer churn.

**Why:** Aligns with mission—ethical business is a viable strategy, not just moralizing.

## Player Role Transition

Founder → CEO → Chairman → Passive owner → Heir CEO.

Delegation must scale: at 500 employees, player sets strategy and reviews KPIs unless they choose micromanagement challenge mode.

## How Future Systems Must Follow This

- Corporate features use **same economic and legal rules** as NPC firms.
- New industries (DLC) plug into department template with industry-specific verbs.
- Business UI references Company Dashboard patterns established in UI bible.

## Examples

- Launching MVP early captures market but spawns negative reviews affecting hiring.
- Board rejects acquisition offer; stock dips; media speculates.
- Nepotism hire of child tanks department morale unless child is qualified.

---

# 13. Family Philosophy

## Statement

**Family is a parallel wealth and meaning system—love, obligation, genetics, conflict, and inheritance shape the game as profoundly as any balance sheet.**

## Why This Exists

BitLife proved family drama engages; The Sims proved household management delights. Fenix Life unifies family with **serious economic legacy**.

## Relationship Model

Relationships are **bidirectional meters with history**: trust, romance, conflict, dependency.

- Partners: dating, cohabitation, marriage, prenup, divorce.
- Children: nurture, education funding, favoritism consequences.
- Extended family: obligations, inheritance politics, cultural expectations.

## Family ↔ Economy Links

| Link | Gameplay |
|---|---|
| Dual income | Household cash flow |
| Divorce | Asset split, alimony, child support |
| Inheritance | Liquidity events, tax, rivalry |
| Nepotism | Company roles for family |
| Life insurance | Risk management |
| Trusts | Control vs. tax planning |

## Children as Characters

Children age, develop stats, form personalities influenced by parenting style and genetics (light, non-deterministic).

**Playable handoff:** At death or retirement, player may continue as chosen heir.

## Dynasty Systems

- **Family reputation** (separate from personal): affects political/business doors.
- **Legacy assets:** family home, crest, foundation, multi-gen company.
- **Family tree UI** is canonical presentation (see UI spec).

## Dark but Tasteful Realism

Infidelity, estrangement, addiction, and death exist with **mature handling**—not gratuitous, always with player agency and support resources where appropriate.

## How Future Systems Must Follow This

- Major financial events check **family legal structure**.
- Achievements for family paths equal business paths.
- Multiplayer: family data private by default; share milestones opt-in.

## Examples

- Player skips child's graduation → relationship penalty → child refuses succession role.
- Equal three-way inheritance splits company voting control → stalemate event.
- Player funds spouse's business → joint tax optimization opportunity.

---

# 14. Education Philosophy

## Statement

**Education is investment with uncertain ROI—credentials open doors, skills enable performance, and networks create luck.**

## Why This Exists

Education gates careers and signals competence. It must be **neither mandatory grind nor useless checkbox**.

## Education Stages

1. **Primary/Secondary** — foundational stats, childhood opportunities.
2. **Higher Education** — university, majors, GPA, debt.
3. **Continuing Education** — certs, executive education, self-study.
4. **Experiential** — internships, apprenticeships, founder path without degree.

## Multiple Valid Paths

| Path | Strength | Risk |
|---|---|---|
| Ivy league MBA → finance | Network, gates | Debt, delayed earnings |
| Trade certification | Early income | Lower ceiling in some sectors |
| Dropout founder | Speed, upside | Bias from investors |
| Self-taught engineer | Low cost | Credential friction |

**No single path dominates all endings.**

## Systems

- **Courses & exams** — time cost vs. energy.
- **Student loans** — realistic amortization; forgiveness programs as policy events.
- **Networking** — classmates become hires, cofounders, investors.
- **Career fairs** — pipeline to jobs.
- **Grade inflation resistance** — top jobs require top performance.

## University as Living Institution

Universities produce graduates into labor pool, publish research boosting local tech, and appear in news.

## How Future Systems Must Follow This

- Jobs declare **requirements** (hard vs. soft).
- Education content expands via DLC regions (e.g., European apprenticeship tracks).
- Child education is parental gameplay, not autopilot.

## Examples

- Player works full-time while studying → stress up, slower degree, less debt.
- Alumni event unlocks angel investor contact.
- Industry shifts make player's degree less relevant; continuing education required.

---

# 15. Long-term Expansion Philosophy

## Statement

**Fenix Life is a platform for decades of content—new industries, regions, mechanics, and social features ship as cohesive expansions to the living simulation, not as disconnected mini-games.**

## Why This Exists

A project of this scope cannot ship everything in v1. Expansion philosophy prevents **feature orphaning** and technical debt.

## Expansion Types

### 15.1 — Vertical Depth

Deeper systems in existing domains: advanced derivatives, family law, medical careers.

### 15.2 — Horizontal Breadth

New industries: healthcare, entertainment, logistics, energy.

### 15.3 — Geographic Breadth

New countries/cities with legal and economic flavor.

### 15.4 — Social Depth

Investment clubs, mentorship, asynchronous co-op companies (high complexity—late roadmap).

### 15.5 — Generational Depth

Deeper dynasty mechanics, historical archives, family AI personas.

## Platform Principles

1. **Backwards-compatible saves** where possible; migration tools when not.
2. **Mod API stability** tiers (stable, experimental).
3. **Feature flags** for gradual rollout.
4. **Simulation budgets** — expansions cannot 10x tick time without optimization mandate.

## Live Operations (Non-Predatory)

Seasonal leaderboards, community challenges, news templates—thematic rotation without pay-to-win.

## Roadmap Layering (Illustrative)

| Era | Focus |
|---|---|
| **Foundation** | Core life, career, city, personal finance, basic business |
| **Growth** | Advanced business, public markets, real estate depth, Fenix Network |
| **Maturity** | Generational legacy, policy depth, international |
| **Platform** | Mod marketplace, creator tools, education partnerships |

## How Future Systems Must Follow This

- Expansions attach to **pillars** and **loops** explicitly.
- Cross-expansion dependencies documented (e.g., international FX requires economy v2).
- No expansion invalidates base game success paths.

## Examples

- "Healthcare Empire" expansion adds hospital company type + medical career path + insurance regulation—not a separate hospital tycoon exe.

---

# 16. Future DLC Philosophy

## Statement

**DLC sells new worlds, industries, and scenarios—not power, not pay-to-win shortcuts, not fragmented base-game features held hostage.**

## Why This Exists

Premium positioning requires **trust**. Players must believe base game is complete life sim; DLC is **more life**, not fixing base.

## DLC Categories

### A — Region Packs

New nation/city cluster: laws, names, industries, universities, housing styles.

**Gameplay:** Start there or migrate; FX and trade if enabled.

### B — Industry Packs

Deep vertical: e.g., "Entertainment & Media," "Manufacturing & Supply Chain."

**Gameplay:** New company types, careers, products, news templates.

### C — Scenario Packs

Curated starts: "Dot-Com Boom Child," "Post-Crisis Immigrant," "Family Office Heir."

**Gameplay:** Balanced achievements; leaderboard categories.

### D — Cosmetic & Presentation

Avatar clothing, office decor, vehicle skins, profile themes.

**Gameplay:** Zero stat advantage.

### E — Soundtrack & UI Skins

Optional aesthetic packs.

## DLC Design Rules

1. **Self-contained value** — worth buying alone if you own base.
2. **Integrates with Living World** — NPCs can use DLC industries even if player doesn't own DLC (player interaction may require DLC).
3. **No combat power** — ever.
4. **Clear labeling** on store pages: simulation additions vs. cosmetics.

## Pricing Philosophy

Premium DLC reflects depth hours, not item count. Smaller cosmetic DLC priced accessibly.

## How Future Systems Must Follow This

- Base game achievement list completable without DLC.
- DLC features hook into mod API where possible.
- DLC news/events appear in global feed as optional texture.

## Examples

| Good DLC | Bad DLC |
|---|---|
| "Asia Pacific Markets" — 3 cities, FX, stocks | "$5 unlock mortgages" |
| "Biotech Frontier" — R&D pipeline, FDA-like approval | "2x income forever" |
| "Luxury Lifestyle" cosmetics | Paywall basic family tree |

---

# 17. Mod Support Philosophy

## Statement

**Mods extend Fenix Life's lifespan and creativity—official tools empower communities to add industries, events, regions, and UI themes without breaking the core simulation contract.**

## Why This Exists

Games in this genre live for years via mods (Capitalism Lab, Sim ecosystem). Fenix Life should **embrace** community extension with guardrails.

## Modding Layers

| Layer | Examples | Risk |
|---|---|---|
| **Data** | New jobs, products, names, events | Balance |
| **Rules** | Economy tuning, difficulty packs | Multiplayer fairness |
| **Presentation** | UI skins, themes | Low |
| **Total conversions** | Fantasy life sim using engine | Brand separation |

## Official Mod API (Target)

- Schema-validated JSON/YAML for definitions.
- Scripting sandbox for events (Lua or similar—implementation TBD).
- Versioned API with deprecation policy.
- Steam Workshop / in-game browser (platform TBD).

## Multiplayer & Mods

Ranked leaderboards use **vanilla or approved mod profiles**. Friends can agree on mod sets.

**Why:** Prevents "supermod" accounts.

## Quality & Safety

- Disclosure when mods active.
- No official support for game-breaking mods.
- Moderation for offensive content in shared workshop.

## How Future Systems Must Follow This

- Core systems expose **data-driven hooks** from day one.
- Hardcode only what must be secure (Network economy, anti-cheat).
- Document formulas modders need.

## Examples

- Mod adds "Legal cannabis industry" with state-by-state rules.
- Mod replaces city names for roleplay; economy unchanged.
- Total conversion "Medieval Merchant" rejected from official leaderboard but shareable.

---

# 18. Accessibility Philosophy

## Statement

**Accessibility is inclusion and usability—players of varying abilities, ages, and platforms must be able to manage their life and business without unnecessary friction.**

## Why This Exists

Complexity is our product; **inaccessibility is not**. Depth and accessibility are allies when UI is well-structured.

## Pillars of Accessibility

### 18.1 — Visual

- Scalable UI text and icons.
- Colorblind-safe charts (patterns, not color alone).
- High contrast theme.
- Reduced motion option.

### 18.2 — Cognitive

- Clear tutorials via systems.
- Glossary for financial terms.
- Notification prioritization (critical vs. informational).
- "Advisor mode" suggestions (optional, not condescending).

### 18.3 — Motor

- Remappable controls.
- Large touch targets on mobile/tablet if supported.
- No essential rapid-click challenges.

### 18.4 — Auditory

- Subtitles for any voiced content.
- Visual equivalents for audio cues.

### 18.5 — Time & Stress

- Pause anytime in single-player.
- Adjustable simulation speed caps.
- Difficulty sliders for economic volatility—not "easy mode deletes systems."

## Language & Localization

- Plain language option for financial labels.
- Full localization roadmap for major markets.

## How Future Systems Must Follow This

- New UI components pass accessibility checklist.
- Charts export/table view alternative.
- No exclusive information in color alone.

## Examples

- Credit score chart uses pattern fill + numeric band labels.
- Advisor whispers: "Your runway is below 3 months—consider reducing opex or raising bridge capital."

---

# 19. Ethical Monetization Philosophy

## Statement

**Fenix Life is a premium purchase with optional cosmetic and expansion DLC. We do not sell power, currency, or unfair shortcuts. We respect player time and intelligence.**

## Why This Exists

Life sims often destroy trust with energy timers and pay-to-win. Premium positioning **requires** ethical monetization as a competitive advantage.

## Revenue Model (Target)

| Stream | Allowed | Notes |
|---|---|---|
| Base game purchase | ✅ | Core experience complete |
| DLC expansions | ✅ | Per DLC philosophy |
| Cosmetics | ✅ | No gameplay stats |
| Season pass (cosmetic + DLC bundle) | ✅ | Clear contents |
| Subscription | ⚠️ | Only if tied to cloud features/content pass—not power |
| In-game currency sales | ❌ | |
| Pay-to-skip failure | ❌ | |
| Loot boxes | ❌ | |
| Energy timers blocking life progress | ❌ | |

## Fenix Network Monetization

- Profile cosmetics, company branding packs—okay.
- Pay for leaderboard placement—never.
- Boost gifts/transfers—never.

## Ethical Dark Patterns (Forbidden)

- False urgency sales tied to in-game survival.
- Obscured odds.
- Preying on gambling psychology in stock mini-games.

## How Future Systems Must Follow This

- Monetization review gate for all features.
- If it feels like mobile F2P, reject.

## Examples

- Player buys "Executive Office Suite" skin pack—boardroom looks richer, numbers unchanged.
- Player cannot buy "Instant IPO Success."

---

# 20. What Makes Fenix Life Different

## Statement

**Fenix Life is the convergence no existing title fully delivers: BitLife's life breadth, tycoon depth, fintech realism, generational legacy, and a living economy—with premium presentation and ethical business model—in one continuous 2D simulation connected by the Fenix Network.**

## Why This Exists

Differentiation guides marketing, press, and prioritization when resources conflict.

## Competitive Landscape (Learn, Do Not Copy)

| Inspiration | What We Learn | What Fenix Life Does Differently |
|---|---|---|
| **BitLife** | Accessible life events, humor, mobile habit | Deeper systems, professional UI, business sim, living world |
| **The Sims** | Household emotion, customization | Economic realism, corporate layer, generational wealth |
| **Game Dev Tycoon** | Clear progression, readable UI | Life context, not isolated industry |
| **Startup Company / Software Inc.** | Operational depth | Full life + economy + family integration |
| **Capitalism Lab** | Economic simulation rigor | Human life stakes, presentation, social layer |
| **Football Manager** | People management depth | Corporate HR with life simulation |
| **Cities: Skylines** | Urban growth emergence | City as economic backdrop player navigates |
| **RollerCoaster Tycoon** | Build delight, guest satisfaction | Business satisfaction loops in modern economy |

## The Seven Differentiators

### 1 — **Unified Life × Business Simulation**

Not a mode switch—a **single nested simulation**. Your stress affects your CEO performance; your IPO affects your marriage.

### 2 — **Living World Engine**

NPC corporations, governments, and universities run on parallel rules with causal news—not random event cards only.

### 3 — **Generational Gameplay as Core**

Playable heirs, inheritance strategy, and dynasty reputation are launch pillars, not late DLC afterthoughts.

### 4 — **Fenix Network Social Layer**

Real friends, async deals, anti-abuse economic links—without MMO desync or griefing.

### 5 — **Premium Professional UI**

Diegetic fintech and executive dashboards that respect player intelligence (dark navy, emerald, gold visual language).

### 6 — **Financial Literacy by Design**

Learn real concepts through consequence, not lectures.

### 7 — **Ethical Premium Model**

Buy once, play deeply; expansions add worlds, not wallet wins.

## The Elevator Pitch

*"Live your life. Build your company. Grow your family. Watch the world move—with or without you. Pass the torch. Rise again."*

## How Future Systems Must Follow This

When evaluating features, ask:

> **Does this strengthen a differentiator—or dilute us into a generic sim?**

Prioritize features that **only Fenix Life** would ship.

## Examples of "Only Fenix Life"

- News reports your child's university lab spun out a competitor to your company.
- You retire, play as daughter, attend board meeting of father's company, vote against his old cofounder.
- Friend invests via Fenix Network; your cap table shows their real profile avatar at shareholder meeting.

---

# Appendices

## A. Glossary (Canonical Terms)

| Term | Definition |
|---|---|
| **Fenix Life** | The game product |
| **Living World Engine** | Aggregate simulation of institutions, NPCs, markets, cities |
| **Fenix Network** | Social and economic connection layer between player simulations |
| **Legacy Score** | Meta progression across characters and generations |
| **Symmetry Principle** | NPC agents follow same rules as players unless documented |
| **Sovereign Simulation** | Each player's world instance runs independently |

## B. Document Cross-Reference Index (To Be Populated)

Future specs must link here:

| Spec | Bible Sections |
|---|---|
| Economy Technical Design | §10, §11 |
| Company Management PRD | §12, §7 |
| Fenix Network API | §9 |
| UI/UX Style Guide | §3, §5 |
| Education System PRD | §14, §8 |
| Family & Inheritance PRD | §13, §8 |
| Anti-Abuse & Transfers | §9, §11 |
| Modding SDK | §17 |
| Accessibility Checklist | §18 |
| Store & DLC Catalog | §16, §19 |

## C. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Product Leadership | Initial canonical Product Bible |

---

## Sign-Off

This document represents the creative and product north star for Fenix Life. Implementation details will vary; **philosophy must not drift silently**.

*"Depth is a promise. Believability is the craft. Legacy is the reward."*

— Fenix Life Product Bible v1.0
