# Fenix Life — Official Mod Framework Document

**Document Version:** 1.0  
**Status:** Canonical — Modding & Extension Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Mod Platform Engineering & Creative Systems  
**Audience:** Engineering, Mod Authors, QA, Live Ops, Community, Steam Integration  

---

## Document Authority

This Mod Framework Document defines **how Fenix Life extends without forking** — through data packs, rule packs, UI themes, and sandboxed plugins integrated with Steam Workshop and first-party distribution. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Mod Support Philosophy (§17) |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Citizen Equality, Symmetry Principle |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Mod architecture (§9) |
| [25_API_Design.md](./25_API_Design.md) | Mod Registry REST API |
| [26_Save_System.md](./26_Save_System.md) | Mod hash binding in saves |

When mod capabilities conflict with product philosophy, **mods may not grant player simulation advantages unavailable to AI citizens** unless explicitly framed as difficulty/cosmetic and validated by symmetry checks.

---

## Table of Contents

1. [Mod Philosophy](#1-mod-philosophy)
2. [Mod Layers & Types](#2-mod-layers--types)
3. [Mod Package Structure](#3-mod-package-structure)
4. [Manifest Specification](#4-manifest-specification)
5. [Mod Loader Architecture](#5-mod-loader-architecture)
6. [Extension Points](#6-extension-points)
7. [Industry & Business Mods](#7-industry--business-mods)
8. [Career Path Mods](#8-career-path-mods)
9. [UI & Presentation Mods](#9-ui--presentation-mods)
10. [Event & Narrative Mods](#10-event--narrative-mods)
11. [Regional & Country Packs](#11-regional--country-packs)
12. [Formula & Economy Tuning](#12-formula--economy-tuning)
13. [Rule Packs & Scripting](#13-rule-packs--scripting)
14. [Asset Pipeline](#14-asset-pipeline)
15. [Steam Workshop Integration](#15-steam-workshop-integration)
16. [Signing, Security & Sandboxing](#16-signing-security--sandboxing)
17. [Compatibility & Versioning](#17-compatibility--versioning)
18. [Multiplayer & Ranked Play](#18-multiplayer--ranked-play)
19. [Mod SDK & Authoring Tools](#19-mod-sdk--authoring-tools)
20. [Review & Publishing Pipeline](#20-review--publishing-pipeline)
21. [Testing Mods](#21-testing-mods)
22. [Future-Proofing](#22-future-proofing)
23. [Appendices](#23-appendices)

---

## Executive Summary

Fenix Life mods extend the simulation through **declarative data** and **bounded hooks** — never by modifying engine source.

```
┌─────────────────────────────────────────────────────────┐
│                    FENIX LIFE CORE                       │
│  Simulation Engine │ Event Bus │ Rule Registry           │
└───────────────────────────┬─────────────────────────────┘
                            │ Mod API (versioned, stable tier)
┌───────────────────────────▼─────────────────────────────┐
│  Mod Loader — manifest, dependencies, load order         │
└───────────────────────────┬─────────────────────────────┘
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Data Packs          Rule Packs          UI Themes
   (JSON/YAML)         (sandboxed)         (CSS/assets)
```

**North-star mod constraints:**

| Constraint | Source |
|---|---|
| No engine fork required for content | Product Bible §17 |
| Symmetry — AI uses same mod rules | Constitution Article I |
| Signed mods for ranked/workshop | TDD §9.4 |
| Mod hash in save header | TDD §9.5 |
| Stable API tier for long-lived mods | TDD §9.4 |

---

# 1. Mod Philosophy

## 1.1 Extension, Not Exploitation

Mods exist to:

- Add industries, careers, and regional flavor
- Tune economy parameters within bounds
- Reskin UI for accessibility or aesthetic preference
- Create total conversion experiences (medieval, sci-fi) via data

Mods must **not**:

- Grant hidden player advantages in ranked play
- Execute arbitrary native code on host system
- Exfiltrate player data
- Bypass Fenix Network transfer limits

## 1.2 Data-Driven First

**80% of mod content should be JSON/YAML** without scripting. Scripting is for conditional logic that data cannot express.

## 1.3 Symmetry Enforcement

When a mod adds a career path, **AI citizens must be eligible** with the same requirements, unless the mod tags the career as `playerFacingOnly: true` (disables ranked play).

## 1.4 Living Documentation

Mod API changes ship with:

- `CHANGELOG.md` in mod-sdk
- Compatibility matrix in release notes
- Deprecation warnings for 2 engine versions

---

# 2. Mod Layers & Types

## 2.1 Layer Matrix

| Layer | Format | Engine Recompile | Example |
|---|---|---|---|
| **L0 — Data** | JSON/YAML | No | New restaurant industry |
| **L1 — Assets** | PNG, OGG, atlas refs | No | Custom UI icons |
| **L2 — Presentation** | CSS, theme tokens | No | Dark mode pack |
| **L3 — Rules** | Lua / WASM sandbox | No | Custom loan approval heuristic |
| **L4 — Total Conversion** | L0+L1+L2+L3 bundle | No | Medieval life sim |

## 2.2 Mod Categories

| Category | Tag | Description |
|---|---|---|
| Industry | `industry` | New business types |
| Career | `career` | Employment paths |
| Region | `region` | Country/city flavor |
| Economy | `economy` | Parameter tuning |
| UI | `ui` | Themes and layouts |
| Events | `events` | Triggered narrative |
| Assets | `assets` | Sprites, audio |
| Quality of Life | `qol` | UI conveniences (no stat changes) |
| Total Conversion | `total_conversion` | Full overhaul |

## 2.3 Load Order

Mods sorted by:

1. Core game data (builtin)
2. Official DLC packs (if any)
3. User mods by `loadOrder` integer (author-set, user-adjustable)
4. Later overrides earlier for conflicting keys (last-wins merge)

---

# 3. Mod Package Structure

## 3.1 Directory Layout

```
my-healthcare-mod/
├── fenix.mod.json          # Manifest (required)
├── README.md
├── CHANGELOG.md
├── icon.png                # 256x256 workshop thumbnail
├── data/
│   ├── industries/
│   │   └── private_clinic.json
│   ├── careers/
│   │   └── nurse.json
│   ├── events/
│   │   └── malpractice_crisis.json
│   └── formulas/
│       └── healthcare_costs.yaml
├── assets/
│   ├── sprites/
│   └── audio/
├── ui/
│   ├── theme.css
│   └── tokens.json
├── scripts/                # Optional L3
│   └── loan_risk.lua
├── locales/
│   ├── en-US.json
│   └── es-ES.json
└── signatures/
    └── manifest.sig
```

## 3.2 Package Formats

| Distribution | Format |
|---|---|
| Local / Fenix Registry | `.fenixmod` (ZIP with fixed structure) |
| Steam Workshop | Steam UGC upload (same ZIP internally) |
| Dev iteration | Unpacked folder with hot reload |

## 3.3 Package Integrity

```
contentHash = SHA-256(all files except signatures/)
manifest.contentHash must match
manifest.signature = Ed25519(contentHash + canonical manifest JSON)
```

---

# 4. Manifest Specification

## 4.1 fenix.mod.json Schema

```json
{
  "$schema": "https://mods.fenixlife.com/schema/manifest-v1.json",
  "id": "com.fenixmodding.healthcare-expansion",
  "name": "Healthcare Expansion",
  "version": "2.1.0",
  "description": "Adds private clinics, nursing careers, and insurance depth.",
  "author": {
    "name": "FenixModding Collective",
    "url": "https://fenixmodding.example.com"
  },
  "license": "CC-BY-4.0",
  "tags": ["industry", "career", "economy"],
  "minEngineVersion": "1.0.0",
  "maxEngineVersion": "2.99.99",
  "apiTier": "stable",
  "dependencies": [
    { "id": "com.fenix.core-industries", "version": "^1.0.0", "optional": false }
  ],
  "conflicts": [
    { "id": "com.other.health-overhaul", "reason": "Duplicate industry IDs" }
  ],
  "loadOrder": 100,
  "hooks": [
    "industries/private_clinic",
    "careers/nurse",
    "careers/physician",
    "events/malpractice_crisis",
    "formulas/healthcare_costs"
  ],
  "symmetry": {
    "aiEligible": true,
    "rankedEligible": true
  },
  "contentHash": "sha256:abc123...",
  "signature": "ed25519:..."
}
```

## 4.2 Required Fields

| Field | Validation |
|---|---|
| `id` | Reverse-DNS unique string |
| `version` | SemVer |
| `minEngineVersion` | Must be ≤ current engine |
| `contentHash` | SHA-256 of package |
| `hooks` | Non-empty for non-cosmetic mods |

## 4.3 Optional Fields

| Field | Purpose |
|---|---|
| `saveMigration` | Path to mod-specific save migration script |
| `steamWorkshopId` | Linked UGC ID |
| `previewMedia` | Screenshots for workshop |
| `playerFacingOnly` | Disables ranked if true |

---

# 5. Mod Loader Architecture

## 5.1 Load Sequence

```
App Start
    │
    ▼
Load builtin core data
    │
    ▼
Resolve subscribed mods (local + Steam sync)
    │
    ▼
Build dependency graph → topological sort
    │
    ▼
Validate manifests (schema, signatures, version range)
    │
    ▼
Merge data layers (deep merge with last-wins)
    │
    ▼
Register hooks in Rule Registry
    │
    ▼
Load assets into CDN cache / local cache
    │
    ▼
Apply UI themes
    │
    ▼
Initialize sandboxed scripts
    │
    ▼
Compute modManifestHash → bind to session
```

## 5.2 Client Components

| Component | Location | Responsibility |
|---|---|---|
| `ModResolver` | `packages/mod-sdk/resolver` | Dependency graph |
| `ModValidator` | `packages/mod-sdk/validator` | Schema + signature |
| `ModMerger` | `packages/mod-sdk/merger` | Deep merge rules |
| `ModLoader` | `apps/client/src/mods/loader` | Orchestration |
| `RuleRegistry` | `packages/simulation-engine/rules` | Hook dispatch |
| `ScriptSandbox` | `packages/mod-sdk/sandbox` | Lua/WASM isolation |

## 5.3 Server Components

| Component | Responsibility |
|---|---|
| Mod Registry Service | Publish, subscribe, download |
| Workshop Sync Worker | Steam API polling |
| Signature Verifier | Ed25519 for official/workshop |
| Compatibility API | Mod set validation |

## 5.4 Hot Reload (Dev Only)

Dev builds watch mod folder → re-merge on change → soft reset simulation state with warning.

---

# 6. Extension Points

## 6.1 Hook Registry

| Hook Path | Merges | Allows |
|---|---|---|
| `industries/*` | Add/replace industry defs | New business types |
| `careers/*` | Add career paths | Jobs, progression |
| `education/*` | Programs, degrees | Schools, credentials |
| `events/*` | Triggered events | Narrative, crises |
| `countries/*` | Regional config | Tax, law flavor |
| `cities/*` | City templates | Starting locations |
| `formulas/*` | Numeric parameters | Economy tuning |
| `assets/*` | Asset manifest refs | Sprites, audio |
| `ui/themes/*` | CSS tokens | Presentation |
| `ui/screens/*` | Screen overrides | Custom layouts (bounded) |
| `media/templates/*` | News templates | Headline generation |
| `achievements/*` | Achievement defs | Milestones |
| `notifications/*` | Notification rules | Alert routing |

## 6.2 Hook Resolution

```typescript
// Conceptual
const industry = ruleRegistry.resolve<IndustryDef>(
  'industries',
  'private_clinic',
  { modContext }
);
```

Resolution order: core → DLC → mods by loadOrder.

## 6.3 Forbidden Hooks

| Path | Reason |
|---|---|
| `engine/*` | Internal only |
| `network/limits/*` | Anti-abuse bypass |
| `auth/*` | Security |
| `save/format/*` | Integrity |

---

# 7. Industry & Business Mods

## 7.1 Industry Definition Schema

```json
{
  "id": "private_clinic",
  "nameKey": "industry.private_clinic.name",
  "sector": "healthcare",
  "minCapitalMinor": 25000000,
  "departments": [
    { "id": "reception", "required": true, "maxStaff": 5 },
    { "id": "clinical", "required": true, "maxStaff": 50 },
    { "id": "billing", "required": true, "maxStaff": 10 }
  ],
  "products": [
    {
      "id": "general_consultation",
      "revenueModel": "fee_for_service",
      "basePriceMinor": 15000,
      "demandElasticity": 0.7
    }
  ],
  "regulations": ["healthcare_license", "hipaa_equivalent"],
  "aiFoundingWeight": 0.15,
  "tickHooks": {
    "monthly": "scripts/clinic_monthly.lua"
  }
}
```

## 7.2 Symmetry Fields

| Field | Purpose |
|---|---|
| `aiFoundingWeight` | NPC company founding probability |
| `aiEmploymentWeight` | NPC job selection |
| `playerFacingOnly` | If true, AI cannot found (ranked disabled) |

## 7.3 Industry Examples

| Mod | Industries Added |
|---|---|
| Healthcare Expansion | Private clinic, pharma startup |
| Food & Hospitality | Food truck, fine dining chain |
| Entertainment | Streaming studio, esports org |
| Industrial | Logistics hub, renewable energy |

## 7.4 Company Dashboard Integration

Industries declare `dashboardModules[]` — UI auto-registers department tabs from data.

```json
{
  "dashboardModules": [
  { "id": "patient_volume", "component": "HealthcarePatientChart" },
  { "id": "staff_credentials", "component": "CredentialTable" }
  ]
}
```

Custom components require mod-bundled React modules (L3, sandboxed import map).

---

# 8. Career Path Mods

## 8.1 Career Definition Schema

```json
{
  "id": "nurse",
  "nameKey": "career.nurse.name",
  "industry": "healthcare",
  "educationRequired": ["nursing_degree"],
  "entryLevel": "junior",
  "progression": [
    { "titleKey": "career.nurse.rn", "minYears": 0, "salaryBandMinor": [4500000, 6500000] },
    { "titleKey": "career.nurse.senior", "minYears": 5, "salaryBandMinor": [6500000, 9000000] },
    { "titleKey": "career.nurse.manager", "minYears": 12, "salaryBandMinor": [9000000, 12000000] }
  ],
  "skills": ["empathy", "clinical_knowledge", "stress_tolerance"],
  "aiEligible": true,
  "stressPerMonth": 8,
  "events": ["career.nurse.burnout_risk"]
}
```

## 8.2 Career Progression Rules

- Promotions evaluated monthly tick via shared `CareerEngine`
- Mod cannot bypass requirements without `scriptOverride` (ranked disabled)

## 8.3 Education Prerequisites

Careers link to `education/*` credentials. Mod must define or reference existing degrees.

---

# 9. UI & Presentation Mods

## 9.1 Theme Tokens

```json
{
  "colors": {
    "primary": "#1E40AF",
    "surface": "#F8FAFC",
    "danger": "#DC2626"
  },
  "typography": {
    "fontFamily": "Inter, system-ui",
    "baseSize": "14px"
  },
  "radius": { "card": "8px", "button": "6px" }
}
```

## 9.2 Allowed UI Overrides

| Override | Allowed | Notes |
|---|---|---|
| Colors, fonts | Yes | Full theme |
| Component density | Yes | Compact/comfortable |
| Screen layout | Partial | Slot-based, not arbitrary DOM |
| New screens | Yes | Via `ui/screens/*` registry |
| Hide core UI | No | Accessibility menu only |

## 9.3 Diegetic Constraint

UI mods must preserve **diegetic framing** — screens should still resemble professional software (Product Bible §3.5). Total conversions may override with `total_conversion` tag.

## 9.4 Phaser Asset Mods

Map sprites, building tiles, vehicle skins via `assets/sprites/` manifest. Phaser loader reads mod asset manifest at scene init.

---

# 10. Event & Narrative Mods

## 10.1 Event Definition Schema

```json
{
  "id": "malpractice_crisis",
  "trigger": {
    "type": "compound",
    "conditions": [
      { "type": "industry", "value": "private_clinic" },
      { "type": "random", "probabilityPerMonth": 0.002 },
      { "type": "minCompanyAge", "years": 3 }
    ]
  },
  "effects": [
    { "type": "reputation_delta", "target": "company", "value": -15 },
    { "type": "cash_delta", "target": "company", "value": -5000000 },
    { "type": "spawn_decision", "decisionId": "malpractice_response" }
  ],
  "mediaTemplate": "media/templates/malpractice_headline.json",
  "symmetry": { "appliesToAi": true }
}
```

## 10.2 Decision Mods

```json
{
  "id": "malpractice_response",
  "promptKey": "decision.malpractice.prompt",
  "options": [
    { "id": "settle", "effects": [...], "aiUtility": 0.6 },
    { "id": "fight", "effects": [...], "aiUtility": 0.3 },
    { "id": "restructure", "effects": [...], "aiUtility": 0.1 }
  ],
  "timeout": { "months": 1, "defaultOption": "settle" }
}
```

AI selects via `aiUtility` curves — same decision engine as player.

---

# 11. Regional & Country Packs

## 11.1 Country Pack Schema

```json
{
  "id": "country_jp",
  "nameKey": "country.japan",
  "currency": "JPY",
  "taxBrackets": "formulas/jp_tax.yaml",
  "educationSystem": "education/jp_system.json",
  "legal": {
    "marriageAge": 18,
    "inheritanceRules": "jp_inheritance"
  },
  "cities": ["city_tokyo", "city_osaka"],
  "mediaOutlets": ["media/nikkei_equivalent.json"]
}
```

## 11.2 Regional Economy

Country packs may adjust inflation targets, interest rate models, and sector weights. Must stay within global bounds:

| Parameter | Min | Max |
|---|---|---|
| Base interest rate | 0% | 25% |
| Inflation target | -5% | 50% |
| Unemployment floor | 1% | 30% |

---

# 12. Formula & Economy Tuning

## 12.1 Formula Pack Format (YAML)

```yaml
# formulas/healthcare_costs.yaml
healthcare:
  baseTreatmentCostMinor: 50000
  insurancePremiumMultiplier: 1.2
  inflationSensitivity: 0.8
loanApproval:
  minCreditScore: 580
  maxDebtToIncome: 0.45
stockMarket:
  dailyVolatilityBase: 0.012
```

## 12.2 Bounded Overrides

Engine validates all formula values against `FormulaBounds` registry. Out-of-bounds values rejected at mod load.

## 12.3 Ranked Play Formula Locks

Ranked leaderboards use **vanilla bounds** even if mod loaded — mod formulas clamped automatically.

---

# 13. Rule Packs & Scripting

## 13.1 Scripting Runtime (Phase 1: Lua)

| Aspect | Policy |
|---|---|
| Runtime | Lua 5.4 sandbox |
| Memory limit | 64 MB per mod |
| CPU limit | 10ms per hook invocation |
| IO | None |
| Network | None |
| OS access | None |

## 13.2 Exposed APIs (Stable Tier)

```lua
-- Loan risk custom scoring
function scoreLoanApplicant(ctx)
  local citizen = ctx.citizen
  local score = citizen.creditScore
  if citizen.industry == "healthcare" then
    score = score + 10  -- Industry bonus (symmetry: applies in ctx for all)
  end
  return math.min(score, 850)
end
```

## 13.3 WASM Sandbox (Phase 2)

For performance-critical mods. WASI subset, no filesystem.

## 13.4 Script Hooks

| Hook | Signature |
|---|---|
| `monthly.company.{industryId}` | `(ctx: CompanyContext) => void` |
| `loan.score` | `(ctx: LoanContext) => number` |
| `ai.utility.{decisionId}` | `(ctx: DecisionContext) => number` |

---

# 14. Asset Pipeline

## 14.1 Supported Formats

| Asset | Format | Max Size |
|---|---|---|
| Sprites | PNG, WebP | 4 MB each |
| Audio | OGG Vorbis | 10 MB each |
| Atlases | JSON + PNG (Phaser) | 16 MB |
| Fonts | WOFF2 | 2 MB |

## 14.2 Asset Manifest

```json
{
  "sprites": [
    { "id": "building.clinic", "path": "sprites/clinic.png", "frameSize": [128, 128] }
  ],
  "audio": [
    { "id": "ambient.hospital", "path": "audio/hospital.ogg", "type": "ambient" }
  ]
}
```

## 14.3 CDN & Caching

Workshop downloads cached locally `mods/cache/{modId}/{version}/`. ETag validation on update.

---

# 15. Steam Workshop Integration

## 15.1 Architecture

```
Steam Client ←→ Steam UGC API ←→ Fenix Workshop Sync Worker ←→ Mod Registry DB
                                                      ↓
                                              Client mod subscription
```

## 15.2 Sync Flow

1. Player subscribes in Steam Client
2. `POST /v1/mods/workshop/sync` triggers sync
3. Worker fetches UGC metadata, downloads item, verifies signature
4. Maps Steam ID → `fenix.mod.json` id
5. Client loads on next session

## 15.3 Steam-Specific Metadata

| Steam Field | Fenix Mapping |
|---|---|
| `publishedfileid` | `steamWorkshopId` in manifest |
| `tags` | Mod category tags |
| `preview_url` | Workshop thumbnail |

## 15.4 Upload Pipeline (Authors)

1. Validate package locally via `fenix-mod validate`
2. Build `.fenixmod` ZIP
3. Upload via Steam Workshop SDK or Fenix Mod Publisher CLI
4. Optional: first-party review queue for Featured status

## 15.5 Offline Steam

If Steam unavailable, use locally installed mods. Workshop sync retried on reconnect.

---

# 16. Signing, Security & Sandboxing

## 16.1 Trust Tiers

| Tier | Source | Signature Required |
|---|---|---|
| **Builtin** | Fenix core | N/A |
| **Official** | Fenix/DLC | Ed25519 (Fenix key) |
| **Workshop** | Steam UGC | Ed25519 (author or Fenix-verified) |
| **Local** | Disk sideload | Optional (ranked disabled) |
| **Unsigned local** | Dev | Ranked disabled, warning shown |

## 16.2 Signature Verification

```
on load:
  if manifest.signature present:
    verify Ed25519(manifest.contentHash, publicKey)
  else if ranked play:
    reject
  else:
    warn user
```

## 16.3 Malware Prevention

- No executable binaries in mod packages
- ZIP slip path traversal blocked
- Max uncompressed size 500 MB
- Virus scan on workshop ingest (ClamAV)

## 16.4 Privacy

Mods cannot access:

- Account credentials
- Other players' saves
- Network tokens
- Analytics PII

---

# 17. Compatibility & Versioning

## 17.1 API Tiers

| Tier | Stability | Breaking Changes |
|---|---|---|
| `stable` | Guaranteed 2 major versions | Never without deprecation |
| `beta` | May break each minor | Warning in manifest |
| `deprecated` | Removal next major | Console warning |

## 17.2 Engine Version Range

```
minEngineVersion <= clientVersion <= maxEngineVersion
```

Outside range → mod disabled with explanation.

## 17.3 Dependency Resolution

```
A depends on B ^1.0.0
B installed at 1.2.0 → OK
B missing → mod disabled (unless optional: true)
C conflicts with A → mod disabled
```

## 17.4 Mod Set Hash

```
modManifestHash = SHA-256(sorted(modId:version) join)
```

Stored in save header. Must match for cloud sync and ranked submission.

---

# 18. Multiplayer & Ranked Play

## 18.1 Mod Profiles

| Profile | Description |
|---|---|
| `vanilla` | No mods |
| `modded` | Any signed mod set |
| `custom` | Local unsigned (friends only) |

## 18.2 Fenix Network Rules

| Action | Mod Requirement |
|---|---|
| Ranked leaderboard | Vanilla or approved mod set |
| Friend transfer | Same mod hash OR vanilla-compatible subset |
| Partnership contract | Matching `modManifestHash` |
| Visit profile | Any (read-only) |

## 18.3 Transfer Compatibility Check

```json
POST /v1/mods/compatibility
{
  "localModHash": "sha256:abc",
  "remoteModHash": "sha256:def"
}
→ { "compatible": false, "missingMods": [...], "conflictingHooks": [...] }
```

---

# 19. Mod SDK & Authoring Tools

## 19.1 Package: `@fenix/mod-sdk`

| Export | Purpose |
|---|---|
| `validateManifest` | Schema validation |
| `validatePackage` | Full package check |
| `buildPackage` | Create `.fenixmod` |
| `computeContentHash` | Hash for manifest |
| `mergeData` | Test merge locally |
| `FormulaBounds` | Economy limits |

## 19.2 CLI: `fenix-mod`

```bash
fenix-mod init my-mod
fenix-mod validate ./my-mod
fenix-mod build ./my-mod --output my-mod.fenixmod
fenix-mod test ./my-mod --golden-save ./fixtures/mid-game.fls
fenix-mod publish ./my-mod.fenixmod --steam
```

## 19.3 JSON Schemas

Hosted at `https://mods.fenixlife.com/schema/`:

- `manifest-v1.json`
- `industry-v1.json`
- `career-v1.json`
- `event-v1.json`
- `country-v1.json`

## 19.4 Author Documentation

- `docs/modding/GETTING_STARTED.md`
- `docs/modding/INDUSTRY_GUIDE.md`
- `docs/modding/SYMMETRY_CHECKLIST.md`
- Sample mods in `examples/mods/`

---

# 20. Review & Publishing Pipeline

## 20.1 First-Party Review (Featured Mods)

| Stage | Check |
|---|---|
| Automated | Schema, signature, bounds, malware |
| Symmetry | AI eligibility verified |
| QA | Load in golden saves, 1 in-game year sim |
| Legal | IP scan, license |
| Featured | Curated placement in mod browser |

## 20.2 Community Mods (Unfeatured)

Automated validation only. Player ratings and reports drive moderation.

## 20.3 Mod Reports

Players report via `POST /v1/moderation/reports` with `type: mod`. Moderator can delist from Fenix Registry (Steam delist requires Valve).

---

# 21. Testing Mods

## 21.1 Author Tests

```bash
fenix-mod test --scenarios scenarios/nurse_career.yaml
```

Scenarios define: start save, mod list, advance months, assert state.

## 21.2 CI for Official Mods

- Golden save load
- 12-month simulation snapshot compare
- Symmetry: AI citizen count in mod career > 0

## 21.3 Regression

Mod API changes run compatibility suite against top 50 workshop mods before release.

---

# 22. Future-Proofing

## 22.1 Planned Features

| Feature | Phase |
|---|---|
| Lua scripting | Phase 1 |
| WASM sandbox | Phase 2 |
| Mod co-op subscriptions | Phase 2 |
| In-game mod browser | Phase 1 |
| Mod marketplace (cosmetic) | Phase 3 |

## 22.2 Extension API Roadmap

| Version | Additions |
|---|---|
| 1.1 | `ui/screens` overrides |
| 1.2 | WASM scripts |
| 2.0 | Multi-region worlds |

---

# 23. Appendices

## A. Cross-Reference Index

| Topic | Document |
|---|---|
| Mod API REST | [25_API_Design.md](./25_API_Design.md) §14 |
| Save mod hash | [26_Save_System.md](./26_Save_System.md) §18 |
| Product vision | Product Bible §17 |

## B. Sample Mod Checklist

- [ ] Unique `id` (reverse-DNS)
- [ ] SemVer `version`
- [ ] `contentHash` matches package
- [ ] `aiEligible: true` or `playerFacingOnly` declared
- [ ] All formulas within bounds
- [ ] Locales for `en-US` minimum
- [ ] README with load order notes
- [ ] Tested with `fenix-mod validate`

## C. Glossary

| Term | Definition |
|---|---|
| **Hook** | Registered extension point path |
| **Mod hash** | SHA-256 of active mod set |
| **Rule Registry** | Engine dispatch for mod data |
| **Symmetry** | AI and player share mod rules |

## D. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Mod Platform Engineering | Initial canonical release |

---

*End of Fenix Life Mod Framework Document v1.0*
