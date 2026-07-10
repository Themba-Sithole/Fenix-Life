# Fenix Life — Official API Design Document

**Document Version:** 1.0  
**Status:** Canonical — API Contract Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal API Architecture & Platform Engineering  
**Audience:** Engineering, Client, QA, Security, Live Ops, Mod Authors, Partner Integrations  

---

## Document Authority

This API Design Document defines **every public contract** between Fenix Life clients, platform services, admin tools, and approved third-party integrations. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Product vision, multiplayer philosophy, mod support |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, World Memory, Fenix Network principles |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | System architecture, services, event bus, security |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Entity shapes, save metadata, network contracts |

When API design conflicts with product philosophy, **align with philosophy first**, then document deliberate technical exceptions with rationale and migration path.

Every endpoint, WebSocket event, and schema must trace to:

1. A Product Bible pillar (§4)
2. A Design Constitution article
3. A TDD service boundary
4. A section of this document

This document does **not** contain implementation code. It defines HTTP routes, WebSocket events, request/response schemas, auth requirements, and operational policies that implementation teams must follow.

---

## Table of Contents

1. [API Philosophy](#1-api-philosophy)
2. [Base Conventions](#2-base-conventions)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Versioning & Deprecation](#4-versioning--deprecation)
5. [Error Model](#5-error-model)
6. [Rate Limiting & Quotas](#6-rate-limiting--quotas)
7. [REST API — Auth Service](#7-rest-api--auth-service)
8. [REST API — Account Service](#8-rest-api--account-service)
9. [REST API — Save Service](#9-rest-api--save-service)
10. [REST API — Fenix Network](#10-rest-api--fenix-network)
11. [REST API — Friends & Social](#11-rest-api--friends--social)
12. [REST API — Messaging](#12-rest-api--messaging)
13. [REST API — Leaderboards](#13-rest-api--leaderboards)
14. [REST API — Mod Registry](#14-rest-api--mod-registry)
15. [REST API — Moderation](#15-rest-api--moderation)
16. [REST API — Analytics Ingest](#16-rest-api--analytics-ingest)
17. [REST API — Admin Portal](#17-rest-api--admin-portal)
18. [REST API — Simulation Commands](#18-rest-api--simulation-commands)
19. [WebSocket Gateway](#19-websocket-gateway)
20. [Schema Reference](#20-schema-reference)
21. [Permission Matrix](#21-permission-matrix)
22. [OpenAPI & Code Generation](#22-openapi--code-generation)
23. [Security Requirements](#23-security-requirements)
24. [Future-Proofing](#24-future-proofing)
25. [Appendices](#25-appendices)

---

## Executive Summary

Fenix Life exposes a **versioned REST API** and a **Socket.IO WebSocket gateway** for realtime features. The API separates:

| Plane | Purpose | Primary Consumers |
|---|---|---|
| **Platform API** | Accounts, auth, saves, Fenix Network, mods | Client, admin portal |
| **Simulation Command API** | Validated commands to cloud simulation workers | Client (cloud-assisted mode) |
| **Analytics Ingest** | Privacy-gated telemetry | Client |
| **Admin API** | Moderation, support, live ops | Internal staff only |

**North-star API constraints:**

| Constraint | Source |
|---|---|
| Sovereign worlds never share mutable state via API | Product Bible §9, TDD §5 |
| All inputs validated at gateway | TDD §8.3 |
| Symmetry — no player-only simulation shortcuts in public API | Constitution Article I |
| Saves and contracts are auditable | Constitution Article V |
| Mod compatibility declared in headers and metadata | Product Bible §17 |

---

# 1. API Philosophy

## 1.1 Contract-First Design

APIs are designed **before** implementation. The OpenAPI specification in `packages/api-contracts/openapi/` is the authoritative machine-readable contract. This document is the authoritative human-readable companion.

## 1.2 REST for Commands and Queries

Fenix Life uses REST for:

- Resource-oriented CRUD (accounts, saves, friends)
- State machine transitions (transfer offers, partnership contracts)
- Paginated read models (leaderboards, news feeds, message threads)

**Rule:** Mutations that affect cross-player state **must** go through Fenix Network endpoints with server-side validation — never peer-to-peer REST.

## 1.3 WebSocket for Push

WebSocket (Socket.IO) is used for:

- Presence updates
- Realtime messaging delivery
- Async deal notifications
- Save sync status
- Moderation actions (admin)

**Rule:** WebSocket events are **notifications**, not authoritative state. Clients reconcile via REST on reconnect.

## 1.4 Idempotency

All write endpoints that can be retried accept:

```
Idempotency-Key: <uuid>
```

Server stores idempotency results for 24 hours. Duplicate keys return the original response with `200` or `201`.

## 1.5 Pagination Standard

All list endpoints use cursor pagination:

```json
{
  "data": [],
  "pagination": {
    "nextCursor": "eyJpZCI6IjEyMyJ9",
    "prevCursor": null,
    "hasMore": true,
    "totalCount": 1542
  }
}
```

Query parameters: `cursor`, `limit` (default 20, max 100), `sort` (where applicable).

## 1.6 Field Selection

Read endpoints support sparse fieldsets:

```
GET /v1/accounts/me?fields=id,displayName,avatarUrl
```

Reduces payload for mobile clients and visit projections.

---

# 2. Base Conventions

## 2.1 Base URLs

| Environment | REST Base | WebSocket |
|---|---|---|
| Production | `https://api.fenixlife.com` | `wss://api.fenixlife.com/ws` |
| Staging | `https://api.staging.fenixlife.com` | `wss://api.staging.fenixlife.com/ws` |
| Local | `http://localhost:3000` | `ws://localhost:3000/ws` |

## 2.2 URL Structure

```
https://api.fenixlife.com/v1/{service}/{resource}
https://api.fenixlife.com/v1/{service}/{resource}/{id}
https://api.fenixlife.com/v1/{service}/{resource}/{id}/{sub-resource}
```

Examples:

- `/v1/auth/login`
- `/v1/saves/{saveId}/versions`
- `/v1/network/transfers/{transferId}/accept`

## 2.3 HTTP Methods

| Method | Usage |
|---|---|
| `GET` | Safe, idempotent reads |
| `POST` | Create resources, non-idempotent actions |
| `PUT` | Full replace (rare; prefer PATCH) |
| `PATCH` | Partial update |
| `DELETE` | Soft delete where applicable |

## 2.4 Standard Headers

### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes (authenticated routes) | `Bearer <access_token>` |
| `Content-Type` | Yes (body) | `application/json` |
| `Accept` | Recommended | `application/json` |
| `X-Client-Version` | Yes | SemVer client build |
| `X-Platform` | Yes | `windows`, `macos`, `linux`, `web` |
| `X-Request-Id` | Recommended | UUID for tracing |
| `Idempotency-Key` | Writes (retryable) | UUID |
| `X-Save-Id` | Simulation commands | Active save context |
| `X-Mod-Hash` | Gameplay routes | SHA-256 of active mod manifest |

### Response Headers

| Header | Description |
|---|---|
| `X-Request-Id` | Echo or generated trace ID |
| `X-RateLimit-Limit` | Window limit |
| `X-RateLimit-Remaining` | Remaining requests |
| `X-RateLimit-Reset` | Unix timestamp |
| `Deprecation` | RFC 8594 deprecation date |
| `Sunset` | RFC 8594 sunset date |
| `Link` | Successor version relation |

## 2.5 Timestamps

All API timestamps are **ISO 8601 UTC** with millisecond precision:

```
2026-07-10T18:30:00.000Z
```

Simulation dates (in-game) use ISO date only: `2042-03-15`.

## 2.6 Identifiers

| Type | Format | Example |
|---|---|---|
| Account ID | UUID v4 | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| Save ID | UUID v4 | `f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| Citizen ID | Prefixed string | `cit_7xK9mN2pQ` |
| Company ID | Prefixed string | `co_3bR8vL1wT` |
| Transfer ID | UUID v4 | Standard UUID |
| Event ID | UUID v4 | Domain event idempotency |

## 2.7 Money & Numbers

- Monetary values: **integer minor units** (cents) in API JSON
- Display formatting is client responsibility
- Percentages: decimal `0.0`–`1.0` unless documented otherwise
- Large integers: string encoding when exceeding `2^53-1`

---

# 3. Authentication & Authorization

## 3.1 Auth Flows

### 3.1.1 Email/Password Registration

```
POST /v1/auth/register
```

### 3.1.2 Email/Password Login

```
POST /v1/auth/login
→ access_token (15 min) + refresh_token (30 days, rotating)
```

### 3.1.3 Refresh Token Rotation

```
POST /v1/auth/refresh
→ new access_token + new refresh_token (old invalidated)
```

### 3.1.4 OAuth Providers (Phase 2)

| Provider | Route |
|---|---|
| Steam | `POST /v1/auth/oauth/steam` |
| Google | `POST /v1/auth/oauth/google` |
| Apple | `POST /v1/auth/oauth/apple` |

### 3.1.5 Save-Scoped Tokens

Short-lived tokens for blob upload/download without full session:

```
POST /v1/saves/{saveId}/sync-token
→ { "token": "...", "expiresAt": "...", "scopes": ["save:read", "save:write"] }
```

## 3.2 JWT Claims

```json
{
  "sub": "account-uuid",
  "email": "player@example.com",
  "roles": ["player"],
  "iat": 1720634400,
  "exp": 1720635300,
  "jti": "token-uuid"
}
```

Admin tokens include `roles: ["moderator"]` or `["admin"]` and require MFA claim `mfa: true`.

## 3.3 Role-Based Access Control

| Role | Scope |
|---|---|
| `player` | Own account, saves, network features |
| `moderator` | Reports, user sanctions (limited) |
| `admin` | Full platform admin, save inspection |
| `service` | Machine-to-machine internal calls |

## 3.4 Permission Scopes (OAuth-style, future)

| Scope | Grants |
|---|---|
| `account:read` | Read own profile |
| `account:write` | Update profile |
| `save:read` | Download save blobs |
| `save:write` | Upload save blobs |
| `network:transfer` | Initiate Fenix Network transfers |
| `mods:publish` | Upload mod manifests |

---

# 4. Versioning & Deprecation

## 4.1 URL Versioning

Major API versions in path: `/v1/`, `/v2/`.

Breaking changes require new major version. Non-breaking additions ship in current version.

## 4.2 Breaking vs Non-Breaking

| Breaking | Non-Breaking |
|---|---|
| Remove field | Add optional field |
| Change field type | Add endpoint |
| Change auth requirements | Add enum value (if clients tolerate unknown) |
| Rename field | Add response header |
| Change error code semantics | Deprecation header on old field |

## 4.3 Deprecation Policy

- Minimum **2 major versions** overlap (TDD §12.8)
- `Deprecation` and `Sunset` headers on deprecated endpoints
- Changelog in `docs/api/CHANGELOG.md`
- Client SDK warns in dev builds when deprecated routes used

## 4.4 Schema Versioning (Saves)

Independent from API version. See [26_Save_System.md](./26_Save_System.md).

---

# 5. Error Model

## 5.1 Error Response Shape

```json
{
  "error": {
    "code": "SAVE_CHECKSUM_MISMATCH",
    "message": "Save blob failed integrity check.",
    "details": [
      { "field": "checksum", "issue": "expected abc, got def" }
    ],
    "requestId": "req-uuid",
    "documentationUrl": "https://docs.fenixlife.com/errors/SAVE_CHECKSUM_MISMATCH"
  }
}
```

## 5.2 HTTP Status Codes

| Status | Usage |
|---|---|
| `200` | Success |
| `201` | Created |
| `204` | Success, no body |
| `400` | Validation error |
| `401` | Unauthenticated |
| `403` | Forbidden |
| `404` | Not found |
| `409` | Conflict (version, state) |
| `422` | Semantic validation |
| `429` | Rate limited |
| `500` | Server error |
| `503` | Maintenance / overloaded |

## 5.3 Error Code Catalog

| Code | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input failed schema validation |
| `UNAUTHENTICATED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `ACCOUNT_SUSPENDED` | 403 | Account banned or suspended |
| `SAVE_NOT_FOUND` | 404 | Save ID invalid or not owned |
| `SAVE_CHECKSUM_MISMATCH` | 409 | Blob integrity failure |
| `SAVE_VERSION_CONFLICT` | 409 | Concurrent sync conflict |
| `MOD_INCOMPATIBLE` | 422 | Mod set incompatible with action |
| `TRANSFER_LIMIT_EXCEEDED` | 422 | Fenix Network velocity cap |
| `TRANSFER_RELATIONSHIP_TOO_NEW` | 422 | Relationship age gate |
| `CONTRACT_STATE_INVALID` | 422 | Invalid state transition |
| `RATE_LIMITED` | 429 | Too many requests |
| `MAINTENANCE_MODE` | 503 | Platform maintenance |

---

# 6. Rate Limiting & Quotas

## 6.1 Default Limits (per account, per minute)

| Endpoint Group | Limit |
|---|---|
| Auth (login) | 10 |
| Auth (register) | 5 |
| Read (general) | 300 |
| Write (general) | 60 |
| Save upload | 10 |
| Messaging (new threads) | 30 |
| Transfers | 20 |
| Analytics ingest | 120 |

## 6.2 Quotas

| Resource | Free Tier | Premium |
|---|---|---|
| Cloud save slots | 3 | 10 |
| Save blob size | 50 MB compressed | 100 MB |
| Cloud versions retained | 5 | 20 |
| Mod subscriptions | 50 | 200 |

---

# 7. REST API — Auth Service

**Base path:** `/v1/auth`

## 7.1 Endpoint Table

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | None | Create account |
| `POST` | `/login` | None | Obtain tokens |
| `POST` | `/refresh` | Refresh token | Rotate tokens |
| `POST` | `/logout` | Bearer | Invalidate refresh token |
| `POST` | `/forgot-password` | None | Send reset email |
| `POST` | `/reset-password` | Reset token | Set new password |
| `POST` | `/verify-email` | Verify token | Confirm email |
| `POST` | `/resend-verification` | Bearer | Resend verification |
| `GET` | `/sessions` | Bearer | List active sessions |
| `DELETE` | `/sessions/{sessionId}` | Bearer | Revoke session |
| `POST` | `/mfa/enroll` | Bearer | Start MFA setup |
| `POST` | `/mfa/verify` | Bearer | Confirm MFA |
| `DELETE` | `/mfa` | Bearer + MFA | Disable MFA |

## 7.2 Request/Response Schemas

### POST /register

**Request:**

```json
{
  "email": "player@example.com",
  "password": "SecureP@ssw0rd!",
  "displayName": "Alex Chen",
  "dateOfBirth": "1990-01-15",
  "acceptTerms": true,
  "marketingOptIn": false
}
```

**Response `201`:**

```json
{
  "account": {
    "id": "uuid",
    "email": "player@example.com",
    "displayName": "Alex Chen",
    "emailVerified": false,
    "createdAt": "2026-07-10T18:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  }
}
```

### POST /login

**Request:**

```json
{
  "email": "player@example.com",
  "password": "SecureP@ssw0rd!",
  "mfaCode": "123456"
}
```

**Response `200`:** Same token shape as register.

---

# 8. REST API — Account Service

**Base path:** `/v1/accounts`

## 8.1 Endpoint Table

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/me` | Bearer | Current account profile |
| `PATCH` | `/me` | Bearer | Update profile |
| `DELETE` | `/me` | Bearer + MFA | Request account deletion |
| `GET` | `/me/preferences` | Bearer | Game and privacy preferences |
| `PATCH` | `/me/preferences` | Bearer | Update preferences |
| `GET` | `/me/privacy` | Bearer | Privacy settings |
| `PATCH` | `/me/privacy` | Bearer | Update privacy flags |
| `GET` | `/me/subscription` | Bearer | Premium status |
| `POST` | `/me/export` | Bearer | GDPR data export request |
| `GET` | `/me/export/{exportId}` | Bearer | Download export status |
| `GET` | `/{accountId}/public` | Bearer | Public profile (redacted) |

## 8.2 Profile Schema

```json
{
  "id": "uuid",
  "displayName": "Alex Chen",
  "avatarUrl": "https://cdn.fenixlife.com/avatars/uuid.png",
  "bio": "Serial entrepreneur. Third generation.",
  "createdAt": "2026-07-10T18:00:00.000Z",
  "legacyScore": 8420,
  "privacy": {
    "showNetWorth": "band",
    "showCompanies": true,
    "showAchievements": true,
    "allowVisits": "friends",
    "allowTransfers": "friends"
  },
  "verifiedMetrics": {
    "netWorthBand": "$10M–$50M",
    "companiesFounded": 3,
    "badge": "cloud_validated"
  }
}
```

## 8.3 Preferences Schema

```json
{
  "offlineProgression": true,
  "cloudSync": true,
  "autosaveInterval": "monthly_tick",
  "notificationLevel": "important",
  "telemetryOptIn": true,
  "difficulty": "standard",
  "timeSpeedDefault": "1x",
  "language": "en-US",
  "accessibility": {
    "reduceMotion": false,
    "highContrast": false,
    "fontScale": 1.0
  }
}
```

---

# 9. REST API — Save Service

**Base path:** `/v1/saves`

Critical companion: [26_Save_System.md](./26_Save_System.md)

## 9.1 Endpoint Table

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Bearer | List saves for account |
| `POST` | `/` | Bearer | Create new save slot |
| `GET` | `/{saveId}` | Bearer | Save metadata |
| `PATCH` | `/{saveId}` | Bearer | Update slot name, settings |
| `DELETE` | `/{saveId}` | Bearer | Soft delete save |
| `POST` | `/{saveId}/sync-token` | Bearer | Short-lived blob token |
| `GET` | `/{saveId}/download` | Save token | Download blob (redirect or stream) |
| `POST` | `/{saveId}/upload` | Save token | Initiate multipart upload |
| `POST` | `/{saveId}/upload/complete` | Save token | Finalize upload |
| `GET` | `/{saveId}/versions` | Bearer | List cloud versions |
| `POST` | `/{saveId}/versions/{versionId}/restore` | Bearer | Restore version |
| `GET` | `/{saveId}/conflicts` | Bearer | List sync conflicts |
| `POST` | `/{saveId}/conflicts/{conflictId}/resolve` | Bearer | Resolve conflict |
| `POST` | `/{saveId}/migrate` | Bearer | Trigger schema migration |
| `GET` | `/{saveId}/migrate/{jobId}` | Bearer | Migration job status |
| `GET` | `/{saveId}/digest` | Bearer | While-you-were-away summary |
| `POST` | `/{saveId}/verify` | Bearer | Checksum validation |

## 9.2 Save Metadata Schema

```json
{
  "id": "uuid",
  "slotName": "Chen Dynasty — Gen 3",
  "accountId": "uuid",
  "worldInstanceId": "uuid",
  "schemaVersion": 12,
  "currentSimulationDate": "2042-03-15",
  "heirGeneration": 3,
  "playtimeSeconds": 145800,
  "checksum": "sha256:abc...",
  "compressedSizeBytes": 8388608,
  "modManifestHash": "sha256:def...",
  "lastPlayedAt": "2026-07-10T17:45:00.000Z",
  "lastSyncedAt": "2026-07-10T17:46:00.000Z",
  "cloudVersion": 47,
  "localVersion": 47,
  "syncStatus": "synced",
  "difficulty": "standard"
}
```

## 9.3 Upload Flow

1. `POST /{saveId}/upload` → `{ uploadId, parts: [{ partNumber, uploadUrl }] }`
2. Client PUTs 4MB chunks to Azure presigned URLs
3. `POST /{saveId}/upload/complete` → `{ versionId, checksum }`
4. Server validates, stores metadata, enqueues projection rebuild

## 9.4 Conflict Resolution

**Response `409 SAVE_VERSION_CONFLICT`:**

```json
{
  "error": { "code": "SAVE_VERSION_CONFLICT", "message": "..." },
  "conflict": {
    "id": "conflict-uuid",
    "localVersion": 48,
    "cloudVersion": 47,
    "localChecksum": "sha256:...",
    "cloudChecksum": "sha256:...",
    "strategies": ["keep_local", "keep_cloud", "keep_both_branch"]
  }
}
```

---

# 10. REST API — Fenix Network

**Base path:** `/v1/network`

Aligned with Product Bible §9 and Constitution Article VIII.

## 10.1 Transfers

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/transfers` | Bearer | List transfers (in/out) |
| `POST` | `/transfers` | Bearer | Initiate gift/transfer |
| `GET` | `/transfers/{id}` | Bearer | Transfer detail |
| `POST` | `/transfers/{id}/accept` | Bearer | Accept incoming |
| `POST` | `/transfers/{id}/decline` | Bearer | Decline incoming |
| `POST` | `/transfers/{id}/cancel` | Bearer | Cancel outgoing pending |

### POST /transfers

**Request:**

```json
{
  "toAccountId": "uuid",
  "saveId": "uuid",
  "type": "gift_cash",
  "amountMinor": 500000,
  "currency": "USD",
  "message": "Congratulations on the IPO!",
  "simulationDate": "2042-03-15"
}
```

**Transfer types:** `gift_cash`, `gift_item`, `investment_offer`, `loan_offer`

## 10.2 Partnerships

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/partnerships` | Bearer | List partnerships |
| `POST` | `/partnerships` | Bearer | Propose partnership |
| `GET` | `/partnerships/{id}` | Bearer | Contract detail |
| `PATCH` | `/partnerships/{id}` | Bearer | Counter-offer terms |
| `POST` | `/partnerships/{id}/sign` | Bearer | Sign contract |
| `POST` | `/partnerships/{id}/terminate` | Bearer | Initiate termination |
| `GET` | `/partnerships/{id}/events` | Bearer | Contract event log |

### Partnership Contract Schema

```json
{
  "id": "uuid",
  "status": "pending_signature",
  "type": "revenue_share",
  "parties": [
    { "accountId": "uuid", "companyId": "co_abc", "role": "operator" },
    { "accountId": "uuid", "companyId": "co_def", "role": "investor" }
  ],
  "terms": {
    "revenueSharePercent": 0.15,
    "durationMonths": 60,
    "exitClause": "buyout_at_fair_value",
    "minimumInvestmentMinor": 1000000
  },
  "signatures": [],
  "createdAt": "2026-07-10T18:00:00.000Z",
  "effectiveSimulationDate": null
}
```

## 10.3 Investments

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/investments` | Bearer | Portfolio of cross-player stakes |
| `POST` | `/investments/offers` | Bearer | Create investment offer |
| `POST` | `/investments/offers/{id}/accept` | Bearer | Accept offer |
| `GET` | `/investments/{id}` | Bearer | Stake detail |
| `GET` | `/investments/{id}/dividends` | Bearer | Dividend history |

## 10.4 Visits

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/visits/{accountId}` | Bearer | Presentation DTO for visit |
| `GET` | `/visits/{accountId}/companies` | Bearer | Public company list |
| `GET` | `/visits/{accountId}/timeline` | Bearer | Public timeline cards |

**Visit DTO** is read-only, field-redacted per privacy settings, CDN-cached 5 minutes.

## 10.5 Public Companies

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/companies` | Bearer | Search public companies |
| `GET` | `/companies/{companyId}` | Bearer | Public filing summary |
| `GET` | `/companies/{companyId}/filings` | Bearer | Quarterly reports |

---

# 11. REST API — Friends & Social

**Base path:** `/v1/friends`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Bearer | Friend list |
| `POST` | `/requests` | Bearer | Send friend request |
| `GET` | `/requests/incoming` | Bearer | Incoming requests |
| `GET` | `/requests/outgoing` | Bearer | Outgoing requests |
| `POST` | `/requests/{id}/accept` | Bearer | Accept request |
| `POST` | `/requests/{id}/decline` | Bearer | Decline request |
| `DELETE` | `/{friendId}` | Bearer | Remove friend |
| `POST` | `/blocks` | Bearer | Block account |
| `GET` | `/blocks` | Bearer | Block list |
| `DELETE` | `/blocks/{accountId}` | Bearer | Unblock |
| `GET` | `/presence` | Bearer | Friends online status |

### Friend Schema

```json
{
  "accountId": "uuid",
  "displayName": "Jordan Lee",
  "avatarUrl": "https://...",
  "relationshipAgeDays": 412,
  "since": "2025-05-24T10:00:00.000Z",
  "presence": "online",
  "lastSeenAt": "2026-07-10T17:50:00.000Z"
}
```

---

# 12. REST API — Messaging

**Base path:** `/v1/messages`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/threads` | Bearer | List threads |
| `POST` | `/threads` | Bearer | Create thread |
| `GET` | `/threads/{threadId}` | Bearer | Thread detail + messages |
| `POST` | `/threads/{threadId}/messages` | Bearer | Send message |
| `PATCH` | `/threads/{threadId}/read` | Bearer | Mark read |
| `POST` | `/threads/{threadId}/report` | Bearer | Report thread |
| `DELETE` | `/messages/{messageId}` | Bearer | Delete own message (soft) |

### Message Schema

```json
{
  "id": "uuid",
  "threadId": "uuid",
  "senderAccountId": "uuid",
  "body": "Want to discuss the partnership terms?",
  "attachments": [],
  "createdAt": "2026-07-10T18:00:00.000Z",
  "editedAt": null,
  "moderationStatus": "approved"
}
```

Content passes moderation pipeline before delivery. Flagged messages return `202 Accepted` with pending status.

---

# 13. REST API — Leaderboards

**Base path:** `/v1/leaderboards`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/{seasonId}/{category}` | Bearer | Ranked entries |
| `GET` | `/{seasonId}/{category}/me` | Bearer | Player rank |
| `GET` | `/seasons` | Bearer | Active and past seasons |

### Categories

| Category | Constitution Capital | Score Source |
|---|---|---|
| `financial` | Financial Capital | Verified net worth band |
| `legacy` | Legacy Capital | Legacy score |
| `business` | Business Capital | Company valuation aggregate |
| `social` | Social Capital | Relationship + philanthropy |
| `human` | Human Capital | Skills + education (phase 2) |

### Leaderboard Entry Schema

```json
{
  "rank": 42,
  "accountId": "uuid",
  "displayName": "Alex Chen",
  "score": 9842000,
  "scoreLabel": "$9.8M net worth",
  "verified": true,
  "modProfile": "vanilla"
}
```

Mod profiles: `vanilla`, `modded` (separate namespaces per TDD §5.3).

---

# 14. REST API — Mod Registry

**Base path:** `/v1/mods`

Companion: [27_Mod_Framework.md](./27_Mod_Framework.md)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Bearer | Browse/search mods |
| `GET` | `/{modId}` | Bearer | Mod detail |
| `GET` | `/{modId}/versions` | Bearer | Version history |
| `GET` | `/{modId}/versions/{versionId}/manifest` | Bearer | Download manifest |
| `GET` | `/{modId}/versions/{versionId}/download` | Bearer | Download package |
| `POST` | `/` | Bearer | Publish mod (creator) |
| `POST` | `/{modId}/versions` | Bearer | Upload new version |
| `POST` | `/{modId}/subscribe` | Bearer | Subscribe to mod |
| `DELETE` | `/{modId}/subscribe` | Bearer | Unsubscribe |
| `GET` | `/subscriptions` | Bearer | Player mod list |
| `POST` | `/workshop/sync` | Bearer | Steam Workshop sync |
| `GET` | `/compatibility` | Bearer | Check mod set compatibility |

### Mod Manifest Schema (summary)

```json
{
  "id": "mod-uuid",
  "name": "Healthcare Expansion",
  "version": "2.1.0",
  "author": "FenixModding",
  "minEngineVersion": "1.0.0",
  "maxEngineVersion": "2.0.0",
  "apiTier": "stable",
  "dependencies": [{ "modId": "core-industries", "version": "^1.0.0" }],
  "hooks": ["industries/healthcare", "careers/nurse"],
  "signature": "ed25519:...",
  "contentHash": "sha256:..."
}
```

---

# 15. REST API — Moderation

**Base path:** `/v1/moderation` (player) and `/v1/admin/moderation` (staff)

### Player Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/reports` | Bearer | Submit report |
| `GET` | `/reports/mine` | Bearer | Own report status |

### Admin Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/moderation/queue` | Admin | Pending queue |
| `GET` | `/admin/moderation/reports/{id}` | Admin | Report detail |
| `POST` | `/admin/moderation/reports/{id}/action` | Admin | Take action |
| `POST` | `/admin/moderation/accounts/{id}/suspend` | Admin | Suspend account |
| `POST` | `/admin/moderation/accounts/{id}/unsuspend` | Admin | Lift suspension |
| `GET` | `/admin/moderation/audit` | Admin | Audit log |

---

# 16. REST API — Analytics Ingest

**Base path:** `/v1/analytics`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/events` | Bearer | Batch telemetry events |
| `POST` | `/events/anonymous` | None | Pre-auth funnel only |

### Event Batch Schema

```json
{
  "events": [
    {
      "name": "session.start",
      "timestamp": "2026-07-10T18:00:00.000Z",
      "sessionId": "uuid",
      "properties": {
        "clientVersion": "1.0.0",
        "platform": "windows",
        "modHash": "sha256:..."
      }
    }
  ]
}
```

**Forbidden properties:** citizen names, exact net worth, message content, family PII.

---

# 17. REST API — Admin Portal

**Base path:** `/v1/admin`  
**Auth:** Admin role + MFA required

| Method | Path | Description |
|---|---|---|
| `GET` | `/accounts` | Search accounts |
| `GET` | `/accounts/{id}` | Account detail |
| `GET` | `/saves/{saveId}/inspect` | Save metadata + blob info |
| `POST` | `/saves/{saveId}/force-migrate` | Trigger migration |
| `GET` | `/economy/health` | Live economy dashboard |
| `POST` | `/feature-flags` | Update feature flags |
| `GET` | `/audit-log` | Platform audit log |

All admin actions append to immutable audit log (7-year retention).

---

# 18. REST API — Simulation Commands

**Base path:** `/v1/simulation`

Used when cloud-assisted simulation is enabled. Commands are validated against current save state machine.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/commands` | Bearer + Save | Submit command batch |
| `GET` | `/commands/{batchId}` | Bearer + Save | Batch status |
| `POST` | `/catch-up` | Bearer + Save | Request offline catch-up |
| `GET` | `/catch-up/{jobId}` | Bearer + Save | Catch-up job status |
| `GET` | `/state/summary` | Bearer + Save | Lightweight state summary |

### Command Batch Schema

```json
{
  "saveId": "uuid",
  "fromSimulationDate": "2042-03-01",
  "toSimulationDate": "2042-04-01",
  "commands": [
    {
      "type": "company.set_budget",
      "aggregateId": "co_abc",
      "payload": { "departmentId": "dept_rnd", "amountMinor": 500000 },
      "idempotencyKey": "uuid"
    }
  ]
}
```

---

# 19. WebSocket Gateway

**Namespace:** `/ws`  
**Protocol:** Socket.IO v4  
**Transport:** WebSocket preferred, polling fallback

## 19.1 Connection

```javascript
const socket = io('wss://api.fenixlife.com/ws', {
  auth: { token: accessToken },
  query: { clientVersion: '1.0.0', platform: 'windows' }
});
```

## 19.2 Client → Server Events

| Event | Payload | Description |
|---|---|---|
| `presence:subscribe` | `{ friendIds: string[] }` | Subscribe to friend presence |
| `presence:heartbeat` | `{}` | Keep-alive (30s interval) |
| `thread:subscribe` | `{ threadId: string }` | Subscribe to thread updates |
| `thread:unsubscribe` | `{ threadId: string }` | Unsubscribe |
| `save:subscribe` | `{ saveId: string }` | Sync status updates |
| `typing:start` | `{ threadId: string }` | Typing indicator |
| `typing:stop` | `{ threadId: string }` | Stop typing |

## 19.3 Server → Client Events

| Event | Payload | Description |
|---|---|---|
| `connected` | `{ sessionId, serverTime }` | Connection acknowledged |
| `presence:update` | `{ accountId, status, lastSeenAt }` | Friend presence change |
| `message:new` | `Message` | New message in subscribed thread |
| `message:moderated` | `{ messageId, status }` | Moderation result |
| `transfer:received` | `Transfer` | Incoming transfer notification |
| `transfer:status` | `{ transferId, status }` | Transfer state change |
| `partnership:update` | `Partnership` | Contract state change |
| `friend:request` | `FriendRequest` | Incoming friend request |
| `save:sync_status` | `{ saveId, status, version }` | Cloud sync progress |
| `save:migration_progress` | `{ saveId, jobId, percent }` | Migration progress |
| `notification:push` | `Notification` | Generic platform notification |
| `maintenance:scheduled` | `{ startsAt, durationMinutes }` | Maintenance warning |
| `session:revoked` | `{ reason }` | Force disconnect |

## 19.4 WebSocket Error Events

| Event | Payload |
|---|---|
| `error:auth` | `{ code: 'UNAUTHENTICATED', message }` |
| `error:rate_limit` | `{ code: 'RATE_LIMITED', retryAfterMs }` |
| `error:forbidden` | `{ code: 'FORBIDDEN', message }` |

## 19.5 Reconnection Strategy

1. Client stores last `message:new` cursor per thread
2. On reconnect, REST `GET /threads/{id}?since=cursor` backfills missed messages
3. Exponential backoff: 1s, 2s, 4s, 8s, max 30s
4. After 5 minutes offline, full REST reconciliation

## 19.6 Horizontal Scaling

Socket.IO uses Redis adapter. Sticky sessions optional. Room membership:

- `account:{accountId}` — personal notifications
- `thread:{threadId}` — messaging
- `save:{saveId}` — sync status (owner only)

---

# 20. Schema Reference

## 20.1 Common Types

```typescript
// Conceptual — generated types live in @fenix/api-contracts

type UUID = string;
type ISODateTime = string;
type ISODate = string;
type MoneyMinor = number;
type Checksum = `sha256:${string}`;
type AccountId = UUID;
type SaveId = UUID;
```

## 20.2 Pagination

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount?: number;
  };
}
```

## 20.3 Domain Event (API exposure)

Events exposed via REST for debugging/admin only:

```json
{
  "eventId": "uuid",
  "eventType": "company.ipo",
  "aggregateId": "co_abc",
  "aggregateType": "Company",
  "worldInstanceId": "uuid",
  "simulationTime": "2042-03-15",
  "realTime": "2026-07-10T18:00:00.000Z",
  "schemaVersion": 3,
  "payload": { "ticker": "CHEN", "valuationMinor": 5000000000 }
}
```

---

# 21. Permission Matrix

| Resource | Player (own) | Player (other) | Moderator | Admin |
|---|---|---|---|---|
| Account profile | R/W | R (public fields) | R | R/W |
| Save metadata | R/W | — | — | R |
| Save blob | R/W | — | — | R (audit) |
| Friends | R/W | — | R (reports) | R |
| Messages | R/W (own threads) | — | R (flagged) | R |
| Transfers | R/W (party) | — | R | R/W |
| Leaderboards | R | R | R | R/W |
| Mods | R/W (own mods) | R | R | R/W |
| Admin endpoints | — | — | Partial | Full |

---

# 22. OpenAPI & Code Generation

## 22.1 Pipeline

```
NestJS Controllers → Swagger decorators → openapi.yaml → CI validate
                                                      ↓
                              @fenix/api-contracts (typescript-fetch)
                              Client SDK generation
```

## 22.2 CI Requirements

- OpenAPI diff on PR (breaking change detection)
- Contract tests must pass against generated types
- WebSocket events documented in `docs/api/websocket-events.yaml` (asyncapi)

## 22.3 Client SDK

`@fenix/client-sdk` wraps:

- Token refresh
- Idempotency key injection
- Retry with backoff (idempotent GETs only)
- Save upload multipart orchestration

---

# 23. Security Requirements

## 23.1 Transport

- TLS 1.3 minimum
- HSTS enabled
- Certificate pinning in mobile clients (phase 2)

## 23.2 Input Validation

- JSON Schema validation at gateway
- Max body size: 1 MB (except upload initiation)
- SQL injection prevention via Prisma parameterized queries
- XSS prevention — no HTML in user-generated API fields

## 23.3 CORS

| Origin | Allowed |
|---|---|
| `https://play.fenixlife.com` | Yes |
| `https://admin.fenixlife.com` | Yes (admin routes) |
| Local dev origins | Staging only |

## 23.4 Webhook Signatures (future)

```
X-Fenix-Signature: sha256=...
X-Fenix-Timestamp: ...
```

---

# 24. Future-Proofing

## 24.1 Planned v2 Additions

| Feature | v2 Route |
|---|---|
| GraphQL read layer | `/v2/graphql` (read-only projections) |
| Co-op companies | `/v2/network/co-op-companies` |
| OAuth device flow | `/v2/auth/device` |
| Webhook subscriptions | `/v2/webhooks` |

## 24.2 API Stability for Mods

Mod-facing stable hooks documented separately in Mod SDK. Platform API changes do not break mod data packs.

---

# 25. Appendices

## A. Complete Endpoint Index

| # | Method | Path | Service |
|---|---|---|---|
| 1 | POST | /v1/auth/register | Auth |
| 2 | POST | /v1/auth/login | Auth |
| 3 | POST | /v1/auth/refresh | Auth |
| 4 | POST | /v1/auth/logout | Auth |
| 5 | POST | /v1/auth/forgot-password | Auth |
| 6 | POST | /v1/auth/reset-password | Auth |
| 7 | GET | /v1/accounts/me | Account |
| 8 | PATCH | /v1/accounts/me | Account |
| 9 | GET | /v1/saves | Save |
| 10 | POST | /v1/saves | Save |
| 11 | GET | /v1/saves/{id} | Save |
| 12 | POST | /v1/saves/{id}/upload | Save |
| 13 | GET | /v1/saves/{id}/versions | Save |
| 14 | POST | /v1/network/transfers | Network |
| 15 | GET | /v1/network/partnerships | Network |
| 16 | POST | /v1/network/partnerships | Network |
| 17 | GET | /v1/network/visits/{accountId} | Network |
| 18 | GET | /v1/friends | Friends |
| 19 | POST | /v1/friends/requests | Friends |
| 20 | GET | /v1/messages/threads | Messaging |
| 21 | POST | /v1/messages/threads/{id}/messages | Messaging |
| 22 | GET | /v1/leaderboards/{season}/{category} | Leaderboards |
| 23 | GET | /v1/mods | Mods |
| 24 | POST | /v1/mods/{id}/subscribe | Mods |
| 25 | POST | /v1/analytics/events | Analytics |
| 26 | POST | /v1/simulation/commands | Simulation |
| 27 | POST | /v1/moderation/reports | Moderation |

*Full index maintained in OpenAPI spec — 120+ routes at launch.*

## B. Cross-Reference Index

| This Document | TDD | Product Bible |
|---|---|---|
| §9 Save API | §7 | §15 |
| §10 Fenix Network | §5 | §9 |
| §14 Mod Registry | §9 | §17 |
| §19 WebSocket | §1.2.8 | §9 |

## C. Glossary

| Term | Definition |
|---|---|
| **Presentation DTO** | Read-only projection for visits |
| **Save token** | Short-lived scoped JWT for blob I/O |
| **Fenix Network** | Cross-player social and contract platform |
| **Mod hash** | SHA-256 of active mod manifest set |

## D. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Platform Engineering | Initial canonical release |

---

*End of Fenix Life API Design Document v1.0*
