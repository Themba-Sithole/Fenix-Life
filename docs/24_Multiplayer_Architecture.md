# Fenix Life — Multiplayer Architecture (FMA)

**Document Version:** 1.0  
**Status:** Canonical — Fenix Network & Platform Social Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal Platform Architect & Security Engineering Lead  
**Audience:** Engineering, DevOps, Security, Game Design, Live Ops, QA, Data, Legal  

---

## Document Authority

The Fenix Multiplayer Architecture (FMA) defines **how sovereign Fenix Life worlds connect through the Fenix Network** without compromising simulation integrity, progression fairness, or Citizen Equality. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Multiplayer philosophy (§9), community pillars |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Multiplayer Philosophy (Article VIII), World Memory, Citizen Equality |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Platform architecture (§1), Multiplayer (§5), Save (§7), Security (§8) |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Multiplayer data (§7), save system (§8), two-plane model |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Multiplayer Engine (§4.21), sovereignty rules, outbox |
| [21_Event_System.md](./21_Event_System.md) | Network events vs domain events |

**Sovereignty axiom:** Each player owns one **authoritative WorldInstance**. The Fenix Network is a **contract layer** between instances—it never becomes a second simulation authority inside a peer's world.

**What the FMA is:**

- The **Fenix Network platform architecture**—friends, messaging, contracts, profiles, leaderboards
- The **cloud save and cross-device sync** design
- The **privacy, anti-cheat, and anti-abuse** framework for social-economic touchpoints
- The **async integration boundary** between platform services and sovereign simulation

**What the FMA is not:**

