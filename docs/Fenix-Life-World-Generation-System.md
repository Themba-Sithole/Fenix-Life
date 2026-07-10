# Fenix Life — Official World Generation System (WGS)

**Document Version:** 1.0  
**Status:** Canonical — Procedural World Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead World Simulation Designer & Procedural Generation Architecture  
**Audience:** Engineering, Game Design, AI Systems, Economy Design, Art, Narrative, QA  

---

## Document Authority

The World Generation System (WGS) defines **how sovereign Fenix Life worlds are born with believable pasts, present conditions, and forward momentum** before the player takes their first breath. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Living World, economy, symmetry, regional variation |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Dynamic History, World Memory |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Engine contracts, tiers, initialization lifecycle |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Performance budgets, save format, agent tiers |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Historical records, tier shapes, event log |

When world generation conflicts with simulation philosophy, **align with philosophy first**. Generated history must be **systemically plausible**, not decorative lore disconnected from FSF engines.

**What the WGS is:**

- The **procedural birth pipeline** that transforms a `WorldSeed` into a playable `WorldInstance`
- The **synthetic history compiler** that gives every world 20–50 years of compressed past
- The **society fabricator** that creates citizens, families, companies, and institutions with coherent backstories
- The **balance envelope** that ensures different seeds feel genuinely different while remaining fair

**What the WGS is not:**

