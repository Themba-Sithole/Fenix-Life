# Fenix Life — Career & Employment Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Career & Employment Game Design Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Lead AI Designer  
**Audience:** Game Design, UX, Narrative, QA, Live Ops, Engineering (reference only)  

---

## Document Authority

This document defines **what the player experiences, decides, and sees** when building a career — job search, employment, performance, advancement, setbacks, side income, and reinvention. It is a **domain game design spec**, not an engine implementation document.

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) | Career progression, human capital, life integration |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) | Human Capital, Citizen Equality, Equal Rules |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) (14) | FSF Career integration, tick cadence |
| [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) (16) | Traits affecting career utility — ambition, sociability, adaptability |
| [05_Economy_Design.md](./05_Economy_Design.md) (05) | Labor market, wages, unemployment — player view |
| [20_Citizen_AI.md](./20_Citizen_AI.md) (20) | **Implementation authority** — career AI orchestration, symmetry pipeline |

**Hierarchy:** Player career commands (`AcceptJobOffer`, `QuitJob`, etc.) use the **same validators** as AI citizens. UI reveals more information; it does not alter outcomes.

**What this document is:**

- Job search and application player experience
- Interview flows and outcomes
- Employment dashboard and day-to-day work
- Performance reviews and promotions (employee side)
- Layoffs, furloughs, and termination (employee side)
- Side hustles and gig economy
- Unemployment and benefits
- Career switching and reskilling
- Networking and professional relationships
- Retirement and late-career transitions
- Acceptance criteria for career-facing features

**What this document is not:**

