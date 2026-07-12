# Fenix Life — Claude Context Prompt

**Purpose:** Copy everything below `--- START PROMPT ---` into a Claude chat when you need Claude to understand the game, current build status, gaps, and UI improvement work.  
**Last Updated:** July 12, 2026  
**Note:** This supersedes the outdated “mock data only” sections of `BUILD_KICKOFF_PROMPT.md` for *status* context. Kickoff phases A–AH are largely done; use this for product/UI understanding and next work.

---

## How to use

1. Open a new Claude chat (or Cursor Agent chat).
2. Copy from `--- START PROMPT ---` through `--- END PROMPT ---`.
3. Optionally attach: `@prd/FENIX-LIFE-PRODUCT-BIBLE.md`, `@docs/34_UI_UX_Guidelines.md`, `@docs/32_Art_Direction.md`, `@docs/39_Project_Master_Index.md`.
4. Then ask Claude your actual question (UI redesign, feature depth, critique, implementation plan, etc.).

---

--- START PROMPT ---

# FENIX LIFE — FULL PROJECT CONTEXT

You are advising on **Fenix Life**, a premium life and business simulation game. Documentation is complete. A playable pre-alpha exists with auth, saves, a simulation kernel, wired dashboards, and an admin portal. Your job is to understand the product deeply before proposing or changing anything.

**Do not invent gameplay rules.** Trace features to the Product Bible, Design Constitution, GDD, and domain docs. Prefer citing doc sections.

---

## 1. WHAT THE GAME IS

### One-line vision

**Fenix Life is the deepest, most believable life and business simulation ever built** — a premium 2D experience where one human life spans education, career, entrepreneurship, investment, family, and legacy across generations, inside a world that evolves whether the player is watching or not.

### Player fantasy

You live a full modern life as an operator of yourself:
- Grow up → study → work or found a company → invest → buy housing/vehicles → raise a family → leave a legacy → optionally continue as an heir.
- Time is the primary resource. Choices compound across decades.
- There is **no single win condition**. Success is measured by **Five Capitals**: Human, Social, Financial, Business, Legacy.
- The phoenix metaphor: fail, rebuild, reinvest, pass wealth and wisdom forward.

### Design philosophy (Product Bible)

**Clarity at the surface, depth beneath. Professional presentation, systemic soul.**

- UI must feel like executive software (banking portals, HR systems, market terminals) — the **CEO Test**.
- Systems interlock (credit → mortgage → cash flow → hiring → stock → retirement).
- Emergence over script; meaningful choice, not illusion of choice.
- **Diegetic interface:** features arrive as in-world artifacts (bank portal, broker app, company dashboard, phone apps, news feed).

### Six Core Pillars (every feature maps to ≥1)

1. **Living Life** — health, relationships, identity, time, mortality  
2. **Living Economy** — inflation, rates, credit, markets, policy  
3. **Living Company** — found, operate, hire, product, exit  
4. **Living World** — NPCs/institutions evolve off-screen  
5. **Living Network** — other players at the edges (future / deferred)  
6. **Living Legacy** — death, heirs, generational handoff  

### Immutable design law (Design Constitution — never violate)

1. **Citizen Equality** — Player and AI citizens use the same simulation rules. No player-only buffs.  
2. **Living World** — Simulation advances offline; world does not freeze for convenience by default.  
3. **Five Capitals** — Features connect to at least one capital.  
4. **No business logic in UI** — React renders view models; domain/simulation owns rules.  
5. **Admin cannot grant advantages** — inspect/moderate only (Doc 42).

### Nested loops

| Loop | Cadence | Examples |
|---|---|---|
| Micro | seconds–minutes | Transfer money, apply to job, visit district, gift family |
| Meso | days–months | Career progress, company runway, education GPA, bills |
| Macro | years–decades | Wealth arc, company stage, family tree, legacy score |

---

## 2. LIVE INFRASTRUCTURE

