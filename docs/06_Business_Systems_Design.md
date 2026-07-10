# Fenix Life — Business Systems Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Business & Entrepreneurship Game Design Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer  
**Audience:** Game Design, UX, Narrative, QA, Live Ops, Engineering (reference only)  

---

## Document Authority

This document defines **what the player experiences, decides, and sees** when founding, operating, growing, financing, and exiting companies in Fenix Life. It is a **domain game design spec**, not an engine implementation document.

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) | Business pillar, entrepreneurship fantasy |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) | Business Capital, Citizen Equality, Symmetry |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) (14) | FSF Company Engine §4.6 |
| [05_Economy_Design.md](./05_Economy_Design.md) (05) | Player-facing macro context for business timing |
| [19_Company_Simulation.md](./19_Company_Simulation.md) (19) | **Implementation authority** — corporate model, P&L, NPC AI |

**Hierarchy:** Player-facing business UX must reflect identical rules for player-owned and NPC-owned companies. UI affordances (dashboards, alerts, delegation) never confer simulation advantages.

**What this document is:**

- Incorporation and company founding player flow
- Company dashboard decisions and information hierarchy
- Hiring, HR, and people management UX
- Product development and launch player experience
- Marketing and sales choices
- Fundraising and investor relations player flows
- IPO and exit experiences
- Board governance from the founder/CEO perspective
- Failure, restructuring, and bankruptcy player journeys
- Acceptance criteria for business-facing features

**What this document is not:**

