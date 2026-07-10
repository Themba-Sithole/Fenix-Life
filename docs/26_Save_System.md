# Fenix Life — Official Save System Document

**Document Version:** 1.0  
**Status:** Canonical — Save & Persistence Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal Persistence Engineering & Platform Architecture  
**Audience:** Engineering, Client, QA, Live Ops, Security, Support  

---

## Document Authority

This Save System Document defines **how Fenix Life preserves player worlds across sessions, devices, patches, and decades of real time**. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Generational play, offline progression, premium trust |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | World Memory, Dynamic History, Citizen Equality |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Save architecture, workers, security |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Save metadata tables, blob pointers |
| [25_API_Design.md](./25_API_Design.md) | Save REST endpoints, sync tokens |

When save design conflicts with product philosophy, **align with philosophy first**. A lost save violates Constitution Article V (World Memory) and destroys player trust.

Every save behavior must trace to:

1. A Product Bible pillar (§7, §15)
2. Constitution Article V (World Memory) and Article IX (Dynamic History)
3. TDD §7 and Database DDD §8
4. A section of this document

---

## Table of Contents

1. [Save Philosophy](#1-save-philosophy)
2. [Save Types & Triggers](#2-save-types--triggers)
3. [Save Package Structure](#3-save-package-structure)
4. [Local Persistence](#4-local-persistence)
5. [Cloud Persistence](#5-cloud-persistence)
6. [Autosave System](#6-autosave-system)
7. [Compression](#7-compression)
8. [Encryption](#8-encryption)
9. [Snapshots & Version Chain](#9-snapshots--version-chain)
10. [Incremental Saves](#10-incremental-saves)
11. [Sync & Conflict Resolution](#11-sync--conflict-resolution)
12. [Corruption Detection & Recovery](#12-corruption-detection--recovery)
13. [Schema Versioning & Migration](#13-schema-versioning--migration)
14. [Event Log Tail & World Memory](#14-event-log-tail--world-memory)
15. [Offline Simulation & Catch-Up](#15-offline-simulation--catch-up)
16. [Quick Resume](#16-quick-resume)
17. [Multi-Device Play](#17-multi-device-play)
18. [Mod Compatibility in Saves](#18-mod-compatibility-in-saves)
19. [Performance & Size Budgets](#19-performance--size-budgets)
20. [Backup & Retention Policy](#20-backup--retention-policy)
21. [Support & Admin Tooling](#21-support--admin-tooling)
22. [Testing Requirements](#22-testing-requirements)
23. [Future-Proofing](#23-future-proofing)
24. [Appendices](#24-appendices)

---

## Executive Summary

Fenix Life saves are **sovereign world instances** — complete simulation states that must survive:

| Threat | Mitigation |
|---|---|
| App crash mid-tick | Autosave + event log tail replay |
| Device failure | Cloud sync with version chain |
| Schema evolution (15+ years) | Incremental migration pipeline |
| Sync conflicts (multi-device) | Version vectors + conflict branches |
| Corruption | Checksum + rolling backups + recovery UI |
| Mod changes | Manifest hash validation |

**Storage planes:**

```
┌─────────────────────────────────────────────────────────────┐
│                    SAVE PACKAGE (logical)                    │
│  Header │ Metadata │ Simulation State │ Event Tail │ Sig     │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
        ┌───────▼───────┐             ┌───────▼───────┐
        │ Local Store   │             │ Azure Blob    │
        │ (encrypted)   │◄──sync─────►│ (authoritative│
        └───────────────┘             │  when enabled)│
                │                     └───────┬───────┘
                │                             │
                └──────────┬──────────────────┘
                           ▼
                  PostgreSQL save_metadata
                  (queryable without decompress)
```

**North-star save constraints:**

| Constraint | Source |
|---|---|
| Saves survive 15+ years of patches | TDD §7, §13 |
| Nothing important permanently lost | Constitution Article V |
| Offline play fully supported | Product Bible §10 |
| Cloud sync debounced, never blocks gameplay | TDD §4.9 |
| Failed migration auto-restores backup | TDD §7.3 |

---

# 1. Save Philosophy

## 1.1 The Save Is a World Instance

A Fenix Life save is not a checkpoint file — it is a **complete sovereign simulation** containing:

- All citizen aggregates (player + promoted NPCs)
- All company, banking, property, and investment state
- Living World aggregate pools
- Event log tail for World Memory
- Mod manifest binding
- Simulation clock position

## 1.2 Append-Only History Inside Saves

While the save blob stores **current authoritative state**, it also carries:

- Event log tail (recent history)
- Pointers to cold archives (cloud)
- Interval records embedded in aggregates (employment periods, ownership spans)

**Rule:** Overwriting history inside a save is forbidden. Corrections append corrective events.

## 1.3 Local-First, Cloud-Enhanced

| Mode | Behavior |
|---|---|
| **Offline-only** | Local store is sole authority |
| **Cloud sync enabled** | Local is cache; cloud version chain is authority for conflict resolution |
| **Cloud-assisted simulation** | Worker reads save, writes new version |

Gameplay never blocks on cloud upload. Upload is async with progress indicator.

## 1.4 Determinism for Integrity

Each save records:

- `worldSeed` — procedural generation seed
- `rulesetVersion` — simulation rule bundle version
- `modManifestHash` — active mod set
- `worldChecksum` — hash of critical aggregates post-tick

Enables anti-cheat validation and deterministic replay debugging.

---

# 2. Save Types & Triggers

## 2.1 Save Type Catalog

| Type | ID | Storage | Retained | Purpose |
|---|---|---|---|---|
| **Autosave** | `autosave` | Local + cloud async | 3 local, 5 cloud rolling | Seamless continuity |
| **Manual checkpoint** | `manual` | Local + cloud | Until deleted | Player-named milestones |
| **Quick resume** | `quick_resume` | Local only | 1 (overwrite) | Instant session return |
| **Pre-migration** | `pre_migration` | Cloud mandatory | 30 days | Safety before schema transform |
| **Conflict branch** | `conflict_branch` | Cloud | 14 days | Loser device backup |
| **Pre-major-event** | `event_guard` | Local immediate | 1 rolling | Before IPO, marriage, death |
| **Session end** | `session_end` | Local + cloud debounced | Merged into autosave | Clean shutdown |

## 2.2 Autosave Triggers

| Trigger | Priority | Debounce | Cloud |
|---|---|---|---|
| Monthly tick completion | P0 | None | Yes (immediate queue) |
| Major domain event | P0 | 5s batch | Yes |
| Pre-time-advance (fast-forward) | P0 | None | Yes |
| App background / minimize | P1 | 2s | Yes (debounced 30s) |
| App close / exit | P0 | None | Yes (best effort) |
| Every 15 real-time minutes (fallback) | P2 | 60s | Yes (if dirty) |
| Player opens save menu | P3 | None | Metadata only |

## 2.3 Major Events Requiring Immediate Autosave

| Event Type | Namespace | Rationale |
|---|---|---|
| `CitizenDied` | `citizen.died` | Irreversible lifecycle |
| `CompanyIPO` | `company.ipo` | Capital structure change |
| `CompanyBankrupt` | `company.bankrupt` | Irreversible business failure |
| `MarriageFormed` | `family.marriage_formed` | Legal structure |
| `InheritanceProcessed` | `family.inheritance_processed` | Wealth transfer |
| `PropertyPurchased` | `property.purchased` | Large asset commit |
| `MarketCrash` | `economy.market_crash` | Macro state shift |
| `HeirSelected` | `citizen.heir_selected` | Generational transition |

## 2.4 Dirty State Tracking

Client maintains `SaveDirtyTracker`:

```
dirtyDomains: Set<DomainId>  // banking, company, citizen, ...
lastCleanChecksum: string
lastPersistedAt: timestamp
pendingCloudSync: boolean
```

Autosave skipped if `dirtyDomains` empty and checksum unchanged.

---

# 3. Save Package Structure

## 3.1 Binary Layout

```
SavePackage (logical)
├── HEADER           (fixed 256 bytes)
├── METADATA         (JSON, uncompressed)
├── SIMULATION_STATE (ZSTD compressed blob)
├── EVENT_LOG_TAIL   (ZSTD compressed, optional separate chunk)
├── PROJECTIONS      (ZSTD compressed, optional — denormalized dashboards)
├── MOD_BINDING      (JSON, uncompressed)
└── SIGNATURE        (64 bytes HMAC-SHA256)
```

## 3.2 Header Fields

| Field | Size | Type | Description |
|---|---|---|---|
| `magic` | 4 | `FLSS` | Format identifier |
| `formatVersion` | 2 | uint16 | Package format (not schema) |
| `schemaVersion` | 4 | uint32 | Semantic schema version |
| `worldInstanceId` | 16 | UUID | Sovereign world root |
| `saveId` | 16 | UUID | Platform save slot |
| `createdAt` | 8 | int64 | Unix ms real time |
| `simulationDate` | 4 | ISO date packed | In-game date |
| `headerChecksum` | 32 | sha256 | Header integrity |
| `payloadOffsets` | 64 | struct[] | Byte offsets for chunks |
| `reserved` | 108 | bytes | Future use (zero) |

## 3.3 Metadata JSON Schema

```json
{
  "slotName": "Chen Dynasty — Gen 3",
  "accountId": "uuid",
  "heirGeneration": 3,
  "activeCitizenId": "cit_7xK9mN2pQ",
  "playtimeSeconds": 145800,
  "realTimeCreatedAt": "2025-01-15T10:00:00.000Z",
  "realTimeLastPlayedAt": "2026-07-10T17:45:00.000Z",
  "difficulty": "standard",
  "worldSeed": "0xDEADBEEF",
  "rulesetVersion": "1.0.0",
  "modManifestHash": "sha256:abc...",
  "modIds": ["mod-uuid-1", "mod-uuid-2"],
  "cloudVersion": 47,
  "localVersion": 47,
  "parentVersionId": "uuid-or-null",
  "saveType": "autosave",
  "engineBuild": "1.0.0+build.4521",
  "platform": "windows",
  "locale": "en-US",
  "fiveCapitalsSnapshot": {
    "financial": 9842000,
    "human": 7200,
    "social": 6100,
    "business": 8500,
    "legacy": 4200
  }
}
```

## 3.4 Simulation State Chunks

Compressed blob contains typed chunks:

| Chunk ID | Contents |
|---|---|
| `CHNK_CITIZEN` | Player + T1 NPC aggregates |
| `CHNK_COMPANY` | Player and inner-circle companies |
| `CHNK_BANKING` | Accounts, loans, ledger hot window |
| `CHNK_PROPERTY` | Owned real estate |
| `CHNK_INVEST` | Portfolio positions |
| `CHNK_FAMILY` | Family tree, marriage records |
| `CHNK_RELATION` | T1 relationship graph |
| `CHNK_EDUCATION` | Enrollment, credentials |
| `CHNK_CAREER` | Employment history hot window |
| `CHNK_WORLD` | Living World aggregate pools |
| `CHNK_ECONOMY` | Macro state vector |
| `CHNK_GOVERNMENT` | Policy regime snapshot |
| `CHNK_TIME` | Clock, pending decisions queue |
| `CHNK_ACHIEVE` | Achievement progress |
| `CHNK_NOTIF` | Notification queue |
| `CHNK_MEDIA` | Recent news cache |

Chunks are independently compressible for future partial hydration.

## 3.5 Signature

```
HMAC-SHA256(
  key = derived from account + saveId + server secret (cloud)
        OR local keychain key (local-only),
  data = HEADER || METADATA || SIMULATION_STATE || EVENT_LOG_TAIL || PROJECTIONS || MOD_BINDING
)
```

Tampered saves rejected at load. Support can verify with admin tooling.

---

# 4. Local Persistence

## 4.1 Storage Backends by Platform

| Platform | Primary | Fallback |
|---|---|---|
| Windows | Encrypted file (`%AppData%/FenixLife/saves/`) | — |
| macOS | Encrypted file (`~/Library/Application Support/`) | — |
| Linux | Encrypted file (`~/.local/share/fenixlife/`) | — |
| Web | IndexedDB + OPFS (phase 2) | IndexedDB only |

## 4.2 Local File Naming

```
{savesDir}/{saveId}/
├── current.fls          # Latest autosave
├── quick_resume.fls     # Session cache
├── manual/
│   ├── {checkpointId}.fls
│   └── manifest.json
├── autosave/
│   ├── autosave_001.fls
│   ├── autosave_002.fls
│   └── autosave_003.fls  # Rolling 3
└── sync_state.json      # Version vectors, pending upload
```

## 4.3 Local Encryption

| Parameter | Value |
|---|---|
| Algorithm | AES-256-GCM |
| Key derivation | PBKDF2 from OS keychain-stored master key |
| Passphrase mode | Optional user passphrase (Argon2id) |
| IV | Random per file, prepended |

**Offline-only passphrase mode:** Cloud stores only ciphertext; server cannot decrypt.

## 4.4 Local SQLite Index (optional)

Lightweight index for save browser without full decompress:

```sql
CREATE TABLE save_index (
  save_id TEXT PRIMARY KEY,
  slot_name TEXT,
  simulation_date TEXT,
  heir_generation INTEGER,
  last_played_at INTEGER,
  file_path TEXT,
  file_size INTEGER,
  checksum TEXT
);
```

---

# 5. Cloud Persistence

## 5.1 Azure Blob Layout

```
fenix-saves/{region}/{accountId}/{saveId}/
├── versions/
│   ├── v000047.fls
│   ├── v000048.fls
│   └── v000049.fls
├── deltas/               # Phase 2 incremental
│   ├── v000048_delta.fls
│   └── v000049_delta.fls
├── archives/
│   └── year_2041_events.zst
└── conflict_branches/
    └── conflict_{id}.fls
```

## 5.2 PostgreSQL Metadata

See Database DDD §8.2. Cloud authority fields:

| Field | Authority Use |
|---|---|
| `cloud_version` | Monotonic integer per save |
| `checksum` | Integrity gate before promote |
| `blob_pointer` | Azure path |
| `schema_version` | Migration routing |
| `sync_status` | `synced`, `pending_upload`, `conflict`, `migrating` |

## 5.3 Upload Pipeline

```
Client                          API                         Worker
  │                              │                            │
  ├── POST /upload (init) ──────►│                            │
  │◄── presigned URLs ───────────┤                            │
  ├── PUT chunks to Azure ──────►│ (direct)                   │
  ├── POST /upload/complete ────►│                            │
  │                              ├── validate checksum ──────►│
  │                              │                            ├── rebuild projections
  │                              │◄── version confirmed ──────┤
  │◄── WS save:sync_status ──────┤                            │
```

## 5.4 Download Pipeline

1. Client requests `GET /saves/{id}/download` with save token
2. Server returns 302 to CDN-signed URL OR streams if CDN miss
3. Client validates checksum before replacing local
4. If `schemaVersion` > client support → trigger migration flow

---

# 6. Autosave System

## 6.1 Autosave State Machine

```
                    ┌──────────┐
         ┌─────────►│  IDLE    │◄─────────┐
         │          └────┬─────┘          │
         │               │ dirty          │
         │               ▼                │
         │          ┌──────────┐          │
         │          │ PENDING  │          │
         │          └────┬─────┘          │
         │               │ trigger        │
         │               ▼                │
         │          ┌──────────┐   fail   │
         │          │ WRITING  │──────────┤
         │          │  LOCAL   │          │
         │          └────┬─────┘          │
         │               │ success        │
         │               ▼                │
         │          ┌──────────┐          │
         │          │ QUEUED   │          │
         │          │  CLOUD   │          │
         │          └────┬─────┘          │
         │               │ uploaded       │
         └───────────────┤                │
                         ▼                │
                    ┌──────────┐          │
                    │ SYNCED   │──────────┘
                    └──────────┘
```

## 6.2 Non-Blocking Guarantee

Autosave **never** blocks the simulation tick:

1. Snapshot taken via structural sharing (copy-on-write aggregates)
2. Serialization runs in Web Worker
3. Disk write async
4. Cloud upload queued in background service

If serialization exceeds 100ms, log warning and reduce projection chunk inclusion.

## 6.3 Autosave UI Feedback

| State | UI |
|---|---|
| Writing local | Subtle disk icon pulse (optional setting) |
| Queued cloud | Cloud icon with dot |
| Synced | No indicator |
| Failed local | Toast: "Local save failed — retrying" |
| Failed cloud | Banner: "Cloud sync pending" (non-blocking) |

## 6.4 Autosave During Blocking Decisions

Constitution requires unresolved decisions block time advance. Autosave still runs — captures `pendingDecisions` queue in `CHNK_TIME` chunk.

---

# 7. Compression

## 7.1 Algorithm Selection

| Parameter | Value | Rationale |
|---|---|---|
| Algorithm | **ZSTD** | Best speed/ratio for structured game state |
| Level | 3 | Balance: ~4:1 ratio, <500ms for 10MB raw |
| Dictionary | Per-schema-version trained dict (phase 2) | Improved ratio for repetitive structures |

## 7.2 Typical Sizes

| Game Stage | Raw | Compressed | Notes |
|---|---|---|---|
| Early life (year 1) | 2 MB | 0.5 MB | Minimal companies |
| Mid career (year 15) | 15 MB | 4 MB | 1-2 companies |
| Late empire (year 40) | 40 MB | 10 MB | Multiple companies, deep history |
| Multi-gen dynasty (year 80) | 80 MB | 20 MB | Near quota; archive rollups critical |

## 7.3 Compression Pipeline

```
Aggregates → JSON/binary serialize → ZSTD compress → chunk assembly → HMAC sign
```

Decompression streams chunk-by-chunk for lazy hydration (load citizen before companies if needed).

## 7.4 Chunk Upload Compression

Multipart upload uses pre-compressed chunks. Each 4MB part is already ZSTD-compressed blob segment.

---

# 8. Encryption

## 8.1 Encryption Layers

| Layer | When | Method |
|---|---|---|
| **Local at rest** | Always | AES-256-GCM, OS keychain key |
| **Passphrase mode** | User opt-in | Argon2id + AES-256-GCM |
| **Transit** | Cloud sync | TLS 1.3 |
| **Cloud at rest** | Always | Azure SSE (server-side) |
| **Client-side cloud** | Passphrase mode | Ciphertext only in blob; server blind |

## 8.2 Key Management

```
Master Key (OS keychain)
    └── Per-save Data Encryption Key (DEK)
            └── Wrapped in master key
            └── Stored in save metadata (encrypted DEK blob)
```

Passphrase mode: DEK wrapped with passphrase-derived key instead of master key.

## 8.3 Key Rotation

Account-level key rotation:

1. Download save with old DEK
2. Re-encrypt with new DEK
3. Upload new version
4. BullMQ job for bulk rotation (admin-triggered)

---

# 9. Snapshots & Version Chain

## 9.1 Version Model

Each cloud save maintains monotonic `cloud_version`:

```
v1 → v2 → v3 → ... → v47 (current)
```

Each version is **immutable** once committed. New saves append only.

## 9.2 Version Metadata Record

```json
{
  "versionId": "uuid",
  "cloudVersion": 47,
  "saveType": "autosave",
  "createdAt": "2026-07-10T17:46:00.000Z",
  "simulationDate": "2042-03-15",
  "checksum": "sha256:abc...",
  "compressedSizeBytes": 8388608,
  "parentVersionId": "uuid-v46",
  "schemaVersion": 12,
  "createdBy": "client",
  "deviceId": "device-uuid"
}
```

## 9.3 Rolling Retention

| Tier | Versions Kept | Selection |
|---|---|---|
| Free | 5 | Latest 5 |
| Premium | 20 | Latest 20 |
| Manual checkpoints | Unlimited (within quota) | Player-pinned versions exempt from rolling delete |

Pinned versions survive rolling deletion until unpinned.

## 9.4 Snapshot Coalescing

If 10 autosaves occur within 5 minutes (crash loop), coalesce to single version keeping latest checksum. Prevents version chain pollution.

---

# 10. Incremental Saves

## 10.1 Phase 1 (Launch)

Full snapshot every sync. Simple, reliable.

## 10.2 Phase 2 (Incremental)

```
Monthly: full snapshot (mandatory)
Daily: binary delta from previous version
Weekly: forced full snapshot (delta chain reset)
```

## 10.3 Delta Format

```
DeltaPackage
├── baseVersionId     # Must match local/cloud base
├── chunkPatches[]    # { chunkId, offset, binaryPatch }
├── newChunks[]       # Full replacement chunks
├── deletedChunks[]   # Chunk IDs removed
└── signature
```

Binary diff algorithm: **bsdiff** or **zstd-diff** per chunk.

## 10.4 Delta Chain Rules

| Rule | Value |
|---|---|
| Max delta chain length | 7 |
| Forced full snapshot | Every 7 deltas OR weekly |
| Delta apply failure | Fall back to nearest full snapshot |
| Download optimization | Client requests `?sinceVersion=46` → server sends delta or full |

## 10.5 Dirty Domain Optimization

Only chunks whose `dirtyDomains` intersect are included in delta. `CHNK_WORLD` often unchanged between monthly ticks.

---

# 11. Sync & Conflict Resolution

## 11.1 Version Vectors

```json
{
  "saveId": "uuid",
  "local": { "version": 48, "checksum": "sha256:...", "deviceId": "A", "updatedAt": "..." },
  "cloud": { "version": 47, "checksum": "sha256:...", "updatedAt": "..." }
}
```

## 11.2 Conflict Scenarios

| Scenario | Detection | Resolution |
|---|---|---|
| Two devices offline, both advance | `local.version > cloud.version` on both devices | User chooses in conflict UI |
| Upload during active play on other device | Checksum mismatch at complete | Reject upload, fetch latest |
| Simultaneous upload | DB optimistic lock on `cloud_version` | Second upload gets 409 |
| Network partition | Stale `sync_state.json` | Reconcile on reconnect |

## 11.3 Conflict Resolution Strategies

| Strategy | Behavior |
|---|---|
| `keep_local` | Upload local as new version; cloud previous preserved as branch |
| `keep_cloud` | Download cloud; local preserved as `conflict_branch` file |
| `keep_both_branch` | Fork save slot (premium) or conflict branch for manual merge (future) |

**Default recommendation:** Most recent `simulationDate` + `playtimeSeconds` wins if player doesn't choose.

## 11.4 Fenix Network Contract Authority

Cross-player contracts stored in platform DB are **authoritative** over local save state for network-visible effects. Local save applies contract events when received — never the reverse.

---

# 12. Corruption Detection & Recovery

## 12.1 Detection Layers

| Layer | Check |
|---|---|
| HMAC signature | Tamper detection |
| Header checksum | Structural integrity |
| Chunk CRC32 | Per-chunk corruption |
| Aggregate invariant | Post-load validation (non-negative money, valid refs) |
| Schema validation | Zod/JSON Schema on metadata |

## 12.2 Recovery Ladder

```
Load attempt
    │
    ▼
[HMAC valid?] ──no──► Try previous autosave (local)
    │                        │
   yes                        ▼
    │                   [Success?] ──yes──► Load + warn user
    ▼                        │
[Chunks valid?] ──no──► Event tail replay
    │                        │
   yes                        ▼
    │                   [Success?] ──yes──► Partial recovery + warn
    ▼                        │
[Invariants valid?]            ▼
    │                   Cloud version restore UI
   yes                        │
    ▼                        ▼
  SUCCESS              Support ticket + recovery log
```

## 12.3 Event Tail Replay Recovery

If simulation state chunk corrupt but event tail intact:

1. Load last known good full snapshot (version N-k)
2. Replay events from tail up to `simulationDate`
3. Recompute checksum
4. If replay diverges → fall back to cloud version

## 12.4 Recovery UI

Player-facing recovery screen lists:

| Option | Source |
|---|---|
| Latest autosave | Local |
| Previous autosave (1-3) | Local rolling |
| Cloud versions (1-5/20) | Cloud |
| Manual checkpoints | Local |
| Conflict branches | Cloud |

Each entry shows: simulation date, playtime, heir generation, size, timestamp.

## 12.5 Recovery Audit

Every failed load creates `save_recovery_attempt` record:

```json
{
  "saveId": "uuid",
  "attemptedAt": "2026-07-10T18:00:00.000Z",
  "failureStage": "hmac_validation",
  "recoveryAction": "restored_cloud_v45",
  "deviceId": "uuid"
}
```

**Corruption never silently discarded.**

---

# 13. Schema Versioning & Migration

## 13.1 Version Independence

| Version Type | Tracks |
|---|---|
| `formatVersion` | Binary package layout |
| `schemaVersion` | Semantic simulation data shape |
| `rulesetVersion` | Gameplay rules bundle |
| `engineBuild` | Client executable build |

**Rule:** `schemaVersion` is independent of SemVer app version. App 2.0 may still read schema 12 with migration.

## 13.2 Migration Pipeline

```
Load save (schema v11)
    │
    ▼
[client supports v12?] ──yes──► Load directly
    │
   no
    ▼
[Migration path exists?] ──no──► Block + prompt update
    │
   yes
    ▼
Create pre_migration cloud backup (mandatory)
    │
    ▼
Apply transforms: v11→v12 (incremental chain)
    │
    ▼
[Success?] ──no──► Auto-restore backup + log error
    │
   yes
    ▼
Write migrated save, bump schemaVersion
```

## 13.3 Transform Rules

| Rule | Description |
|---|---|
| **Incremental only** | Never skip versions (v11→v12→v13, not v11→v13) |
| **Idempotent** | Running transform twice produces same result |
| **Logged** | Every transform writes to `save_migration_log` |
| **Tested** | Golden saves per version in CI |
| **Reversible** | Pre-migration backup always available |

## 13.4 Transform Implementation

```typescript
// Conceptual interface
interface SaveMigration {
  fromVersion: number;
  toVersion: number;
  description: string;
  transform(save: SavePackage): SavePackage;
  validate(result: SavePackage): ValidationResult;
}
```

Migrations live in `packages/simulation-engine/migrations/`.

## 13.5 Large Migration Jobs

Saves > 20MB compressed run in BullMQ worker:

1. Client uploads save
2. `POST /saves/{id}/migrate` → `{ jobId }`
3. Worker runs transform with progress callbacks
4. WebSocket `save:migration_progress` events
5. Client downloads migrated save

Player can continue in read-only mode or other save slots during migration.

## 13.6 Migration Examples

| Version | Change | Transform |
|---|---|---|
| v10→v11 | Add `healthInsurance` to citizen | Default `null` for existing |
| v11→v12 | Split `company.valuation` to snapshot table | Extract embedded field |
| v12→v13 | New `CHNK_GOVERNMENT` chunk | Create from economy defaults |

---

# 14. Event Log Tail & World Memory

## 14.1 Tail Contents

| Parameter | Default |
|---|---|
| Time window | Last 2 in-game years |
| Event count cap | 100,000 events |
| Whichever | **Smaller** |

## 14.2 Tail Event Schema

Same as domain events (TDD §3.2):

```json
{
  "eventId": "uuid",
  "eventType": "banking.loan_approved",
  "aggregateId": "loan_xyz",
  "simulationTime": "2041-08-15",
  "schemaVersion": 2,
  "payload": { "principalMinor": 500000, "apr": 0.065 }
}
```

## 14.3 Cold Archive Reference

Older events stored in cloud:

```
archives/{worldInstanceId}/year_{YYYY}_events.zst
```

Save metadata includes `archiveCatalog`:

```json
{
  "archives": [
    { "year": 2040, "blobPath": "...", "eventCount": 45000, "checksum": "..." },
    { "year": 2041, "blobPath": "...", "eventCount": 52000, "checksum": "..." }
  ]
}
```

## 14.4 Hydration on Demand

World Memory UI requests year 2035 events:

1. Check tail — if present, serve
2. Else fetch archive blob, decompress, cache in session
3. Paginate for UI

---

# 15. Offline Simulation & Catch-Up

## 15.1 Exit Persistence

On app exit/background:

```json
{
  "lastSimulationTime": "2042-03-15",
  "worldChecksum": "sha256:...",
  "pendingOutbox": [],
  "offlineCatchUpEnabled": true
}
```

## 15.2 Catch-Up Triggers

| Condition | Action |
|---|---|
| Away < 1 hour real time | Client catch-up on load |
| Away 1-24 hours | Client catch-up (may show summary) |
| Away > 24 hours | Cloud worker catch-up job |
| Away > 7 days | Cloud worker + condensed summary |

## 15.3 Catch-Up Job

BullMQ job `offline-catch-up`:

1. Load save at `lastSimulationTime`
2. Advance simulation to `now` (or account preference cap)
3. Write new save version
4. Generate digest for "While You Were Away" screen

## 15.4 Catch-Up Limits

| Setting | Max Advance |
|---|---|
| Default | 30 in-game days per real day away |
| Hard cap | 1 in-game year per session start |
| Player opt-out | Pause world while away (constitution tradeoff — explicit setting) |

---

# 16. Quick Resume

## 16.1 Purpose

Sub-2-second return to gameplay after recent session.

## 16.2 Implementation

- Overwrite `quick_resume.fls` on every successful autosave
- Skip cloud upload (local only)
- On app start: if `quick_resume` newer than `current.fls` by < 5 min, offer resume
- Contains full state (not partial)

## 16.3 Platform Notes

| Platform | Behavior |
|---|---|
| Desktop | Always enabled |
| Web | Session storage warning if tab closed without save |

---

# 17. Multi-Device Play

## 17.1 Supported Pattern

**Sequential multi-device** — play on PC, continue on laptop. Not simultaneous live play on two devices.

## 17.2 Device Registry

```json
{
  "devices": [
    { "deviceId": "uuid", "name": "Gaming PC", "platform": "windows", "lastSeenAt": "..." },
    { "deviceId": "uuid", "name": "MacBook", "platform": "macos", "lastSeenAt": "..." }
  ]
}
```

## 17.3 Switch Device Flow

1. Device A: exit game (session_end save + cloud upload)
2. Wait for `sync_status: synced` (or manual confirm)
3. Device B: load save from cloud
4. If conflict → resolution UI

## 17.4 Simultaneous Play Prevention

Soft lock: if cloud version advances while local session active > 30 min without sync, warn player. Hard lock not enforced (offline respect) but conflict likely.

---

# 18. Mod Compatibility in Saves

## 18.1 Mod Binding

Every save stores `modManifestHash` and `modIds[]` at save time.

## 18.2 Load Rules

| Condition | Behavior |
|---|---|
| Same mod hash | Load normally |
| Missing mod (subset) | Warn — disable dependent content or block |
| Extra mod added | Warn — may cause imbalance |
| Incompatible version | Block with mod update prompt |
| Hash mismatch ranked play | Leaderboard submission rejected |

## 18.3 Mod Migration

Mod schema changes are **mod author responsibility**. Engine provides `modCompatibilityChecker` CLI.

Save migration does not fix mod data — mods declare their own `saveMigration` hooks in manifest.

---

# 19. Performance & Size Budgets

## 19.1 Targets (TDD §10.1)

| Operation | Target |
|---|---|
| Local save write | < 200ms (10MB compressed) |
| Local save load | < 2s |
| Cloud download | < 5s (10MB, good connection) |
| Cloud upload | Background, non-blocking |
| Migration (10MB) | < 30s client, < 2min worker |

## 19.2 Size Quotas

| Tier | Max Compressed Size | Max Slots |
|---|---|---|
| Free | 50 MB | 3 |
| Premium | 100 MB | 10 |

Approaching quota: warn at 80%, block new checkpoints at 100%.

## 19.3 Optimization Strategies

| Strategy | Application |
|---|---|
| Lazy chunk hydration | Load CHNK_CITIZEN first for menu |
| Projection omission | Skip PROJECTIONS chunk if regenerable |
| Archive rollups | Yearly compression of old events |
| T2/T3 agent trimming | Statistical pools exclude named NPCs from deep history |

---

# 20. Backup & Retention Policy

## 20.1 Cloud Backup

| Policy | Value |
|---|---|
| Geo-redundancy | Azure GRS |
| Rolling versions | 5 free / 20 premium |
| Soft delete | 30 days after account deletion |
| Manual pin | Exempt from rolling delete |

## 20.2 Local Backup

Player can export save to arbitrary path (unencrypted export requires confirmation dialog).

## 20.3 Disaster Recovery

| RPO | RTO |
|---|---|
| 1 hour (cloud metadata) | 4 hours (region failover) |
| 0 (committed blob versions) | 4 hours |

---

# 21. Support & Admin Tooling

## 21.1 Admin Save Inspector

- View metadata without download
- Download blob (audit logged)
- Force migration
- List version chain
- Compare checksums between versions

## 21.2 Support Playbook

| Issue | Action |
|---|---|
| "Lost my save" | Check cloud versions, conflict branches |
| "Save won't load" | Check schema version, mod hash |
| "Wrong progress" | Compare version timestamps, conflict UI |
| "Migration stuck" | Check BullMQ job, retry or restore pre_migration |

---

# 22. Testing Requirements

## 22.1 Golden Save Tests

- Fixture saves per `schemaVersion` in `tests/fixtures/saves/`
- CI: load → migrate → validate invariants → checksum

## 22.2 Chaos Tests

| Test | Injection |
|---|---|
| Mid-write crash | Kill process during WRITING_LOCAL |
| Corrupt chunk | Flip random bytes, verify recovery ladder |
| Conflict | Simulate dual-device upload |
| Migration failure | Inject transform error, verify backup restore |

## 22.3 Performance Regression

Benchmark save/load/migrate on 2MB, 10MB, 50MB fixtures. Fail CI if > 20% regression.

---

# 23. Future-Proofing

## 23.1 Planned Enhancements

| Feature | Phase |
|---|---|
| Incremental deltas | Phase 2 |
| ZSTD dictionary training | Phase 2 |
| CRDT partial merge | Research |
| Save diff viewer (dev) | Phase 2 |
| Cross-platform cloud-only saves | Phase 3 |

## 23.2 Anti-Rewrite Guarantees

1. Schema version independent of app version
2. Incremental migrations tested per version
3. Immutable version chain
4. Event log tail for partial recovery
5. Mod hash binding prevents silent incompatibility

---

# 24. Appendices

## A. Save Service API Cross-Reference

See [25_API_Design.md](./25_API_Design.md) §9.

## B. Database Schema Cross-Reference

See [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) §8.

## C. Invariant Validation Rules

| Domain | Invariant |
|---|---|
| Banking | Sum of ledger entries = account balance |
| Company | Cap table shares sum to 100% |
| Citizen | Age ≥ 0, birth date < simulation date |
| Property | Owner exists, mortgage ≤ property value |
| Time | No pending P0 decisions when time advances |

## D. Glossary

| Term | Definition |
|---|---|
| **SavePackage** | Logical complete save unit |
| **Schema version** | Semantic data shape version |
| **Event tail** | Recent append-only event log in save |
| **Conflict branch** | Preserved loser copy after sync conflict |
| **Cloud version** | Monotonic integer version in cloud chain |

## E. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Persistence Engineering | Initial canonical release |

---

*End of Fenix Life Save System Document v1.0*