| Service | URL / Notes |
|---|---|
| **GitHub** | `Themba-Sithole/Fenix-Life` |
| **Game UI (Vercel)** | https://fenix-life.vercel.app |
| **API (Render)** | https://fenix-life-api.onrender.com |
| **Database** | Neon PostgreSQL |
| **Redis** | Upstash |
| **Admin** | `apps/admin` (separate deploy / config) |

Stack: React 18 + Vite + Tailwind + shadcn/ui (client), Express + Prisma (API), TypeScript simulation in packages, pnpm monorepo.

---

## 3. REPO STRUCTURE (CURRENT)

```
fenix-life/
├── apps/
│   ├── client/          # Player game (React Router screens)
│   ├── api/             # Express — auth, saves, admin routes
│   └── admin/           # Internal ops portal
├── packages/
│   ├── domain/          # Pure TS entities, actions, world state
│   ├── simulation-engine/  # Daily ticks, serialize, catch-up
│   └── content/         # Occupations, industries, headlines
├── prisma/              # User, Save, admin models
├── docs/                # 42+ canonical docs
└── prd/                 # Product Bible
```

---

## 4. WHAT WE BUILT SO FAR (ACCURATE AS OF JULY 2026)

Treat this as **pre-alpha / early playable**, not polish-complete. Systems exist at **v0 depth** — playable loops, not full GDD fidelity.

### Platform & foundation
- Monorepo (`apps/*` + `packages/*`)
- Auth: register, login, JWT, change password, profile, account deletion
- Saves: create, list, rename, delete, JSON export, blob upload/download, autosave, offline fallback, schema migration (golden tests)
- Simulation Web Worker bridge + `SimulationContext`
- Offline catch-up (“While you were away”) when returning after real-world time
- Admin portal: login, dashboard, accounts, audit log, moderation, feature flags
- Playwright smoke: main menu + auth
- Design tokens in `apps/client/src/styles/theme.css`
- Shared UI shell: `LifeShell`, `ToolShell`, `LifeDock`, `DecisionPanel`, `CrisisModal`, states, motion helpers

### Simulation kernel (daily tick)
- Time engine + tick orchestrator (pause, 1x/2x/5x, advance day)
- Economy cycle phases (expansion / peak / contraction / trough), inflation
- Banking: accounts, transfers, credit score drift, loans apply/pay, multi-account debit
- Career: employment, salary sync, raise / upskill / network, job applications
- Education: program progress, loans
- Company: founding stub ops, hire, launch product, promote/raise/train employees
- Investments: live quotes, holdings, daily drift, buy/sell
- Housing & vehicles: portfolio, rental income, depreciation, buy/sell
- Family: household, happiness, expenses, events/gifts/visits
- Civic / life gates (blocking crises that pause time advance)
- News/events from simulation + content packs
- Death pending → Death screen; childhood play + summary onboarding
- Five Capitals strip on Home from live state
- City districts (origin-based) with visit cooldowns — **not** Phaser yet
- Smartphone hub routing to Messages/Email/Calendar/Contacts/Marketplace (thin)

### Screens (all exist and are sim-wired)

| Route | Screen | Role |
|---|---|---|
| `/` | MainMenu | Brand entry, New Life / Continue, ticker |
| `/login` | AuthScreen | Register / login |
| `/continue` | ContinueScreen | Save list, rename/delete |
| `/character-creation` | CharacterCreation | New life setup |
| `/childhood-play` | ChildhoodPlayScreen | Early life onboarding |
| `/childhood-summary` | ChildhoodSummaryScreen | Transition to adult play |
| `/home` | HomeScreen | Life hub, time controls, capitals, destinations |
| `/banking` | BankingDashboard | Accounts, transfers, loans, charts |
| `/company` | CompanyDashboard | Company KPIs / ops |
| `/employees` | EmployeeManagement | HR roster actions |
| `/stocks` | StockMarket | Portfolio / trading |
| `/real-estate` | RealEstate | Property portfolio |
| `/vehicles` | VehicleDealership | Garage / buy-sell |
| `/education` | Education | Enrollment / progress |
| `/career` | CareerScreen | Job / career actions |
| `/family` | Family | Household |
| `/timeline` | Timeline | Life events river |
| `/news` | NewsFeed | Headlines |
| `/city` | CityMap | District list / visits |
| `/phone` | Smartphone | App launcher hub |
| `/settings` | Settings | Prefs, API status, account |
| `/while-away` | WhileAwayScreen | Catch-up summary |
| `/death` | DeathScreen | End of life |

