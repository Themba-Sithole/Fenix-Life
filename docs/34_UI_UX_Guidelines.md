# Fenix Life — Official UI/UX Guidelines

**Document Version:** 1.0  
**Status:** Canonical — Interface Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** UX Director & Lead Product Designer  
**Audience:** Design, Engineering, QA, Product, Live Ops, Accessibility  

---

## Document Authority

This UI/UX Guidelines document defines **every screen, navigation pattern, interaction standard, and dashboard philosophy** for Fenix Life. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Diegetic interface, clarity at surface, CEO Test |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Citizen Equality, Living World |
| [32_Art_Direction.md](./32_Art_Direction.md) | Colour, typography, motion, component visuals |
| [33_Audio_Direction.md](./33_Audio_Direction.md) | UI sounds, notification tiers |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | React Router, component architecture, no business logic in UI |

**Implementation reference:** `src/app/screens/`, `src/app/routes.tsx`, `src/app/components/ui/`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [UX Philosophy & Dashboard Principles](#2-ux-philosophy--dashboard-principles)
3. [Global Navigation Architecture](#3-global-navigation-architecture)
4. [Design System & Components](#4-design-system--components)
5. [Screen Specifications](#5-screen-specifications)
6. [Data Display Standards](#6-data-display-standards)
7. [Forms, Decisions & Confirmations](#7-forms-decisions--confirmations)
8. [Notifications & Activity Feed](#8-notifications--activity-feed)
9. [Time, Calendar & Simulation Controls](#9-time-calendar--simulation-controls)
10. [Smartphone App Shell](#10-smartphone-app-shell)
11. [Accessibility Requirements](#11-accessibility-requirements)
12. [Responsive & Platform Behaviour](#12-responsive--platform-behaviour)
13. [Empty, Loading & Error States](#13-empty-loading--error-states)
14. [UX Review Checklist](#14-ux-review-checklist)

---

# 1. Executive Summary

Fenix Life UI reads like **professional executive software**—banking portals, HR systems, market terminals—embedded in a life simulation. Players are **operators of their own life**, not tourists clicking through menus.

**UX north star:**

> *Three numbers to decide. One click to act. Zero surprises in the data.*

Every screen must declare:

1. **Primary decision** — what is the player deciding here?
2. **Supporting data** — what three metrics matter most?
3. **Context channel** — news, timeline, or relationships that inform the decision

---

# 2. UX Philosophy & Dashboard Principles

## 2.1 The CEO Test

Every new screen must pass: *Would a competent adult recognize this layout from real professional tools?*

| Pass | Fail |
|---|---|
| Banking dashboard with accounts, cash flow, transactions | Cartoon wallet with giant coin button |
| Company KPI cards + revenue chart | Single "MAKE MONEY" button |
| Employee table with sort/filter | Random face grid with no data |

## 2.2 Information Hierarchy (F-Pattern)

```
┌──────────────────────────────────────────────────────────────┐
│ GLOBAL NAV: Identity · Date · Weather · Notifications        │
├──────────────────────────────────────────────────────────────┤
│ HERO: Title · Primary KPI · Status Badge                     │
├──────────────────────────────────────────────────────────────┤
│ METRIC ROW: 3–4 equal cards                                  │
├───────────────────────────────┬──────────────────────────────┤
│ PRIMARY PANEL (2/3)           │ SECONDARY PANEL (1/3)        │
│ Charts · Tables · Decisions   │ Actions · News · Quick links │
└───────────────────────────────┴──────────────────────────────┘
```

## 2.3 Diegetic Interface Rule

Features arrive as **in-world artifacts**:

| Feature | Diegetic Frame |
|---|---|
| Banking | Bank portal (`/banking`) |
| Company ops | Company dashboard (`/company`) |
| Investments | Broker app / Stock Market (`/stocks`) |
| Social/news | News Feed (`/news`), Smartphone (`/phone`) |
| Career HR | Employee Management (`/employees`) |
| Life overview | Home Screen (`/home`) |

Avoid meta "Game Menu" entries for systems that have real-world equivalents.

## 2.4 Five Capitals UX Mapping

Every major screen displays **capital relevance chips** (optional toggle in Settings):

| Screen | Primary Capital(s) |
|---|---|
| Home Screen | All five summary |
| Banking Dashboard | Financial |
| Company Dashboard | Business, Financial |
| Stock Market | Financial |
| Education | Human |
| Family | Social, Legacy |
| Timeline | Legacy (all events) |
| Real Estate | Financial |
| Employee Management | Business, Human |

## 2.5 Consistency Rules

| Element | Standard |
|---|---|
| Page background | `bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]` |
| Max content width | `max-w-7xl mx-auto` |
| Back navigation | Top-left ghost button on sub-screens → `/home` or parent |
| Card border | `border-[#2EC4B6]/20 shadow-lg` |
| Primary CTA | Emerald gradient button |

---

# 3. Global Navigation Architecture

## 3.1 Route Map

Defined in `src/app/routes.tsx`:

| Route | Screen | Role |
|---|---|---|
| `/` | MainMenu | Entry, continue, new life |
| `/character-creation` | CharacterCreation | New citizen setup |
| `/home` | HomeScreen | Life hub / command center |
| `/city` | CityMap | 2D world navigation |
| `/phone` | Smartphone | Diegetic app launcher |
| `/banking` | BankingDashboard | Personal & business finance |
| `/company` | CompanyDashboard | Owned company operations |
| `/employees` | EmployeeManagement | HR / hiring / reviews |
| `/stocks` | StockMarket | Investments & trading |
| `/real-estate` | RealEstate | Property browse & manage |
| `/vehicles` | VehicleDealership | Vehicle browse & own |
| `/education` | Education | School, university, courses |
| `/family` | Family | Relationships & lineage |
| `/timeline` | Timeline | Life event history |
| `/news` | NewsFeed | World & personal news |
| `/settings` | Settings | Audio, graphics, gameplay |

## 3.2 Navigation Layers

```
Layer 0: Main Menu (out of world)
Layer 1: Home Screen (life hub)
Layer 2: Domain dashboards (banking, company, etc.)
Layer 3: Task detail (loan application, hire candidate, stock order)
Layer 4: Modal / drawer confirmations
```

**Rule:** Never exceed 3 taps from Home to any primary domain.

## 3.3 Home Screen Quick Actions

Current implementation (`HomeScreen.tsx`):

| Action | Path | Icon |
|---|---|---|
| Phone | `/phone` | Smartphone |
| City | `/city` | Map |
| Family | `/family` | Users |
| Company | `/company` | Briefcase |
| Vehicle | `/vehicles` | Car |
| Property | `/real-estate` | Home |
| Education | `/education` | GraduationCap |
| Shopping | `/city` | ShoppingBag |

## 3.4 Global Header (In-World)

Present on Home Screen and should propagate to all Layer 2 screens:

| Element | Content |
|---|---|
| Left | Menu (future: slide-out nav drawer) |
| Center-left | Citizen name + primary role |
| Center-right | In-game date |
| Right | Weather + notification bell |

---

# 4. Design System & Components

## 4.1 Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix primitives) |
| Icons | Lucide React |
| Charts | Recharts |
| Toasts | Sonner |
| Forms | React Hook Form + Zod (when wired) |

## 4.2 Component Inventory

Located in `src/app/components/ui/`. **Do not duplicate**—extend via composition.

| Category | Components |
|---|---|
| Layout | Card, Separator, ScrollArea, Resizable, Sidebar |
| Input | Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Calendar |
| Feedback | Alert, Badge, Progress, Skeleton, Sonner |
| Overlay | Dialog, Sheet, Drawer, Popover, Tooltip, HoverCard |
| Navigation | Tabs, Breadcrumb, NavigationMenu, Pagination |
| Data | Table, Chart |

## 4.3 Button Hierarchy

| Level | Usage | Style |
|---|---|---|
| Primary | Main action per panel | Emerald gradient |
| Secondary | Alternative action | Outline navy |
| Ghost | Back, cancel, toolbar | Ghost |
| Destructive | Irreversible (fire, divorce) | Red outline → confirm dialog |

**One primary button per panel maximum.**

---

# 5. Screen Specifications

## 5.1 Main Menu (`/`)

**Primary decision:** Start, continue, or configure session.

| Zone | Content |
|---|---|
| Hero | Animated skyline, day/night preview, ticker |
| Actions | New Life, Continue, Multiplayer, Settings, Achievements, Leaderboards, Credits |
| Profile strip | Net worth, company value, age, city, career, headlines |

**UX notes:**

- Continue disabled with tooltip when no save
- Multiplayer shows constitution-compliant opt-in explanation
- Ticker displays live world headlines from save or demo

## 5.2 Character Creation (`/character-creation`)

**Primary decision:** Define starting citizen and background.

| Section | Fields |
|---|---|
| Identity | Name, gender, birthday, nationality |
| Origin | Home country, starting city |
| Appearance | Skin, hair, facial hair, glasses, clothing |
| Background | Wealthy / Middle / Working / Orphan / Immigrant / Entrepreneur family |

Each background shows: starting cash, education, relationships, connections, advantages, disadvantages, difficulty rating.

**UX notes:**

- Difficulty rating uses gold badge for Hard, emerald for Standard
- Preview panel updates live
- "Start Life" requires confirmation summarizing tradeoffs

## 5.3 Home Screen (`/home`)

**Primary decision:** What domain of life to engage next?

| Zone | Content |
|---|---|
| Global header | Name, role, date, weather, notifications |
| Character card | Avatar, age, vitals (Happiness, Health, Energy, Stress) |
| Financial strip | Net worth, cash, bank, monthly expenses |
| Quick actions | 8-tile grid to major domains |
| Activity feed | Recent events with time + semantic type |
| Calendar widget | Upcoming events |

**Vitals:** Progress bars with icon + colour coding per Art Direction.

## 5.4 Banking Dashboard (`/banking`)

**Primary decision:** Where is money, and what moves next?

| Zone | Content |
|---|---|
| Hero | Total net worth, back nav |
| Account cards | Checking, Savings, Business, Investment |
| Balance history | Area chart (6+ months) |
| Cash flow | Bar chart income vs expenses |
| Transactions | Sortable ledger with credit/debit colour |
| Quick actions | Transfer, pay bill, apply loan, credit score |

**Three key numbers:** Net worth, monthly cash flow, credit score.

## 5.5 Company Dashboard (`/company`)

**Primary decision:** Is the business healthy, and what lever to pull?

| Zone | Content |
|---|---|
| Hero | Company name, stage badge (e.g., Growing • Series A) |
| KPI row | Revenue, Profit, Employees, Products |
| Revenue chart | Line chart revenue + profit |
| Department breakdown | Pie chart |
| Operations panel | Goals, alerts, shortcuts to employees/products |
| Actions | Hire, launch product, seek funding, pay dividends |

**Three key numbers:** Revenue, profit margin, employee count.

## 5.6 Employee Management (`/employees`)

**Primary decision:** Who to hire, promote, or release?

| Zone | Content |
|---|---|
| Pipeline | Candidates, interviews, offers |
| Roster | Sortable table: name, role, skill, happiness, salary |
| Org chart | Department tree (future) |
| Actions | Post job, review, train, terminate |

**UX:** Termination requires typed confirmation + consequence preview.

## 5.7 Stock Market (`/stocks`)

**Primary decision:** Buy, sell, or hold?

| Zone | Content |
|---|---|
| Watchlist | Tickers, price, change %, sparkline |
| Detail | Chart, fundamentals, news |
| Portfolio | Holdings, cost basis, P&L |
| Order ticket | Market/limit, quantity, margin warning |
| Market news | Sector headlines |

**Three key numbers:** Portfolio value, day change, cash available.

## 5.8 Real Estate (`/real-estate`)

**Primary decision:** Acquire, improve, or divest property?

| Zone | Content |
|---|---|
| Browse | Filters: type, price, district, cap rate |
| Owned | Mortgage, equity, rental income |
| Detail | Photos, specs, neighborhood stats |
| Actions | Buy, sell, renovate, rent |

## 5.9 Vehicle Dealership (`/vehicles`)

**Primary decision:** Purchase, finance, or maintain vehicles?

| Zone | Content |
|---|---|
| Browse | New/used, category, price |
| Owned | Insurance, loan, condition |
| Compare | Side-by-side specs |
| Actions | Buy, lease, sell, repair |

## 5.10 Education (`/education`)

**Primary decision:** What to study and when?

| Zone | Content |
|---|---|
| Current | Enrollment, GPA, schedule |
| Paths | School → university → certifications |
| Costs | Tuition, loans, scholarships |
| Outcomes | Projected career doors, network |

## 5.11 Family (`/family`)

**Primary decision:** Invest in relationships or address conflict?

| Zone | Content |
|---|---|
| Tree | Family graph with relationship strength |
| Members | Happiness, age, role, events |
| Actions | Date, marry, children, divorce, gift, will |
| Legacy preview | Inheritance estimate, disputes risk |

## 5.12 Timeline (`/timeline`)

**Primary decision:** Reflect on past; understand consequences.

| Zone | Content |
|---|---|
| River | Chronological events with capital chips |
| Filters | Financial, family, career, world |
| Detail | Event description, linked entities, undo N/A |
| Legacy markers | Achievements, failures, turning points |

**UX:** No editing history—read-only audit trail (World Memory).

## 5.13 News Feed (`/news`)

**Primary decision:** What world events require response?

| Zone | Content |
|---|---|
| Headlines | Personal, local, national, global |
| Categories | Business, politics, culture, sports |
| Impact tags | "Affects your sector", "Mentions you" |
| Actions | Read, share (phone), act (deep link) |

## 5.14 City Map (`/city`)

**Primary decision:** Where to go in the world?

| Zone | Content |
|---|---|
| Canvas | Phaser 2D map |
| Minimap | District overview |
| Pins | Home, work, school, businesses |
| Inspector | Building detail on select |

## 5.15 Smartphone (`/phone`)

**Primary decision:** Access diegetic apps.

| Apps | Maps to |
|---|---|
| Bank | `/banking` |
| Stocks | `/stocks` |
| News | `/news` |
| Messages | Future messaging |
| Social | Future social network |
| Calendar | Events |

**UX:** Phone frame metaphor; app icons consistent with quick actions.

## 5.16 Settings (`/settings`)

**Primary decision:** Configure experience.

| Section | Controls |
|---|---|
| Display | Quality, fullscreen, v-sync |
| Audio | Master, music, effects |
| Gameplay | Difficulty, autosave, tutorial hints |
| Language | Locale, date format, currency display |
| Privacy | Analytics opt-in, cloud save |
| Account | Login, logout, delete data |

---

# 6. Data Display Standards

## 6.1 Numbers

| Type | Format | Example |
|---|---|---|
| Currency | `$1,335,000` | No cents unless < $10 |
| Change | `+12.5%` with colour + icon | Emerald up, red down |
| Large numbers | K/M/B suffix optional in charts | `$1.3M` |
| Dates | Locale-aware | `Monday, July 10, 2026` |
| Age | Integer + "Age" prefix in badge | `Age 32` |

## 6.2 Tables

- Sticky header on scroll
- Sortable columns where meaningful
- Row actions via `...` menu, not 5 inline buttons
- Pagination at 25/50/100 rows

## 6.3 Charts

See Art Direction §9. Always provide accessible data table toggle.

---

# 7. Forms, Decisions & Confirmations

## 7.1 High-Stakes Actions

Require **AlertDialog** with:

1. Consequence summary (financial, social, legacy)
2. Explicit confirm button label ("File Bankruptcy", not "OK")
3. Optional type-to-confirm for irreversible actions

| Action | Confirm Level |
|---|---|
| Transfer money | Single confirm |
| Fire employee | Confirm + reason |
| Divorce | Confirm + asset preview |
| Bankruptcy | Type-to-confirm |
| Sell all holdings | Confirm + tax estimate |

## 7.2 Form Validation

- Inline errors below field
- Summary alert at top on submit failure
- Disable submit until valid
- Preserve entered data on error

---

# 8. Notifications & Activity Feed

## 8.1 Notification Model

| Source | Example | Priority |
|---|---|---|
| Banking Engine | Loan payment due | P1 |
| Company Engine | Cash runway < 30 days | P0 |
| Media Engine | Competitor IPO | P2 |
| Family Engine | Child birthday | P2 |
| Career Engine | Performance review | P1 |

## 8.2 Display Rules

- Bell badge count = unread P0–P2
- Home activity feed = last 10 events
- Deep link to resolving screen
- Mark read on view

---

# 9. Time, Calendar & Simulation Controls

## 9.1 Time Display

Always visible in global header: in-game date + optional time of day.

## 9.2 Time Controls (Future)

| Mode | UX |
|---|---|
| Pause | World frozen; constitution exception with banner |
| Normal | 1 day = configurable real time |
| Fast-forward | Limited bursts; notification batching |
| Skip to event | Calendar anchor only |

**Rule:** Fast-forward must show summary on stop (offline catch-up report).

---

# 10. Smartphone App Shell

The phone is a **navigation metaphor**, not a separate game.

- Frame: rounded rectangle, status bar, home indicator
- Apps return to phone home on back
- Unread badges on app icons mirror notification categories
- Consistent with quick action tiles on Home Screen

---

# 11. Accessibility Requirements

| Requirement | Implementation |
|---|---|
| Keyboard nav | All interactives tabbable; focus visible |
| Screen reader | Landmark regions, headings hierarchy |
| Colour | Never sole indicator of state |
| Motion | `prefers-reduced-motion` |
| Text | 200% zoom support |
| Cognitive | Plain language; jargon glossary link |
| Timing | No time-limited decisions without pause option |

See Product Bible §18 and Art Direction §12.

---

# 12. Responsive & Platform Behaviour

| Breakpoint | Behaviour |
|---|---|
| Mobile | Single column; collapsible metric row |
| Tablet | 2-column grids |
| Desktop | Full 3-column home; 2/3 + 1/3 dashboards |

**Priority platform:** Desktop first (business sim audience), mobile adapted.

---

# 13. Empty, Loading & Error States

| State | Pattern |
|---|---|
| Loading | Skeleton cards matching layout |
| Empty accounts | Illustration + CTA "Open first account" |
| No company | "Start a company" wizard entry |
| Error | Alert with retry + support link |
| Offline | Banner + local save indicator |

---

# 14. UX Review Checklist

| # | Question |
|---|---|
| 1 | What is the **primary decision**? |
| 2 | What are the **three key numbers**? |
| 3 | Does it pass the **CEO Test**? |
| 4 | Is navigation **≤3 taps** from Home? |
| 5 | Is there **one primary CTA** per panel? |
| 6 | Are high-stakes actions **confirmed** with consequences? |
| 7 | Which **Five Capitals** does this screen serve? |
| 8 | Is business logic **out of the UI** (TDD)? |
| 9 | Are **empty/loading/error** states defined? |
| 10 | Does it meet **accessibility** requirements? |

---

*End of UI/UX Guidelines*
