# Fenix Life — History Engine (FHE)

**Document Version:** 1.0  
**Status:** Canonical — Historical Record Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Narrative Systems Lead & Principal Data Architect  
**Audience:** Engineering, Game Design, Narrative, AI Systems, UX, QA, Data, Live Ops  

---

## Document Authority

The Fenix History Engine (FHE) defines **how sovereign worlds remember, curate, compress, and present the past**—from individual biographies to civilizational timelines. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Legacy, dynamic history, encyclopedia vision |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | World Memory (Article V), Dynamic History (Article IX), Legacy (Article IV) |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | History Engine (§4.20), Legacy Engine (§4.19), tick lifecycle |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Event-driven architecture, CQRS, DDD module boundaries |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Event log, tiering, cold archive, milestone index |
| [21_Event_System.md](./21_Event_System.md) | Event taxonomy, retention, causal chains |
| [23_News_Engine.md](./23_News_Engine.md) | Newspaper archive ingestion, article artifacts |

When history presentation conflicts with simulation truth, **simulation truth wins**. History explains the world; it never rewrites it.

**What the FHE is:**

- The **curation layer** atop World Memory—transforming raw events into readable historical artifacts
- The **biography, timeline, and encyclopedia compiler** for citizens, companies, and crises
- The **Hall of Legends gatekeeper**—linking Legacy Engine scores to permanent recognition
- The **compression and archival orchestrator** for decade-scale play sessions

**What the FHE is not:**