- A shared persistent MMO world
- Real-time synchronized cohabitation simulation (v1)
- Direct peer-to-peer save mutation
- A replacement for in-world relationship systems (those remain simulation-local)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Multiplayer Philosophy](#2-multiplayer-philosophy)
3. [Two-Plane Architecture](#3-two-plane-architecture)
4. [Fenix Network Platform](#4-fenix-network-platform)
5. [Cloud Save System](#5-cloud-save-system)
6. [Friends & Social Graph](#6-friends--social-graph)
7. [Messaging & Notifications](#7-messaging--notifications)
8. [Public Profiles & Visits](#8-public-profiles--visits)
9. [Business Partnerships](#9-business-partnerships)
10. [Cross-Player Investments](#10-cross-player-investments)
11. [Gifts & Economic Transfers](#11-gifts--economic-transfers)
12. [Leaderboards & Seasons](#12-leaderboards--seasons)
13. [Privacy & Data Governance](#13-privacy--data-governance)
14. [Anti-Cheat & Anti-Abuse](#14-anti-cheat--anti-abuse)
15. [Realtime & Presence](#15-realtime--presence)
16. [Integration with Simulation](#16-integration-with-simulation)
17. [Scalability & Reliability](#17-scalability--reliability)
18. [Security Architecture](#18-security-architecture)
19. [Future Roadmap](#19-future-roadmap)
20. [Governance & Evolution](#20-governance--evolution)

---

# 1. Executive Summary

Fenix Life multiplayer strengthens **community** without breaking **progression fairness**. Players live in private sovereign worlds that advance offline, obey Citizen Equality, and accumulate World Memory across decades. The Fenix Network layers **opt-in social and economic touchpoints** on top—friends, visits, messaging, partnerships, investments, and leaderboards—through **server-authoritative contracts** that each world applies locally.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FENIX MULTIPLAYER ARCHITECTURE (FMA)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                              ┌─────────────────┐       │
│  │  WorldInstance A │                              │  WorldInstance B │       │
│  │  (Sovereign)     │                              │  (Sovereign)     │       │
│  │  ┌─────────────┐ │                              │ ┌─────────────┐ │       │
│  │  │ Simulation  │ │                              │ │ Simulation  │ │       │
│  │  │ + Event Log │ │                              │ │ + Event Log │ │       │
│  │  └──────┬──────┘ │                              │ └──────┬──────┘ │       │
│  │         │ Outbox │                              │ Outbox │         │       │
│  └─────────┼────────┘                              └────────┼────────┘       │
│            │                                                │                │
│            └────────────────────┬───────────────────────────┘                │
│                                 ▼                                            │
│              ┌──────────────────────────────────────────┐                   │
│              │           FENIX NETWORK PLATFORM          │                   │
│              │  ┌────────┐ ┌────────┐ ┌────────┐        │                   │
│              │  │Contract│ │Transfer│ │Profile │        │                   │
│              │  │Service │ │Service │ │Service │        │                   │
│              │  └────────┘ └────────┘ └────────┘        │                   │
│              │  ┌────────┐ ┌────────┐ ┌────────┐        │                   │
│              │  │Friends │ │Message │ │Leader- │        │                   │
│              │  │Graph   │ │Service │ │board   │        │                   │
│              │  └────────┘ └────────┘ └────────┘        │                   │
│              │  ┌────────┐ ┌────────┐ ┌────────┐        │                   │
│              │  │Moderate│ │ Save   │ │ Anti-  │        │                   │
│              │  │        │ │ Sync   │ │ Abuse  │        │                   │
│              │  └────────┘ └────────┘ └────────┘        │                   │
│              └──────────────────┬───────────────────────┘                   │
│                                 ▼                                            │
│              ┌──────────────────────────────────────────┐                   │
│              │ PostgreSQL │ Redis │ Azure Blob │ Socket.IO│                   │
│              └──────────────────────────────────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core principles (Constitution Article VIII):**

| Principle | Implementation |
|---|---|
| Sovereign simulation | No shared mutable world state |
| Opt-in visibility | Privacy flags, field-level redaction |
| Limited economic transfer | Caps, taxes, cooling periods |
| Async by default | Contract state machines, not live sync |
| Anti-abuse first | Immutable audit, velocity scoring, enforcement |

---

# 2. Multiplayer Philosophy

## 2.1 Single-Player World Is Canonical

The living world simulation is **complete without multiplayer**. Fenix Network features are **enhancements**, not requirements. Offline-only play remains valid (local saves, no Network calls).

## 2.2 Community Without Corruption

Multiplayer must not introduce:

- Pay-to-win transfers from connected friends
- Shared world state that overwrites local simulation
- Real-time coupling that breaks offline catch-up
- Hidden buffs for social graph size

## 2.3 The Fairness Test

Every Network feature must pass:

> *Does this give connected players systemic advantages that isolated players cannot earn through legitimate play?*

If yes → redesign or reject.

## 2.4 Async Social-Economic Layer

Fenix Life is not a twitch multiplayer economy. Deals proceed over **hours or days** (wall clock):

- Investment offers expire after 72 hours
- Partnership negotiations via message threads
- Visits are cached read-only snapshots

## 2.5 Citizen Equality at the Boundary

In-world, player and AI citizens share rules. At Network boundary:

- Public profiles show **curated projections**—not raw save dumps
- Cross-player contracts affect **abstract stake representations** locally applied
- Leaderboards compare **validated metrics**—not client-reported wealth

---

# 3. Two-Plane Architecture

## 3.1 Sovereign World Plane

| Contains | Storage | Authority |
|---|---|---|
| Citizens, companies, economy | Save blob per WorldInstance | Client/worker simulation |
| In-world relationships | Save blob | Simulation |
| World Memory event log | Save blob + archives | Simulation |
| Diegetic media, history | Save blob projections | Simulation |

**Rule:** No foreign keys from Player A's `Citizen` to Player B's `Company`. Only opaque Network contract IDs.

## 3.2 Fenix Network Plane

| Contains | Storage | Authority |
|---|---|---|
| Accounts, auth | PostgreSQL | Platform |
| Friend graph, blocks | PostgreSQL | Platform |
| Contracts, transfers | PostgreSQL + audit log | Platform |
| Public profiles | PostgreSQL projection | Platform |
| Leaderboards | PostgreSQL + Redis cache | Platform |
| Cloud save metadata | PostgreSQL + Azure Blob | Platform |

## 3.3 Integration Boundary

```
Simulation tick (sync)
    → domain events
    → outbox enqueue (async)
        → Network API calls
        → contract validation
        → peer notification
Peer client polls/receives
    → contract command handler
    → local simulation applies
    → domain event append
```

**Never:** Network service directly writes peer save blob.

## 3.4 Identity Mapping

```typescript
interface AccountWorldLink {
  accountId: UUID;
  worldInstanceId: UUID;
  saveSlotId: UUID;
  playerCitizenId: string;      // current T0 citizen
  publicProfileId: UUID;
}
```

One account may have multiple save slots; each slot maps to one WorldInstance.

---

# 4. Fenix Network Platform

## 4.1 Service Map (NestJS Monorepo)

| Service | Responsibility |
|---|---|
| **Auth Service** | JWT, refresh, device binding |
| **Account Service** | Profile, privacy, entitlements |
| **Save Service** | Cloud upload/download, versioning |
| **Fenix Network Core** | Contract orchestration hub |
| **Friends Service** | Graph, requests, blocks |
| **Messaging Service** | Threads, deal negotiations |
| **Transfer Service** | Gifts, caps, audit |
| **Partnership Service** | Business contract lifecycle |
| **Investment Service** | Offers, escrow, dividends |
| **Profile Service** | Public projection rebuild |
| **Visit Service** | Presentation DTO cache |
| **Leaderboard Service** | Seasons, rankings, snapshots |
| **Moderation Service** | Reports, enforcement |
| **Presence Gateway** | Socket.IO, Redis TTL |
| **Anti-Abuse Worker** | Scoring, anomaly detection |

## 4.2 API Gateway

Single entry `/v1/` with:

- JWT validation
- Rate limiting (Redis sliding window)
- Correlation IDs
- Schema validation (shared Zod/class-validator)

## 4.3 Contract-First Integration

OpenAPI specs published for:

- Client SDK generation
- Third-party tooling (future)
- Contract testing in CI

## 4.4 Event Outbox (Simulation Side)

Per TDD §3.1, simulation enqueues Network intents post-tick:

```typescript
interface NetworkOutboxEntry {
  outboxId: UUID;
  worldInstanceId: UUID;
  intentType: NetworkIntentType;
  payload: object;
  createdAt: Date;
  retryCount: number;
  status: 'pending' | 'sent' | 'failed' | 'dead';
}
```

Worker drains outbox with exponential backoff.

## 4.5 Network Event Types (Platform)

Distinct from simulation domain events:

| Platform Event | Meaning |
|---|---|
| `network.friend_request_sent` | Social |
| `network.friendship_established` | Social |
| `network.message_delivered` | Messaging |
| `network.gift_transfer_completed` | Economic |
| `network.partnership_formed` | Contract |
| `network.investment_offer_created` | Contract |
| `network.investment_accepted` | Contract |
| `network.visit_recorded` | Social |
| `network.leaderboard_updated` | Competition |

These log to platform audit—not World Memory—except when locally applied (then dual record).

---

# 5. Cloud Save System

## 5.1 Save Philosophy

Saves must survive **15+ years** of patches (TDD §7). Cloud saves provide:

- Cross-device continuity
- Disaster recovery
- Integrity validation
- Leaderboard metric source

## 5.2 Save Types

| Type | Local | Cloud | Trigger |
|---|---|---|---|
| Autosave | ✓ encrypted | ✓ async | Monthly tick, major event, background |
| Manual checkpoint | ✓ | ✓ | Player action |
| Quick resume | ✓ cache | ✗ | Session end |
| Pre-migration | ✓ | ✓ mandatory | Schema upgrade |
| Conflict branch | ✓ | ✓ preserved | Sync conflict |

## 5.3 Save Package Structure

```
SavePackage
├── header (schema_version, checksum, world_id)
├── metadata (playtime, heir_generation, mod_hash)
├── simulationState (ZSTD compressed aggregates)
├── eventLogTail (World Memory hydration)
├── projections (optional dashboards)
├── mediaArchivePointer (optional chunk refs)
├── historyIndexHot
└── signature (HMAC-SHA256)
```

## 5.4 Cloud Upload Flow

```
1. Client completes local save write
2. Compute checksum + signature
3. POST /v1/saves/{slotId}/versions (metadata)
4. Receive blob upload SAS URL (Azure)
5. Chunked upload (4MB parts) with retry
6. POST /v1/saves/{slotId}/versions/{versionId}/commit
7. Server validates checksum, stores immutable SaveVersion
8. Profile projection rebuild job queued
9. Leaderboard metric extraction job queued
```

## 5.5 Cloud Download Flow

```
1. GET /v1/saves/{slotId}/latest (or specific version)
2. Download blob via signed URL
3. Verify checksum + signature client-side
4. Migration pipeline if schema_version < current
5. Hydrate local encrypted store
6. Resume simulation
```

## 5.6 Version History

- 5 rolling cloud versions per slot (configurable premium tier)
- Immutable version chain—no overwrite
- `SaveVersion` table: `{ versionId, checksum, blobPointer, createdAt, deviceId }`

## 5.7 Compression & Encryption

| Layer | Standard |
|---|---|
| Compression | ZSTD level 3 (~4:1 typical) |
| At rest | AES-256 (client optional passphrase) |
| In transit | TLS 1.3 |
| Integrity | HMAC + SHA-256 checksum |

## 5.8 Conflict Resolution

| Scenario | Resolution |
|---|---|
| Two devices edit offline | Last-write-wins; loser preserved as `conflict_branch` |
| Simultaneous sync | Version vector compare; newer wins |
| Overlapping edits (future) | Domain patch merge if non-overlapping |
| Network contract vs local | Contract event authoritative for cross-player effects |

Conflict UI presents both branches—player chooses merge or abandon.

## 5.9 Corruption Recovery

1. Checksum fail → replay from event log tail
2. Replay fail → restore prior autosave
3. Cloud version picker in recovery UI
4. Support admin blob inspection (audit logged)

## 5.10 Offline-Only Mode

Player may disable cloud sync:

- Local saves only
- No leaderboards (or separate offline namespace)
- No cross-player contracts
- Export/import manual backup supported

---

# 6. Friends & Social Graph

## 6.1 Friend Graph Model

```typescript
interface Friendship {
  friendshipId: UUID;
  userId: UUID;
  friendId: UUID;
  establishedAt: DateTime;
  relationshipAgeDays: number;    // derived, for transfer gates
  status: 'active';
}

interface FriendRequest {
  requestId: UUID;
  fromUserId: UUID;
  toUserId: UUID;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: DateTime;
  message?: string;
}

interface Block {
  blockId: UUID;
  blockerId: UUID;
  blockedId: UUID;
  createdAt: DateTime;
}
```

## 6.2 Friend Request Flow

```
1. POST /v1/friends/requests { toUserId, message? }
2. Rate limit: 20 requests/day
3. Recipient notification
4. Accept → Friendship row (symmetric queries via index)
5. Decline → request closed
6. Block → auto-decline pending, hide from search
```

## 6.3 Relationship Age Gates

Transfers and investments require minimum friendship age:

| Action | Min Age |
|---|---|
| Gift (small) | 7 days |
| Gift (large) | 30 days |
| Investment offer | 14 days |
| Partnership | 30 days |

Prevents smurf funnel accounts.

## 6.4 In-World vs Network Friends

| System | Scope |
|---|---|
| Simulation `Relationship` | In-world citizen bonds |
| Network `Friendship` | Platform accounts |

No automatic sync—player may friend someone's account without in-world relationship.

## 6.5 Friend Discovery

- Username search (exact + prefix)
- Recent visit list
- Leaderboard adjacent ranks
- No contact scraping without consent

---

# 7. Messaging & Notifications

## 7.1 Messaging Architecture

Thread-based async messaging—not simulation chat.

```typescript
interface MessageThread {
  threadId: UUID;
  participantIds: UUID[];
  threadType: 'direct' | 'group' | 'deal';
  createdAt: DateTime;
  lastMessageAt: DateTime;
}

interface Message {
  messageId: UUID;
  threadId: UUID;
  senderId: UUID;
  content: string;
  createdAt: DateTime;
  editedAt?: DateTime;
  deletedBy?: UUID[];           // per-user soft delete
  moderationStatus: 'clean' | 'flagged' | 'removed';
}
```

## 7.2 Deal Threads

Specialized threads for negotiations:

- Investment offers embedded as structured cards
- Partnership term sheets attachable
- State machine linked to contract service

## 7.3 Delivery

- REST fetch for history
- Socket.IO push for new messages (online friends)
- Push notifications (mobile/desktop) optional

## 7.4 Rate Limits

| Action | Limit |
|---|---|
| New threads | 30/hour |
| Messages | 60/minute per thread |
| Attachments | 10/day (future) |

## 7.5 Moderation Pipeline

```
Message send
  → profanity filter
  → spam heuristics
  → deliver OR quarantine
Report
  → moderation queue
  → human review SLA 24h
```

## 7.6 Platform Notifications

Distinct from diegetic in-world notifications:

| Type | Channel |
|---|---|
| Friend request | Platform |
| Deal accepted | Platform + optional in-game email |
| Gift received | Platform + in-game bank alert |
| Leaderboard rank | Platform |

Stored in `Notification` table with read/unread state.

---

# 8. Public Profiles & Visits

## 8.1 Public Profile Projection

Denormalized from save on sync—not live queried from blob:

```typescript
interface PublicProfile {
  profileId: UUID;
  accountId: UUID;
  displayName: string;
  avatarUrl?: string;
  legacyScoreBand: string;          // e.g., "Distinguished"
  publicCompanies: CompanySummary[];
  achievementHighlights: AchievementRef[];
  netWorthBand?: NetWorthBand;      // opt-in
  currentRole?: string;
  worldRegion?: string;               // coarse, not exact address
  verifiedMetrics: boolean;
  privacySettings: PrivacySettings;
  lastSyncedAt: DateTime;
}
```

## 8.2 Privacy Settings

Field-level visibility flags:

```typescript
interface PrivacySettings {
  showNetWorthBand: boolean;
  showCompanies: boolean;
  showLegacyScore: boolean;
  showAchievements: boolean;
  showOnlineStatus: boolean;
  allowVisitRequests: boolean;
  allowInvestmentOffers: boolean;
  allowPartnershipOffers: boolean;
  profileVisibility: 'public' | 'friends' | 'private';
}
```

Default: conservative (companies yes, net worth band no).

## 8.3 Verified Metrics Badge

Cloud-validated when:

- Save checksum verified
- Leaderboard metrics extracted server-side
- No active anomaly flags

Prevents client-reported fake wealth on profiles.

## 8.4 Visits

Read-only social experience:

```
1. Visitor requests visit (if allowed)
2. Visit Service fetches PresentationDTO from cache
3. DTO: city snapshot, public buildings, avatar, optional tour script
4. No looting, no state mutation, no live coupling
5. VisitRecord logged for both parties
```

## 8.5 Presentation DTO

```typescript
interface VisitPresentationDTO {
  visitedAccountId: UUID;
  generatedAt: DateTime;
  cityName: string;
  propertyExteriorSnapshots: ImageRef[];
  publicCompanyHQs: BuildingRef[];
  legacyExhibitPreview?: HallExhibitSummary;
  playerAvatar: AvatarConfig;
  welcomeMessage?: string;
}
```

Cached CDN 5 min TTL; regenerated on save sync.

## 8.6 Visit Fairness

Visits grant **no economic advantage**—purely social/exploration.

---

# 9. Business Partnerships

## 9.1 Partnership Philosophy

Cross-player business collaboration uses **server-authoritative contracts** each party applies locally—never shared company aggregate.

## 9.2 Contract Aggregate

```typescript
interface PartnershipContract {
  contractId: UUID;
  contractType: 'revenue_share' | 'supply_agreement' | 'joint_venture';
  parties: ContractParty[];
  terms: ContractTerm[];
  status: 'draft' | 'pending' | 'active' | 'dissolved' | 'disputed';
  formedAt?: DateTime;
  expiresAt?: DateTime;
  serverWitnessSignature: string;
}

interface ContractParty {
  accountId: UUID;
  worldInstanceId: UUID;
  localCompanyId: string;         // opaque to peer
  acceptedAt?: DateTime;
}

interface ContractTerm {
  termType: string;
  value: object;                  // e.g., { revenueSharePct: 15 }
}
```

## 9.3 Partnership Lifecycle

```
1. Party A drafts contract in Deal Thread
2. Party B reviews structured terms
3. Both accept → status active
4. ContractEvent append-only log
5. Each client applies local effects:
   - Revenue share on qualifying transactions
   - Supply price modifiers
6. Dissolution by mutual consent or expiry
7. Disputes → moderation (no simulation force-merge)
```

## 9.4 Local Application

When processing `network.partnership_formed`:

```typescript
// Local simulation command
applyPartnershipContract(contractId, terms) {
  create local PartnershipStub referencing contractId
  register revenue share rule in Company Engine
  append company.partnership_active domain event
}
```

Peer's actual company financials remain private—only contract terms shared.

## 9.5 Restrictions

- Max 3 active cross-player partnerships per company
- No partnership may bypass lending or tax rules
- Modded worlds: separate partnership namespace

---

# 10. Cross-Player Investments

## 10.1 Investment Philosophy

Players may invest in **public** peer companies through abstract stake—returns tied to investee performance via **public filings**, not guaranteed transfers.

## 10.2 Offer Flow

```
1. Investee (public company) enables investment offers in privacy settings
2. Investor creates InvestmentOffer in Deal Thread
   { valuationCap, equityPct, amount, holdingPeriodMonths }
3. Investee accepts or counters
4. Virtual escrow locks investor funds (platform-level accounting)
5. InvestmentContract formed
6. Investor save: abstract ExternalStake entity
7. Investee save: cap table ExternalInvestor entry (opaque account ref)
```

## 10.3 Investment Entities

```typescript
interface InvestmentOffer {
  offerId: UUID;
  investorAccountId: UUID;
  investeeAccountId: UUID;
  investeeCompanyLocalId: string;   // opaque
  amount: Money;
  equityPct: number;
  valuationCap: Money;
  holdingPeriodMonths: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: DateTime;
}

interface InvestmentContract {
  contractId: UUID;
  offerId: UUID;
  formedAt: DateTime;
  escrowRecordId: UUID;
  dividendSchedule: 'quarterly';
}
```

## 10.4 Returns & Dividends

Investee quarterly earnings trigger:

```
1. Company files public report (simulation event)
2. Save sync uploads filing summary
3. Investment Service computes dividend eligibility
4. DividendDistribution event to investor
5. Investor client applies banking.credit domain event
```

**No guaranteed returns**—dividends depend on actual performance.

## 10.5 Holding Period Enforcement

Server tracks `holdingPeriodMonths`—early exit penalties or blocked before expiry.

## 10.6 Private Company Restrictions

Private companies cannot accept Network investments v1—only IPO/public status qualifies.

---

# 11. Gifts & Economic Transfers

## 11.1 Transfer Philosophy

Limited economic transfer prevents:

- Wealth funneling from alts
- Real-money trading analogues
- Progression skipping

## 11.2 Gift Flow

```
1. POST /v1/transfers/gift { toAccountId, amount, purposeTag }
2. Transfer Service validates:
   - friendship age
   - velocity limits
   - sender balance (from last synced projection)
   - anomaly score
3. TransferRequest pending
4. Recipient accepts (or auto-accept if enabled)
5. TransferAuditLog immutable entry
6. Both clients receive contract command
7. Local banking events apply with transfer tax
```

## 11.3 Transfer Limits (Representative)

| Tier | Daily Cap | Monthly Cap | Tax |
|---|---|---|---|
| New account (<30d) | $10,000 | $50,000 | 15% |
| Established | $100,000 | $500,000 | 10% |
| Verified veteran | $250,000 | $1,000,000 | 5% |

Amounts in in-game currency; tuned via live ops Rule Registry.

## 11.4 Purpose Tags

Required categorization:

- `gift`
- `family_support` (requires family link verification future)
- `investment_return` (linked to contract)
- `event_prize` (official only)

## 11.5 What Transfers Cannot Do

- Transfer private companies whole
- Transfer skills, credentials, or degrees
- Bypass bankruptcy discharge
- Transfer World Memory history

---

# 12. Leaderboards & Seasons

## 12.1 Leaderboard Philosophy

Constitution Article VIII: categories beyond net worth—Financial, Legacy, Business, Social.

## 12.2 Categories

| Category | Metric Source | Anti-Gaming |
|---|---|---|
| **Financial** | Validated net worth band midpoint | Save verification |
| **Legacy** | Legacy Engine score | Cloud extraction |
| **Business** | Company valuation + employment | Public + verified private |
| **Social** | Relationship depth + philanthropy | Event log sample |

## 12.3 Season Structure

```typescript
interface LeaderboardSeason {
  seasonId: UUID;
  name: string;
  startAt: DateTime;
  endAt: DateTime;
  categories: LeaderboardCategory[];
  modNamespace: string;           // 'vanilla' | mod hash group
}

interface LeaderboardEntry {
  seasonId: UUID;
  category: string;
  accountId: UUID;
  score: number;
  rank: number;
  snapshotAt: DateTime;
}
```

## 12.4 Anti-Smurf Measures

- Minimum account age: 30 days
- Minimum playtime: 40 hours
- Save verification required
- Separate mod namespaces
- Shadow ban from leaderboard display if flagged

## 12.5 Rewards

Cosmetic only:

- Profile badges
- Hall exhibit frames
- Title prefixes

**No** simulation stat rewards.

## 12.6 Snapshot & Rewards Distribution

At season end:

1. `LeaderboardSnapshot` frozen
2. Top N receive cosmetic entitlements
3. Audit published

---

# 13. Privacy & Data Governance

## 13.1 Privacy by Default

Product Bible §13: family data private. Network defaults:

- Profile friends-only until changed
- Exact net worth never public by default
- Home address never in PresentationDTO
- Minor citizens (children NPCs) excluded from public profiles

## 13.2 Data Minimization

Platform stores only:

- What Network features require
- Aggregated metrics for leaderboards
- Not full save blobs on platform DB (blob storage only)

## 13.3 GDPR / CCPA

| Right | Implementation |
|---|---|
| Access | Export API (account + messages + contracts) |
| Deletion | 30-day soft delete; blob purge |
| Portability | Save download |
| Rectification | Profile edit |

## 13.4 Child Safety

- Age gate at registration
- Restricted messaging for minor accounts
- No cross-player investment for minor-flagged accounts

## 13.5 Telemetry Privacy

Analytics events exclude message content, exact financials—aggregated only.

---

# 14. Anti-Cheat & Anti-Abuse

## 14.1 Threat Model

| Threat | Vector |
|---|---|
| Save editing | Local file tampering |
| Wealth funneling | Alt accounts + transfers |
| Leaderboard fraud | Inflated client metrics |
| Harassment | Messaging |
| Contract scam | Social engineering |

## 14.2 Client Integrity

| Control | Description |
|---|---|
| HMAC save signature | Detect tampering |
| Checksum validation | Cloud reject invalid |
| Anomaly detection | Stat spikes vs playtime |
| Event log replay audit | Sample verification |

## 14.3 Transfer Scoring

Anti-Abuse Worker analyzes `TransferAuditLog`:

```
signals:
  - circular_transfer_graph
  - velocity_exceeded
  - new_account_large_transfer
  - correlated_device_fingerprint
  - playtime_inconsistent_with_wealth
```

Scores → `AnomalyFlag` → automated or human review.

## 14.4 Enforcement Ladder

| Level | Action |
|---|---|
| 1 | Warning notification |
| 2 | Transfer freeze 7 days |
| 3 | Leaderboard shadow ban |
| 4 | Network feature suspension |
| 5 | Account ban (moderation) |

## 14.5 Audit Retention

- Transfer audit: 7 years
- Moderation decisions: 7 years
- Contract events: life of contract + 3 years

## 14.6 Report Pipeline

Player report → moderation queue → SLA → action → notify reporter outcome.

---

# 15. Realtime & Presence

## 15.1 Presence Model

```typescript
interface PresenceSession {
  accountId: UUID;
  status: 'online' | 'in_game' | 'busy' | 'away';
  lastSeenAt: DateTime;
  currentActivity?: string;       // coarse: "Managing company"
}
```

Redis TTL 120 seconds; heartbeat refresh.

## 15.2 Socket.IO Gateway

- Friend subset broadcast only
- No public lobby
- Rooms: `account:{id}`, `thread:{id}`

## 15.3 Not Real-Time Simulation

Presence indicates availability for **messaging and deals**—not shared simulation clock.

---

# 16. Integration with Simulation

## 16.1 Multiplayer Engine (FSF §4.21)

In-simulation module handles:

- Outbox drain scheduling
- Incoming contract command validation
- Local effect application
- Domain event emission

## 16.2 Contract Command Handler

```typescript
interface NetworkContractCommand {
  commandId: UUID;
  contractType: string;
  contractId: UUID;
  payload: object;
  serverWitnessSignature: string;
  issuedAt: DateTime;
}

// Applied post-tick, never mid-tick
async function applyNetworkCommand(cmd: NetworkContractCommand) {
  verifySignature(cmd);
  switch (cmd.contractType) {
    case 'gift_received': return applyGift(cmd);
    case 'partnership_active': return applyPartnership(cmd);
    case 'investment_dividend': return applyDividend(cmd);
    default: assertNever(cmd.contractType);
  }
}
```

## 16.3 Public Filing Sync

When public company publishes earnings:

1. Simulation emits `company.earnings_reported`
2. Outbox uploads filing summary to Investment Service
3. Investors receive dividend computation async

## 16.4 Profile Rebuild Job

On save sync commit:

1. Extract public fields from metadata header + projections
2. Upsert PublicProfile
3. Invalidate visit cache CDN

---

# 17. Scalability & Reliability

## 17.1 Scale Targets (TDD §6.1)

| Dimension | Target |
|---|---|
| Registered accounts | 10M |
| Concurrent online | 500K |
| Network transfers/day | 1M peak |
| Save blob size | 50MB compressed |
| Messages/day | 10M |

## 17.2 Database Strategy

| Data | Strategy |
|---|---|
| Friend graph | PostgreSQL indexed |
| Leaderboards | Materialized view + Redis top-100 cache |
| Messages | Partition by month |
| Saves | Azure Blob + metadata PG |

## 17.3 Horizontal Scaling

- API: Kubernetes HPA
- Socket.IO: Redis adapter
- Workers: BullMQ autoscale
- Blob: Azure native

## 17.4 Reliability

| SLO | Target |
|---|---|
| Auth API | 99.95% |
| Save upload | 99.9% |
| Messaging delivery | 99.5% |
| Contract formation | 99.9% |

## 17.5 Disaster Recovery

- PostgreSQL geo-replica
- Blob GRS storage
- RPO 15 min / RTO 1 hour platform tier

---

# 18. Security Architecture

## 18.1 Authentication

| Token | Lifetime | Storage |
|---|---|---|
| Access JWT | 15 min | Memory |
| Refresh | 30 days rotating | HttpOnly cookie / OS keychain |

Scopes: `account:read`, `network:write`, `save:sync`, `message:write`

## 18.2 Contract Signing

Server witness HMAC on all contracts:

```
signature = HMAC-SHA256(serverSecret, contractId + parties + terms + timestamp)
```

Clients verify before local application.

## 18.3 Rate Limiting

| Endpoint class | Limit |
|---|---|
| Auth | 10/min/IP |
| Save upload | 6/hour/slot |
| Transfers | 20/day |
| Messages | 60/min |

## 18.4 Secure Visits

PresentationDTO contains no executable content—images/assets from CDN allowlist only.

## 18.5 Admin Access

MFA required, IP allowlist, immutable audit log for all admin actions.

---

# 19. Future Roadmap

## 19.1 Phase 2 Features

| Feature | Description |
|---|---|
| Co-op companies | Shared contract aggregate with deeper integration |
| Live events | Scheduled global tournaments (cosmetic) |
| Guilds / dynasties | Social groups with shared badges |
| Cross-save family links | Verified family across accounts |

## 19.2 Explicit Non-Goals

- Shared open world MMO
- Real-time combat or PvP
- Player trading of items outside contract system
- Blockchain/NFT integration

## 19.3 Version Vector Merge

Future: non-overlapping domain patch merge on sync conflict (`domain_patches` table).

---

# 20. Governance & Evolution

## 20.1 New Network Feature Checklist

- [ ] Passes fairness test (Article VIII)
- [ ] Sovereign simulation preserved
- [ ] Async contract pattern used
- [ ] Privacy defaults documented
- [ ] Anti-abuse hooks defined
- [ ] Audit log coverage
- [ ] Database schema in DDD
- [ ] OpenAPI spec updated
- [ ] No pay-to-win pathway

## 20.2 Constitutional Cross-Reference

| Article | Network Obligation |
|---|---|
| I Citizen Equality | No social stat boosts |
| II Living World | Async only; no tick coupling |
| V World Memory | Local events on contract apply |
| VIII Multiplayer | Fairness test mandatory |

## 20.3 Document Cross-References

| Topic | Document |
|---|---|
| Simulation events | [21_Event_System.md](./21_Event_System.md) |
| Public history | [22_History_Engine.md](./22_History_Engine.md) |
| Platform TDD | [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) §5 |
| Database | [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) §7 |
| FSF Multiplayer Engine | [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) §4.21 |

---

**End of Document 24 — Multiplayer Architecture (FMA)**