- Ongoing simulation (that is the FSF after `world.initialized`)
- Hand-authored campaign content for every new world
- A map editor that places empty buildings awaiting population
- Player character creation alone (player entry is the final WGS phase)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy](#2-design-philosophy)
3. [World Seeds](#3-world-seeds)
4. [Generation Pipeline](#4-generation-pipeline)
5. [Population Generation](#5-population-generation)
6. [Business Generation](#6-business-generation)
7. [Infrastructure Generation](#7-infrastructure-generation)
8. [Historical Event Generation](#8-historical-event-generation)
9. [Culture & Regional Identity](#9-culture--regional-identity)
10. [Replayability & Balance](#10-replayability--balance)
11. [Integration with FSF](#11-integration-with-fsf)
12. [Performance & Fidelity Budgets](#12-performance--fidelity-budgets)
13. [Governance & Evolution](#13-governance--evolution)

---

# 1. Executive Summary

A Fenix Life world must feel **older than the player**.

When a new citizen opens the newspaper, they should read about companies founded before their birth, elections they did not vote in, and recessions their parents survived. When they walk a city map, schools should have graduation records, factories should have payroll histories, and banks should have lending portfolios—not vacant lots waiting for gameplay to begin.

The WGS achieves this through a **seven-phase deterministic pipeline** driven by a single `WorldSeed`:

```
WorldSeed
    │
    ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 1. Seed     │──►│ 2. Macro    │──►│ 3. Geography│──►│ 4. Infra-   │
│ Derivation  │   │ Envelope    │   │ & Regions   │   │ structure   │
└─────────────┘   └─────────────┘   └─────────────┘   └──────┬──────┘
                                                              │
    ┌─────────────────────────────────────────────────────────┘
    ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 5. Synthetic│──►│ 6. Society  │──►│ 7. Player   │
│ History     │   │ Fabrication │   │ Entry       │
└─────────────┘   └─────────────┘   └─────────────┘
                         │
                         ▼
                  world.initialized
                  (FSF takes authority)
```

**Core outputs per world:**

| Output | Scale (typical) |
|---|---|
| Named citizens (T1) | ~500 with full life histories |
| Statistical citizens (T2) | ~50,000 with compressed histories |
| Aggregate population (T3) | 1–5 million (region-level) |
| Active companies (named) | 2,000–8,000 |
| Institutions | 50–200 per major city |
| Years of synthetic history | 20–50 (configurable) |
| Newspaper archive articles | 500–5,000 (milestone + sampled) |
| Encyclopedia entries | 200–2,000 |

---

# 2. Design Philosophy

## 2.1 The Pre-Existence Principle

> **The player enters a civilization, not a sandbox.**

Constitution Article IX (Dynamic History) requires worlds to become unique civilizations. The WGS front-loads uniqueness at birth so the player's first day already sits inside a causal chain.

**Design implication:** Every generated entity must answer: *What happened before today that explains its current state?*

## 2.2 Simulation-First Generation

World generation does not invent facts that FSF engines could not have produced. Synthetic history is **compressed simulation** or **statistically valid backfill** using the same rule formulas the living world will use forward.

| Approved | Rejected |
|---|---|
| A bankrupt company with ledger gaps, laid-off employees, and media coverage | A "famous company" flag with no cap table |
| A recession caused by rate hikes + sector contraction in the macro timeline | A random "economy bad" modifier |
| A citizen whose career history matches their age and education | A 25-year-old CEO with no explanation |

## 2.3 Society, Not Scatter

Believable worlds are **graphs**, not bags of entities:

- Citizens belong to households and families
- Companies employ citizens who bank at institutions that hold their mortgages
- Universities feed labor pools that staff local industry
- Governments tax the same economy companies operate in

Generation proceeds **inside-out**: macro → regions → institutions → organizations → households → individuals → relationships.

## 2.4 Tiered Materialization

Not every generated citizen is fully realized at birth. The WGS respects FSF agent tiers (T0–T3):

| Tier | WGS Treatment |
|---|---|
| **T0** | Created at player entry; may inherit from generated family |
| **T1** | Fully fabricated: name, history, relationships, finances |
| **T2** | Compressed life vector + promotion seed for future backfill |
| **T3** | Demographic and economic aggregates only |

## 2.5 Determinism

Given identical `WorldSeed`, `rulesetVersion`, `historyDepth`, and `regionPack`, generation produces **bit-identical** world state. This enables:

- Reproducible bug reports
- Shared world challenges (optional)
- QA regression fixtures
- Player trust ("my seed is fair")

## 2.6 The Newspaper Test

A world passes WGS review if a designer can pick a random date 10 years before player birth and find:

1. At least three news articles referencing real generated entities
2. At least one macro indicator movement with documented cause
3. At least one company timeline with consistent financial arc
4. At least one citizen biography whose education → career → wealth path is coherent

---

# 3. World Seeds

## 3.1 Seed Identity

Each `WorldInstance` is born from a **WorldSeed** — a deterministic root for all procedural derivation.

| Field | Purpose |
|---|---|
| `seed` | 64-bit integer or 256-bit hash (player-visible share code optional) |
| `rulesetVersion` | Economy, aging, education formulas |
| `regionPack` | Country/culture template (names, institutions, legal frame) |
| `historyDepth` | Years of synthetic past (20–50 default) |
| `startDate` | In-game calendar when player is born or begins |
| `difficultyProfile` | Shifts balance envelope, not generation order |
| `modManifestHash` | Mod-compatible worldgen extensions |

**Player-facing seed:** Display as shareable code (e.g., `FENIX-7K2M-9X4P`) mapping to canonical seed + config. Optional "seed roulette" for discovery.

## 3.2 Seed Derivation Tree

The master seed fans out through **HMAC-style sub-seeds** (conceptually) so domains are independent but reproducible:

```
WorldSeed
├── macroSeed        → economy, government, weather climate
├── geoSeed          → map layout, biomes, city count
├── cultureSeed      → naming, values distribution, media tone
├── industrySeed     → sector weights, corporate landscape
├── populationSeed   → demographics, migration, household structure
├── historySeed      → event timeline, crisis placement
├── notableSeed      → famous citizens, landmark events
└── playerSeed       → player birthplace, family slot (optional constraint)
```

Changing `industrySeed` should not reshuffle geography. Changing `geoSeed` should not rewrite macro recession timing.

## 3.3 Seed Influence Matrix

| Domain | Primary Sub-Seed | What Varies |
|---|---|---|
| **Population** | `populationSeed` | Size, age pyramid, migration rate, household size distribution |
| **Economy** | `macroSeed` + `industrySeed` | Starting GDP growth, inflation, sector mix, credit conditions |
| **Industry** | `industrySeed` | Dominant sectors per region, startup density, corporate concentration |
| **Housing** | `geoSeed` + `macroSeed` | Supply/demand ratio, zoning strictness, price level |
| **Education** | `populationSeed` + `cultureSeed` | Literacy, university prestige distribution, public vs private mix |
| **Government** | `macroSeed` + `cultureSeed` | Ideology center, tax burden, regulation intensity, stability |
| **Infrastructure** | `geoSeed` | City count, density, transit investment level |
| **Weather** | `geoSeed` + `macroSeed` | Climate zone, disaster frequency, seasonal variance |
| **Culture** | `cultureSeed` | Social values, risk tolerance, work ethic distribution, naming |
| **Business landscape** | `industrySeed` + `historySeed` | Count of legacy firms, IPO history, family business prevalence |

## 3.4 Seed Constraints (Balance Envelope)

Seeds explore variety within **hard guardrails** (see §10). Examples:

| Parameter | Allowed Range (default profile) |
|---|---|
| Starting unemployment | 3%–12% |
| Major cities | 1–5 |
| Public companies at start | 5–40 |
| Recessions in history depth | 1–3 |
| Gini coefficient (wealth) | 0.32–0.48 |
| University seats per capita | Within region pack norms |

Seeds outside envelope are rejected or clamped with logged adjustment.

## 3.5 Optional Player Seed Constraints

Players may optionally specify:

- Starting region (city preference)
- Family background band (working class / middle / affluent — not exact wealth)
- Gender / name preferences
- "Challenging economy" or "Boom start" (shifts envelope within bounds)

Constraints consume entropy from `playerSeed` without breaking determinism for a given config.

---

# 4. Generation Pipeline

## 4.1 Phase 1 — Seed Derivation & Validation

**Input:** Raw seed + config  
**Output:** Sub-seed tree, validated envelope parameters  
**Duration budget:** < 50ms  

Actions:

1. Derive sub-seeds
2. Load region pack (legal, naming, institution templates)
3. Validate/clamp envelope parameters
4. Initialize RNG streams per sub-seed

## 4.2 Phase 2 — Macro Envelope

**Output:** Starting macro state vector, policy regime, climate baseline  

Generates the **economic and political weather** the world grew up in:

| Artifact | Description |
|---|---|
| `MacroTimeline` | Year-by-year GDP, inflation, unemployment, policy rate (compressed) |
| `PolicyRegime` | Tax structure, regulation index, welfare level at start date |
| `SectorWeights` | National industry composition |
| `ClimateProfile` | Regional weather baselines |
| `MigrationPressure` | Net inflow/outflow tendency per region |

This timeline is the **backbone** for synthetic history. Recessions, booms, and elections anchor to macro inflection points—not random dates.

## 4.3 Phase 3 — Geography & Regions

**Output:** World map, jurisdictions, city graph  

### World Structure

| Level | Contents |
|---|---|
| **Nation / State** | Government jurisdiction, tax authority, currency |
| **Region** | Economic zone (cost of living, industry bias) |
| **City** | Playable map unit; 2D district layout |
| **District** | Zoning class, land capacity, character |

### City Generation

Each city receives:

- **Population target** (from macro + geo)
- **Industry signature** (tech hub, manufacturing, government, tourism, etc.)
- **Land budget** — residential, commercial, industrial, civic percentages
- **Growth trajectory** — expanding, stable, declining (affects housing and infrastructure age)
- **Founding era** — influences architecture flavor and institution age

Cities are **not** empty grids. Districts are typed before buildings are placed.

## 4.4 Phase 4 — Infrastructure Placement

**Output:** `InstitutionRegistry`, spatial index, transport graph  

See [§7 Infrastructure Generation](#7-infrastructure-generation). Infrastructure is placed **before** population and businesses so citizens and companies have somewhere to belong.

## 4.5 Phase 5 — Synthetic History Compilation

**Output:** `HistoricalEventLog` (synthetic), `MacroIndicatorHistory`, milestone timelines  

See [§8 Historical Event Generation](#8-historical-event-generation). This phase runs **compressed causal simulation** across the history depth, producing:

- Past recessions, elections, IPOs, bankruptcies
- Famous citizens and historic buildings
- Newspaper archive (milestone articles)
- Encyclopedia stubs

**Critical:** Synthetic events are appended to World Memory as if they occurred. They carry `synthetic: true` metadata for debugging but are **indistinguishable to the player** in presentation.

## 4.6 Phase 6 — Society Fabrication

**Output:** T1/T2/T3 population, companies, relationships, financial state at start date  

See [§5 Population](#5-population-generation) and [§6 Business](#6-business-generation). Society is generated **at the start date** with backstory compiled from Phase 5.

Order within Phase 6:

1. T3 demographic aggregates per district
2. Institution staffing (banks, hospitals, universities)
3. Company generation (employers before employees)
4. T2 statistical population
5. T1 named citizens sampled and fully realized
6. Household and family graph
7. Relationship and friendship edges
8. Financial reconciliation (balance sheets close)
9. Labor pool and education pipeline state

## 4.7 Phase 7 — Player Entry

**Output:** T0 player citizen, `world.initialized` event  

1. Select player birth scenario from `playerSeed` + optional constraints
2. Place player in household (newborn, teen, young adult per config)
3. Wire player to family, city, schools, banks
4. Promote adjacent NPCs to T1 where needed
5. Build CQRS projections (news, map, economy dashboard)
6. Append `world.initialized` to event log
7. Hand authority to FSF Time Engine

**Player birth ages (configurable):**

| Mode | Age | Experience |
|---|---|---|
| **Legacy start** | 0 (birth) | Full life arc |
| **Standard** | 16–18 | Education choices imminent |
| **Young adult** | 21–25 | Career/entrepreneurship entry |
| **Mid-career** | 35–45 | Established stakes (advanced) |

---

# 5. Population Generation

## 5.1 Design Goal

Every generated citizen must have a **coherent life vector**:

> Age + education + career + wealth + relationships + health ≈ believable human

Citizens are not rolled independently. They are **resolved from constraints** imposed by households, employers, and history.

## 5.2 Demographic Foundation (T3)

Per city/region, generate aggregate tables:

| Table | Fields |
|---|---|
| Age pyramid | 5-year buckets |
| Education attainment | By age cohort |
| Employment rate | By sector |
| Income distribution | Percentiles |
| Household size | Distribution |
| Net worth distribution | Percentiles (drives Gini validation) |

T3 is the **source of truth** for totals. T1/T2 must sum to T3 within tolerance.

## 5.3 Household Generation

**Household** is the economic unit for housing, consumption, and tax.

| Household Type | Composition Rules |
|---|---|
| Single adult | 18+; apartment bias |
| Couple (no children) | Married or partnered; dual income common |
| Nuclear family | 1–3 children; school district linkage |
| Extended family | Multi-generational; inheritance potential |
| Single parent | Child-linked; income stress modifier |
| Roommates | Young adults; shared housing |

Household generation steps:

1. Sample household type distribution from culture seed
2. Assign housing unit (rent/own) consistent with wealth band
3. Allocate income budget across members
4. Place in district matching income and commute tolerance

## 5.4 Family Generation

**Family** is the lineage graph (marriage, divorce, adoption, inheritance).

| Structure | WGS Behavior |
|---|---|
| **Dynasty families** | 2–4 generations deep; business or legacy ties |
| **Middle-class lineages** | Parents + grandparents with employment history |
| **Fragmented families** | Divorce, estrangement in history |
| **New immigrant families** | Shorter history depth; migration event in timeline |

Each family receives:

- `FamilyId`, dynasty reputation (if applicable)
- Marriage/divorce intervals (synthetic history)
- Inheritance structure (will templates)
- Surname weight for media/encyclopedia

**Player family slot:** Reserved household with plausible capital distribution per constraint band—not predetermined success.

## 5.5 Citizen Generation (T1 — Full)

For each of ~500 T1 citizens:

### Identity

| Attribute | Source |
|---|---|
| Name | cultureSeed + region pack naming tables |
| Birth date | Consistent with age on start date |
| Gender / pronouns | Seed distribution |
| Citizenship | Jurisdiction |
| Appearance seed | Genetics-compatible with family |
| Personality vector | Big-Five–style; affects dreams and risk |

### Life History (Synthetic)

Compiled backward from start date:

| Life Stage | Generated Artifacts |
|---|---|
| **Childhood** | School district, parental wealth band, early trait events |
| **Adolescence** | High school, grades band, first relationships |
| **Young adult** | University or trade path, first jobs, debt |
| **Adult** | Career progression intervals, promotions, job changes |
| **Mid-life** | Peak earnings, family events, possible business role |
| **Present** | Current employment, finances, relationships, health |

**Personal memories:** 3–15 milestone memories per T1 citizen, each referencing a synthetic or structural event ID.

### Skills & Education

| Field | Rule |
|---|---|
| Education level | Age-appropriate; matches career floor |
| Credentials | Issued by generated institutions |
| Skills | Derived from career path + education + personality |
| Skill gaps | Intentional; no citizen is omnicompetent |

### Career

| Element | Generation |
|---|---|
| Current employer | Real generated company (or unemployed with history) |
| Employment intervals | 1–6 positions over working life |
| Performance band | Affects promotion history |
| Income | Matches company role + region wage index |
| Unemployment gaps | Possible during recession years in macro timeline |

### Wealth & Financial History

| Element | Rule |
|---|---|
| Net worth | Consistent with age, career, inheritance |
| Cash / investments / property | Split by life stage and risk tolerance |
| Debt | Student loans, mortgage, auto—age appropriate |
| Credit score | Derived from synthetic payment history |
| Bank relationships | Accounts at regional generated banks |

**Wealth reconciliation:** Sum of citizen net worth + company book value + government ≈ macro wealth envelope.

### Relationships

| Edge Type | Count (T1 average) |
|---|---|
| Family | 3–15 |
| Friends | 2–8 |
| Professional | 2–10 |
| Romantic (current/past) | 0–3 |
| Rivals | 0–2 |

Relationship meters are **not random**. They derive from:

- Shared school/work history
- Personality compatibility
- Wealth/class proximity
- Synthetic events (betrayal, mentorship, competition)

### Friendships

Friendship clusters form via:

1. **School cohort** — same university/high school graduation year
2. **Workplace** — same company department
3. **Neighborhood** — same district, similar age
4. **Interest affinity** — personality + industry alignment

Clusters create **social fabric** the player can later penetrate.

## 5.6 Citizen Generation (T2 — Compressed)

~50,000 T2 citizens stored as:

| Field | Purpose |
|---|---|
| `agentId` | Stable ID |
| `lifeVector` | Age, sex, education band, sector, income percentile |
| `employerRef` | Company ID or labor pool |
| `householdRef` | Statistical household |
| `promotionSeed` | Deterministic expansion to T1 if promoted |
| `syntheticEventRefs` | Pointers to history affecting this agent |

T2 citizens have **hireable names** and plausible resumes on promotion, materialized from `promotionSeed` + `lifeVector` + company context.

## 5.7 T1 Sampling Strategy

Not all districts get equal T1 density. Oversample:

- Player's city and adjacent districts
- Economic centers (IPO companies, universities)
- Political capital (government actors)
- Impoverished and affluent extremes (story diversity)
- Demographic variety (age, industry, culture)

Every **major employer** has named T1 executives. Every **public company** has named C-suite.

## 5.8 Believable Life History Algorithm (Conceptual)

For each T1 citizen, WGS runs a **backward life resolver**:

```
1. Assign birth year → pick parents from prior generation sample or synthetic couple
2. Place childhood household → infer school district
3. For each life decade:
   a. Read macro timeline (recession? boom?)
   b. Roll career transition conditioned on education + macro + personality
   c. Emit synthetic employment/education intervals
   d. Update wealth, debt, relationships
4. Validate forward: at start date, citizen state is internally consistent
5. If validation fails → resample with adjusted constraints (max 3 retries)
```

Failures indicate envelope tension (e.g., too many CEOs)—adjust sector caps.

---

# 6. Business Generation

## 6.1 Design Goal

The business landscape should feel like **an economy that grew**, not a list of quest vendors.

Companies have founders who still exist or died with legacy, employees who earn wages, products that match sector logic, and financial histories that survive audit.

## 6.2 Company Taxonomy

| Type | % of Named Companies (typical) | Traits |
|---|---|---|
| **Sole proprietorship / micro** | 40–50% | 1–5 employees; local services; thin margins |
| **Small business** | 25–35% | 5–50 employees; regional; often family-owned |
| **Growth-stage private** | 5–10% | VC-backed possible; high burn; product focus |
| **Large private** | 3–8% | Regional/national; diversified |
| **Public company** | 0.1–0.5% of total; 5–40 per world | Listed; quarterly history; analyst coverage |
| **Family dynasty** | 2–5% | Multi-generational leadership; succession tension |
| **Government org** | Per city | Schools, agencies, utilities |
| **Non-profit** | 3–7% | Hospitals, charities, foundations |

## 6.3 Generation Order

1. **Anchor institutions** — banks, utilities, universities (employers of first resort)
2. **Public companies** — cap table, IPO date in synthetic history
3. **Large private / dynasties** — founder generation tied to history timeline
4. **SMB mass** — fill sector quotas per district
5. **Startups** — young companies (0–5 years) with founder T1 citizens
6. **Government & non-profits** — civic layer

## 6.4 Company Profile (Required Fields)

### Identity & Structure

| Field | Description |
|---|---|
| `CompanyId`, name, brand | cultureSeed + industry naming |
| `foundedDate` | In synthetic history; not after start date |
| `sector` / `industry` | Matches regional signature |
| `legalForm` | LLC, Corp, partnership, etc. |
| `status` | Active, distressed, recovering (post-recession) |
| `hqDistrict` | Spatial placement |
| `cultureVector` | Work-life balance, innovation, bureaucracy |

### People

| Role | Generation |
|---|---|
| **Founders** | T1 citizens; age appropriate; wealth tied to equity |
| **CEO / leadership** | Founder or successor with career interval |
| **Board** | 3–9 members for large/public; networked T1 citizens |
| **Employees** | T1 execs + T2 bulk; headcount matches revenue band |

### Financial History

Synthetic history produces:

| Artifact | Depth |
|---|---|
| Revenue curve | Annual (history depth) |
| Profitability | Margin band by sector and age |
| Funding rounds | Seed → Series A/B for growth cos |
| Debt facilities | Bank relationships |
| Valuation snapshots | Pre-IPO and public marks |
| Bankruptcy episodes | If in timeline; may be recovered or defunct |

**Reconciliation:** Public company market cap ≈ shares × price at start date, consistent with economy indices.

### Products & Customers

| Element | Rule |
|---|---|
| **Product portfolio** | 1–5 products; sector-appropriate |
| **R&D stage** | Young cos have pipeline; mature have cash cows |
| **Customer base** | B2B, B2C, or government; regional or national |
| **Market share** | Small in crowded sectors; dominant only for 1–2 anchors per sector |

### Reputation

| Dimension | Source |
|---|---|
| Brand trust | Product quality + scandal history |
| Employer reputation | Wage vs market, layoff history |
| Environmental/social | Sector baseline + events |
| Media visibility | Public > large > small |

## 6.5 Public Company Special Treatment

Each public company receives:

- IPO date and offer price in synthetic history
- 3–10 years of quarterly earnings (compressed)
- Stock ticker; index membership possible
- Analyst sentiment at start
- Named institutional holders (generated pension funds, banks)
- Media archive: IPO coverage, earnings beats/misses

## 6.6 Family Business & Dynasty

| Element | Generation |
|---|---|
| Founding generation | Often 1–2 generations back in history |
| Succession state | Founder active, retired, or heir apparent |
| Nepotism tension | Personality-driven; not scripted quest |
| Estate linkage | Family engine inheritance pre-wired |

## 6.7 Startups at Start Date

Per city tech/industry signature:

- 5–30 startups aged 0–5 years
- Founder T1 citizens with equity-heavy net worth
- Burn rate and runway from macro + funding seed
- 70–90% destined to fail in simulation (not at birth)—player competes on equal terms

## 6.8 Company–Citizen Closure

After company generation:

1. Assign employees from labor pool matching skills
2. Update citizen employment intervals
3. Verify payroll ≤ revenue
4. Wire supplier/customer edges between companies (sparse graph)
5. Register companies with institutions (bank accounts, tax IDs)

---

# 7. Infrastructure Generation

## 7.1 Design Goal

Cities are **functional organisms**. A school without students, a bank without deposits, or a factory without workers fails the pre-existence principle.

Infrastructure generation creates **slots** institutions fill, then **populates** them during society fabrication.

## 7.2 City District Model

Each city district has:

| Attribute | Values |
|---|---|
| `zoningType` | Residential, commercial, industrial, mixed, civic |
| `density` | Low, medium, high |
| `landValue` | Index relative to city median |
| `ageProfile` | New growth, mature, declining |
| `transitAccess` | Poor → excellent |
| `crimeIndex` | Affects property and business risk |

Districts are placed on the 2D map as **regions** (Phaser-navigable), not tile-by-tile simulation.

## 7.3 Institution Types

### Education

| Institution | Placement Rule | Capacity |
|---|---|---|
| **Primary schools** | Per residential district population | Student age 5–11 |
| **Secondary schools** | Per city region | Student age 12–18 |
| **Community colleges** | Mid-size cities+ | Vocational pipeline |
| **Universities** | 0–3 per major city | Prestige tier from seed |
| **Research institutes** | University-adjacent | R&D output hook |

Each school has: founding year, reputation band, funding source (public/private), synthetic alumni in T1.

### Finance

| Institution | Per City (typical) |
|---|---|
| **Retail bank branches** | 2–15 by population |
| **Regional bank HQ** | 1 per region |
| **National bank** | 0–2 per world |
| **Credit unions** | Working-class districts |
| **Investment firms** | Commercial districts in economic hubs |

Banks receive: lending portfolio (synthetic), deposit base from citizen accounts, rate policy from macro.

### Healthcare

| Facility | Placement |
|---|---|
| **Clinics** | Residential spread |
| **General hospitals** | Per 100k population |
| **Specialty hospitals** | Major cities |
| **Insurance offices** | Commercial districts |

### Civic & Government

| Building | Function |
|---|---|
| **City hall** | Zoning, permits |
| **Courthouse** | Legal hooks |
| **Tax office** | Filing |
| **Police / fire** | Abstracted service level |
| **Libraries, parks** | Social capital |

### Commercial

| Type | Density by district |
|---|---|
| **Shops / retail** | Commercial cores |
| **Restaurants** | Mixed use |
| **Malls** | Suburban commercial |
| **Hotels** | Tourism cities |

### Industrial

| Type | Placement |
|---|---|
| **Factories** | Industrial districts; pollution/weather hook |
| **Warehouses** | Near transport |
| **Logistics hubs** | Highway/rail access |
| **Energy** | Per region pack |

### Office

| Type | Placement |
|---|---|
| **Office parks** | Suburban commercial |
| **High-rise offices** | CBD |
| **Co-working** | Startup-heavy cities |

### Residential

| Type | Placement |
|---|---|
| **Apartments** | High-density districts |
| **Suburban homes** | Low-density |
| **Public housing** | Policy-dependent |
| **Luxury estates** | High land value |

Residential units link to Housing Engine titles (owner, renter, vacancy).

## 7.4 Transport Network

Abstract graph (not traffic simulation):

| Layer | Contents |
|---|---|
| **Road network** | District connectivity; commute times |
| **Public transit** | Metro, bus lines; city size dependent |
| **Rail / freight** | Industrial supply chains |
| **Airport** | 0–1 per major region; affects business travel |
| **Port** | Coastal cities; trade hook (expansion) |

Commute time affects citizen time budget and hiring pool radius.

## 7.5 Historic Buildings

5–20 **landmarked properties** per major city:

| Type | Example |
|---|---|
| Founder's mansion | Now museum or corporate HQ |
| First headquarters | Defunct company fossil |
| Historic factory | Redeveloped lofts |
| Government legacy | Old capitol, courthouse |
| Cultural | Theater, stadium with naming history |

Each landmark links to encyclopedia entry and optional synthetic event.

## 7.6 Infrastructure–Economy Closure

1. Sum district employment capacity ≈ labor demand
2. Housing unit count ≈ household count + vacancy
3. School seats ≈ school-age population
4. Hospital beds ≈ population health model
5. Commercial sqft ≈ retail spending envelope

Mismatch triggers WGS adjustment loop before player entry.

---

# 8. Historical Event Generation

## 8.1 Design Goal

History is **causal, archived, and discoverable**—not a loading screen lore dump.

Constitution Article IX systems must be populated at birth:

- Historical companies (active and defunct)
- Legendary citizens
- Economic crises with causes
- Newspapers browsable by date
- Encyclopedia stubs

## 8.2 Synthetic History Compiler

The compiler walks the `MacroTimeline` year-by-year (or in multi-year steps for distant past), applying **same FSF rule formulas** in compressed mode:

```
For each year Y in [startDate - historyDepth, startDate):
  1. Apply macro indicators for Y
  2. Roll election if scheduled → government.policy_enacted
  3. Sample sector shocks → company failures, mergers
  4. Sample IPO window → public company births
  5. Sample notable citizen achievements
  6. Emit weather disasters if climate roll
  7. Generate media articles for milestones
  8. Append to SyntheticEventLog
```

**Compression:** Distant decades may use 5-year steps with interpolated indicators. Last 10 years use annual resolution.

## 8.3 Required Historical Event Types

| Event Type | Count (typical 30yr) | Downstream Artifacts |
|---|---|---|
| **Recessions** | 1–3 | Unemployment spikes, bankruptcies, policy response |
| **Booms** | 1–2 | IPO waves, housing appreciation |
| **Elections** | 6–15 | Policy regime changes |
| **Company bankruptcies** | 20–200 (named + statistical) | Defunct brands, layoffs |
| **IPOs** | 5–30 | Public company births, media coverage |
| **Mergers & acquisitions** | 10–50 | Consolidation, job losses |
| **Major discoveries** | 2–10 | University research, new products |
| **Scandals** | 5–20 | Reputation hits, media arcs |
| **Natural disasters** | 2–8 | Regional property damage |
| **Famous citizens** | 10–30 | Hall of Legends candidates, biographies |

## 8.4 Recession Generation

Recessions anchor to **macro causation**:

| Cause Template | Symptoms |
|---|---|
| Credit tightening | Bank failures, defaults, housing dip |
| Sector collapse | Tech bust, manufacturing decline |
| External shock | Energy spike, pandemic analog |
| Asset bubble burst | Real estate or stock crash |

Each recession produces:

- Named duration and depth in `MacroIndicatorHistory`
- Cluster of `company.bankrupt` synthetic events
- `media.article` archive ("The Crisis of 20XX")
- `encyclopedia.crisis` entry
- Citizen memory templates for T1 (job loss, graduation into weak market)

## 8.5 Election & Policy History

| Element | Generation |
|---|---|
| Election cycle | From government seed (2–6 year terms) |
| Party / faction names | Region pack flavored |
| Policy shifts | Tax, regulation, spending |
| Media coverage | Debates, outcomes, protests |

Policies at `startDate` are the **active regime**—player inherits consequences.

## 8.6 Corporate Historical Archetypes

WGS places 3–8 **narrative-rich corporate fossils** per world:

| Archetype | Example Headline |
|---|---|
| **Rise and fall** | "Helix Telecom bankrupt after 20-year run" |
| **Dynasty continuity** | "Voss Group names third-generation CEO" |
| **Disrupted incumbent** | "Print media giant shrinks 60% in decade" |
| **IPO darling** | "NovaMed soars on FDA approval (2018)" |
| **Zombie recovery** | "Steelco emerges from Chapter 11" |

Each archetype is fully wired: cap table, founder, synthetic articles, employee dispersal into labor pool.

## 8.7 Famous Citizens (Legendary NPCs)

10–30 **pre-famous** T1 citizens:

| Type | Role in World |
|---|---|
| Billionaire founder | Owns flagship company |
| Political leader | Mayor, senator analog |
| Celebrity / athlete | High social capital |
| Academic icon | University chancellor |
| Infamous figure | Scandal in history |
| Philanthropist | Non-profit board web |

Not **player proxies**—they live by same rules. Player may compete, befriend, or inherit from them.

## 8.8 Newspaper Archive

At generation complete:

| Period | Article Density |
|---|---|
| Last 1 year | Weekly major + daily minor samples |
| 1–10 years ago | Monthly milestones |
| 10–30+ years ago | Quarterly + crisis/election specials |

Articles reference real entity IDs. Template parameters only—no orphan headlines.

## 8.9 Encyclopedia & World Memory

Initial encyclopedia:

- All public companies
- Major private companies and dynasties
- Universities, banks, hospitals
- Famous citizens
- Crises, elections, disasters
- Historic buildings

Entries are **stub + expansion hooks** as live simulation adds history.

---

# 9. Culture & Regional Identity

## 9.1 Region Packs

Worlds are skinned by **region packs** (moddable):

| Pack Element | Variation |
|---|---|
| Naming conventions | Given/surnames, company naming |
| Legal frame | Tax, incorporation, labor law baseline |
| Institution templates | School system, healthcare model |
| Cultural values | Risk tolerance, family centrism, work ethic |
| Media tone | Tabloid vs sober financial press |
| Visual flavor | Architecture hints for art pipeline |

Region packs do **not** change balance envelope—only flavor and formula coefficients within bounds.

## 9.2 Culture Seed Effects

| Dimension | Gameplay Effect |
|---|---|
| **Ambition distribution** | Startup density |
| **Family centrism** | Household size, inheritance pressure |
| **Risk tolerance** | Investment behavior, leverage |
| **Institutional trust** | Government career prestige |
| **Education premium** | University attendance rates |
| **Entrepreneurship rate** | SMB vs employment preference |

## 9.3 Sub-Cultures Within Worlds

Cities differ inside one world:

| City Type | Signature |
|---|---|
| Tech hub | Young population, high rents, startup cluster |
| Industrial | Manufacturing, unions, aging infrastructure |
| Government capital | Stable employment, policy focus |
| University town | Student economy, low wages, high human capital |
| Declining city | Population outflow, distressed housing |

---

# 10. Replayability & Balance

## 10.1 The Replayability Question

> How should two worlds from different seeds feel genuinely different while remaining balanced?

**Answer:** Separate **identity** (seed-driven flavor) from **fairness** (envelope-guaranteed opportunity).

## 10.2 What Should Differ Between Seeds

| Dimension | Variation |
|---|---|
| Dominant industries | Tech world vs manufacturing world |
| Economic starting phase | Early expansion vs late-cycle caution |
| Political climate | High tax/welfare vs low regulation |
| Geography | Coastal trade vs inland logistics |
| Culture | Family-centric vs individualist |
| History | Which crises happened; which dynasties rose |
| Famous NPCs | Different legends, rivals, mentors |
| City layout | Different district characters |
| Opportunity pockets | Biotech boom city vs affordable housing city |

**Player experience:** "My world had the 2019 fintech bust; yours had a manufacturing renaissance."

## 10.3 What Must NOT Differ (Balance Envelope)

| Dimension | Constraint |
|---|---|
| Existential opportunity | Every world supports career, business, investment, family, legacy paths |
| Exploit potential | No seed guarantees infinite arbitrage |
| Player disadvantage | No seed starts player in unwinnable state (unless explicit hardcore mode) |
| Progression pacing | Comparable time-to-meaningful-decisions |
| System completeness | All engines active; no "missing" industries |
| Multiplayer fairness | Network transfers use same caps regardless of seed |

## 10.4 Balance Mechanisms

### Envelope Clamping

Hard limits on macro, Gini, unemployment, public company count at start.

### Opportunity Floor

Every world guarantees at minimum:

- 1+ university or vocational path
- 1+ bank willing to lend to qualified applicants
- 1+ growing sector with hiring demand
- 1+ affordable housing district
- 1+ mentorship-adjacent T1 NPC (teacher, manager, relative)

### Opportunity Ceiling

No seed starts with:

- Player family trillionaires (unless explicit legacy mode)
- Monopolized sectors with zero competition
- Zero recession ever (removes teachable cycles)
- Guaranteed winning stock

### Difficulty Profiles

Shift envelope **within** bounds:

| Profile | Effect |
|---|---|
| **Standard** | Default envelope |
| **Forgiving** | Lower starting unemployment; gentler first recession |
| **Challenging** | Higher debt loads; tighter credit; earlier macro headwinds |
| **Chaotic** | Wider variance; still clamped |

### Anti-Seed-Scumming

Leaderboards and ranked play may use:

- Normalized scoring (performance vs macro conditions)
- Seed category tags (not raw seed comparison)
- Banned exploit seeds (deterministic audit)

## 10.5 Seed Discovery & Social Replayability

| Feature | Purpose |
|---|---|
| Share codes | Community shares interesting worlds |
| Seed preview | Show macro summary before commit (optional spoiler) |
| Weekly seed challenge | Same seed, compare legacy scores |
| "Remix" | Fixed geo, random industry (or inverse) |

## 10.6 Long-Horizon Divergence

Seeds converge in **rules** but diverge in **history** as FSF runs. After 50 in-game years:

- Worlds should be **unrecognizably different** in encyclopedia content
- Early balance matters less than systemic choices
- WGS responsibility ends at `world.initialized`; FSF owns emergence

---

# 11. Integration with FSF

## 11.1 Handoff Contract

At `world.initialized`:

| WGS Delivers | FSF Consumes |
|---|---|
| `WorldInstance` snapshot | Time Engine start state |
| `SimulationClock` at start date | Tick orchestration |
| T0/T1/T2/T3 agent registry | Engine tier schedulers |
| `InstitutionRegistry` | Banking, Education, Healthcare |
| `SyntheticEventLog` | History Engine, Media archives |
| `MacroStateVector` | Economy Engine |
| CQRS projection seeds | UI dashboards |

FSF **never regenerates** core WGS facts. It **extends** them.

## 11.2 Promotion Backfill

When T2 → T1 promotion occurs post-init, FSF uses WGS `promotionSeed` to materialize history consistent with synthetic timeline—same algorithm as WGS Phase 6.

## 11.3 Mod Extensions

Mods may register:

- Region packs
- Industry templates
- Historical archetype weights
- Naming tables

Mods may not:

- Bypass balance envelope
- Inject player-only advantages at generation
- Skip financial reconciliation

## 11.4 Save Compatibility

Worldgen metadata stored in save header:

```
worldSeed, regionPack, historyDepth, rulesetVersion,
wgsVersion, modManifestHash, generationChecksum
```

Migration tools re-validate checksum after `wgsVersion` bumps.

---

# 12. Performance & Fidelity Budgets

## 12.1 Generation Time Targets

| Phase | Target (client) | Target (cloud) |
|---|---|---|
| Full pipeline | < 15s | < 8s |
| Phase 5 (history) | < 5s | < 3s |
| Phase 6 (society) | < 8s | < 4s |
| Player-visible progress | Staged loading UI with flavor text | Same |

## 12.2 Materialization Limits

| Asset | Cap |
|---|---|
| T1 citizens | 500 (configurable 300–800) |
| T2 citizens | 50,000 |
| Named companies | 8,000 |
| Synthetic articles | 5,000 (rollup older) |
| Encyclopedia entries | 2,000 stubs |

## 12.3 Lazy Hydration

Not required at generation:

- Full T2 resume text
- Cold newspaper articles (summary index only)
- Distant city detail (load on travel)

## 12.4 Parallelization

Phases 3–4 (geo + infra) parallelize per city. Phase 5 parallelizes per region for macro slices. Phase 6 parallelizes per city for society fabric.

---

# 13. Governance & Evolution

## 13.1 WGS Change Control

| Change | Review |
|---|---|
| New region pack | Cultural sensitivity, balance |
| Envelope parameter | Economy + QA replay suite |
| New historical archetype | Constitution Article IX alignment |
| History depth default | Performance + storage |

## 13.2 QA Fixtures

Canonical test seeds:

| Seed ID | Purpose |
|---|---|
| `WGS-TEST-STANDARD` | Regression baseline |
| `WGS-TEST-RECESSION-START` | Player born into recovery |
| `WGS-TEST-TECH-BOOM` | Startup-heavy |
| `WGS-TEST-DECLINING-CITY` | Urban decay scenario |
| `WGS-TEST-DYNASTY` | Family business world |

Each fixture asserts: checksum, Gini in range, newspaper test pass, financial closure.

## 13.3 Document Map

| Question | Document |
|---|---|
| Why must worlds have pasts? | Design Constitution Article IX |
| How does the world run forward? | FSF |
| How is data stored? | Database Design Document |
| How are worlds born? | **This document (WGS)** |

## 13.4 Closing Declaration

The World Generation System exists so that every Fenix Life player opens their eyes in a **society already in motion**—with employers hiring, banks lending, newspapers publishing, dynasties aging, and scars from crises past.

The player is not the first story. The player is the **next** story.

When world generation finishes, the simulation has already been living for decades. The FSF's job is to ensure it never stops.

---

*End of Fenix Life World Generation System v1.0*