---

## 5. WHAT IS MISSING OR STILL SHALLOW

### Not built / deferred (big product gaps)
- **Full FSF engine constellation** per Doc 14 (Citizen AI depth, History Engine, true News Engine, World Generation at city scale)
- **Phaser 3 city map** — route exists; map is district cards/icons, not a 2D world
- **Generational succession** as first-class play (heir selection / continue as child) — Death screen exists; deep legacy loop incomplete vs GDD
- **Multiplayer / Living Network** (Pillar V) — deferred
- **Taxes, bankruptcy, IPO/M&A, patents** — mostly absent or stub
- **Full FLSS binary save format** — JSON blob v1 only
- **NestJS migration** — still Express
- **Audio** — Doc 33 not implemented
- **True NPC living world** — world feels player-centric; competitors/citizens are thin
- **Content volume** — starter packs only (occupations, industries, headlines)
- **Mobile-native / Steam packaging** — web deploy only
- Backlog `docs/38_Backlog.md` status labels are **stale** (still say Planned for engines that now have v0). Prefer `docs/39_Project_Master_Index.md` §6.2 for code status.

### Depth gaps (exists but not “believable sim” yet)
- Company ops are basic (hire/product) vs Doc 06/19 (ops, fundraising, quality, competition)
- Markets lack sector cycles, margin, dividends policy depth (Doc 12)
- Education lacks full network/prestige decay (Doc 08)
- Family lacks divorce/inheritance law depth (Doc 09)
- Government/tax (Doc 13) largely missing
- CDPS personality (Doc 16) is stub-level traits, not full AI citizens
- Smartphone apps are navigation shells more than rich diegetic products

### Milestone reality
- Docs: **100% complete** (42 docs)
- Code: **M1.0 Alpha Internal ~done** (phases A–AH) with v0 systems
- Next product targets: **EA 0.5** (full loop polish + depth) → **1.0** (generational play) per roadmap

---

## 6. CURRENT GAME UI — HOW IT WORKS

### Visual identity
- Palette: navy `#0B132B`, blue `#1C2541`, emerald `#2EC4B6`, gold `#F4B400`, light gray `#F5F7FA`
- Tokens live in CSS variables — **do not hardcode hex in JSX**
- North star: *Professional at first glance. Alive on second look. Phoenix in the details.*
- Reject: cartoon mobile chrome, crypto dark-mode clichés, cluttered spreadsheet ugliness, over-gamey HUDs

### Two shell patterns
1. **LifeShell** — ambient life surfaces (Home, City, Family, etc.): identity strip (name, age, date, pause), bottom/side **LifeDock**, grain/atmosphere background  
2. **ToolShell** — diegetic pro tools (Bank, Company, Stocks, etc.): institution header, metric row, “Back to Life”, denser tool layout  

Shared primitives: `DecisionPanel`, `HistoryChart`, `CrisisModal`, `EmptyState` / `LoadingState` / `ErrorState`, motion helpers with reduced-motion support.

### UX rules (Doc 34)
- Every screen: **primary decision**, **three supporting metrics**, **context channel** (news/timeline/relationships)
- F-pattern hierarchy; information-rich, never cluttered
- North star: *Three numbers to decide. One click to act. Zero surprises in the data.*

### Navigation model
- Home is the hub → destinations (City, Career, Education, Phone, Money, Family) + dock
- Tool screens return to Home
- Life gates / crises can block time advance until resolved
- Auth-gated routes via `ProtectedRoute`

