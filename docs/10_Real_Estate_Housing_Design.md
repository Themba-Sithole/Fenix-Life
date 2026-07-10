# Fenix Life — Real Estate & Housing Design

**Document Version:** 1.0  
**Status:** Canonical — Player-Facing Real Estate & Housing Domain Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Systems Designer & Property Systems Design Lead  
**Audience:** Game Design, Engineering, Content, QA, Live Ops, UX  

---

## Document Authority

The Real Estate & Housing Design document defines **how players experience renting, buying, selling, mortgaging, renovating, renting out, flipping, and investing in residential and commercial property**—including neighborhoods, appreciation, landlords, and household formation—from a gameplay and UI perspective. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) (00) | Financial literacy, housing cycles, asset building |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) (01) | Five Capitals, Citizen Equality, Living World |
| [05_Economy_Design.md](./05_Economy_Design.md) | Player-facing macro framing (planned) |
| [18_Economy_Engine.md](./18_Economy_Engine.md) | Housing price index, rent index, rate channel |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) (14) | Housing Engine §4.13 boundaries |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) (04) | `Property`, `PropertyTitle`, `Mortgage`, `Lease` |
| [09_Family_Relationships_Design.md](./09_Family_Relationships_Design.md) | Household formation, marital property |
| [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | `/real-estate` screen zones |
| [35_Content_Pipeline.md](./35_Content_Pipeline.md) | Property archetype schema §8 |

When housing design conflicts with Citizen Equality, **player and AI citizens face identical mortgage underwriting, appreciation physics, and foreclosure rules**—no hidden appreciation boosts or AI-only rent guarantees.

**What this document is:**

- The **complete player-facing real estate gameplay spec**
- Property types, neighborhoods, and transaction flows
- Mortgage, rent, landlord, flip, and commercial investment loops
- Mapping to existing **RealEstate screen prototype** (`src/app/screens/RealEstate.tsx`)
- Acceptance criteria for Housing Engine MVP and portfolio UI wiring

**What this document is not:**

- Banking ledger double-entry (Banking Engine — Document 11 planned)
- Macro cycle formulas (Economy Engine — Document 18 §13)
- City generation spatial pipeline (WGS — Document 15)
- Tax depreciation schedules (Document 13 planned)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Housing Market Overview](#3-housing-market-overview)
4. [Property Types & Attributes](#4-property-types--attributes)
5. [Neighborhoods & Districts](#5-neighborhoods--districts)
6. [Renting as Tenant](#6-renting-as-tenant)
7. [Buying Residential Property](#7-buying-residential-property)
8. [Mortgages & Financing](#8-mortgages--financing)
9. [Owning & Operating — Landlord Mode](#9-owning--operating--landlord-mode)
10. [Property Appreciation & Depreciation](#10-property-appreciation--depreciation)
11. [Renovation & Improvement](#11-renovation--improvement)
12. [Flipping & Short-Term Trading](#12-flipping--short-term-trading)
13. [Commercial Property](#13-commercial-property)
14. [Foreclosure & Distressed Assets](#14-foreclosure--distressed-assets)
15. [Household Formation & Family Integration](#15-household-formation--family-integration)
16. [Property & Company Links](#16-property--company-links)
17. [Player Flows & Decision Points](#17-player-flows--decision-points)
18. [Real Estate Screen (`/real-estate`)](#18-real-estate-screen-real-estate)
19. [Notifications & Diegetic Feedback](#19-notifications--diegetic-feedback)
20. [AI Citizen Housing Parity](#20-ai-citizen-housing-parity)
21. [Events & Timeline Integration](#21-events--timeline-integration)
22. [Content Requirements](#22-content-requirements)
23. [Mod & Regional Expansion Hooks](#23-mod--regional-expansion-hooks)
24. [Balance & Tuning Parameters](#24-balance--tuning-parameters)
25. [Acceptance Criteria](#25-acceptance-criteria)
26. [Appendices](#26-appendices)

---

# 1. Executive Summary

Real estate in Fenix Life is the **primary illiquid wealth vehicle** for Financial and Legacy Capitals—alongside business equity and securities. Housing ties into macro cycles: credit conditions, unemployment, and regional demand drive appreciation, vacancy, and foreclosure stories that emerge from simulation state rather than scripted crashes.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 REAL ESTATE — PLAYER DECISION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MODE                 PLAYER QUESTION              KEY METRICS               │
│  ────                 ───────────────              ───────────               │
│  Tenant               Where can I afford to live?  Rent, commute, rating     │
│  Owner-occupier       Build equity or stay liquid? LTV, payment, appreciation│
│  Landlord             Cash flow vs. management?    Cap rate, vacancy         │
│  Flipper              Buy low, improve, sell?      ARV, hold time, taxes     │
│  Commercial investor  Yield vs. risk?              NOI, tenant credit        │
│                                                                              │
│         ┌──────────────────────────────────────────────────┐                │
│         │            /real-estate Screen                    │                │
│         │  Portfolio │ Browse │ Detail │ Manage │ Sell     │                │
│         └──────────────────────────┬───────────────────────┘                │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         ▼                          ▼                          ▼             │
│    Economy 18 (indices)    Banking (mortgages)      Family (household)      │
│    City districts          Tax (property)           Company (HQ lease)      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Prototype alignment:** The existing UI prototype (`RealEstate.tsx`) demonstrates portfolio summary, property cards (type, location, price, value, rental, rating, owned state), and Buy / Manage / Sell actions. This document specifies **simulation-backed behavior** for those UI elements.

**Core design outcomes:**

| Outcome | Mechanism |
|---|---|
| **Macro-linked housing** | Prices respond to Economy 18 housing index + local demand |
| **Rent vs. buy trade-off** | Player compares monthly rent to PITI + opportunity cost |
| **Landlord gameplay** | Vacancy, maintenance, tenant quality, cap rate |
| **Generational legacy** | Family home as dynasty asset |
| **Cycle teaching** | Rate hikes → affordability crush → foreclosure wave |
| **Commercial depth** | Office, retail, warehouse distinct risk/return |

---

# 2. Philosophy & Constitutional Alignment

## 2.1 Financial & Legacy Capitals

| Capital | Real Estate Contribution |
|---|---|
| **Financial** | Equity, rental income, appreciation |
| **Legacy** | Family home, multi-gen property portfolio |
| **Social** | Neighborhood status, hosting events |
| **Business** | Commercial HQ, retail footprint |

## 2.2 Citizen Equality

| Rule | Player | AI Citizen |
|---|---|---|
| Mortgage approval criteria | Same | Same |
| Appreciation formula | Same | Same |
| Foreclosure process | Same | Same |
| Rent bid competition | Same market | Same |
| Property tax assessment | Same | Same |
| Renovation ROI caps | Same | Same |

**Forbidden:** Player-only instant equity, AI-only rent defaults, free property grants without narrative cost.

## 2.3 Living World Housing

While the player sleeps:

- Housing price indices update monthly (Economy 18)
- Listings turnover; AI buyers/sellers transact
- Rent collected from tenant-occupied units
- Foreclosures complete and hit market as distressed listings
- New development adds supply in growing districts

## 2.4 Emergence Over Script

**Approved:** Player buys at peak leverage; rates rise; negative equity; short sale or foreclosure.

**Rejected:** "Your house value −30%" popup unrelated to macro state.

## 2.5 Product Bible Alignment

| Principle | Implementation |
|---|---|
| Housing cycles teach macro | Rate and unemployment visible in neighborhood stats |
| Real assets vs. cash | Inflation erodes cash; property may hedge |
| Multiple investor archetypes | Owner, landlord, flipper, commercial |
| Starting backgrounds affect access | Orphan rents; wealthy starts may inherit property |

---

# 3. Housing Market Overview

## 3.1 Market Layers

| Layer | Scope | Player Visibility |
|---|---|---|
| **National macro** | Housing price index, policy rate | News, economy dashboard |
| **City** | `CityEconomy.housingIndex` | City map, market report |
| **District** | Local demand, crime, schools | Neighborhood rating |
| **Parcel** | Individual property value | Listing detail |

## 3.2 Property Value Stack

```
propertyValue = baseArchetypeValue
              × districtMultiplier
              × nationalHousingIndex
              × conditionModifier
              × uniqueFeatureModifier
              - deferredMaintenancePenalty
```

## 3.3 Transaction Types

| Type | Description |
|---|---|
| Arm's-length sale | Standard buy/sell |
| Private sale | Off-market; lower fee, fewer comps |
| Auction / foreclosure | Distressed discount; as-is |
| Inheritance transfer | Estate; stepped-up basis analog |
| Company asset sale | Commercial |

## 3.4 Market Participants

| Participant | Role |
|---|---|
| Player | Buy, sell, rent, develop |
| AI citizens | Household formation demand |
| AI investors | Institutional rent-seekers |
| Developers | New supply (Living World) |
| Banks | Mortgage origination, foreclosure |
| Property managers | Optional service (fee) |

---

# 4. Property Types & Attributes

## 4.1 Residential Categories

| Type | Prototype Emoji | Typical Use | Rental Yield |
|---|---|---|---|
| Studio / condo | 🏖️ | Starter, urban | Medium–high |
| Apartment (multi-family unit) | 🏢 | Density living | High |
| Family home | 🏡 | Owner-occ, family | Medium |
| Luxury mansion | 🏛️ | Status, legacy | Low (capital gains focus) |
| Penthouse | 🏢 | Urban luxury | Low–medium |
| Townhouse | 🏘️ | Suburban density | Medium |
| Vacation property | 🏖️ | Seasonal; vacancy risk | Seasonal |

## 4.2 Commercial Categories

| Type | Prototype Emoji | Tenant Type | Risk Profile |
|---|---|---|---|
| Office | 🏬 | Businesses | Cyclical with employment |
| Retail storefront | 🏪 | Shops, restaurants | High churn |
| Warehouse / industrial | 🏭 | Logistics, manufacturing | Stable; location-driven |
| Mixed-use | 🏬 | Retail + residential | Complex |
| Hospitality | 🏨 | Hotel operator | Expansion |

## 4.3 Core Attributes (All Properties)

| Attribute | Player-Visible | Gameplay Effect |
|---|---|---|
| `displayName` / type | Yes | Identity |
| `districtId` | Yes (location name) | Multiplier, demand |
| `bedrooms` / `bathrooms` | Yes | Family fit, rent ceiling |
| `sqft` / `lotSqft` | Yes | Valuation, expansion |
| `condition` | 0–100 | Value, maintenance |
| `energyRating` | A–F | Operating cost |
| `yearBuilt` | Yes | Depreciation, charm premium |
| `locationRating` | 1–5 stars (prototype) | Rent, appreciation |
| `zoning` | Detail view | Conversion eligibility |

## 4.4 Prototype Property Mapping

The UI prototype lists six exemplar listings:

| Prototype Name | Owned | Price | Value | Rental | Location | Rating |
|---|---|---|---|---|---|---|
| Luxury Mansion | Yes | $2.5M | $2.65M | $8,500/mo | Beverly Heights | 5 |
| Downtown Penthouse | Yes | $1.2M | $1.285M | — | Financial District | 5 |
| Family Home | No | $650K | — | $3,200/mo est. | Suburban Area | 4 |
| Commercial Office | No | $1.8M | — | $12,000/mo est. | Tech District | 4 |
| Beachfront Condo | No | $950K | — | — | Oceanview | 5 |
| Warehouse | No | $550K | — | — | Industrial Zone | 3 |

**Canonical behavior:**

- **Owned** properties show purchase price, current value, appreciation, optional rental income
- **Unowned** listings show ask price, estimated rent (if income property), location rating
- **Total portfolio value** aggregates owned current values (prototype: $4.935M header / $3.9M card — reconcile to single authoritative sum in implementation)
- **Monthly rental income** sums active leases (prototype: $8,500 from mansion only)

---

# 5. Neighborhoods & Districts

## 5.1 District Attributes

| Stat | Effect on Player |
|---|---|
| **Location rating** (1–5) | Rent ceiling, appreciation beta |
| School quality | Family happiness; resale premium |
| Crime index | Vacancy, insurance premium |
| Employment access | Commute time; commercial demand |
| Transit score | Rent premium urban |
| Flood/disaster risk | Insurance cost; rare loss events |
| Zoning strictness | Flip subdivision difficulty |

## 5.2 District Archetypes (Examples)

| District | Rating | Character | Prototype Mapping |
|---|---|---|---|
| Beverly Heights | 5 | Ultra-lux residential | Luxury Mansion |
| Financial District | 5 | Urban core, offices | Penthouse, Commercial |
| Suburban Area | 4 | Family suburbs | Family Home |
| Tech District | 4 | Innovation hub | Commercial Office |
| Oceanview | 5 | Coastal premium | Beachfront Condo |
| Industrial Zone | 3 | Logistics | Warehouse |

## 5.3 Gentrification & Decline

District multipliers drift with:

- Employment centers (Company Engine job density)
- Infrastructure (Government spending)
- Crime and media narrative
- Housing supply (new development)

Player may **identify early** via news and city reports—not guaranteed insider tips.

## 5.4 Map Integration

`/city` map pins:

- Home (owner-occupied)
- Rentals (lease address)
- Owned investment properties
- Listings saved to watchlist

---

# 6. Renting as Tenant

## 6.1 When Renting Wins

| Factor | Favors Rent |
|---|---|
| Short expected stay | <2 years |
| High interest rates | PITI >> rent |
| Down payment unavailable | Liquidity constrained |
| Career mobility | Frequent relocation |
| Bear housing market | Prices falling |

## 6.2 Rental Search Flow

```
Browse listings → Filter (price, district, beds)
  → Apply / instant lease (market dependent)
  → Credit & income check
  → Sign lease → Pay deposit + first month
  → Move-in date → Commute recalc
```

## 6.3 Lease Terms

| Term | Typical |
|---|---|
| Duration | 12 months default |
| Monthly rent | Indexed to `rentIndex` at renewal |
| Security deposit | 1–2 months |
| Renewal | Auto or negotiate; rent increase cap (jurisdiction) |
| Early break | Penalty fee |
| Eviction | Non-payment → legal process |

## 6.4 Landlord (NPC) Interactions

| Event | Player Experience |
|---|---|
| Rent increase notice | 30–60 day notice; accept or move |
| Maintenance request | Report issue; response time varies |
| Inspection | Access with notice |
| Sell building | Lease may transfer or terminate |

## 6.5 Rent vs. Buy Calculator (UI)

`/real-estate` detail view shows:

- Monthly rent
- Estimated buy PITI for comparable
- **Break-even horizon** in years
- Opportunity cost of down payment (investment alternative)

---

# 7. Buying Residential Property

## 7.1 Purchase Flow

```
Browse → Detail → Make offer (at ask or bid)
  → Seller response (AI logic or market auto-accept)
  → Inspection optional (reveals hidden issues)
  → Financing selection (cash, mortgage)
  → Closing costs → Title transfer
  → `housing.sale_closed` event
```

## 7.2 Offer Mechanics

| Market Condition | Seller Behavior |
|---|---|
| Hot market | Multiple bids; above ask common |
| Balanced | Ask ± small negotiation |
| Cold | Below ask accepted; longer DOM |

Player may offer **contingencies**: inspection, financing (back out if mortgage denied).

## 7.3 Closing Costs (Player-Facing)

| Fee | Typical % |
|---|---|
| Agent commission | 5–6% (seller pays in US default; affects ask) |
| Title & escrow | 0.5–1% |
| Transfer tax | Jurisdiction |
| Points (if bought down) | Optional |

## 7.4 Ownership Benefits

| Benefit | Gameplay |
|---|---|
| Equity buildup | Mortgage principal paydown |
| Appreciation | Value drift with index |
| Stability | No rent hikes (except tax/insurance) |
| Customization | Renovation |
| Legacy | Pass to heirs |
| Hosting | Family events scale with property tier |

## 7.5 Ownership Costs

| Cost | Frequency |
|---|---|
| Mortgage P&I | Monthly |
| Property tax | Monthly accrual / annual bill |
| Insurance | Monthly |
| HOA (if condo) | Monthly |
| Maintenance | Stochastic + scheduled |
| Utilities | If owner-occupied |

---

# 8. Mortgages & Financing

## 8.1 Mortgage Products

| Product | Term | Rate Type | Typical Use |
|---|---|---|---|
| Fixed 30-year | 360 mo | Fixed | Owner-occupied |
| Fixed 15-year | 180 mo | Fixed | Faster equity |
| ARM 5/1 | 360 mo | Variable after 5y | Rate bet |
| Interest-only | 10y then amortize | Fixed/ARM | Investor (risky) |
| Commercial | 10–25y | Fixed/ARM | Commercial |
| HELOC | Revolving | Variable | Post-purchase extract equity |

## 8.2 Underwriting (Player-Facing)

| Criterion | Typical Gate |
|---|---|
| Credit score | ≥ 620 conventional; tiers affect rate |
| DTI | ≤ 43% all debt / income |
| LTV | ≤ 80% without PMI; 97% max FHA analog |
| Down payment | 3–20%+ |
| Employment history | 2 years stable |
| Reserves | 2–6 months PITI |

**Symmetry:** AI applicants use identical thresholds.

## 8.3 Key Formulas (Display)

```
monthlyPayment = amortize(principal, annualRate, termMonths)
LTV = loanBalance / propertyValue
equity = propertyValue - loanBalance
PMI = required if LTV > 80% until LTV ≤ 78%
```

## 8.4 Refinance Flow

When `economy.rate_changed` favors player:

- Break-even on closing costs vs. payment savings
- Cash-out refinance: extract equity; increases LTV risk

## 8.5 Default & Foreclosure (Player Experience)

```
Missed payments (3+) → Notice of default
  → Cure period OR foreclosure auction
  → Credit score collapse
  → Property lost; deficiency judgment possible
  → Timeline + news if high profile
```

---

# 9. Owning & Operating — Landlord Mode

## 9.1 Becoming a Landlord

| Path | Description |
|---|---|
| Buy income property | Explicit rental intent at purchase |
| Move out | Convert owner-occ to rental |
| Inherit | Receive tenant-occupied building |
| Develop | New construction for rent |

## 9.2 Landlord Dashboard (Manage Action)

Prototype **Manage** button opens:

| Panel | Metrics |
|---|---|
| **Occupancy** | Vacant / leased / partial |
| **Rent roll** | Monthly income per unit |
| **Expenses** | Tax, insurance, maintenance, mgmt fee |
| **NOI** | Net operating income |
| **Cap rate** | NOI / property value |
| **Cash flow** | NOI − mortgage payment |
| **Tenant** | Credit rating, lease end, happiness |

## 9.3 Tenant Placement

```
Vacancy → List unit → Showings (time cost optional)
  → Applicant pool → Select tenant
  → Lease signed → Rent begins next month
```

Tenant quality affects:

- Payment default probability
- Property damage risk
- Turnover frequency

## 9.4 Rent Setting

| Strategy | Effect |
|---|---|
| Below market | Fast lease; lower yield |
| At market | Standard |
| Above market | Longer vacancy; premium if fills |

Market rent from:

```
marketRent = baseRentArchetype × districtMultiplier × rentIndex × conditionModifier
```

## 9.5 Property Management Outsource

| Option | Fee | Effect |
|---|---|---|
| Self-manage | Time events | Higher stress; save 8–10% fee |
| Hire manager | 8–10% rent | Reduced vacancy events; cost |

---

# 10. Property Appreciation & Depreciation

## 10.1 Appreciation Drivers

Per Economy 18 §13:

```
Δvalue ∝ incomeGrowth, policyRateΔ, regionalDemand, cyclePhase, condition
```

| Factor | Direction |
|---|---|
| Housing boom | ↑ |
| Rate hike | ↓ (affordability) |
| District employment ↑ | ↑ |
| Deferred maintenance | ↓ |
| Disaster | ↓↓ (insurance claim) |

## 10.2 Depreciation (Tax-Relevant)

| Component | Schedule |
|---|---|
| Building structure | 27.5 yr residential (US analog) |
| Commercial | 39 yr |
| Land | Non-depreciable |

Player sees **tax benefit preview** in commercial and rental contexts (Doc 13).

## 10.3 Prototype Appreciation Display

Owned Luxury Mansion:

- Purchase: $2.5M → Value: $2.65M → **+$150K (+6%)**
- Portfolio card: **Total Appreciation +$185K** (sum owned properties)

Implementation must compute from `PropertyValueHistory`, not static mock.

---

# 11. Renovation & Improvement

## 11.1 Renovation Types

| Project | Cost Range | Value Add | Time |
|---|---|---|---|
| Cosmetic (paint, floor) | Low | Moderate | Weeks |
| Kitchen/bath remodel | Medium | High | Months |
| Addition (sqft) | High | High if permitted | Months |
| Energy upgrade | Medium | Operating save + modest value | Weeks |
| Commercial TI | Tenant-specific | Lease premium | Negotiated |

## 11.2 Renovation Flow

```
Manage → Renovate → Select scope → Contractor quote
  → Approve budget → Construction period (cannot sell mid-project optional)
  → Completion → condition ↑ → value reappraisal
```

## 11.3 Over-Improvement Risk

Renovation ROI capped by **neighborhood ceiling**—luxury kitchen in Industrial Zone warehouse ≠ proportional value add.

## 11.4 DIY Option

Player time + skill (Technical trait) reduces cost; failure risk increases delays.

---

# 12. Flipping & Short-Term Trading

## 12.1 Flip Eligibility

| Requirement | Reason |
|---|---|
| Hold period | Short-term capital gains tax higher |
| Purchase discount | Margin source |
| Renovation plan | Value creation |
| Market timing | Exit into strength |

## 12.2 Flip Loop

```
Acquire distressed / undervalued → Renovate → Stage (optional)
  → List → Sell → Realize gain − costs − taxes
```

## 12.3 Flip Risks

| Risk | Consequence |
|---|---|
| Cost overrun | Wipe margin |
| Market turns during hold | Sell at loss |
| Permit delay | Carrying costs ↑ |
| Hidden defect | Inspection miss |

## 12.4 Achievement Hooks

- "First Flip" — profitable sale within 18 months
- "House Flipper" — 10 cumulative flips

---

# 13. Commercial Property

## 13.1 Commercial vs. Residential (Player Comparison)

| Aspect | Residential | Commercial |
|---|---|---|
| Valuation | Comps + income | NOI / cap rate primary |
| Lease length | 1 year typical | 3–10+ years |
| Tenant | Individual/family | Business entity |
| Management complexity | Lower | Higher (CAM, TI) |
| Cyclicality | Moderate | Tied to business cycle |
| Financing | Residential products | Commercial terms; higher down |

## 13.2 Commercial Metrics (Player UI)

```
NOI = grossRent - operatingExpenses (ex debt service)
capRate = NOI / purchasePrice
cashOnCash = (NOI - debtService) / equityInvested
```

Prototype Commercial Office: $1.8M ask, $12K/mo rent → gross cap ≈ 8% before expenses.

## 13.3 Tenant Credit

Commercial tenants link to **Company Engine**:

- Startup tenant: higher default risk; higher rent potential
- Anchor tenant: stable; lower cap rate acceptable

## 13.4 Vacancy & TI

New commercial lease may require **tenant improvement allowance**—upfront cost amortized via rent premium.

## 13.5 Owner-Occupied Commercial

Player business HQ:

- Rent paid to self (accounting transfer)
- Build equity vs. lease externally

---

# 14. Foreclosure & Distressed Assets

## 14.1 Acquisition Channels

| Channel | Discount | Risk |
|---|---|---|
| Foreclosure auction | 15–40% | As-is, no inspection |
| Short sale | 10–25% | Bank approval delay |
| REO listing | 5–15% | Cleaner title |
| Tax lien (expansion) | Variable | Legal complexity |

## 14.2 Distressed Property Attributes

- `condition` often low
- May be occupied (eviction process)
- Title issues rare but possible event

## 14.3 Ethical Gameplay Framing

Foreclosure is **systemic consequence** of macro + personal default—not predatory mini-game reward. News may cover displacement (Media Engine).

---

# 15. Household Formation & Family Integration

## 15.1 Primary Residence Selection

| Factor | Family Link |
|---|---|
| Bedrooms | Children count |
| School district | Child education quality |
| Space | Family event hosting |
| Location | Partner commute balance |

## 15.2 Marriage & Property (Doc 09)

| Event | Property Effect |
|---|---|
| Marriage | Choose regime; combine households |
| Divorce | Sell, buyout, or defer |
| Death | Step-up basis analog; inheritance |
| Cohabitation | Lease or joint purchase |

## 15.3 Multi-Generational Housing

Optional expansion: in-law suite; dynasty home passed with partial rent to family trust.

---

# 16. Property & Company Links

## 16.1 Business Property

| Use | Example |
|---|---|
| HQ office | Player company |
| Retail location | Restaurant chain |
| Warehouse | Logistics company |
| Rental to own company | Related-party lease (arm's length rules) |

## 16.2 Related-Party Lease

Tax authority may scrutinize below-market rent between player entities—teaches transfer pricing basics.

## 16.3 Company-Owned Real Estate

Company balance sheet holds property; player as shareholder benefits via equity value.

---

# 17. Player Flows & Decision Points

## 17.1 Flow: First Home Purchase

| Step | Screen | Decision |
|---|---|---|
| 1 | `/real-estate` Browse | Filter district, price |
| 2 | Detail | Inspect; run rent vs buy |
| 3 | Offer | Price, contingencies |
| 4 | Mortgage app | Down payment, term |
| 5 | Close | Pay closing costs |
| 6 | Move-in | Set as primary residence |
| 7 | Timeline | "Purchased {address}" |

## 17.2 Flow: Become Landlord

| Step | Action |
|---|---|
| 1 | Purchase or convert property |
| 2 | Manage → List for rent |
| 3 | Select tenant |
| 4 | Monthly: collect rent auto; handle events |
| 5 | Annual: tax summary; insurance renewal |

## 17.3 Flow: Sell Property

Prototype **Sell** button:

```
Manage/Sell → Listing price (market suggest)
  → Agent or FSBO (fee trade-off)
  → Pay off mortgage from proceeds
  → Capital gains tax estimate
  → Confirm → Title transfer
```

## 17.4 Flow: Commercial Acquisition

| Step | Action |
|---|---|
| 1 | Filter commercial |
| 2 | Review tenant roster + NOI |
| 3 | Commercial financing (higher down) |
| 4 | Close → Manage lease renewals |

---

# 18. Real Estate Screen (`/real-estate`)

## 18.1 Primary Decision

**Acquire, improve, or divest property?**

## 18.2 Layout (Canonical — extends prototype)

### Hero Header

| Element | Prototype | Spec |
|---|---|---|
| Back navigation | ✅ | To `/home` |
| Title | "Real Estate Portfolio" | Localized |
| Subtitle | "Property Management" | — |
| Total property value | $4,935,000 | Sum of owned `currentValue` |

### Portfolio Summary Card

| Metric | Prototype | Spec |
|---|---|---|
| Total value | $3.9M | Should match header (implementation fix) |
| Properties owned | 2 | Count of `owned === true` |
| Monthly rental income | $8,500 | Sum active lease payments |
| Total appreciation | +$185K | Σ(value − purchasePrice) owned |

### Property Grid Cards

| Field | Spec |
|---|---|
| Emoji / icon | Content asset per archetype |
| Owned badge | Teal ring + badge |
| Type name | `displayName` |
| Location | District name + map pin link |
| Purchase price / ask | Contextual label |
| Current value | If owned + appraised |
| Monthly rental | If leased |
| Location rating | 1–5 dot display |
| Actions | Manage + Sell OR Purchase |

## 18.3 Browse vs. Portfolio Tabs (Enhancement)

| Tab | Content |
|---|---|
| **Portfolio** | Owned properties (current prototype focus) |
| **Browse** | Market listings with filters (UI 34 §5.8) |
| **Watchlist** | Saved listings |
| **Analytics** | Portfolio cap rate, equity, LTV aggregate |

## 18.4 Detail View (On Card Click)

| Section | Content |
|---|---|
| Gallery | Exterior/interior assets |
| Specs | Beds, baths, sqft, year |
| Financials | Price, mortgage, equity, cash flow |
| Neighborhood | School, crime, employment, 5yr appreciation chart |
| History | Ownership chain if available |
| Actions | Buy / offer / manage / sell / renovate |

## 18.5 Filters (Browse — per UI 34)

| Filter | Options |
|---|---|
| Type | Residential, commercial, land |
| Price range | Slider |
| District | Multi-select |
| Cap rate min | Investor filter |
| Beds / baths | Residential |
| Owned only | Portfolio toggle |

## 18.6 Empty States

| State | Message |
|---|---|
| No properties owned | "Build wealth through real estate." → Browse |
| No listings in filter | Widen filters |
| Insufficient credit | "Improve credit score or increase down payment." |

## 18.7 Visual Design Tokens (from prototype)

| Token | Usage |
|---|---|
| `#2EC4B6` | Primary accent, owned ring, positive values |
| `#1C2541` / `#0B132B` | Dark gradient cards |
| `#F4B400` | Rental income, rating dots |
| Hero image | Luxury real estate photography |

---

# 19. Notifications & Diegetic Feedback

| Event | Channel |
|---|---|
| Rent deposited | Banking + banner |
| Rent missed (tenant) | Manage alert |
| Mortgage payment due | Banking |
| Rate reset (ARM) | Email + `/real-estate` |
| Property tax bill | Annual notice |
| Insurance claim | After disaster event |
| Offer accepted/rejected | Phone P1 |
| Foreclosure warning | Phone P0 |
| Value milestone | "+$100K equity" optional celebrate |

---

# 20. AI Citizen Housing Parity

## 20.1 AI Housing Demand

Household formation on:

- Marriage, childbirth (Family 09)
- Income growth
- Remote work trends (macro)

## 20.2 AI Landlords

NPC landlords respond to market:

- Raise rent at renewal
- Sell in boom
- Default in bust → supply shock

## 20.3 Competition for Listings

Hot listings may receive **multiple offers**—player must bid competitively.

---

# 21. Events & Timeline Integration

| Event | Player Impact |
|---|---|
| `housing.property_listed` | New browse entry |
| `housing.sale_closed` | Title change; timeline |
| `housing.rent_due` | Cash flow |
| `housing.foreclosure_completed` | Distressed supply |
| `housing.development_completed` | District supply ↑ |
| `housing.price_index_updated` | Values reappraised monthly |
| `economy.rate_changed` | Mortgage rates adjust |

Timeline chips: **Financial** for purchases; **Legacy** for family home transfer.

---

# 22. Content Requirements

## 22.1 Launch Targets (Backlog 38)

| Content | Minimum |
|---|---|
| Property archetypes | 80 |
| Districts per city | 8–12 |
| Residential variants | 50 |
| Commercial variants | 20 |
| Industrial / special | 10 |

## 22.2 Archetype Schema

Per [35_Content_Pipeline.md](./35_Content_Pipeline.md) §8:

- `baseValue`, `appreciationProfile`, `maintenancePerYear`, `rentalYield`
- `bedrooms`, `sqft`, assets
- `typicalDownPayment`, `maxLTV`

## 22.3 Appreciation Profiles

| Profile | Behavior |
|---|---|
| `urban_core` | High beta, cycle-sensitive |
| `suburban_standard` | Moderate steady |
| `luxury_scarce` | Low yield, high appreciation in booms |
| `industrial_stable` | Income-focused |
| `coastal_premium` | Disaster risk modifier |

---

# 23. Mod & Regional Expansion Hooks

| Surface | Mod Path |
|---|---|
| Property archetypes | `housing/properties/*` |
| District definitions | `world/districts/*` |
| Mortgage rules | `regulations/mortgage/*` |
| Tenancy law | `regulations/lease/*` |

EU expansion example: longer tenant protections; lower default frequency; different fee structures.

---

# 24. Balance & Tuning Parameters

| Parameter | Default |
|---|---|
| `maxLTVConventional` | 0.80 |
| `maxDTI` | 0.43 |
| `foreclosureMissedPayments` | 3 |
| `rentIndexLag` | 0.7 (Economy 18) |
| `maintenancePctOfValue` | 1% / year |
| `vacancyBaseRate` | 5% |
| `flipShortTermTaxPremium` | +10% vs long-term |
| `locationRatingRentMultiplier` | 0.8–1.3 per star |

## 24.1 Anti-Patterns (Rejected)

| Pattern | Why |
|---|---|
| Guaranteed appreciation | Breaks macro teaching |
| Free housing for player | Breaks economy |
| Instant sell at ask | No liquidity realism |
| Rent with zero vacancy ever | Landlord mode trivialized |

---

# 25. Acceptance Criteria

## 25.1 Browse & Purchase

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-001 | Player can browse ≥20 listings in default city | UI test |
| RE-AC-002 | Purchase flow debits down payment + closing costs via Banking | Integration |
| RE-AC-003 | Title transfers to player; `PropertyTitle` updated | DB |
| RE-AC-004 | AI buyer can purchase same listing under same rules | Symmetry |
| RE-AC-005 | Owned property shows on portfolio with ring/badge | Visual QA |

## 25.2 Mortgages

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-010 | Mortgage denied when DTI exceeds threshold | Unit |
| RE-AC-011 | Monthly payment matches amortization formula | Golden |
| RE-AC-012 | ARM resets on schedule when rates change | Time tick |
| RE-AC-013 | Equity = value − balance displayed on Manage | UI |
| RE-AC-014 | Default triggers foreclosure pipeline identical for AI | Symmetry |

## 25.3 Rental & Landlord

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-020 | Player can list vacant unit and sign lease | E2E |
| RE-AC-021 | Monthly rent deposits to Banking on schedule | Integration |
| RE-AC-022 | Vacancy events occur per tunable rate | Simulation |
| RE-AC-023 | Cap rate and cash flow shown on Manage panel | UI |
| RE-AC-024 | Tenant default may trigger eviction flow | Integration |

## 25.4 Valuation & Macro

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-030 | Property value updates when housing index changes | Economy cross-test |
| RE-AC-031 | District multiplier affects value vs. same archetype elsewhere | Unit |
| RE-AC-032 | Appreciation sum matches individual property gains | UI math |
| RE-AC-033 | Condition affects value and rent | Unit |

## 25.5 Sell & Flip

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-040 | Sell pays off mortgage; remainder to player | Integration |
| RE-AC-041 | Capital gains tax hook fires on profitable sale | Tax stub |
| RE-AC-042 | Renovation increases condition and reappraised value | E2E |
| RE-AC-043 | Over-improvement caps ROI in low-tier district | Simulation |

## 25.6 Commercial

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-050 | Commercial listing shows NOI and cap rate | UI |
| RE-AC-051 | Tenant linked to company entity when applicable | Integration |
| RE-AC-052 | Commercial loan requires higher down payment | Unit |

## 25.7 UI / Prototype Parity

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-060 | Hero shows total portfolio value | Visual QA |
| RE-AC-061 | Summary card shows owned count, rental income, appreciation | Visual QA |
| RE-AC-062 | Property cards show type, location, price, value, rental, rating | Visual QA |
| RE-AC-063 | Owned cards expose Manage and Sell; unowned expose Purchase | E2E |
| RE-AC-064 | Location rating renders as 5-dot indicator | Visual QA |

## 25.8 Integration

| ID | Criterion | Verification |
|---|---|---|
| RE-AC-070 | Marriage moves household primary residence (Doc 09) | Cross-doc |
| RE-AC-071 | Foreclosure consumes Banking event | Integration |
| RE-AC-072 | City map pin for owned home | Map test |
| RE-AC-073 | Inheritance transfers property per Family 09 | Cross-doc |

---

# 26. Appendices

## Appendix A — Sample PITI Breakdown (Family Home $650K)

| Component | Monthly (illustrative) |
|---|---|
| Principal & interest (20% down, 6.5%) | $3,290 |
| Property tax | $520 |
| Insurance | $180 |
| PMI | $0 (LTV ≤80%) |
| **Total PITI** | **$3,990** |
| Comparable rent | $3,200 |
| **Rent vs buy** | Buy premium $790/mo unless appreciation/tax benefit |

## Appendix B — Cap Rate Quick Reference

| Cap Rate | Interpretation |
|---|---|
| <4% | Luxury / appreciation play |
| 4–6% | Stable residential |
| 6–8% | Commercial / value-add |
| >8% | Higher risk or distressed |

## Appendix C — Prototype → Simulation Field Map

| Prototype Field | Simulation Source |
|---|---|
| `owned` | `PropertyTitle.ownerId === playerCitizenId` |
| `price` | Last sale price or `listing.askPrice` |
| `value` | Latest `PropertyValueHistory.appraisal` |
| `rental` | Active `Lease.monthlyRent` |
| `location` | `District.displayName` |
| `rating` | `District.locationRating` |

## Appendix D — Cross-Reference Index

| Topic | Doc |
|---|---|
| Housing index math | 18 Economy §13 |
| Property entities | 04 Database §Property |
| UI zones | 34 §5.8 |
| Content schema | 35 §8 |
| Engine spec | FSF §4.13 |
| Household | 09 Family §14 |

---

*End of Document 10 — Real Estate & Housing Design v1.0*
