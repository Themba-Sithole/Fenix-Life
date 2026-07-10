# Fenix Life — Official Build Kickoff Prompt

**Purpose:** Copy everything below the `--- START PROMPT ---` line into a **new Cursor chat** to begin official implementation.  
**Last Updated:** July 10, 2026  

---

## How to use

1. Open a **new Cursor Agent chat** (fresh context).
2. Copy from `--- START PROMPT ---` through `--- END PROMPT ---`.
3. Paste as your first message.
4. Optionally attach: `@docs/39_Project_Master_Index.md` and `@docs/31_Cursor_AI_Studio.md`.

---

--- START PROMPT ---

# FENIX LIFE — OFFICIAL BUILD KICKOFF

You are the **lead implementation agent** for **Fenix Life**, a premium life and business simulation game. Documentation is complete. Infrastructure is live. Your job is to **officially build the application** — restructuring the codebase, implementing the simulation kernel, wiring the game client to real data, and building the **admin portal**.

**Do not invent gameplay rules.** Read the canonical docs first. Every feature must trace to the Product Bible and Design Constitution.

---

## 0. PROJECT CONTEXT (ALREADY DONE)

### Live infrastructure (free tier — DO NOT REBUILD)
| Service | URL / Notes |
|---|---|
| **GitHub** | `Themba-Sithole/Fenix-Life` |
| **Game UI (Vercel)** | https://fenix-life.vercel.app |
| **API (Render)** | https://fenix-life-api.onrender.com |
| **Database (Neon)** | PostgreSQL — `users`, `saves` tables exist |
| **Redis (Upstash)** | Connected — health shows `redis: ok` |
| **Env** | `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `UPSTASH_*`, `VITE_API_URL` configured |

### Codebase today (legacy layout — MUST MIGRATE)
```
fenix-life/
├── src/              # React/Vite game UI (16 screens, mock data only)
├── api/              # Express API (auth, saves — minimal)
├── prisma/           # schema.prisma (User, Save)
├── docs/             # 42 canonical docs (00–41 + this file)
└── prd/              # Product Bible
```

### What works today
- UI prototype: MainMenu, CharacterCreation, HomeScreen, CompanyDashboard, BankingDashboard, StockMarket, RealEstate, NewsFeed, Timeline, Family, Education, Settings, etc.
- API: `POST /v1/auth/register`, `POST /v1/auth/login`, `GET/POST /v1/saves`
- Settings page shows API connection status

### What does NOT exist yet
- Simulation engine (Time Engine, Tick Orchestrator, Economy, Citizens)
- Monorepo structure per Doc 28
- NestJS (current API is Express — migrate incrementally OR keep Express until M1.0, but structure must match Doc 28 boundaries)
- Cloud save blob upload/download
- Login UI wired to API
- Admin portal (`apps/admin`)
- Real game state — all screens use hardcoded mock data

---

## 1. MANDATORY READING (DO THIS FIRST)

Before writing code, read these documents **in order**. Use `@` references or Read tool.

| Order | Doc | Path | Why |
|---|---|---|---|
| 1 | Product Bible | `prd/FENIX-LIFE-PRODUCT-BIBLE.md` | Vision, pillars, loops |
| 2 | Design Constitution | `docs/Fenix-Life-Design-Constitution.md` | Immutable law — Citizen Equality, Living World |
| 3 | Cursor AI Studio | `docs/31_Cursor_AI_Studio.md` | How you must behave |
| 4 | Project Architecture | `docs/28_Project_Architecture.md` | Monorepo target structure |
| 5 | GDD | `docs/02_Game_Design_Document.md` | Player-facing gameplay |
| 6 | Simulation Framework | `docs/Fenix-Simulation-Framework.md` | Engine constellation |
| 7 | Time Simulation | `docs/17_Time_Simulation_System.md` | Tick phases |
| 8 | Database Design | `docs/Fenix-Life-Database-Design-Document.md` | Data domains |
| 9 | API Design | `docs/25_API_Design.md` | REST contracts |
| 10 | Save System | `docs/26_Save_System.md` | Saves — critical |
| 11 | UI/UX Guidelines | `docs/34_UI_UX_Guidelines.md` | Screen specs |
| 12 | Admin Portal | `docs/42_Admin_Portal_Design.md` | Admin panel spec |
| 13 | Backlog | `docs/38_Backlog.md` | P0/P1 priorities |
| 14 | Master Index | `docs/39_Project_Master_Index.md` | Full doc registry |

**Domain docs (read when implementing that feature):** `docs/05` through `docs/13` (game design), `docs/17` through `docs/24` (engine specs).

---

## 2. NON-NEGOTIABLE RULES

From Design Constitution and Doc 31 — violations require redesign:

1. **Citizen Equality** — Player and AI citizens use identical simulation rules. No player-only buffs.
2. **Living World** — Simulation advances offline. World does not freeze for player convenience by default.
3. **Five Capitals** — Features connect to Human, Social, Financial, Business, or Legacy capital.
4. **No business logic in UI** — React components render view models only.
5. **Dependencies point inward** — Domain has zero framework imports.
6. **Append-only history** — Money, ownership, relationships use event log patterns.
7. **Admin cannot edit simulation stats** — Admin inspects and moderates; does not grant advantages (Doc 42).
8. **Read before implementing** — Cite doc section in PR/commit when adding features.
9. **Minimal correct diff** — Do not rewrite unrelated code.
10. **TypeScript strict** — Per Doc 30.

---

## 3. TARGET REPOSITORY STRUCTURE

Migrate to this structure per `docs/28_Project_Architecture.md`. Do it **incrementally** — do not break Vercel/Render deploys.

```
fenix-life/
├── apps/
│   ├── client/                 # Player game (move from /src)
│   │   ├── src/
│   │   │   ├── app/screens/    # Existing screens
│   │   │   ├── lib/api.ts
│   │   │   └── simulation-bridge/  # UI ↔ simulation worker
│   │   └── package.json
│   ├── api/                    # Backend (move from /api)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── saves.ts
│   │   │   │   └── admin/      # NEW — per Doc 42
│   │   │   ├── middleware/
│   │   │   │   ├── requireAuth.ts
│   │   │   │   ├── requireAdmin.ts
│   │   │   │   └── auditLog.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── admin/                  # NEW — internal ops portal
│       ├── src/
│       │   ├── screens/
│       │   └── lib/admin-api.ts
│       └── package.json
├── packages/
│   ├── domain/                 # Pure TS — entities, events, value objects
│   ├── simulation-engine/      # FSF implementation
│   ├── api-contracts/          # Shared types / OpenAPI client
│   └── ui-kit/                 # Shared shadcn components
├── prisma/
│   └── schema.prisma
├── docs/
├── pnpm-workspace.yaml
├── turbo.json
└── package.json                # Root workspace scripts
```

**Migration rule:** After each structural move, verify `npm run build` (client), `api` build, and deployed URLs still work.

---

## 4. BUILD PHASES (EXECUTE IN ORDER)

### PHASE A — Foundation & Monorepo (Week 1)
**Goal:** Clean structure without losing deployability.

- [ ] A1. Add `pnpm-workspace.yaml` + Turborepo (or npm workspaces if pnpm unavailable)
- [ ] A2. Move `src/` → `apps/client/src/` — update Vite config, Vercel `rootDirectory` if needed
- [ ] A3. Move `api/` → `apps/api/` — update Render `rootDir` in `render.yaml`
- [ ] A4. Create `packages/domain` with core types: `Money`, `CitizenId`, `SaveId`, `WorldInstance`
- [ ] A5. Extend Prisma schema: `UserRole` enum, `AdminAuditLog`, `FeatureFlag` models (per Doc 42)
- [ ] A6. Run `db:push` against Neon
- [ ] A7. Add ESLint import boundary rules (apps → packages only)
- [ ] A8. Update `docs/39_Project_Master_Index.md` implementation tracker

**Exit criteria:** All three deploy targets build locally. Vercel + Render still deploy from GitHub push.

---

### PHASE B — Auth & Save Loop (Week 2)
**Goal:** Player can register, login, create a save, and see it on Home.

- [ ] B1. Build **Login / Register screens** (or modal on MainMenu) — wire to `apiFetch` in `apps/client/src/lib/api.ts`
- [ ] B2. JWT storage, auth context provider, protected routes
- [ ] B3. **New Life flow:** CharacterCreation → `POST /v1/saves` → navigate Home with save ID
- [ ] B4. **Continue flow:** list saves from `GET /v1/saves`, load selected save
- [ ] B5. Auth middleware on all `/v1/saves/*` routes (already partial — verify)
- [ ] B6. HomeScreen shows real save name, date — not mock "Alex Chen" when logged in
- [ ] B7. Logout in Settings

**Exit criteria:** End-to-end: register → create save → logout → login → continue save. Works on localhost AND production URLs.

**Docs:** `02_GDD`, `25_API_Design`, `26_Save_System`, `34_UI_UX_Guidelines`

---

### PHASE C — Simulation Kernel v0 (Week 3–4)
**Goal:** Minimal authoritative simulation in Web Worker.

- [ ] C1. Create `packages/simulation-engine/` per Doc 14 (FSF)
- [ ] C2. Implement **Time Engine** v0: game clock, daily tick (Doc 17)
- [ ] C3. Implement **Tick Orchestrator** skeleton: daily phase only
- [ ] C4. **WorldInstance** aggregate: `{ saveId, currentDate, schemaVersion, clock }`
- [ ] C5. Simulation Web Worker in client — postMessage bridge
- [ ] C6. Serialize/deserialize world state to JSON (save blob format v1 per Doc 26)
- [ ] C7. `PUT /v1/saves/:id/blob` — upload compressed save (API + Neon metadata + future blob)
- [ ] C8. Autosave every N ticks + on session end
- [ ] C9. HomeScreen shows **real in-game date** from simulation state

**Exit criteria:** Start new life → advance 1 in-game day → refresh page → date persisted via API.

**Docs:** `14`, `17`, `26`, `04_Database_Design`

---

### PHASE D — Admin Portal v1 (Week 4–5)
**Goal:** Internal staff tools per `docs/42_Admin_Portal_Design.md`.

- [ ] D1. Scaffold `apps/admin` — Vite + React + Tailwind + shadcn (dark admin theme)
- [ ] D2. Admin login (same User table, `role >= SUPPORT`)
- [ ] D3. API routes: `/v1/admin/accounts`, `/v1/admin/audit-log`, `/v1/admin/metrics`
- [ ] D4. `requireAdmin` middleware + `auditLog` middleware on all admin POSTs
- [ ] D5. **Dashboard** — API health, user count, pending moderation count
- [ ] D6. **Accounts screen** — search, detail, suspend
- [ ] D7. **Saves inspect** — metadata, schema version, blob size
- [ ] D8. **Audit log viewer** — searchable table
- [ ] D9. Deploy admin to separate Vercel project OR `/admin` route with role gate
- [ ] D10. Add admin origin to Render `CORS_ORIGINS`

**Exit criteria:** Admin login → search account created in Phase B → view audit log of admin actions.

**Docs:** `42_Admin_Portal_Design`, `25_API_Design` §17, `36_Live_Operations`

---

### PHASE E — First Playable Loop (Week 5–8)
**Goal:** One complete meso loop from GDD — education OR career OR banking (pick career first per backlog P1).

- [ ] E1. Citizen aggregate in `packages/domain` + CDPS trait stub (Doc 16)
- [ ] E2. Wire **BankingDashboard** to real accounts from simulation state
- [ ] E3. Wire **CompanyDashboard** stub OR **Education** screen — one domain fully real
- [ ] E4. Economy Engine v0: inflation constant, one sector (Doc 18)
- [ ] E5. News feed pulls from simulation events (Doc 23) — at least 1 generated headline
- [ ] E6. Time controls on Home: pause, 1x, 2x, 5x (Doc 17 player controls)

**Exit criteria:** Player lives 1 in-game month with visible state changes, news, and financial update.

**Docs:** `02`, `05`–`13`, `18`–`20`, `34`

---

## 5. TECH STACK (USE THIS — DO NOT SUBSTITUTE)

| Layer | Technology |
|---|---|
| Client | React 18, TypeScript, Vite, Tailwind, shadcn/ui, Phaser 3 (city map later) |
| Admin | React 18, TypeScript, Vite, Tailwind, shadcn/ui (dark theme) |
| API | Express (current) → structure for future NestJS migration |
| ORM | Prisma + PostgreSQL (Neon) |
| Cache/Queue | Upstash Redis (BullMQ later) |
| Simulation | TypeScript in Web Worker (`packages/simulation-engine`) |
| Monorepo | pnpm workspaces + Turborepo |
| Deploy | Vercel (client + admin), Render (API) |
| Auth | JWT (access 7d for now; refresh tokens per Doc 25 later) |

---

## 6. UI REQUIREMENTS

Per `docs/34_UI_UX_Guidelines.md` and `docs/32_Art_Direction.md`:

- **Palette:** `#0B132B`, `#1C2541`, `#2EC4B6`, `#F4B400`
- **CEO Test:** Screens must look like professional finance/HR software
- **Existing screens** in `apps/client/src/app/screens/` — wire to real data, do not redesign from scratch unless broken
- **Five Capitals** visible on Home dashboard
- **Admin** uses darker, denser layout — distinct from game (Doc 42 §4.3)

---

## 7. TESTING REQUIREMENTS

Per `docs/29_Testing_Strategy.md`:

| Change type | Required test |
|---|---|
| Domain logic | Unit tests (Vitest) in `packages/domain`, `packages/simulation-engine` |
| API routes | Integration tests with test DB |
| Auth flows | E2E Playwright: register → login → create save |
| Admin actions | Test audit log created on POST |
| Save migration | Golden file test when schema changes |

Run tests before marking any phase complete.

---

## 8. WORKFLOW FOR EACH TASK

1. **Identify** backlog ID from `docs/38_Backlog.md` (e.g., `FL-ENG-001`)
2. **Read** relevant canonical doc sections
3. **State** which Product Bible pillar(s) and Constitution article(s) apply
4. **Plan** files to create/modify — show structure before large changes
5. **Implement** minimal diff
6. **Test** locally + verify production deploy config not broken
7. **Update** implementation status in `docs/39_Project_Master_Index.md` §6.2

---

## 9. FIRST MESSAGE ACTION PLAN

When you start, do this immediately:

1. Read `docs/31_Cursor_AI_Studio.md` and `docs/39_Project_Master_Index.md`
2. Audit current repo structure vs Doc 28 target
3. Present a **Phase A implementation plan** with exact file moves and config changes
4. Ask for confirmation only if a decision blocks progress (e.g., pnpm vs npm workspaces)
5. Begin Phase A execution — do not wait for permission on obvious structural work
6. Keep `render.yaml` and `vercel.json` working at all times

---

## 10. DEFINITION OF DONE (M1.0 ALPHA)

The build kickoff is successful when:

- [ ] Monorepo structure matches Doc 28 (apps + packages)
- [ ] Player auth + save create/load works in production
- [ ] Simulation clock advances and persists
- [ ] Admin portal deployed with accounts + audit log
- [ ] At least one game screen (Banking or Home) shows real simulation data
- [ ] No Constitution violations
- [ ] `docs/39_Project_Master_Index.md` engineering progress updated

---

## 11. LINKS

- **Live game:** https://fenix-life.vercel.app
- **Live API:** https://fenix-life-api.onrender.com/health
- **Setup guide:** `docs/SETUP_FREE_TIER.md`
- **Glossary:** `docs/41_Fenix_Glossary.md`

---

**Begin Phase A now. Read the docs, audit the repo, and start building.**

--- END PROMPT ---