- Employer hiring UX (see Document 06)
- Education curriculum design (see Document 08 when authored)
- Citizen AI utility formulas (see Document 20)
- Company org structure (see Document 19)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy & Five Capitals Lens](#2-design-philosophy--five-capitals-lens)
3. [Player Career Mental Model](#3-player-career-mental-model)
4. [Career Lifecycle — Player Journey](#4-career-lifecycle--player-journey)
5. [Employment States & Transitions](#5-employment-states--transitions)
6. [Job Search — Player Experience](#6-job-search--player-experience)
7. [Job Board & Listings UX](#7-job-board--listings-ux)
8. [Applications — Player Flow](#8-applications--player-flow)
9. [Interviews — Player Experience](#9-interviews--player-experience)
10. [Job Offers & Negotiation](#10-job-offers--negotiation)
11. [Onboarding & First 90 Days](#11-onboarding--first-90-days)
12. [Employment Dashboard](#12-employment-dashboard)
13. [Day-to-Day Work & Tasks](#13-day-to-day-work--tasks)
14. [Performance System (Employee Side)](#14-performance-system-employee-side)
15. [Performance Reviews — Player Experience](#15-performance-reviews--player-experience)
16. [Promotions & Advancement](#16-promotions--advancement)
17. [Raises & Compensation Negotiation](#17-raises--compensation-negotiation)
18. [Layoffs & Furloughs (Employee Side)](#18-layoffs--furloughs-employee-side)
19. [Quitting & Resignation](#19-quitting--resignation)
20. [Termination & PIP (Employee Side)](#20-termination--pip-employee-side)
21. [Unemployment — Player Experience](#21-unemployment--player-experience)
22. [Side Hustles & Gig Economy](#22-side-hustles--gig-economy)
23. [Freelancing & Consulting](#23-freelancing--consulting)
24. [Career Switching & Reskilling](#24-career-switching--reskilling)
25. [Networking & Professional Relationships](#25-networking--professional-relationships)
26. [Mentorship & Sponsorship](#26-mentorship--sponsorship)
27. [Industry Reputation & References](#27-industry-reputation--references)
28. [Remote Work & Relocation](#28-remote-work--relocation)
29. [Work-Life Integration](#29-work-life-integration)
30. [Burnout & Career Health](#30-burnout--career-health)
31. [Entrepreneurship Bridge](#31-entrepreneurship-bridge)
32. [Public Sector & Union Careers](#32-public-sector--union-careers)
33. [Retirement & Late Career](#33-retirement--late-career)
34. [Career + Economy Integration](#34-career--economy-integration)
35. [Player Flows & Decision Gates](#35-player-flows--decision-gates)
36. [UI Screens & Information Architecture](#36-ui-screens--information-architecture)
37. [Notifications & Alerts](#37-notifications--alerts)
38. [Onboarding & Career Literacy](#38-onboarding--career-literacy)
39. [Automation & AI Resolve Policies](#39-automation--ai-resolve-policies)
40. [Acceptance Criteria](#40-acceptance-criteria)
41. [Edge Cases & Failure States](#41-edge-cases--failure-states)
42. [Traceability Matrix](#42-traceability-matrix)
43. [Governance & Changelog](#43-governance--changelog)

---

# 1. Executive Summary

Career is how most players **first earn Human and Financial Capital** — and how many will spend decades before (or instead of) founding companies. The career experience must feel like a **professional life simulator**: job boards with real competition, interviews that reward preparation, performance systems that respond to choices, and setbacks that teach without feeling arbitrary.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  PLAYER CAREER EXPERIENCE — STATE MACHINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   STUDENT ──► JOB SEARCH ──► EMPLOYED ──► ADVANCING ──► PEAK CAREER         │
│                  │              │              │              │              │
│                  │              ▼              ▼              ▼              │
│                  │         SIDE HUSTLE    PROMOTION      RETIREMENT        │
│                  │              │              │              │              │
│                  ▼              ▼              ▼              ▼              │
│             UNEMPLOYED ◄── LAYOFF / QUIT ──► PIVOT ──► FOUND COMPANY        │
│                                                                              │
│  Dominant UI: Careers app · Employee portal · Interview flows · HR inbox    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core player promises:**

| Promise | Player Experience |
|---|---|
| **Equal labor market** | Same openings and competition as NPCs |
| **Merit + context** | Performance matters; macro matters too |
| **Readable setbacks** | Layoff links to sector news |
| **Multiple viable paths** | Climber, specialist, hustler, founder |
| **Life integration** | Job affects stress, family, time |
| **No dead ends** | Reskilling and reinvention always available |

---

# 2. Design Philosophy & Five Capitals Lens

## 2.1 Constitutional Alignment

Per Document 01:

- **Human Capital** grows through time, effort, and challenge
- **Equal rules** — player faces same hiring standards as AI
- Player receives **no hidden career advantages**

## 2.2 Five Capitals Career Touchpoints

| Capital | Career Expression |
|---|---|
| **Human** | Skills, experience, credentials, leadership |
| **Financial** | Salary, bonuses, equity comp, side income |
| **Social** | Network, mentors, references, reputation |
| **Business** | Intrapreneurship, path to founding |
| **Legacy** | Career arc in timeline; industry impact |

## 2.3 CDPS Trait Lens (Player-Facing Hints)

Players see **aptitude hints**, not raw trait numbers:

| Trait (CDPS) | Career UX Hint |
|---|---|
| Ambition | "Driven by advancement" |
| Sociability | "Strong networker" |
| Adaptability | "Comfortable with change" |
| Discipline | "Reliable performer" |
| Risk tolerance | "Open to startup offers" |
| Integrity | "Trusted colleague" |

Traits bias interview performance and offer evaluation — player learns patterns over time.

## 2.4 Product Bible Alignment

| Bible Principle | Career Expression |
|---|---|
| Meaningful choice | Job offers differ in salary, growth, culture, commute |
| Emergence | Layoffs from sector simulation, not dice |
| Pacing | Plateaus are real; side paths available |
| Financial literacy | Real wage vs COL on every offer |
| Living world | Jobs fill and expire while player sleeps |

## 2.5 Symmetry Principle

When player clicks **Accept Job Offer**, same `AcceptJobOffer` validator runs as AI citizen `citizen-48291` (Document 20). Player chooses explicitly; AI uses utility maximization.

---

# 3. Player Career Mental Model

## 3.1 Archetypes (All Viable)

| Archetype | Fantasy | Primary Loop |
|---|---|---|
| **The Climber** | Corner office | Promotions, prestige employers |
| **The Specialist** | Mastery | Deep skills, credentials |
| **The Hustler** | Multiple income streams | Job + side gigs |
| **The Founder-in-waiting** | Build someday | Job for skills + savings |
| **The Stabilizer** | Work-life balance | Steady role, family focus |
| **The Reinventor** | Second act | Reskill after layoff |

## 3.2 Competence Curve

| Age Band | Expected Understanding |
|---|---|
| 18–22 | Apply, interview, first paycheck |
| 23–30 | Negotiate, performance, network |
| 31–45 | Promotions, pivots, leadership |
| 46–60 | Peak earnings, mentorship, succession |
| 60+ | Retirement timing, part-time |

## 3.3 Core Concepts Players Internalize

| Concept | Taught By |
|---|---|
| **Skill fit** | Application match % |
| **Market rate** | Salary band on offers |
| **Real income** | COL-adjusted disposable |
| **Performance cycle** | Quarterly reviews |
| **Network ROI** | Referral interview unlock |
| **Sector timing** | Economy labor data |
| **Runway** | Unemployment duration vs savings |

---

# 4. Career Lifecycle — Player Journey

## 4.1 Lifecycle Phases

| Phase | Typical Age | Dominant UI | Key Decisions |
|---|---|---|---|
| **Pre-career** | <18 | Education | School, skills |
| **Entry** | 18–25 | Job search | First job, city |
| **Establishment** | 25–35 | Employee portal | Specialize, switch |
| **Advancement** | 35–50 | Performance | Promotions, management |
| **Peak** | 45–60 | Executive role | Compensation, legacy |
| **Transition** | 55–70 | Retirement planner | Exit timing |
| **Post-career** | 70+ | Passive income | Consulting, board seats |

## 4.2 Career Milestones (Timeline Events)

| Milestone | Trigger |
|---|---|
| First job | Hire date |
| First promotion | Title change up |
| $100K salary (indexed) | Compensation threshold |
| Management role | First direct report |
| Industry award | Rare performance + reputation |
| Layoff survived | Reinvention |
| Retirement | Career end |

---

# 5. Employment States & Transitions

## 5.1 State Machine (Player Labels)

| State | Description | Available Actions |
|---|---|---|
| **Student** | Primary education | Work-study (limited), intern |
| **Employed** | Active job | Work, apply (quiet), quit, side hustle |
| **Searching** | Employed but looking | Applications, interviews |
| **Unemployed** | No job | Search, benefits, side hustle |
| **Interviewing** | Active pipeline | Prep, attend, withdraw |
| **Offered** | Pending decision | Accept, negotiate, decline |
| **Self-employed** | Business primary | See Document 06 |
| **Retired** | Left workforce | Consulting, board |

## 5.2 Transition Table

| From | To | Trigger |
|---|---|---|
| Student | Employed | Hire |
| Employed | Searching | Player enables search |
| Employed | Unemployed | Fired, quit, company closed |
| Unemployed | Interviewing | Application success |
| Interviewing | Offered | Interview pass |
| Offered | Employed | Accept |
| Employed | Retired | Retirement action |
| Any | Self-employed | Found company (primary) |

## 5.3 Concurrent States

| Combination | Allowed? | Notes |
|---|---|---|
| Employed + side hustle | Yes | Time/energy cost |
| Employed + founding | Yes (early) | Conflict of interest risk |
| Unemployed + self-employed | Yes | Gig while searching |
| Two full-time jobs | No | Blocked |

---

# 6. Job Search — Player Experience

## 6.1 Careers App Entry

**Route:** Smartphone → **Careers** or `/careers`

| Tab | Purpose |
|---|---|
| **My Job** | Current employment (if any) |
| **Search** | Browse/filter openings |
| **Applications** | Pipeline status |
| **Market** | Labor economy data (Doc 05) |
| **Network** | Professional contacts |
| **Skills** | Human capital profile |

## 6.2 Search Intensity (Player Control)

| Setting | Behavior |
|---|---|
| **Not looking** | Hide suggestions; passive recruiter contact only |
| **Casually browsing** | Weekly digest of matches |
| **Actively searching** | Daily new matches; auto-suggest applications |
| **Urgent** | Maximum visibility; stress ↑ if unemployed |

Unemployed players default to **Actively searching** with option to reduce (not recommended — runway warning).

## 6.3 Search Filters

| Filter | Options |
|---|---|
| Location | City, remote, hybrid |
| Sector | 12 economy sectors |
| Salary min | Slider with market guide |
| Level | Intern → executive |
| Company size | Startup → enterprise |
| Posted | 7 / 30 / 90 days |

## 6.4 Match Score

Each listing shows **Match %** based on:

- Required skills vs player skills
- Education credentials
- Experience years in domain
- Location/remote fit

Match is advisory — low match applications still possible (long shot).

## 6.5 Saved Searches & Alerts

Player saves filter sets → notification when new matching jobs post.

---

# 7. Job Board & Listings UX

## 7.1 Listing Card

```
┌──────────────────────────────────────────────────────────────┐
│ Senior Product Designer          Match: 78%    Posted: 3d ago │
│ NovaTech Inc. · Technology · Hybrid · Metro City              │
│ $95K – $115K  ·  Competitive  ·  Growth: High                │
│ Requires: UX 4+, Figma, 3yr exp                             │
│ [View] [Quick Apply] [Save]                                   │
└──────────────────────────────────────────────────────────────┘
```

## 7.2 Listing Detail Page

| Section | Content |
|---|---|
| Overview | Role summary (flavor) |
| Company | Name, size, sector, reputation badge |
| Compensation | Range + benefits summary |
| Requirements | Hard (must) vs preferred |
| Nice to have | Bonus skills |
| Culture hints | 3 tags (innovative, formal, etc.) |
| Company health | Public: revenue trend, layoff news link |
| Commute | Minutes from player residence |
| Competition | Applicants estimate |
| Similar roles | 3 recommendations |

## 7.3 Job Levels (Player-Facing)

| Level | Typical Years | Salary Band (indexed) |
|---|---|---|
| Intern | 0 | Low; learning focus |
| Entry | 0–2 | Below median |
| Mid | 3–7 | Median |
| Senior | 8–15 | Above median |
| Lead / Principal | 10+ | High |
| Director | 12+ | Very high |
| VP | 15+ | Executive |
| C-level | 18+ | Top |

Bands adjust by city COL and sector demand.

---

# 8. Applications — Player Flow

## 8.1 Application Flow

```
Select job → Review match gaps → Customize application → Submit → Track status
```

## 8.2 Application Customization

| Element | Player Choice | Effect |
|---|---|---|
| Resume emphasis | Skills to highlight | Match weight |
| Cover letter | Template + edit (flavor) | Marginal boost if quality high |
| Referral | If network contact at company | Major boost |
| Portfolio | Attach projects (creative/tech) | Sector-dependent |

## 8.3 Application Status Pipeline

| Status | Meaning | Typical Duration |
|---|---|---|
| Submitted | In queue | 1–7 days |
| Under review | HR screening | 3–14 days |
| Interview | Invited | Schedule |
| Rejected | No proceed | Terminal |
| Offer | Success | Decision gate |
| Withdrawn | Player cancelled | Terminal |

## 8.4 Bulk Apply (Quality Trade-off)

**Quick Apply** submits with defaults — faster but lower customization bonus.

| Method | Speed | Success modifier |
|---|---|---|
| Custom application | Slow | Baseline |
| Quick apply | Fast | −10% screening pass |
| Referral apply | Medium | +25% if contact strong |

## 8.5 Application Limits

| Constraint | Value | Rationale |
|---|---|---|
| Active applications | 20 max | Prevent spam |
| Per company | 1 role at a time | Realism |
| Reapply cooldown | 6 months after reject | Unless new opening |

---

# 9. Interviews — Player Experience

## 9.1 Interview Types

| Type | Format | Player Skill Tested |
|---|---|---|
| Phone screen | 3–5 choice cards | Communication, salary alignment |
| Technical | Scenario choices | Domain skills |
| Behavioral | STAR-style picks | Culture, integrity |
| Panel | Multiple interviewers | Composure |
| Case study | Business problem | Analysis, creativity |
| Executive | High-level vision | Leadership (senior roles) |

## 9.2 Interview Flow

```
Notification: Interview scheduled (date/time)
  → Optional: Prep actions (study, mock, network tip)
  → Interview session (5–12 decision cards)
  → Outcome: Advance / Reject / Hold
  → Feedback (partial — real world ambiguity)
```

## 9.3 Prep Actions (Before Interview)

| Action | Cost | Effect |
|---|---|---|
| Research company | 2 hours time | +culture questions |
| Skill refresh | Course or study | +technical |
| Mock interview | Money or mentor | +behavioral |
| Rest | Skip prep | Stress ↓, performance neutral |
| Network intel | Contact at company | +inside tips |

## 9.4 Interview Card Example (Behavioral)

> *"Tell me about a time you missed a deadline."*

| Choice | Trait Lean | Outcome Weight |
|---|---|---|
| Blame external factors | Low integrity | Negative |
| Explain honestly + learning | High integrity | Positive |
| Deflect with humor | High sociability | Mixed |
| Refuse to answer | — | Negative |

## 9.5 Interview Performance Factors

| Factor | Source |
|---|---|
| Skill match | Human capital |
| Traits | CDPS (confidence, sociability) |
| Prep | Player actions |
| Stress | Life stats |
| Random noise | Bounded — never sole determinant |

## 9.6 Multi-Round Interviews

Senior roles require 2–4 rounds over 2–6 weeks game time.

Player may **withdraw** mid-process — no penalty except time lost.

---

# 10. Job Offers & Negotiation

## 10.1 Offer Package Display

```
┌──────────────────────────────────────────────────────────────┐
│ OFFER: Senior Product Designer @ NovaTech                    │
├──────────────────────────────────────────────────────────────┤
│ Base salary:     $108,000  (75th percentile for role)        │
│ Signing bonus:   $5,000                                    │
│ Equity:          0.05% (4yr vest)                            │
│ Start date:      Aug 15, 2026                              │
│ Remote:          Hybrid (3 days office)                      │
│ Benefits:        Health, 401k match 4%, 20 PTO days          │
├──────────────────────────────────────────────────────────────┤
│ Real disposable vs current:  +$420/mo (after COL & commute)  │
│ Company outlook:             Growing sector ▲                │
├──────────────────────────────────────────────────────────────┤
│ [Accept] [Negotiate] [Decline] [Compare to current]          │
└──────────────────────────────────────────────────────────────┘
```

## 10.2 Offer Comparison Tool

Side-by-side up to 3 offers:

| Dimension | Offer A | Offer B |
|---|---|---|
| Nominal salary | | |
| Real disposable | | |
| Growth potential | | |
| Commute time | | |
| Culture fit | | |
| Stability | | |

## 10.3 Negotiation Flow

| Negotiable | Typical Range |
|---|---|
| Base salary | ±5–15% |
| Signing bonus | ±0–$20K |
| Equity | ±0–50% of initial |
| Start date | ±4 weeks |
| Remote days | Hybrid flexibility |
| Title | ±1 level (rare) |

**Negotiation mini-game:**

1. Player selects item to negotiate
2. System shows **leverage indicator** (market, competing offers, company urgency)
3. Player chooses tone: collaborative / firm / aggressive
4. Counter-offer or hold firm
5. 1–3 rounds max

Aggressive with low leverage risks **offer rescind** (rare but possible).

## 10.4 Decline Offer

Optional feedback (flavor) — affects nothing mechanically unless burning bridge (rare company).

## 10.5 Offer Expiry

Offers expire in 5–10 game days — decision gate on Time Engine.

---

# 11. Onboarding & First 90 Days

## 11.1 First Week

| Event | Player Experience |
|---|---|
| Welcome email | Diegetic inbox |
| Paperwork | Benefits selection (health plan, 401k %) |
| Team intro | Relationship seeds with coworkers |
| First tasks | Light work assignments |

## 11.2 Probation Period

| Duration | 1–6 months by level |
|---|---|
| Performance | Below normal expectations |
| Failure risk | Higher if tasks neglected |
| Success | Full employee status |

## 11.3 30-60-90 Plan (Optional)

Player sets goals — affects first review rating if completed.

---

# 12. Employment Dashboard

## 12.1 Route

**Employed:** `/careers/my-job` or Employee Portal on smartphone

## 12.2 Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Senior Product Designer · NovaTech          Tenure: 1.2 yr  │
│ Manager: Alex Chen · Dept: Product · Performance: Exceeds   │
├──────────────────────────────────────────────────────────────┤
│ Salary $108K  │  Next review: Oct  │  PTO: 12 days left     │
├───────────────────────────────┬──────────────────────────────┤
│ THIS WEEK'S PRIORITIES        │ CAREER PATH                  │
│ □ Ship feature spec           │ Next: Lead Designer (2yr est)│
│ □ Mentor junior               │ Skills gap: Leadership 62→75 │
│ □ 1:1 with manager            │ [Training] [Network]         │
├───────────────────────────────┴──────────────────────────────┤
│ [Request raise] [Apply internal] [Side hustle] [Quit]        │
└──────────────────────────────────────────────────────────────┘
```

## 12.3 Three-Number Rule (Employment)

| KPIs | Why |
|---|---|
| **Salary (real)** | Compensation health |
| **Performance rating** | Advancement trajectory |
| **Next milestone** | Career direction |

---

# 13. Day-to-Day Work & Tasks

## 13.1 Work Task System

Weekly batch of 2–5 **work priorities** — not micromanagement sim, but meaningful choices:

| Task Type | Effect |
|---|---|
| Core delivery | Performance ↑ |
| Collaboration | Relationships ↑ |
| Innovation | Skill + reputation |
| Overtime | Output ↑, stress ↑, health ↓ |
| Slack | Stress ↓, performance ↓ |

## 13.2 Time Allocation

| Allocation | Weekly Hours | Trade-off |
|---|---|---|
| Standard | 40 | Balanced |
| Overtime | 50+ | Career boost, burnout risk |
| Reduced (if allowed) | 32 | Family time, slower promotion |

## 13.3 Manager Relationship

Manager NPC has relationship meter — affects reviews, promotions, layoff vulnerability.

---

# 14. Performance System (Employee Side)

## 14.1 Performance Rating Scale

| Rating | Label | Distribution Target |
|---|---|---|
| 5 | Exceptional | 5% |
| 4 | Exceeds | 20% |
| 3 | Meets | 60% |
| 2 | Below | 12% |
| 1 | Unsatisfactory | 3% |

Forced distribution at large companies — player can be caught in curve.

## 14.2 Performance Drivers

| Driver | Weight |
|---|---|
| Task completion | 35% |
| Skill level for role | 25% |
| Manager relationship | 15% |
| Company health | 10% |
| Random variance | 5% |
| Traits (discipline) | 10% |

## 14.3 Performance History

Chart of ratings over tenure — visible on internal profile.

---

# 15. Performance Reviews — Player Experience

## 15.1 Review Flow (Employee)

```
Notification: Review period opens
  → Self-assessment (optional choices)
  → Manager meeting (dialogue cards)
  → Rating revealed
  → Compensation outcome (raise/bonus/none)
  → Goals set for next period
```

## 15.2 Self-Assessment Choices

Player highlights accomplishments — must align with actual task history (system validates).

## 15.3 Review Outcomes

| Outcome | Effects |
|---|---|
| Exceeds + raise | Salary ↑, morale ↑ |
| Meets | Stable |
| Below | PIP risk, no raise |
| Unsatisfactory | PIP or termination track |

---

# 16. Promotions & Advancement

## 16.1 Promotion Paths

| Path | Requirements |
|---|---|
| **Vertical** | Higher title, same track |
| **Lateral** | New dept, similar level |
| **Leadership** | Management track |
| **Technical** | IC expert track |

## 16.2 Promotion Eligibility Card

| Criterion | Player Status |
|---|---|
| Tenure minimum | ✓ 18 months |
| Performance avg | ✓ 3.8 |
| Skill thresholds | Leadership 72/75 needed |
| Opening available | 1 slot |
| Manager sponsorship | Required |

## 16.3 Internal Application

Compete with NPC internal candidates — same interview flow as external.

## 16.4 Promotion Decision Gate

Manager + HR approval — player notified of success/failure with **actionable gaps**.

---

# 17. Raises & Compensation Negotiation

## 17.1 Raise Request Flow

| Step | Player Action |
|---|---|
| Initiate | Careers → Request raise |
| Justification | Select accomplishments |
| Timing | Company budget cycle matters |
| Outcome | Accept counter or wait |

## 17.2 Raise Factors

| Factor | Effect |
|---|---|
| Performance | Primary |
| Market wage index | COL adjustment pressure |
| Company profitability | Budget available |
| Macro environment | Recession freezes |
| Negotiation skill | Marginal |

## 17.3 Bonus & Equity

| Type | Timing |
|---|---|
| Annual bonus | Performance + company |
| Spot bonus | Project win |
| RSU refresh | Senior roles |
| Promotion equity | Level change |

---

# 18. Layoffs & Furloughs (Employee Side)

## 18.1 Warning Signs (Player-Visible)

| Signal | Source |
|---|---|
| Company layoff news | Media |
| Dept budget cut | Insider network |
| Manager tension | Relationship |
| Performance fine but sector bad | Economy |

## 18.2 Layoff Notification Flow

```
Email/notification: "Workforce reduction"
  → Severance package details
  → Benefits continuation period
  → Final day
  → Timeline event: "Laid off from NovaTech"
  → State → Unemployed
  → Optional: emotional processing (stress event)
```

## 18.3 Severance Package Display

| Element | Typical |
|---|---|
| Weeks pay per year tenure | 1–2 weeks |
| COBRA analog | Health continuation |
| Outplacement | Skill resources (sometimes) |
| Stock vesting | Acceleration (rare) |

## 18.4 Layoff Survival Factors

Not purely random — influenced by:

- Performance rating
- Tenure
- Role criticality
- Dept selected for cut
- Manager advocacy (relationship)

Player with high performance in critical role may survive while dept cut around them.

## 18.5 Furlough

Temporary unpaid leave — job retained, reduced income, benefits may pause.

---

# 19. Quitting & Resignation

## 19.1 Quit Flow

```
Careers → Quit → Select reason (flavor) → Notice period → Last day → Unemployed or new job
```

## 19.2 Notice Period

| Level | Typical Notice |
|---|---|
| Entry | 2 weeks |
| Senior | 4 weeks |
| Executive | 1–3 months |

Player may **burn bridge** — leave immediately with reputation hit.

## 19.3 Quit Consequences

| Stakeholder | Effect |
|---|---|
| Employer | Relationship ends |
| Network | Contacts may disapprove if abrupt |
| Reference | Future applications affected |
| Vesting | Unvested equity forfeited |
| Stress | Often ↓ short-term |

---

# 20. Termination & PIP (Employee Side)

## 20.1 PIP Flow (Employee)

```
Performance below → PIP issued → 60–90 day goals → Check-ins → Pass or terminate
```

Player chooses effort level during PIP — affects pass probability.

## 20.2 Termination for Cause

| Cause | Consequence Severity |
|---|---|
| Performance | Standard |
| Misconduct | Reputation hit, industry blacklist risk |
| Layoff | Neutral |
| Company closure | Neutral |

---

# 21. Unemployment — Player Experience

## 21.1 Unemployment Dashboard

**Route:** `/careers/unemployment`

| Section | Content |
|---|---|
| Duration | Weeks unemployed |
| Runway | Savings / expenses |
| Benefits | Eligibility, weekly amount |
| Search status | Applications active |
| Skill plan | Reskilling suggestions |
| Mental health | Stress indicator (life stat) |

## 21.2 Unemployment Benefits (If Jurisdiction Has UI)

| Requirement | Player Must |
|---|---|
| Eligibility | Prior employment duration |
| Active search | Min applications/week |
| Not refuse suitable work | Accept or lose benefits |

## 21.3 Unemployment Phases

| Week | UI Emphasis |
|---|---|
| 1–4 | Active search, network |
| 5–12 | Broaden criteria, side hustle |
| 13–26 | Reskilling, relocation |
| 26+ | Career pivot wizard |

## 21.4 Stigma & Morale

Long unemployment affects:

- Confidence (CDPS evolution)
- Interview performance
- Family stress
- Optional depression arc (tasteful, with support resources)

---

# 22. Side Hustles & Gig Economy

## 22.1 Side Hustle Entry

| Requirement | Rule |
|---|---|
| Age | 18+ |
| Time | Enough energy after main job |
| Conflict | Some employers prohibit |

## 22.2 Side Hustle Types

| Type | Income | Time | Risk |
|---|---|---|---|
| Rideshare/delivery | Variable | High | Low |
| Freelance gigs | Project-based | Medium | Medium |
| Tutoring | Hourly | Low | Low |
| Content creation | Slow build | High | Low |
| Reselling | Margin-based | Medium | Medium |
| Weekend retail | Hourly | Medium | Low |

## 22.3 Side Hustle Dashboard

| Metric | Display |
|---|---|
| Monthly side income | Cash flow |
| Hours invested | Time cost |
| Reputation | Platform rating |
| Tax reminder | Quarterly estimated (link banking) |

## 22.4 Gig Economy Index

Tied to consumer confidence (Doc 05) — gig demand rises in expansion, falls in recession.

---

# 23. Freelancing & Consulting

## 23.1 Full-Time Freelance Transition

Player may leave employment for **independent contractor** status:

| Pro | Con |
|---|---|
| Higher hourly potential | No benefits |
| Flexibility | Income volatility |
| Multiple clients | Self-employment tax |

## 23.2 Client Acquisition

| Channel | Effect |
|---|---|
| Network referrals | Best rates |
| Platform marketplace | Volume, lower rates |
| Cold outreach | Slow |
| Reputation | Inbound leads |

---

# 24. Career Switching & Reskilling

## 24.1 Pivot Wizard

**Route:** `/careers/pivot`

```
Step 1: Current skills & experience inventory
Step 2: Target role/sector selection
Step 3: Gap analysis (skills, credentials, network)
Step 4: Reskilling plan (courses, timeline, cost)
Step 5: Transition strategy (gradual vs hard switch)
```

## 24.2 Reskilling Options

| Option | Duration | Cost | Effect |
|---|---|---|---|
| Online course | 1–3 months | $ | +skill |
| Bootcamp | 3–6 months | $$$ | +skill fast |
| Degree | Years | $$$$ | Credential gate |
| Internal transfer | 6–12 months | Time | Lower risk |
| Entry-level reset | Immediate | Ego | New track |

## 24.3 Career Switch Success Factors

| Factor | Impact |
|---|---|
| Adaptability trait | Faster transition |
| Financial runway | Tolerate income dip |
| Network in target sector | Interview access |
| Macro timing | Sector demand |
| Age | Mild bias in some industries (realistic, not blocking) |

---

# 25. Networking & Professional Relationships

## 25.1 Network Graph

**Route:** `/careers/network`

| Contact Type | Value |
|---|---|
| Coworker | Internal mobility |
| Alumni | Referrals |
| Industry peer | Market intel |
| Recruiter | Openings |
| Mentor | Guidance, sponsorship |
| Executive | Rare doors |

## 25.2 Networking Actions

| Action | Frequency | Cost | Effect |
|---|---|---|---|
| Coffee chat | Weekly limit 2 | Time | Relationship ↑ |
| Industry event | Monthly | Money + time | Multiple contacts |
| LinkedIn analog message | Unlimited | Low | Weak tie |
| Referral request | Per job | Relationship cost | Application boost |
| Thank you note | After interview | Low | Marginal |

## 25.3 Relationship Decay

Contacts fade without interaction — notification: "Haven't spoken to [Name] in 6 months"

## 25.4 Networking Events Calendar

City events listed on Careers app — player RSVPs and attends (time block).

---

# 26. Mentorship & Sponsorship

## 26.1 Mentor Relationship

| Stage | Benefit |
|---|---|
| New | Career advice |
| Established | Skill boost |
| Strong | Sponsorship for promotion |

Player may **seek mentor** or **become mentor** (late career, Human Capital legacy).

## 26.2 Sponsorship

Senior contact actively advocates for player promotion — visible as "Sponsored by [Name]" on eligibility card.

---

# 27. Industry Reputation & References

## 27.1 Reputation Layers

| Layer | Scope |
|---|---|
| Employer reputation | Internal |
| Industry reputation | Sector-wide |
| Public reputation | Media (if notable) |

## 27.2 References

On application, player selects references:

| Reference | Strength |
|---|---|
| Recent manager | High |
| Skip-level | Medium |
| Peer | Low |
| Academic | Entry only |

Bad relationships → weak or negative reference (hidden until outcome).

---

# 28. Remote Work & Relocation

## 28.1 Remote Policy Types

| Policy | Commute | COL Impact |
|---|---|---|
| Onsite | Full | Local COL |
| Hybrid | Partial | Local COL |
| Remote | None | May use home location |
| Remote with geo pay | None | Employer-adjusted salary |

## 28.2 Relocation for Job

Integrated with Document 05 relocation flow:

- Offer includes relocation package (sometimes)
- COL comparison
- Spouse job market (if applicable)

---

# 29. Work-Life Integration

## 29.1 Life Stat Effects

| Work Choice | Life Impact |
|---|---|
| Overtime | Stress ↑, family ↓, health ↓ |
| Promotion | Income ↑, stress ↑, time ↓ |
| Unemployment | Stress ↑, family tension |
| Dream job | Happiness ↑ |
| Toxic job | Health ↓, relationship ↓ |

## 29.2 Family Career Conflicts

| Scenario | Gameplay |
|---|---|
| New parent | Reduced availability; employer reaction varies |
| Caregiving | Leave options; career pause |
| Dual career household | Relocation negotiation |
| Partner unemployment | Financial pressure |

---

# 30. Burnout & Career Health

## 30.1 Burnout Meter

Visible when stress sustained high:

| Stage | Effects |
|---|---|
| Mild | Performance variance |
| Moderate | Sick days, errors |
| Severe | Forced leave, quit urge |
| Collapse | Health event gate |

## 30.2 Recovery Actions

| Action | Effect |
|---|---|
| Vacation (PTO) | Stress ↓ |
| Therapy | Stress ↓, resilience ↑ |
| Job change | Reset if toxic |
| Reduce hours | If available |

CDPS: burnout shifts ambition, discipline (Document 16).

---

# 31. Entrepreneurship Bridge

## 31.1 Employee → Founder Paths

| Path | Trigger |
|---|---|
| Side project → company | Document 06 |
| Intrapreneurship | Internal venture (rare) |
| Acquihire | Startup acquired, player becomes employee |
| Sabbatical to found | Leave of absence |

## 31.2 Non-Compete (If Applicable)

Some employment contracts block competing business — shown at hire, enforced on founding attempt.

---

# 32. Public Sector & Union Careers

## 32.1 Public Sector

| Attribute | Difference |
|---|---|
| Job security | Higher |
| Pay | Lower peak, steady |
| Pension | Defined benefit analog |
| Politics | Budget cuts risk |

## 32.2 Union Jobs

| Attribute | Difference |
|---|---|
| Seniority | Promotion order |
| Collective bargaining | Scheduled raises |
| Strike events | Rare world events |

---

# 33. Retirement & Late Career

## 33.1 Retirement Eligibility

| Factor | Display |
|---|---|
| Age | 62–67 typical range |
| Savings | Retirement account balance |
| Pension | If applicable |
| Social security analog | Projected benefit |
| Healthcare | Pre-Medicare gap warning |

## 33.2 Retirement Decision Gate

```
Retirement planner shows:
  - Projected annual income in retirement
  - COL coverage years
  - Legacy options (consulting, board, family)
  - [Retire now] [Work 1 more year] [Part-time transition]
```

## 33.3 Post-Retirement Income

| Source | Activity Level |
|---|---|
| Pension/SS | Passive |
| Investments | Passive |
| Consulting | Active, flexible |
| Board seats | Network-dependent |
| Part-time | Low hours |

---

# 34. Career + Economy Integration

## 34.1 Macro → Career Effects

| Macro Signal | Career Impact |
|---|---|
| Recession | Layoffs ↑, hiring ↓, raise freezes |
| Expansion | Hiring ↑, poaching, bidding wars |
| Sector boom | Premium salaries in sector |
| Rate hikes | Finance/real estate layoffs |
| Inflation | Real wage squeeze |

## 34.2 Player Economic Literacy in Career

Every offer shows:

- Nominal salary
- Estimated taxes (rough)
- Real disposable income vs current
- COL if relocation

---

# 35. Player Flows & Decision Gates

## 35.1 Flow: Graduate → First Job

```
Education complete → Careers app tutorial → Job search (entry level)
  → Apply to 3–5 → Interview → Offer → Accept → First paycheck → Budget setup
```

## 35.2 Flow: Layoff → Recovery

```
Layoff notification → Unemployment dashboard → Benefits application
  → Intensified search → Side hustle optional → Interview → New offer
  → Timeline: "Reemployed after X weeks"
```

## 35.3 Flow: Career Pivot

```
Dissatisfied / laid off → Pivot wizard → Reskilling plan → Complete courses
  → Entry-level applications in new field → Progression restart
```

## 35.4 Decision Gate Table

| Gate | Blocking | Trigger |
|---|---|---|
| Job offer response | Yes | Offer received |
| PIP acknowledgment | Soft | PIP issued |
| Retirement confirm | Yes | Player initiates |
| Relocation accept | Yes | Offer with move |
| Non-compete warning | Soft | Found company while employed |

---

# 36. UI Screens & Information Architecture

## 36.1 Screen Registry

| Screen | Route | Primary Decision |
|---|---|---|
| Careers home | `/careers` | "What's my career status?" |
| Job search | `/careers/search` | "Where should I apply?" |
| Applications | `/careers/applications` | "How's my pipeline?" |
| Interview | `/careers/interview/:id` | "How do I respond?" |
| Offer | `/careers/offer/:id` | "Should I accept?" |
| My job | `/careers/my-job` | "How am I performing?" |
| Unemployment | `/careers/unemployment` | "How do I survive and find work?" |
| Network | `/careers/network` | "Who can help me?" |
| Pivot | `/careers/pivot` | "How do I change fields?" |
| Retirement | `/careers/retirement` | "Can I afford to stop?" |

## 36.2 Smartphone Careers App Icon

On phone home screen — badge shows pending offers, interviews, reviews.

---

# 37. Notifications & Alerts

| Tier | Career Examples |
|---|---|
| P0 | Termination, offer expiring today |
| P1 | Interview tomorrow, layoff news at employer |
| P2 | Application status change, network event |
| P3 | Weekly job digest |

---

# 38. Onboarding & Career Literacy

## 38.1 First Job Tutorial

| Step | Lesson |
|---|---|
| Browse listings | Match score meaning |
| Apply | Customization matters |
| Interview | Choices have consequences |
| Offer | Real vs nominal pay |
| Work tasks | Performance link |

## 38.2 Career Glossary

Terms: probation, vesting, severance, COL, PIP — Document 41 links.

---

# 39. Automation & AI Resolve Policies

Per Document 20, player may configure offline behavior:

| Setting | Behavior |
|---|---|
| **Manual** | All offers/interviews wait for player |
| **Conservative** | Auto-reject offers below current comp |
| **Ambitious** | AI accepts better offers via utility |
| **Crisis** | Auto-accept first viable if runway < 1 mo |

Settings in `/settings` → Career Automation.

**Symmetry note:** AI citizens use same utility function — automation is explicit player consent to AI pipeline.

---

# 40. Acceptance Criteria

## 40.1 Job Search & Apply

| ID | Criterion | Test |
|---|---|---|
| CAR-UX-001 | Player can search, filter, apply within Careers app | E2E |
| CAR-UX-002 | Match score displays on listings | UI |
| CAR-UX-003 | Application status pipeline updates on time advance | Sim |
| CAR-UX-004 | Quick apply has lower success than custom | Scenario |
| CAR-UX-005 | 20 active application cap enforced | Functional |

## 40.2 Interviews & Offers

| ID | Criterion | Test |
|---|---|---|
| CAR-INT-001 | Interview presents 5+ meaningful choices | Content |
| CAR-INT-002 | Prep actions affect interview outcomes | Sim |
| CAR-INT-003 | Offer shows real disposable income comparison | Functional |
| CAR-INT-004 | Negotiation changes compensation within bounds | Sim |
| CAR-INT-005 | Offer expiry creates decision gate | Time engine |
| CAR-INT-006 | Accept uses same validator as AI (symmetry) | Integration |

## 40.3 Employment & Performance

| ID | Criterion | Test |
|---|---|---|
| CAR-EMP-001 | Employment dashboard shows salary, performance, tenure | UI |
| CAR-EMP-002 | Weekly work tasks affect performance rating | Sim |
| CAR-EMP-003 | Review cycle produces raise or freeze | Scenario |
| CAR-EMP-004 | Promotion eligibility card shows gaps | Functional |

## 40.4 Layoffs & Unemployment

| ID | Criterion | Test |
|---|---|---|
| CAR-LAY-001 | Layoff notification includes severance details | Content |
| CAR-LAY-002 | Performance affects layoff survival probability | Sim |
| CAR-LAY-003 | Unemployment dashboard tracks duration and runway | UI |
| CAR-LAY-004 | Benefits require active search if jurisdiction has UI | Functional |

## 40.5 Side Hustles & Pivot

| ID | Criterion | Test |
|---|---|---|
| CAR-SIDE-001 | Side hustle income requires time investment | Sim |
| CAR-SIDE-002 | Pivot wizard produces gap analysis | Functional |
| CAR-PIV-001 | Reskilling courses increase skill ratings | Integration |

## 40.6 Networking & Retirement

| ID | Criterion | Test |
|---|---|---|
| CAR-NET-001 | Referral boosts application success | Sim |
| CAR-NET-002 | Contacts decay without interaction | Time sim |
| CAR-RET-001 | Retirement planner shows income projection | UI |
| CAR-RET-002 | Retirement transitions player to post-career state | E2E |

---

# 41. Edge Cases & Failure States

| Scenario | Expected UX |
|---|---|
| Accept two full-time offers | Second blocked |
| Interview while employed — employer discovers | Reputation risk (rare) |
| All skills maxed | Diminishing returns; leadership matters |
| Age discrimination analog | Hint only; illegal to block — softer interview pass rates at extreme age in some sectors (tunable, disclosed in settings) |
| Player rejects every offer 12 months | Unemployment extended; family stress |
| Company closes day before start | Offer void; apology notification |
| Network friend is hiring manager | Conflict of interest handled fairly |

---

# 42. Traceability Matrix

| Bible | Constitution | CDPS | Doc 20 | This Doc |
|---|---|---|---|---|
| §8 Career Capital | Human Capital | §8.4 Career | §13 Career AI | §4–17 |
| §11 Labor market | Equal rules | Traits | Job utility | §6–10 |
| §10 Living World | — | Memories | Offline AI | §21 Unemployment |
| Pillar I Life | — | Burnout | Stress | §29–30 |
| §12 Business bridge | Business Capital | Entrepreneurial | §18 Entrepreneurship | §31 |

---

# 43. Governance & Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-07-10 | Initial canonical release |

---

*End of Document 07 — Career & Employment Design*
