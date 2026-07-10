# Fenix Life — News Engine (FNE)

**Document Version:** 1.0  
**Status:** Canonical — Diegetic Media Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Narrative Director & Media Systems Lead  
**Audience:** Engineering, Game Design, Narrative, AI Systems, UX, Economy Design, QA, Live Ops  

---

## Document Authority

The Fenix News Engine (FNE) defines **how information flows through Fenix Life worlds**—newspapers, television, radio, social platforms, market wires, and rumour networks— as **diegetic media** aligned with the Design Constitution. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Media as living world pillar, financial literacy through information |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Living World (Article II), Emergent Storytelling (Article VI), World Memory (Article V) |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Media Engine (§4.15), Event Engine distinction |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Event bus, notification architecture |
| [21_Event_System.md](./21_Event_System.md) | Event taxonomy, severity, propagation |
| [22_History_Engine.md](./22_History_Engine.md) | Newspaper archive indexing, biography handoff |

**Constitutional mandate:** Media **explains** the simulation—it does not **replace** it. Headlines reference real event IDs. Market reports reflect actual indices. Rumours may be wrong; truth lives in the event log.

**What the FNE is:**

- The **information layer** that makes systemic consequences legible to citizens
- The **sentiment and attention economy** that feeds back into reputation, politics, and markets
- The **diegetic UI substrate** for smartphones, TVs, radios, and newspapers in-game
- The **journalist simulation** that creates investigative delay, bias, and scoops

**What the FNE is not:**

