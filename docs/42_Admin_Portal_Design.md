# Fenix Life — Official Admin Portal Design Document

**Document Version:** 1.0  
**Status:** Canonical — Admin Platform Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Platform Engineering & Live Operations  
**Audience:** Engineering, Live Ops, Moderation, Support, Security, AI Assistants  

---

## Document Authority

This Admin Portal Design Document defines **the internal operations platform** for Fenix Life — accounts, moderation, saves, economy health, feature flags, and audit. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Ethical ops, no pay-to-win admin overrides |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality — admin cannot grant simulation advantages |
| [25_API_Design.md](./25_API_Design.md) | Admin REST contracts (`/v1/admin/*`) |
| [26_Save_System.md](./26_Save_System.md) | Save inspection, migration, recovery |
| [28_Project_Architecture.md](./28_Project_Architecture.md) | `apps/admin` structure |
| [36_Live_Operations.md](./36_Live_Operations.md) | Live events, balancing, incidents |
| [30_Coding_Standards.md](./30_Coding_Standards.md) | Implementation rules |

**Admin tools explain, support, and moderate — they never replace simulation integrity.**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Purpose & Scope](#2-purpose--scope)
3. [Constitutional Constraints](#3-constitutional-constraints)
4. [Architecture](#4-architecture)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Screen Catalog](#6-screen-catalog)
7. [API Integration](#7-api-integration)
8. [Audit & Compliance](#8-audit--compliance)
9. [UI/UX Guidelines](#9-uiux-guidelines)
10. [Deployment](#10-deployment)
11. [Phased Rollout](#11-phased-rollout)
12. [Acceptance Criteria](#12-acceptance-criteria)

---

# 1. Executive Summary

The **Fenix Admin Portal** (`apps/admin`) is an internal-only React application for staff to operate Fenix Life in production — without SSH, raw SQL, or save file surgery.

| Capability | Purpose |
|---|---|
| **Account search** | Support tickets, abuse investigation |
| **Save inspector** | Corruption recovery, migration debugging |
| **Moderation queue** | Reports, suspensions, appeals |
| **Economy health** | Live Ops balancing dashboards |
| **Feature flags** | Gradual rollouts, kill switches |
| **Audit log** | Compliance, incident review |

```
┌─────────────────────────────────────────────────────────────┐
│                    apps/admin (React)                        │
│  Accounts │ Moderation │ Saves │ Economy │ Flags │ Audit   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS /v1/admin/*
┌────────────────────────────▼────────────────────────────────┐
│                    API (NestJS / Express)                      │
│  AdminGuard │ AuditMiddleware │ RBAC                         │
└────────────────────────────┬────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    PostgreSQL           Redis              Blob Storage
    (accounts,           (queues,            (save blobs)
     audit log)          flags cache)
```

---

# 2. Purpose & Scope

## 2.1 In Scope (v1 Admin — M1.2 target)

- Staff login with role-based access
- Account search and detail view
- Save metadata inspection (not full world editor)
- Moderation report queue (read + action)
- Platform health dashboard (API, DB, Redis)
- Immutable audit log viewer
- Feature flag toggles (boolean flags only)

## 2.2 Out of Scope (v1)

- Editing citizen stats in live saves (forbidden — Constitution)
- Granting in-game currency or items
- Direct SQL console
- Player impersonation without audit trail
- Public access — admin is never indexed or linked from game

## 2.3 Future (v1.5+)

- Economy parameter tuning UI (with simulation sandbox)
- Live event scheduler (Doc 36)
- A/B experiment management
- Support ticket integration
- MFA enforcement (TOTP)

---

# 3. Constitutional Constraints

| Rule | Admin implication |
|---|---|
| **Citizen Equality** | Admin cannot modify player citizen stats in sovereign saves |
| **Living World** | Admin cannot pause world simulation for all players globally without maintenance mode |
| **World Memory** | Admin read access to history; writes only via support recovery workflows |
| **No pay-to-win** | Admin cannot grant DLC, currency, or competitive advantages |

**Permitted admin interventions:**

- Account suspension / unsuspension
- Save migration / restore from backup
- Moderation actions on Fenix Network content
- Feature flag rollout
- Economy **monitoring** (not arbitrary edits in v1)

---

# 4. Architecture

## 4.1 Location in Monorepo

Per [28_Project_Architecture.md](./28_Project_Architecture.md):

```
apps/
├── client/          # Player game (migrate from current /src)
├── api/             # Backend (migrate from current /api)
└── admin/           # This portal
    ├── src/
    │   ├── screens/
    │   │   ├── Login.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── accounts/
    │   │   ├── moderation/
    │   │   ├── saves/
    │   │   ├── economy-health/
    │   │   └── feature-flags/
    │   ├── components/
    │   ├── lib/
    │   │   └── admin-api.ts
    │   └── routes.tsx
    └── package.json
```

## 4.2 Shared Dependencies

| Package | Admin usage |
|---|---|
| `@fenix/ui-kit` | Tables, cards, layout (shared with client) |
| `@fenix/api-contracts` | Typed admin API client |
| `lucide-react` | Icons (consistent with game UI) |

## 4.3 Visual Identity

Admin uses a **distinct but related** palette — darker, higher information density:

| Token | Value | Use |
|---|---|---|
| `--admin-bg` | `#0B132B` | Page background |
| `--admin-surface` | `#1C2541` | Cards, panels |
| `--admin-accent` | `#2EC4B6` | Primary actions |
| `--admin-warning` | `#F4B400` | Alerts, pending items |
| `--admin-danger` | `#E63946` | Destructive actions |

Not identical to player UI — staff must never confuse admin with game.

---

# 5. Authentication & Authorization

## 5.1 Roles

| Role | Permissions |
|---|---|
| `support` | Read accounts, read saves metadata, view audit |
| `moderator` | + moderation queue actions |
| `liveops` | + feature flags, economy health read |
| `admin` | + force migrate, suspend accounts, all audit |

## 5.2 Auth Flow (v1)

1. Staff logs in with email + password (separate from player accounts OR same User table with `role` field)
2. JWT includes `roles: string[]` and `mfa: false` (MFA phase 2)
3. Every admin API call requires `Authorization: Bearer` + role check
4. Session timeout: 8 hours

## 5.3 Prisma Extension

```prisma
enum UserRole {
  PLAYER
  SUPPORT
  MODERATOR
  LIVEOPS
  ADMIN
}

// Add to User model:
role UserRole @default(PLAYER)
```

## 5.4 Admin User Bootstrap

- Seed script creates first `ADMIN` user via CLI — never hardcoded in repo
- Production admin emails configured via `ADMIN_SEED_EMAIL` env var (one-time setup)

---

# 6. Screen Catalog

## 6.1 Login (`/login`)

- Email, password, error states
- Redirect to `/dashboard` on success
- No public registration

## 6.2 Dashboard (`/dashboard`)

| Widget | Data source |
|---|---|
| API health | `GET /health` |
| Active players (24h) | `GET /v1/admin/metrics/active-players` |
| Pending moderation | `GET /v1/admin/moderation/queue` count |
| Failed saves (24h) | `GET /v1/admin/metrics/save-errors` |
| Redis / DB status | Health sub-checks |

## 6.3 Accounts (`/accounts`)

| Feature | API |
|---|---|
| Search by email, display name, ID | `GET /v1/admin/accounts?q=` |
| Account detail | `GET /v1/admin/accounts/{id}` |
| Saves list | `GET /v1/admin/accounts/{id}/saves` |
| Suspend / unsuspend | `POST /v1/admin/accounts/{id}/suspend` |

**Display:** ID, email, created, last login, save count, status badge, role.

## 6.4 Saves (`/saves/:saveId`)

| Feature | API |
|---|---|
| Metadata | `GET /v1/admin/saves/{saveId}/inspect` |
| Schema version | Display + migration status |
| Blob size, checksum | Read-only |
| Force migrate | `POST /v1/admin/saves/{saveId}/force-migrate` (admin only, confirm dialog) |
| Download metadata JSON | Export for support |

**Forbidden:** Raw edit of simulation state in v1.

## 6.5 Moderation (`/moderation`)

| Feature | API |
|---|---|
| Queue list | `GET /v1/admin/moderation/queue` |
| Report detail | `GET /v1/admin/moderation/reports/{id}` |
| Take action | `POST /v1/admin/moderation/reports/{id}/action` |
| Audit trail | `GET /v1/admin/moderation/audit` |

Actions: warn, mute, suspend, dismiss, escalate.

## 6.6 Economy Health (`/economy`)

Read-only dashboards for Live Ops:

| Panel | Source |
|---|---|
| Inflation index | Economy engine projection |
| Unemployment | Macro state |
| Sector performance | Top/bottom 5 sectors |
| Active recessions/booms | Cycle state |

API: `GET /v1/admin/economy/health`

## 6.7 Feature Flags (`/flags`)

| Feature | API |
|---|---|
| List all flags | `GET /v1/admin/feature-flags` |
| Toggle flag | `POST /v1/admin/feature-flags` |
| Change history | Audit log filter |

Example flags: `fenix_network_enabled`, `cloud_save_v2`, `maintenance_mode`.

## 6.8 Audit Log (`/audit`)

| Feature | API |
|---|---|
| Search by actor, action, date | `GET /v1/admin/audit-log` |
| Immutable display | No delete in UI |

Fields: `timestamp`, `actorId`, `action`, `resourceType`, `resourceId`, `metadata`, `ip`.

---

# 7. API Integration

All endpoints per [25_API_Design.md](./25_API_Design.md) §17.

## 7.1 Admin API Module Structure

```
api/src/
├── routes/
│   └── admin/
│       ├── index.ts
│       ├── accounts.ts
│       ├── saves.ts
│       ├── moderation.ts
│       ├── economy.ts
│       ├── feature-flags.ts
│       └── audit.ts
├── middleware/
│   ├── requireAdmin.ts
│   └── auditLog.ts
```

## 7.2 Audit Middleware

Every mutating admin request:

1. Validates role
2. Executes handler
3. Appends `AdminAuditLog` row (append-only)
4. Returns response

## 7.3 Error Responses

| Code | Meaning |
|---|---|
| 401 | Not authenticated |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | Action not allowed (e.g., suspend already suspended) |

---

# 8. Audit & Compliance

## 8.1 AdminAuditLog Table

```prisma
model AdminAuditLog {
  id           String   @id @default(cuid())
  actorId      String   @map("actor_id")
  action       String
  resourceType String   @map("resource_type")
  resourceId   String?  @map("resource_id")
  metadata     Json?
  ipAddress    String?  @map("ip_address")
  createdAt    DateTime @default(now()) @map("created_at")

  @@index([actorId])
  @@index([createdAt])
  @@map("admin_audit_logs")
}
```

## 8.2 Retention

7 years — per API Design Doc. No hard delete; archive to cold storage after 2 years.

---

# 9. UI/UX Guidelines

- **Density over decoration** — data tables, filters, export CSV
- **Confirm destructive actions** — type-to-confirm for suspend, force-migrate
- **No mobile-first** — desktop 1280px+ primary target
- **Keyboard navigation** — tab through tables, `/` to focus search
- **Loading & error states** — every screen
- **WCAG AA** — contrast on dark admin theme

Reuse shadcn components from `@fenix/ui-kit` where possible.

---

# 10. Deployment

| Environment | URL | Access |
|---|---|---|
| Local | `http://localhost:5174` | Dev only |
| Staging | `admin-staging.fenix-life.vercel.app` | Staff VPN / IP allowlist (future) |
| Production | `admin.fenixlife.com` (future) | Staff only, not public |

**v1 for solo dev:** Deploy `apps/admin` as separate Vercel project, password-protected via Vercel deployment protection OR env-gated login only.

**CORS:** Admin origin added to API `CORS_ORIGINS` on Render.

---

# 11. Phased Rollout

| Phase | Deliverable | Milestone |
|---|---|---|
| **A** | Monorepo + admin shell + login + dashboard | M1.0 |
| **B** | Accounts + saves inspect | M1.1 |
| **C** | Moderation + audit log | M1.2 |
| **D** | Feature flags + economy health | M1.5 |

---

# 12. Acceptance Criteria

| ID | Criterion |
|---|---|
| ADM-AC-001 | Non-admin JWT cannot access `/v1/admin/*` (403) |
| ADM-AC-002 | Every admin POST creates audit log entry |
| ADM-AC-003 | Account search returns results < 500ms for 10k users |
| ADM-AC-004 | Save inspect shows schema version and blob metadata |
| ADM-AC-005 | Suspend account blocks player login |
| ADM-AC-006 | Admin UI visually distinct from player game |
| ADM-AC-007 | No simulation stat editing in admin v1 |
| ADM-AC-008 | Feature flag toggle reflects in API within 30s |
| ADM-AC-009 | Moderation action updates queue count on dashboard |
| ADM-AC-010 | Admin deploys separately from player client |

---

## Revision History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-07-10 | Initial canonical admin portal spec |