- P&L formulas, cap table math, or valuation models (see Document 19)
- Personal career job search (see Document 07)
- Banking ledger implementation (see Document 11 when authored)
- Securities trading mechanics (see Document 12 when authored)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy & Five Capitals Lens](#2-design-philosophy--five-capitals-lens)
3. [Player Business Mental Model](#3-player-business-mental-model)
4. [Company Lifecycle — Player Journey](#4-company-lifecycle--player-journey)
5. [Founding & Incorporation Flow](#5-founding--incorporation-flow)
6. [Company Dashboard — Command Center](#6-company-dashboard--command-center)
7. [Role Progression: Founder to Chairman](#7-role-progression-founder-to-chairman)
8. [Departments & Decision Surfaces](#8-departments--decision-surfaces)
9. [Org Structure & Headcount Planning](#9-org-structure--headcount-planning)
10. [Hiring UX — End to End](#10-hiring-ux--end-to-end)
11. [Employee Management & Culture](#11-employee-management--culture)
12. [Performance Reviews & Promotions (Employer Side)](#12-performance-reviews--promotions-employer-side)
13. [Layoffs & Restructuring (Employer Side)](#13-layoffs--restructuring-employer-side)
14. [Compensation & Payroll Decisions](#14-compensation--payroll-decisions)
15. [Products & Services — Player Experience](#15-products--services--player-experience)
16. [R&D & Innovation Pipeline](#16-rd--innovation-pipeline)
17. [Product Launch Flow](#17-product-launch-flow)
18. [Pricing Strategy Choices](#18-pricing-strategy-choices)
19. [Manufacturing & Operations (Player View)](#19-manufacturing--operations-player-view)
20. [Marketing & Brand Decisions](#20-marketing--brand-decisions)
21. [Sales Channels & Revenue](#21-sales-channels--revenue)
22. [Financial Management Dashboard](#22-financial-management-dashboard)
23. [Fundraising — Player Flow](#23-fundraising--player-flow)
24. [Investor Relations & Cap Table UX](#24-investor-relations--cap-table-ux)
25. [Board of Directors — Player Experience](#25-board-of-directors--player-experience)
26. [Initial Public Offering — Player Experience](#26-initial-public-offering--player-experience)
27. [M&A & Acquisitions (Player Initiated)](#27-ma--acquisitions-player-initiated)
28. [Competition & Market Position](#28-competition--market-position)
29. [Corporate Reputation & Ethics](#29-corporate-reputation--ethics)
30. [Bankruptcy & Dissolution](#30-bankruptcy--dissolution)
31. [Delegation & Automation](#31-delegation--automation)
32. [Multi-Company & Portfolio Management](#32-multi-company--portfolio-management)
33. [Business + Life Integration](#33-business--life-integration)
34. [Player Flows & Decision Gates](#34-player-flows--decision-gates)
35. [UI Screens & Information Architecture](#35-ui-screens--information-architecture)
36. [Notifications & Alerts](#36-notifications--alerts)
37. [Onboarding & Business Literacy](#37-onboarding--business-literacy)
38. [Acceptance Criteria](#38-acceptance-criteria)
39. [Edge Cases & Failure States](#39-edge-cases--failure-states)
40. [Traceability Matrix](#40-traceability-matrix)
41. [Governance & Changelog](#41-governance--changelog)

---

# 1. Executive Summary

Building a company is Fenix Life's **highest-expression mastery path** — combining people, product, capital, and strategy inside the same rules the world uses. Players do not click "MAKE MONEY." They incorporate, hire, build, market, fundraise, govern, and sometimes fail — all through **diegetic executive dashboards** that feel like running real software.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PLAYER BUSINESS EXPERIENCE — STAGE MAP                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SOLO / PRE-REV     EARLY STAGE        GROWTH           MATURE / EXIT       │
│  ─────────────      ───────────        ──────           ─────────────       │
│  Idea validation    First hires        Departments      Board politics      │
│  Incorporation      MVP launch         Fundraising      IPO roadshow        │
│  Bootstrapping      Runway anxiety     Scaling pain     M&A offers          │
│                                                                              │
│  Dominant UI:       Dominant UI:       Dominant UI:     Dominant UI:        │
│  Founder notebook   Company dash       Dept dashboards  Investor relations  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core player promises:**

| Promise | Player Experience |
|---|---|
| **Same rules as NPCs** | Competitor layoffs use identical mechanics |
| **People matter** | Bad hire hurts; great culture retains |
| **Dilution is real** | Cap table visualization on every round |
| **Consequence chains** | Rushed launch → bad reviews → hiring harder |
| **Delegation scales** | 500 employees ≠ 500 micro-decisions required |
| **Life integration** | Burnout, family, and net worth interlock |

---

# 2. Design Philosophy & Five Capitals Lens

## 2.1 Constitutional Alignment

Per Document 01, Business Capital is earned through **institutional building**, not stat inflation. The player interface must show:

- Enterprise value as outcome of operations, not arbitrary level-ups
- Reputation as slow asset, fast liability
- Employment impact on real citizens (names, not "Worker #4")

## 2.2 Five Capitals Business Touchpoints

| Capital | Primary Business UX | Life Crossover |
|---|---|---|
| **Business** | Company dashboard, cap table, market share | Career identity as founder |
| **Financial** | P&L, runway, dividends, exit proceeds | Personal net worth, tax |
| **Human** | Hiring, training, leadership development | Player stress, skill growth |
| **Social** | Investor relations, brand, media | Network, family nepotism risk |
| **Legacy** | Company history, succession, dynasty | Heir CEO handoff |

## 2.3 Product Bible Alignment (§12)

| Bible Principle | Player Expression |
|---|---|
| Departments as gameplay vectors | Each dept has own sub-dashboard |
| People not spreadsheets | Employee cards with personality hints |
| Funding & ownership real | Term sheet UI with dilution preview |
| Ethics & reputation | Shortcuts visible in scandal risk meter |
| Role transition | Founder → CEO → Chairman delegation unlocks |

## 2.4 Symmetry Principle (Player Trust)

| Scenario | Player Expectation |
|---|---|
| NPC competitor IPOs | Same listing requirements player faces |
| Player company bankrupts | Same chapters as NPC |
| Hiring in tight labor market | Longer fill time for everyone |
| Sector recession | NPC and player revenue both pressured |

## 2.5 Design Review Questions

1. What is the **primary decision** on this business screen?
2. What **three KPIs** must the player see?
3. Does failure teach **which lever** was wrong?
4. Can this scale to **500 employees** without UI paralysis?

---

# 3. Player Business Mental Model

## 3.1 Competence Curve

| Stage | Player Skill Target | Game Support |
|---|---|---|
| First company | Understand runway & revenue | Simplified dashboard mode |
| First hire | Role fit vs salary | Candidate comparison cards |
| First launch | Quality vs speed trade-off | Launch readiness checklist |
| First round | Dilution & terms | Term sheet explainer |
| Scale | Delegation & KPI monitoring | Department auto-pilots |
| Exit | Timing & governance | IPO readiness scorecard |

## 3.2 Core Concepts Players Internalize

| Concept | Taught By |
|---|---|
| **Runway** | Cash / burn rate countdown |
| **Unit economics** | Price vs cost per unit on product card |
| **CAC vs LTV** | Marketing dashboard (simplified) |
| **Dilution** | Cap table before/after slider |
| **Moats** | Market share + brand + patents display |
| **Operating leverage** | Fixed costs amplify profit swings |
| **Governance** | Board vote outcomes |

## 3.3 Anti-Patterns (Forbidden)

| Anti-Pattern | Why |
|---|---|
| "Generate Profit" button | Breaks mastery fantasy |
| Instant hire best candidate | Removes labor market |
| Player-only bankruptcy immunity | Violates symmetry |
| Hidden investor favoritism | Breaks trust |
| Employees as identical stat blocks | Violates people philosophy |

---

# 4. Company Lifecycle — Player Journey

## 4.1 Lifecycle Stages (Player Labels)

| Stage | Trigger | Dominant Decisions | UI Mode |
|---|---|---|---|
| **Idea** | Concept created | Validate, research, plan | Founder notebook |
| **Formation** | Incorporation complete | Bank account, equity split | Setup wizard |
| **Pre-revenue** | Team building | Hire, build MVP | Lean dashboard |
| **Early revenue** | First sales | Product-market fit, burn | Standard dashboard |
| **Growth** | Revenue scaling | Fundraise, hire, expand | Full departments |
| **Scale** | 50+ employees | Delegation, process | Executive summary |
| **Maturity** | Stable market position | Dividends, M&A, efficiency | Board-focused |
| **Exit** | IPO or acquisition | Timing, terms, legacy | Investor relations |
| **Decline** | Share loss, losses | Restructure or wind down | Crisis dashboard |
| **Dissolution** | Bankruptcy or close | Asset liquidation, consequences | Resolution flow |

## 4.2 Stage Transition Celebrations & Warnings

| Transition | Player Moment |
|---|---|
| First revenue | Notification + timeline entry |
| First profitable month | Milestone badge |
| 10 employees | "You're now an employer" — HR unlock |
| Runway < 3 months | Red alert (non-blocking) |
| Board seat granted to investor | Governance tutorial |
| IPO eligible | Readiness report |

## 4.3 Multiple Companies

Players may found multiple companies subject to:

- Personal time/energy constraints (life stats)
- Capital availability
- Non-compete obligations (if prior exit)
- Reputation effects (serial failure vs success)

---

# 5. Founding & Incorporation Flow

## 5.1 Entry Points

| Entry | Route | Context |
|---|---|---|
| Smartphone → Business app | `/phone` → Business | Always available (age 18+) |
| Career → Start business | After experience threshold | Pre-filled skills |
| News → Sector opportunity | "Start company in hot sector" | Macro timing hint |
| Family → Inherited business | Succession event | Pre-existing entity |

## 5.2 Incorporation Wizard (7 Steps)

```
Step 1: CONCEPT
  → Name, elevator pitch (flavor), sector selection
  → Sector card shows demand index (from Doc 05)

Step 2: ENTITY TYPE
  → Sole prop / LLC analog / Corporation
  → Trade-off table: liability, taxes, fundraising ability

Step 3: LOCATION
  → HQ city/district
  → COL, tax jurisdiction, talent pool preview

Step 4: CAPITALIZATION
  → Initial personal investment (min/max by entity)
  → Optional co-founder (NPC or invite friend via Network)

Step 5: EQUITY SPLIT
  → Cap table pie (founder, co-founder, option pool)
  → Vesting schedule preview for co-founders

Step 6: BANKING & COMPLIANCE
  → Open business account (Banking integration)
  → Register for tax ID, licenses by sector

Step 7: CONFIRM & LAUNCH
  → Summary card
  → "Incorporated [Date]" timeline event
  → Company Dashboard unlocked
```

## 5.3 Entity Type Comparison (Player Table)

| Type | Liability | Fundraising | Complexity | Best For |
|---|---|---|---|---|
| Sole proprietorship | Personal | None | Low | Freelance, side hustle |
| LLC analog | Limited | Limited | Medium | Small business, bootstrapped |
| Corporation | Limited | Full (VC, IPO) | High | Scalable startup |

## 5.4 Co-Founder Flow

| Option | Player Experience |
|---|---|
| Solo | 100% equity; all decisions |
| NPC co-founder | Personality match; skill complement; equity negotiation |
| Friend (Network) | Async invite; shared world rules apply |
| Skip | Can add later with dilution |

Co-founder conflicts surface as **decision gates** if alignment low.

## 5.5 Incorporation Costs

| Cost | Display | Payment |
|---|---|---|
| Filing fee | Upfront quote | Business or personal account |
| Legal (optional) | Reduces future compliance risk | One-time |
| Initial capital requirement | Min deposit by entity type | Business account |

## 5.6 Post-Incorporation Checklist

Home Screen + Company Dashboard show **Setup Checklist** until complete:

- [ ] Business bank account funded
- [ ] First product/concept defined
- [ ] First hire or contractor (optional by sector)
- [ ] Tax registration confirmed
- [ ] Insurance (optional, sector-dependent)

---

# 6. Company Dashboard — Command Center

## 6.1 Route & Access

**Route:** `/company` (unlocked after incorporation)  
**Diegetic frame:** Executive portal — "NovaTech Holdings — CEO Dashboard"

## 6.2 Dashboard Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│ NOVATECH INC.          Stage: Growth    Runway: 14 mo    ⚠    │
│ CEO: [Player Name]     Sector: Technology   Employees: 23    │
├──────────────────────────────────────────────────────────────┤
│ MRR $124K ▲12%  │  Burn $98K  │  Cash $1.4M  │  Headcount +3  │
├───────────────────────────────┬──────────────────────────────┤
│ REVENUE CHART (6 mo)          │ ACTIONS                       │
│                               │ [Hire] [Launch] [Fundraise]   │
│                               │ [Marketing] [Board] [Reports] │
├───────────────────────────────┼──────────────────────────────┤
│ DEPARTMENT HEALTH             │ ALERTS & NEWS                 │
│ Product ████░  Marketing ██░░ │ • Runway below target         │
│ HR █████  Finance ████░       │ • Competitor launched rival   │
└───────────────────────────────┴──────────────────────────────┘
```

## 6.3 Three-Number Rule (Company Dashboard)

| Primary KPIs | Why |
|---|---|
| **Revenue (MRR/ARR or monthly)** | Are we growing? |
| **Burn rate** | How fast do we spend? |
| **Runway** | How long until zero cash? |

Secondary row: headcount, gross margin, cash balance.

## 6.4 Dashboard Modes

| Mode | Unlock | Simplification |
|---|---|---|
| **Founder** | Default | Hides advanced finance |
| **Standard** | $10K MRR or 5 employees | Full dept cards |
| **Executive** | 50 employees or Series A | Summary + delegation |
| **Crisis** | Runway < 3 mo or default risk | Red theme; survival actions |

Player selects in Settings → Company UI (default auto by stage).

## 6.5 Time Controls (Company Context)

When player advances time from Company Dashboard:

- Hiring pipelines progress
- Product development advances
- Marketing campaigns run
- Payroll deducts
- Competitor actions resolve

Blocking gates pause time: board votes, term sheet signature, launch approval (if configured).

---

# 7. Role Progression: Founder to Chairman

## 7.1 Player Roles in Company

| Role | Powers | Typical Stage |
|---|---|---|
| **Founder** | All decisions; no board yet | Pre-seed |
| **CEO** | Operations; reports to board | Post-investment |
| **Chairman** | Board leadership; less ops | Post-IPO or mature |
| **Board member** | Vote on major proposals | Investor seat |
| **Passive owner** | Dividends; major votes only | Post-exit partial hold |
| **Heir CEO** | Succession play | Generational |

## 7.2 Role Transition Flows

| Transition | Trigger | Player Choice |
|---|---|---|
| Founder → CEO | First institutional round | Accept CEO title formally |
| CEO → Chairman | IPO or personal choice | Hire external CEO |
| Active → Passive | Partial exit | Retain board seat? |
| Death → Heir | Legacy play | Child or appointed successor |

## 7.3 Delegation Unlock by Role

| Role | Delegatable Decisions |
|---|---|
| Founder | Limited — most manual |
| CEO | Department heads for hiring tier < director |
| Chairman | Strategy only; CEO runs ops |

---

# 8. Departments & Decision Surfaces

## 8.1 Department Registry

| Department | Route | Primary Player Decisions |
|---|---|---|
| **Product / R&D** | `/company/product` | Roadmap, quality, features |
| **Marketing** | `/company/marketing` | Budget, channels, brand |
| **Sales** | `/company/sales` | Pricing, channels, targets |
| **Operations** | `/company/ops` | Capacity, suppliers, quality |
| **HR** | `/company/hr` or `/employees` | Hire, comp, culture |
| **Finance** | `/company/finance` | Budget, runway, debt |
| **Legal** | `/company/legal` | Compliance, IP, contracts |
| **Executive** | `/company/executive` | Strategy, M&A, board |

## 8.2 Department Health Indicators

Each department shows 0–100 **Health** with contributing factors:

| Department | Health Drivers |
|---|---|
| Product | Quality, pipeline progress, bug rate |
| Marketing | Brand awareness, CAC trend |
| Sales | Quota attainment, pipeline |
| Operations | Utilization, defect rate |
| HR | Turnover, morale, time-to-fill |
| Finance | Runway, margin, audit clean |
| Legal | Open issues, compliance score |

Low health surfaces **department alerts** on main dashboard.

## 8.3 Department Head Model

| Element | Player Experience |
|---|---|
| Vacant head role | Warning; player acts as interim |
| Assigned head | NPC or hired executive with stats |
| Head performance | Affects dept health autonomously |
| Fire head | Morale shock; severance cost |

---

# 9. Org Structure & Headcount Planning

## 9.1 Org Chart UX

**Route:** `/company/org`

- Tree view: CEO → VPs → Directors → ICs
- Drag-drop reorg (with morale impact warning)
- Span of control indicator (too wide = inefficiency)

## 9.2 Headcount Plan

| Field | Purpose |
|---|---|
| Current headcount | Actual |
| Planned (Q+1) | Budget approval |
| Open reqs | Active postings |
| Cost projection | Payroll impact on runway |

Player sets quarterly headcount plan in **Finance → Budget** — over-hiring without plan triggers board concern (if governed).

---

# 10. Hiring UX — End to End

## 10.1 Hiring Flow Overview

```
Define Role → Post Job → Receive Applications → Screen → Interview → Offer → Onboard
```

## 10.2 Step 1: Define Role

| Field | Player Input |
|---|---|
| Title | Text + template suggestions |
| Department | Dropdown |
| Level | Intern → C-level |
| Salary range | Min/max with market guide |
| Required skills | Tag selector with player skill DB |
| Remote policy | Onsite / hybrid / remote |
| Urgency | Normal / urgent (premium cost) |

**Market guide** shows median salary for role in city (from Economy labor data).

## 10.3 Step 2: Post Job

| Option | Effect |
|---|---|
| Standard post | Job board visibility |
| Premium post | Faster applications, higher cost |
| Recruiter hire | NPC recruiter fee; better candidates |
| Referral bonus | Employee network boost |

Posting creates visible entry on world job board — NPC citizens may also apply.

## 10.4 Step 3: Applications Inbox

**Route:** `/employees/applications`

| Column | Content |
|---|---|
| Candidate | Name, photo, current role |
| Fit score | 0–100 (skill + culture + salary) |
| Highlights | Top 3 skills match / gaps |
| Risk flags | Job hopper, reputation, overqualified |
| Actions | Screen / Reject / Save |

Sort by: fit, salary demand, diversity of pipeline (advisory).

## 10.5 Step 4: Screening

Player or delegated HR chooses:

| Action | Result |
|---|---|
| **Phone screen** | Quick; reveals salary expectations |
| **Skip to interview** | Faster; higher mismatch risk |
| **Reject** | Polite template; reputation neutral |
| **Hold** | Pipeline backlog |

## 10.6 Step 5: Interview

Interview presented as **structured card choices**, not trivia:

| Round | Player/NPC Interviewer Decisions |
|---|---|
| Technical | Depth vs breadth focus |
| Culture | Values alignment questions |
| Case | Scenario response (player picks approach) |
| Final | Bar raiser optional |

**Outcome:** Strong hire / Hire / No hire / Strong no hire

Candidate traits (CDPS) affect answers — observant players notice patterns.

## 10.7 Step 6: Offer

| Field | Negotiation |
|---|---|
| Base salary | Slider within range |
| Equity | Options from pool (if corp) |
| Signing bonus | Optional |
| Start date | Affects project timelines |
| Title | Affects candidate acceptance |

Counteroffer possible if candidate has other offers (labor market tight).

## 10.8 Step 7: Onboard

| Element | Gameplay |
|---|---|
| Onboarding period | Reduced productivity 1–3 months |
| Mentor assign | Speeds ramp; mentor time cost |
| First project | Affects early performance |

## 10.9 Hiring Failure Modes (Player-Visible)

| Failure | Cause | Recovery |
|---|---|---|
| No applications | Salary too low, bad brand | Raise range, marketing employer brand |
| All rejected | Bar too high | Relax requirements |
| Offer declined | Comp, culture, competitor | Counteroffer or repost |
| Bad hire | Rushed interview | PIP or terminate (reputation cost) |
| Long time-to-fill | Tight labor market | Recruiter, referral, remote |

---

# 11. Employee Management & Culture

## 11.1 Employee Card

| Section | Fields |
|---|---|
| Identity | Name, title, dept, tenure |
| Performance | Current rating, trend |
| Skills | Core competencies |
| Morale | 0–100 with drivers |
| Compensation | Salary, equity |
| History | Promotions, warnings, projects |
| Personality hints | 2–3 trait tags (not full CDPS dump) |

## 11.2 Culture Dashboard

**Route:** `/company/culture`

| Metric | Player Lever |
|---|---|
| Innovation | R&D budget, failure tolerance |
| Collaboration | Office policy, team structure |
| Work-life | Hours expectation, benefits |
| Integrity | Ethics policies |
| Diversity | Hiring practices (advisory goals) |

Culture affects hiring fit, retention, and media risk.

## 11.3 Morale Events

| Event | Morale Impact |
|---|---|
| Layoffs nearby | Fear |
| Big win / launch | Pride |
| Toxic manager | Drain |
| Raise cycle | Boost if fair |
| Nepotism hire | Resentment |

---

# 12. Performance Reviews & Promotions (Employer Side)

## 12.1 Review Cycle

Quarterly or annual — player configures in HR settings.

| Step | Player Action |
|---|---|
| System draft | Auto-suggested ratings from output |
| Manager review | Player adjusts with justification |
| Calibration | Compare across team (optional) |
| Delivery | Choose tone: supportive / direct |
| Outcome | Raise, promo, PIP, or status quo |

## 12.2 Promotion Flow

```
Nominate → Budget check → Approval chain → Announce → Timeline event
```

| Gate | Blocker |
|---|---|
| No budget | Finance reject |
| Performance < threshold | HR warning |
| No headcount plan | Executive override needed |

## 12.3 PIP (Performance Improvement Plan)

| Stage | Duration | Outcome |
|---|---|---|
| Warning | 1 month | Clear goals |
| PIP active | 2–3 months | Improve or exit |
| Termination | — | Severance, morale hit |

---

# 13. Layoffs & Restructuring (Employer Side)

## 13.1 When Player Considers Layoffs

| Trigger | UI Signal |
|---|---|
| Runway crisis | Finance recommends |
| Sector contraction | Demand collapse |
| Post-acquisition | Duplicate roles |
| Strategic pivot | Product discontinued |

## 13.2 Layoff Flow

```
Plan reduction → Select departments/% → Choose individuals (or blind %) 
  → Severance package → Legal review → Announce → Execute
```

## 13.3 Layoff Decisions

| Approach | Morale | Legal risk | Speed |
|---|---|---|---|
| Performance-based | Mixed | Lower if documented | Slow |
| LIFO | Senior survive | Medium | Medium |
| Blind % cut | Fear | Lower | Fast |
| Voluntary buyout | Better morale | Costly | Slow |

## 13.4 Consequences (Player-Facing)

| Stakeholder | Effect |
|---|---|
| Remaining employees | Morale drop; productivity dip |
| Media | Headline if large or notable company |
| Employer brand | Harder hiring 6–12 months |
| Personal reputation | If perceived as cruel |
| Labor market | Released workers enter job pool |

---

# 14. Compensation & Payroll Decisions

## 14.1 Payroll Dashboard

| View | Content |
|---|---|
| Monthly payroll | Total by dept |
| Next run date | Auto-deduct |
| Comp bands | Min/mid/max by level |
| Equity pool | Remaining % |

## 14.2 Compensation Philosophy Choices

| Philosophy | Effect |
|---|---|
| Market median | Balanced retention |
| Top of market | Attracts talent; burns cash |
| Below market + equity | Startup classic; retention risk |
| Merit-heavy | Performance variance |

## 14.3 Raise Cycle

Annual or semi-annual — player sets budget % of payroll.

---

# 15. Products & Services — Player Experience

## 15.1 Product Portfolio View

**Route:** `/company/product`

| Column | Product A | Product B |
|---|---|---|
| Lifecycle | Growth | Maturity |
| Revenue/mo | $45K | $12K |
| Quality | 82 | 71 |
| Market share | 8% | 3% |
| Margin | 62% | 41% |
| Actions | [Improve] [Market] [Sunset] | ... |

## 15.2 Product Categories (Player)

| Category | Examples | Key Metrics |
|---|---|---|
| Physical goods | Retail product | Units, COGS, inventory |
| Digital goods | App, game | Downloads, churn |
| Subscription | SaaS | MRR, churn, LTV |
| Service | Consulting | Utilization, bill rate |
| Marketplace | Platform | GMV, take rate |
| Franchise | Licensed model | Locations, royalties |

## 15.3 New Product Concept Flow

```
Idea → Concept card → Assign R&D → Development progress → Beta → Launch ready
```

---

# 16. R&D & Innovation Pipeline

## 16.1 R&D Dashboard

| Element | Player Control |
|---|---|
| Active projects | Headcount assigned |
| Progress bars | Months to complete |
| Innovation points | Breakthrough chance |
| Budget | Monthly R&D spend |

## 16.2 Development Decisions

| Decision | Trade-off |
|---|---|
| More headcount | Faster; expensive |
| Higher quality target | Longer; better reviews |
| Rush mode | Faster; bug risk |
| Cancel project | Sunk cost; morale hit |

## 16.3 Breakthrough Event

Rare positive event — patent analog, feature leap — surfaces as notification + media opportunity.

---

# 17. Product Launch Flow

## 17.1 Launch Readiness Checklist

| Criterion | Threshold | Player Override? |
|---|---|---|
| Development complete | 100% | No |
| Quality score | ≥ 60 recommended | Yes (risk warning) |
| Marketing prep | Campaign scheduled | Yes |
| Support capacity | HR staffed | Advisory |
| Legal clearance | No open blockers | No |

## 17.2 Launch Wizard

```
Step 1: Confirm product & positioning
Step 2: Set launch date (or immediate)
Step 3: Marketing burst budget
Step 4: Pricing strategy selection
Step 5: PR statement (flavor text optional)
Step 6: LAUNCH → news event + sales ramp
```

## 17.3 Launch Outcomes

| Outcome | Cause | Player Sees |
|---|---|---|
| Hit | Quality + marketing + demand | Revenue spike, positive reviews |
| Soft | Mediocre execution | Slow ramp |
| Flop | Low quality or bad timing | Returns, reputation hit |
| Scandal | Rushed + bugs | Media crisis flow |

## 17.4 Post-Launch Monitoring (90 Days)

Dashboard shows **Launch Tracker**:

- Week 1–12 revenue vs forecast
- Review sentiment
- Support ticket proxy
- Competitor response news

---

# 18. Pricing Strategy Choices

## 18.1 Strategy Selector

| Strategy | Player Label | When to Use |
|---|---|---|
| Penetration | "Undercut market" | Land grab, startup |
| Competitive | "Match market" | Stable market |
| Premium | "Charge more" | High quality/brand |
| Dynamic | "Auto-adjust" | Volatile demand |
| Freemium | "Free + upsell" | Digital/subscription |

## 18.2 Price Change Flow

Changing price requires:

- Justification (cost increase, value add)
- Churn risk preview
- Competitor price comparison
- Effective date

---

# 19. Manufacturing & Operations (Player View)

## 19.1 Operations Dashboard

| KPI | Meaning |
|---|---|
| Capacity utilization | % of max output used |
| Defect rate | Quality issues |
| Inventory level | Weeks of supply |
| Supply chain risk | Shock exposure |

## 19.2 Player Decisions

| Decision | Effect |
|---|---|
| Expand facility | Capex; lag 6–18 months |
| Automation | Lower labor cost; upfront cost |
| Supplier switch | Cost vs reliability |
| Quality investment | Lower defects; higher unit cost |

## 19.3 Supply Shock UX

When economy fuel/import shock:

- Notification on ops dashboard
- COGS projection updates
- Options: absorb, pass-through price, delay orders

---

# 20. Marketing & Brand Decisions

## 20.1 Marketing Dashboard

| Metric | Player Control |
|---|---|
| Monthly budget | Slider |
| Brand awareness | 0–100 |
| CAC | Outcome metric |
| Channel mix | Digital / traditional / PR |

## 20.2 Campaign Types

| Campaign | Cost | Duration | Best For |
|---|---|---|---|
| Brand awareness | Medium | Ongoing | Long-term |
| Product launch burst | High | 4–8 weeks | New product |
| Performance digital | Variable | Ongoing | Direct response |
| PR push | Medium | Spike | Credibility |
| Sponsorship | High | Event-based | Local brand |

## 20.3 Marketing Failure Modes

| Failure | Player Lesson |
|---|---|
| Overpromise in ads | Reputation hit when product underdelivers |
| Underfund launch | Nobody knows product exists |
| Wrong channel | High CAC, low conversion |
| Cut marketing in recession | Revenue cliff |

---

# 21. Sales Channels & Revenue

## 21.1 Channel Configuration

| Channel | Sector Fit |
|---|---|
| Direct online | DTC, SaaS |
| Retail partners | Physical goods |
| Enterprise sales | B2B, long cycle |
| Franchise | Expansion model |
| Marketplace | Platform |

## 21.2 Sales Pipeline (B2B)

Visual funnel: Leads → Qualified → Proposal → Closed

Player sets quarterly quota; sales head affects close rate.

---

# 22. Financial Management Dashboard

## 22.1 Financial Statements (Player View)

**Route:** `/company/finance`

| Statement | Frequency | Player Use |
|---|---|---|
| Income statement | Monthly | Profitability |
| Balance sheet | Quarterly | Assets/liabilities |
| Cash flow | Monthly | Liquidity |
| Runway projection | Real-time | Survival |

## 22.2 Budget vs Actual

Department budgets with variance alerts:

- Green: within 5%
- Amber: 5–15% over
- Red: >15% over

## 22.3 Debt & Credit (Business)

| Instrument | Player Flow |
|---|---|
| Line of credit | Apply at bank; rate from economy |
| Term loan | Capex financing |
| Convertible note | Bridge to round |

Covenants shown plainly — breach triggers warning.

---

# 23. Fundraising — Player Flow

## 23.1 Fundraising Entry

| Trigger | Path |
|---|---|
| Runway low | Finance suggests fundraise |
| Growth opportunity | Executive strategy |
| Player initiative | Company → Fundraise |

## 23.2 Stage Selection

| Stage | Player Label | Typical Need |
|---|---|---|
| Pre-seed | "Friends & angels" | Idea + prototype |
| Seed | "Seed round" | Early traction |
| Series A | "Series A" | Product-market fit |
| Series B+ | "Growth round" | Scale |
| Debt | "Debt financing" | Asset-heavy, cash flow |
| Grant | "Government grant" | Non-dilutive |

## 23.3 Fundraise Wizard

```
Step 1: Select stage & target amount
Step 2: Valuation expectation (advisor range shown)
Step 3: Pitch deck (auto-generated from metrics + player edits)
Step 4: Investor targeting (sector-matched list)
Step 5: Roadshow (time cost; N meetings)
Step 6: Term sheet received → negotiate
Step 7: Close or fail
```

## 23.4 Pitch Deck (Diegetic)

Auto-populated slides:

1. Problem / solution (player flavor)
2. Traction (real metrics)
3. Market (sector demand from economy)
4. Team (employee highlights)
5. Financials (runway, revenue)
6. Ask (amount, use of funds)

Player may edit flavor text — metrics are locked to truth.

## 23.5 Investor Meetings

| Meeting Outcome | Cause |
|---|---|
| Interested | Strong metrics + sector hot |
| Pass | Valuation gap, weak traction |
| Term sheet | Lead interested |
| Intro to another | Network effect |

Meetings consume **player time** (life stat) — trade-off with family/health.

## 23.6 Term Sheet Negotiation

| Term | Player Choice | Explainer |
|---|---|---|
| Pre-money valuation | Counter-offer | Affects dilution |
| Investment amount | Accept/adjust | Runway extension |
| Liquidation preference | 1x standard | Downside protection for investor |
| Board seat | Grant/deny | Governance impact |
| Pro-rata rights | Standard | Future round rights |

**Dilution preview** required before accept:

> *You will own 58% post-close (was 72%)*

## 23.7 Round Failure

| Consequence | Player Experience |
|---|---|
| No term sheet | Runway countdown intensifies |
| Down round attempt | Reputation hit; possible |
| Bridge note | Expensive short-term |
| Layoffs | Survival mode |
| Bankruptcy | If options exhausted |

---

# 24. Investor Relations & Cap Table UX

## 24.1 Cap Table View

**Route:** `/company/captable`

| Shareholder | % | Type |
|---|---|---|
| Founder (player) | 58% | Common |
| Co-founder | 12% | Common (vesting) |
| Option pool | 10% | Reserved |
| Seed Fund A | 15% | Preferred |
| Angels | 5% | Preferred |

Interactive: hover round history; see dilution events on timeline.

## 24.2 Investor Relations

| Activity | Player Action |
|---|---|
| Quarterly update email | Draft or auto-send |
| Board deck | Prepare before meeting |
| Crisis communication | If bad news |
| Request intro | For next round |

Neglected investors → harder future rounds.

---

# 25. Board of Directors — Player Experience

## 25.1 Board Composition

| Seat | Holder |
|---|---|
| Founder | Player (usually) |
| Investor | Lead from round |
| Independent | NPC or player appoints |

## 25.2 Board Votes (Decision Gates)

Major proposals require vote:

| Proposal | Example |
|---|---|
| New funding round | Series B |
| Acquisition offer | Buy competitor |
| CEO replacement | If performance bad |
| Dividend declaration | Mature company |
| Major capex | New factory |

Player casts founder votes; sees AI member leanings (if relationship high).

## 25.3 Board Conflict

Low alignment triggers:

- Media speculation
- CEO replacement pressure event
- Strategy dispute blocking major action

---

# 26. Initial Public Offering — Player Experience

## 26.1 IPO Eligibility (Player Checklist)

| Requirement | Display |
|---|---|
| Revenue threshold | $X MRR for 4 quarters |
| Profitability or path | GAAP-inspired rule |
| Governance | Board, audit |
| Public float | Min shares |
| No material legal issues | Legal clearance |
| Market conditions | Economy phase advisory |

**IPO Readiness Score** 0–100 on Executive dashboard.

## 26.2 IPO Flow

```
Step 1: Board approval vote
Step 2: Select underwriters (bank partners)
Step 3: S-1 filing (flavor + real financials)
Step 4: Roadshow (2–4 weeks game time)
Step 5: Price range set
Step 6: IPO day — ring bell ceremony (optional)
Step 7: Trading begins — stock ticker live
```

## 26.3 IPO Day Player Experience

| Element | Experience |
|---|---|
| Pricing | Player may accept range or push high (risk) |
| First day pop/drop | Market sentiment + pricing |
| Lock-up | Player shares restricted 6 months |
| Media | Headlines in news feed |
| Timeline | "IPO Day" milestone |
| Personal wealth | Paper net worth spike |

## 26.4 Post-IPO Life

| Change | Player Impact |
|---|---|
| Quarterly earnings | Must report; miss → stock drop |
| Analyst scrutiny | Higher visibility |
| SEC analog compliance | Legal dept importance |
| Founder liquidity | Lock-up then gradual sale options |
| Role shift | Often Chairman or focused CEO |

## 26.5 IPO Timing Advisory

Economy phase shown:

- Expansion/peak: favorable valuations
- Recession: IPO window closed (advisory red)

---

# 27. M&A & Acquisitions (Player Initiated)

## 27.1 Buy Side Flow

```
Identify target → Due diligence → Valuation → Offer → Negotiate → Board vote → Close
```

## 27.2 Sell Side (Exit)

Player receives inbound offers via Executive dashboard:

| Response | Outcome |
|---|---|
| Accept | Cash/stock; role change |
| Reject | Continue independent |
| Counter | Negotiation mini-flow |
| Auction | Multiple bidders (rare) |

---

# 28. Competition & Market Position

## 28.1 Competitor Intel

**Route:** `/company/competition`

| Data | Source |
|---|---|
| Market share ranking | Sector aggregation |
| Competitor products | Public info |
| Recent news | Media engine |
| Hiring poaching | Labor market |

## 28.2 Moat Indicators (Player)

| Moat Type | Display |
|---|---|
| Brand | Awareness score |
| Patents | R&D breakthroughs |
| Network effects | User growth metric |
| Scale | Cost advantage |
| Switching costs | Churn rate inverse |

---

# 29. Corporate Reputation & Ethics

## 29.1 Reputation Dashboard

| Layer | Scope |
|---|---|
| Employer brand | Hiring |
| Customer trust | Sales, churn |
| Industry standing | Partnerships |
| Media narrative | Headlines |

## 29.2 Ethics Decisions

| Shortcut | Short-term | Long-term |
|---|---|---|
| Cut quality | Margin ↑ | Reviews ↓, scandal risk |
| Tax aggressive | Cash ↑ | Audit risk |
| Environmental skip | Cost ↓ | Regulation, PR |
| Fair treatment | Cost | Retention, brand |

Whistleblower events possible if integrity very low.

---

# 30. Bankruptcy & Dissolution

## 30.1 Warning Ladder

| Stage | UI |
|---|---|
| Cash low | Amber runway |
| Default risk | Red; creditor calls |
| Chapter analog filing | Decision gate |
| Restructuring | Negotiate with creditors |
| Liquidation | Asset sale |
| Dissolution | Company ends |

## 30.2 Player Bankruptcy Experience

| Element | Required |
|---|---|
| Explanation | What went wrong |
| Personal liability | By entity type |
| Credit/reputation hit | Personal + business |
| Timeline entry | Permanent record |
| Recovery path | Future founding still possible |

No game over — life continues.

---

# 31. Delegation & Automation

## 31.1 Department Auto-Pilot

| Setting | Behavior |
|---|---|
| Manual | Player approves all |
| Assisted | AI suggests; player confirms |
| Delegated | Head executes within budget |
| Auto | Head full control (risk/reward) |

## 31.2 Notification Filtering

At scale, player sets:

- Only exceptions
- Weekly digest
- Critical only

---

# 32. Multi-Company & Portfolio Management

## 32.1 Holdings View

If player owns multiple entities:

**Route:** `/company/portfolio`

| Company | Role | Equity | Runway |
|---|---|---|---|
| NovaTech | CEO | 58% | 14 mo |
| Side Cafe LLC | Owner | 100% | 8 mo |

---

# 33. Business + Life Integration

## 33.1 Time & Energy Costs

| Action | Life Stat Impact |
|---|---|
| Fundraise roadshow | Stress ↑, family time ↓ |
| Launch crunch | Health risk |
| Layoffs | Stress, reputation |
| IPO success | Confidence ↑, social ↑ |

## 33.2 Family Business

| Scenario | Design |
|---|---|
| Hire child | Nepotism morale risk |
| Spouse involved | Dual income or conflict |
| Inherit company | Succession doc 09 |
| Divorce | Asset split includes equity |

## 33.3 Employment While Founding

Player may hold job + side business (sole prop) until conflict of interest or time gate.

---

# 34. Player Flows & Decision Gates

## 34.1 Flow: First Hire

```
Runway OK → HR suggests first hire → Define role wizard 
  → Post → Wait for applications (time advance) 
  → Interview top candidate → Offer → Onboard → Dashboard headcount +1
```

## 34.2 Flow: Emergency Fundraise

```
Runway < 4 months → Finance red alert → Fundraise wizard 
  → Fast seed attempt → Term sheet or fail 
  → If fail: layoff wizard or bankruptcy path
```

## 34.3 Decision Gate Table

| Gate | Blocking | Trigger |
|---|---|---|
| Board vote | Yes | Major corporate action |
| Term sheet sign | Yes | Fundraise close |
| Launch confirm | Configurable | Product launch |
| Layoff execute | Soft | Planned RIF |
| IPO pricing | Yes | IPO day |

---

# 35. UI Screens & Information Architecture

## 35.1 Screen Registry

| Screen | Route | Primary Decision |
|---|---|---|
| Company Dashboard | `/company` | "How is my company doing?" |
| Incorporation | `/company/found` | "Should I start this business?" |
| Hiring | `/employees` | "Who should I hire?" |
| Product | `/company/product` | "What should we build/sell?" |
| Marketing | `/company/marketing` | "How do we reach customers?" |
| Finance | `/company/finance` | "Can we afford this?" |
| Fundraise | `/company/fundraise` | "Should I raise capital?" |
| Cap table | `/company/captable` | "Who owns what?" |
| Board | `/company/board` | "How do I vote?" |
| IPO | `/company/ipo` | "Am I ready to go public?" |

---

# 36. Notifications & Alerts

| Tier | Business Examples |
|---|---|
| P0 | Payroll failure, covenant breach |
| P1 | Runway < 3 mo, term sheet received |
| P2 | New applicant, competitor launch |
| P3 | Monthly financial close ready |

---

# 37. Onboarding & Business Literacy

## 37.1 First Company Tutorial

Triggered on first incorporation — optional skip for veterans.

| Step | Lesson |
|---|---|
| Fund account | Business vs personal money |
| Define product | Revenue source |
| First hire (optional) | People cost money |
| Watch runway | Burn matters |

## 37.2 Tooltips & Glossary

Terms: runway, dilution, MRR, CAC, EBITDA — link to Document 41.

---

# 38. Acceptance Criteria

## 38.1 Founding & Dashboard

| ID | Criterion | Test |
|---|---|---|
| BUS-UX-001 | Player completes incorporation in ≤7 steps | Flow test |
| BUS-UX-002 | Dashboard shows revenue, burn, runway prominently | UX audit |
| BUS-UX-003 | Entity type affects fundraising options | Functional |
| BUS-UX-004 | Sector selection shows economy demand index | Integration |

## 38.2 Hiring

| ID | Criterion | Test |
|---|---|---|
| BUS-HR-001 | Full hire flow from post to onboard | E2E |
| BUS-HR-002 | Fit score visible on applications | UI |
| BUS-HR-003 | Tight labor market increases time-to-fill | Sim |
| BUS-HR-004 | Bad hire possible if interview rushed | Scenario |
| BUS-HR-005 | NPC citizens can apply to player postings | Symmetry |

## 38.3 Product & Launch

| ID | Criterion | Test |
|---|---|---|
| BUS-PR-001 | Launch checklist blocks if dev incomplete | Functional |
| BUS-PR-002 | Launch quality affects review sentiment | Sim |
| BUS-PR-003 | 90-day launch tracker displays | UI |

## 38.4 Fundraising & IPO

| ID | Criterion | Test |
|---|---|---|
| BUS-FN-001 | Dilution preview before term sheet accept | Functional |
| BUS-FN-002 | Failed round increases runway pressure | Sim |
| BUS-FN-003 | IPO readiness score reflects requirements | Validation |
| BUS-FN-004 | IPO creates tradeable ticker | Integration |
| BUS-FN-005 | Board vote gates major actions | Flow |

## 38.5 Failure & Symmetry

| ID | Criterion | Test |
|---|---|---|
| BUS-FL-001 | Bankruptcy explains causes | Content |
| BUS-FL-002 | Player and NPC use same P&L visibility rules | Symmetry |
| BUS-FL-003 | Layoffs affect morale and media | Sim |

---

# 39. Edge Cases & Failure States

| Scenario | Expected UX |
|---|---|
| Found company with $0 personal funds | Blocked with explanation |
| 100% equity sold | Player becomes employee scenario |
| Co-founder quits | Vesting cliff applies |
| IPO in recession | Low pricing warning; may delay |
| Acquire own company (bug) | Prevented |
| Player dies mid-IPO | Succession gate |

---

# 40. Traceability Matrix

| Bible §12 | Constitution | Doc 19 | This Doc |
|---|---|---|---|
| Company lifecycle | Business Capital | §4 Lifecycle | §4–5 |
| Departments | — | §7 Departments | §8 |
| Hiring people | Citizen Equality | §11 Hiring | §10–11 |
| Funding | Financial Capital | §10 Investors | §23–24 |
| IPO | Legacy | §20 IPO | §26 |
| Ethics | Integrity | §22 Reputation | §29 |

---

# 41. Governance & Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-07-10 | Initial canonical release |

---

*End of Document 06 — Business Systems Design*
