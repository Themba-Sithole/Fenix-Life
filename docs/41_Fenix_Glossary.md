# Fenix Life — Official Glossary

**Document Version:** 1.0  
**Status:** Canonical — Terminology Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Technical Writing & Product Operations  
**Audience:** All teams, partners, community wiki editors, localization  

---

## Document Authority

This glossary is the **authoritative dictionary** for Fenix Life terminology. When terms conflict across documents, **this glossary wins** after Product Bible (00) and Design Constitution (01).

**Conventions:**

- **Canonical term** — use in docs, UI, and code identifiers
- ~~Deprecated~~ — do not use in new work
- *See also* — related entries

For document references, see [39_Project_Master_Index.md](./39_Project_Master_Index.md).

---

## Table of Contents

1. [How to Use This Glossary](#1-how-to-use-this-glossary)
2. [Core Product Terms](#2-core-product-terms)
3. [Five Capitals](#3-five-capitals)
4. [Simulation & Architecture](#4-simulation--architecture)
5. [FSF Engines](#5-fsf-engines)
6. [Citizen & Personality (CDPS)](#6-citizen--personality-cdps)
7. [World Generation (WGS)](#7-world-generation-wgs)
8. [Economy & Finance](#8-economy--finance)
9. [Business & Career](#9-business--career)
10. [UI, Screens & Navigation](#10-ui-screens--navigation)
11. [Content & Data Pipeline](#11-content--data-pipeline)
12. [Multiplayer & Platform](#12-multiplayer--platform)
13. [Live Operations & Analytics](#13-live-operations--analytics)
14. [Art, Audio & UX](#14-art-audio--ux)
15. [Technical & Engineering](#15-technical--engineering)
16. [Abbreviations & Acronyms](#16-abbreviations--acronyms)
17. [Deprecated & Aliases](#17-deprecated--aliases)

---

# 1. How to Use This Glossary

| Column | Meaning |
|---|---|
| **Term** | Canonical name (PascalCase for code entities, Title Case for docs) |
| **Definition** | Precise meaning in Fenix Life |
| **Context** | Where it appears |
| **Doc** | Primary reference document ID |

**Sorting:** Within each section, terms are alphabetical.

**Localization:** Canonical English term is the `i18n` key source. Do not translate code identifiers.

---

# 2. Core Product Terms

| Term | Definition | Context | Doc |
|---|---|---|---|
| **Citizen** | Any simulated person—player-controlled or AI—governed by the same fundamental rules | Simulation, design | 01, 14, 16 |
| **Citizen Equality** | Constitutional principle: player has no hidden simulation advantages over AI | Design law | 01 |
| **Core Pillars** | Seven design commitments (Depth, Living World, Symmetry, etc.) anchoring all features | Product | 00 §4 |
| **Diegetic Interface** | UI framed as in-world artifacts (bank apps, phones, dashboards) | UX | 00 §3, 34 |
| **Emergence** | Stories arising from system interaction, not bespoke scripts | Simulation | 00, 14 |
| **Fenix Life** | Official product name. Premium 2D life and business simulation | All | 00 |
| **Generational Play** | Continuing as heir or new citizen after death; legacy across generations | Gameplay | 00, 01 |
| **Legacy** | Enduring impact of a life after death; see Legacy Capital | Gameplay | 01 §IV |
| **Living World** | World simulates continuously whether player is active or not | Design law | 01 §II, 00 §10 |
| **Operator Fantasy** | Player feels like executive of their own life—data-rich, decision-focused | UX | 34 |
| **Phoenix Theme** | Symbol of resilience, reinvention, and legacy—not a cartoon mascot | Art, narrative | 32, 00 |
| **Player** | Human user controlling one citizen (at a time) in a WorldInstance | All | 01 |
| **Premium** | Quality, depth, and trust positioning—not pay-to-win | Product | 00 §2 |
| **Simulation-First** | Systems truth precedes UI; engines own state | Engineering | 14 |
| **Sovereign World** | WorldInstance authoritative to one player; multiplayer touches via contracts only | Architecture | 03, 00 §9 |
| **Symmetry Principle** | AI and player share rule engines | Engineering, design | 03, 01 |
| **World Memory** | Append-only record of consequential simulation events | Data, narrative | 01, 04, 14 |

---

# 3. Five Capitals

The **Five Capitals Framework** (Constitution Article III) measures citizen success across interconnected forms of value.

| Term | Definition | Components (summary) | Doc |
|---|---|---|---|
| **Business Capital** | Institutional and competitive power through enterprise | Companies, brands, IP, employees, customers, market share | 01 |
| **Financial Capital** | Measurable economic power | Cash, income, assets, investments, debt, credit score, business value | 01 |
| **Five Capitals** | The complete success framework | Financial, Human, Social, Business, Legacy | 01 |
| **Human Capital** | Intrinsic capabilities—mind, body, craft | Education, skills, experience, leadership, health | 01 |
| **Legacy Capital** | Enduring impact after death | Family reputation, institutions, philanthropy, generational wealth, recognition | 01 |
| **Social Capital** | Relationship strength and community standing | Networks, trust, reputation, influence, mentorship | 01 |
| **Capital Diversity Index** | Analytics metric: how many capitals a player progressed | Live Ops | 36 |

---

# 4. Simulation & Architecture

| Term | Definition | Context | Doc |
|---|---|---|---|
| **Agent Fidelity Tier** | T0–T3 computational detail level for citizens | Performance | 14 §3.5 |
| **Aggregate** | Cluster of entities with single writer engine (e.g., one citizen's vitals) | DDD, FSF | 04, 14 |
| **CDPS** | Citizen DNA & Personality System | AI behaviour | 16 |
| **Command** | Intent to mutate state; validated by owning engine | Event architecture | 03, 14 |
| **CQRS** | Command Query Responsibility Segregation; read models for dashboards | Architecture | 03 |
| **Domain Event** | Immutable fact that occurred (`LoanApproved`) | Event bus | 03, 14 |
| **Domain Event Bus** | In-process pub/sub per WorldInstance | FSF kernel | 14 |
| **Engine** | Loosely coupled domain simulation system (Banking, Company, etc.) | FSF | 14 §4 |
| **Engine Scheduler** | Orders engine execution P0–P3 per tick | FSF | 14 |
| **Event Sourcing** | Persist events as source of truth for audit/history | Data | 04 |
| **FSF** | Fenix Simulation Framework | Simulation core | 14 |
| **Offline Catch-Up** | Simulation advances elapsed time when player returns | Living World | 14 §5 |
| **Projection** | Read-optimized view derived from events for UI | Architecture | 03, 04 |
| **Rule Registry** | Versioned catalog of formulas, tables, policies | Data-driven design | 14 §3.3 |
| **Tick** | Single simulation time step; default daily | Time Engine | 14 §4.1 |
| **Tick Orchestrator** | Coordinates engine runs each tick | FSF kernel | 14 |
| **Time Engine** | Advances simulation calendar and phases | FSF | 14 §4.1 |
| **T0 Tier** | Full fidelity: player and inner circle | Performance | 14, 16 |
| **T1 Tier** | Full fidelity: direct interactors | Performance | 14, 16 |
| **T2 Tier** | Compressed behaviour: regional citizens | Performance | 14, 16 |
| **T3 Tier** | Statistical aggregate: background population | Performance | 14, 16 |
| **WGS** | World Generation System | Procedural world birth | 15 |
| **WorldInstance** | One runnable sovereign simulation world | Core entity | 14, 15 |
| **WorldSeed** | Deterministic seed input to WGS pipeline | Procedural gen | 15 |

---

# 5. FSF Engines

All engines defined in FSF §4. Grouped by domain.

## 5.1 Temporal & Kernel

| Term | Definition | Doc |
|---|---|---|
| **Time Engine** | Calendar, tick phases, pause/fast-forward policy | 14 §4.1 |
| **Tick Orchestrator** | Schedules engine execution per tick | 14 §3.3 |

## 5.2 Citizen & Social

| Term | Definition | Doc |
|---|---|---|
| **Citizen Engine** | Owns vitals, aging, energy, happiness, player/AI parity | 14 §4.2 |
| **Family Engine** | Marriage, children, divorce, inheritance events | 14 §4.3 |
| **Legacy Engine** | Legacy Score, Hall of Legends, dynasty reputation | 14 §4.19 |

## 5.3 Education & Career

| Term | Definition | Doc |
|---|---|---|
| **Career Engine** | Employment, promotions, job search, unemployment | 14 §4.5 |
| **Education Engine** | Enrollment, grades, graduation, skills output | 14 §4.4 |

## 5.4 Business & Economy

| Term | Definition | Doc |
|---|---|---|
| **Analytics Engine** | Aggregates anonymized sim stats for balance | 14 §4.18 |
| **Banking Engine** | Accounts, transfers, credit, loans, foreclosure | 14 §4.7 |
| **Company Engine** | Business P&L, products, hiring, valuation | 14 §4.6 |
| **Economy Engine** | Macro: GDP, inflation, unemployment, cycles | 14 §4.9 |
| **Event Engine** | Causes systemic micro/macro events (not Media) | 14 §4.16 |
| **Government Engine** | Legislation, regulation, elections | 14 §4.10 |
| **Healthcare Engine** | Illness, treatment, insurance | 14 §4.12 |
| **History Engine** | Archival rollups, long-term compression | 14 §4.20 |
| **Housing Engine** | Property values, rent, vacancy, foreclosure link | 14 §4.13 |
| **Investment Engine** | Stocks, bonds, portfolios, margin | 14 §4.8 |
| **Tax Engine** | Income/corporate tax, filing, audits | 14 §4.11 |
| **Transportation Engine** | Vehicle ownership, commute, depreciation | 14 §4.14 |

## 5.5 World & Media

| Term | Definition | Doc |
|---|---|---|
| **Media Engine** | News generation, reputation reporting; reports, does not cause | 14 §4.15 |
| **Weather Engine** | Seasons, storms, climate effects | 14 §4.17 |

## 5.6 Platform

| Term | Definition | Doc |
|---|---|---|
| **Multiplayer Engine** | Fenix Network contracts across WorldInstances | 14 §4.21 |

---

# 6. Citizen & Personality (CDPS)

| Term | Definition | Doc |
|---|---|---|
| **Baseline Temperament** | Stable tendencies at birth | 16 |
| **Bounded Utility Model** | Decision-making: evaluate options + stochastic noise | 16 §10 |
| **CDPS** | Citizen DNA & Personality System | 16 |
| **Expressed Personality** | Current trait profile; evolves over life | 16 |
| **Genotype** | Inherited biological seed; stable | 16 |
| **Goals** | Active aspirations across Five Capitals | 16 |
| **Habits** | Reinforced behaviours from repeated choices | 16 |
| **Memories** | Significant experiences biasing future decisions | 16 §9 |
| **Personality Traits** | 18 evolving traits (Ambition, Conscientiousness, etc.) | 16 §4 |
| **Values** | Slow-changing moral and life priorities | 16 §6 |

---

# 7. World Generation (WGS)

| Term | Definition | Doc |
|---|---|---|
| **Macro Envelope** | High-level economic and cultural parameters for a world | 15 |
| **Player Entry** | Final WGS phase placing player citizen in generated world | 15 §5 |
| **Region** | Geographic/economic subdivision of a world | 15 |
| **Society Fabrication** | Creating citizens, families, companies with backstory | 15 |
| **Synthetic History** | 20–50 years compressed pre-player past | 15 §8 |
| **WorldSeed** | Single deterministic input to full generation pipeline | 15 §3 |
| **WGS** | World Generation System | 15 |
| **WGS Pipeline** | Seven phases: Seed → Macro → Geography → Infrastructure → History → Society → Entry | 15 §4 |

---

# 8. Economy & Finance

| Term | Definition | Doc |
|---|---|---|
| **Amortization** | Loan payment schedule over time | 11 (planned) |
| **APR** | Annual Percentage Rate on loans | 11 (planned) |
| **Bankruptcy** | Legal financial reset with lasting consequences | 00, 38 |
| **Cap Rate** | Capitalization rate; rental income / property value | 10 (planned) |
| **Cash Flow** | Income minus expenses over a period | UI Banking |
| **Credit Score** | Trust metric affecting loan eligibility | 01, 11 |
| **Debt-to-Income (DTI)** | Debt service ratio | 11 (planned) |
| **Dividend** | Company payout to shareholders | 12 (planned) |
| **Foreclosure** | Lender seizes property after default | 14 Banking/Housing |
| **Inflation** | Currency purchasing power erosion over time | 00 §11 |
| **IPO** | Initial Public Offering; company goes public | 38 |
| **LTV** | Loan-to-Value ratio on mortgages | 10 (planned) |
| **Margin Call** | Broker demand for collateral when investments fall | 12 (planned) |
| **Net Worth** | Assets minus liabilities | 01, UI |
| **Recession** | Macro economic contraction period | 14 Economy |
| **Ticker** | Stock symbol on exchange | UI Stock Market |

---

# 9. Business & Career

| Term | Definition | Doc |
|---|---|---|
| **Business Archetype** | Hand-authored company template | 35 |
| **Business Capital** | See Five Capitals | 01 |
| **Cap Table** | Ownership breakdown of company equity | 06 (planned) |
| **Company Valuation** | Estimated enterprise value | 06 (planned) |
| **Department** | Organizational unit (Engineering, Sales, etc.) | UI Company |
| **Industry Template** | Data definition for an industry type | 35 |
| **M&A** | Mergers and acquisitions | 38 |
| **Occupation Template** | Career role definition | 35 |
| **Org Chart** | Visual reporting hierarchy | UI Employees |
| **Patent** | Protected IP generating licensing revenue | 38 |
| **Product Launch** | Company releasing new product to market | 06 (planned) |
| **Series A** | Early funding round label (example stage) | UI Company |
| **Startup** | Newly founded company | 06 (planned) |

---

# 10. UI, Screens & Navigation

| Term | Definition | Route | Doc |
|---|---|---|---|---|
| **Banking Dashboard** | Personal finance portal | `/banking` | 34 §5.4 |
| **CEO Test** | UX bar: layout recognizable from professional tools | — | 34 §2.1 |
| **Character Creation** | New citizen setup flow | `/character-creation` | 34 §5.2 |
| **City Map** | 2D Phaser world navigation | `/city` | 34 §5.14 |
| **Company Dashboard** | Business operations portal | `/company` | 34 §5.5 |
| **Education Screen** | School/university management | `/education` | 34 §5.10 |
| **Employee Management** | HR hiring and roster | `/employees` | 34 §5.6 |
| **Family Screen** | Relationships and lineage | `/family` | 34 §5.11 |
| **Hero Header** | 48px photography band on dashboards | — | 32 §6.5 |
| **Home Screen** | Life hub / command center | `/home` | 34 §5.3 |
| **Main Menu** | Game entry screen | `/` | 34 §5.1 |
| **News Feed** | World and personal headlines | `/news` | 34 §5.13 |
| **Quick Actions** | Home Screen 8-tile navigation grid | — | 34 §3.3 |
| **Real Estate Screen** | Property browse and manage | `/real-estate` | 34 §5.8 |
| **Settings** | Audio, graphics, gameplay config | `/settings` | 34 §5.16 |
| **Smartphone** | Diegetic app shell | `/phone` | 34 §5.15 |
| **Stock Market** | Investment trading screen | `/stocks` | 34 §5.7 |
| **Timeline** | Life event history (World Memory UI) | `/timeline` | 34 §5.12 |
| **Vehicle Dealership** | Vehicle browse and purchase | `/vehicles` | 34 §5.9 |

## 10.1 Design Tokens

| Token | Hex | Doc |
|---|---|---|
| **Fenix Navy** | `#0B132B` | 32 |
| **Fenix Blue** | `#1C2541` | 32 |
| **Fenix Emerald** | `#2EC4B6` | 32 |
| **Fenix Gold** | `#F4B400` | 32 |
| **Fenix Light** | `#F5F7FA` | 32 |

---

# 11. Content & Data Pipeline

| Term | Definition | Doc |
|---|---|---|
| **Content Pack** | Versioned bundle of templates and assets | 35 |
| **Industry Template** | YAML definition of industry economics and ops | 35 §5.2 |
| **Institution Template** | University/school definition | 35 §9.1 |
| **Manifest** | `manifest.json` declaring pack version and checksums | 35 §10.2 |
| **Program Template** | Degree/certification definition | 35 §9.2 |
| **Property Archetype** | Housing template with economics | 35 §8.1 |
| **Rule Registry** | See Simulation | 14 |
| **Vehicle Template** | Vehicle specs and economics | 35 §7.1 |

---

# 12. Multiplayer & Platform

| Term | Definition | Doc |
|---|---|---|
| **Cloud Save** | Server-side save sync across devices | 03, 37 |
| **Contract Command** | Multiplayer proposal requiring sovereign world acceptance | 14 §4.21 |
| **Fenix Network** | Opt-in social/economic layer connecting WorldInstances | 00 §9, 18 (planned) |
| **Hall of Legends** | Cross-save recognition of legacy achievements | 37, 38 |
| **Leaderboard** | Ranked legacy/wealth/diversity standings | 38 |
| **Mod SDK** | Tools for community content packs | 20 (planned), 35 §14 |
| **Sovereign World** | See Core Product Terms | 03 |
| **UGC** | User-Generated Content marketplace (future) | 37 |

---

# 13. Live Operations & Analytics

| Term | Definition | Doc |
|---|---|---|
| **A/B Test** | Controlled feature variant experiment | 36 §9 |
| **Economy Hotfix** | Emergency Rule Registry numeric patch | 36 §7.3 |
| **Feature Flag** | Runtime toggle for features | 36 §9 |
| **Live Event** | Time-bounded systemic world modifier | 36 §5 |
| **Patch Notes** | Player-facing change log | 36 §4 |
| **Phased Rollout** | 5% → 25% → 100% deploy | 36 §4.3 |
| **Seasonal Content** | Optional themed flavour packs | 36 §6 |
| **SEV1** | Critical incident (save loss, security) | 36 §10.1 |
| **Telemetry** | Gameplay analytics events | 23 (planned), 36 §8 |

---

# 14. Art, Audio & UX

| Term | Definition | Doc |
|---|---|---|
| **Adaptive Music** | Layered stems responding to sim state | 33 §4.3 |
| **Ambient Bed** | Looped environmental audio | 33 §5 |
| **Diegetic Audio** | Sound originating in game world | 33 §3.2 |
| **F-Pattern Layout** | Information hierarchy pattern | 34 §2.2 |
| **Leitmotif** | Recurring phoenix musical phrase | 33 §2.2 |
| **Lucide Icons** | Standard icon library | 32 §5.1 |
| **Notification Tier P0–P3** | Alert priority levels | 33 §9.1 |
| **Phoenix Motif** | Visual rebirth symbol usage rules | 32 §2.2 |
| **Recharts** | Chart library for dashboards | 32 §9 |
| **shadcn/ui** | Component library base | 34 §4.1 |

---

# 15. Technical & Engineering

| Term | Definition | Doc |
|---|---|---|
| **Azure Blob** | Cloud asset storage (planned) | 03 |
| **BullMQ** | Job queue for workers (planned) | 03 |
| **Clean Architecture** | Concentric dependency layers | 03 §1.1 |
| **Client SDK** | API between UI and simulation | 03 |
| **DDD (Database Design Document)** | Data architecture doc 04—not Domain-Driven Design alone | 04 |
| **GDD** | Game Design Document doc 02 (planned) | 02 |
| **NestJS** | Backend application framework | 03 |
| **Phaser 3** | 2D game engine for city map | 03 |
| **PostgreSQL** | Primary database | 04 |
| **Prisma** | ORM for PostgreSQL | 04 |
| **React** | UI framework | 03 |
| **Redis** | Cache, pub/sub, rate limits | 03 |
| **Socket.IO** | Realtime gateway (planned) | 03 |
| **Tailwind CSS** | Utility-first styling | 03 |
| **TDD (Technical Design Document)** | Engineering architecture doc 03 | 03 |
| **Vite** | Frontend build tool | package.json |
| **WASM Worker** | WebAssembly simulation runtime (planned) | 03 |
| **Web Worker** | Background sim thread | 03 |

---

# 16. Abbreviations & Acronyms

| Abbr | Expansion | Notes |
|---|---|---|
| **AI** | Artificial Intelligence | AI citizens use CDPS |
| **APR** | Annual Percentage Rate | Finance |
| **CDPS** | Citizen DNA & Personality System | Doc 16 |
| **CQRS** | Command Query Responsibility Segregation | Architecture |
| **CTA** | Call to Action | UI button |
| **DLC** | Downloadable Content | Expansions |
| **DTI** | Debt-to-Income | Finance |
| **EA** | Early Access | Release phase |
| **FSF** | Fenix Simulation Framework | Doc 14 |
| **GDD** | Game Design Document | Doc 02 |
| **GDP** | Gross Domestic Product | Economy sim |
| **GPA** | Grade Point Average | Education |
| **HR** | Human Resources | Employee Management |
| **IPO** | Initial Public Offering | Business |
| **KPI** | Key Performance Indicator | Dashboards |
| **LTV** | Loan-to-Value | Housing |
| **M&A** | Mergers and Acquisitions | Business |
| **MRR** | Monthly Recurring Revenue | SaaS industry |
| **MVP** | Minimum Viable Product | Planning |
| **P&L** | Profit and Loss | Company |
| **PRD** | Product Requirements Document | Product Bible |
| **QA** | Quality Assurance | Testing |
| **RACI** | Responsible, Accountable, Consulted, Informed | Live Ops |
| **RFC** | Request for Comments | Proposals |
| **RICE** | Reach, Impact, Confidence, Effort | Prioritization |
| **RT60** | Reverb time | Audio |
| **SEV** | Severity (incident) | Live Ops |
| **T0–T3** | Agent fidelity tiers | FSF |
| **TDD** | Technical Design Document | Doc 03 |
| **TTS** | Text-to-Speech | Accessibility |
| **UGC** | User-Generated Content | Mods |
| **UI** | User Interface | — |
| **UX** | User Experience | — |
| **WCAG** | Web Content Accessibility Guidelines | A11y |
| **WGS** | World Generation System | Doc 15 |
| **WASM** | WebAssembly | Performance |

---

# 17. Deprecated & Aliases

| ~~Deprecated~~ | Canonical | Notes |
|---|---|---|
| ~~Game Menu~~ | Diegetic navigation (Phone, Home) | Constitution diegetic rule |
| ~~NPC~~ | AI Citizen | Symmetry language |
| ~~Player Character~~ | Player Citizen | Symmetry language |
| ~~Stats~~ | Vitals / Capitals | Prefer capital framework |
| ~~Win state~~ | Legacy outcome | No single win |
| ~~FENIX LIFE~~ (all caps body) | Fenix Life | Title case in prose |
| ~~Database Design Document (confusion with DDD pattern)~~ | DDD doc 04 or "Database Design Document" | Disambiguate from Domain-Driven Design in conversation |

### Code Aliases (package.json)

| Alias | Note |
|---|---|
| `@figma/my-make-file` | Legacy package name from Figma export; rename to `fenix-life` planned |

---

## Appendix A — Document ID Quick Reference

| ID | Short Name |
|---|---|
| 00 | Product Bible |
| 01 | Design Constitution |
| 02 | GDD |
| 03 | TDD |
| 04 | DDD (Database) |
| 14 | FSF |
| 15 | WGS |
| 16 | CDPS |
| 32 | Art Direction |
| 33 | Audio Direction |
| 34 | UI/UX Guidelines |
| 35 | Content Pipeline |
| 36 | Live Operations |
| 37 | Roadmap |
| 38 | Backlog |
| 39 | Master Index |
| 40 | Developer Onboarding |
| 41 | Glossary |

---

## Appendix B — Glossary Maintenance

| Action | Process |
|---|---|
| New term | Add to section + Appendix if doc ID; update 39 changelog |
| Rename | Update 17 Deprecated; grep docs |
| Quarterly review | Product Operations + Technical Writing |

---

*End of Fenix Life Glossary*
