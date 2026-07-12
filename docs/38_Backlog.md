# Fenix Life — Official Product Backlog

**Document Version:** 1.0  
**Status:** Canonical — Feature Inventory Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Product Management & Lead Systems Designer  
**Audience:** All teams  

---

## Document Authority

This Backlog is the **complete feature inventory** for Fenix Life—priorities, dependencies, status, and traceability to pillars and documents. It is subordinate to:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Pillars, scope boundaries |
| [37_Roadmap.md](./37_Roadmap.md) | Timeline and milestones |
| [39_Project_Master_Index.md](./39_Project_Master_Index.md) | Doc registry and progress |

**Priority scale:** P0 (blocker) → P1 (critical) → P2 (important) → P3 (nice) → P4 (future)  
**Status:** `Done` | `In Progress` | `Planned` | `Blocked` | `Deferred`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Backlog Conventions](#2-backlog-conventions)
3. [P0 — Blockers & Foundation](#3-p0--blockers--foundation)
4. [P1 — Core Life Loop](#4-p1--core-life-loop)
5. [P2 — Business & Economy](#5-p2--business--economy)
6. [P3 — World & Social Depth](#6-p3--world--social-depth)
7. [P4 — Platform & Expansion](#7-p4--platform--expansion)
8. [UI/UX Backlog (By Screen)](#8-uiux-backlog-by-screen)
9. [Engine & Simulation Backlog](#9-engine--simulation-backlog)
10. [Content Backlog](#10-content-backlog)
11. [Technical Infrastructure Backlog](#11-technical-infrastructure-backlog)
12. [Live Ops & Analytics Backlog](#12-live-ops--analytics-backlog)
13. [Dependency Graph](#13-dependency-graph)
14. [Governance & Grooming](#14-governance--grooming)

---

# 1. Executive Summary

| Priority | Count | Focus |
|---|---|---|
| P0 | 12 | Simulation kernel, saves, core docs |
| P1 | 28 | Playable life loop, wired dashboards |
| P2 | 35 | Business depth, world systems |
| P3 | 24 | Multiplayer, polish, expansion |
| P4 | 18 | Platform maturity, marketplace |

**Current sprint focus (Q3 2026):** Documentation completion, UI prototype polish, FSF kernel spike.

---

# 2. Backlog Conventions

## 2.1 Item ID Format

`FL-{DOMAIN}-{NNN}`

Domains: `CORE`, `UI`, `ENG`, `CNT`, `OPS`, `PLT`

## 2.2 Fields

| Field | Description |
|---|---|
| ID | Unique identifier |
| Title | Short name |
| Priority | P0–P4 |
| Status | Current state |
| Pillars | Product Bible §4 pillars |
| Capitals | Five Capitals affected |
| Depends | Blocker IDs |
| Target | Roadmap milestone |
| Doc | Spec reference |

---

# 3. P0 — Blockers & Foundation

| ID | Title | Status | Depends | Target | Doc |
|---|---|---|---|---|---|
| FL-CORE-001 | Product Bible v1 | Done | — | M0.1 | 00 |
| FL-CORE-002 | Design Constitution v1 | Done | — | M0.1 | 01 |
| FL-CORE-003 | Technical Design Document v1 | Done | — | M0.1 | 03 |
| FL-CORE-004 | Database Design Document v1 | Done | — | M0.1 | 04 |
| FL-CORE-005 | Simulation Framework (FSF) v1 | Done | 002 | M0.1 | 14 |
| FL-CORE-006 | World Generation System v1 | Done | 005 | M0.1 | 15 |
| FL-CORE-007 | Citizen DNA System v1 | Done | 005 | M0.1 | 16 |
| FL-CORE-008 | Art/Audio/UI/Ops docs 32–41 | In Progress | — | M0.1 | 32–41 |
| FL-ENG-001 | Time Engine implementation | Planned | 005 | M1.0 | 14 |
| FL-ENG-002 | Tick Orchestrator | Planned | ENG-001 | M1.0 | 14 |
| FL-ENG-003 | Local save system v1 | Planned | 004 | M1.2 | 03, 04 |
| FL-ENG-004 | Domain event bus | Planned | ENG-001 | M1.0 | 14 |

---

# 4. P1 — Core Life Loop

| ID | Title | Status | Capitals | Depends | Target |
|---|---|---|---|---|---|
| FL-CORE-010 | Character creation flow | In Progress | Human, Social | — | M1.0 |
| FL-CORE-011 | Citizen aging & vitals | Planned | Human | ENG-001 | M1.0 |
| FL-CORE-012 | Career employment loop | Planned | Human, Financial | ENG-001 | M1.3 |
| FL-CORE-013 | Banking accounts & transactions | Planned | Financial | ENG-001 | M1.3 |
| FL-CORE-014 | Education enrollment & GPA | Planned | Human | ENG-001 | M1.4 |
| FL-CORE-015 | Family relationships basic | Planned | Social | ENG-001 | M1.4 |
| FL-CORE-016 | News feed from Media Engine | Planned | Social | ENG-001 | M1.5 |
| FL-CORE-017 | Timeline / World Memory UI | Planned | Legacy | ENG-001 | M1.8 |
| FL-CORE-018 | Home Screen simulation binding | Complete | All | ENG-003 | M1.1 |
| FL-CORE-019 | Generational handoff | Planned | Legacy | 015, 017 | 1.0 |
| FL-CORE-020 | Death & heir selection | Planned | Legacy | 019 | 1.0 |
| FL-UI-001 | Main Menu (functional) | In Progress | — | ENG-003 | EA 0.5 |
| FL-UI-002 | Home Screen hub | Complete | All | CORE-018 | EA 0.5 |
| FL-UI-003 | Banking Dashboard wired | In Progress | Financial | CORE-013 | EA 0.5 |
| FL-UI-004 | Company Dashboard wired | In Progress | Business | CORE-021 | EA 0.5 |
| FL-UI-005 | Settings persistence | Complete | — | ENG-003 | EA 0.5 |
| FL-CNT-001 | 1 starter city (WGS) | Planned | — | 006 | M1.0 |
| FL-CNT-002 | 20 industry templates | Planned | Business | 035 | EA 0.5 |
| FL-CNT-003 | 12 occupation templates | Planned | Human | 035 | EA 0.5 |

---

# 5. P2 — Business & Economy

| ID | Title | Status | Capitals | Depends | Target |
|---|---|---|---|---|---|
| FL-CORE-021 | Company founding & ops | Planned | Business, Financial | ENG-001 | EA 0.5 |
| FL-CORE-022 | Employee hiring pipeline | Planned | Business, Human | 021 | EA 0.5 |
| FL-CORE-023 | Stock market trading | Planned | Financial | ENG-001 | M1.6 |
| FL-CORE-024 | Real estate buy/sell/rent | Planned | Financial | ENG-001 | M1.7 |
| FL-CORE-025 | Vehicle ownership | Planned | Financial | ENG-001 | M1.7 |
| FL-CORE-026 | Credit score & loans | Planned | Financial | CORE-013 | EA 0.5 |
| FL-CORE-027 | Tax filing basic | Planned | Financial | ENG-001 | 1.0 |
| FL-CORE-028 | Bankruptcy flow | Planned | Financial, Legacy | 013, 021 | 1.0 |
| FL-CORE-029 | IPO & public company | Planned | Business | 021, 023 | 1.2 |
| FL-CORE-030 | M&A system | Planned | Business | 029 | 1.2 |
| FL-CORE-031 | Patent & IP | Planned | Business | 021 | 1.2 |
| FL-CORE-032 | Dividends & shareholder relations | Planned | Business, Financial | 023 | 1.2 |
| FL-UI-006 | Employee Management wired | In Progress | Business | 022 | EA 0.5 |
| FL-UI-007 | Stock Market wired | In Progress | Financial | 023 | M1.6 |
| FL-UI-008 | Real Estate wired | In Progress | Financial | 024 | M1.7 |
| FL-UI-009 | Vehicle Dealership wired | In Progress | Financial | 025 | M1.7 |
| FL-UI-010 | Education screen wired | In Progress | Human | 014 | M1.4 |
| FL-UI-011 | Family screen wired | In Progress | Social, Legacy | 015 | M1.4 |
| FL-UI-012 | News Feed wired | In Progress | Social | 016 | M1.5 |
| FL-UI-013 | Timeline wired | In Progress | Legacy | 017 | 1.0 |
| FL-UI-014 | City Map Phaser integration | Planned | — | CNT-001 | M2.6 |
| FL-UI-015 | Smartphone app shell functional | In Progress | — | UI-003–012 | EA 0.5 |
| FL-ENG-010 | Company Engine | Planned | — | ENG-004 | EA 0.5 |
| FL-ENG-011 | Banking Engine | Planned | — | ENG-004 | EA 0.5 |
| FL-ENG-012 | Economy Engine | Planned | — | ENG-004 | M1.3 |
| FL-ENG-013 | Investment Engine | Planned | — | ENG-004 | M1.6 |
| FL-ENG-014 | Housing Engine | Planned | — | ENG-004 | M1.7 |
| FL-ENG-015 | Transportation Engine | Planned | — | ENG-004 | M1.7 |
| FL-ENG-016 | Career Engine | Planned | — | ENG-004 | M1.3 |
| FL-ENG-017 | Education Engine | Planned | — | ENG-004 | M1.4 |
| FL-ENG-018 | Family Engine | Planned | — | ENG-004 | M1.4 |
| FL-ENG-019 | Media Engine | Planned | — | ENG-004 | M1.5 |
| FL-ENG-020 | Legacy Engine | Planned | — | ENG-004 | 1.0 |

---

# 6. P3 — World & Social Depth

| ID | Title | Status | Capitals | Depends | Target |
|---|---|---|---|---|---|
| FL-CORE-040 | AI citizen population 10K+ | Planned | — | 007, ENG-001 | 1.0 |
| FL-CORE-041 | Government & elections | Planned | Social, Business | ENG-012 | 1.2 |
| FL-CORE-042 | Healthcare system | Planned | Human | ENG-001 | 1.2 |
| FL-CORE-043 | Weather & seasons | Planned | — | ENG-001 | 1.0 |
| FL-CORE-044 | Reputation system cross-domain | Planned | Social | 019 | 1.0 |
| FL-CORE-045 | Mentorship & networking | Planned | Human, Social | 044 | 1.2 |
| FL-CORE-046 | Philanthropy & foundations | Planned | Legacy | 020 | 1.2 |
| FL-CORE-047 | Divorce & custody | Planned | Social, Financial | 015 | 1.0 |
| FL-CORE-048 | Will & estate planning | Planned | Legacy, Financial | 019 | 1.0 |
| FL-CORE-049 | Hall of Legends | Planned | Legacy | 020 | 2.5 |
| FL-UI-020 | Global nav drawer | Planned | — | UI-002 | 1.0 |
| FL-UI-021 | Notification center detail | Planned | — | UI-002 | 1.0 |
| FL-UI-022 | Five Capitals profile view | Planned | All | CORE-018 | 1.0 |
| FL-UI-023 | Accessibility audit fixes | Planned | — | 034 | 1.0 |
| FL-UI-024 | Localization framework | Planned | — | — | 1.0 |
| FL-CNT-010 | City #2–3 | Planned | — | 006 | 1.2 |
| FL-CNT-011 | 60 industry templates | Planned | — | 035 | 1.2 |
| FL-CNT-012 | 120 vehicle models | Planned | — | 035 | 1.2 |
| FL-CNT-013 | 80 property archetypes | Planned | — | 035 | 1.2 |
| FL-CNT-014 | 40 university programs | Planned | — | 035 | 1.2 |

---

# 7. P4 — Platform & Expansion

| ID | Title | Status | Capitals | Depends | Target |
|---|---|---|---|---|---|
| FL-PLT-001 | Fenix Network async messaging | Planned | Social | ENG-003 | 1.5 |
| FL-PLT-002 | Cross-world investment contracts | Planned | Financial | PLT-001 | 1.5 |
| FL-PLT-003 | Cloud save sync | Planned | — | ENG-003 | 1.5 |
| FL-PLT-004 | Leaderboards | Planned | Legacy | PLT-001 | 1.5 |
| FL-PLT-005 | Mod SDK & manifest validation | Planned | — | 035 | 1.2 |
| FL-PLT-006 | Mod marketplace curated | Planned | — | PLT-005 | 2.0 |
| FL-PLT-007 | Mobile companion app | Planned | — | PLT-003 | 2.0 |
| FL-PLT-008 | Console port evaluation | Deferred | — | 1.0 | 2.0 |
| FL-PLT-009 | DLC region framework | Planned | — | CNT-010 | 2.0 |
| FL-PLT-010 | Educational licensing API | Deferred | — | 2.5 | 2.5 |
| FL-PLT-011 | Generational multiplayer | Deferred | Legacy | PLT-001 | 2.5 |
| FL-OPS-001 | Live Ops admin portal | Planned | — | 036 | 1.0 |
| FL-OPS-002 | Analytics pipeline | Planned | — | 004 | 1.0 |
| FL-OPS-003 | Seasonal event system | Planned | — | OPS-001 | 1.2 |
| FL-OPS-004 | Economy hotfix tooling | Planned | — | ENG-012 | 1.0 |
| FL-OPS-005 | A/B feature flags | Planned | — | OPS-002 | 1.5 |

---

# 8. UI/UX Backlog (By Screen)

| Screen | Route | Open Items | Priority |
|---|---|---|---|
| MainMenu | `/` | Save detection, ticker live data, skyline animation | P1 |
| CharacterCreation | `/character-creation` | Simulation binding, background balance | P1 |
| HomeScreen | `/home` | v2 hub live — capitals, feed, decision, theme, FAB | Done |
| BankingDashboard | `/banking` | Real accounts, transfers, loans, credit | P1 |
| CompanyDashboard | `/company` | Live KPIs, product launch, funding | P1 |
| EmployeeManagement | `/employees` | Full HR pipeline | P2 |
| StockMarket | `/stocks` | Order execution, margin, portfolio | P2 |
| RealEstate | `/real-estate` | Mortgage, rental management | P2 |
| VehicleDealership | `/vehicles` | Financing, insurance | P2 |
| Education | `/education` | Enrollment, schedule, outcomes | P2 |
| Family | `/family` | Tree, events, inheritance preview | P2 |
| Timeline | `/timeline` | Event river from World Memory | P2 |
| NewsFeed | `/news` | Media Engine headlines, filters | P2 |
| CityMap | `/city` | Phaser map, building inspect | P3 |
| Smartphone | `/phone` | App launcher, badges | P2 |
| Settings | `/settings` | Theme + localStorage prefs; a11y modes remaining | P2 |

See [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md).

---

# 9. Engine & Simulation Backlog

| Engine | P0/P1 Items | Status |
|---|---|---|
| Time Engine | Tick phases, offline catch-up | Planned |
| Citizen Engine | Vitals, aging, CDPS integration | Planned |
| Career Engine | Jobs, promotions, unemployment | Planned |
| Company Engine | P&L, hiring, products | Planned |
| Banking Engine | Accounts, credit, loans | Planned |
| Investment Engine | Stocks, bonds, portfolio | Planned |
| Economy Engine | GDP, inflation, cycles | Planned |
| Education Engine | Programs, GPA, graduation | Planned |
| Family Engine | Marriage, children, divorce | Planned |
| Housing Engine | Property values, rent | Planned |
| Transportation Engine | Vehicles, commute | Planned |
| Media Engine | News generation | Planned |
| Government Engine | Policy, elections | P3 |
| Tax Engine | Filing, brackets | P2 |
| Healthcare Engine | Treatment, insurance | P3 |
| Weather Engine | Seasons, disasters | P3 |
| Event Engine | Micro/macro risks | P2 |
| Legacy Engine | Score, inheritance | P2 |
| History Engine | Archival rollups | P2 |
| Analytics Engine | Telemetry aggregation | P3 |
| Multiplayer Engine | Fenix Network | P4 |

See [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md).

---

# 10. Content Backlog

| ID | Content | Qty Target | Priority | Pipeline Stage |
|---|---|---|---|---|
| FL-CNT-001 | Starter city | 1 | P1 | Brief |
| FL-CNT-002 | Industries | 20 → 60 | P1 | Design |
| FL-CNT-003 | Occupations | 12 → 50 | P1 | Design |
| FL-CNT-004 | Vehicles | 40 → 120 | P2 | Planned |
| FL-CNT-005 | Properties | 30 → 80 | P2 | Planned |
| FL-CNT-006 | Universities | 12 → 40 | P2 | Planned |
| FL-CNT-007 | Event packs | 5 → 30 | P2 | Planned |
| FL-CNT-008 | News headline templates | 100 → 500 | P2 | Planned |
| FL-CNT-009 | Achievement / legacy markers | 20 → 100 | P3 | Planned |

See [35_Content_Pipeline.md](./35_Content_Pipeline.md).

---

# 11. Technical Infrastructure Backlog

| ID | Title | Priority | Target |
|---|---|---|---|
| FL-ENG-030 | NestJS API gateway | P2 | M1.3 |
| FL-ENG-031 | PostgreSQL + Prisma setup | P1 | M1.2 |
| FL-ENG-032 | Redis cache & queues | P2 | M1.3 |
| FL-ENG-033 | Azure Blob asset CDN | P2 | EA 0.5 |
| FL-ENG-034 | WASM simulation worker | P2 | 1.0 |
| FL-ENG-035 | Save migration framework | P1 | 1.0 |
| FL-ENG-036 | CI content validation | P1 | M1.3 |
| FL-ENG-037 | E2E test suite | P2 | EA 0.5 |
| FL-ENG-038 | Observability (logs, traces) | P2 | 1.0 |
| FL-ENG-039 | Security audit | P2 | 1.0 |
| FL-ENG-040 | Mod sandbox loader | P3 | 1.2 |

---

# 12. Live Ops & Analytics Backlog

| ID | Title | Priority | Target |
|---|---|---|---|
| FL-OPS-010 | Patch notes automation | P2 | 1.0 |
| FL-OPS-011 | Player report ticket API | P2 | 1.0 |
| FL-OPS-012 | Economy Monte Carlo CI job | P1 | M1.3 |
| FL-OPS-013 | Retention dashboards | P2 | 1.0 |
| FL-OPS-014 | Exploit detection alerts | P2 | EA 0.5 |
| FL-OPS-015 | Community moderation tools | P3 | 1.5 |

See [36_Live_Operations.md](./36_Live_Operations.md).

---

# 13. Dependency Graph

```
FL-CORE-005 (FSF)
    ├── FL-ENG-001 (Time Engine)
    │       ├── FL-ENG-002 (Tick Orchestrator)
    │       ├── FL-ENG-004 (Event Bus)
    │       └── All domain engines (ENG-010–020)
    ├── FL-CORE-006 (WGS) → FL-CNT-001 (City)
    └── FL-CORE-007 (CDPS) → FL-CORE-040 (AI Population)

FL-ENG-003 (Saves) → All UI wiring (FL-UI-003–013)

FL-CORE-013 (Banking) + FL-CORE-021 (Company) → EA 0.5 playable

FL-CORE-019 (Generational) → FL-CORE-020 (Death) → 1.0

FL-PLT-001 (Fenix Network) → FL-PLT-002, 003, 004 → 1.5
```

---

# 14. Governance & Grooming

## 14.1 Grooming Cadence

| Meeting | Frequency | Outcome |
|---|---|---|
| Backlog refinement | Weekly | Priority updates |
| Sprint planning | Biweekly | Sprint scope |
| Roadmap sync | Monthly | Milestone alignment |

## 14.2 Adding Items

1. Create FL-* ID
2. Map pillars + capitals
3. Identify dependencies
4. Assign target milestone
5. Update doc 39 progress tracker

## 14.3 Deferral Rules

Items defer to P4 when:

- Violates Constitution without redesign path
- Blocked > 2 sprints without mitigation
- Out of current phase scope per doc 37

---

*End of Product Backlog*
