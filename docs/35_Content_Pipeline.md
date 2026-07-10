# Fenix Life — Official Content Pipeline

**Document Version:** 1.0  
**Status:** Canonical — Content Production Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Lead Content Designer & Live Ops Director  
**Audience:** Design, Engineering, Art, Audio, Economy, QA, Modding  

---

## Document Authority

This Content Pipeline document defines **how new content enters Fenix Life**—businesses, cities, vehicles, properties, universities, industries, events, and data packs—while preserving simulation integrity, Citizen Equality, and Living World coherence. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Emergence, economy, expansion philosophy |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, symmetry, world memory |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | Engine contracts, Rule Registry, events |
| [Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | Procedural placement, synthetic history |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | Schema, content tables, migrations |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Mod support, data packs, validation |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Content Philosophy](#2-content-philosophy)
3. [Pipeline Overview](#3-pipeline-overview)
4. [Content Types & Ownership](#4-content-types--ownership)
5. [Adding Businesses & Industries](#5-adding-businesses--industries)
6. [Adding Cities & Regions](#6-adding-cities--regions)
7. [Adding Vehicles](#7-adding-vehicles)
8. [Adding Houses & Properties](#8-adding-houses--properties)
9. [Adding Universities & Education Content](#9-adding-universities--education-content)
10. [Data Schema & Validation](#10-data-schema--validation)
11. [Balancing & Economy Integration](#11-balancing--economy-integration)
12. [Art & Audio Integration](#12-art--audio-integration)
13. [QA & Ship Gates](#13-qa--ship-gates)
14. [Mod & DLC Content Path](#14-mod--dlc-content-path)
15. [Governance & Versioning](#15-governance--versioning)

---

# 1. Executive Summary

Fenix Life content is **data-first simulation fuel**, not decorative catalog entries. Every business template, vehicle spec, property listing, and university program must:

1. Connect to **FSF engines** via Rule Registry entries
2. Respect **Citizen Equality** (AI can use the same content)
3. Enter through a **validated pipeline** with economy review
4. Leave **World Memory** traces when used in play

**Pipeline north star:**

> *Content is rules + assets + balance envelope—not lore PDFs.*

---

# 2. Content Philosophy

## 2.1 Systemic Content vs Cosmetic Content

| Systemic (Required) | Cosmetic (Optional) |
|---|---|
| Industry profit models | Building skin variants |
| Job role definitions | Vehicle colour options |
| Degree → career mappings | Portrait accessories |
| Loan eligibility rules | News flavor headlines |
| AI hiring templates | UI themes |

Cosmetic content **cannot** alter simulation formulas without economy sign-off.

## 2.2 Content Density Targets (Launch)

| Category | MVP Target | Year 1 Target |
|---|---|---|
| Industries / business templates | 24 | 60 |
| Vehicle models | 40 | 120 |
| Property archetypes | 30 | 80 |
| Universities / programs | 12 | 40 |
| Cities ( playable ) | 3 | 8 |
| Career tracks | 20 | 50 |

## 2.3 Five Capitals Content Tag

Every content item declares capital impact:

```yaml
capitals:
  primary: business
  secondary: [financial]
  weakens: []  # optional
```

---

# 3. Pipeline Overview

## 3.1 Seven-Stage Pipeline

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ 1.Brief │──►│ 2.Design│──►│ 3.Data  │──►│ 4.Engine│──►│ 5.Assets│──►│ 6.QA    │──►│ 7.Ship  │
│         │   │ Review  │   │ Author  │   │ Wire    │   │ Integrate│   │ Validate│   │ Release │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

| Stage | Owner | Output |
|---|---|---|
| 1. Brief | Product / Live Ops | Content brief with capital mapping |
| 2. Design Review | Systems Design + Economy | Approved spec |
| 3. Data Author | Content Designer | YAML/JSON in `/content/` |
| 4. Engine Wire | Engineering | Engine hooks + events |
| 5. Asset Integrate | Art / Audio | Sprites, audio, UI icons |
| 6. QA Validate | QA + Economy | Test report, balance sign-off |
| 7. Ship | Live Ops | Manifest version bump, patch notes |

## 3.2 Branching Strategy

- Content lives on `content/*` branches
- Merged to `main` only after Stage 6 pass
- Hotfix content patches use semver data pack version

---

# 4. Content Types & Ownership

| Content Type | Rule Registry | Primary Engine | Schema Domain |
|---|---|---|---|
| Business template | ✓ | Company Engine | `IndustryTemplate` |
| Company starter | ✓ | Company Engine | `BusinessArchetype` |
| City / region | ✓ | WGS + Economy | `RegionDefinition` |
| Vehicle model | ✓ | Transportation Engine | `VehicleTemplate` |
| Property archetype | ✓ | Housing Engine | `PropertyTemplate` |
| University | ✓ | Education Engine | `InstitutionTemplate` |
| Degree / course | ✓ | Education Engine | `ProgramTemplate` |
| Career role | ✓ | Career Engine | `OccupationTemplate` |
| Event pack | ✓ | Event Engine | `EventTemplate` |
| News template | ✓ | Media Engine | `HeadlineTemplate` |

---

# 5. Adding Businesses & Industries

## 5.1 When to Add vs Procedurally Generate

| Scenario | Approach |
|---|---|
| Generic coffee shop | Procedural from `IndustryTemplate` |
| Iconic branded chain (fictional) | Hand-authored `BusinessArchetype` |
| New industry (e.g., AI consulting) | New `IndustryTemplate` + economy review |

## 5.2 Industry Template Schema (Minimal)

```yaml
id: industry.saas_b2b
version: 1
displayName: "B2B SaaS"
category: technology
capitals:
  primary: business
  secondary: [financial, human]

economics:
  marginProfile: high_growth_low_initial
  capexIntensity: low
  laborMix:
    engineering: 0.45
    sales: 0.25
    marketing: 0.15
    operations: 0.15
  revenueDrivers: [subscriptions, upsell, churn_inverse]
  cyclicality: 0.3

operations:
  minEmployees: 3
  optimalEmployeesPerMillionRevenue: 8
  productTypes: [software_subscription]

aiFounderAffinity:
  traits: [ambition, openness, conscientiousness]
  minHumanCapital: { technical: 40 }

events:
  - ref: event.pivot_opportunity
  - ref: event.security_breach_risk

assets:
  icon: ui_icon_industry_saas.svg
  mapBuilding: world_building_office_saas_01.webp
```

## 5.3 Authoring Checklist — Business

| Step | Action |
|---|---|
| 1 | Define industry economics in spreadsheet simulator |
| 2 | Map jobs to Career Engine occupations |
| 3 | Set AI founder/spawn weights for WGS |
| 4 | Author 3+ emergent events (not scripted quests) |
| 5 | Validate AI companies can found/compete using same template |
| 6 | Add Media Engine headline templates |
| 7 | Run 100-year Monte Carlo economy test |

## 5.4 Company Dashboard Integration

New industries must expose KPIs compatible with `CompanyDashboard`:

- Revenue, profit, employees, products (minimum)
- Optional: churn, MRR, inventory turns per industry

---

# 6. Adding Cities & Regions

## 6.1 City Content Layers

| Layer | WGS Phase | Content |
|---|---|---|
| Macro | Phase 2 | Economy envelope, tax regime, culture |
| Geography | Phase 3 | Map size, districts, climate |
| Infrastructure | Phase 4 | Roads, utilities, institutions |
| Society | Phase 6 | Population, companies, history |

## 6.2 Region Definition Schema

```yaml
id: region.metro_avencia
version: 1
displayName: "Avencia Metro"
country: country.federation_01
climate: temperate_oceanic
populationTarget: 850000

districts:
  - id: district.financial_core
    zoning: commercial_high
    landCostMultiplier: 2.1
  - id: district.northgate_residential
    zoning: residential_medium
    landCostMultiplier: 1.0

economy:
  dominantIndustries: [finance, technology, logistics]
  unemploymentBaseline: 0.045
  startupDensity: high

culture:
  riskTolerance: 0.65
  educationPremium: 0.8
  familyOrientation: 0.5

map:
  tileset: city_avencia_01
  spawnPoints: [district.northgate_residential]
```

## 6.3 City Authoring Workflow

1. **Macro brief** — role in world (finance hub, industrial, college town)
2. **Balance envelope** — compare to existing cities (no single "best" city)
3. **Map art** — tileset + building palette per Art Direction
4. **Institution placement** — banks, universities, hospitals (WGS Phase 4)
5. **Synthetic history** — 20–50 years compressed events (WGS Phase 5)
6. **QA playtest** — 3 backgrounds × 30 in-game years

## 6.4 CityMap Integration

Phaser scene loads region map asset bundle; pins link to businesses and properties.

---

# 7. Adding Vehicles

## 7.1 Vehicle Template Schema

```yaml
id: vehicle.sedan_aurora_2024
version: 1
displayName: "Aurora Sedan 2024"
category: sedan
tier: mid

economics:
  msrp: 32000
  depreciationCurve: standard_auto
  maintenanceCostPerYear: 1200
  fuelEfficiency: 32_mpg
  insuranceClass: 2

stats:
  reliability: 0.85
  prestige: 0.4
  performance: 0.5

requirements:
  minCreditScore: 620
  minIncome: 45000

assets:
  sprite: vehicle_sedan_aurora_01.webp
  icon: ui_icon_vehicle_sedan.svg
  audio:
    engineStart: sfx_vehicle_engine_sedan_start.ogg
```

## 7.2 Pipeline Steps — Vehicle

| Step | Owner |
|---|---|
| Economy tier assignment | Chief Economist |
| Transportation Engine stats | Systems Design |
| Dealership UI entry | UX + Engineering |
| Art sprite + icon | Art |
| Audio | Audio |
| AI purchase weights | AI Design |

## 7.3 Vehicle Dealership Screen

`/vehicles` filters by category, price, financing; compares selected models.

---

# 8. Adding Houses & Properties

## 8.1 Property Archetype Schema

```yaml
id: property.suburban_house_3br
version: 1
displayName: "Suburban 3-Bedroom"
category: residential
subcategory: single_family

economics:
  baseValue: 285000
  appreciationProfile: suburban_standard
  propertyTaxRate: regional
  maintenancePerYear: 3500
  rentalYield: 0.048

attributes:
  bedrooms: 3
  bathrooms: 2
  sqft: 1650
  lotSqft: 7200
  energyRating: B

mortgage:
  typicalDownPayment: 0.20
  maxLTV: 0.80

assets:
  exterior: property_suburban_3br_exterior.webp
  interior: property_suburban_3br_interior.webp
  mapIcon: ui_icon_property_house.svg
```

## 8.2 Housing Engine Integration

Properties spawn in WGS with ownership history; Housing Engine handles:

- Appreciation/depreciation
- Rental income
- Foreclosure linkage to Banking Engine
- Renovation modifiers

## 8.3 Real Estate Screen

`/real-estate` lists browse + owned; detail view shows cap rate, mortgage, neighborhood.

---

# 9. Adding Universities & Education Content

## 9.1 Institution Template Schema

```yaml
id: institution.university_avencia_tech
version: 1
displayName: "Avencia Institute of Technology"
type: university
prestige: 0.82
selectivity: 0.35

programs:
  - ref: program.cs_bachelor
  - ref: program.mba
  - ref: program.mechanical_engineering_bachelor

economics:
  tuitionPerYear: 42000
  financialAidRate: 0.40
  endowment: 1200000000

outputs:
  graduateEmployability: 0.88
  networkStrength: 0.75
  researchOutput: 0.70

assets:
  campusMap: world_building_university_ait_01.webp
  logo: ui_logo_university_ait.svg
```

## 9.2 Program Template Schema

```yaml
id: program.cs_bachelor
version: 1
displayName: "Bachelor of Computer Science"
durationYears: 4
costMultiplier: 1.0

humanCapital:
  skills:
    technical: +35
    creativity: +10
  credentials:
    degree: bachelor_cs

careerDoors:
  occupations: [occupation.software_engineer, occupation.product_manager]
  minGPA: 2.5

capitals:
  primary: human
  secondary: [financial, social]
```

## 9.3 Education Screen Integration

`/education` shows enrollment path, GPA, schedule, costs, projected outcomes.

## 9.4 Pipeline Steps — Education

1. Map program → occupations (Career Engine)
2. Set AI enrollment weights by personality (CDPS)
3. WGS places institutions in cities
4. Media templates for rankings, scandals, breakthroughs
5. Validate degree prestige decay over decades

---

# 10. Data Schema & Validation

## 10.1 Content Package Structure

```
/content/
├── manifest.json          # version, dependencies, checksums
├── industries/
├── businesses/
├── regions/
├── vehicles/
├── properties/
├── institutions/
├── programs/
├── occupations/
├── events/
└── localization/
    └── en-US/
```

## 10.2 manifest.json

```json
{
  "packId": "fenix-core-content",
  "version": "1.2.0",
  "minGameVersion": "0.9.0",
  "engines": ["company", "housing", "education", "transportation"],
  "checksum": "sha256:..."
}
```

## 10.3 Validation Pipeline (CI)

| Check | Tool |
|---|---|
| JSON Schema | `ajv` against `/schemas/content/` |
| Reference integrity | All `ref:` resolve |
| Economy bounds | Custom linter (margins, prices within envelope) |
| Duplicate IDs | CI grep |
| Localization keys | i18n completeness |
| Asset existence | Manifest vs `/public/assets/` |

## 10.4 Database Migration

Static templates → PostgreSQL seed tables per DDD §2; runtime instances reference template IDs.

---

# 11. Balancing & Economy Integration

## 11.1 Economy Review Board

Required sign-offs for systemic content:

- Chief Economist
- Lead Systems Designer
- Live Ops (if tunable post-ship)

## 11.2 Simulation Tests

| Test | Pass Criteria |
|---|---|
| 100-year world sim | No single industry > 40% GDP |
| AI vs player symmetry | Same template outcomes within variance |
| New vehicle tier | Does not obsolete all prior tiers instantly |
| New city | Migration flows balanced |
| University prestige | Graduate income premium within envelope |

## 11.3 Live Tuning

Post-ship numeric tuning via **Rule Registry hotfix**, not schema breaking changes.

---

# 12. Art & Audio Integration

| Content | Art Deliverable | Audio Deliverable |
|---|---|---|
| Business | Industry icon, map building | Office ambient one-shot |
| City | Tileset, district tints | District ambient bed |
| Vehicle | Sprite, dealership thumbnail | Engine start, door |
| Property | Exterior/interior | Door unlock |
| University | Campus building, logo | Campus ambient |

See [32_Art_Direction.md](./32_Art_Direction.md) and [33_Audio_Direction.md](./33_Audio_Direction.md).

---

# 13. QA & Ship Gates

## 13.1 Content QA Matrix

| Test | Method |
|---|---|
| Schema validation | Automated CI |
| In-game spawn | WGS seed test |
| Player purchase/use | Manual + automated |
| AI adoption | Telemetry in dev build |
| UI display | Screenshot diff |
| Localization overflow | Pseudo-locale test |

## 13.2 Ship Gate Checklist

- [ ] Brief archived in doc 39 tracker
- [ ] Economy sign-off recorded
- [ ] Constitution capital mapping documented
- [ ] CI green
- [ ] Patch notes drafted
- [ ] Rollback pack prepared

---

# 14. Mod & DLC Content Path

Per Product Bible §16–17 and TDD §9:

| Path | Validation |
|---|---|
| Official DLC | Full pipeline + economy board |
| Curated mods | Schema + sandbox limits |
| Open mods | Local only until verified |

Mods cannot alter: lending core formulas, tax brackets, aging curves without explicit `modDangerousRules` flag and player consent.

---

# 15. Governance & Versioning

## 15.1 Version Semver

- **MAJOR:** Breaking schema or save migration
- **MINOR:** New content types or regions
- **PATCH:** Balance tuning, bug fixes

## 15.2 Content RFC Process

1. RFC in `/docs/rfcs/content-YYYY-MM-DD-{slug}.md`
2. 5 business day review window
3. Approval: Product + Economy + Engineering
4. Track in [39_Project_Master_Index.md](./39_Project_Master_Index.md)

---

*End of Content Pipeline Document*
