# Fenix Life — Project Master Index

**Document Version:** 1.0  
**Status:** Canonical — Documentation Registry & Progress Tracker  
**Last Updated:** July 10, 2026  
**Owner:** Product Operations & Technical Program Management  
**Audience:** All teams, new hires, partners, auditors  

---

## Document Authority

This Project Master Index is the **single registry of all Fenix Life documentation** (00–41), dependency graph, implementation status, and reading paths. When documents conflict, resolve in this order:

1. [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) — product vision  
2. [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) — immutable design law  
3. Domain canonical docs (02–41) — must not contradict 00 or 01  
4. [38_Backlog.md](./38_Backlog.md) — feature inventory (subordinate to specs)  

**Rule:** Every shipped feature links to ≥1 doc ID in this index.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Document Numbering System](#2-document-numbering-system)
3. [Complete Document Registry (00–41)](#3-complete-document-registry-0041)
4. [Document Dependency Graph](#4-document-dependency-graph)
5. [Reading Paths by Role](#5-reading-paths-by-role)
6. [Implementation Progress Tracker](#6-implementation-progress-tracker)
7. [Codebase ↔ Documentation Map](#7-codebase--documentation-map)
8. [External References & Tools](#8-external-references--tools)
9. [RFC & Amendment Process](#9-rfc--amendment-process)
10. [Changelog](#10-changelog)

---

# 1. Executive Summary

| Category | Total Docs | Complete | In Progress | Planned |
|---|---|---|---|---|
| **Phase 1 — Vision (00–04, 14–16)** | 8 | 8 | 0 | 0 |
| **Phase 2 — Core Simulation (17–24)** | 8 | 8 | 0 | 0 |
| **Phase 3 — Engineering (25–31)** | 7 | 7 | 0 | 0 |
| **Phase 4 — Production (32–36)** | 5 | 5 | 0 | 0 |
| **Phase 5 — Studio (37–41)** | 5 | 5 | 0 | 0 |
| **Domain Game Design (05–13)** | 9 | 9 | 0 | 0 |
| **Admin & Build (42, kickoff)** | 2 | 2 | 0 | 0 |
| **TOTAL (00–42)** | **44** | **44** | **0** | **0** |

**Project phase:** Pre-Alpha — Documentation complete; **official build starts** via [BUILD_KICKOFF_PROMPT.md](./BUILD_KICKOFF_PROMPT.md)  
**Next gate:** M1.0 Alpha Internal (Q4 2026) per [37_Roadmap.md](./37_Roadmap.md)

---

# 2. Document Numbering System

| Range | Category | Purpose |
|---|---|---|
| **00–04** | Vision — Foundation | Product Bible, Constitution, GDD, TDD, Database |
| **05–13** | Optional Domain Specs | Feature-level player-facing game design |
| **14–16** | Vision — Simulation Core | FSF, WGS, CDPS — engine architecture |
| **17–24** | Core Simulation | Time, economy, companies, citizens, events, history, news, multiplayer |
| **25–31** | Engineering | API, saves, mods, architecture, testing, standards, Cursor AI Studio |
| **32–36** | Production | Art, audio, UI/UX, content pipeline, live ops |
| **37–41** | Studio | Roadmap, backlog, master index, onboarding, glossary |

**File naming:** `NN_Topic_Name.md` in `/docs/` except 00 in `/prd/`.

**Status legend:**

| Status | Meaning |
|---|---|
| ✅ **Complete** | v1.0 canonical, reviewed |
| 🔄 **In Progress** | Draft or partial |
| 📋 **Planned** | Slotted, not authored |
| ⚠️ **Superseded** | Replaced by newer doc (none currently) |

---

# 3. Complete Document Registry (00–41)

## Phase 0 — Foundation (00–04)

| ID | Title | File Path | Status | Owner | Last Updated |
|---|---|---|---|---|---|
| **00** | Product Bible | [prd/FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | ✅ Complete | Product Leadership | 2026-07-10 |
| **01** | Design Constitution | [docs/Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | ✅ Complete | Creative Director | 2026-07-10 |
| **02** | Game Design Document (GDD) | [docs/02_Game_Design_Document.md](./02_Game_Design_Document.md) | ✅ Complete | Lead Systems Designer | 2026-07-10 |
| **03** | Technical Design Document (TDD) | [docs/Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | ✅ Complete | Principal Architecture | 2026-07-10 |
| **04** | Database Design Document (DDD) | [docs/Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | ✅ Complete | Data Architecture | 2026-07-10 |

### Phase 0 Summaries

**00 — Product Bible:** Root vision document. 20 sections covering pillars, loops, economy, family, education, multiplayer, monetization, accessibility. All features must trace here.

**01 — Design Constitution:** Immutable law. Citizen Equality, Living World, Five Capitals, Legacy Philosophy, World Memory. Features that violate must be redesigned.

**02 — GDD:** Consolidated player-facing gameplay spec. Loops, life stages, Five Capitals, archetypes, victory paths, screen flows, progression, succession, EA scope, acceptance criteria. Companion to domain specs 05–13.

**03 — TDD:** 10-section engineering architecture. Clean Architecture, NestJS, PostgreSQL, React/Phaser client, event-driven simulation, saves, security, mods.

**04 — DDD:** Data domains, event storage, historical tiering, multiplayer data, analytics schema, save format.

---

## Phase 1 — Game Design Domain Specs (05–13)

| ID | Title | File Path | Status | Depends On |
|---|---|---|---|---|
| **05** | Economy Design | [docs/05_Economy_Design.md](./05_Economy_Design.md) | ✅ Complete | 00, 01, 14, 18 |
| **06** | Business Systems Design | [docs/06_Business_Systems_Design.md](./06_Business_Systems_Design.md) | ✅ Complete | 00, 01, 05, 14, 19 |
| **07** | Career & Employment Design | [docs/07_Career_Employment_Design.md](./07_Career_Employment_Design.md) | ✅ Complete | 00, 01, 05, 16, 20 |
| **08** | Education Design | [docs/08_Education_Design.md](./08_Education_Design.md) | ✅ Complete | 00, 01, 07, 16 |
| **09** | Family & Relationships Design | [docs/09_Family_Relationships_Design.md](./09_Family_Relationships_Design.md) | ✅ Complete | 00, 01, 16 |
| **10** | Real Estate & Housing Design | [docs/10_Real_Estate_Housing_Design.md](./10_Real_Estate_Housing_Design.md) | ✅ Complete | 00, 01, 05, 18 |
| **11** | Banking & Finance Design | [docs/11_Banking_Finance_Design.md](./11_Banking_Finance_Design.md) | ✅ Complete | 00, 01, 05, 18 | 2026-07-10 |
| **12** | Investment & Markets Design | [docs/12_Investment_Markets_Design.md](./12_Investment_Markets_Design.md) | ✅ Complete | 00, 01, 05, 11, 18 | 2026-07-10 |
| **13** | Government & Tax Design | [docs/13_Government_Tax_Design.md](./13_Government_Tax_Design.md) | ✅ Complete | 00, 01, 05, 18 | 2026-07-10 |

---

## Phase 1 — Simulation Core (14–16)

| ID | Title | File Path | Status | Owner | Last Updated |
|---|---|---|---|---|---|
| **14** | Fenix Simulation Framework (FSF) | [docs/Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | ✅ Complete | Chief Simulation Architect | 2026-07-10 |
| **15** | World Generation System (WGS) | [docs/Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | ✅ Complete | Lead World Simulation Designer | 2026-07-10 |
| **16** | Citizen DNA & Personality System (CDPS) | [docs/Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) | ✅ Complete | Lead AI Designer | 2026-07-10 |

### Phase 1 Simulation Core Summaries

**14 — FSF:** 22 engines, tick orchestration, agent tiers T0–T3, event bus, lifecycle, scalability, debugging.

**15 — WGS:** 7-phase seed pipeline, synthetic history, society fabrication, player entry, regional culture.

**16 — CDPS:** Genotype, temperament, 18 traits, memories, goals, decision model, family inheritance.

---

## Phase 2 — Core Simulation (17–24)

| ID | Title | File Path | Status | Depends On | Last Updated |
|---|---|---|---|---|---|
| **17** | Time Simulation System | [docs/17_Time_Simulation_System.md](./17_Time_Simulation_System.md) | ✅ Complete | 14, 03, 04 | 2026-07-10 |
| **18** | Economy Engine | [docs/18_Economy_Engine.md](./18_Economy_Engine.md) | ✅ Complete | 14, 04, 01 | 2026-07-10 |
| **19** | Company Simulation | [docs/19_Company_Simulation.md](./19_Company_Simulation.md) | ✅ Complete | 14, 16, 18 | 2026-07-10 |
| **20** | Citizen AI | [docs/20_Citizen_AI.md](./20_Citizen_AI.md) | ✅ Complete | 16, 14, 17 | 2026-07-10 |
| **21** | Event System | [docs/21_Event_System.md](./21_Event_System.md) | ✅ Complete | 14, 16, 17 | 2026-07-10 |
| **22** | History Engine | [docs/22_History_Engine.md](./22_History_Engine.md) | ✅ Complete | 04, 14, 21 | 2026-07-10 |
| **23** | News Engine | [docs/23_News_Engine.md](./23_News_Engine.md) | ✅ Complete | 14, 21, 22 | 2026-07-10 |
| **24** | Multiplayer Architecture | [docs/24_Multiplayer_Architecture.md](./24_Multiplayer_Architecture.md) | ✅ Complete | 03, 04, 14 | 2026-07-10 |

### Phase 2 Summaries (17–24)

**17 — Time Simulation:** Game clock, acceleration modes, nested tick phases (daily→annual), Tick Orchestrator, offline catch-up, performance budgets.

**18 — Economy Engine:** Inflation, supply/demand, banking, credit, taxes, fiscal policy, trade, housing, fuel, business cycles.

**19 — Company Simulation:** Departments, culture, board, investors, HR lifecycle, products, M&A, IPO, bankruptcy, reputation.

**20 — Citizen AI:** Runtime orchestration over CDPS — goals, habits, memory, emotions, utility decisions, career/spending/investment AI.

**21 — Event System:** Random, historical, emergent, disaster, political, business, and personal events; propagation and World Memory.

**22 — History Engine:** Biographies, timelines, corporate histories, newspaper archives, Hall of Legends.

**23 — News Engine:** Diegetic newspapers, TV, social media, rumours, journalists, market wire, sentiment feedback.

**24 — Multiplayer Architecture:** Fenix Network, cloud saves, friends, messaging, partnerships, investments, leaderboards, privacy, anti-cheat.

---

## Phase 3 — Engineering (25–31)

| ID | Title | File Path | Status | Depends On | Last Updated |
|---|---|---|---|---|---|
| **25** | API Design | [docs/25_API_Design.md](./25_API_Design.md) | ✅ Complete | 03, 04, 24 | 2026-07-10 |
| **26** | Save System | [docs/26_Save_System.md](./26_Save_System.md) | ✅ Complete | 03, 04, 14 | 2026-07-10 |
| **27** | Mod Framework | [docs/27_Mod_Framework.md](./27_Mod_Framework.md) | ✅ Complete | 03, 35, 14 | 2026-07-10 |
| **28** | Project Architecture | [docs/28_Project_Architecture.md](./28_Project_Architecture.md) | ✅ Complete | 03, 25 | 2026-07-10 |
| **29** | Testing Strategy | [docs/29_Testing_Strategy.md](./29_Testing_Strategy.md) | ✅ Complete | 03, 14, 38 | 2026-07-10 |
| **30** | Coding Standards | [docs/30_Coding_Standards.md](./30_Coding_Standards.md) | ✅ Complete | 03, 28 | 2026-07-10 |
| **31** | Cursor AI Studio | [docs/31_Cursor_AI_Studio.md](./31_Cursor_AI_Studio.md) | ✅ Complete | 30, 28, 40 | 2026-07-10 |

### Phase 3 Summaries (25–31)

**25 — API Design:** REST endpoints, WebSocket events, schemas, versioning, auth, RBAC, rate limits.

**26 — Save System:** Autosave, cloud sync, compression, encryption, snapshots, incremental deltas, migration, recovery.

**27 — Mod Framework:** Steam Workshop, manifest spec, content hooks, sandboxing, symmetry rules.

**28 — Project Architecture:** Monorepo layout, package boundaries, Clean Architecture, dependency rules.

**29 — Testing Strategy:** Unit, integration, simulation golden, AI symmetry, economy Monte Carlo, save chaos, E2E.

**30 — Coding Standards:** TypeScript strict rules, naming, DDD, SOLID, events, review checklist.

**31 — Cursor AI Studio:** AI roles, context protocol, implementation workflow, prompt templates, quality gates.

---

## Phase 4 — Production (32–36)

| ID | Title | File Path | Status | Owner | Last Updated |
|---|---|---|---|---|---|
| **32** | Art Direction | [docs/32_Art_Direction.md](./32_Art_Direction.md) | ✅ Complete | Creative Director | 2026-07-10 |
| **33** | Audio Direction | [docs/33_Audio_Direction.md](./33_Audio_Direction.md) | ✅ Complete | Audio Director | 2026-07-10 |
| **34** | UI/UX Guidelines | [docs/34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | ✅ Complete | UX Director | 2026-07-10 |
| **35** | Content Pipeline | [docs/35_Content_Pipeline.md](./35_Content_Pipeline.md) | ✅ Complete | Lead Content Designer | 2026-07-10 |
| **36** | Live Operations | [docs/36_Live_Operations.md](./36_Live_Operations.md) | ✅ Complete | Live Ops Director | 2026-07-10 |

---

## Phase 5 — Studio (37–41)

| ID | Title | File Path | Status | Owner | Last Updated |
|---|---|---|---|---|---|
| **37** | 5-Year Roadmap | [docs/37_Roadmap.md](./37_Roadmap.md) | ✅ Complete | Product Leadership | 2026-07-10 |
| **38** | Product Backlog | [docs/38_Backlog.md](./38_Backlog.md) | ✅ Complete | Product Management | 2026-07-10 |
| **39** | Project Master Index | [docs/39_Project_Master_Index.md](./39_Project_Master_Index.md) | ✅ Complete | Product Operations | 2026-07-10 |
| **40** | Developer Onboarding | [docs/40_Developer_Onboarding.md](./40_Developer_Onboarding.md) | ✅ Complete | Engineering Lead | 2026-07-10 |
| **41** | Fenix Glossary | [docs/41_Fenix_Glossary.md](./41_Fenix_Glossary.md) | ✅ Complete | Technical Writing | 2026-07-10 |

---

## Build & Admin (42+)

| ID | Title | File Path | Status | Owner | Last Updated |
|---|---|---|---|---|---|
| **42** | Admin Portal Design | [docs/42_Admin_Portal_Design.md](./42_Admin_Portal_Design.md) | ✅ Complete | Platform Engineering | 2026-07-10 |
| **—** | Build Kickoff Prompt | [docs/BUILD_KICKOFF_PROMPT.md](./BUILD_KICKOFF_PROMPT.md) | ✅ Complete | Engineering Lead | 2026-07-10 |

**42 — Admin Portal:** Internal ops UI — accounts, moderation, saves inspect, economy health, feature flags, audit log. `apps/admin` per Doc 28.

**Build Kickoff:** Master prompt for new Cursor chat to begin official implementation (Phases A–E).

---

# 4. Document Dependency Graph

```
                    ┌─────────────┐
                    │  00 Bible   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ 01 Constitution│
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  02 GDD     │ │  03 TDD     │ │  32–34 Prod │
    │  (planned)  │ │  04 DDD     │ │  Direction  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
    ┌──────▼──────┐        │        ┌──────▼──────┐
    │ 05–13 Domain│        │        │ 34 UI/UX    │
    │   (planned) │        │        └──────┬──────┘
    └──────┬──────┘        │               │
           │        ┌──────▼──────┐        │
           └───────►│ 14 FSF      │◄───────┘
                    └──────┬──────┘
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐
       │ 15 WGS      │ │16 CDPS│ │ 17–24 Core  │
       └──────┬──────┘ └───┬───┘ │  Simulation │
              │            │     └──────┬──────┘
              └────────────┼────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐
       │ 25–31 Eng   │ │35 Cont│ │ 32–34 Prod  │
       └──────┬──────┘ └───┬───┘ └──────┬──────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │ 36 Live Ops │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐
       │ 37 Roadmap  │ │38 Backlog│ │ 40–41 Ref  │
       └─────────────┘ └───────┘ └─────────────┘
```

## 4.1 Hard Dependencies (Must Read Before Building)

| If you are building… | Read first |
|---|---|
| Any feature | 00, 01 |
| Simulation / engine code | 14, 03, 04 |
| AI citizens | 16, 14, 01 |
| New world / city | 15, 14, 05 |
| UI screen | 34, 32, 00 §3 |
| Content pack | 35, 14, 04 |
| Live event | 36, 14, 35 |
| Time / tick system | 17, 14, 03 |
| Economy | 18, 14, 04 |
| Companies | 19, 18, 16 |
| Citizen AI runtime | 20, 16, 17 |
| Events | 21, 14, 22 |
| History / news | 22, 23, 04 |
| Multiplayer | 24, 03, 01 §9 |
| API / saves / mods | 25, 26, 27, 03 |

---

# 5. Reading Paths by Role

## 5.1 Day 1 — Everyone

1. [00 Product Bible](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) — §1–4, §20  
2. [01 Design Constitution](./Fenix-Life-Design-Constitution.md) — full  
3. [41 Fenix Glossary](./41_Fenix_Glossary.md) — skim  
4. [39 Project Master Index](./39_Project_Master_Index.md) — this doc  

## 5.2 Software Engineer

1. Day 1 path  
2. [40 Developer Onboarding](./40_Developer_Onboarding.md)  
3. [03 TDD](./Fenix-Life-Technical-Design-Document.md)  
4. [14 FSF](./Fenix-Simulation-Framework.md)  
5. [17 Time Simulation](./17_Time_Simulation_System.md)  
6. [04 DDD](./Fenix-Life-Database-Design-Document.md)  
7. [25 API Design](./25_API_Design.md)  
8. [26 Save System](./26_Save_System.md)  
9. [28 Project Architecture](./28_Project_Architecture.md)  
10. [30 Coding Standards](./30_Coding_Standards.md)  
11. [31 Cursor AI Studio](./31_Cursor_AI_Studio.md)  
12. [34 UI/UX Guidelines](./34_UI_UX_Guidelines.md)  
13. [38 Backlog](./38_Backlog.md) — assigned items  

## 5.3 Game / Systems Designer

1. Day 1 path  
2. [02 GDD](./02_Game_Design_Document.md) — full  
3. Domain specs [05](./05_Economy_Design.md)–[13](./13_Government_Tax_Design.md) as needed  
3. [14 FSF](./Fenix-Simulation-Framework.md)  
4. [17 Time Simulation](./17_Time_Simulation_System.md)  
5. [18 Economy Engine](./18_Economy_Engine.md)  
6. [19 Company Simulation](./19_Company_Simulation.md)  
7. [20 Citizen AI](./20_Citizen_AI.md)  
8. [15 WGS](./Fenix-Life-World-Generation-System.md)  
9. [16 CDPS](./Fenix-Life-Citizen-DNA-Personality-System.md)  
10. [21 Event System](./21_Event_System.md)  
11. [35 Content Pipeline](./35_Content_Pipeline.md)  
12. [37 Roadmap](./37_Roadmap.md)  

## 5.4 UI/UX Designer

1. Day 1 path  
2. [34 UI/UX Guidelines](./34_UI_UX_Guidelines.md)  
3. [32 Art Direction](./32_Art_Direction.md)  
4. [33 Audio Direction](./33_Audio_Direction.md) — notification tiers  
5. `src/imports/pasted_text/fenix-life-ui-ux.md` — prototype spec  
6. Live screens in `src/app/screens/`  

## 5.5 Artist / Animator

1. Day 1 path  
2. [32 Art Direction](./32_Art_Direction.md)  
3. [34 UI/UX Guidelines](./34_UI_UX_Guidelines.md) — screen list  
4. [15 WGS](./Fenix-Life-World-Generation-System.md) — §7 infrastructure art  
5. [35 Content Pipeline](./35_Content_Pipeline.md) — §12  

## 5.6 Audio Designer

1. Day 1 path  
2. [33 Audio Direction](./33_Audio_Direction.md)  
3. [34 UI/UX Guidelines](./34_UI_UX_Guidelines.md) — screen list  
4. [14 FSF](./Fenix-Simulation-Framework.md) — engine events for triggers  

## 5.7 Live Ops / Product Ops

1. Day 1 path  
2. [36 Live Operations](./36_Live_Operations.md)  
3. [37 Roadmap](./37_Roadmap.md)  
4. [38 Backlog](./38_Backlog.md)  
5. [35 Content Pipeline](./35_Content_Pipeline.md)  

## 5.8 QA

1. Day 1 path  
2. [34 UI/UX Guidelines](./34_UI_UX_Guidelines.md)  
3. [38 Backlog](./38_Backlog.md)  
4. [21 QA Strategy](./21_QA_Test_Strategy.md) when available  
5. [01 Constitution](./Fenix-Life-Design-Constitution.md) — symmetry tests  

---

# 6. Implementation Progress Tracker

## 6.1 Documentation Progress

| Phase | Complete | Total | % |
|---|---|---|---|
| 00–04 Foundation | 5 | 5 | 100% |
| 05–13 Domain Game Design | 9 | 9 | 100% |
| 14–16 Simulation Core | 3 | 3 | 100% |
| 17–24 Core Simulation | 8 | 8 | 100% |
| 25–31 Engineering | 7 | 7 | 100% |
| 32–41 Production & Studio | 10 | 10 | 100% |
| **Overall** | **42** | **42** | **100%** |

## 6.2 Engineering Progress (Codebase)

| Area | Status | Evidence |
|---|---|---|
| Monorepo structure | ✅ Complete | `apps/client`, `apps/api`, `packages/domain` — Phase A (Doc 28) |
| UI prototype screens | ✅ Complete | 16 routes — all wired to simulation |
| Design tokens | ✅ Complete | `apps/client/src/styles/theme.css` |
| shadcn/ui components | ✅ Complete | `apps/client/src/app/components/ui/` |
| Domain package | 🔄 In Progress | Money, SaveId, WorldInstance, Five Capitals, Career v0 |
| Player auth + saves | ✅ Complete | Login/register, JWT, create/load saves — Phase B (Doc 25, 26) |
| Simulation kernel v0 | ✅ Complete | Time engine, worker bridge, blob persist — Phase C |
| Admin portal | ✅ Complete | `apps/admin` — login, dashboard, accounts, audit — Phase D |
| Playable meso loop | ✅ Complete | Banking, company, news, time controls — Phase E–F |
| Five Capitals dashboard | ✅ Complete | Home strip from live simulation — Phase G |
| Career / employment v0 | ✅ Complete | Career state, salary sync, education wire — Phase G |
| Employee roster v0 | ✅ Complete | Deterministic HR roster from company state — Phase H |
| Main menu live data | ✅ Complete | Save count, recent life, macro ticker — Phase H |
| Investment portfolio v0 | ✅ Complete | Live quotes, holdings, daily drift — Phase I |
| Player settings persistence | ✅ Complete | localStorage prefs + autosave toggle — Phase I |
| Housing / real estate v0 | ✅ Complete | Property portfolio, rental income — Phase J |
| Transportation v0 | ✅ Complete | Vehicle garage, depreciation — Phase J |
| Family household v0 | ✅ Complete | Members, happiness, expenses — Phase K |
| Life timeline + legacy | ✅ Complete | Events river, legacy score — Phase K |
| Smartphone hub | ✅ Complete | Live stats, app launcher — Phase L |
| City map districts | ✅ Complete | Origin-based districts + activity — Phase M |
| Simulation engines | 📋 Planned | Full FSF engine constellation (Doc 14) |
| Database / Prisma | 🔄 In Progress | Platform schema + UserRole, AdminAuditLog, FeatureFlag (Doc 42) |
| Content packs | 📋 Planned | `/content/` not yet created |
| Phaser city map | 📋 Planned | Route exists, engine TBD |
| Save system | 🔄 In Progress | Blob upload/download + autosave; full FLSS binary format later |
| Backend API | 🔄 In Progress | Express in `apps/api` — auth, saves, admin routes |

## 6.3 Milestone Tracker

| Milestone | Target | Doc Status | Code Status |
|---|---|---|---|
| M0.1 Documentation Foundation | Q3 2026 | ✅ 100% (42/42) | UI prototype |
| M1.0 Alpha Internal | Q4 2026 | All docs complete | All screens wired (Phases A–M) |
| EA 0.5 | Q2 2027 | Docs complete | Full loop |
| 1.0 Launch | Q4 2027 | Docs complete | Generational play |

## 6.4 Screen Implementation Matrix

| Screen | Route | UI Shell | Sim Wired | Doc |
|---|---|---|---|---|
| MainMenu | `/` | ✅ | ✅ | 34 §5.1 |
| CharacterCreation | `/character-creation` | ✅ | ✅ | 34 §5.2 |
| HomeScreen | `/home` | ✅ | ✅ | 34 §5.3 |
| BankingDashboard | `/banking` | ✅ | ✅ | 34 §5.4 |
| CompanyDashboard | `/company` | ✅ | ✅ | 34 §5.5 |
| NewsFeed | `/news` | ✅ | ✅ | 34 §5.13 |
| Education | `/education` | ✅ | ✅ | 34 §5.10 |
| EmployeeManagement | `/employees` | ✅ | ✅ | 34 §5.6 |
| StockMarket | `/stocks` | ✅ | ✅ | 34 §5.7 |
| RealEstate | `/real-estate` | ✅ | ✅ | 34 §5.8 |
| VehicleDealership | `/vehicles` | ✅ | ✅ | 34 §5.9 |
| Family | `/family` | ✅ | ✅ | 34 §5.11 |
| Timeline | `/timeline` | ✅ | ✅ | 34 §5.12 |
| CityMap | `/city` | ✅ | ✅ | 34 §5.14 |
| Smartphone | `/phone` | ✅ | ✅ | 34 §5.15 |
| Settings | `/settings` | ✅ | ✅ | 34 §5.16 |

---

# 7. Codebase ↔ Documentation Map

| Code Path | Documentation |
|---|---|
| `prd/FENIX-LIFE-PRODUCT-BIBLE.md` | 00 |
| `docs/Fenix-Life-Design-Constitution.md` | 01 |
| `docs/Fenix-Life-Technical-Design-Document.md` | 03 |
| `docs/Fenix-Life-Database-Design-Document.md` | 04 |
| `docs/Fenix-Simulation-Framework.md` | 14 |
| `docs/Fenix-Life-World-Generation-System.md` | 15 |
| `docs/Fenix-Life-Citizen-DNA-Personality-System.md` | 16 |
| `docs/32_Art_Direction.md` | 32 |
| `docs/33_Audio_Direction.md` | 33 |
| `docs/34_UI_UX_Guidelines.md` | 34 |
| `apps/client/src/app/routes.tsx` | 34 §3.1 |
| `apps/client/src/app/screens/*.tsx` | 34 §5 |
| `apps/client/src/styles/theme.css` | 32 §3 |
| `apps/client/src/app/components/ui/` | 32 §8, 34 §4 |
| `apps/client/src/imports/pasted_text/fenix-life-ui-ux.md` | 34 (prototype origin) |
| `apps/api/src/routes/admin/` | 42, 25 §17 |
| `apps/admin/src/` | 42 |
| `packages/domain/src/` | 04, 14, 26 |
| `prisma/schema.prisma` | 04, 42 |
| `guidelines/Guidelines.md` | 32, 34 (supplementary) |
| `content/` (future) | 35 |
| `audio/` (future) | 33, 30 (planned) |

---

# 8. External References & Tools

| Tool | Purpose | Link / Location |
|---|---|---|
| React + Vite | Client framework | `apps/client/package.json` |
| Tailwind CSS 4 | Styling | `apps/client/src/styles/` |
| shadcn/ui | Components | `apps/client/src/app/components/ui/` |
| Express | API (M1.0) | `apps/api/` |
| PostgreSQL + Prisma | Database | `prisma/schema.prisma` |
| Figma | Design system (TBD) | Art Director |
| Steam | PC distribution | Roadmap EA 0.5 |

---

# 9. RFC & Amendment Process

## 9.1 Document Amendments

| Change Type | Approval | Version Bump |
|---|---|---|
| Typo / clarity | Doc owner | Patch |
| New section, non-breaking | Doc owner + 1 reviewer | Minor |
| Philosophy change | Creative Director + Product | Major (Bible/Constitution only with executive) |
| Breaking schema | Engineering + Product | Major |

## 9.2 RFC Location

`/docs/rfcs/{YYYY-MM-DD}-{slug}.md`

## 9.3 Index Updates

Any new doc or status change **must** update this file (39) within 48 hours.

---

# 10. Changelog

| Date | Version | Changes |
|---|---|---|
| 2026-07-10 | 1.4 | Phase D admin portal: staff login, accounts, saves inspect, audit log |
| 2026-07-10 | 1.3 | Phase C simulation kernel v0: time engine, worker bridge, save blobs |
| 2026-07-10 | 1.2 | Phase B auth + save loop: login, register, JWT, create/continue saves |
| 2026-07-10 | 1.1 | Phase A monorepo migration: `apps/client`, `apps/api`, `packages/domain`; Prisma admin models |
| 2026-07-10 | 1.0 | Initial master index; registered docs 00–41; Phase 4 complete |
| 2026-07-10 | 1.0 | Completed domain specs 08 Education, 09 Family & Relationships, 10 Real Estate & Housing |

---

*End of Project Master Index*