- A replacement for simulation engines (reporting ≠ causing)
- An unconstrained LLM narrator in the tick hot path
- A multiplayer chat system (Fenix Network messaging is platform-layer)
- A notification spam channel (curation and significance gates apply)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Diegetic Media Philosophy](#2-diegetic-media-philosophy)
3. [Architecture Overview](#3-architecture-overview)
4. [Publication Ecosystem](#4-publication-ecosystem)
5. [News Generation Pipeline](#5-news-generation-pipeline)
6. [Television & Broadcast](#6-television--broadcast)
7. [Social Media Platforms](#7-social-media-platforms)
8. [Rumours & Information Asymmetry](#8-rumours--information-asymmetry)
9. [Journalists & Editorial AI](#9-journalists--editorial-ai)
10. [Market Reports & Financial Media](#10-market-reports--financial-media)
11. [Company News & Corporate PR](#11-company-news--corporate-pr)
12. [Sentiment & Public Opinion](#12-sentiment--public-opinion)
13. [Player Information Interfaces](#13-player-information-interfaces)
14. [World Memory & History Integration](#14-world-memory--history-integration)
15. [Performance & Fidelity](#15-performance--fidelity)
16. [AI Content Policy & Moderation](#16-ai-content-policy--moderation)
17. [Governance & Evolution](#17-governance--evolution)

---

# 1. Executive Summary

In Fenix Life, the morning newspaper is not decoration—it is a **compressed projection of yesterday's simulation**. When a player reads that Meridian Labs missed earnings, the miss happened in the Company Engine. When social media erupts over a scandal, reputation scores already shifted. When a market report warns of banking stress, the composite detector flagged elevated non-performing loans.

The FNE sits between **raw domain events** and **citizen comprehension**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FENIX NEWS ENGINE (FNE)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Domain Events (all engines)                                                 │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │ Significance │────►│ Editorial    │────►│ Publication  │                │
│  │   Filter     │     │  Scheduler   │     │  Router      │                │
│  └──────────────┘     └──────────────┘     └──────┬───────┘                │
│                                                    │                        │
│         ┌──────────────────────────────────────────┼──────────────┐        │
│         ▼              ▼              ▼            ▼              ▼        │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │Newspaper │  │ TV/Radio │  │ Social   │  │ Market   │  │ Rumour   │   │
│   │ Articles │  │ Segments │  │ Posts    │  │ Wire     │  │ Network  │   │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│        └─────────────┴─────────────┴─────────────┴─────────────┘        │
│                                    │                                        │
│                                    ▼                                        │
│                          media.article_published                            │
│                          media.sentiment_shifted                            │
│                                    │                                        │
│                    ┌───────────────┴───────────────┐                       │
│                    ▼                               ▼                       │
│             History Engine                   Notifications                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Channel summary:**

| Channel | Cadence | Truthfulness | Primary UX |
|---|---|---|---|
| Newspapers | Daily + breaking | High (sourced) | Archive browser, print UI |
| Television | Daily bulletin + breaking | High | Living room / bar TV |
| Radio | Hourly summaries | High | Commute, background |
| Market wire | Real-time (sim day) | Exact figures | Trading terminal |
| Social media | Continuous | Variable | Smartphone app |
| Rumours | Weekly seeds | Often false | Social, word-of-mouth |
| Corporate PR | On-demand | Biased | Company feed |

---

# 2. Diegetic Media Philosophy

## 2.1 Design Constitution Alignment

Article II lists **Media reports news** among living world systems. The FNE implements this literally—the media layer runs during offline catch-up, publishes on simulation calendar, and never waits for player attention.

## 2.2 Diegetic Over Decoraative

All information UI is framed as **in-world technology**:

| Device | In-World Identity |
|---|---|
| Smartphone | Citizen's personal device with apps |
| Laptop dashboard | Work portal / home office |
| TV | Broadcast receiver in property |
| Newspaper | Physical or digital subscription |
| Trading terminal | Brokerage professional tool |

**Rejected:** Floating quest text, meta "Event happened" toasts without in-world source.

## 2.3 Information as Gameplay

Financial literacy (Product Bible) flows through **reading and interpreting** media:

- Earnings reports teach P&L vocabulary
- Credit downgrade articles explain bond spreads
- Housing coverage explains affordability indices
- Tax policy editorials explain legislative process

## 2.4 Media Does Not Replace Simulation

| Approved | Rejected |
|---|---|
| Article triggers reputation update because scandal event already fired | Article alone destroys company stock price |
| Investigative delay before scandal exposure | Instant punishment on rumour |
| Sentiment modifier feeds back through registered rules | Arbitrary "public angry" flag |

## 2.5 Equal Coverage Dignity

AI citizen milestones receive media coverage by same significance rules—not only player entities. Player may receive **notification priority**, not **coverage exclusivity**.

---

# 3. Architecture Overview

## 3.1 Media Engine in FSF

Per FSF §4.15:

| Aspect | Specification |
|---|---|
| **Responsibilities** | News generation, sentiment, scoops, trends, obituaries, investigative delays |
| **Inputs** | Significant events; fame; public company status; government activity |
| **Outputs** | Articles, sentiment indices, notification candidates, World Memory artifacts |
| **Update** | Daily news cycle; weekly trends; on-event breaking |
| **Performance** | Template hot path; batch at daily boundary |

## 3.2 Distinction from Event Engine

| Engine | Role |
|---|---|
| **Event Engine** | Causes hazards (disaster, accident) |
| **Media Engine** | Reports facts after engines mutate state |

A flood happens because Event + Weather + Housing engines ran. The headline appears because Media Engine subscribed to resulting events.

## 3.3 Core Modules

| Module | Function |
|---|---|
| **EventSubscriber** | Curated milestone event intake |
| **SignificanceFilter** | Player-adjacent + world importance scoring |
| **ArticleComposer** | Template-based headline/body generation |
| **PublicationRouter** | Assign outlet, section, journalist |
| **BroadcastScheduler** | TV/radio segment assembly |
| **SocialSimulator** | Post generation, virality model |
| **RumourEngine** | Imperfect information seeds |
| **MarketWireService** | Numeric market report generation |
| **SentimentAggregator** | Public mood indices by topic/region |
| **NotificationBridge** | P0 player alerts |

## 3.4 Published Events

| Event | Subscribers |
|---|---|
| `media.article_published` | History, Notifications, World Memory |
| `media.sentiment_shifted` | Government, Company, Economy |
| `media.scandal_exposed` | Citizen reputation, Legal |
| `media.trend_started` | Social, Marketing (company) |
| `media.obituary_published` | History, Family |
| `media.investigation_opened` | Delay timer for exposés |
| `media.rumour_circulated` | Social, Citizen (belief update) |

---

# 4. Publication Ecosystem

## 4.1 Publication Types

| Type | Examples | Scope |
|---|---|---|
| **National broadsheet** | The National Herald | Country-wide |
| **Financial daily** | Market Chronicle | Economy, markets |
| **Tabloid** | Daily Pulse | Celebrity, scandal |
| **Regional paper** | Coastal Tribune | City/region |
| **Trade journal** | Tech Industry Review | Sector |
| **Public broadcaster** | FBN (Fenia Broadcasting) | TV/radio |
| **Wire service** | Fenia Associated Wire | B2B feeds |

## 4.2 Publication Entity Schema

```typescript
interface Publication {
  publicationId: string;
  name: string;
  type: PublicationType;
  coverageScope: GeoScope;
  politicalLean: number;          // -1 to 1, affects framing
  reliabilityScore: number;       // 0.7–0.98
  circulationTier: 'local' | 'regional' | 'national';
  sections: NewsSection[];
  journalisticStaff: JournalistRef[];
  foundedSimulationYear: number;
}
```

## 4.3 Editorial Voice

Each publication applies **framing templates**:

| Lean | Framing Example (same event) |
|---|---|
| Center | "Meridian Labs misses Q3 expectations" |
| Pro-business | "Meridian Labs navigates challenging quarter" |
| Populist | "Another CEO fails workers as Meridian stumbles" |

Facts (numbers, dates, names) invariant; adjectives and emphasis vary.

## 4.4 Worldgen Publications

WGS seeds 5–15 publications per world with synthetic archive backfill—publications have histories matching regional culture (WGS §9).

## 4.5 Subscription Model (Gameplay)

Player may subscribe to publications (Financial Capital cost):

- Subscriptions unlock full articles vs headline-only
- Trade journals unlock sector analytics
- Free sources: public broadcaster, basic social

---

# 5. News Generation Pipeline

## 5.1 Pipeline Stages

```
1. Event intake (T2+ default, T1 if player-adjacent)
2. Significance scoring
3. Editorial gate (space limits, duplicate suppression)
4. Article composition (template + facts)
5. Publication assignment
6. Schedule (breaking vs daily batch)
7. Publish → media.article_published
8. Downstream: History index, notifications, sentiment
```

## 5.2 Significance Scoring

```typescript
significance =
  w1 * eventSeverity +
  w2 * entityFame +
  w3 * playerProximity +
  w4 * marketImpact +
  w5 * noveltyScore
```

| Input | Source |
|---|---|
| eventSeverity | Event envelope T0–T4 |
| entityFame | Citizen/company reputation |
| playerProximity | Relationship, employment, ownership |
| marketImpact | Economy projection delta |
| noveltyScore | Inverse recent coverage frequency |

## 5.3 Daily Edition Assembly

At daily boundary (post-daily tick commit):

1. Collect candidate events from last 24 simulation hours
2. Rank by significance
3. Allocate column inches by publication type
4. Compose top N articles per section
5. Publish edition bundle

**Edition limits (typical national paper):**

| Section | Max Articles/Day |
|---|---|
| Front page | 3 |
| Business | 8 |
| Local | 5 |
| Sports/Culture | 4 |
| Obituaries | 10 |

## 5.4 Breaking News

Events with `breakingEligible: true` (T3+ disasters, major bankruptcies, player company IPO):

- Bypass daily batch
- Publish within same simulation day
- Trigger TV interruption + smartphone push

## 5.5 Article Schema

```typescript
interface NewsArticle {
  articleId: UUID;
  publicationId: string;
  simulationPublishTime: Date;
  section: NewsSection;
  headline: string;
  subheadline?: string;
  bodyParagraphs: string[];
  byline: JournalistRef;
  sourceEventIds: UUID[];
  relatedEntityIds: string[];
  sentiment: number;
  isBreaking: boolean;
  isSynthetic: boolean;
  templateVersion: string;
  factChecksum: string;           // hash of source facts
}
```

## 5.6 Template Composition Example

Template `company.earnings_miss.v3`:

```
HEADLINE: {companyName} {beatOrMiss} Q{quarter} Earnings Expectations
LEAD: {companyName} reported {eps} EPS against consensus {consensusEps} on revenue of {revenue}...
BODY: Shares {direction} in {session} trading. CEO {ceoName} cited {citedFactors}.
```

All placeholders from event payloads and projections—zero freeform in hot path.

## 5.7 Duplicate Suppression

Same event + same publication within 7 simulation days → merge as follow-up unless material new facts (`company.guidance_revised`).

---

# 6. Television & Broadcast

## 6.1 Broadcast Philosophy

Television delivers **visual authority** for major events—disasters, elections, market crashes. It complements print with shorter, repeated segments.

## 6.2 Program Types

| Program | Schedule | Content |
|---|---|---|
| Morning show | Daily 6–9 AM sim | Weather, markets preview, human interest |
| Midday bulletin | Daily 12 PM | Headlines recap |
| Evening news | Daily 6 PM | Full day summary |
| Financial close | Weekdays 4 PM | Market wrap |
| Breaking interrupt | On T3+ | Live disaster/crash coverage |
| Documentary (expansion) | Weekly | Historical deep dives from History Engine |

## 6.3 Broadcast Segment Schema

```typescript
interface BroadcastSegment {
  segmentId: UUID;
  programId: string;
  simulationAiringTime: Date;
  durationSeconds: number;
  segmentType: 'headline' | 'interview' | 'market' | 'weather' | 'breaking';
  scriptParagraphs: string[];
  sourceArticleIds?: UUID[];
  sourceEventIds: UUID[];
  visualCue: VisualCueType;         // map, chart, anchor desk
}
```

## 6.4 Player TV Interaction

When player at property with TV:

- Watch evening news (catch-up digest)
- Breaking crawl during major events
- Channel surf national vs local (coverage scope)

## 6.5 Weather & Traffic

Segments pull Weather and Transportation engine projections—same facts as simulation, packaged for broadcast.

---

# 7. Social Media Platforms

## 7.1 In-World Platforms

Abstracted platforms (not real trademarks):

| Platform | Character | Demographics |
|---|---|---|
| **Pulse** | General microblog | Broad population |
| **ProLink** | Professional network | Career/business |
| **SnapLife** | Visual stories (expansion) | Younger citizens |
| **InvestForum** | Retail investor discussion | Finance |

## 7.2 Post Generation

Posts generated from:

1. **Event reactions** — template posts from NPC personas
2. **Trend amplification** — viral loops on high sentiment topics
3. **Player actions** — if public (IPO, political run)
4. **Organic noise** — mundane posts (flavor, low significance)

## 7.3 Post Schema

```typescript
interface SocialPost {
  postId: UUID;
  platformId: string;
  authorCitizenId: string;
  simulationTime: Date;
  content: string;
  engagementScore: number;
  sourceEventId?: UUID;             // if reaction
  isVerified: boolean;              // official company/gov account
  sentiment: number;
  viralityTier: 0 | 1 | 2 | 3;
}
```

## 7.4 Virality Model

```
viralityProbability = f(authorFollowers, topicHeat, emotionalValence, novelty)
```

Viral posts may accelerate `media.sentiment_shifted` but cannot create domain events without underlying facts.

## 7.5 Player Social Presence

Player may post (optional gameplay):

- Affects Social Capital and reputation
- Public posts may trigger media pickup if significance high
- Moderation pipeline for UGC (platform layer if cross-player; local if single-player)

## 7.6 Algorithm Feed (Abstracted)

Feed ordering simulates engagement optimization:

- Player sees mix of following, trending, sponsored (company ads)
- "Doom scrolling" not optimized—meaningful posts weighted for literacy

---

# 8. Rumours & Information Asymmetry

## 8.1 Rumour Purpose

Rumours create **imperfect information**—a teachable mechanic for due diligence. Players learn to verify before acting.

## 8.2 Rumour Engine

Weekly (FSF §5.4), Rumour Engine seeds:

| Rumour Type | Truth Rate | Example |
|---|---|---|
| Merger whispers | 30% | "Meridian seeking buyer" |
| Affair gossip | 40% | "CEO marriage trouble" |
| Policy leak | 50% | "Tax hike coming" |
| Product leak | 35% | "Secret phone in development" |
| Health scare | 25% | "Politician illness" |

## 8.3 Rumour Lifecycle

```
1. media.rumour_circulated { topic, truthValue, sourceAnonymity }
2. Social posts amplify
3. IF investigative journalist assigned AND truth:
     delayed media.scandal_exposed or confirmation article
4. IF false:
     may debunk via media.article_published debunk template
5. Citizens update belief state (Citizen Engine)
```

## 8.4 Player Verification Tools

- Newspaper archive search
- SEC/public filing equivalents (Company Engine)
- Relationship insider confirmation
- Investigative journalist hire (company gameplay)

## 8.5 Market Manipulation Guardrails

Rumours alone cannot move regulated stock prices beyond `rumourVolatilityCap` (Rule Registry). Confirmed events use full market impact.

---

# 9. Journalists & Editorial AI

## 9.1 Journalist NPCs

Named journalists (T1 NPCs) belong to publications:

```typescript
interface Journalist {
  journalistId: string;
  name: string;
  publicationId: string;
  beat: NewsBeat;
  skillInvestigation: number;
  skillAccuracy: number;
  politicalLean: number;
  reputation: number;
}
```

## 9.2 Beats

| Beat | Covers |
|---|---|
| Business | Companies, markets |
| Politics | Government, policy |
| Crime | Legal events |
| Society | Weddings, obituaries |
| Tech | Sector innovation |
| Investigative | Scandals (delayed) |

## 9.3 Investigative Delay

Scandals require investigation before exposure:

```
on fraud_discovered (internal) OR rumour (true)
  → media.investigation_opened { journalistId, targetId, estimatedDays }
  → countdown based on journalist skill + target secrecy
  → on complete: media.scandal_exposed OR article clearing target
```

Player may experience **knowing before public** if they are insider—information asymmetry gameplay.

## 9.4 Scoops & Competition

Multiple publications race on major stories:

- First publisher gets `scoop` flag + reputation boost
- Follow-ups cite original via `relatedArticleId`

## 9.5 Journalist Relationships

Player cultivating journalist contacts (Social Capital) may:

- Receive early tips (ethical gameplay choice)
- Plant stories (reputation risk)
- Grant interviews post-IPO

---

# 10. Market Reports & Financial Media

## 10.1 Market Wire

Real-time (simulation day granularity) numeric feeds:

| Report | Frequency | Source Engine |
|---|---|---|
| Index levels | Hourly | Economy |
| Sector performance | Daily close | Economy |
| FX rates | Daily | Economy |
| Bond yields | Daily | Economy |
| Commodity prices | Daily | Economy |
| Housing index | Monthly | Housing |

## 10.2 Market Report Schema

```typescript
interface MarketReport {
  reportId: UUID;
  wireServiceId: string;
  simulationTime: Date;
  reportType: MarketReportType;
  figures: Record<string, number>;   // exact values from projections
  narrativeSummary?: string;         // optional template sentence
  sourceProjectionId: string;
}
```

**Critical:** Figures copied verbatim from projections—no rounding drift.

## 10.3 Analyst Coverage

AI analysts (NPCs) publish opinions:

- Opinions clearly labeled "Analysis" vs "Wire"
- Track record stored in World Memory
- Wrong calls damage analyst reputation

## 10.4 Earnings Season

Quarterly (FSF §5.6), Media Engine enters **earnings season mode**:

- Increased business section allocation
- TV financial close extended
- Social InvestForum activity spike

## 10.5 Credit Rating Actions

Banking/rating events trigger wire alerts:

```
RATING DOWNGRADE: Coastal Bank long-term debt BBB+ → BBB-
```

Linked to `banking.rating_changed` event.

---

# 11. Company News & Corporate PR

## 11.1 Official Company Channels

Public companies maintain **verified ProLink and Pulse accounts**:

- Earnings releases (simultaneous with regulatory filing event)
- Product announcements
- Executive appointments
- Crisis responses

## 11.2 PR vs Journalism

| Source | Trustworthiness | Timing |
|---|---|---|
| PR release | Biased, accurate on facts | Immediate |
| Wire report | Neutral, exact | Immediate |
| Newspaper analysis | Contextual | Next day |
| Investigative | Adversarial | Delayed |

## 11.3 Player Company PR

CEO player may:

- Draft press release (template editor)
- Choose timing vs leak risk
- Spin narrative (reputation tradeoff if contradicted by facts)

## 11.4 Regulatory Filings (Diegetic)

Public companies file **10-K equivalent** documents:

- Structured financials from Company Engine
- Accessible via in-game SEC portal
- Media articles reference filing IDs

---

# 12. Sentiment & Public Opinion

## 12.1 Sentiment Indices

Media Engine maintains rolling indices:

| Index | Scope | Range |
|---|---|---|
| Consumer confidence | National | 0–200 |
| Housing optimism | Regional | -1 to 1 |
| Sector sentiment | Per sector | -1 to 1 |
| Political approval | Per officeholder | 0–100 |
| Corporate reputation | Per public company | 0–100 |

## 12.2 Sentiment Update Rules

Sentiment updates via registered formulas—not arbitrary:

```
Δ consumerConfidence =
  α * Δ unemployment +
  β * mediaCoverageValence +
  γ * inflationSurprise
```

## 12.3 Feedback Loops

Sentiment feeds back to:

- **Government** — approval, protest probability
- **Company** — sales multiplier (bounded)
- **Citizen** — mood, relationship stress
- **Economy** — consumption propensity

All feedback through Rule Registry with caps.

## 12.4 Media.sentiment_shifted Event

```typescript
interface SentimentShiftPayload {
  indexId: string;
  previousValue: number;
  newValue: number;
  triggerArticleIds: UUID[];
  triggerEventIds: UUID[];
}
```

---

# 13. Player Information Interfaces

## 13.1 Smartphone App Suite

| App | Content |
|---|---|
| News Reader | Subscribed publications |
| Pulse | Social feed |
| ProLink | Professional network |
| MarketWatch | Wire + portfolio |
| Messages | In-world SMS (not Fenix Network) |

## 13.2 Notification Priority

| Priority | Trigger | Delivery |
|---|---|---|
| P0 | T3+ player direct, breaking disaster | Push + sound |
| P1 | T2 player adjacent | Push |
| P2 | Daily digest items | Batched |
| P3 | Background world | Silent log |

## 13.3 Information Overload Protection

Settings:

- Digest mode (daily summary only)
- Sector filters
- "Mute rumour" toggle
- Focus mode during critical player decisions

## 13.4 Accessibility

- Text-to-speech for articles
- Simplified language mode (shorter sentences, glossary links)
- High contrast news reader

---

# 14. World Memory & History Integration

## 14.1 Article Persistence

Every `media.article_published` appends to World Memory as narrative artifact with full `sourceEventIds`.

## 14.2 History Archive Handoff

History Engine indexes metadata (see Document 22)—Media retains full body.

## 14.3 Obituary Pipeline

```
citizen.died
  → History biography composed
  → media.obituary_published (derivative)
  → Society section + social memorial posts
```

## 14.4 Encyclopedia Citations

Encyclopedia entries cite articles as secondary sources—primary sources remain domain events.

---

# 15. Performance & Fidelity

## 15.1 Hot Path Rules

1. No LLM in tick path
2. Batch daily editions at day boundary
3. Template cache warmed at world init
4. Social posts sampled for T2/T3 NPCs

## 15.2 Article Volume Budgets

| World Tier | Articles/Day Max |
|---|---|
| Player-focused region | 50 |
| National aggregate | 200 |
| Social posts | 500 (sampled display: 50) |

## 15.3 Offline Catch-Up

During long absence:

- Compose catch-up digest edition (not 365 separate editions)
- Archive full editions in compressed bundle
- Player receives "Week in Review" TV segment equivalent

## 15.4 Storage

Articles stored in save blob `mediaArchive` partition with yearly compression mirroring History tiering.

---

# 16. AI Content Policy & Moderation

## 16.1 Template-First Mandate

Production hot path: **100% template** for core news.

## 16.2 Optional LLM Enhancement

Async "Extended Analysis" articles:

- Player opt-in
- Fact validator required
- Human moderation for UGC cross-player

## 16.3 Content Restrictions

- No real-world politician names ( fictional nations only)
- Violence described per age rating guidelines
- No hate speech generation toward protected classes
- Scandal content factual from simulation— not gratuitous fabrication

## 16.4 UGC Moderation (Social)

Player posts filtered:

- Profanity filter
- Real-world harassment detection
- Platform moderation queue for reports

---

# 17. Governance & Evolution

## 17.1 Adding a News Template Checklist

- [ ] Maps to event type(s)
- [ ] All placeholders sourced from payloads/projections
- [ ] Significance threshold defined
- [ ] Publication routing rules
- [ ] History indexing confirmed
- [ ] Sentiment impact documented (if any)
- [ ] Constitutional symmetry review

## 17.2 Publication Balance

Live ops monitors:

- Coverage distribution player vs AI
- Sentiment feedback loop stability
- Rumour truth rate calibration

## 17.3 Cross-References

| Topic | Document |
|---|---|
| Events | [21_Event_System.md](./21_Event_System.md) |
| History | [22_History_Engine.md](./22_History_Engine.md) |
| Multiplayer messaging | [24_Multiplayer_Architecture.md](./24_Multiplayer_Architecture.md) |
| FSF Media Engine | [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) |

---

**End of Document 23 — News Engine (FNE)**
