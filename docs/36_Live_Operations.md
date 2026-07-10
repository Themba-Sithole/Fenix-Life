# Fenix Life — Official Live Operations Document

**Document Version:** 1.0  
**Status:** Canonical — Live Ops Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Live Ops Director & Head of Product Operations  
**Audience:** Live Ops, Product, Engineering, Economy, Community, QA, Analytics, Marketing  

---

## Document Authority

This Live Operations document defines **how Fenix Life is operated after launch**—events, updates, seasonal content, economy balancing, analytics, incident response, and community coordination. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Ethical monetization, living world, long-term expansion |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, symmetry, no pay-to-win |
| [35_Content_Pipeline.md](./35_Content_Pipeline.md) | Content authoring and ship gates |
| [37_Roadmap.md](./37_Roadmap.md) | Release milestones and feature timing |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Analytics ingest, admin portal, deployment |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Analytics schema, event storage |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Live Ops Philosophy](#2-live-ops-philosophy)
3. [Organization & RACI](#3-organization--raci)
4. [Release Cadence & Update Types](#4-release-cadence--update-types)
5. [Live Events System](#5-live-events-system)
6. [Seasonal Content](#6-seasonal-content)
7. [Economy Balancing & Tuning](#7-economy-balancing--tuning)
8. [Analytics & Telemetry](#8-analytics--telemetry)
9. [A/B Testing & Feature Flags](#9-ab-testing--feature-flags)
10. [Incident Response & Player Communication](#10-incident-response--player-communication)
11. [Community & Feedback Loops](#11-community--feedback-loops)
12. [Moderation & Fair Play](#12-moderation--fair-play)
13. [Live Ops Calendar & Rituals](#13-live-ops-calendar--rituals)
14. [Governance & Ethics Guardrails](#14-governance--ethics-guardrails)

---

# 1. Executive Summary

Fenix Life is a **premium simulation intended to run for years**. Live Operations must deepen the world—not exploit players. Ops activities fall into four buckets:

| Bucket | Purpose |
|---|---|
| **Keep the lights on** | Stability, saves, hotfixes |
| **Keep the world alive** | World events, news cycles, seasonal flavour |
| **Keep the economy fair** | Balance tuning, exploit remediation |
| **Keep players heard** | Feedback, community, transparent comms |

**Live Ops north star:**

> *The world evolves. The rules stay honest. The players stay respected.*

---

# 2. Live Ops Philosophy

## 2.1 Constitution-Aligned Ops

| Allowed | Prohibited |
|---|---|
| Seasonal news themes, cosmetic packs | Pay-to-win boosts |
| Economy tuning via Rule Registry | Hidden player-only lending rates |
| Limited-time world events (systemic) | FOMO loot boxes affecting simulation |
| Quality-of-life improvements | Nerfs without communication |
| Transparent patch notes | Stealth monetization |

## 2.2 Living World Events vs Script Events

**Prefer systemic events** driven by Event Engine + Media Engine:

- Regional housing shortage
- Tech sector correction
- University ranking shakeup

**Scripted live events** require:

- FSF engine integration (not client-only)
- AI citizen participation under same rules
- World Memory archival
- Rollback plan

## 2.3 Premium Trust Contract

Players paid for depth and fairness. Live Ops protects:

1. Save integrity
2. Symmetry Principle
3. Long-term save compatibility
4. Honest patch notes

---

# 3. Organization & RACI

| Activity | Product | Live Ops | Engineering | Economy | Community | QA |
|---|---|---|---|---|---|---|
| Patch release | A | R | R | C | I | R |
| Economy hotfix | C | R | R | A | I | R |
| Seasonal content | A | R | C | C | R | R |
| Analytics review | C | R | C | R | I | I |
| Incident comms | C | R | C | I | R | I |
| Feature flags | C | R | A | C | I | R |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

---

# 4. Release Cadence & Update Types

## 4.1 Cadence (Post-Launch Steady State)

| Type | Frequency | Lead Time |
|---|---|---|
| Hotfix | As needed | 4–24 hours |
| Patch | Biweekly | 1 week |
| Minor release | Monthly | 2 weeks |
| Major release | Quarterly | 6–8 weeks |
| Expansion / DLC | 1–2× per year | 3–6 months |

## 4.2 Update Classification

| Class | Contents | Save Migration |
|---|---|---|
| **H0 Hotfix** | Crash, data loss, exploit | None if possible |
| **P Patch** | Bug fixes, QoL, balance numbers | Backward compatible |
| **M Minor** | Features, content packs | Minor migration |
| **Ma Major** | Engines, multiplayer, new cities | Planned migration |
| **X Expansion** | DLC regions, industries | Optional new world seed |

## 4.3 Release Process

```
Dev Complete → QA Sign-off → Staging → Economy Review → Release Notes → Phased Rollout → Monitor
```

**Phased rollout:** 5% → 25% → 100% over 48 hours unless hotfix.

---

# 5. Live Events System

## 5.1 Event Categories

| Category | Example | Duration |
|---|---|---|
| **Macro economic** | Recession, boom | 1–5 in-game years |
| **Regional** | City infrastructure project | 3–12 in-game months |
| **Industry** | Semiconductor shortage | 6–18 in-game months |
| **Cultural** | Film festival, sports season | Weeks |
| **Player-adjacent** | Election, tax reform | Variable |

## 5.2 Event Authoring Template

```yaml
id: live_event.regional_green_bond_2027
version: 1
type: regional
region: region.metro_avencia

triggers:
  realWorldWindow: { start: "2027-03-01", end: "2027-05-31" }
  worldConditions:
    minGDPGrowth: 0.01

effects:
  economy:
    infrastructureSpending: +0.08
    constructionJobs: +500
  media:
    headlinePack: headlines.green_bond_2027

constraints:
  aiEligible: true
  playerExclusive: false
  maxConcurrent: 1
```

## 5.3 Event Lifecycle

1. **Design** — systemic effects only
2. **Sim test** — 10 seeds × 20 years
3. **Schedule** — Live Ops calendar
4. **Activate** — Rule Registry + Event Engine
5. **Monitor** — KPIs (engagement, economy health)
6. **Archive** — World Memory + postmortem

## 5.4 News Feed Integration

Events surface in `/news` with impact tags linking to affected screens (stocks, company, real estate).

---

# 6. Seasonal Content

## 6.1 Seasonal Philosophy

Seasonal content adds **flavour and optional goals**, not power.

| Season | Theme | Content |
|---|---|---|
| Q1 | New Year, tax season | Finance tips event, filing mini-flow |
| Q2 | Graduation | University rankings, hiring surge |
| Q3 | Summer travel | Vehicle sales, tourism boost |
| Q4 | Legacy & giving | Philanthropy prompts, year-in-review |

## 6.2 Seasonal Asset Checklist

- [ ] News headline pack (Media Engine)
- [ ] Optional cosmetic UI theme (Settings toggle)
- [ ] Ambient audio variant (Audio)
- [ ] 0–1 systemic modifier (economy board approved)
- [ ] Achievement / Legacy marker (no exclusive Financial Capital)

## 6.3 Holiday Boundaries

Respect global audience—avoid single-country-only mechanics unless region-locked world.

---

# 7. Economy Balancing & Tuning

## 7.1 Balance Surfaces

| Surface | Owner | Tool |
|---|---|---|
| Industry margins | Economy | Rule Registry |
| Loan rates | Economy + Banking Engine | Spreadsheet + sim |
| AI aggression | AI Design | CDPS weights |
| Property appreciation | Housing Engine | Regional curves |
| Stock volatility | Investment Engine | Sector parameters |
| Salary bands | Career Engine | Occupation tables |

## 7.2 Tuning Workflow

```
Telemetry Alert / Player Report → Hypothesis → Spreadsheet Model → Dev Sim → Staging → Phased Deploy
```

## 7.3 Emergency Economy Hotfix Triggers

| Trigger | Action |
|---|---|
| Exploit: infinite money | H0 hotfix + rollback saves if needed |
| Industry DOM > 50% GDP | Patch margins/spawn weights |
| AI mass bankruptcy loop | Adjust lending or hiring |
| Player cohort stall at milestone | Investigate UX not just numbers |

## 7.4 Communication

All economy changes in patch notes with **player-facing explanation**, not just "adjusted balance."

---

# 8. Analytics & Telemetry

## 8.1 North Star Metrics

| Metric | Definition |
|---|---|
| **Lifetime sessions** | Median sessions per save |
| **In-game years reached** | Depth indicator |
| **Capital diversity index** | How many capitals progressed |
| **Legacy events** | Heir transitions, foundations |
| **D1/D7/D30 retention** | Platform standard |
| **Save integrity rate** | Failed loads / total |

## 8.2 Event Taxonomy (Analytics)

Per DDD §9:

| Event | Properties |
|---|---|
| `screen_view` | route, session_id |
| `decision_made` | decision_type, capital, outcome |
| `life_milestone` | milestone_id, age |
| `economy_state` | gdp, unemployment (aggregated) |
| `content_engagement` | template_id, category |

**Privacy:** No PII in analytics payloads; opt-in per Settings.

## 8.3 Dashboards

| Dashboard | Audience |
|---|---|
| Live Health | Engineering + Live Ops |
| Economy Pulse | Economy team |
| Funnel / UX | Product + UX |
| Content Performance | Content + Live Ops |

## 8.4 Simulation Analytics Engine

FSF Analytics Engine aggregates anonymized world stats for balance—never individual save inspection without consent/support ticket.

---

# 9. A/B Testing & Feature Flags

## 9.1 Flag Categories

| Flag | Example |
|---|---|
| `feature.*` | New stock order UI |
| `economy.*` | Loan rate experiment |
| `liveops.*` | Seasonal headline pack |
| `kill.*` | Disable multiplayer |

## 9.2 A/B Rules

- **Never** A/B test pay-to-win
- **Never** A/B test save format without migration path
- Max 2 concurrent economy experiments
- Minimum sample: 1000 active saves per variant
- Auto-stop if retention drops > 5% relative

## 9.3 Feature Flag Ownership

Live Ops maintains registry in admin portal; Engineering implements; Product approves.

---

# 10. Incident Response & Player Communication

## 10.1 Severity Levels

| SEV | Definition | Response Time |
|---|---|---|
| SEV1 | Save loss, payment failure, security breach | 15 min |
| SEV2 | Crash loop, major feature down | 1 hour |
| SEV3 | Degraded performance, minor feature | 4 hours |
| SEV4 | Cosmetic, non-blocking | Next patch |

## 10.2 Incident Workflow

```
Detect → Triage → Mitigate → Communicate → Fix → Postmortem → Patch Notes
```

## 10.3 Communication Channels

| Channel | Use |
|---|---|
| In-game banner | Active incidents |
| Status page | SEV1–2 |
| Discord / forums | Community updates |
| Patch notes | All fixes |

## 10.4 Compensation Policy

SEV1 affecting saves: restoration from backup + cosmetic legacy badge—**never** simulation-breaking currency gifts without economy review.

---

# 11. Community & Feedback Loops

## 11.1 Feedback Intake

| Source | Tool | SLA |
|---|---|---|
| In-game report | Ticket API | 72h ack |
| Discord | Community mods | 24h ack |
| Steam reviews | Weekly digest | — |
| Reddit / social | Monitor | — |

## 11.2 Feedback → Backlog

Weekly Live Ops triage:

1. Tag: bug / balance / feature / content
2. Link to [38_Backlog.md](./38_Backlog.md) item
3. Priority via RICE + constitution check

## 11.3 Creator Program (Future)

Safe share features: timeline export, company stats card—no raw save sharing without anti-cheat scan.

---

# 12. Moderation & Fair Play

## 12.1 Multiplayer (Fenix Network)

| Violation | Action |
|---|---|
| Cheat / save edit | Ban from network features |
| Harassment | Mute → ban |
| Market manipulation collusion | Investigation + rollback trades |

## 12.2 Single-Player

No punitive moderation; exploits patched via economy hotfix.

---

# 13. Live Ops Calendar & Rituals

## 13.1 Weekly Rituals

| Day | Ritual |
|---|---|
| Monday | Economy pulse review |
| Wednesday | Patch triage |
| Friday | Community roundup + next week preview |

## 13.2 Monthly Rituals

- Content pack release retrospective
- Analytics deep dive (retention, capital diversity)
- Roadmap sync with [37_Roadmap.md](./37_Roadmap.md)

## 13.3 Quarterly Rituals

- Major release planning
- Constitution compliance audit
- DLC / expansion go-no-go

---

# 14. Governance & Ethics Guardrails

## 14.1 Live Ops Review Checklist

| # | Question |
|---|---|
| 1 | Does this respect **Citizen Equality**? |
| 2 | Is it **systemic**, not client-only fake? |
| 3 | Does it avoid **pay-to-win**? |
| 4 | Are **AI citizens** affected under same rules? |
| 5 | Is there a **rollback** plan? |
| 6 | Will **patch notes** explain player-facing changes? |
| 7 | Does it strengthen **long-term trust**? |
| 8 | Analytics **privacy** preserved? |

## 14.2 Escalation

Constitution conflicts escalate to Creative Director + Product Lead before ship.

---

*End of Live Operations Document*
