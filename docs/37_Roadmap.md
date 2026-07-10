# Fenix Life — Official 5-Year Roadmap

**Document Version:** 1.0  
**Status:** Canonical — Strategic Planning Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Product Leadership & Executive Team  
**Audience:** All teams, investors, partners, community (public summary derivative)  

---

## Document Authority

This Roadmap defines **Fenix Life's multi-year release plan, milestones, and strategic phases**. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Vision, pillars, expansion philosophy |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Immutable design law |
| [38_Backlog.md](./38_Backlog.md) | Feature inventory and priorities |
| [39_Project_Master_Index.md](./39_Project_Master_Index.md) | Document registry and progress |

**This document is a living plan.** Dates shift with learnings; philosophy does not.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Phases Overview](#2-strategic-phases-overview)
3. [Year 1 — Foundation (2026–2027)](#3-year-1--foundation-20262027)
4. [Year 2 — Depth (2027–2028)](#4-year-2--depth-20272028)
5. [Year 3 — Connection (2028–2029)](#5-year-3--connection-20282029)
6. [Year 4 — Expansion (2029–2030)](#6-year-4--expansion-20292030)
7. [Year 5 — Legacy Platform (2030–2031)](#7-year-5--legacy-platform-20302031)
8. [Release Milestones](#8-release-milestones)
9. [Platform & Technology Milestones](#9-platform--technology-milestones)
10. [Content & Live Ops Milestones](#10-content--live-ops-milestones)
11. [Risk Register & Dependencies](#11-risk-register--dependencies)
12. [Success Metrics by Phase](#12-success-metrics-by-phase)
13. [Governance & Review Cadence](#13-governance--review-cadence)

---

# 1. Executive Summary

Fenix Life ships as a **premium single-player life and business simulation** with a living world, then evolves into a **connected legacy platform** over five years—without sacrificing depth, symmetry, or save longevity.

| Year | Theme | Headline Deliverable |
|---|---|---|
| **Y1** | Foundation | Vertical slice → Early Access → 1.0 Core Life Sim |
| **Y2** | Depth | Full business stack, generational play, mod SDK alpha |
| **Y3** | Connection | Fenix Network multiplayer, async economy touchpoints |
| **Y4** | Expansion | DLC regions, mobile companion, creator tools |
| **Y5** | Legacy Platform | Cross-platform sync, Hall of Legends, UGC marketplace |

---

# 2. Strategic Phases Overview

```
2026        2027        2028        2029        2030        2031
│───────────│───────────│───────────│───────────│───────────│
│  PHASE A  │  PHASE B  │  PHASE C  │  PHASE D  │  PHASE E  │
│ Foundation│   Depth   │ Connection│ Expansion │  Legacy   │
│           │           │           │           │ Platform  │
└───────────┴───────────┴───────────┴───────────┴───────────┘
     ▲           ▲           ▲           ▲           ▲
   EA 0.5      1.0         1.5         2.0         2.5
```

## 2.1 Phase Gates

Each phase requires:

1. Constitution compliance audit
2. Save migration test (prior version loads)
3. Performance budget pass
4. Document 39 progress update

---

# 3. Year 1 — Foundation (2026–2027)

**Goal:** Prove the core fantasy—professional UI + interconnected life/business sim + living world.

## 3.1 Q3 2026 (Current)

| Milestone | Status | Deliverables |
|---|---|---|
| **M0.1 Documentation Foundation** | In Progress | Product Bible, Constitution, TDD, DDD, FSF, WGS, CDPS, docs 32–41 |
| **M0.2 UI Prototype** | In Progress | All dashboard screens (React), design tokens, routes |
| **M0.3 Simulation Spike** | Planned | Time Engine + Citizen Engine vertical slice |

## 3.2 Q4 2026

| Milestone | Deliverables |
|---|---|
| **M1.0 Alpha Internal** | FSF kernel, WGS single city, player citizen loop |
| **M1.1 Core Screens Wired** | Home, Banking, Company connected to simulation state |
| **M1.2 Save System v1** | Local encrypted save, autosave |

## 3.3 Q1 2027

| Milestone | Deliverables |
|---|---|
| **M1.3 Economy Loop** | Banking, Career, Company engines integrated |
| **M1.4 Education & Family** | Education Engine, Family Engine MVP |
| **M1.5 Media & News** | News Feed driven by Media Engine |

## 3.4 Q2 2027 — Early Access 0.5

| Milestone | Deliverables |
|---|---|
| **EA 0.5 Launch** | Steam Early Access (PC) |
| Scope | 1 city, 20 industries, age 18–60, single generation |
| **M1.6 Stock Market** | Investment Engine + `/stocks` |
| **M1.7 Real Estate & Vehicles** | Housing + Transportation |

## 3.5 Q3–Q4 2027 — 1.0 Core

| Milestone | Deliverables |
|---|---|
| **1.0 Launch** | Full life arc 0–80, generational handoff |
| **M1.8 Legacy Engine** | Timeline, inheritance, Legacy Score |
| **M1.9 AI Population** | 10K+ citizens T2/T3 tiers |
| **M1.10 Polish Pass** | Art/audio direction fully implemented |
| **M1.11 QA & Accessibility** | WCAG AA, localization EN + 2 languages |

---

# 4. Year 2 — Depth (2027–2028)

**Goal:** Make the simulation undeniable—business depth, world memory, modding foundation.

## 4.1 H1 2028

| Milestone | Deliverables |
|---|---|
| **1.1 Patch Series** | Industry expansion, balance, QoL |
| **M2.0 Advanced Business** | M&A, IPO pipeline, patents (Business Capital) |
| **M2.1 Government & Tax** | Elections, policy, full Tax Engine UX |
| **M2.2 Healthcare** | Healthcare Engine + life impact |
| **M2.3 World Memory v2** | Full Timeline audit, historical queries |

## 4.2 H2 2028

| Milestone | Deliverables |
|---|---|
| **M2.4 Mod SDK Alpha** | Content pack pipeline (doc 35) |
| **M2.5 City #2–3** | WGS new regions |
| **M2.6 Phaser World** | CityMap gameplay integration |
| **1.2 Release** | "Enterprise Update" — deep business systems |

---

# 5. Year 3 — Connection (2028–2029)

**Goal:** Optional multiplayer that respects sovereignty—Fenix Network.

## 5.1 H1 2029

| Milestone | Deliverables |
|---|---|
| **M3.0 Fenix Network Alpha** | Async trade, messaging, deal proposals |
| **M3.1 Cloud Saves** | Cross-device sync |
| **M3.2 Leaderboards** | Legacy Score, wealth, diverse categories |

## 5.2 H2 2029

| Milestone | Deliverables |
|---|---|
| **M3.3 Multiplayer Contracts** | Cross-world investments (bounded) |
| **M3.4 Moderation Suite** | Report, ban, audit |
| **1.5 Release** | "Connected World Update" |

**Constitution check:** Multiplayer never corrupts sovereign simulation (Product Bible §9).

---

# 6. Year 4 — Expansion (2029–2030)

**Goal:** Platform growth—DLC, mobile companion, creator ecosystem.

## 6.1 H1 2030

| Milestone | Deliverables |
|---|---|
| **M4.0 DLC Framework** | First expansion region pack |
| **M4.1 Mobile Companion** | Read-only dashboards + notifications |
| **M4.2 Console Port** | Xbox / PlayStation evaluation |

## 6.2 H2 2030

| Milestone | Deliverables |
|---|---|
| **M4.3 Creator Tools** | Timeline export, stat cards |
| **M4.4 UGC Marketplace Beta** | Curated mods |
| **2.0 Release** | "New Horizons" expansion launch |

---

# 7. Year 5 — Legacy Platform (2030–2031)

**Goal:** Fenix Life as a decade-scale platform.

| Milestone | Deliverables |
|---|---|
| **M5.0 Hall of Legends** | Cross-save legacy recognition |
| **M5.1 Generational Multiplayer** | Family dynasties across players (opt-in) |
| **M5.2 Advanced Analytics** | Player insights dashboard (privacy-safe) |
| **M5.3 API for Partners** | Educational institution licensing |
| **M5.4 Content Marketplace 1.0** | Revenue share for mod creators |
| **2.5 Release** | "Legacy Platform" milestone |

---

# 8. Release Milestones

## 8.1 Version Map

| Version | Target | Codename | Core Promise |
|---|---|---|---|
| **0.3** | Q4 2026 | Kernel | Simulation runs one life year |
| **0.5** | Q2 2027 | Early Access | Playable career + business loop |
| **1.0** | Q4 2027 | Phoenix Rising | Full life + generation |
| **1.2** | Q4 2028 | Enterprise | Deep business + government |
| **1.5** | Q4 2029 | Connected | Fenix Network |
| **2.0** | Q4 2030 | New Horizons | DLC + companion app |
| **2.5** | Q4 2031 | Legacy | Platform maturity |

## 8.2 Early Access Scope Boundaries

**In EA 0.5:**

- Single city, limited industries
- No multiplayer
- Local saves only
- English only

**Not in EA (explicit):**

- Generational play (until 1.0)
- Mod marketplace
- Mobile app

---

# 9. Platform & Technology Milestones

| ID | Milestone | Target | Doc Reference |
|---|---|---|---|
| T1 | FSF Time + Citizen engines | Q4 2026 | doc 14 |
| T2 | WGS pipeline production | Q1 2027 | doc 15 |
| T3 | CDPS full integration | Q2 2027 | doc 16 |
| T4 | PostgreSQL + Prisma production | Q2 2027 | doc 04 |
| T5 | Event sourcing audit log | Q3 2027 | doc 04, 14 |
| T6 | WASM simulation worker | Q4 2027 | doc 03 |
| T7 | Cloud save + sync | Q2 2029 | doc 03 |
| T8 | Mod manifest validation | Q4 2028 | doc 03, 35 |

---

# 10. Content & Live Ops Milestones

| ID | Milestone | Target |
|---|---|---|
| C1 | Content pipeline CI | Q1 2027 |
| C2 | 24 industries at EA | Q2 2027 |
| C3 | Live Ops calendar v1 | Q3 2027 (1.0 launch) |
| C4 | Seasonal events | Q1 2028 |
| C5 | First DLC region | Q2 2030 |

See [36_Live_Operations.md](./36_Live_Operations.md).

---

# 11. Risk Register & Dependencies

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Simulation scope creep | Delay 1.0 | Phase gates, backlog ruthlessness | Product |
| Performance at scale | AI citizen cap | FSF tier system | Engineering |
| Economy exploits | Player trust | Live Ops hotfix playbook | Economy |
| Save corruption | Catastrophic | Event sourcing, backups | Engineering |
| Multiplayer complexity | Delay 1.5 | Async-first, sovereign rule | Architecture |
| Team bandwidth | Slip | Hire simulation engineers Q1 2027 | Executive |

## 11.1 Critical Path Dependencies

```
Constitution + Bible → FSF → WGS → CDPS → UI Screens → Content Pipeline → EA 0.5 → 1.0
                                              ↓
                                         Fenix Network → 1.5
```

---

# 12. Success Metrics by Phase

| Phase | KPI Target |
|---|---|
| EA 0.5 | 10K units, 60% D7 retention, median 5 in-game years |
| 1.0 | 85% Steam positive, median 20 in-game years |
| 1.2 | 30% players engage Business Capital depth |
| 1.5 | 20% opt into Fenix Network |
| 2.0 | DLC attach rate 25% |
| 2.5 | 40% players reach generational handoff |

---

# 13. Governance & Review Cadence

| Cadence | Activity |
|---|---|
| Monthly | Roadmap vs actual review |
| Quarterly | Phase gate decision |
| Major release | Public roadmap update |
| Constitution conflict | Executive + Creative Director |

Amendments to this roadmap require Product Lead approval and doc 39 update.

---

*End of 5-Year Roadmap*
