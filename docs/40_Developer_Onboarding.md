# Fenix Life — Developer Onboarding Guide

**Document Version:** 1.0  
**Status:** Canonical — Engineering Onboarding Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Engineering Lead & Developer Experience  
**Audience:** New engineers, contractors, technical designers joining the project  

---

## Document Authority

This guide is the **day-one onboarding path** for Fenix Life contributors. It complements but does not replace:

| Document | Role |
|---|---|
| [39_Project_Master_Index.md](./39_Project_Master_Index.md) | Full doc registry |
| [40_Developer_Onboarding.md](./40_Developer_Onboarding.md) | This document |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Architecture deep dive |
| [41_Fenix_Glossary.md](./41_Fenix_Glossary.md) | Term definitions |

---

## Table of Contents

1. [Welcome & Day-One Checklist](#1-welcome--day-one-checklist)
2. [What You Are Building](#2-what-you-are-building)
3. [Environment Setup](#3-environment-setup)
4. [Repository Structure](#4-repository-structure)
5. [Architecture in 10 Minutes](#5-architecture-in-10-minutes)
6. [Development Workflow](#6-development-workflow)
7. [Coding Standards](#7-coding-standards)
8. [Working with Simulation Code](#8-working-with-simulation-code)
9. [Working with UI Code](#9-working-with-ui-code)
10. [Testing & QA Expectations](#10-testing--qa-expectations)
11. [Common Tasks Cookbook](#11-common-tasks-cookbook)
12. [Getting Help & Escalation](#12-getting-help--escalation)
13. [Week-One Learning Plan](#13-week-one-learning-plan)

---

# 1. Welcome & Day-One Checklist

## 1.1 Day-One Checklist

| # | Task | Owner | Done |
|---|---|---|---|
| 1 | Read Product Bible §1–4, §20 | You | ☐ |
| 2 | Read Design Constitution (full) | You | ☐ |
| 3 | Skim [41 Fenix Glossary](./41_Fenix_Glossary.md) | You | ☐ |
| 4 | Complete environment setup (§3) | You | ☐ |
| 5 | Run dev server, click every screen | You | ☐ |
| 6 | Read TDD §1–2, §12 | You | ☐ |
| 7 | Read FSF §1–3 | You | ☐ |
| 8 | Read UI/UX Guidelines §2–5 | You | ☐ |
| 9 | Get assigned backlog items from [38](./38_Backlog.md) | EM | ☐ |
| 10 | Intro meeting with team + buddy assigned | EM | ☐ |

## 1.2 Core Rules (Non-Negotiable)

1. **No business logic in UI** — screens render state; engines decide (TDD §12).
2. **Symmetry Principle** — AI citizens and players share rules (Constitution Article I).
3. **Living World** — simulation advances offline; do not freeze world by default.
4. **Imports at top of file** — no inline imports (workspace rule).
5. **Exhaustive switch** — TypeScript unions use `never` in default case.
6. **Trace to docs** — PRs reference doc ID and backlog item.

---

# 2. What You Are Building

**Fenix Life** is a premium 2D life and business simulation:

- **Professional UI** — banking dashboards, company portals, HR tools
- **Deep simulation** — 22 FSF engines, millions of AI citizens
- **Five Capitals** — Financial, Human, Social, Business, Legacy
- **Living world** — economies evolve while player is away
- **Generational play** — death is transition, not game over

**Current phase:** Pre-Alpha — UI prototype exists; simulation backend in design/spike.

---

# 3. Environment Setup

## 3.1 Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 LTS+ | Required |
| pnpm | 9+ | Preferred package manager |
| Git | Latest | — |
| VS Code / Cursor | Latest | Recommended IDE |
| Docker | Latest | Optional; for PostgreSQL later |

## 3.2 Clone & Install

```bash
git clone <repository-url>
cd "Fenix Life"
pnpm install
```

## 3.3 Run Development Server

```bash
pnpm dev
```

Open `http://localhost:5173` (Vite default). Navigate all routes:

| URL | Screen |
|---|---|
| `/` | Main Menu |
| `/home` | Home Screen |
| `/banking` | Banking Dashboard |
| `/company` | Company Dashboard |
| `/stocks` | Stock Market |
| `/employees` | Employee Management |
| `/real-estate` | Real Estate |
| `/vehicles` | Vehicle Dealership |
| `/education` | Education |
| `/family` | Family |
| `/timeline` | Timeline |
| `/news` | News Feed |
| `/city` | City Map |
| `/phone` | Smartphone |
| `/settings` | Settings |
| `/character-creation` | Character Creation |

## 3.4 Build

```bash
pnpm build
```

## 3.5 Future Setup (When Available)

| Component | Command / Notes |
|---|---|
| PostgreSQL | Docker compose (TDD) |
| Prisma migrate | `pnpm prisma migrate dev` |
| Simulation worker | WASM build per TDD §4 |
| Backend API | NestJS monorepo (planned) |

---

# 4. Repository Structure

```
Fenix Life/
├── prd/
│   └── FENIX-LIFE-PRODUCT-BIBLE.md      # Doc 00
├── docs/
│   ├── Fenix-Life-Design-Constitution.md # Doc 01
│   ├── Fenix-Life-Technical-Design-Document.md  # Doc 03
│   ├── Fenix-Life-Database-Design-Document.md   # Doc 04
│   ├── Fenix-Simulation-Framework.md     # Doc 14
│   ├── Fenix-Life-World-Generation-System.md    # Doc 15
│   ├── Fenix-Life-Citizen-DNA-Personality-System.md # Doc 16
│   ├── 32_Art_Direction.md … 41_Fenix_Glossary.md # Docs 32–41
│   └── rfcs/                             # RFC proposals (future)
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx                    # Route definitions
│   │   ├── screens/                      # Page components
│   │   └── components/
│   │       ├── ui/                       # shadcn/ui primitives
│   │       └── figma/                    # Figma helpers
│   ├── styles/
│   │   └── theme.css                     # Fenix design tokens
│   ├── imports/                          # Prototype specs
│   └── main.tsx
├── content/                              # Data packs (planned)
├── guidelines/
│   └── Guidelines.md
├── package.json
└── vite.config.ts
```

---

# 5. Architecture in 10 Minutes

## 5.1 Layers (TDD)

```
┌─────────────────────────────────────┐
│  UI (React) — presentation only     │
├─────────────────────────────────────┤
│  Client SDK — commands & queries    │
├─────────────────────────────────────┤
│  Simulation (FSF) — authoritative   │
├─────────────────────────────────────┤
│  Data (PostgreSQL, event log)       │
└─────────────────────────────────────┘
```

## 5.2 Key Concepts

| Concept | Meaning |
|---|---|
| **WorldInstance** | One sovereign simulation world per save |
| **WorldSeed** | Deterministic input to WGS |
| **Tick** | Time Engine advancement unit (daily default) |
| **Engine** | Domain system (Banking, Company, etc.) |
| **Rule Registry** | Versioned data-driven rules |
| **World Memory** | Append-only history of consequential events |
| **Five Capitals** | Success measures beyond money |

See [41 Fenix Glossary](./41_Fenix_Glossary.md) for full definitions.

## 5.3 Event Flow (Target Architecture)

```
UI Command → Client SDK → Command Handler → Owning Engine
                                              ↓
                                        Domain Event
                                              ↓
                              Other Engines (subscribe)
                                              ↓
                                        Projections → UI
```

**Today:** UI uses mock/static data. Your job is wiring real projections.

---

# 6. Development Workflow

## 6.1 Branch Naming

```
{type}/{backlog-id}-{short-description}
```

Examples: `feature/FL-UI-003-banking-wire`, `fix/FL-ENG-003-save-corruption`

## 6.2 Commit Messages

```
FL-UI-003: Wire banking dashboard to account projection

- Connect Checking/Savings cards to sim state
- Add transaction list from event log
- Ref: doc 34 §5.4
```

## 6.3 Pull Request Template

```markdown
## Summary
- ...

## Backlog
- FL-XXX-NNN

## Docs
- [ ] Traces to doc 00/01
- [ ] UI changes match doc 34
- [ ] No business logic in UI components

## Test Plan
- [ ] ...
```

## 6.4 Review Requirements

| Change Type | Reviewers |
|---|---|
| UI only | 1 frontend + UX optional |
| Simulation | 1 simulation engineer + systems design |
| Schema | 1 backend + data architect |
| Economy numbers | Economy sign-off |

---

# 7. Coding Standards

## 7.1 TypeScript

- Strict mode enabled
- No `any` without documented exception
- Exhaustive switch on discriminated unions (`never` default)
- Imports at top of file only

## 7.2 React

- Functional components + hooks
- No simulation logic in `screens/` — use hooks/services that call SDK
- Prefer shadcn/ui components over custom
- Use design tokens from `theme.css`, not random hex

## 7.3 Styling

- Tailwind utility classes
- Canonical colours: `#0B132B`, `#1C2541`, `#2EC4B6`, `#F4B400`, `#F5F7FA`
- Card pattern: `border-[#2EC4B6]/20 shadow-lg`
- Max width: `max-w-7xl mx-auto`

## 7.4 File Naming

| Type | Convention |
|---|---|
| Screens | `PascalCase.tsx` in `screens/` |
| Components | `PascalCase.tsx` |
| Hooks | `useCamelCase.ts` |
| Services | `camelCase.service.ts` |
| Types | `PascalCase.types.ts` |

---

# 8. Working with Simulation Code

## 8.1 Before Writing Engine Code

1. Read FSF §4 for your engine spec
2. Identify owning engine (single writer per aggregate)
3. Define domain events (past tense: `LoanApproved`, not `ApproveLoan`)
4. Add Rule Registry entries, not hard-coded constants
5. Verify AI citizens can trigger same events

## 8.2 Engine Checklist

- [ ] Subscribes only via event bus
- [ ] Publishes facts, not commands to other engines
- [ ] Respects agent tier (T0–T3) budgets
- [ ] Appends to World Memory for consequential actions
- [ ] Unit tests with deterministic seed

## 8.3 Performance Budgets

| Tier | Citizens | Budget |
|---|---|---|
| T0 | Player + inner circle | Full CDPS |
| T1 | Direct interactors | Full CDPS |
| T2 | Regional | Compressed |
| T3 | Background | Statistical |

See FSF §3.5.

---

# 9. Working with UI Code

## 9.1 Adding a New Screen

1. Create `src/app/screens/NewScreen.tsx`
2. Add route in `src/app/routes.tsx`
3. Follow hero + metric + chart pattern (doc 34 §2.2)
4. Add quick action link from Home if primary domain
5. Document in UI/UX Guidelines §5

## 9.2 Wiring to Simulation (Target Pattern)

```typescript
// hooks/useBankingDashboard.ts — data fetching only
export function useBankingDashboard(worldId: string) {
  // Query projection from client SDK
  // Return { accounts, transactions, netWorth, isLoading, error }
}

// screens/BankingDashboard.tsx — presentation only
export default function BankingDashboard() {
  const { accounts, transactions, netWorth } = useBankingDashboard(worldId);
  // Render cards and charts
}
```

## 9.3 Do Not

- Calculate credit scores in UI
- Mutate simulation state directly
- Hard-code mock data without `// TODO: FL-XXX` reference
- Introduce non-design-system colours

---

# 10. Testing & QA Expectations

## 10.1 Current State

- Manual testing via dev server
- Automated tests planned (FL-ENG-037)

## 10.2 Minimum Before PR

| Change | Test |
|---|---|
| UI | Visual check all breakpoints |
| Route | Navigation works, back button correct |
| Simulation | Deterministic seed unit test |
| Economy | Spreadsheet sanity check |

## 10.3 Constitution Tests

- Player action available to AI? (Symmetry)
- Consequence in World Memory?
- Five Capital impact documented?

---

# 11. Common Tasks Cookbook

## 11.1 Add a Route

Edit `src/app/routes.tsx`:

```typescript
import NewScreen from "./screens/NewScreen";

// In router array:
{ path: "/new-path", Component: NewScreen },
```

## 11.2 Add a Design Token

Edit `src/styles/theme.css`:

```css
:root {
  --fenix-new-token: #value;
}
```

Document in doc 32 §3.

## 11.3 Add a Content Template (Future)

1. Create YAML in `/content/{type}/`
2. Run validation CI (doc 35 §10.3)
3. Register in manifest.json

## 11.4 Add a Dashboard KPI Card

Follow `CompanyDashboard.tsx` metric pattern:

```typescript
const metrics = [
  { label: "Revenue", value: "$145K", change: "+12.5%", trend: "up", icon: DollarSign },
];
```

## 11.5 Debug Simulation (Future)

FSF §8 debugging tools: tick replay, event inspector, seed re-run.

---

# 12. Getting Help & Escalation

| Question Type | Contact |
|---|---|
| Architecture | Principal Architect |
| Simulation design | Chief Simulation Architect |
| UI/UX | UX Director |
| Economy numbers | Chief Economist |
| Access / tooling | Engineering Lead |
| Doc conflicts | Product Operations → doc 39 |

**Slack/Discord channels (TBD):** `#fenix-engineering`, `#fenix-simulation`, `#fenix-ui`

---

# 13. Week-One Learning Plan

| Day | Focus | Deliverable |
|---|---|---|
| **Mon** | Setup + read 00, 01, 41 | Dev server running; notes |
| **Tue** | TDD + FSF §1–4 | Architecture diagram sketch |
| **Wed** | UI codebase tour | List of mock vs wired screens |
| **Thu** | CDPS + WGS skim | Explain one citizen decision path |
| **Fri** | Pick starter ticket | Draft PR or spike doc |

### Suggested Starter Tickets

| ID | Title | Skill |
|---|---|---|
| FL-UI-005 | Settings persistence | Frontend |
| FL-UI-003 | Banking mock → hook structure | Frontend |
| FL-ENG-036 | Content validation CI scaffold | DevOps |
| FL-ENG-001 | Time Engine spike | Simulation |

---

*Welcome to Fenix Life. Build worlds that remember.*

---

*End of Developer Onboarding Guide*
