# Fenix Life — Education Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Education Domain Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Human Capital Design Lead  
**Audience:** Game Design, Engineering, Content, QA, Live Ops, UX  

---

## Document Authority

The Education Design document defines **how players experience learning—from childhood schooling through university, trade certification, continuing education, and the education-to-career pipeline**—as gameplay, UI flows, consequences, and content requirements. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) | Education Philosophy §14, Human Capital pillar |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) | Five Capitals, Citizen Equality, Living World |
| [07_Career_Employment_Design.md](./07_Career_Employment_Design.md) | Job requirements, hiring gates, salary bands |
| [Fenix-Life-Citizen-DNA-Personality-System.md](./Fenix-Life-Citizen-DNA-Personality-System.md) (16) | Trait effects on study habits, dropout risk, networking |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) (14) | Education Engine §4.4 boundaries |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) (04) | `EducationEnrollment`, `Credential`, `Transcript` |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Tuition index, education CPI weight |
| [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | `/education` screen zones |
| [35_Content_Pipeline.md](./35_Content_Pipeline.md) | Institution and program templates |

When education design conflicts with Citizen Equality, **player and AI citizens face identical enrollment rules, grading physics, and debt terms**—no hidden grade boosts or subsidized AI tuition.

**What this document is:**

- The **complete player-facing education gameplay spec** for Fenix Life
- Decision trees, costs, outcomes, and UI flows for every education stage
- The **education-career pipeline contract** with Career Design (07)
- Content authoring requirements for schools, universities, programs, and certifications
- Acceptance criteria for Education Engine MVP and `/education` screen wiring

**What this document is not:**

- Banking ledger implementation (Banking Engine — Document 11 planned)
- Career interview simulation (Career Engine — Document 07, Document 20)
- University NPC strategic AI (Living World institutions — WGS §15)
- Engine tick scheduling (FSF §4.4, Document 17)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Education Lifecycle Overview](#3-education-lifecycle-overview)
4. [Institution Types & Tiers](#4-institution-types--tiers)
5. [Primary & Secondary School](#5-primary--secondary-school)
6. [Higher Education — Universities](#6-higher-education--universities)
7. [Majors, Degrees & Credentials](#7-majors-degrees--credentials)
8. [GPA & Academic Performance](#8-gpa--academic-performance)
9. [Trade Schools & Vocational Paths](#9-trade-schools--vocational-paths)
10. [Certifications & Licenses](#10-certifications--licenses)
11. [Continuing & Executive Education](#11-continuing--executive-education)
12. [Financing — Tuition, Loans, Scholarships](#12-financing--tuition-loans-scholarships)
13. [Skill Gains & Human Capital Output](#13-skill-gains--human-capital-output)
14. [Networking & Alumni Systems](#14-networking--alumni-systems)
15. [Education-Career Pipeline](#15-education-career-pipeline)
16. [Parenting & Child Education](#16-parenting--child-education)
17. [Player Flows & Decision Points](#17-player-flows--decision-points)
18. [Education Screen (`/education`)](#18-education-screen-education)
19. [Notifications & Diegetic Feedback](#19-notifications--diegetic-feedback)
20. [AI Citizen Education Parity](#20-ai-citizen-education-parity)
21. [Events & Timeline Integration](#21-events--timeline-integration)
22. [Content Requirements](#22-content-requirements)
23. [Mod & Regional Expansion Hooks](#23-mod--regional-expansion-hooks)
24. [Balance & Tuning Parameters](#24-balance--tuning-parameters)
25. [Acceptance Criteria](#25-acceptance-criteria)
26. [Appendices](#26-appendices)

---

# 1. Executive Summary

Education in Fenix Life is **investment with uncertain ROI**. Credentials open career doors; skills enable on-the-job performance; networks create serendipity. No single path dominates all endings—a trade certification can out-earn a mediocre arts degree in the right macro cycle, while a dropout founder can bypass credentials entirely at the cost of investor friction.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDUCATION — PLAYER DECISION ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGES              DECISIONS                    OUTPUTS                    │
│  ──────              ─────────                    ───────                    │
│  Primary/Secondary   Attend, focus, extracurricular  Base stats, early skills │
│  Higher Ed           Where, what major, work-study   Degree, GPA, debt       │
│  Trade/Vocational    Program, apprenticeship         License, early income   │
│  Continuing Ed       When to reskill                 Cert renewal, pivot     │
│                                                                              │
│         ┌──────────────────────────────────────────────────┐                │
│         │              /education Screen                    │                │
│         │  Current │ Paths │ Costs │ Outcomes │ Network    │                │
│         └──────────────────────────┬───────────────────────┘                │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         ▼                          ▼                          ▼             │
│    Career Engine (07)      Banking (loans)           Citizen (skills)       │
│    Job requirements        Scholarship/grants        CDPS study traits      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core design outcomes:**

| Outcome | Mechanism |
|---|---|
| **Meaningful trade-offs** | Time, energy, money, and opportunity cost for every enrollment |
| **Multiple valid paths** | University, trade, self-taught, founder bypass—all viable with different risk |
| **Living institutions** | Universities enroll AI cohorts; capacity and prestige shift with world state |
| **Career pipeline clarity** | Player sees which jobs a credential unlocks before committing |
| **Generational depth** | Parents fund (or neglect) child education with lasting relationship effects |
| **Financial literacy** | Student debt amortization teaches real borrowing consequences |

---

# 2. Philosophy & Constitutional Alignment

## 2.1 Human & Social Capital

Per Constitution Article III, education primarily grows **Human Capital** (skills, credentials, discipline) and **Social Capital** (classmates, alumni, faculty mentors). Financial Capital is affected indirectly through debt, delayed earnings, and career income gates.

## 2.2 Citizen Equality

| Rule | Player | AI Citizen |
|---|---|---|
| Enrollment capacity limits | Same | Same |
| GPA calculation | Same formula | Same formula |
| Scholarship eligibility | Same criteria | Same criteria |
| Student loan terms | Same Banking products | Same Banking products |
| Prestige decay | Same half-life | Same half-life |
| Dropout consequences | Same | Same |

**Forbidden:** Player-only grade inflation, AI-only free tuition, hidden credential auto-grants.

## 2.3 Living World Education

While the player sleeps:

- Semester progress advances for enrolled citizens
- Universities release graduate cohorts into labor pools
- Tuition indices adjust with Economy Engine education CPI
- Scholarship pools deplete and refill per policy
- AI classmates graduate, enter careers, and become network contacts

## 2.4 Emergence Over Script

**Approved:** Player drops out during recession; credential loses prestige over 20 years; industry shift makes degree less relevant—continuing education required.

**Rejected:** "Guaranteed job at graduation" quest reward unrelated to labor market.

## 2.5 Product Bible Alignment (§14)

| Bible Principle | Design Implementation |
|---|---|
| Education is investment with uncertain ROI | Outcome preview shows ranges, not guarantees |
| Multiple valid paths | Path comparison table in `/education` |
| Grade inflation resistance | Top employers require GPA thresholds |
| University as living institution | Cohort events, campus news, research spillovers |
| Child education is parental gameplay | Parent funding and involvement choices |

## 2.6 Design Review Questions

Before shipping any education feature, answer:

1. Does this create a real trade-off (time, money, energy, opportunity)?
2. Can an AI citizen take the same action under the same rules?
3. Does the outcome connect to Career (07) or Company (19) systems?
4. Is the financial consequence teachable (debt service, ROI horizon)?
5. Does neglecting education remain a valid—but harder—path?

---

# 3. Education Lifecycle Overview

## 3.1 Age Gates & Stages

| Stage | Typical Age Range | Player Control Level | Primary Capital |
|---|---|---|---|
| Early childhood | 0–5 | Indirect (parent) | Human (base) |
| Primary school | 6–11 | Guided autonomy | Human |
| Secondary school | 12–17 | High autonomy | Human, Social |
| Gap year / work | 18–19 | Full autonomy | Financial, Human |
| Higher education | 18–26+ | Full autonomy | Human, Social, Financial (debt) |
| Trade / vocational | 16–24 | Full autonomy | Human, Financial |
| Continuing education | Any adult | Full autonomy | Human |
| Parent-funded child ed | Player as parent | Full autonomy | Social, Legacy |

## 3.2 Enrollment States

```typescript
type EnrollmentStatus =
  | 'not_enrolled'
  | 'applied'
  | 'waitlisted'
  | 'enrolled'
  | 'on_leave'
  | 'probation'
  | 'graduated'
  | 'expelled'
  | 'dropped_out';
```

## 3.3 Term Structure

| Institution Type | Term Unit | Terms per Year | Progress Tick |
|---|---|---|---|
| Primary/Secondary | Quarter or semester | 4 or 2 | Monthly |
| University | Semester | 2 (+ optional summer) | Monthly |
| Trade school | Module | 3–6 modules/year | Monthly |
| Certification bootcamp | Intensive block | 1–4 blocks | Weekly during block |
| Continuing ed | Short course | Variable | On completion |

## 3.4 Credential Hierarchy

```
Primary completion certificate
  └── Secondary diploma (with honors tiers)
        ├── Associate degree (2yr)
        ├── Bachelor degree (4yr)
        │     └── Master / Professional (MBA, JD, MD)
        ├── Trade certificate + journeyman license
        └── Professional certifications (CPA, PMP, RN license)
```

Higher credentials **superset** lower requirements for career gates unless a specialized license is required (e.g., MD for physician).

---

# 4. Institution Types & Tiers

## 4.1 Institution Taxonomy

| Type | Examples | Selectivity | Typical Cost Tier |
|---|---|---|---|
| Public primary | City district schools | Zoned / open | Low (tax-funded) |
| Private primary | Prep academies | Application + tuition | High |
| Public secondary | State high schools | Zoned | Low |
| Magnet / charter | STEM academy | Competitive admission | Medium |
| Community college | 2-year programs | Open / low bar | Low |
| Public university | State flagship | Moderate GPA/SAT analog | Medium |
| Private university | Elite research | Highly selective | Very high |
| Trade institute | Electrician, HVAC, nursing aide | Skill assessment | Medium |
| Online provider | Remote certs | Open | Low–medium |
| Corporate academy | Company-sponsored pipeline | Employment conditional | Employer-paid |

## 4.2 Prestige Tier (1–5)

| Tier | Label | Career Multiplier (Soft) | Network Quality | Selectivity |
|---|---|---|---|---|
| 1 | Local / unranked | 1.00× | Local | Open |
| 2 | Regional respected | 1.05× | Regional | Moderate |
| 3 | Nationally known | 1.12× | National | Competitive |
| 4 | Elite | 1.20× | Elite alumni | Highly selective |
| 5 | World-renowned | 1.30× | Global | <5% admit |

**Prestige decay:** Institution prestige for hiring purposes decays if graduate cohort quality or research output declines (Living World simulation). Player sees **current** prestige, not historical brochure rank.

## 4.3 Capacity & Waitlists

Each institution has `maxEnrollment` per program per term. When exceeded:

1. Applicants ranked by composite score (GPA, test analog, extracurricular, legacy hook, diversity policy modifier per Government)
2. Top N admitted; remainder waitlisted or rejected
3. Player receives **actionable feedback** ("Raise GPA 0.2 or retake entrance exam")

## 4.4 Institution Attributes (Content Schema)

| Field | Player-Visible | Gameplay Effect |
|---|---|---|
| `displayName` | Yes | Identity |
| `prestigeTier` | Yes | Network quality, employer bias |
| `tuitionPerTerm` | Yes | Direct cost |
| `programsOffered[]` | Yes | Enrollment options |
| `campusDistrict` | Yes | Commute, housing cost, local hiring |
| `researchFocus` | Yes (detail) | Local economy spillover |
| `financialAidBudget` | Hidden aggregate | Scholarship availability |
| `graduationRate` | Yes | Risk signal |
| `avgStartingSalary` | Yes (estimate) | ROI preview |

---

# 5. Primary & Secondary School

## 5.1 Gameplay Purpose

Primary and secondary school establish **foundational Human Capital** without overwhelming micromanagement. Player makes **periodic meaningful choices**; daily class simulation is abstracted.

## 5.2 Player Choices (Secondary Focus)

| Choice Frequency | Options | Effect |
|---|---|---|
| Per year | Study focus (STEM / Arts / Balanced) | Skill vector bias |
| Per year | Extracurricular (Sports, Debate, Music, Work) | Social capital, stress, income (part-time) |
| Per term | Effort level (Low / Normal / High) | GPA trajectory, energy cost |
| Event-driven | Bullying response, teacher conflict | Relationship, stress, memory |
| Age 16+ | Part-time job vs. extra study | Cash vs. GPA |

## 5.3 GPA (Secondary Scale)

Secondary GPA uses **0.0–4.0 unweighted** scale matching university transition:

| Letter | Points |
|---|---|
| A | 4.0 |
| B | 3.0 |
| C | 2.0 |
| D | 1.0 |
| F | 0.0 |

Honors/AP courses (magnet schools): +0.5 weight per course, capped at 4.5 weighted GPA displayed separately.

## 5.4 Outcomes at Graduation (Age 18)

| Outcome | Gate | Unlocks |
|---|---|---|
| Honors diploma | Weighted GPA ≥ 3.7 | Tier 3–4 university eligibility |
| Standard diploma | GPA ≥ 2.0 | Community college, most public unis |
| GED equivalent | Dropout recovery path | Limited university; trade favored |
| Disciplinary record | Major infractions | Selective admission penalty |

## 5.5 Parent Play (When Player Is Child)

If player starts as minor or plays childhood chapter:

- Parent NPCs auto-enroll player in school matching household income/values
- Player can petition for magnet transfer (Social capital check)
- Neglect: truancy events if happiness/stress thresholds breached

---

# 6. Higher Education — Universities

## 6.1 Application Flow

```
Browse programs → Check requirements → Submit application
  → [Wait for decision tick]
  → Admitted / Waitlisted / Rejected
  → Accept offer → Pay deposit → Enroll
  → Select course load → Confirm financing
```

## 6.2 Admission Requirements (Typical)

| Requirement Type | Hard Gate | Soft Weight |
|---|---|---|
| Secondary GPA | Min 2.5–3.8 by tier | 40% of score |
| Standardized test | Min percentile | 25% |
| Extracurricular / essay | — | 15% |
| Legacy / alumni parent | — | 10% (institution-dependent) |
| Interview | Program-specific | 10% |

## 6.3 Course Load

| Load | Credits/Term | Time Cost | GPA Risk | Financial Aid |
|---|---|---|---|---|
| Part-time | 6–8 | Allows full-time work | Lower stress | Often reduced |
| Standard | 12–15 | Moderate work possible | Balanced | Full eligibility |
| Heavy | 16–18 | No substantial work | High stress | Full |
| Overload | 19+ | Rare; requires approval | Burnout risk | Case-by-case |

## 6.4 Major Declaration

- **Undeclared** allowed until end of sophomore year (configurable per institution)
- Declaring major locks **degree requirement tree**
- Changing major: possible with **time + money penalty**; some credits may not transfer internally

## 6.5 Leave, Probation, Expulsion

| State | Trigger | Player Options |
|---|---|---|
| Academic probation | Term GPA < 2.0 | Improve grades or face dismissal |
| Medical leave | Health event | Pause enrollment; loans may defer |
| Voluntary leave | Player choice | Return within 2 years typical |
| Expulsion | Honor code, violence | Transfer difficulty; reputation hit |

## 6.6 Graduation Requirements

| Requirement | Typical |
|---|---|
| Total credits | 120 (bachelor) |
| Major credits | 40–60 |
| Core curriculum | 30–45 |
| Minimum cumulative GPA | 2.0 (institution); 3.0+ for honors |
| Capstone / thesis | Program-specific |
| Financial clearance | No holds on bursar account |

---

# 7. Majors, Degrees & Credentials

## 7.1 Degree Types

| Degree | Duration | Career Tier Unlock | Debt Risk |
|---|---|---|---|
| Certificate (<1yr) | 6–12 mo | Entry specialist | Low |
| Associate | 2 yr | Paraprofessional, transfer | Low–medium |
| Bachelor | 4 yr | Professional entry | Medium–high |
| Master | 1–2 yr post-bac | Senior / specialist | High |
| Doctorate | 3–7 yr | Research, academia, licensed prof | Very high |
| Professional (JD, MD, MBA) | 2–4 yr | Licensed / executive | Very high |

## 7.2 Major Categories (Launch Content Target: 40 Programs)

| Category | Example Majors | Primary Skills | Top Career Tracks (07) |
|---|---|---|---|
| STEM | CS, Engineering, Biology | Logic, Technical, Analysis | Software, Biotech, Research |
| Business | Finance, Marketing, Accounting | Leadership, Discipline, Analysis | Banking, Corp mgmt, Accounting |
| Health | Nursing, Pre-med, Public Health | Discipline, Empathy | Healthcare, Pharma |
| Arts & Humanities | English, History, Fine Arts | Creativity, Communication | Media, Education, Law prep |
| Social Sciences | Psychology, Economics, Poli Sci | Empathy, Analysis | Government, HR, Consulting |
| Trades (via CC) | Welding, Automotive | Technical, Discipline | Skilled trades |
| Education | Elementary Ed | Empathy, Patience | Teaching |

## 7.3 Credential Record (Player View)

Each earned credential displays:

- Institution name + prestige tier at graduation
- Major / concentration
- Graduation date
- Final GPA
- Honors (Cum Laude, Magna, Summa)
- **Prestige at hire time** (may differ from graduation prestige due to decay)

## 7.4 Degree Requirement Tree (Example: BS Computer Science)

| Year | Required Courses | Electives | Credit Total |
|---|---|---|---|
| 1 | Intro CS, Calc I/II, Gen Ed | 1 | 30 |
| 2 | Data Structures, Discrete Math, Physics | 2 | 30 |
| 3 | Algorithms, Systems, Stats | 2 | 30 |
| 4 | Capstone, Security, AI elective | 2 | 30 |

Player selects **electives** that bias skill output (e.g., AI elective → +Technical, +Logic).

---

# 8. GPA & Academic Performance

## 8.1 University GPA Calculation

Cumulative GPA = Σ(gradePoints × credits) / Σ(credits)

| Grade | Points |
|---|---|
| A / A- | 4.0 / 3.7 |
| B+ / B / B- | 3.3 / 3.0 / 2.7 |
| C+ / C / C- | 2.3 / 2.0 / 1.7 |
| D | 1.0 |
| F | 0.0 (no credit) |

## 8.2 Performance Inputs (Per Term)

```
termGrade = f(baseAptitude, effort, courseDifficulty, instructorQuality,
              stress, energy, workHours, traitStudyBonus, randomNoise)
```

| Input | Source | Player Control |
|---|---|---|
| `baseAptitude` | Skills + prior GPA | Indirect (past choices) |
| `effort` | Player slider / action | Direct |
| `courseDifficulty` | Course metadata | Indirect (course pick) |
| `stress` | Citizen vitals | Manage via lifestyle |
| `workHours` | Part-time job | Direct |
| `traitStudyBonus` | CDPS Discipline, Patience | Indirect |

## 8.3 Study Actions (Player)

| Action | Energy Cost | GPA Boost | Opportunity Cost |
|---|---|---|---|
| Normal attendance | Low | Baseline | — |
| Extra study session | Medium | +moderate | Social time |
| Study group | Medium | +moderate | +Social capital |
| Cheat (risky) | Low | +high if undetected | Honor code expulsion risk |
| Skip classes | Saves energy | −penalty | — |
| Office hours | Low | +small | Mentor relationship |

## 8.4 GPA Gameplay Consequences

| GPA Band | Effect |
|---|---|
| 3.7+ | Summa eligibility; top employer screens pass |
| 3.3–3.69 | Magna; most competitive internships |
| 3.0–3.29 | Standard; majority of jobs |
| 2.5–2.99 | Reduced campus recruiting access |
| 2.0–2.49 | Probation risk; some majors lock |
| <2.0 | Dismissal / remediation |

## 8.5 Grade Inflation Resistance

Elite employers and graduate programs apply **effective GPA cutoffs** that do not inflate with time. A 3.2 from Tier 5 school may beat 3.8 from Tier 1 for raw credential signal—but **both** may lose to 3.9 + Tier 5 for top finance roles.

---

# 9. Trade Schools & Vocational Paths

## 9.1 Design Intent

Trade paths offer **earlier income, lower debt, and strong ceiling in skilled trades** with geographic demand variation. Respects Product Bible "multiple valid paths."

## 9.2 Program Structure

| Phase | Duration | Income | Output |
|---|---|---|---|
| Classroom foundation | 3–6 months | None / stipend | Basic skills |
| Shop / lab | 6–12 months | None | Technical proficiency |
| Apprenticeship | 1–4 years | Sub-journeyman wage | Journeyman license |
| Journeyman | Ongoing | Full trade wage | Master path optional |

## 9.3 Trade vs. University Comparison (Player UI)

| Factor | Trade (Electrician) | University (CS) |
|---|---|---|
| Time to income | ~18 months partial | ~4 years full |
| Typical debt | $8K–$25K | $40K–$120K |
| Income ceiling (p50) | High in boom regions | Very high in tech hubs |
| Cyclical risk | Construction-linked | Tech hiring-linked |
| Credential decay | License renewal | Prestige decay |

## 9.4 Apprenticeship Matching

Player applies to apprenticeship slots sponsored by:

- Trade unions (Social capital + exam score)
- Private contractors (Interview + skill)
- Company pipelines (Conditional on future employment)

---

# 10. Certifications & Licenses

## 10.1 Certification Types

| Type | Renewal | Career Gate | Example |
|---|---|---|---|
| Professional license | Annual / biennial | Hard | RN, CPA, PE |
| Industry cert | 2–3 years | Soft–hard | AWS, PMP, Series 7 |
| Safety cert | 1–5 years | Hard (trades) | OSHA, CDL |
| Continuing ed unit | Rolling | License maintenance | Medical CME |

## 10.2 Earning Flow

```
Check prerequisites → Enroll in prep course (optional)
  → Pass exam event → Credential issued
  → Renewal clock starts
```

## 10.3 Expiry & Lapse

- Expired license: **hard block** on gated careers until renewed
- Grace period: 30–90 days per cert type (configurable)
- Player notification at 90, 30, 7 days before expiry

## 10.4 Exam Mechanics

Exams consume **energy + time** in a single or multi-day event:

- Pass threshold based on prep course completion + relevant skills + traits (Discipline, Logic)
- Fail: retake fee + schedule delay
- Max attempts: 3 per term (anti-grind)

---

# 11. Continuing & Executive Education

## 11.1 When Offered

| Trigger | Suggested Program |
|---|---|
| Industry disruption event | Reskilling bootcamp |
| Promotion gate at employer | Executive leadership cert |
| Credential prestige decay | Alumni refresher / advanced degree |
| Mid-career pivot | Part-time master's |

## 11.2 Executive MBA Pattern

- Requires 5+ years experience
- High tuition ($80K–$150K indexed)
- **Network value >> skill value** for Social capital
- Weekend/evening format: part-time energy load

## 11.3 Self-Study Path

Player may pursue **skill gains without formal credential**:

- Lower cost, no debt
- No employer gate bypass for hard credential jobs
- Faster in boom industries valuing portfolios (CS, design)

---

# 12. Financing — Tuition, Loans, Scholarships

## 12.1 Cost Components

| Component | Charged | Notes |
|---|---|---|
| Tuition | Per credit or flat term | Indexed to `economy.education_index` |
| Fees | Per term | Lab, activity, tech |
| Room & board | If on-campus | Links to Housing (10) |
| Books & supplies | Per term | Minor sink |
| Opportunity cost | Implicit | Foregone wages |

## 12.2 Payment Methods

| Method | Flow |
|---|---|
| Out of pocket | Immediate debit from Banking |
| 529 / education savings | If account exists (parent planning) |
| Federal loan analog | Application → approval → disbursement to bursar |
| Private loan | Credit score gate; higher rate |
| Employer sponsorship | Conditional employment contract |
| Scholarship / grant | Merit or need; reduces tuition directly |
| Work-study | Part-time campus job; income + small grant |

## 12.3 Student Loan Terms (Player-Facing)

| Parameter | Typical Range |
|---|---|
| Principal | Up to cost of attendance − aid |
| Interest rate | Policy rate + education spread (Economy 18) |
| Deferment | In-school + 6 months grace |
| Repayment term | 10–25 years |
| Income-driven plan | Optional; % of discretionary income |
| Forgiveness | Rare; tied to Government policy events |
| Default | Credit score collapse; wage garnishment analog |

## 12.4 Scholarship Types

| Type | Criteria | Player Action |
|---|---|---|
| Merit | GPA, test scores | Auto-considered on application |
| Need | Household income | FAFSA analog form |
| Athletic | Sports rating | Recruiting mini-flow |
| Diversity / regional | Policy | Automatic if eligible |
| Alumni legacy | Parent alumni | Automatic modifier |
| External | Company / NGO | Apply separately |

## 12.5 Debt UX Requirements

Player always sees:

- **Total debt outstanding**
- **Monthly payment** (when in repayment)
- **Projected payoff date**
- **Interest accrued this term**
- **Debt-to-income ratio** vs. projected starting salary

---

# 13. Skill Gains & Human Capital Output

## 13.1 Skills Produced by Education

| Skill Category | Primary Sources |
|---|---|
| Logic | STEM coursework, exams |
| Technical | Labs, trade shop, CS projects |
| Communication | Humanities, presentations |
| Leadership | Group projects, student government |
| Discipline | Sustained enrollment, high GPA |
| Creativity | Arts programs |
| Empathy | Health, education, social work |
| Analysis | Economics, research methods |

## 13.2 Skill Gain Formula (Conceptual)

```
skillDelta = baseCourseGain × effortMultiplier × institutionQuality
           × traitAffinityBonus × (1 - skillSaturationPenalty)
```

## 13.3 Saturation

Skills gained from education **diminish** if citizen already exceeds professional tier for that skill—encouraging continuing education in new domains rather than infinite re-enrollment in same major.

## 13.4 Credentials vs. Skills

| Hiring Screen | Checks |
|---|---|
| Hard gate | Credential present + valid |
| Performance | Relevant skills |
| Prestige bias | Institution tier |
| GPA cutoff | Cumulative GPA |

Career Engine (07) defines per-job weights. Player sees breakdown in `/education` Outcomes tab.

---

# 14. Networking & Alumni Systems

## 14.1 Network Formation

During enrollment, citizen builds **latent network graph**:

| Contact Type | Formation | Future Use |
|---|---|---|
| Classmate | Same course / year | Cofounder, hire, referral |
| Professor | Office hours, research | Mentor, investor intro |
| Alumni | Events, career fair | Job referral, funding |
| Greek / club | Extracurricular | Social capital cluster |

## 14.2 Alumni Events

| Event | Frequency | Player Action | Outcome |
|---|---|---|---|
| Career fair | 1×/year on campus | Attend | Job applications boosted |
| Homecoming | Annual | Attend (optional) | Social + business intros |
| Donor gala | Tier 4–5 | Attend if invited | High-value contacts |
| Online alumni directory | Always | Browse | Cold outreach (low success) |

## 14.3 Networking Success Modifiers

- CDPS: Charisma, Integrity (long-term trust)
- Personal reputation
- Shared extracurricular history
- Macro hiring demand in contact's industry

---

# 15. Education-Career Pipeline

## 15.1 Job Requirement Schema (Contract with Doc 07)

```typescript
interface JobEducationRequirement {
  credentialId?: string;           // hard: must possess
  minCredentialTier?: number;
  minGPA?: number;
  minSkillLevels?: Partial<SkillVector>;
  preferredMajors?: string[];
  acceptsEquivalentExperience?: boolean;
  experienceYearsSubstitute?: number; // per missing credential year
}
```

## 15.2 Pipeline Stages

```
Enrolled → Internship eligible (jr/sr year)
  → Campus recruiting season
  → Offers (binding / non-binding)
  → Graduate → Full-time start date
  → OR: Graduate → Job search (general market)
```

## 15.3 Internship Gameplay

| Aspect | Rule |
|---|---|
| Eligibility | GPA ≥ 2.5 typical; major match |
| Duration | Summer or co-op term |
| Pay | Indexed wage; below full-time |
| Outcome | Return offer probability based on performance |
| Conflict | Full-time internship may delay graduation |

## 15.4 Career Fair (Player Flow)

1. View attending employers (filtered by major)
2. Queue for booth (time cost)
3. Mini-interaction: pitch + GPA + skills check
4. Receive interview invitation or rejection
5. Interviews flow to Career Engine (07)

## 15.5 Non-Degree Paths to Same Job

Some jobs accept:

- **Portfolio** (CS, design): skills > credential if threshold met
- **Experience substitute**: 5 years industry = degree waiver (configurable per job)
- **Founder bypass**: own company; hiring self

Player sees **all paths** in Outcomes preview—not only degree path.

---

# 16. Parenting & Child Education

## 16.1 Parent Player Actions

| Action | Cost | Child Effect |
|---|---|---|
| Pay for private school | High tuition | +Prestige, +Social |
| Fund extracurriculars | Medium | Skill + happiness |
| Hire tutor | Medium | GPA boost |
| Neglect / underfund | — | Relationship −, GPA risk |
| College savings (529) | Early investment | Reduced future debt stress |
| Choose not to fund college | — | Relationship strain; child takes loans |

## 16.2 Child Autonomy

At age 16+, child citizen (NPC or future heir) may:

- Resist parent pressure (relationship conflict event)
- Choose trade over parent's university preference
- Accept scholarship against parent's control wishes

## 16.3 Favoritism Consequences

Unequal education spending between siblings:

- Relationship meters diverge
- Inheritance dispute risk increases
- Dynasty reputation: "partial" if publicized

---

# 17. Player Flows & Decision Points

## 17.1 Flow: First-Time University Enrollment

| Step | Screen | Decision |
|---|---|---|
| 1 | `/education` → Paths | Browse institutions |
| 2 | Program detail | Compare ROI, requirements |
| 3 | Application | Submit; pay fee |
| 4 | Wait | Notification on decision day |
| 5 | Offer letter | Accept / decline |
| 6 | Financing | Loans, scholarships, work-study |
| 7 | Registration | Course load, schedule |
| 8 | Term loop | Effort, study, social |
| 9 | Graduation | Credential awarded; timeline event |

## 17.2 Flow: Dropout Consideration

Player initiates dropout from `/education`:

- **Consequence preview:** debt status, partial credits, career doors closed/opened, family reaction
- Confirm with typed "DROP" (destructive pattern per UI 34)
- Status → `dropped_out`; some credits may transfer

## 17.3 Flow: Mid-Career Certification

| Step | Action |
|---|---|
| 1 | Career screen flags missing cert for promotion |
| 2 | Deep link to `/education` → Continuing |
| 3 | Enroll in prep + exam |
| 4 | Pass exam → credential → promotion unlocked |

## 17.4 Flow: Child College Funding (Parent)

| Step | Action |
|---|---|
| 1 | `/family` → child detail → Education plan |
| 2 | Set funding level (full / partial / none) |
| 3 | Optional 529 contribution |
| 4 | Child applies; parent may co-sign loan |
| 5 | Outcomes affect relationship meters |

---

# 18. Education Screen (`/education`)

## 18.1 Primary Decision

**What to study, where, and how to pay for it?**

## 18.2 Layout Zones (per UI 34 §5.10)

| Zone | Content | Priority |
|---|---|---|
| **Current** | Enrollment status, term GPA, schedule, next deadlines | P0 if enrolled |
| **Paths** | School → university → trade → cert tree | P0 if not enrolled |
| **Costs** | Tuition breakdown, aid, debt summary | P1 |
| **Outcomes** | Career doors, salary ranges, network preview | P1 |
| **Network** | Classmates, alumni events, career fair | P2 |

## 18.3 Header Metrics (Always Visible)

| Metric | Example |
|---|---|
| Current institution | "Avencia Tech University" |
| Program | "BS Computer Science, Year 3" |
| Cumulative GPA | "3.42" |
| Debt outstanding | "$34,200" |
| Next milestone | "Registration closes in 12 days" |

## 18.4 Empty States

| State | Message | CTA |
|---|---|---|
| Not enrolled, age 18+ | "Your education path is open." | Browse Paths |
| Completed degree | "Alumni status active." | Continuing ed / Events |
| Too young | "Enrolled in Lincoln Secondary (Year 10)." | Adjust effort |
| Expelled | "You must transfer or appeal." | Appeal / Trade paths |

## 18.5 Mobile / Diegetic Access

Education also accessible via Smartphone `/phone` → Education app (summary + notifications only; full flows on `/education`).

---

# 19. Notifications & Diegetic Feedback

## 19.1 Notification Types

| Event | Channel | Priority |
|---|---|---|
| Admission decision | Phone + banner | P0 |
| Registration deadline | Phone | P1 |
| Term grades posted | Email diegetic + timeline | P1 |
| Probation warning | Phone + `/education` | P0 |
| Scholarship awarded | Phone | P1 |
| Loan payment due | Banking app cross-notify | P1 |
| Career fair tomorrow | Phone | P2 |
| Classmate became CEO (news) | News feed optional | P3 |

## 19.2 Timeline Integration

All milestones create Timeline entries with Human Capital chip:

- `Enrolled at {institution}`
- `Dean's List — Term {n}`
- `Graduated {degree} — GPA {x}`
- `Student loan entered repayment`

---

# 20. AI Citizen Education Parity

## 20.1 AI Enrollment

AI citizens at life course decision points (age 18, career pivot) evaluate utility:

```
U(educationPath) = w1×expectedIncome + w2×debtAversion + w3×traitAmbition
                 + w4×parentPressure + w5×macroHiringDemand + noise
```

Per CDPS (16) and Citizen AI (20).

## 20.2 Visible World Effects

- Campus population affects district housing demand (Doc 10)
- Graduate cohorts swell labor pools → wage pressure in Career (07)
- University research triggers local tech boom news

## 20.3 Player Competition

AI classmates may become:

- Job rivals in campus recruiting
- Future cofounders (high relationship + shared major)
- NPC executives hiring player later

---

# 21. Events & Timeline Integration

## 21.1 Player-Visible Domain Events

| Event | Trigger | Player Impact |
|---|---|---|
| `education.enrolled` | Registration complete | Schedule active |
| `education.deans_list` | Term GPA ≥ 3.5 | +Reputation, scholarship boost |
| `education.probation` | Term GPA < 2.0 | Warning UI |
| `education.graduated` | Requirements met | Credential, timeline, career unlock |
| `education.dropped_out` | Player/NPC choice | Partial credits, debt remains |
| `education.scholarship_awarded` | Aid computation | Cost reduction |
| `education.research_breakthrough` | Living World | Local economy buff; news |

## 21.2 Cross-Engine Events (Player Interpretation)

| Engine Event | Education Interpretation |
|---|---|
| `economy.tuition_index_adjusted` | Tuition rises next term; notification |
| `government.policy_enacted` (forgiveness) | Loan balance partial forgive |
| `banking.loan_disbursed` | Aid received; bursar cleared |
| `family.child_born` | Future education planning unlock (parent) |

---

# 22. Content Requirements

## 22.1 Launch Targets (M1.4 per Backlog 38)

| Content Type | Minimum Count | Owner |
|---|---|---|
| Primary/secondary schools | 12 per city | Content |
| Universities | 8 per country | Content |
| Academic programs | 40 | Content |
| Trade programs | 15 | Content |
| Professional certifications | 20 | Content |
| Scholarship templates | 25 | Design |

## 22.2 Institution Template (Summary)

Full schema in [35_Content_Pipeline.md](./35_Content_Pipeline.md) §9. Required fields:

- `id`, `displayName`, `type`, `prestigeTier`, `tuitionPerTerm`
- `programs[]`, `admissionProfile`, `campusDistrict`
- `financialAidBudget`, `graduationRate`, assets

## 22.3 Program Template

- `degreeType`, `majorCategory`, `creditRequirements`
- `skillOutputs[]`, `careerUnlocks[]`
- `courseList[]` with difficulty ratings

## 22.4 Localization

Institution names and majors are **data-driven** for regional DLC (European apprenticeship, etc.) per Mod Framework 27.

---

# 23. Mod & Regional Expansion Hooks

## 23.1 Moddable Surfaces

| Surface | Mod Path | Validation |
|---|---|---|
| Institutions | `education/institutions/*` | Schema + balance review |
| Programs | `education/programs/*` | Career prerequisite refs must exist |
| Certifications | `education/certs/*` | Renewal rules required |
| Scholarship rules | `education/aid/*` | Cannot exceed 100% tuition without tag |

## 23.2 Regional Education Systems

| Region Flavor | Distinct Mechanic |
|---|---|
| US default | GPA 4.0, SAT analog, heavy loans |
| EU expansion | Lower tuition, tracked secondary |
| JP expansion | Exam hell, cram schools |

Mods must declare `educationSystem` compatibility per Mod Framework 27.

---

# 24. Balance & Tuning Parameters

## 24.1 Key Tunables (`education/v1.json`)

| Parameter | Default | Range |
|---|---|---|
| `prestigeTierMultiplier` | 1.0–1.30 | Per tier |
| `prestigeDecayHalfLifeYears` | 25 | 10–50 |
| `maxTermWorkHours` | 20 | 0–30 |
| `probationGpaThreshold` | 2.0 | 1.5–2.5 |
| `deansListGpa` | 3.5 | 3.3–3.7 |
| `dropoutCreditRetention` | 0.75 | 0.5–1.0 |
| `scholarshipPoolRefresh` | annual | — |
| `internshipReturnOfferBase` | 0.35 | 0.2–0.6 |

## 24.2 Anti-Patterns (Rejected)

| Pattern | Why Rejected |
|---|---|
| Free unlimited education | No trade-off; breaks economy |
| GPA meaningless | Violates Bible grade inflation resistance |
| Instant degree purchase | Pay-to-win; breaks Human Capital meaning |
| Education without career links | Orphan system |
| Player-only scholarships | Violates Citizen Equality |

## 24.3 Economy Sensitivity

Tuition indexed to Education CPI (Economy 18 §5). During recessions:

- Enrollment may rise (countercyclical)
- Starting salaries fall → ROI preview updates
- Forgiveness policy events more likely (Government)

---

# 25. Acceptance Criteria

## 25.1 Core Enrollment (MVP)

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-001 | Player age 18+ can browse ≥8 institutions in default world | UI test |
| EDU-AC-002 | Application respects hard GPA gates | Unit + integration |
| EDU-AC-003 | Admitted player completes financing flow before term start | E2E |
| EDU-AC-004 | AI citizen with identical stats receives same admission outcome | Symmetry test |
| EDU-AC-005 | Enrollment creates `EducationEnrollment` + timeline entry | DB assertion |

## 25.2 Academic Progress

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-010 | Term effort choice affects term GPA deterministically within noise bounds | Simulation golden |
| EDU-AC-011 | Cumulative GPA updates after each term | Unit |
| EDU-AC-012 | Probation triggers at configured threshold with player notification | E2E |
| EDU-AC-013 | Graduation requires credit + GPA + financial clearance | Integration |
| EDU-AC-014 | Credential appears in citizen profile and Career gate checks | Cross-engine |

## 25.3 Financing

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-020 | Student loan disbursement links to Banking loan account | Integration |
| EDU-AC-021 | Player sees debt, payment, payoff date on `/education` Costs tab | UI |
| EDU-AC-022 | Scholarship reduces tuition; cannot exceed 100% without explicit full-ride flag | Unit |
| EDU-AC-023 | Loan enters repayment after grace period post-graduation | Time tick test |
| EDU-AC-024 | Default affects credit score same as AI citizen default | Symmetry |

## 25.4 Trade & Certification

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-030 | Trade enrollment produces journeyman credential on completion | Integration |
| EDU-AC-031 | License expiry blocks gated career until renewal | Career cross-test |
| EDU-AC-032 | Exam fail allows retake with fee after delay | E2E |

## 25.5 Career Pipeline

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-040 | Outcomes tab lists ≥3 jobs per major with requirement breakdown | Content + UI |
| EDU-AC-041 | Career fair spawns interview invitations based on GPA + major | Integration |
| EDU-AC-042 | Internship completion rolls return offer per tunable probability | Monte Carlo |
| EDU-AC-043 | Job with hard credential requirement rejects applicant without it | Career engine |

## 25.6 Parenting & Family

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-050 | Parent funding choice affects child debt and relationship meter | Family cross-test |
| EDU-AC-051 | Favoritism between siblings adjusts relationship meters | Simulation |
| EDU-AC-052 | 529 contributions reduce future tuition due | Banking integration |

## 25.7 Living World & Performance

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-060 | University releases graduate cohort event each spring | Seasonal tick |
| EDU-AC-061 | Tuition adjusts when `economy.tuition_index_adjusted` fires | Integration |
| EDU-AC-062 | Batch semester update completes within FSF perf budget | Profiling |
| EDU-AC-063 | T2 graduates processed as statistical cohorts without individual course sim | Tier test |

## 25.8 UI / UX

| ID | Criterion | Verification |
|---|---|---|
| EDU-AC-070 | `/education` displays all five zones per UI 34 §5.10 | Visual QA |
| EDU-AC-071 | Dropout requires destructive confirmation with consequence preview | UX |
| EDU-AC-072 | Empty states provide actionable CTA | UX review |
| EDU-AC-073 | Smartphone education app shows summary + deep link to full screen | E2E |

---

# 26. Appendices

## Appendix A — Sample Program ROI Table (Player UI)

| Program | Years | Total Cost | Median Starting Salary | Breakeven Years |
|---|---|---|---|---|
| BS Computer Science (Tier 4) | 4 | $148K | $92K | ~6 |
| BS English (Tier 3) | 4 | $96K | $48K | ~12 |
| Electrician Apprenticeship | 2+2 | $18K | $58K | ~2 |
| ADN Nursing (CC) | 2 | $32K | $62K | ~3 |
| MBA (Tier 5, part-time) | 2 | $120K | +$45K delta | ~8 |

*Breakeven = debt service + opportunity cost vs. wage uplift; illustrative defaults.*

## Appendix B — GPA → Employer Tier Eligibility

| Employer Tier | Min GPA | Min Institution Tier |
|---|---|---|
| Local SME | 2.0 | 1 |
| Regional corp | 2.5 | 2 |
| National brand | 3.0 | 3 |
| Elite finance / consulting | 3.5 | 4 |
| Top 10 global | 3.7 | 5 |

## Appendix C — Event Payload Reference (Player-Facing Fields)

```typescript
interface EducationGraduatedPayload {
  citizenId: string;
  institutionId: string;
  programId: string;
  degreeType: string;
  finalGpa: number;
  honors?: 'cum_laude' | 'magna' | 'summa';
  totalDebtAtGraduation: number;
  graduationDate: string;
}
```

## Appendix D — Cross-Reference Index

| Topic | Primary Doc |
|---|---|
| Career job gates | 07_Career_Employment_Design |
| Trait study effects | 16 CDPS §4, §8 |
| Tuition macro index | 18_Economy_Engine §5 |
| Institution content | 35_Content_Pipeline §9 |
| UI layout | 34_UI_UX_Guidelines §5.10 |
| Engine boundaries | FSF §4.4 |
| Data entities | 04 Database §Education |

---

*End of Document 08 — Education Design v1.0*
