# Fenix Life — Official Project Architecture Document

**Document Version:** 1.0  
**Status:** Canonical — Repository & Package Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal Software Architecture & Monorepo Platform  
**Audience:** Engineering, DevOps, QA, New Hires, AI Coding Assistants  

---

## Document Authority

This Project Architecture Document defines **how the Fenix Life codebase is organized, bounded, and evolved** across a TypeScript monorepo spanning client, API, simulation engine, and shared packages. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Product scope and feature domains |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | System architecture, modules, layers |
| [30_Coding_Standards.md](./30_Coding_Standards.md) | Naming, DDD, SOLID conventions |
| [29_Testing_Strategy.md](./29_Testing_Strategy.md) | Test layout and CI |

Every folder, package, and import must trace to a boundary defined here.

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [Monorepo Overview](#2-monorepo-overview)
3. [Repository Structure](#3-repository-structure)
4. [Applications](#4-applications)
5. [Shared Packages](#5-shared-packages)
6. [Clean Architecture Layers](#6-clean-architecture-layers)
7. [Domain Module Catalog](#7-domain-module-catalog)
8. [Dependency Rules](#8-dependency-rules)
9. [Client Architecture](#9-client-architecture)
10. [API Architecture](#10-api-architecture)
11. [Simulation Engine Architecture](#11-simulation-engine-architecture)
12. [Event Bus & CQRS](#12-event-bus--cqrs)
13. [Infrastructure & DevOps](#13-infrastructure--devops)
14. [Build & Tooling](#14-build--tooling)
15. [Environment Configuration](#15-environment-configuration)
16. [Cross-Cutting Concerns](#16-cross-cutting-concerns)
17. [Expansion Pattern](#17-expansion-pattern)
18. [Anti-Patterns](#18-anti-patterns)
19. [Onboarding Guide](#19-onboarding-guide)
20. [Future-Proofing](#20-future-proofing)
21. [Appendices](#21-appendices)

---

## Executive Summary

Fenix Life is a **pnpm + Turborepo monorepo** implementing **Clean Architecture** with **feature-first modules** and **DDD aggregates**.

```
fenix-life/
├── apps/           # Deployable applications
├── packages/       # Shared libraries (dependency direction: apps → packages)
├── infrastructure/ # IaC, Docker, CI
├── docs/           # Canonical documentation
├── prd/            # Product specifications
└── tests/          # Cross-cutting E2E and load tests
```

**North-star architectural constraints:**

| Constraint | Enforcement |
|---|---|
| Dependencies point inward | ESLint `import/no-restricted-paths` |
| No business logic in UI | Architecture review |
| Modules communicate via events | No cross-module infra imports |
| Domain has zero framework deps | `packages/domain` pure TS |
| Saves schema versioned independently | `simulation-engine/migrations/` |

---

# 1. Architecture Philosophy

## 1.1 Clean Architecture

Concentric layers with dependencies pointing **inward**:

```
┌─────────────────────────────────────────────┐
│  Presentation (React, Phaser, Controllers)   │
├─────────────────────────────────────────────┤
│  Application (Use Cases, Command Handlers)    │
├─────────────────────────────────────────────┤
│  Domain (Entities, Aggregates, Events)       │
├─────────────────────────────────────────────┤
│  Infrastructure (Prisma, Redis, Blob, WS)    │
└─────────────────────────────────────────────┘
```

## 1.2 Feature-First Organization

Code organized by **business capability** (Banking, Company, Citizen), not technical type (controllers, services). Technical layers exist **within** each feature module.

## 1.3 Domain-Driven Design

| DDD Concept | Fenix Implementation |
|---|---|
| Aggregate | `Citizen`, `Company`, `BankAccount` roots |
| Entity | `Employee`, `Loan`, `Property` |
| Value Object | `Money`, `CreditScore`, `DateRange` |
| Domain Event | `LoanApprovedEvent`, `CitizenDiedEvent` |
| Repository | `ILoanRepository` interface in domain |
| Bounded Context | Feature modules with published interfaces |
| Ubiquitous Language | Product Bible terms in code (`FiveCapitals`, `HeirGeneration`) |

## 1.4 Event-Driven Integration

Modules integrate through **domain events** and **published contracts** — not shared database tables or direct service calls across boundaries.

---

# 2. Monorepo Overview

## 2.1 Toolchain

| Tool | Purpose |
|---|---|
| **pnpm** | Package manager, workspace protocol |
| **Turborepo** | Build orchestration, caching |
| **TypeScript** | 5.x strict mode everywhere |
| **ESLint** | Linting + import boundaries |
| **Prettier** | Formatting |
| **Vitest** | Unit tests (client, packages) |
| **Jest** | API integration tests |
| **Playwright** | E2E tests |

## 2.2 Workspace Definition

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tests/*'
```

## 2.3 Turborepo Pipeline

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"] },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

## 2.4 Package Naming

All packages scoped: `@fenix/{name}`

| Package | Name |
|---|---|
| Client app | `@fenix/client` |
| API app | `@fenix/api` |
| Domain types | `@fenix/domain` |
| Simulation | `@fenix/simulation-engine` |
| Mod SDK | `@fenix/mod-sdk` |
| API contracts | `@fenix/api-contracts` |
| UI kit | `@fenix/ui-kit` |

---

# 3. Repository Structure

## 3.1 Top-Level Tree

```
fenix-life/
├── .github/
│   └── workflows/              # CI/CD pipelines
├── .cursor/                    # Cursor AI settings
├── apps/
│   ├── client/                 # Vite + React + Phaser
│   ├── api/                    # NestJS monolith
│   └── admin/                  # Internal ops portal
├── packages/
│   ├── domain/                 # Shared domain types, events, value objects
│   ├── simulation-engine/      # Core tick, agents, rules
│   ├── mod-sdk/                # Mod schemas, validators, loader
│   ├── api-contracts/          # OpenAPI generated types
│   ├── ui-kit/                 # Shared React components
│   ├── client-sdk/             # Typed API client
│   └── config/                 # Shared ESLint, TSConfig, Prettier
├── infrastructure/
│   ├── docker/
│   │   ├── api.Dockerfile
│   │   ├── worker.Dockerfile
│   │   └── docker-compose.yml
│   ├── terraform/              # Azure IaC
│   │   ├── modules/
│   │   └── environments/
│   └── github-actions/         # Reusable action configs
├── docs/                       # Canonical documentation (this folder)
├── prd/                        # Product Bible, feature PRDs
├── examples/
│   └── mods/                   # Sample mod packages
├── tests/
│   ├── e2e/                    # Playwright
│   ├── load/                   # k6 scenarios
│   └── fixtures/               # Golden saves, seed data
├── package.json                # Root scripts
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## 3.2 Documentation Layout

```
docs/
├── Fenix-Life-Design-Constitution.md
├── Fenix-Life-Technical-Design-Document.md
├── Fenix-Life-Database-Design-Document.md
├── Fenix-Simulation-Framework.md
├── 25_API_Design.md
├── 26_Save_System.md
├── 27_Mod_Framework.md
├── 28_Project_Architecture.md      # This document
├── 29_Testing_Strategy.md
├── 30_Coding_Standards.md
├── 31_Cursor_AI_Studio.md
├── adr/                            # Architecture Decision Records
├── api/
│   ├── CHANGELOG.md
│   └── websocket-events.yaml
└── modding/
    ├── GETTING_STARTED.md
    └── SYMMETRY_CHECKLIST.md
```

---

# 4. Applications

## 4.1 `apps/client`

**Stack:** Vite, React 18, TypeScript, TailwindCSS, Phaser 3, React Router

```
apps/client/
├── public/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── screens/              # Route-level screens
│   │   ├── components/           # Shared app components
│   │   │   └── ui/               # shadcn/ui primitives
│   │   └── providers/            # Context providers
│   ├── features/                 # Feature-first modules
│   │   ├── banking/
│   │   ├── company/
│   │   ├── citizen/
│   │   ├── education/
│   │   ├── family/
│   │   ├── investments/
│   │   ├── real-estate/
│   │   ├── stock-market/
│   │   ├── timeline/
│   │   ├── news/
│   │   ├── smartphone/
│   │   ├── city-map/
│   │   ├── character-creation/
│   │   ├── settings/
│   │   └── network/              # Fenix Network UI
│   ├── simulation/               # Client simulation runtime
│   │   ├── worker/               # Web Worker entry
│   │   ├── bridge/               # Main thread ↔ worker
│   │   └── local-save/           # Local persistence
│   ├── phaser/                   # Phaser scenes
│   │   ├── scenes/
│   │   └── assets/
│   ├── mods/                     # Mod loader integration
│   ├── api/                      # Client SDK wrapper
│   └── styles/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

### Feature Module Internal Structure

```
features/banking/
├── components/         # Presentational React components
├── hooks/              # useBankAccounts, useTransfer
├── view-models/        # UI state mapping (no business logic)
├── routes/             # Feature routes
├── screens/            # Feature-specific screens
└── index.ts            # Public exports only
```

## 4.2 `apps/api`

**Stack:** NestJS, TypeScript, Prisma, BullMQ, Socket.IO

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/                   # Guards, filters, interceptors, pipes
│   │   ├── guards/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── decorators/
│   ├── config/
│   ├── modules/                  # NestJS feature modules
│   │   ├── auth/
│   │   ├── account/
│   │   ├── save/
│   │   ├── network/
│   │   ├── friends/
│   │   ├── messaging/
│   │   ├── leaderboards/
│   │   ├── mods/
│   │   ├── moderation/
│   │   ├── analytics/
│   │   ├── simulation/
│   │   └── admin/
│   ├── workers/                  # BullMQ processors
│   │   ├── save-compression/
│   │   ├── save-migration/
│   │   ├── offline-catch-up/
│   │   └── workshop-sync/
│   ├── gateway/                  # Socket.IO gateway
│   └── prisma/
│       └── schema.prisma
├── test/
├── nest-cli.json
└── package.json
```

### NestJS Module Internal Structure (per domain)

```
modules/save/
├── save.module.ts
├── presentation/
│   ├── save.controller.ts
│   └── dto/
├── application/
│   ├── commands/
│   ├── queries/
│   └── handlers/
├── domain/
│   ├── entities/
│   ├── events/
│   └── repositories/           # Interfaces only
└── infrastructure/
    ├── save.repository.ts      # Prisma implementation
    └── blob-storage.service.ts
```

## 4.3 `apps/admin`

**Stack:** React, Vite, internal only

```
apps/admin/
├── src/
│   ├── screens/
│   │   ├── accounts/
│   │   ├── moderation/
│   │   ├── saves/
│   │   ├── economy-health/
│   │   └── feature-flags/
│   └── api/
└── package.json
```

---

# 5. Shared Packages

## 5.1 `@fenix/domain`

**Pure TypeScript — zero framework dependencies**

```
packages/domain/
├── src/
│   ├── citizen/
│   │   ├── citizen.aggregate.ts
│   │   ├── citizen.events.ts
│   │   └── citizen.types.ts
│   ├── company/
│   ├── banking/
│   ├── events/
│   │   ├── event.base.ts
│   │   └── event.catalog.ts
│   ├── value-objects/
│   │   ├── money.ts
│   │   ├── credit-score.ts
│   │   └── date-range.ts
│   └── contracts/              # Published interfaces between modules
│       ├── banking.contract.ts
│       └── company.contract.ts
└── package.json
```

## 5.2 `@fenix/simulation-engine`

```
packages/simulation-engine/
├── src/
│   ├── kernel/
│   │   ├── time-engine.ts
│   │   └── tick-orchestrator.ts
│   ├── modules/                # Simulation module implementations
│   │   ├── citizen/
│   │   ├── company/
│   │   ├── banking/
│   │   ├── economy/
│   │   └── living-world/
│   ├── agents/
│   │   ├── agent-pool.ts
│   │   └── tier-manager.ts
│   ├── events/
│   │   └── event-bus.ts
│   ├── rules/
│   │   └── rule-registry.ts
│   ├── migrations/
│   │   ├── v11-to-v12.ts
│   │   └── index.ts
│   └── serialization/
│       ├── save-writer.ts
│       └── save-reader.ts
└── package.json
```

## 5.3 `@fenix/mod-sdk`

```
packages/mod-sdk/
├── src/
│   ├── schemas/                # JSON Schema files
│   ├── validator/
│   ├── merger/
│   ├── resolver/
│   └── sandbox/
├── cli/
│   └── fenix-mod.ts
└── package.json
```

## 5.4 `@fenix/api-contracts`

Generated from OpenAPI — **do not hand-edit**.

```
packages/api-contracts/
├── src/
│   └── generated/
└── package.json
```

## 5.5 `@fenix/ui-kit`

```
packages/ui-kit/
├── src/
│   ├── components/
│   ├── tokens/
│   └── hooks/
└── package.json
```

## 5.6 `@fenix/config`

Shared configuration:

```
packages/config/
├── eslint/
├── typescript/
│   ├── base.json
│   ├── react.json
│   └── nestjs.json
└── prettier/
```

---

# 6. Clean Architecture Layers

## 6.1 Layer Responsibilities

| Layer | Contains | Depends On |
|---|---|---|
| **Domain** | Entities, aggregates, domain events, repository interfaces, value objects | Nothing external |
| **Application** | Use cases, command/query handlers, DTOs mapping | Domain |
| **Infrastructure** | Prisma repos, Redis, Azure Blob, external APIs | Application, Domain |
| **Presentation** | Controllers, React components, Phaser scenes | Application (via interfaces) |

## 6.2 Request Flow (API)

```
HTTP Request
    → Controller (presentation)
    → Command/Query Bus (application)
    → Handler (application)
    → Aggregate (domain)
    → Repository (infrastructure)
    → Domain Events published
    → Event Handlers (application)
    → Response DTO
```

## 6.3 Command Query Responsibility Segregation (CQRS)

| Side | Purpose | Storage |
|---|---|---|
| **Command** | Mutate aggregates | PostgreSQL normalized |
| **Query** | Read dashboards | Materialized views, Redis cache |

Example: Company dashboard reads from `company_dashboard_projection` table fed by `CompanyEarningsReported` events.

---

# 7. Domain Module Catalog

Maps to TDD §2.2 — each module is a bounded context.

| Module | Package Location | API Module | Client Feature |
|---|---|---|---|
| Citizen | `simulation-engine/modules/citizen` | — (simulation) | `features/citizen` |
| Company | `simulation-engine/modules/company` | — | `features/company` |
| Banking | `simulation-engine/modules/banking` | — | `features/banking` |
| Education | `simulation-engine/modules/education` | — | `features/education` |
| Career | `simulation-engine/modules/career` | — | `features/career` |
| Investments | `simulation-engine/modules/investments` | — | `features/investments` |
| Stock Market | `simulation-engine/modules/stock-market` | — | `features/stock-market` |
| Properties | `simulation-engine/modules/properties` | — | `features/real-estate` |
| Family | `simulation-engine/modules/family` | — | `features/family` |
| Relationships | `simulation-engine/modules/relationships` | — | `features/family` |
| Economy | `simulation-engine/modules/economy` | — | — |
| Government | `simulation-engine/modules/government` | — | — |
| Living World | `simulation-engine/modules/living-world` | — | `features/city-map` |
| Time | `simulation-engine/kernel` | — | — |
| Auth | — | `api/modules/auth` | `features/settings` |
| Save | — | `api/modules/save` | `simulation/local-save` |
| Fenix Network | — | `api/modules/network` | `features/network` |
| Mods | `mod-sdk` | `api/modules/mods` | `mods/` |

---

# 8. Dependency Rules

## 8.1 Allowed Dependencies

```
apps/client        → @fenix/domain, @fenix/simulation-engine, @fenix/mod-sdk,
                     @fenix/api-contracts, @fenix/ui-kit, @fenix/client-sdk

apps/api           → @fenix/domain, @fenix/simulation-engine, @fenix/mod-sdk,
                     @fenix/api-contracts

apps/admin         → @fenix/api-contracts, @fenix/ui-kit

@fenix/simulation-engine → @fenix/domain, @fenix/mod-sdk

@fenix/mod-sdk     → (minimal — zod, json-schema)

@fenix/domain      → (nothing)

@fenix/ui-kit      → @fenix/domain (types only)
```

## 8.2 Forbidden Dependencies

| From | To | Reason |
|---|---|---|
| `@fenix/domain` | Any app/package | Purity |
| `features/banking` | `features/company/infrastructure` | Cross-feature coupling |
| Client | `prisma` | No DB in client |
| `simulation-engine` | `nestjs` | No framework in engine |
| Any module | Another module's `infrastructure/` | Boundary violation |

## 8.3 ESLint Enforcement

```javascript
// .eslintrc.cjs (excerpt)
'import/no-restricted-paths': ['error', {
  zones: [
    { target: './packages/domain', from: './apps' },
    { target: './packages/domain', from: './packages/simulation-engine',
      except: ['./packages/domain'] },
    { target: './src/features/banking', from: './src/features/company',
      message: 'Use @fenix/domain contracts' },
  ],
}],
```

## 8.4 Public API Surface

Each package exports **only** from `index.ts`. Internal paths are not importable:

```json
// package.json
"exports": {
  ".": "./dist/index.js",
  "./package.json": "./package.json"
}
```

---

# 9. Client Architecture

## 9.1 UI vs Simulation Separation

```
┌─────────────────────────────────────────────────┐
│  React UI (main thread)                            │
│  - Screens, dashboards, forms                      │
│  - View models (display mapping only)              │
└───────────────────────┬─────────────────────────┘
                        │ SimulationBridge (postMessage)
┌───────────────────────▼─────────────────────────┐
│  Simulation Worker (Web Worker)                    │
│  - @fenix/simulation-engine                        │
│  - Tick execution, autosave serialize            │
└─────────────────────────────────────────────────┘
```

**Rule:** No business logic in React components. Components dispatch commands to worker.

## 9.2 State Management

| State Type | Solution |
|---|---|
| Simulation state | Simulation Worker (authoritative) |
| UI state | React local state + context |
| Server state | TanStack Query (API data) |
| Persistent preferences | Local storage + cloud sync |

## 9.3 Phaser Integration

Phaser runs in dedicated canvas component. Scene events bridge to React via custom events. Phaser does not own simulation state.

## 9.4 Routing

```typescript
// apps/client/src/app/routes.tsx
const routes = [
  { path: '/', element: <MainMenu /> },
  { path: '/play', element: <GameShell />, children: [
    { path: 'banking', lazy: () => import('@/features/banking') },
    { path: 'company', lazy: () => import('@/features/company') },
    // ...
  ]},
];
```

Feature routes lazy-loaded for performance (TDD §10.4).

---

# 10. API Architecture

## 10.1 NestJS Module Boundaries

Each API module is self-contained:

```typescript
@Module({
  imports: [PrismaModule, BullModule],
  controllers: [SaveController],
  providers: [
    SaveService,
    SaveRepository,
    { provide: ISaveRepository, useClass: SaveRepository },
  ],
  exports: [ISaveRepository],
})
export class SaveModule {}
```

## 10.2 Cross-Module Communication

| Pattern | When |
|---|---|
| Domain events (in-process) | Side effects within monolith |
| BullMQ jobs | Async work (migration, catch-up) |
| Published interface | Synchronous query across modules |
| **Never** | Direct Prisma access to another module's tables |

## 10.3 Prisma Schema Organization

```prisma
// Single schema.prisma with comment sections
// === AUTH ===
model Account { ... }

// === SAVE ===
model Save { ... }

// === NETWORK ===
model Transfer { ... }
```

Alternative (phase 2): Prisma multi-file schema.

## 10.4 Worker Processes

| Worker | Queue | Concurrency |
|---|---|---|
| Save compression | `save-compression` | 4 |
| Save migration | `save-migration` | 2 |
| Offline catch-up | `offline-catch-up` | 8 |
| Workshop sync | `workshop-sync` | 2 |
| Analytics batch | `analytics-ingest` | 4 |

Workers deploy as separate Azure Container Apps instances.

---

# 11. Simulation Engine Architecture

## 11.1 Tick Orchestration

See [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md).

```
TimeEngine → TickOrchestrator → Phase Runners (daily/weekly/monthly/...)
    → Module tick handlers → EventBus dispatch → Projections update
```

## 11.2 Module Registration

```typescript
// simulation-engine/src/kernel/module-registry.ts
registry.register('banking', bankingModule);
registry.register('company', companyModule);
// Tick orchestrator invokes modules in dependency order
```

## 11.3 Determinism

- Seeded RNG per world (`worldSeed`)
- Tick inputs logged for replay
- Golden tests verify checksum after N ticks

## 11.4 Client vs Server Execution

| Mode | Where Simulation Runs |
|---|---|
| Offline single-player | Client Web Worker |
| Cloud-assisted catch-up | API worker (BullMQ) |
| Future co-op | Server authoritative (research) |

---

# 12. Event Bus & CQRS

## 12.1 In-Process Event Bus

```typescript
interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  worldInstanceId: string;
  simulationTime: string;
  realTime: string;
  schemaVersion: number;
  payload: unknown;
}
```

## 12.2 Event Handlers

```
packages/simulation-engine/src/modules/banking/
├── handlers/
│   └── on-company-founded.handler.ts
```

Handlers are idempotent — store `processedEventIds`.

## 12.3 CQRS Projections (API)

```
domain event → projection handler → upsert read model table
```

Read models in `infrastructure/projections/` per API module.

## 12.4 Event Sourcing (Audit)

Financial and network transfers use append-only event log (see Database DDD §5). Not full ES on all aggregates — pragmatic hybrid.

---

# 13. Infrastructure & DevOps

## 13.1 Azure Services

| Service | Use |
|---|---|
| Azure Container Apps | API, workers |
| Azure PostgreSQL Flexible | Primary database |
| Azure Cache for Redis | Cache, pub/sub, BullMQ |
| Azure Blob Storage | Save blobs, mod packages |
| Azure Front Door | CDN, WAF |
| Azure Key Vault | Secrets |
| Application Insights | Monitoring |

## 13.2 Docker

```yaml
# infrastructure/docker/docker-compose.yml (dev)
services:
  api:
    build: { dockerfile: api.Dockerfile }
    depends_on: [postgres, redis]
  worker:
    build: { dockerfile: worker.Dockerfile }
  postgres:
    image: postgres:16
  redis:
    image: redis:7
```

## 13.3 CI/CD

```
.github/workflows/
├── ci.yml           # PR: lint, typecheck, test, build
├── deploy-staging.yml
├── deploy-prod.yml
├── openapi.yml      # Generate + diff api-contracts
└── e2e.yml          # Playwright nightly
```

## 13.4 Environments

| Env | Branch | URL |
|---|---|---|
| Local | — | localhost |
| Staging | `develop` | staging.fenixlife.com |
| Production | `main` | api.fenixlife.com |

---

# 14. Build & Tooling

## 14.1 Root Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "e2e": "playwright test",
    "db:migrate": "pnpm --filter @fenix/api prisma migrate dev",
    "openapi:generate": "pnpm --filter @fenix/api openapi:export"
  }
}
```

## 14.2 TypeScript Project References

```
tsconfig.base.json
apps/client/tsconfig.json    → references packages/*
apps/api/tsconfig.json       → references packages/*
packages/domain/tsconfig.json
```

## 14.3 Path Aliases (Client)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@fenix/domain": ["../../packages/domain/src"]
    }
  }
}
```

---

# 15. Environment Configuration

## 15.1 Config Hierarchy

```
defaults → .env → .env.local → Azure App Configuration (prod)
```

## 15.2 Required Variables

| Variable | App | Description |
|---|---|---|
| `DATABASE_URL` | API | PostgreSQL connection |
| `REDIS_URL` | API | Redis connection |
| `AZURE_BLOB_CONNECTION` | API | Save storage |
| `JWT_SECRET` | API | Token signing |
| `VITE_API_URL` | Client | API base URL |

## 15.3 Secrets

Never committed. Azure Key Vault in production. `.env.example` documents required keys.

---

# 16. Cross-Cutting Concerns

## 16.1 Logging

Structured JSON via `pino` (API) and custom logger (simulation). Correlation IDs propagated.

## 16.2 Error Handling

| Layer | Strategy |
|---|---|
| Domain | Throw domain exceptions (`InsufficientFundsError`) |
| Application | Catch, map to result type |
| API | Exception filter → standard error JSON |
| Client | Toast + retry for transient errors |

## 16.3 Feature Flags

```typescript
if (featureFlags.isEnabled('airlines.industry', accountId)) {
  // ...
}
```

Flags in Azure App Configuration or LaunchDarkly.

## 16.4 Internationalization (Phase 2)

`locales/` in client. Simulation uses `nameKey` references resolved at UI layer.

---

# 17. Expansion Pattern

New domains (Product Bible §15) follow:

```
1. packages/domain/src/{module}/        # Types, events, contracts
2. packages/simulation-engine/modules/  # Tick logic
3. apps/client/src/features/{module}/   # UI
4. apps/api/modules/{module}/           # If platform exposure needed
5. docs/adr/NNNN-{module}.md            # Architecture decision
6. tests/fixtures/                      # Golden scenarios
```

**No expansion ships as isolated executable.**

---

# 18. Anti-Patterns

| Anti-Pattern | Correct Approach |
|---|---|
| God service `GameService` | Feature modules with bounded contexts |
| Prisma in React component | API client + TanStack Query |
| Cross-feature direct import | `@fenix/domain` contracts |
| Business logic in controller | Application handler |
| Shared mutable singleton state | Event-driven updates |
| `any` type for domain objects | Strict types from `@fenix/domain` |
| Hardcoded industry switch | Data-driven `RuleRegistry` |
| Skipping migration script | Required for schema changes |

---

# 19. Onboarding Guide

## 19.1 Day 1 Setup

```bash
git clone https://github.com/fenixlife/fenix-life.git
cd fenix-life
pnpm install
docker compose -f infrastructure/docker/docker-compose.yml up -d
pnpm db:migrate
pnpm dev
```

## 19.2 Read Order

1. Product Bible (vision)
2. Design Constitution (law)
3. This document (structure)
4. TDD (systems)
5. Coding Standards
6. Feature-specific PRD in `prd/`

## 19.3 First Contribution

Recommended first tasks:

- Add unit test to existing module
- Fix lint boundary violation
- Implement small UI screen from spec

---

# 20. Future-Proofing

## 20.1 Extraction Points

| Component | Could Become |
|---|---|
| `simulation-engine` | WASM npm package |
| `api/modules/network` | Separate microservice (phase 3) |
| `workers/` | Kubernetes jobs |

## 20.2 Monorepo Scale

At 50+ engineers:

- CODEOWNERS per package
- Turborepo remote cache (Vercel/Azure)
- Optional Nx migration if graph complexity grows

---

# 21. Appendices

## A. Package Dependency Graph

```
                    ┌─────────────┐
                    │ @fenix/domain│
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
   ┌───────────────┐ ┌─────────────┐ ┌─────────────┐
   │ simulation-   │ │ mod-sdk     │ │ ui-kit      │
   │ engine        │ └──────┬──────┘ └──────┬──────┘
   └───────┬───────┘        │               │
           │                │               │
           └────────┬───────┘               │
                    ▼                       │
            ┌───────────────┐               │
            │ @fenix/client │◄──────────────┘
            └───────────────┘
                    │
            ┌───────▼───────┐
            │ @fenix/api    │
            └───────────────┘
```

## B. ADR Index

| ADR | Title |
|---|---|
| 0001 | Monorepo with pnpm + Turborepo |
| 0002 | Clean Architecture layer boundaries |
| 0003 | Event bus in-process vs Kafka |
| 0004 | Client simulation in Web Worker |
| 0005 | ZSTD save compression |

## C. Glossary

| Term | Definition |
|---|---|
| **Bounded Context** | Feature module with explicit boundary |
| **Aggregate Root** | Consistency boundary for domain object |
| **Projection** | CQRS read model from events |

## D. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Principal Architecture | Initial canonical release |

---

*End of Fenix Life Project Architecture Document v1.0*
