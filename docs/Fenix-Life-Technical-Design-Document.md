# Fenix Life — Official Technical Design Document (TDD)

**Document Version:** 1.0  
**Status:** Canonical — Engineering Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal Software Architecture & Platform Engineering  
**Audience:** Engineering, DevOps, QA, Live Ops, Security, Data, AI Systems  

---

## Document Authority

This Technical Design Document defines **how Fenix Life is built and maintained** for the next 10–15 years. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Product vision, pillars, loops, multiplayer philosophy |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Immutable design law: Citizen Equality, Living World, Five Capitals, World Memory |

When engineering trade-offs conflict with product philosophy, **align with philosophy first**, then document deliberate technical exceptions with rationale and migration path.

Every feature module, API, database table, and infrastructure decision must trace to:

1. A Product Bible pillar (§4)
2. A Design Constitution article
3. A section of this TDD

---

## Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Feature Module Architecture](#2-feature-module-architecture)
3. [Event Driven Architecture](#3-event-driven-architecture)
4. [Simulation Engine](#4-simulation-engine)
5. [Multiplayer Architecture](#5-multiplayer-architecture)
6. [Scalability](#6-scalability)
7. [Save System](#7-save-system)
8. [Security](#8-security)
9. [Mod Support](#9-mod-support)
10. [Performance](#10-performance)
11. [Logging & Observability](#11-logging--observability)
12. [Development Standards](#12-development-standards)
13. [Future-Proofing](#13-future-proofing)

---

## Executive Summary

Fenix Life is a **persistent life, business, economy, and social simulation platform** delivered as a premium cross-platform client with optional cloud services. The architecture separates:

- **Sovereign Simulation** — each player owns an authoritative world instance that runs locally or on dedicated simulation workers
- **Living World Engine** — systemic simulation of millions of AI citizens, companies, institutions, and markets
- **Fenix Network** — opt-in social and economic touchpoints between sovereign instances
- **Platform Services** — authentication, saves, analytics, moderation, and live operations

The stack is intentionally boring at the infrastructure layer (PostgreSQL, Redis, NestJS, Azure) and sophisticated at the domain layer (DDD, event sourcing for audit trails, CQRS for read-heavy dashboards, data-driven mod hooks).

**North-star engineering constraints:**

| Constraint | Source |
|---|---|
| Symmetry Principle — AI and player share rules | Product Bible §10, Constitution Article I |
| World continues offline | Constitution Article II |
| No business logic in UI | Architecture philosophy |
| Saves survive 15+ years of patches | §7, §13 |
| Multiplayer never corrupts sovereign simulation | Product Bible §9 |

---

# 1. High-Level System Architecture

## 1.1 Architecture Overview

Fenix Life follows **Clean Architecture** with **feature-first modules** inside concentric layers. Dependencies point inward: outer layers depend on inner abstractions, never the reverse.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ React + TS UI    │  │ Phaser 3 Canvas  │  │ Local Simulation Runtime │ │
│  │ (Vite, Tailwind) │  │ (2D gameplay)    │  │ (WASM worker / Web Worker)│ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────────┬─────────────┘ │
│           └──────────────────────┴──────────────────────────┘               │
│                              Client SDK / API Client                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / WSS
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         EDGE & GATEWAY TIER                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │ CDN / WAF   │  │ API Gateway  │  │ Rate Limit  │  │ TLS Termination    │ │
│  │ (Azure FD)  │  │ (NestJS)     │  │ (Redis)     │  │                    │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         APPLICATION TIER (NestJS)                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐ │
│  │ Auth       │ │ Account    │ │ Fenix      │ │ Save       │ │ Mod       │ │
│  │ Service    │ │ Service    │ │ Network    │ │ Service    │ │ Registry  │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └───────────┘ │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐ │
│  │ Leaderboard│ │ Messaging  │ │ Moderation │ │ Analytics  │ │ Admin     │ │
│  │ Service    │ │ Service    │ │ Service    │ │ Ingest     │ │ Portal    │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └───────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         SIMULATION TIER                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Simulation Orchestrator — schedules ticks, offline catch-up, autosave   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ Living World │ │ Time Engine  │ │ Economy      │ │ AI Citizen       │ │
│  │ Engine       │ │              │ │ Engine       │ │ Agent Pool       │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         WORKER TIER (BullMQ)                                 │
│  Offline Simulation │ Save Compression │ Migration │ Anti-Abuse │ Reports  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         DATA TIER                                            │
│  PostgreSQL (Prisma) │ Redis (cache, pub/sub, queues) │ Azure Blob Storage  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         REALTIME TIER                                        │
│  Socket.IO Gateway — presence, messaging, async deal notifications           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1.2 Layer Definitions

### 1.2.1 Client Layer

**Responsibilities:**

- Render diegetic UI (banking dashboards, company portals, smartphone apps)
- Host Phaser 3 scenes for city map, property visits, and interactive 2D moments
- Run **Local Simulation Runtime** for authoritative single-player ticks when offline
- Manage local encrypted save cache
- Apply mod packs from validated manifests
- Stream assets lazily from CDN or local cache

**Components:**

| Component | Technology | Notes |
|---|---|---|
| Presentation UI | React 18+, TypeScript, TailwindCSS | No domain logic; consumes view models |
| Game Canvas | Phaser 3 | Visual/interaction only; state from simulation bridge |
| State Bridge | Zustand or Redux Toolkit (TBD per feature) | UI state vs. simulation state strictly separated |
| API Client | Typed OpenAPI client | Generated from NestJS Swagger |
| Simulation Worker | Web Worker / WASM (future) | Heavy tick batches off main thread |
| Asset Pipeline | Vite + dynamic imports | Chunked by region/industry |

**Deployment targets:** Windows, macOS, Linux (Electron or Tauri wrapper), Web (limited), future tablet.

### 1.2.2 API Gateway

**Responsibilities:**

- Single public entry point for REST and WebSocket upgrade
- JWT validation, request routing, correlation IDs
- Rate limiting per account, IP, and endpoint class
- Request/response schema validation (class-validator / Zod shared schemas)
- API versioning (`/v1/`, `/v2/`) with deprecation headers

**Implementation:** NestJS global prefix with modular controllers; Azure Application Gateway or Front Door in production.

### 1.2.3 Authentication Service

**Responsibilities:**

- Account registration, login, refresh token rotation
- OAuth providers (Steam, Epic, platform stores — roadmap)
- Device binding for anti-abuse
- Session revocation, password reset, MFA (future)
- JWT issuance with scoped claims (`account:read`, `network:write`, `save:sync`)

**Token model:**

| Token | Lifetime | Storage |
|---|---|---|
| Access JWT | 15 minutes | Memory |
| Refresh token | 30 days rotating | HttpOnly secure cookie / OS keychain |
| Save sync token | Scoped to save ID | Short-lived, single-purpose |

### 1.2.4 Application Services

Domain-facing microservices **within the NestJS monorepo** (modular monolith first; extract services when scaling demands).

| Service | Purpose |
|---|---|
| **Account** | Profiles, preferences, privacy settings, DLC entitlements |
| **Save** | Cloud save metadata, upload/download orchestration, versioning |
| **Fenix Network** | Friends, visits, partnerships, investments, public profiles |
| **Messaging** | Async inbox, deal proposals, system notifications |
| **Leaderboard** | Rankings by capital type; seasonal partitions |
| **Moderation** | Reports, blocks, transfer flags, audit queue |
| **Mod Registry** | Manifest validation, signature verification, compatibility matrix |
| **Analytics Ingest** | Telemetry events (privacy-gated) |
| **Admin** | Feature flags, economy tuning, support tools |

### 1.2.5 Simulation Engine

**Responsibilities:**

- Authoritative world state mutation for a `WorldInstance`
- Tick scheduling (daily → yearly cascades)
- AI citizen and NPC company agent execution
- Event emission to domain event bus
- Deterministic replay support for debugging and anti-cheat

**Deployment modes:**

1. **Embedded (default):** Runs in client worker for offline-first play
2. **Cloud-assisted:** Server-side worker for heavy offline catch-up (>30 simulated days)
3. **Hybrid:** Client authoritative; server validates checksums on sync

### 1.2.6 Workers (BullMQ)

**Queue topology:**

| Queue | Priority | Purpose |
|---|---|---|
| `simulation:catchup` | High | Offline time advancement |
| `save:compress` | Medium | ZSTD compression, blob upload |
| `save:migrate` | Medium | Schema version upgrades |
| `network:audit` | High | Transfer anomaly scoring |
| `analytics:batch` | Low | Aggregate telemetry |
| `report:generate` | Low | Monthly statements, tax summaries |

Redis backs BullMQ with dead-letter queues and exponential backoff.

### 1.2.7 Database (PostgreSQL + Prisma)

**Partitioning strategy:**

| Data Class | Storage | Rationale |
|---|---|---|
| Account, auth, billing | Core PostgreSQL | Relational integrity |
| Fenix Network graph | Core PostgreSQL | ACID for transfers |
| World save blobs | Azure Blob | Large, immutable snapshots |
| World save metadata | PostgreSQL | Indexable, queryable |
| Historical archives | PostgreSQL + Blob | Encyclopedia, newspapers |
| Leaderboards | PostgreSQL + Redis cache | Fast reads |

Prisma serves as ORM with migration pipeline in CI. Raw SQL allowed for hot paths (leaderboards, aggregations).

### 1.2.8 Realtime Layer (Socket.IO)

**Responsibilities:**

- Presence (online, in-game, busy)
- Real-time messaging delivery
- Async deal/investment notification push
- **Not** used for simulation tick sync (sovereign instances)

**Namespaces:**

- `/presence` — friend online status
- `/messaging` — DMs and system threads
- `/deals` — investment/partnership state changes
- `/admin` — internal ops (authenticated staff only)

### 1.2.9 Storage (Azure Blob)

| Container | Content |
|---|---|
| `saves` | Compressed world snapshots |
| `assets` | CDN-origin game assets |
| `mods` | Signed mod packages |
| `exports` | Player export bundles (family tree PDF, portfolio) |
| `backups` | Geo-redundant save backups |

Lifecycle policies: move cold saves to cool/archive tier after 90 days inactive.

### 1.2.10 Caching (Redis)

| Cache | TTL | Invalidation |
|---|---|---|
| Session claims | 15 min | Logout |
| Public profiles | 5 min | Profile update event |
| Leaderboard slices | 1 min | Rank mutation |
| Economy config | 1 hour | Admin publish |
| Friend graph | 10 min | Social event |

Redis Pub/Sub bridges API instances for Socket.IO horizontal scaling.

### 1.2.11 Analytics

**Pipeline:** Client → Analytics Ingest API → Event bus → Azure Data Explorer or PostgreSQL warehouse (phase 2) → BI dashboards.

**Event categories:** funnel, retention, simulation performance, economy health, multiplayer abuse signals.

Privacy: no PII in raw events; hashed account IDs; opt-out respected.

### 1.2.12 Logging, Monitoring, Alerting

| Tool | Use |
|---|---|
| Structured JSON logs | Winston/Pino → Azure Monitor |
| APM | Application Insights |
| Metrics | Prometheus-compatible exporters |
| Tracing | OpenTelemetry, W3C trace context |
| Crash reporting | Sentry (client + server) |
| Uptime | Azure Health probes |

**SLA targets (production):** 99.9% API availability; save sync p99 < 5s for 10MB compressed payload.

---

# 2. Feature Module Architecture

## 2.1 Module Design Pattern

Every feature module follows the same internal structure:

```
feature/
├── domain/           # Entities, value objects, domain services, events
├── application/      # Use cases, commands, queries, handlers
├── infrastructure/   # Prisma repositories, external adapters
├── presentation/     # DTOs, controllers (server) or hooks/view-models (client)
├── contracts/        # Public interfaces exported to other modules
└── index.ts          # Module boundary exports only
```

**Cross-module rule:** Modules communicate via **domain events** and **published interfaces** in `contracts/`. Direct imports of another module's `infrastructure/` are forbidden.

## 2.2 Module Catalog

### 2.2.1 Citizen

| Aspect | Definition |
|---|---|
| **Responsibilities** | Identity, demographics, personality, stats (health, happiness, energy, stress), aging, death, playable heir handoff |
| **Dependencies** | Time Simulation, Family, Relationships, Education, Career, Healthcare |
| **Public interfaces** | `ICitizenRepository`, `ICitizenQueryService`, `CitizenId` value object |
| **Events published** | `CitizenBorn`, `CitizenAged`, `CitizenDied`, `CitizenStatChanged` |
| **Events consumed** | `EducationCompleted`, `CareerStarted`, `RelationshipChanged`, `HealthcareEvent` |
| **Boundaries** | Does not own financial accounts (Banking) or job contracts (Employee/Career) |

### 2.2.2 Company

| Aspect | Definition |
|---|---|
| **Responsibilities** | Incorporation, cap table, departments, products, valuation, lifecycle (growth, IPO, bankruptcy) |
| **Dependencies** | Employee, Economy, Banking, Investments, Government, Tax, Media |
| **Public interfaces** | `ICompanyRepository`, `ICompanyCommandService`, `CompanyFinancialsQuery` |
| **Events published** | `CompanyFounded`, `CompanyIPO`, `CompanyBankrupt`, `ProductLaunched`, `FundingRoundClosed` |
| **Events consumed** | `EmployeeHired`, `EmployeeFired`, `MarketCrash`, `TaxPolicyChanged` |
| **Boundaries** | NPC and player companies share `CompanyAggregate` — Symmetry Principle |

### 2.2.3 Employee

| Aspect | Definition |
|---|---|
| **Responsibilities** | Employment contracts, compensation, performance, morale, promotions, poaching |
| **Dependencies** | Citizen, Company, Career, Education |
| **Public interfaces** | `IEmploymentRepository`, `IOrgChartQuery` |
| **Events published** | `EmployeeHired`, `EmployeePromoted`, `EmployeeResigned`, `EmployeeFired` |
| **Events consumed** | `CompanyFounded`, `CitizenSkillChanged`, `MarketWageIndexUpdated` |
| **Boundaries** | HR policies live in Company; Employee tracks individual employment history |

### 2.2.4 Education

| Aspect | Definition |
|---|---|
| **Responsibilities** | Schools, universities, courses, exams, GPA, credentials, student loans linkage |
| **Dependencies** | Citizen, Time Simulation, Banking, Career |
| **Public interfaces** | `IEducationRepository`, `ICredentialQuery`, `IGraduatePipeline` |
| **Events published** | `CitizenEnrolled`, `CitizenGraduated`, `CredentialEarned`, `ExamCompleted` |
| **Events consumed** | `CitizenBorn`, `TimeAdvanced` (semester ticks) |
| **Boundaries** | Universities as institutions belong to Living World Engine; this module handles citizen participation |

### 2.2.5 Career

| Aspect | Definition |
|---|---|
| **Responsibilities** | Job search, applications, interviews, titles, career capital, unemployment |
| **Dependencies** | Citizen, Education, Employee, Company, Economy |
| **Public interfaces** | `ICareerRepository`, `IJobMarketQuery` |
| **Events published** | `CareerStarted`, `CareerEnded`, `PromotionOffered`, `JobApplicationSubmitted` |
| **Events consumed** | `CitizenGraduated`, `CompanyBankrupt`, `EconomyRecessionStarted` |
| **Boundaries** | Does not process payroll — delegates to Employee + Banking |

### 2.2.6 Banking

| Aspect | Definition |
|---|---|
| **Responsibilities** | Accounts, transactions, loans, credit score, mortgages, interest accrual |
| **Dependencies** | Citizen, Company, Economy, Tax, Time Simulation |
| **Public interfaces** | `IBankingRepository`, `ILedgerService`, `ICreditQuery` |
| **Events published** | `LoanApproved`, `LoanDefaulted`, `AccountOpened`, `TransactionPosted` |
| **Events consumed** | `PayrollProcessed`, `TaxAssessed`, `PropertyPurchased`, `InvestmentExecuted` |
| **Boundaries** | Double-entry ledger internally; no direct UI formatting |

### 2.2.7 Investments

| Aspect | Definition |
|---|---|
| **Responsibilities** | Stocks, bonds, funds, private equity stakes, portfolio, dividends, margin |
| **Dependencies** | Banking, Economy, Stock Market, Citizen, Company |
| **Public interfaces** | `IPortfolioRepository`, `IOrderExecutionService` |
| **Events published** | `OrderExecuted`, `DividendReceived`, `MarginCallTriggered` |
| **Events consumed** | `MarketCrash`, `CompanyIPO`, `CompanyBankrupt` |
| **Boundaries** | Order matching for player trades uses Stock Market module pricing |

### 2.2.8 Vehicles

| Aspect | Definition |
|---|---|
| **Responsibilities** | Ownership, financing, depreciation, maintenance, insurance linkage |
| **Dependencies** | Banking, Citizen, Economy |
| **Public interfaces** | `IVehicleRepository`, `IVehicleValuationService` |
| **Events published** | `VehiclePurchased`, `VehicleSold`, `VehicleFinancingStarted` |
| **Events consumed** | `TimeAdvanced` (depreciation), `EconomyInflationUpdated` |
| **Boundaries** | Dealership NPCs live in Living World; this module owns player/NPC vehicle records |

### 2.2.9 Properties

| Aspect | Definition |
|---|---|
| **Responsibilities** | Residential/commercial real estate, mortgages, rent, appreciation, zoning effects |
| **Dependencies** | Banking, Government, Economy, Tax, Citizen |
| **Public interfaces** | `IPropertyRepository`, `IRealEstateMarketQuery` |
| **Events published** | `PropertyPurchased`, `PropertySold`, `RentCollected`, `ForeclosureStarted` |
| **Events consumed** | `ZoningChanged`, `MarketCrash`, `LoanDefaulted` |
| **Boundaries** | City spatial layout in Living World; Properties owns titles and economics |

### 2.2.10 Government

| Aspect | Definition |
|---|---|
| **Responsibilities** | Policy, regulation, zoning, elections, grants, enforcement |
| **Dependencies** | Economy, Tax, Living World Engine, Media |
| **Public interfaces** | `IPolicyRepository`, `IRegulationQuery`, `IElectionService` |
| **Events published** | `ElectionCompleted`, `PolicyEnacted`, `ZoningChanged`, `GrantAwarded` |
| **Events consumed** | `EconomyRecessionStarted`, `CompanyScandalExposed` |
| **Boundaries** | Player political career (future) extends Career module via events |

### 2.2.11 Tax

| Aspect | Definition |
|---|---|
| **Responsibilities** | Personal and corporate tax assessment, brackets, deductions, filing, gift tax |
| **Dependencies** | Banking, Government, Citizen, Company, Family |
| **Public interfaces** | `ITaxRepository`, `ITaxAssessmentService` |
| **Events published** | `TaxAssessed`, `TaxPaid`, `GiftTaxApplied` |
| **Events consumed** | `TransactionPosted`, `InheritanceProcessed`, `GiftTransferred` |
| **Boundaries** | Policy rates from Government; Tax computes obligations |

### 2.2.12 Healthcare

| Aspect | Definition |
|---|---|
| **Responsibilities** | Medical events, insurance, treatment costs, health stat effects, mortality risk |
| **Dependencies** | Citizen, Banking, Economy |
| **Public interfaces** | `IHealthcareRepository`, `IInsurancePolicyQuery` |
| **Events published** | `HealthcareEvent`, `InsuranceClaimFiled`, `CitizenHealthChanged` |
| **Events consumed** | `CitizenAged`, `CitizenStressChanged` |
| **Boundaries** | Hospital companies use Company module; Healthcare handles citizen medical state |

### 2.2.13 Family

| Aspect | Definition |
|---|---|
| **Responsibilities** | Marriage, children, divorce, inheritance structures, family tree, dynasty reputation |
| **Dependencies** | Citizen, Relationships, Banking, Tax, Legal (future) |
| **Public interfaces** | `IFamilyRepository`, `IInheritanceService`, `IFamilyTreeQuery` |
| **Events published** | `MarriageFormed`, `DivorceFinalized`, `ChildBorn`, `InheritanceProcessed` |
| **Events consumed** | `CitizenDied`, `RelationshipChanged` |
| **Boundaries** | Relationship meters in Relationships; Family owns legal structures |

### 2.2.14 Relationships

| Aspect | Definition |
|---|---|
| **Responsibilities** | Bidirectional relationship meters, history, romance, rivalry, trust |
| **Dependencies** | Citizen, World Memory |
| **Public interfaces** | `IRelationshipRepository`, `ISocialGraphQuery` |
| **Events published** | `RelationshipChanged`, `CitizenMarried`, `BetrayalRecorded` |
| **Events consumed** | `CitizenBorn`, social interaction commands |
| **Boundaries** | Multiplayer friend graph is separate (Fenix Network); this is in-world social |

### 2.2.15 Economy

| Aspect | Definition |
|---|---|
| **Responsibilities** | Inflation, interest rates, unemployment, sector indices, credit cycles, sinks/sources |
| **Dependencies** | Government, Banking, Stock Market, Living World Engine |
| **Public interfaces** | `IEconomyStateQuery`, `IEconomyTickService` |
| **Events published** | `EconomyInflationUpdated`, `InterestRateChanged`, `EconomyRecessionStarted`, `MarketCrash` |
| **Events consumed** | `PolicyEnacted`, `CompanyEarningsReported` (aggregate) |
| **Boundaries** | Macro state only; micro transactions in Banking/Investments |

### 2.2.16 Stock Market

| Aspect | Definition |
|---|---|
| **Responsibilities** | Listings, price discovery, liquidity, earnings impact, insider rules |
| **Dependencies** | Economy, Company, Investments, Media |
| **Public interfaces** | `IMarketDataQuery`, `IListingService` |
| **Events published** | `PriceUpdated`, `CompanyDelisted`, `TradingHalt` |
| **Events consumed** | `CompanyIPO`, `CompanyBankrupt`, `CompanyEarningsReported`, `MarketCrash` |
| **Boundaries** | Pricing algorithms documented for mod API stability |

### 2.2.17 Media

| Aspect | Definition |
|---|---|
| **Responsibilities** | News generation from simulation events, newspapers, profiles, obituaries |
| **Dependencies** | World Memory, all major modules (subscriber) |
| **Public interfaces** | `INewsFeedQuery`, `INewsGeneratorService` |
| **Events published** | `NewsArticlePublished`, `ScandalExposed` |
| **Events consumed** | Nearly all public domain events (filtered) |
| **Boundaries** | Reports simulation; never mutates domain state except reputation side-effects |

### 2.2.18 Notifications

| Aspect | Definition |
|---|---|
| **Responsibilities** | In-game notification queue, prioritization, diegetic delivery (phone, email) |
| **Dependencies** | All modules (event subscriber) |
| **Public interfaces** | `INotificationRepository`, `INotificationDispatcher` |
| **Events published** | `NotificationDelivered`, `NotificationDismissed` |
| **Events consumed** | Domain events → notification rules engine |
| **Boundaries** | Presentation routing only; no business decisions |

### 2.2.19 Achievements

| Aspect | Definition |
|---|---|
| **Responsibilities** | Milestone tracking across Five Capitals, legacy score, platform sync |
| **Dependencies** | Citizen, Company, Family, Fenix Network |
| **Public interfaces** | `IAchievementRepository`, `ILegacyScoreCalculator` |
| **Events published** | `AchievementUnlocked`, `LegacyScoreUpdated` |
| **Events consumed** | Most lifecycle events |
| **Boundaries** | Read-only observer; never grants simulation advantages |

### 2.2.20 Friends (Fenix Network)

| Aspect | Definition |
|---|---|
| **Responsibilities** | Friend requests, blocks, relationship age, social graph for transfers |
| **Dependencies** | Account, Messaging, Multiplayer |
| **Public interfaces** | `IFriendRepository`, `ISocialGraphService` |
| **Events published** | `FriendRequestSent`, `FriendshipEstablished`, `UserBlocked` |
| **Events consumed** | Account events |
| **Boundaries** | Server-authoritative; separate from in-world Relationships |

### 2.2.21 Messaging

| Aspect | Definition |
|---|---|
| **Responsibilities** | DMs, deal threads, moderation flags, async delivery |
| **Dependencies** | Account, Friends, Multiplayer, Moderation |
| **Public interfaces** | `IMessageRepository`, `IThreadService` |
| **Events published** | `MessageSent`, `MessageReported` |
| **Events consumed** | Deal lifecycle events |
| **Boundaries** | Content moderation pipeline required before delivery |

### 2.2.22 Multiplayer (Fenix Network Core)

| Aspect | Definition |
|---|---|
| **Responsibilities** | Visits, gifts, transfers, partnerships, cross-player investments, profile sync |
| **Dependencies** | Save, Friends, Banking (contract layer), Moderation, Economy (abstracted) |
| **Public interfaces** | `INetworkTransferService`, `IPartnershipRepository`, `IVisitService` |
| **Events published** | `GiftTransferred`, `PartnershipFormed`, `InvestmentOfferAccepted` |
| **Events consumed** | Save sync events, company public metrics |
| **Boundaries** | Never directly mutates peer world state — contract-based |

### 2.2.23 Living World Engine

| Aspect | Definition |
|---|---|
| **Responsibilities** | NPC citizens, NPC companies, institutions, cities, labor pools, aggregation |
| **Dependencies** | All simulation modules (orchestrator) |
| **Public interfaces** | `IWorldStateRepository`, `IAgentScheduler`, `IInstitutionRegistry` |
| **Events published** | `WorldTickCompleted`, `NPCCompanyFounded`, `GraduateCohortReleased` |
| **Events consumed** | `TimeAdvanced`, policy and economy events |
| **Boundaries** | Performance-critical aggregation; detail on demand |

### 2.2.24 Time Simulation

| Aspect | Definition |
|---|---|
| **Responsibilities** | Calendar, tick orchestration, pause, speed, unresolved decision gates |
| **Dependencies** | None (kernel module) |
| **Public interfaces** | `ITimeEngine`, `ISimulationClock` |
| **Events published** | `TimeAdvanced`, `TickPhaseStarted`, `TickPhaseCompleted` |
| **Events consumed** | Player commands (pause, advance) |
| **Boundaries** | Schedules work; does not execute domain logic directly |

---

# 3. Event Driven Architecture

## 3.1 Global Event Bus

Fenix Life uses an **in-process domain event bus** per world instance (client or server) with optional **async outbox** for Fenix Network and analytics.

```
┌─────────────┐     publish      ┌──────────────────┐
│ Domain      │ ───────────────► │ Event Bus        │
│ Aggregates  │                  │ (sync dispatch)  │
└─────────────┘                  └────────┬─────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
            │ Handlers     │        │ Projections  │        │ Outbox       │
            │ (same proc)  │        │ (CQRS read)  │        │ (async)      │
            └──────────────┘        └──────────────┘        └──────┬───────┘
                                                                   ▼
                                                          Network / Analytics
```

## 3.2 Event Contract Standard

Every domain event includes:

| Field | Type | Purpose |
|---|---|---|
| `eventId` | UUID | Idempotency |
| `eventType` | string | Namespaced: `citizen.born` |
| `aggregateId` | string | Root entity ID |
| `aggregateType` | string | `Citizen`, `Company`, etc. |
| `worldInstanceId` | UUID | Sovereign instance |
| `simulationTime` | ISO date | In-game timestamp |
| `realTime` | ISO datetime | Wall clock |
| `schemaVersion` | int | Migration support |
| `payload` | object | Typed per event |
| `causationId` | UUID? | Parent event |
| `correlationId` | UUID | Request trace |

## 3.3 Canonical Event Catalog

### Citizen Lifecycle

| Event | Publishers | Key Subscribers |
|---|---|---|
| `CitizenBorn` | Citizen | Family, Education, Media, Achievements |
| `CitizenGraduated` | Education | Career, Media, Living World (labor pool) |
| `CitizenMarried` | Relationships/Family | Media, Tax, Achievements |
| `CitizenDied` | Citizen | Family, Banking, Media, Legacy, Achievements |
| `CitizenAged` | Citizen | Healthcare, Career |

### Company Lifecycle

| Event | Publishers | Key Subscribers |
|---|---|---|
| `CompanyFounded` | Company | Employee, Banking, Media, Stock Market |
| `CompanyIPO` | Company | Stock Market, Investments, Media |
| `CompanyBankrupt` | Company | Employee, Banking, Stock Market, Media |
| `ProductLaunched` | Company | Economy, Media, Competitors |

### Employment & Finance

| Event | Publishers | Key Subscribers |
|---|---|---|
| `EmployeePromoted` | Employee | Media, Citizen stats |
| `LoanApproved` | Banking | Notifications, World Memory |
| `MarketCrash` | Economy | Stock Market, Banking, Media, AI agents |
| `InheritanceProcessed` | Family | Banking, Tax, Citizen, Achievements |

### World & Governance

| Event | Publishers | Key Subscribers |
|---|---|---|
| `ElectionCompleted` | Government | Economy, Media, Policy |
| `PolicyEnacted` | Government | Tax, Economy, Company compliance |
| `NewsArticlePublished` | Media | Notifications, World Memory |

## 3.4 Decoupling Patterns

1. **Event notification, not delegation** — Publishers do not know subscriber list; bus routes by type
2. **Idempotent handlers** — Handlers store `processedEventIds` for retry safety
3. **No circular sync calls** — If A triggers B, B responds via separate event, not return call
4. **Sagas for cross-aggregate workflows** — Inheritance, IPO, partnership dissolution use orchestrated sagas with compensating actions
5. **CQRS projections** — Dashboards read from materialized views fed by events, not live aggregate walks

## 3.5 World Memory Integration

Significant events append to **immutable event log** (per world) powering:

- Credit history
- Relationship history
- Company partnership memory
- Media archives
- Encyclopedia entries

Retention: full log compressed yearly; hot index for last 50 in-game years.

---

# 4. Simulation Engine

## 4.1 Design Goals

- Support **decades** of in-game time per save
- Simulate **millions** of AI citizens via aggregation + detail tiers
- Run **offline** with catch-up on return
- Maintain **determinism** given same seed + inputs (anti-cheat, debugging)
- Honor **Symmetry Principle** — player and AI use same rule engine

## 4.2 Tick System Architecture

```
                    ┌─────────────────────────────────┐
                    │         TIME ENGINE              │
                    │  Current: 2042-03-15            │
                    │  Speed: 1x | 2x | max           │
                    │  Mode: PAUSED | RUNNING         │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────▼─────────────────┐
                    │      TICK ORCHESTRATOR           │
                    │  Resolves blocking decisions     │
                    │  before advance (constitution)   │
                    └───────────────┬─────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
   ┌───────────┐            ┌───────────┐            ┌───────────┐
   │ DAILY     │            │ WEEKLY    │            │ MONTHLY   │
   │ tick      │──cascade──►│ tick      │──cascade──►│ tick      │
   └───────────┘            └───────────┘            └─────┬─────┘
                                                           │
                              ┌────────────────────────────┼────────────┐
                              ▼                            ▼            ▼
                        ┌───────────┐              ┌───────────┐ ┌───────────┐
                        │ QUARTERLY │─────────────►│ YEARLY    │ │ ELECTION │
                        │ (finance) │              │ tick      │ │ cycles   │
                        └───────────┘              └───────────┘ └───────────┘
```

### 4.2.1 Daily Tick

- Citizen energy/stress recovery, short-term health
- Stock intraday abstraction (optional simplification)
- Active deal progress (interviews, construction)
- Notification generation
- **Budget:** < 5ms client-side for active detail tier

### 4.2.2 Weekly Tick

- Relationship drift, social maintenance
- Employee morale micro-updates
- Rental collection (if weekly lease terms)
- Media rumor pipeline

### 4.2.3 Monthly Tick (Default Operational Beat — Product Bible §7)

- Payroll, loan payments, tax withholdings
- Company P&L resolution
- Market index updates
- Education semester progress
- Property cash flows
- **Player expectation anchor** — primary planning rhythm

### 4.2.4 Quarterly Tick

- Earnings reports (public companies)
- Tax estimated payments (jurisdictions)
- Board reviews (NPC and player)

### 4.2.5 Yearly Tick

- Aging, credential decay, policy cycles
- University graduation cohorts → labor pool
- Inflation and wage index adjustment
- Achievement and legacy score annualization
- Historical archive snapshot

## 4.3 Agent Simulation Tiers

| Tier | Population | Simulation Depth |
|---|---|---|
| **T0 — Player** | 1+ (heirs) | Full aggregate, all systems |
| **T1 — Inner circle** | ~500 | Named NPCs with relationships |
| **T2 — Active market** | ~50,000 | Statistical agents, hireable, compete |
| **T3 — City aggregate** | Millions | Sector counts, flows, no individual |

Promotion/demotion between tiers based on player interaction (e.g., hiring promotes T2 → T1).

## 4.4 Background Workers

Heavy work offloaded to BullMQ when cloud-assisted:

| Job | Trigger |
|---|---|
| Offline catch-up | Player away > 24h real time |
| Yearly archive | Yearly tick completion |
| Labor market rebalancing | Monthly |
| News batch generation | Daily |
| AI company strategic decisions | Weekly |

## 4.5 Priority Queues

Within a tick phase:

1. **P0 — Blocking** — Player unresolved decisions, margin calls, death events
2. **P1 — Player-adjacent** — Player company, family, owned assets
3. **P2 — Active world** — T1/T2 agents in player's city
4. **P3 — Aggregate** — Regional/national macro

## 4.6 Performance Optimization

- **Spatial indexing** — City regions for agent queries
- **Dirty flags** — Only recompute changed aggregates
- **Memoized economy** — Macro state cached between substeps
- **Batch DB writes** — End-of-tick flush, not per-agent
- **SIMD-friendly numeric arrays** — Agent stats as typed arrays where hot

## 4.7 Time Acceleration

| Speed | Use case | Constraints |
|---|---|---|
| Pause | Planning | World frozen (player mode) |
| 1x | Default | Full tick |
| 2x–4x | Mid-game delegation | Skip non-critical micro animations |
| Fast-forward month | Experienced players | Requires no blocking decisions |
| Offline catch-up | Away from game | Server/worker batch; summary on return |

**Constitution compliance:** Pausing is a player mode; default offline progression continues world (Article II).

## 4.8 Offline Simulation

1. On exit: persist `lastSimulationTime`, `worldChecksum`, pending outbox
2. While away: optional cloud worker advances world per account settings
3. On return: compute `Δt`, enqueue catch-up job if `Δt > threshold`
4. Present **"While You Were Away"** digest (news, financial changes, relationship events)

## 4.9 Autosave

- Trigger: every monthly tick, major event, pre-time-advance, app background
- Local: encrypted SQLite or IndexedDB snapshot
- Cloud: debounced upload (30s after dirty state)
- Conflict: see §7

---

# 5. Multiplayer Architecture

## 5.1 Fenix Network Principles

Aligned with Product Bible §9 and Constitution Article VIII:

| Principle | Technical Expression |
|---|---|
| Sovereign Simulation | No shared world state; peer instances isolated |
| Opt-in visibility | Privacy flags on API; field-level redaction |
| Limited economic transfer | Server-enforced caps, taxes, cooling periods |
| Async by default | Deal state machines, not live sync |
| Anti-abuse first | All transfers logged, scored, auditable |

## 5.2 Architecture Diagram

```
 Player A World          Fenix Network Platform           Player B World
┌──────────────┐         ┌─────────────────────┐         ┌──────────────┐
│ Instance A   │         │  Contract Service   │         │ Instance B   │
│ (authoritative)        │  Transfer Service   │         │ (authoritative)
└──────┬───────┘         │  Profile Service    │         └──────┬───────┘
       │                 │  Moderation         │                │
       │  signed summary │  Leaderboards       │  signed summary│
       └────────────────►│                     │◄───────────────┘
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ PostgreSQL + Redis  │
                         └─────────────────────┘
```

## 5.3 Feature Technical Design

### Friends & Profiles

- Graph stored in PostgreSQL (`friendships`, `blocks`)
- Public profile: curated projection from save (company names, achievements, optional net worth band)
- Verified metrics badge when cloud-validated

### Presence

- Redis TTL keys per account
- Socket.IO broadcast to friend subset only

### Messaging

- Thread-based storage; E2E not required v1 but TLS in transit
- Rate limits: 30 msgs/min new threads

### Leaderboards

- Categories: Financial, Legacy, Business, Social (Constitution)
- Seasons: partitioned tables; anti-smurf via account age gates
- Mod profiles: separate leaderboard namespaces

### Visits

- Read-only **Presentation DTO** exported from save blob
- No live coupling; cached 5 min CDN

### Business Partnerships

- **Contract aggregate** on network server
- Terms: revenue share %, duration, exit clauses
- Each side applies effects locally when contract events arrive

### Investments

- Offer → accept → escrow (virtual) → cap table entry in investor save as abstract stake
- Returns via dividend events from investee's public filings
- Holding periods enforced server-side

## 5.4 Cloud Synchronization

1. Client uploads save metadata + checksum
2. Server stores immutable version history
3. Public projections rebuilt for Network features
4. Download on new device with encryption key from account

## 5.5 Conflict Resolution

| Scenario | Resolution |
|---|---|
| Two devices edit offline | Last-write-wins with loser backup branch |
| Simultaneous sync | Version vector; merge if non-overlapping domains (future) |
| Network contract vs local state | Network contract authoritative for cross-player |

## 5.6 Anti-Cheat & Anti-Abuse

| Layer | Mechanism |
|---|---|
| Client integrity | Checksum validation, anomalous stat detection |
| Transfer scoring | ML rules + heuristics (circular transfers, velocity) |
| Audit | Immutable transfer log |
| Enforcement | Flag, freeze transfers, shadow ban leaderboards |
| Report pipeline | Player reports → moderation queue |

---

# 6. Scalability

## 6.1 Scale Targets (5-Year Horizon)

| Dimension | Target |
|---|---|
| Registered accounts | 10M |
| Concurrent online | 500K |
| AI citizens per world | 5M (aggregated) |
| AI companies per world | 500K (aggregated) |
| Save size | Up to 50MB compressed |
| Simulation history | 100 in-game years |
| Network transfers/day | 1M (peak) |

## 6.2 Data Architecture for Scale

### Citizen & Company Storage

- **Hot data** — Player + T1 NPCs in normalized aggregates within save blob
- **Warm data** — T2 statistical pools in columnar substructures
- **Cold data** — Yearly archives, encyclopedia in append-only stores

### Large Save Files

- ZSTD compression (ratio ~4:1 typical)
- Chunked blob upload (4MB parts)
- Delta sync (future): binary diff between versions

### Long-Running Simulations

- Annual rollup jobs compress daily logs
- Configurable history depth in settings (performance trade-off)

## 6.3 Query Efficiency

| Query | Strategy |
|---|---|
| Leaderboard top 100 | Materialized view + Redis cache |
| Friend profile | Projection table denormalized |
| News by date | Partition by in-game year |
| Company search | PostgreSQL full-text + sector index |

## 6.4 Database Indexing (Representative)

```
accounts(email) UNIQUE
saves(account_id, updated_at DESC)
friendships(user_id, friend_id) UNIQUE
transfers(from_account, created_at)
leaderboard_entries(season, category, score DESC)
messages(thread_id, created_at)
```

## 6.5 Caching Strategy

See §1.2.10. Additional:

- **Simulation config** — CDN immutable cache
- **Mod manifests** — ETag validation
- **Public company pages** — Stale-while-revalidate

## 6.6 Horizontal Scaling

| Component | Scale approach |
|---|---|
| API | Kubernetes HPA on CPU/requests |
| Socket.IO | Redis adapter, sticky sessions optional |
| Workers | Queue consumer autoscale |
| Blob | Azure native scale |
| PostgreSQL | Read replicas; Citus/sharding if needed (phase 3) |

---

# 7. Save System

## 7.1 Save Types

| Type | Storage | Purpose |
|---|---|---|
| Autosave | Local + cloud async | Seamless continuity |
| Manual save | Local + cloud | Player checkpoints |
| Cloud save | Azure Blob authoritative | Cross-device |
| Local save | Encrypted disk | Offline-only mode |
| Quick resume | Local cache | Last session |

## 7.2 Save Blob Structure

```
SavePackage
├── header (version, checksum, worldId, schemaVersion)
├── metadata (playtime, heir generation, mod manifest hash)
├── simulationState (compressed aggregates)
├── eventLogTail (recent events for memory)
├── projections (optional denormalized dashboards)
└── signature (HMAC for integrity)
```

## 7.3 Version Migrations

- **Semantic schema version** independent of game version
- Migration pipeline: `vN → vN+1` incremental transformers
- BullMQ job for large migrations with progress UI
- Failed migration restores from pre-migration backup automatically

## 7.4 Compression & Encryption

- Compression: ZSTD level 3 (balance speed/ratio)
- Encryption at rest: AES-256 (client-side optional passphrase mode)
- Encryption in transit: TLS 1.3

## 7.5 Backups

- 5 rolling cloud versions per save slot
- Geo-redundant blob storage (GRS)
- Account deletion: 30-day soft delete window

## 7.6 Corruption Recovery

1. Checksum failure on load → attempt repair from event log replay
2. Repair fails → restore previous autosave
3. Cloud versions listed in recovery UI
4. Support tooling: manual blob inspection (admin)

---

# 8. Security

## 8.1 Authentication & Authorization

| Layer | Control |
|---|---|
| AuthN | JWT + refresh rotation; bcrypt/argon2 passwords |
| AuthZ | RBAC: `player`, `moderator`, `admin`, `service` |
| Save access | Save scoped tokens; owner only |
| Admin | MFA required, IP allowlist |

## 8.2 Data Protection

- PII encrypted at rest (PostgreSQL TDE + column-level for sensitive fields)
- GDPR/CCPA export and deletion endpoints
- Family data private by default (Product Bible §13)

## 8.3 Validation

- All API inputs validated at gateway
- Simulation commands validated against current state machine
- Mod manifests schema-validated; reject unsigned in ranked play

## 8.4 Fraud Prevention

- Transfer limits, relationship age, velocity caps (Product Bible §9)
- Device fingerprinting (privacy-compliant)
- Anomaly detection on economy transfers

## 8.5 Secure Multiplayer

- Contract signing with server witness
- No arbitrary remote code execution via visits
- Rate limiting on all Network endpoints

## 8.6 Audit Logging

Immutable audit log for:

- Admin actions
- Transfers > threshold
- Moderation decisions
- Save restores

Retention: 7 years.

---

# 9. Mod Support

## 9.1 Plugin Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FENIX LIFE CORE                       │
│  Simulation Engine │ Event Bus │ Rule Registry            │
└───────────────────────────┬─────────────────────────────┘
                            │ Mod API (versioned)
┌───────────────────────────▼─────────────────────────────┐
│  Mod Loader — manifest validation, dependency resolution │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Data Packs          Rule Packs          UI Themes
   (JSON/YAML)         (sandboxed)         (presentation)
```

## 9.2 Mod Layers (Product Bible §17)

| Layer | Format | Engine Changes Required |
|---|---|---|
| Data | JSON/YAML schemas | No |
| Rules | Lua/WASM sandbox (TBD) | No |
| Presentation | CSS/theme packs | No |
| Total conversion | Combined | No code fork |

## 9.3 Extension Points

| Hook | Allows |
|---|---|
| `industries/*` | New business types |
| `careers/*` | New career paths |
| `events/*` | Custom triggered events |
| `countries/*` | Regional flavor packs |
| `assets/*` | Sprites, audio (manifest refs) |
| `formulas/*` | Tunable economy parameters (bounded) |

## 9.4 Safety & Compatibility

- **API tiers:** `stable`, `beta`, `deprecated`
- Manifest declares `minEngineVersion`, `maxEngineVersion`
- Signed mods for official workshop
- Ranked play: vanilla or approved mod sets only

## 9.5 Multiplayer & Mods

- Mod hash in save header
- Friends must match mod set for ranked transfers (configurable)
- Server rejects incompatible cross-play contracts

---

# 10. Performance

## 10.1 Performance Goals

| Metric | Target |
|---|---|
| UI frame rate | 60 FPS (React), 60 FPS (Phaser scenes) |
| Initial load | < 3s to menu (cached), < 8s cold |
| Save load | < 2s local (10MB), < 5s cloud |
| Monthly tick | < 200ms client (player mid-game) |
| Offline catch-up | < 30s for 1 in-game year (cloud) |
| API p95 | < 100ms read, < 300ms write |
| Memory (client) | < 1GB typical session |

## 10.2 Strategies

| Area | Approach |
|---|---|
| UI | Virtualized lists, React.memo discipline, route code splitting |
| Simulation | Web Worker, tiered agents, dirty tracking |
| AI | Batch decisions, utility curves not deep search |
| Saves | Streaming deserialize, lazy aggregate hydration |
| Assets | CDN, texture atlases, Phaser asset packs by region |
| Network | GraphQL-style field selection on projections (optional) |

## 10.3 Asynchronous Processing

- All non-blocking: news, analytics, cloud upload, catch-up
- UI shows progress with cancel for long catch-up

## 10.4 Lazy Loading

- Feature modules loaded on first navigation
- City districts load on map pan
- Historical newspapers paginated

---

# 11. Logging & Observability

## 11.1 Structured Logging

```json
{
  "level": "info",
  "timestamp": "2026-07-10T18:00:00Z",
  "service": "simulation-engine",
  "correlationId": "uuid",
  "worldInstanceId": "uuid",
  "event": "tick.completed",
  "durationMs": 142,
  "simulationDate": "2042-03-01"
}
```

## 11.2 Crash Reporting

- Client: Sentry with breadcrumbs (last 50 player actions, no PII)
- Server: unhandled exception capture with request context

## 11.3 Performance Profiling

- Chrome Performance API (client dev builds)
- Application Insights dependency tracking
- Simulation profiler mode: per-phase timing breakdown

## 11.4 Telemetry (Privacy-Gated)

| Event | Purpose |
|---|---|
| `session.start` | Retention |
| `tick.advance` | Performance distribution |
| `feature.used` | Product analytics |
| `economy.health` | Live ops balancing |

Opt-in during onboarding; anonymized.

## 11.5 Simulation Debugging

- **Deterministic replay** from event log + seed
- **Time travel** (dev only): inspect state at any tick
- **Agent inspector**: promote NPC to T1 for debugging
- **Economy overlay**: macro variable heatmap

## 11.6 Developer Tools

- In-game console (dev builds)
- Save inspector
- Event bus monitor
- Mod manifest validator CLI

---

# 12. Development Standards

## 12.1 Repository Structure

```
fenix-life/
├── apps/
│   ├── client/                 # Vite + React + Phaser
│   ├── api/                    # NestJS monolith
│   └── admin/                  # Internal ops portal
├── packages/
│   ├── domain/                 # Shared domain types, events
│   ├── simulation-engine/      # Core tick + agents
│   ├── mod-sdk/                # Schemas, validators
│   ├── api-contracts/          # OpenAPI types
│   └── ui-kit/                 # Shared React components
├── infrastructure/
│   ├── docker/
│   ├── terraform/              # Azure IaC
│   └── github-actions/
├── docs/
├── prd/
└── tests/
    ├── e2e/                    # Playwright
    └── load/                   # k6 scenarios
```

## 12.2 Feature-First Organization (Client)

```
apps/client/src/features/banking/
├── components/
├── hooks/
├── view-models/
├── routes/
└── index.ts
```

No imports from `features/banking` into `features/company` except via `@fenix/domain` contracts.

## 12.3 Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Files | kebab-case | `loan-approval.service.ts` |
| Classes | PascalCase | `LoanApprovalService` |
| Interfaces | `I` prefix | `ILoanRepository` |
| Events | PascalCase past tense | `LoanApprovedEvent` |
| DB tables | snake_case | `loan_applications` |
| API routes | kebab-case plural | `/api/v1/loan-applications` |

## 12.4 Dependency Rules

1. `domain` → no dependencies on apps
2. `application` → `domain` only
3. `infrastructure` → `application`, `domain`
4. `presentation` → `application` (via interfaces)
5. Client UI → view models, never Prisma types

## 12.5 Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Unit | Vitest | 80% domain/application |
| Integration | Jest + Testcontainers (Postgres, Redis) | Critical paths |
| API contract | Jest + Supertest | All public endpoints |
| E2E | Playwright | Core loops (life month, company month, save sync) |
| Simulation | Golden tests | Tick determinism |
| Load | k6 | API + sync under peak |

## 12.6 Documentation Standards

- ADRs (Architecture Decision Records) in `docs/adr/`
- Module README per feature
- OpenAPI spec generated in CI
- Mod API changelog per release

## 12.7 Code Review Rules

- Symmetry check for player/NPC rule changes
- Event schema backward compatibility
- Migration script required for schema changes
- Performance note for hot path changes
- No business logic in React components

## 12.8 Versioning

- **SemVer** for client and API
- **Schema version** for saves independent of app version
- Deprecation window: 2 major versions for API

## 12.9 Migration Strategy

- Prisma migrate for database
- Blue-green deployment on Azure
- Feature flags (LaunchDarkly or open-source equivalent)
- Save migrations never blocking without backup

---

# 13. Future-Proofing

## 13.1 Expansion Integration Pattern

Every future domain (Product Bible §15, Constitution Article X) follows:

1. **Industry module** — extends Company department templates
2. **Career module extension** — new paths in Career
3. **Economy hooks** — sector indices, regulation
4. **Living World** — NPC participation at aggregate tier
5. **Media templates** — news generation
6. **Historical archive** — encyclopedia entries

No expansion ships as isolated executable.

## 13.2 Roadmap Technical Enablers

| Expansion | Architectural Hook |
|---|---|
| **Politics** | Government module + Career path + election events |
| **Airlines** | Company industry template + fuel commodity + regulation |
| **International trade** | Multi-region economy state + FX table + customs rules |
| **Space industry** | Late-game capital gates + government contracts + R&D pipeline |
| **Healthcare depth** | Company (hospitals) + Healthcare + Insurance submodule |
| **Sports ownership** | Company (franchise) + Human Capital athletics + Media |
| **Climate simulation** | Economy externalities + Property risk + Insurance pricing |
| **AI companies** | Labor disruption events + new industry + ethics reputation |
| **New countries** | Data packs (mod API) + region config in Living World |
| **Multiplayer co-op companies** | Shared contract aggregate (phase 2 Network) |

## 13.3 API Versioning & Feature Flags

- New industries behind `feature.airlines.enabled`
- Gradual rollout per account cohort
- A/B economy tuning in sandbox worlds

## 13.4 Technology Evolution

| Component | Evolution path |
|---|---|
| Client simulation | WebAssembly for hot paths |
| Database | Shard by region if single-DB limits hit |
| Realtime | Optional CRDT for co-op (research) |
| AI citizens | ML-assisted utility (optional, not required v1) |

## 13.5 Anti-Rewrite Guarantees

Principles that prevent decade-scale rewrites:

1. **Event log as source of truth** for World Memory
2. **Data-driven industries** not hardcoded switch statements
3. **Mod API** forces extension points
4. **Sovereign instances** prevent MMO coupling
5. **Schema versioning** on all persisted artifacts
6. **Domain isolation** enables team parallelization

---

# Appendices

## A. Technology Stack Summary

| Layer | Technology |
|---|---|
| Client UI | React, TypeScript, Vite, TailwindCSS |
| Game Canvas | Phaser 3 |
| API | NestJS, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Cache / Queues | Redis, BullMQ |
| Realtime | Socket.IO |
| Auth | JWT |
| Storage | Azure Blob Storage |
| Deployment | Docker, GitHub Actions, Azure |
| Testing | Vitest, Playwright, Jest |

## B. Cross-Reference Index

| TDD Section | Product Bible | Constitution |
|---|---|---|
| §4 Simulation | §7, §10 | Article II |
| §5 Multiplayer | §9 | Article VIII |
| §7 Saves | §15 | Article IX |
| §9 Mods | §17 | — |
| §2 Citizen/Company | §4, §12 | Article I |
| §3 Events | §10 | Article VI |
| §13 Expansion | §15, §16 | Article X |

## C. Glossary

| Term | Definition |
|---|---|
| **World Instance** | Sovereign simulation state for one player save |
| **Living World Engine** | Aggregate NPC/institution simulation subsystem |
| **Fenix Network** | Cross-player social and contract platform |
| **Tick** | Discrete simulation time advancement unit |
| **Five Capitals** | Financial, Human, Social, Business, Legacy |
| **Symmetry Principle** | AI agents follow player rules |
| **Presentation DTO** | Read-only projection for visits/profiles |

## D. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Platform Architecture | Initial canonical TDD |

---

## Sign-Off

This document defines the engineering architecture for Fenix Life. Implementation choices may vary; **architectural principles must not drift silently**.

*Build systems that outlive features. Build platforms that outlive systems. Build for legacy—for the game and the codebase.*

— Fenix Life Technical Design Document v1.0