### What the UI feels like today (honest assessment)
- **Structurally correct:** diegetic shells, tokens, wired to sim, CEO-Test-ish layouts on Banking/Company
- **Still prototype-adjacent:** many screens are dense form + card stacks; City is icon districts not a world; Phone apps are thin; motion and hierarchy vary by screen
- **Main Menu** has brand + CSS skyline; OK entry, not yet a premium cinematic brand moment
- **Inconsistency risk:** some screens lean LifeShell ambient, some still feel like generic dashboard cards; polish and information hierarchy are uneven
- **Mobile:** dock + responsive layouts exist; not fully battle-tested as a primary mobile product

---

## 7. WHAT NEEDS IMPROVING (UI / UX PRIORITY GUIDANCE)

When asked to improve UI, prioritize in this order unless told otherwise:

### P0 — Clarity & CEO Test
1. Every screen: one primary decision, 3 KPIs max above the fold, clear next action  
2. Empty / loading / error / blocked-by-gate states consistent via shell primitives  
3. Numbers always trusted: currency formatting, dates, deltas with context (“why did this change?”)  
4. Life gates and crises must be unmistakable and actionable  

### P1 — Visual coherence
5. Unify LifeShell vs ToolShell usage — life moments ambient, institutions tool-dense  
6. Reduce card spam; prefer metric rows + one primary panel + one secondary context panel (Doc 34 §2.2)  
7. Strengthen brand on Main Menu / first session without cluttering Home with marketing chrome  
8. Charts and history: readable, not decorative noise  
9. Typography and spacing from theme tokens; expressive display for brand, UI font for data  

### P2 — Diegetic depth & delight
10. Smartphone apps should feel like real apps, not route stubs  
11. City map path toward spatial/Phaser world (or a stronger interim map)  
12. News/Timeline as narrative glue between systems  
13. Motion: 2–3 intentional motions per key surface; respect reduced motion  
14. Onboarding (childhood → home) should teach systems by doing, not walls of text  

### P3 — Polish & accessibility
15. Contrast, focus states, screen reader labels on time controls and dock  
16. Desktop + mobile parity for Home and Banking first  
17. Settings and Continue flows as calm, professional account management  

### Explicit anti-goals for UI work
- Do not redesign for “gamey” neon/purple aesthetics  
- Do not put business rules in React components  
- Do not invent new capitals, currencies, or win conditions  
- Do not break auth/save/simulation contracts for cosmetic changes  
- Prefer evolving existing shells over introducing a third layout system  

---

## 8. CANONICAL DOCS (READ WHEN NEEDED)

| Need | Doc |
|---|---|
| Vision & pillars | `prd/FENIX-LIFE-PRODUCT-BIBLE.md` |
| Immutable law | `docs/Fenix-Life-Design-Constitution.md` |
| Player-facing gameplay | `docs/02_Game_Design_Document.md` |
| Screen specs | `docs/34_UI_UX_Guidelines.md` |
| Visual system | `docs/32_Art_Direction.md` |
| Code status | `docs/39_Project_Master_Index.md` §6 |
| Feature inventory | `docs/38_Backlog.md` (status fields may be stale) |
| Admin rules | `docs/42_Admin_Portal_Design.md` |
| Sim architecture | `docs/Fenix-Simulation-Framework.md` |
| Domain depth | `docs/05`–`docs/13` |

---

## 9. HOW YOU SHOULD RESPOND

1. Restate which pillar(s) and capital(s) your advice serves.  
2. Separate **already built (v0)** from **missing** from **needs polish**.  
3. For UI proposals: name the screen, primary decision, three metrics, and shell (Life vs Tool).  
4. Prefer incremental upgrades to current shells/screens over greenfield redesigns.  
5. If proposing features, map to GDD loops and call out simulation ownership (`packages/domain` / `simulation-engine`) vs UI-only.  
6. Ask clarifying questions only when a product decision is truly blocked.

---

## 10. LIVE LINKS

- Game: https://fenix-life.vercel.app  
- API health: https://fenix-life-api.onrender.com/health  
- Setup: `docs/SETUP_FREE_TIER.md`  
- Glossary: `docs/41_Fenix_Glossary.md`

Acknowledge that you understand Fenix Life’s vision, current pre-alpha build, gaps, and UI improvement priorities. Wait for the user’s specific ask.

--- END PROMPT ---