- The authoritative event log (that is World Memory L0—History reads, never replaces)
- A creative writing LLM in the hot simulation path (generation is template + retrieval + optional async enrichment)
- A save file (history artifacts are projections derived from log + rules)
- A multiplayer shared database (each sovereign world owns its history)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [History Philosophy](#2-history-philosophy)
3. [Architecture Overview](#3-architecture-overview)
4. [Storage Model](#4-storage-model)
5. [Biographies](#5-biographies)
6. [Newspaper Archives](#6-newspaper-archives)
7. [Historical Timelines](#7-historical-timelines)
8. [Historical Companies](#8-historical-companies)
9. [Hall of Legends](#9-hall-of-legends)
10. [World Memory Integration](#10-world-memory-integration)
11. [Domain-Driven Design Integration](#11-domain-driven-design-integration)
12. [Synthetic & Worldgen History](#12-synthetic--worldgen-history)
13. [Generational Continuity](#13-generational-continuity)
14. [Search & Discovery UX](#14-search--discovery-ux)
15. [Performance & Tiering](#15-performance--tiering)
16. [AI & Narrative Generation](#16-ai--narrative-generation)
17. [Governance & Evolution](#17-governance--evolution)

---

# 1. Executive Summary

Fenix Life worlds become **unique civilizations** over decades of play. The History Engine ensures that uniqueness is **legible, searchable, and emotionally resonant**—not trapped in opaque database rows.

Players do not consult a quest log. They read **obituaries** that mention real business failures. They browse **corporate timelines** showing IPO, scandal, and acquisition. They explore **city histories** linking disasters to policy responses. They visit the **Hall of Legends** and see citizens celebrated for teaching, founding, or service—not merely wealth.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FENIX HISTORY ENGINE (FHE)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐               │
│  │ World Memory │     │ Media Engine │     │ Legacy Engine│               │
│  │  (L0 Log)    │     │  (Articles)  │     │  (Scores)    │               │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘               │
│         │                    │                    │                        │
│         └────────────────────┼────────────────────┘                        │
│                              ▼                                              │
│                    ┌──────────────────┐                                     │
│                    │ History Engine   │                                     │
│                    │  Curator Core    │                                     │
│                    └────────┬─────────┘                                     │
│         ┌───────────────────┼───────────────────┐                          │
│         ▼                   ▼                   ▼                          │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                      │
│  │ Biographies │   │ Timelines   │   │ Encyclopedia│                      │
│  └─────────────┘   └─────────────┘   └─────────────┘                      │
│         │                   │                   │                          │
│         └───────────────────┼───────────────────┘                          │
│                             ▼                                              │
│                    ┌──────────────────┐                                     │
│                    │ Hall of Legends  │                                     │
│                    │ Archive Index    │                                     │
│                    └──────────────────┘                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core artifacts produced:**

| Artifact | Trigger | Retention |
|---|---|---|
| Citizen Biography | Death, manual request (living partial) | Permanent |
| Company History | Milestone events, bankruptcy, acquisition | Permanent |
| Crisis Record | T4 epoch events | Permanent |
| Timeline Entry | T2+ indexed events | Permanent (rollup summary for T0) |
| Encyclopedia Entry | Notability threshold | Permanent |
| Newspaper Archive Index | Media article published | Permanent |
| Hall of Legends Induction | Legacy + diversity criteria | Permanent |

---

# 2. History Philosophy

## 2.1 Dynamic History (Constitution Article IX)

> Worlds must become unique civilizations—not interchangeable sandboxes.

The FHE implements Dynamic History by **deriving all narrative artifacts from simulation facts**. Two worlds with different seeds diverge in encyclopedia contents, newspaper archives, and legend rolls—not because writers authored different text, but because different events occurred.

## 2.2 History Explains Present

Every historical artifact must help answer: **Why is the world like this today?**

| Present Condition | Historical Explanation |
|---|---|
| Strict banking regulation | Encyclopedia: "2008 Coastal Credit Crisis" |
| Rival company hostility | Corporate timeline: poaching incident 2042 |
| Family estrangement | Biography: inheritance dispute chapter |
| Low housing supply | City timeline: zoning referendum 2031 |

## 2.3 No Retroactive Revision

World Memory is append-only. History Engine may **re-summarize** or **re-index** but never delete or alter source events. Errata append as new entries:

```
history.correction_published { references: originalEntryId, reason: "..." }
```

## 2.4 Equal Dignity in Record

AI citizens who meet notability thresholds receive the same artifact types as players—obituaries, encyclopedia entries, corporate histories. The player's biography is not longer or more flattering by default.

## 2.5 Legacy Connection

History and Legacy are siblings:

- **Legacy Engine** computes scores and heir eligibility
- **History Engine** writes the **permanent record** that future generations read

Hall of Legends requires both quantitative legacy score and qualitative historical significance.

---

# 3. Architecture Overview

## 3.1 Engine Placement in FSF

Per FSF §4.20:

| Aspect | Specification |
|---|---|
| **Inputs** | Immutable event log; media articles; milestone domain events |
| **Outputs** | Biographies, timelines, encyclopedia entries, archive indices |
| **Update** | On-event (milestones); yearly rollup; lazy hydration |
| **Performance** | Append at event time; compress noise yearly |

## 3.2 Processing Pipeline

```
Event/Article Ingest
       │
       ▼
┌──────────────┐
│ Significance │──► below threshold → index only
│   Scorer     │
└──────┬───────┘
       │ above threshold
       ▼
┌──────────────┐
│  Artifact    │
│  Composer    │──► template + fact retrieval
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Publisher   │──► history.* events + projection write
└──────────────┘
```

## 3.3 History Engine Modules

| Module | Responsibility |
|---|---|
| **IngestSubscriber** | Domain event bus listener |
| **SignificanceScorer** | Notability, milestone detection |
| **BiographyComposer** | Life narrative assembly |
| **CorporateHistorian** | Company timeline builder |
| **TimelineAggregator** | City, nation, sector timelines |
| **EncyclopediaEditor** | Topic entry curation |
| **ArchiveIndexer** | Newspaper/media cross-reference |
| **LegendsCurator** | Hall eligibility evaluation |
| **CompressionWorker** | Yearly noise rollup |
| **HydrationService** | On-demand cold archive load |

## 3.4 Event Subscriptions

History Engine consumes:

- All T3+ domain events (automatic index)
- All T2+ events for entities flagged `notabilityTracking`
- All `media.article_published` events
- All `legacy.hall_inducted` and `legacy.dynasty_milestone`
- All `history.*` self-referential updates

Publishes:

- `history.milestone_recorded`
- `history.biography_published`
- `history.encyclopedia_entry_created`
- `history.archive_rolled_up`
- `history.timeline_entry_added`
- `history.correction_published`

---

# 4. Storage Model

## 4.1 Three-Layer History Storage

| Layer | Name | Contents | Mutability |
|---|---|---|---|
| **L0** | World Memory Event Log | Raw domain events | Append-only |
| **L1** | Milestone Index | Pointers to significant events | Append-only |
| **L2** | History Artifacts | Biographies, entries, timelines | Versioned append |

## 4.2 History Artifact Envelope

```typescript
interface HistoryArtifact {
  artifactId: UUID;
  artifactType: Biography | EncyclopediaEntry | Timeline | CrisisRecord | ArchiveIndex;
  worldInstanceId: UUID;
  subjectId: string;           // citizen, company, region, topic
  subjectType: AggregateType;
  simulationTimeStart?: Date;
  simulationTimeEnd?: Date;
  composedAt: Date;            // simulation time of composition
  schemaVersion: number;
  sourceEventIds: UUID[];      // provenance
  sourceArticleIds?: UUID[];
  content: ArtifactContent;  // structured, not opaque HTML
  summaryPlainText: string;    // search index
  notabilityScore: number;
  visibility: 'public' | 'restricted' | 'family';
  version: number;
  supersedes?: UUID;
}
```

## 4.3 Partitioning Strategy

Per Database Design Document:

| Partition | Key | Storage |
|---|---|---|
| Hot | Current simulation year ± 2 | Save blob + local index |
| Warm | Prior 20 in-game years | Compressed blob chunk |
| Cold | Earlier years | Azure cold archive / yearly rollup |

## 4.4 Milestone Index Schema

Fast lookup without full log scan:

```typescript
interface MilestoneIndexEntry {
  milestoneId: UUID;
  eventId: UUID;
  eventType: string;
  subjectId: string;
  simulationTime: Date;
  severity: SeverityTier;
  category: MilestoneCategory;
  headline: string;           // cached for UI lists
  artifactId?: UUID;          // if composed
}
```

**Indexes:** `(subjectId, simulationTime DESC)`, `(category, simulationTime DESC)`, `(eventType)`.

## 4.5 Rollup Compression

Annual job (`history.archive_rolled_up`):

1. T0 events → aggregate counters only
2. T1 events → statistical summary per subject
3. T2 events → retain index; optional narrative merge
4. T3+ → never compressed

Rollup produces `TimelineSummary` artifacts linking to cold storage pointers.

## 4.6 Relationship to Save Package

```
SavePackage
├── eventLogTail          ← L0 recent
├── historyIndexHot       ← L1 + L2 hot artifacts
└── historyColdPointers   ← archive blob refs
```

Full biography hydration may fetch cold chunks on demand (lazy).

---

# 5. Biographies

## 5.1 Biography Purpose

A biography is the **authoritative life summary** of a citizen—readable by family, media (obituary source), and encyclopedia cross-links.

## 5.2 Biography Triggers

| Trigger | Biography Type |
|---|---|
| `citizen.died` | Full posthumous biography (required T1+) |
| Player request | Living biography partial update |
| `legacy.dynasty_milestone` | Dynasty chapter append |
| Notability threshold mid-life | Living public biography stub |

## 5.3 Biography Structure

```typescript
interface BiographyContent {
  title: string;                    // "James Okonkwo (1998–2067)"
  openingSummary: string;           // 2–3 sentences
  chapters: BiographyChapter[];
  epilogue?: string;                // legacy assessment
  statistics: LifeStatistics;
  relatedEntities: EntityRef[];     // companies, family, institutions
  mediaReferences: ArticleRef[];
  eventTimelineRef: UUID;           // link to full timeline
}

interface BiographyChapter {
  chapterId: string;
  title: string;                    // "Building Meridian Labs"
  simulationTimeRange: DateRange;
  narrativeBody: string;            // template-composed
  keyEventIds: UUID[];
  capitalHighlights: CapitalType[];
}
```

## 5.4 Chapter Detection Algorithm

Chapters emerge from **life phase detection**, not fixed ages:

| Phase Signal | Chapter Theme |
|---|---|
| Education cluster | "Formative Years" |
| First business founding | "Entrepreneurial Beginnings" |
| Major promotion cluster | "Rise in [Industry]" |
| Scandal/media spike | "Public Controversy" |
| Philanthropy cluster | "Giving Back" |
| Political office | "Public Service" |

Phase boundaries detected via changepoint analysis on event density and type clusters.

## 5.5 Biography Composition Rules

1. Every claim must reference ≥1 `sourceEventId`
2. Superlatives require quantitative backing ("largest IPO" → verify market data)
3. Negative facts included with equal dignity (bankruptcy, conviction)
4. Living biographies watermark: "Biography in progress"
5. Player may request privacy redaction on **living** sensitive sections—not posthumous public record

## 5.6 Family & Relationship Context

Biographies pull relationship graph summaries:

- Marriage/divorce events with names
- Children listed with birth years
- Notable rivalries (reputation events)
- Mentorship links

## 5.7 Obituary Handoff

On death, History Engine emits `history.biography_published` → Media Engine may compose `media.obituary_published` using biography `openingSummary` + quotes from chapters.

Order: biography authoritative; obituary derivative.

---

# 6. Newspaper Archives

## 6.1 Archive Role

Newspapers are **primary sources** in Fenix history. The History Engine maintains a **cross-indexed archive** of all `media.article_published` artifacts—not duplicate storage of full article bodies (Media owns content), but searchable metadata + pointers.

## 6.2 Archive Index Entry

```typescript
interface NewspaperArchiveEntry {
  archiveId: UUID;
  articleId: UUID;              // Media Engine artifact
  publicationId: string;      // e.g., "National Herald"
  simulationDate: Date;
  headline: string;
  section: NewsSection;
  subjectTags: EntityRef[];
  eventRefs: UUID[];
  sentiment: number;
  circulationTier: 'local' | 'regional' | 'national';
  isSynthetic: boolean;         // worldgen articles
}
```

## 6.3 Archive Organization

| View | Sort Key |
|---|---|
| By Date | simulationDate DESC |
| By Subject | subjectId |
| By Event | eventId |
| By Publication | publicationId + date |
| Full Text Search | headline + summary index |

## 6.4 Historical Research Gameplay

Players (and heirs) may:

- Research competitor history before acquisition
- Discover family secrets in old society pages
- Trace crisis origins through editorial archives
- Verify rumour truth against archived reporting

## 6.5 Synthetic Archive Seeding

Worldgen pre-populates 500–5000 archive entries (WGS §8). Indexed with `isSynthetic: true` for dev tools; hidden from player.

## 6.6 Archive Integrity

Articles reference `sourceEventIds`. If event log replay differs (tamper detection), archive flagged `integrityWarning` in dev; cloud validation rejects save.

---

# 7. Historical Timelines

## 7.1 Timeline Types

| Timeline Scope | Subject ID | Example Title |
|---|---|---|
| **Citizen** | citizenId | "Life of Elena Vasquez" |
| **Family** | familyId | "The Vasquez Dynasty" |
| **Company** | companyId | "Meridian Labs Corporate History" |
| **City** | cityId | "History of Port Ashford" |
| **Region** | regionId | "Coastal Province Timeline" |
| **Nation** | nationId | "Republic of Fenia — Modern Era" |
| **Sector** | sectorCode | "Technology Sector 2020–2060" |
| **Topic** | topicSlug | "Climate Disasters" |

## 7.2 Timeline Entry Schema

```typescript
interface TimelineEntry {
  entryId: UUID;
  simulationTime: Date;
  entryType: 'event' | 'milestone' | 'summary' | 'era_boundary';
  title: string;
  description: string;
  severity: SeverityTier;
  eventId?: UUID;
  artifactId?: UUID;
  iconCategory: TimelineIcon;
  relatedEntries?: UUID[];
}
```

## 7.3 Era Boundaries

Macro changepoints insert era markers:

- `economy.recession_entered` / `_exited`
- `government.regime_changed`
- Major war/disaster (expansion)
- `emergent.*` composite T4 equivalents

Era labels generated from templates: "The Long Expansion (2031–2044)".

## 7.4 Multi-Scale Timelines

UI supports zoom:

| Zoom | Granularity |
|---|---|
| Lifetime | Major milestones only |
| Decade | T2+ events |
| Year | T1+ for tracked entities |
| Month | Player entity detail view |

## 7.5 Timeline Merge on Generational Play

When player becomes heir, personal timeline **continues** with dynasty overlay—prior generation collapses to chapter summary in family timeline, not deleted.

---

# 8. Historical Companies

## 8.1 Corporate History Artifact

Every company with ≥1 T2 event receives a `CorporateHistory` artifact:

```typescript
interface CorporateHistory {
  companyId: string;
  foundingDate: Date;
  dissolutionDate?: Date;
  status: 'active' | 'bankrupt' | 'acquired' | 'merged' | 'dormant';
  founders: CitizenRef[];
  ceoTimeline: ExecutiveTenure[];
  productMilestones: ProductMilestone[];
  financialMilestones: FinancialMilestone[];
  crisisEvents: CrisisRef[];
  mediaHighlights: ArticleRef[];
  marketPositionNotes: string[];
  successorEntityId?: string;     // acquirer
}
```

## 8.2 Milestone Events Mapped

| Event | Corporate History Section |
|---|---|
| `company.founded` | Origin |
| `company.product_launched` | Products |
| `company.funding_round_closed` | Capitalization |
| `company.ipo_completed` | Public Markets |
| `company.scandal_exposed` | Controversies |
| `company.acquired` | Exit |
| `company.bankrupt` | Dissolution |

## 8.3 Living Companies

Active companies maintain **rolling corporate history**—append-only sections updated quarterly at earnings boundaries.

## 8.4 Industry Histories

Sector-level aggregation:

- Market share leaders by decade
- Disruption events (`company.product_launched` with high impact score)
- Consolidation waves (M&A clusters)
- Regulatory responses

## 8.5 Encyclopedia Cross-Link

Notable companies receive encyclopedia entries when:

```
notabilityScore >= threshold
OR marketCap peak >= sector percentile 95
OR cultural impact score >= threshold
```

---

# 9. Hall of Legends

## 9.1 Purpose

Constitution Article IV: celebrate diverse achievements—not merely wealth.

The Hall of Legends is the **in-world monument** to citizens who shaped their world across Five Capitals.

## 9.2 Physical Metaphor

Diegetic presentation: virtual hall in capital city (UI scene)—plaques, interactive exhibits, dynasty wings. Not a generic leaderboard screen.

## 9.3 Induction Criteria

Induction requires **multi-axis excellence**:

| Criterion | Weight | Source |
|---|---|---|
| Legacy Score composite | 40% | Legacy Engine |
| Capital diversity (≥3 capitals above threshold) | 20% | Legacy Engine |
| Historical significance | 20% | History Engine notability |
| Community impact events | 10% | Event count weighted |
| Longevity / multi-generational | 10% | Family Engine |

**Minimum gates:**

- Citizen deceased OR voluntary retirement induction (living legend rare)
- No active `legal.convicted` for fraud (posthumous case-by-case)
- Notability index ≥ 0.75

## 9.4 Legend Categories

| Wing | Celebrates |
|---|---|
| **Builders** | Founders of enduring institutions |
| **Stewards** | Philanthropists, civic leaders |
| **Innovators** | Patents, research, industry disruption |
| **Mentors** | Human Capital transfer at scale |
| **Culture** | Artists, athletes, media figures (expansion) |
| **Dynasties** | Multi-generational family impact |

Player and AI citizens compete for same slots—limited inductees per world per decade prevents inflation.

## 9.5 Induction Workflow

```
1. citizen.died OR legacy.retirement_induction_candidate
2. Legacy Engine → final legacy score
3. History Engine → LegendsCurator.evaluate()
4. IF eligible:
     emit legacy.hall_inducted
     compose HallExhibit artifact
     notify Media Engine (feature story)
5. ELSE:
     emit legacy.hall_near_miss (private, player only if player entity)
```

## 9.6 Hall Exhibit Artifact

```typescript
interface HallExhibit {
  exhibitId: UUID;
  citizenId: string;
  inductionDate: Date;
  category: LegendCategory;
  plaqueInscription: string;
  highlightArtifacts: UUID[];   // biography, articles, company history
  legacyScoreSnapshot: LegacyScore;
  quote?: string;               // from interviews if existed
}
```

## 9.7 Gameplay Effects

Constitutional guardrail: Hall induction grants **recognition**, not stat boosts.

Permitted:

- NPC dialogue references ("Your father is in the Hall")
- Social Capital reputation modifiers in narrative contexts
- Unlock dynasty cosmetic exhibits

Forbidden:

- Lending rate bonuses
- Hidden skill multipliers
- Exclusive investment access

---

# 10. World Memory Integration

## 10.1 Read Path

History Engine is a **downstream consumer** of World Memory:

```
WorldMemoryLog.read(from, to, filters)
    → SignificanceScorer
    → Composers
    → HistoryArtifact.write()
    → history.* event append (meta-events about history)
```

## 10.2 Write Path

History artifacts are **L2 projections**—not replacements for L0 events. Composition emits meta-events for other subscribers:

| Meta-Event | When |
|---|---|
| `history.milestone_recorded` | T3+ indexed |
| `history.biography_published` | Biography complete |
| `history.encyclopedia_entry_created` | New entry |
| `history.archive_rolled_up` | Yearly compression |

## 10.3 Causal Provenance

Every paragraph in composed artifacts stores `sourceEventIds[]`. UI "Sources" panel lists linked events and articles.

## 10.4 Replay Consistency

Rebuilding history from event log replay must produce **semantically equivalent** artifacts (wording may vary if template version changes—store `templateVersion` in artifact).

## 10.5 Integrity Validation

Cloud sync validates:

```
hash(milestoneIndex) ⊆ hash(eventLog relevant partition)
```

Mismatch triggers save quarantine.

---

# 11. Domain-Driven Design Integration

## 11.1 Bounded Context

History Engine is its own bounded context within simulation:

| Context | Relationship |
|---|---|
| **World Memory** | Upstream supplier (events) |
| **Media** | Upstream supplier (articles); downstream consumer (obituary) |
| **Legacy** | Peer (scores in, induction out) |
| **Citizen/Company** | Subject aggregates (read-only) |
| **UI History Browser** | Downstream presentation |

## 11.2 Aggregates

| Aggregate | Root Entity | Invariants |
|---|---|---|
| `Biography` | biographyId | Immutable after publish except errata version |
| `CorporateHistory` | companyId | Append-only sections while company active |
| `EncyclopediaEntry` | topicSlug | Versioned; supersedes chain |
| `Timeline` | timelineId | Entries append-only |
| `HallExhibit` | exhibitId | Immutable after induction |

## 11.3 Repositories

```typescript
interface IHistoryArtifactRepository {
  append(artifact: HistoryArtifact): Promise<void>;
  getById(artifactId: UUID): Promise<HistoryArtifact>;
  findBySubject(subjectId: string, type?: ArtifactType): Promise<HistoryArtifact[]>;
}

interface IMilestoneIndexRepository {
  index(entry: MilestoneIndexEntry): Promise<void>;
  query(filter: MilestoneFilter): Promise<MilestoneIndexEntry[]>;
}

interface IArchiveIndexRepository {
  indexArticle(entry: NewspaperArchiveEntry): Promise<void>;
  search(query: ArchiveSearchQuery): Promise<NewspaperArchiveEntry[]>;
}
```

## 11.4 Application Services

| Service | Operations |
|---|---|
| `BiographyService` | composeOnDeath, requestLivingUpdate |
| `TimelineService` | addEntry, mergeEra, getTimeline |
| `EncyclopediaService` | createEntry, updateEntry, getTopic |
| `LegendsService` | evaluateCandidate, getHallExhibits |
| `CompressionService` | runYearlyRollup |

## 11.5 CQRS Projections

| Projection | Updated By |
|---|---|
| `HistoryBrowserView` | All artifact types |
| `FamilyArchiveView` | Biographies, family timelines |
| `CompanyDossierView` | Corporate histories |
| `HallOfLegendsView` | Hall exhibits |
| `NewspaperArchiveView` | Archive index |

Projectors idempotent on `eventId` / `artifactId`.

## 11.6 Anti-Corruption Layer

Media article format ≠ History archive format. ACL maps:

```
MediaArticle → NewspaperArchiveEntry (metadata only)
DomainEvent → MilestoneIndexEntry
```

## 11.7 Module Boundaries (NestJS / Client)

```
packages/simulation/history/
├── domain/
├── application/
├── infrastructure/
│   ├── EventLogReaderAdapter
│   ├── MediaArticleAdapter
│   └── ArtifactStoreAdapter
└── projections/
```

No direct SQL from History domain—repository interfaces only.

---

# 12. Synthetic & Worldgen History

## 12.1 Synthetic History Pipeline

WGS generates synthetic events → World Memory append → History Engine hydrates at `world.initialized`:

1. `SyntheticEventLog` replay
2. Batch milestone indexing
3. Encyclopedia seed generation
4. Newspaper archive index from synthetic media
5. "Historical era" timeline boundaries

## 12.2 Plausibility Validation

Before player sees artifacts:

- No citizen biography referencing events before their birth
- No company founded after CEO birth date inconsistency
- Crisis records reference valid macro state

Failed validation blocks world initialization (dev) or quarantines artifact (prod).

## 12.3 Player Entry Continuity

Player enters world with **pre-existing history**—History browser fully populated for prior decades.

---

# 13. Generational Continuity

## 13.1 Death → History Cascade

Per FSF §5.9:

| Step | History Action |
|---|---|
| `citizen.died` | Queue biography composition |
| Biography complete | `history.biography_published` |
| Media obituary | Archive index update |
| Legacy evaluation | Hall candidacy |
| Heir promotion | Dynasty timeline append |

## 13.2 Prior Generation Compression

When heir assumes control:

- Prior player citizen biography locked
- Personal timeline switches to heir
- Family timeline gains generational chapter
- Company histories continue uninterrupted

## 13.3 Multi-Generational Encyclopedia

Dynasty entries aggregate:

- Generations count
- Combined legacy scores (weighted decay)
- Notable members cross-links
- Family crest / narrative (cosmetic)

---

# 14. Search & Discovery UX

## 14.1 History Browser (Diegetic)

Presented as **National Archive** or **Library of Commerce** in-game—not settings menu.

## 14.2 Search Features

| Feature | Implementation |
|---|---|
| Full-text | Index on `summaryPlainText`, headlines |
| Entity pivot | Click citizen → their artifacts |
| Date range slider | Simulation time filter |
| Event type filter | Category chips |
| Source drill-down | Event log link |

## 14.3 Contextual Surfacing

History appears contextually:

- IPO screen → link to company history
- Loan denial → link to credit timeline
- Rival NPC → public biography stub
- Family reunion → family timeline

## 14.4 Accessibility

- Plain language summaries
- Dyslexia-friendly typography option
- Screen reader structured headings from artifact schema

---

# 15. Performance & Tiering

## 15.1 Hot Path Constraints

History composition **never blocks tick commit**:

- Death biography queued async post-commit
- Milestone index sync lightweight (< 1ms)
- Heavy composition in worker queue

## 15.2 Lazy Hydration

Cold biographies load on browser open:

```
GET /history/biography/:id → fetch hot metadata → async cold body load
```

## 15.3 Index Size Budgets

| World Age | Milestone Index Target |
|---|---|
| 10 years | < 5 MB |
| 50 years | < 25 MB |
| 100 years | < 50 MB (with rollup) |

## 15.4 NPC History Fidelity

| Tier | History Treatment |
|---|---|
| T0/T1 | Full biography on death |
| T2 | Sampled biography (template shorter) |
| T3 | Statistical mention in era summaries only |

---

# 16. AI & Narrative Generation

## 16.1 Hot Path: Template-First

Simulation tick uses **deterministic templates**:

```
"{subjectName} founded {companyName} in {city} on {date}, pioneering {sector}."
```

Facts from event payloads; adjectives from bounded vocabulary lists.

## 16.2 Warm Path: Retrieval Augmentation

Optional enrichment pulls:

- Related article sentences
- Relationship names
- Macro context strings

Still deterministic given inputs.

## 16.3 Cold Path: Async LLM Enrichment (Optional)

Post-commit, player-initiated "Deep Biography" may request LLM polish:

- Runs offline/async
- Must pass fact-check validator against `sourceEventIds`
- Marked `enriched: true` in metadata
- Never changes quantitative claims

## 16.4 LLM Guardrails

- No invented events
- No slander beyond simulation facts
- Moderation filter on output
- Player opt-out setting

---

# 17. Governance & Evolution

## 17.1 Artifact Schema Changes

- Increment `schemaVersion`
- Migration transforms on read
- Never delete old artifacts

## 17.2 Notability Threshold Tuning

Live ops may adjust thresholds via Rule Registry—changes apply prospectively only.

## 17.3 Constitutional Checklist

- [ ] Artifacts derived from events, not authored fiction
- [ ] AI citizens receive equal dignity
- [ ] Append-only integrity preserved
- [ ] Hall of Legends diversifies beyond wealth
- [ ] No gameplay stat boosts from history artifacts
- [ ] Generational continuity maintained

## 17.4 Cross-References

| Topic | Document |
|---|---|
| Events | [21_Event_System.md](./21_Event_System.md) |
| Media | [23_News_Engine.md](./23_News_Engine.md) |
| Multiplayer profiles | [24_Multiplayer_Architecture.md](./24_Multiplayer_Architecture.md) |
| Database tiering | [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) |

---

**End of Document 22 — History Engine (FHE)**
