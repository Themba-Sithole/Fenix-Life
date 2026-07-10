# Fenix Life — Economy Engine

**Document Version:** 1.0  
**Status:** Canonical — Macroeconomic Architecture Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Chief Economist & Principal Simulation Architect  
**Audience:** Engineering, Game Design, AI Systems, QA, Live Ops, Data  

---

## Document Authority

The Economy Engine defines **how money, prices, credit, trade, cycles, and sector health move through every sovereign Fenix Life world**. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Financial literacy, consequence, decade-scale play |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Living World, Citizen Equality |
| [Fenix-Simulation-Framework.md](./Fenix-Simulation-Framework.md) | FSF Economy Engine §4.9, engine constellation |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Module boundaries, performance, event bus |
| [Fenix-Life-Database-Design-Document.md](./Fenix-Life-Database-Design-Document.md) | `MacroStateVector`, `MacroIndicatorHistory` |
| [Fenix-Life-World-Generation-System.md](./Fenix-Life-World-Generation-System.md) | Initial macro seed, historical backfill |
| [17_Time_Simulation_System.md](./17_Time_Simulation_System.md) | Monthly/annual tick cadence |

When economic design conflicts with Citizen Equality, **player and AI face identical market physics**—no hidden subsidies or punitive AI advantages.

**What this document is:**

- The **complete macroeconomic model** for Fenix Life worlds
- The **integration contract** between Economy, Banking, Tax, Government, Housing, Company, and Citizen engines
- The **formula authority** for inflation, cycles, supply/demand, and trade
- The **emergence playbook** for recessions, booms, and sector crises

**What this document is not:**

- Individual ledger accounting (Banking Engine)
- Corporate P&L line items (Company Engine — Document 19)
- Citizen spending utility (Citizen AI — Document 20)
- Tax rule definitions (Tax Engine — referenced, not duplicated)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Philosophy & Constitutional Alignment](#2-philosophy--constitutional-alignment)
3. [Architectural Overview](#3-architectural-overview)
4. [Macro State Vector](#4-macro-state-vector)
5. [Inflation System](#5-inflation-system)
6. [Supply & Demand](#6-supply--demand)
7. [Labor Market & Wages](#7-labor-market--wages)
8. [Interest Rates & Monetary Policy](#8-interest-rates--monetary-policy)
9. [Banking & Credit Integration](#9-banking--credit-integration)
10. [Tax & Fiscal Integration](#10-tax--fiscal-integration)
11. [Government Spending](#11-government-spending)
12. [International Trade](#12-international-trade)
13. [Housing Market Integration](#13-housing-market-integration)
14. [Energy & Fuel](#14-energy--fuel)
15. [Consumer Confidence & Sentiment](#15-consumer-confidence--sentiment)
16. [Business Cycles](#16-business-cycles)
17. [Recessions](#17-recessions)
18. [Booms & Overheating](#18-booms--overheating)
19. [Sector Model](#19-sector-model)
20. [Market Indices & Investment Bridge](#20-market-indices--investment-bridge)
21. [Shock Propagation](#21-shock-propagation)
22. [Tiered Fidelity & Aggregation](#22-tiered-fidelity--aggregation)
23. [Events & Integration Contracts](#23-events--integration-contracts)
24. [Performance & Caching](#24-performance--caching)
25. [Governance & Tuning](#25-governance--tuning)

---

# 1. Executive Summary

The Fenix Life Economy Engine is the **macroscopic nervous system** of every world. It does not replace micro accounting in Banking or Company engines—it provides the **price surface, demand curves, policy rates, and cycle phase** against which all agents optimize.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ECONOMY ENGINE — DATA FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INPUTS                          CORE                    OUTPUTS             │
│  ───────                         ────                    ───────             │
│  Government policy ──────┐                                                  │
│  Tax revenue ────────────┤     ┌──────────────┐     Macro state vector      │
│  Company aggregates ─────┼────►│   Economy    ├────► Price indices           │
│  Citizen consumption ────┤     │    Engine    │     Sector demand           │
│  Weather/agriculture ────┤     └──────────────┘     Wage indices             │
│  Transport/fuel ─────────┤            │            Interest rate targets     │
│  Media sentiment ────────┘            │            Cycle phase               │
│                                       ▼                                      │
│                              ┌─────────────────┐                           │
│                              │  Event Fan-Out  │                           │
│                              └────────┬────────┘                           │
│                                       │                                      │
│         ┌──────────────┬──────────────┼──────────────┬──────────────┐       │
│         ▼              ▼              ▼              ▼              ▼       │
│     Banking       Company        Housing       Career         Investment   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Design tenets:**

| Tenet | Implementation |
|---|---|
| **Emergence** | Crises arise from interacting variables, not scripted cards |
| **Teachability** | Players can trace inflation to spending, rates, and supply |
| **Symmetry** | AI companies and citizens consume same price indices |
| **Performance** | Fixed-size macro vector; lazy sector detail |
| **Memory** | Macro history archived; shocks leave fossil records |

---

# 2. Philosophy & Constitutional Alignment

## 2.1 Financial Capital as System, Not Score

The Constitution's Financial Capital is **earned through systemic participation**, not arbitrary multipliers. The Economy Engine creates the **terrain**—steep for leveraged players in tightening cycles, favorable for disciplined savers in recovery.

## 2.2 Living World Economics

While the player sleeps:

- Central bank analog adjusts policy rate on schedule
- Sector demand drifts with cycle phase
- Import prices respond to trade shocks
- Housing indices update monthly
- Unemployment rolls forward

Competitor companies face the same credit tightening the player's company faces.

## 2.3 Emergence Over Script

**Approved:** Housing crisis from credit expansion → rate shock → unemployment → foreclosures → demand collapse.

**Rejected:** "Year 10 Housing Crash" event applying −30% unrelated to prior state.

## 2.4 Five Capitals Economic Lens

| Capital | Economy Engine Touchpoint |
|---|---|
| **Financial** | Inflation erodes cash; assets may hedge |
| **Human** | Unemployment affects skill utilization |
| **Social** | Consumer confidence from macro mood |
| **Business** | Sector demand drives revenue |
| **Legacy** | Long cycles affect generational wealth transfer |

## 2.5 Design Review Questions

1. Which macro variable drives this outcome?
2. Can players investigate causes in-game (news, central bank statements)?
3. Does AI receive identical price signals?
4. What World Memory event records this shift?
5. What is the monthly vs annual update cadence?

---

# 3. Architectural Overview

## 3.1 Engine Boundaries

| Owns | Does Not Own |
|---|---|
| Macro state vector | Individual bank accounts |
| Price/wage indices | Loan contracts |
| Sector demand/supply aggregates | Company SKUs |
| Policy rate target | Tax assessments |
| Cycle phase classification | Property titles |
| Trade balance indices | Citizen utility functions |

## 3.2 Module Placement

```
NestJS Module: EconomyModule
├── domain/
│   ├── MacroStateAggregate
│   ├── SectorStateAggregate
│   ├── PriceIndexService
│   ├── CycleClassifier
│   └── ShockPropagator
├── application/
│   ├── MonthlyIndexUpdateHandler
│   ├── AnnualStructuralAdjustmentHandler
│   └── SectorDemandProjection
├── infrastructure/
│   ├── MacroStateRepository (Prisma)
│   └── MacroIndicatorHistoryRepository
└── interfaces/
    ├── IEconomyQuery (CQRS read)
    └── IEconomyTickParticipant
```

## 3.3 Core Interface

```typescript
interface IEconomyEngine extends ITickParticipant {
  readonly engineId: 'economy';

  /** Current authoritative macro state */
  getMacroState(): MacroStateVector;

  /** Sector-specific demand multiplier */
  getSectorDemand(sectorId: SectorId): SectorDemandState;

  /** Price index for category */
  getPriceIndex(category: PriceCategory): number;

  /** Policy rate (fed funds analog) */
  getPolicyRate(): number;

  /** Current cycle phase */
  getCyclePhase(): CyclePhase;

  /** Apply external shock */
  applyShock(shock: EconomicShock): void;
}
```

---

# 4. Macro State Vector

## 4.1 Vector Definition

The macro state is a **fixed-size, cacheable structure** updated primarily at monthly and annual boundaries:

```typescript
interface MacroStateVector {
  worldInstanceId: string;
  asOfDate: string;

  // Prices & inflation
  cpiIndex: number;                    // baseline 100 at world start
  coreCpiIndex: number;                // ex food & energy
  ppiIndex: number;                    // producer prices
  annualInflationRate: number;         // YoY %
  monthlyInflationRate: number;        // MoM annualized

  // Labor
  unemploymentRate: number;            // U3 analog, 0–1
  laborForceParticipation: number;
  wageIndex: number;                   // baseline 100
  jobOpeningsRate: number;             // vacancies / labor force

  // Output
  gdpIndex: number;                    // real GDP index, baseline 100
  gdpGrowthRate: number;               // annualized %
  industrialProductionIndex: number;

  // Financial conditions
  policyRate: number;                  // central bank target
  yieldCurve10y2y: number;             // spread
  creditSpread: number;                // corporate risk premium
  moneySupplyGrowth: number;

  // Confidence & trade
  consumerConfidence: number;          // 0–200, 100 = neutral
  businessConfidence: number;
  tradeBalanceIndex: number;           // negative = deficit
  exchangeRateIndex: number;           // trade-weighted

  // Cycle
  cyclePhase: CyclePhase;
  cyclePhaseMonths: number;            // duration in current phase
  outputGap: number;                   // % vs potential GDP

  // Housing & energy (headline)
  housingPriceIndex: number;
  rentIndex: number;
  fuelPriceIndex: number;
  electricityPriceIndex: number;

  rulesetVersion: string;
  updatedAt: string;
}

type CyclePhase =
  | 'expansion'
  | 'peak'
  | 'contraction'
  | 'trough'
  | 'recovery';
```

## 4.2 Initialization (World Generation)

Per World Generation System, worlds boot with `macroSeed`-derived state:

| Variable | Typical Start Range |
|---|---|
| `cpiIndex` | 95–110 (historical backfill may start mid-cycle) |
| `unemploymentRate` | 0.04–0.08 |
| `policyRate` | 0.01–0.05 |
| `cyclePhase` | From `MacroTimeline` backfill |
| `gdpIndex` | 90–120 |

## 4.3 History Retention

`MacroIndicatorHistory` stores monthly snapshots for 80 in-game years; annual rollups beyond. Used by Media, History, and player research UI.

---

# 5. Inflation System

## 5.1 Inflation Philosophy

Inflation in Fenix Life is **emergent from money flow and supply constraints**, not a random annual roll. Players who ignore macro conditions feel it in rent, tuition, and grocery line items.

## 5.2 Monthly Inflation Components

```
π_month = π_demand + π_costPush + π_expectations + π_monetary + ε_shock

Where:
  π_demand      = demandPullFromOutputGap(outputGap, consumerConfidence)
  π_costPush    = costPushFromImports(fuelPriceΔ, importPriceIndexΔ)
  π_expectations = adaptiveExpectations(prior π, targetBand)
  π_monetary    = monetaryContribution(moneySupplyGrowth, velocityProxy)
  ε_shock       = active shock residual (weather, war, supply chain)
```

## 5.3 Demand-Pull Inflation

```typescript
function demandPullFromOutputGap(outputGap: number, confidence: number): number {
  // outputGap > 0 → economy above potential → inflationary pressure
  const gapComponent = Math.max(0, outputGap) * 0.15;
  const confidenceComponent = Math.max(0, (confidence - 100) / 100) * 0.02;
  return gapComponent + confidenceComponent;
}
```

## 5.4 Cost-Push Inflation

| Source | Transmission |
|---|---|
| Fuel price spike | Transport costs → PPI → CPI |
| Import price shock | Exchange rate + tariff policy |
| Weather crop failure | Food CPI component |
| Wage spiral | Wage index → services CPI |

```typescript
function costPushFromImports(
  fuelPriceDelta: number,
  importPriceDelta: number,
  sectorWeights: SectorWeightMap,
): number {
  return (
    fuelPriceDelta * 0.08 +
    importPriceDelta * sectorWeights.imports * 0.12
  );
}
```

## 5.5 Expectations & Anchoring

Central bank analog targets `inflationTarget` (default 2% annual):

```typescript
function adaptiveExpectations(
  priorMonthlyInflation: number,
  targetAnnual: number,
  anchoringStrength: number = 0.3,
): number {
  const targetMonthly = Math.pow(1 + targetAnnual, 1 / 12) - 1;
  return priorMonthlyInflation * (1 - anchoringStrength) +
         targetMonthly * anchoringStrength;
}
```

## 5.6 CPI Basket

CPI composed of weighted categories:

| Category | Weight | Primary Driver |
|---|---|---|
| Housing (imputed rent) | 32% | Rent index, mortgage costs |
| Food | 14% | Agriculture, transport |
| Energy | 8% | Fuel, electricity |
| Healthcare | 12% | Healthcare cost index |
| Transportation | 10% | Fuel, vehicle prices |
| Education | 6% | Tuition index |
| Recreation | 5% | Discretionary demand |
| Apparel | 4% | Import prices |
| Other services | 9% | Wage index |

```typescript
function computeCpi(categories: Record<PriceCategory, number>, weights: WeightMap): number {
  return Object.entries(weights).reduce(
    (sum, [cat, w]) => sum + categories[cat as PriceCategory] * w,
    0,
  );
}
```

## 5.7 Inflation Consequences

| Stakeholder | Effect |
|---|---|
| **Savers** | Real value erosion on cash |
| **Borrowers** | Real debt burden reduction (fixed-rate) |
| **Renters** | Rent index adjustment at lease renewal |
| **Workers** | Wage index lags CPI → real wage squeeze |
| **Government** | Bracket creep if not indexed; debt erosion |
| **Companies** | Input cost pressure; pricing power sector-dependent |

## 5.8 Deflation Regime

Rare but possible in severe contraction:

- `annualInflationRate < 0` for 3+ months
- Triggers debt-deflation spiral risk (Banking Engine)
- Central bank cuts policy rate toward `effectiveLowerBound` (default 0.25%)

---

# 6. Supply & Demand

## 6.1 Sector Supply-Demand Model

Each sector `s` maintains:

```typescript
interface SectorDemandState {
  sectorId: SectorId;
  demandIndex: number;       // 0+ multiplier vs baseline
  supplyIndex: number;
  inventoryRatio: number;    // supply / demand
  pricePressure: number;     // -1 to +1
  employmentShare: number;
  profitMarginProxy: number;
}
```

## 6.2 Demand Function

```
D_s = D_base × (1 + β_gdp × Δgdp) × (1 + β_conf × Δconfidence) × sectorCycleMultiplier_s × policyModifier_s
```

| Sector | GDP Elasticity (β_gdp) | Confidence Elasticity |
|---|---|---|
| Luxury goods | 1.8 | 1.2 |
| Staples | 0.3 | 0.1 |
| Housing | 1.2 | 0.8 |
| Technology | 1.5 | 0.6 |
| Healthcare | 0.5 | 0.2 |
| Energy | 0.4 | −0.1 |

## 6.3 Supply Function

Supply adjusts with **lags**:

```
S_s(t) = S_s(t-1) × (1 + investmentResponse_s × profitMarginProxy - depreciation_s + shock_s)
```

- Capacity investments lag 6–18 months
- Weather shocks hit agriculture/energy immediately
- Labor supply from Career Engine graduate flows

## 6.4 Price Pressure Transmission

```typescript
function sectorPricePressure(demand: number, supply: number): number {
  const ratio = supply / Math.max(demand, 0.01);
  if (ratio < 0.9) return Math.min(1, (0.9 - ratio) * 2);      // shortage
  if (ratio > 1.1) return Math.max(-1, (1.1 - ratio) * 2);    // glut
  return 0;
}
```

Sector price pressure feeds PPI → CPI with sector weights.

## 6.5 Company Bridge

Company Engine reads `getSectorDemand(sectorId)` for revenue forecasting:

```
expectedRevenueGrowth = sectorDemandGrowth × marketShareStability × productCycleFactor
```

Player and NPC companies use **identical** sector demand signals.

---

# 7. Labor Market & Wages

## 7.1 Unemployment Dynamics

```typescript
function updateUnemployment(
  current: number,
  gdpGrowth: number,
  sectorShocks: number,
  participationDelta: number,
): number {
  // Okun's law analog
  const okunDelta = -0.4 * (gdpGrowth - 2.0) / 100;
  const shockDelta = sectorShocks * 0.02;
  const naturalRate = 0.045; // ruleset configurable
  const next = current + okunDelta + shockDelta;
  return clamp(next, 0.02, 0.25);
}
```

## 7.2 Wage Index

Monthly wage adjustment:

```
ΔwageIndex = wagePhillipsCurve(unemployment, inflationExpectations, productivityGrowth)

wagePhillipsCurve:
  base = productivityGrowth + targetRealWageGrowth
  tightness = (naturalRate - unemployment) × phillipsSlope
  passThrough = inflationExpectations × indexationStrength
  return base + tightness + passThrough
```

## 7.3 Labor Market Tiers

| Tier | Labor Representation |
|---|---|
| **T0/T1** | Named citizens in Career Engine |
| **T2** | Statistical job matching |
| **T3** | Aggregate employment counts per sector |

Economy Engine publishes `economy.wage_index_adjusted` and `economy.sector_demand_changed` for Career matching.

## 7.4 Skills & Structural Unemployment

Long-term sector decline creates **structural unemployment**:

- Coal sector contraction → persistent regional unemployment
- Retraining lag via Education Engine
- Migration flows (future expansion)

---

# 8. Interest Rates & Monetary Policy

## 8.1 Policy Rate Mechanism

Government Engine owns central bank **institution**; Economy Engine computes **rate target** from Taylor-rule analog:

```typescript
function taylorRuleTarget(
  inflation: number,
  inflationTarget: number,
  outputGap: number,
  neutralRate: number,
): number {
  const inflationGap = inflation - inflationTarget;
  return (
    neutralRate +
    1.5 * inflationGap +
    0.5 * outputGap
  );
}
```

## 8.2 Rate Transmission

| Channel | Effect |
|---|---|
| **Banking** | Prime rate = policy + spread; mortgage rates adjust monthly |
| **Investment** | Discount rates affect valuations |
| **Housing** | Affordability index shifts |
| **Exchange rate** | Trade balance feedback |
| **Consumer credit** | Auto/ card APR adjustments |

## 8.3 Yield Curve

Simplified yield curve from policy rate and cycle expectations:

```
yield10y = policyRate + termPremium(cyclePhase, inflationExpectations)
yieldCurve10y2y = yield10y - yield2y
```

Inverted curve (`yieldCurve10y2y < 0`) increases recession probability next 12 months.

## 8.4 Quantitative Easing Analog (Crisis Tool)

In `trough` phase with policy at effective lower bound:

- `moneySupplyGrowth` elevated via government balance sheet expansion
- Reduces credit spread over 6 months
- Side effect: asset price inflation (Housing, Investment indices)

---

# 9. Banking & Credit Integration

## 9.1 Division of Responsibility

| Banking Engine | Economy Engine |
|---|---|
| Account balances | Policy rate |
| Loan origination | Credit spread environment |
| Credit scores | Macro unemployment context |
| Foreclosure execution | Housing price index |
| Ledger entries | Inflation for real rate calculation |

## 9.2 Real Interest Rate

```
realRate = nominalRate - expectedInflation
```

Loan affordability in Banking uses Economy's `annualInflationRate` for real payment burden projection.

## 9.3 Credit Cycle

```
creditAvailability = f(policyRate, creditSpread, cyclePhase, bankCapitalHealth)

expansion: creditAvailability high → lending standards loosen (Banking rule tables)
contraction: creditAvailability low → standards tighten, defaults rise
```

## 9.4 Credit Spread Dynamics

```typescript
function updateCreditSpread(
  current: number,
  cyclePhase: CyclePhase,
  defaultRate: number,
  policyRate: number,
): number {
  const cycleAdjustment = CYCLE_SPREAD_MAP[cyclePhase];
  const defaultAdjustment = (defaultRate - 0.02) * 5;
  return clamp(current + cycleAdjustment + defaultAdjustment, 0.01, 0.15);
}
```

## 9.5 Events

| Event | Direction |
|---|---|
| `economy.rate_changed` | Banking adjusts product rates |
| `banking.defaulted` | Economy increases default rate input |
| `economy.recession_entered` | Banking tightens origination rules |

---

# 10. Tax & Fiscal Integration

## 10.1 Division of Responsibility

| Tax Engine | Economy Engine |
|---|---|
| Assessment & collection | GDP affects revenue baseline |
| Bracket application | Inflation bracket indexing policy |
| Audit selection | — |
| Withholding schedules | Wage index drives withholding growth |

## 10.2 Fiscal Multiplier

Government spending changes feed back to GDP:

```
Δgdp_from_fiscal = spendingDelta × fiscalMultiplier(cyclePhase)

fiscalMultiplier:
  trough/recovery: 1.4
  expansion: 0.8
  peak: 0.5
```

## 10.3 Automatic Stabilizers

| Stabilizer | Mechanism |
|---|---|
| Unemployment benefits | Spending rises in contraction |
| Progressive taxation | Revenue falls faster than GDP |
| Welfare programs | Counter-cyclical outlays |

Economy Engine consumes `tax.revenue_reported` for fiscal balance input.

## 10.4 Debt Sustainability

Government debt-to-GDP ratio (aggregate) influences:

- Credit rating proxy
- Policy rate term premium
- Political pressure events (Government Engine)

---

# 11. Government Spending

## 11.1 Spending Categories

```typescript
interface GovernmentSpendingBreakdown {
  defense: number;
  healthcare: number;
  education: number;
  infrastructure: number;
  socialSecurity: number;
  debtService: number;
  other: number;
  total: number;
}
```

## 11.2 Spending Rules

Spending set by Government Engine policy; Economy Engine models **impact**:

| Category | GDP Impact Channel |
|---|---|
| Infrastructure | Productivity growth (+lag) |
| Education | Human capital / labor quality |
| Healthcare | Labor force participation |
| Defense | Industrial demand (sector) |
| Social security | Consumer demand (MPC high) |

## 11.3 Deficit & Crowding Out

Large deficits in expansion phase:

- Increase `yield10y` via term premium
- Crowd out private investment (Investment Engine)
- Potential inflation if monetized

---

# 12. International Trade

## 12.1 Trade Model Abstraction

Fenix Life uses **index-based trade** rather than simulating every trading partner:

```typescript
interface TradeState {
  exportIndex: number;
  importIndex: number;
  exchangeRateIndex: number;
  tariffIndex: number;
  tradeBalance: number;  // exports - imports in index units
}
```

## 12.2 Export Demand

```
exportGrowth = weightedForeignDemand × exchangeRateEffect × sectorCompetitiveness
```

`weightedForeignDemand` is exogenous curve modulated by global cycle shocks (ruleset events).

## 12.3 Import Prices

```
importPriceIndex = baseImportPrices × (1 / exchangeRateIndex) × (1 + tariffIndex)
```

Cost-push transmission to PPI and CPI.

## 12.4 Trade Shocks

| Shock | Effect |
|---|---|
| Trade war | ↑ tariffIndex, ↓ exportIndex |
| Global recession | ↓ weightedForeignDemand |
| Commodity boom | ↑ exportIndex for resource sectors |
| Supply chain disruption | ↑ import prices, ↓ supplyIndex |

## 12.5 Exchange Rate

Simplified floating rate:

```
ΔexchangeRate = 0.3 × (policyRate - foreignRate) + 0.2 × tradeBalance + noise
```

---

# 13. Housing Market Integration

## 13.1 Division of Responsibility

| Housing Engine | Economy Engine |
|---|---|
| Property titles & transactions | Housing price index |
| Mortgages (with Banking) | Rent index |
| Zoning & development | Macro rate environment |
| Vacancy rates | Consumer confidence input |

## 13.2 Housing Price Index Dynamics

```
ΔhousingIndex = 
  α × (incomeGrowth - housingIndexGrowth) +    // affordability correction
  β × (policyRateΔ × rateElasticity) +          // mortgage rate channel
  γ × regionalDemandPressure +                   // from Housing Engine
  δ × speculationBubbleTerm(cyclePhase)          // momentum at peak
```

## 13.3 Rent Index

Rent adjusts with lag behind sales prices:

```
rentIndex(t) = 0.7 × rentIndex(t-1) + 0.3 × impliedRentFromPrices(housingIndex, capRate)
```

## 13.4 Housing Cycle Feedback

```
Housing boom → construction employment ↑ → GDP ↑ → confidence ↑ → more demand
Housing bust → foreclosures (Banking) → wealth effect ↓ → consumer spending ↓
```

## 13.5 Events

| Event | Publisher |
|---|---|
| `housing.price_index_updated` | Housing (detail) |
| `economy.inflation_index_updated` | Economy (CPI housing weight) |
| `economy.rate_changed` | Economy → Housing affordability |

---

# 14. Energy & Fuel

## 14.1 Fuel Price Index

```
fuelPriceIndex = baseFuel × (1 + crudeOilShock + refineryCapacity + carbonTax + weatherDisruption)
```

## 14.2 Transmission Channels

| Channel | Impact |
|---|---|
| **Transportation Engine** | Commute costs, logistics |
| **CPI Energy** | Direct consumer impact |
| **PPI** | Manufacturing input costs |
| **Sector demand** | Airlines, logistics margins compressed |

## 14.3 Electricity

```
electricityPriceIndex = fuelMixWeighted(fuelPrice, renewableShare, gridStress)
```

Government policy (subsidies, carbon pricing) modulates via Government Engine.

## 14.4 Energy Shocks

| Shock | Typical Duration |
|---|---|
| OPEC analog supply cut | 6–18 months |
| Hurricane refinery outage | 1–3 months |
| Green transition investment | Long-term cost curve shift |
| War premium | 3–12 months |

Published as `economy.shock_applied` with `category: 'energy'`.

---

# 15. Consumer Confidence & Sentiment

## 15.1 Consumer Confidence Index

```typescript
function updateConsumerConfidence(
  current: number,
  unemployment: number,
  inflation: number,
  gdpGrowth: number,
  stockIndexReturn: number,
  mediaSentiment: number,
): number {
  const unemploymentEffect = (0.05 - unemployment) * 200;
  const inflationEffect = -(inflation - 0.02) * 300;
  const gdpEffect = gdpGrowth * 10;
  const wealthEffect = stockIndexReturn * 50;
  const mediaEffect = (mediaSentiment - 0.5) * 20;

  return clamp(
    current * 0.7 +
    (100 + unemploymentEffect + inflationEffect + gdpEffect + wealthEffect + mediaEffect) * 0.3,
    50,
    150,
  );
}
```

## 15.2 Business Confidence

Similar function with emphasis on profit margins, credit spread, and policy uncertainty.

## 15.3 Media Integration

Media Engine publishes `media.sentiment_shifted`:

- Scandal → confidence −
- Tech breakthrough → sector confidence +
- Recession coverage → fear amplification (feedback loop)

## 15.4 Confidence → Behavior

Citizen AI (Document 20) consumes confidence for:

- Discretionary spending propensity
- Major purchase timing (vehicles, homes)
- Startup attempt rate
- Investment risk appetite

---

# 16. Business Cycles

## 16.1 Cycle Phase Machine

```
        ┌─────────────┐
        │  EXPANSION  │◄────────────────┐
        └──────┬──────┘                 │
               │ overheating signals    │
               ▼                        │
        ┌─────────────┐                 │
        │    PEAK     │                 │
        └──────┬──────┘                 │
               │ correction triggers    │
               ▼                        │
        ┌─────────────┐    recovery     │
        │ CONTRACTION │────────────┐    │
        └──────┬──────┘            │    │
               │                   ▼    │
               │            ┌─────────────┐
               └───────────►│   TROUGH    │
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │  RECOVERY   │──────► EXPANSION
                            └─────────────┘
```

## 16.2 Phase Transition Rules

Evaluated quarterly:

| Transition | Conditions (simplified) |
|---|---|
| expansion → peak | outputGap > 1.5% AND inflation > target + 1% for 2 quarters |
| peak → contraction | gdpGrowth < 0 for 1 quarter OR yield curve inverted 2 quarters |
| contraction → trough | gdpGrowth negative 2+ quarters AND unemployment rising |
| trough → recovery | gdpGrowth > 0 for 2 quarters |
| recovery → expansion | outputGap > 0 AND unemployment falling 4 quarters |

## 16.3 Cycle Duration Targets

| Phase | Target Duration (game months) |
|---|---|
| Expansion | 48–120 |
| Peak | 3–12 |
| Contraction | 6–24 |
| Trough | 3–9 |
| Recovery | 12–36 |

RNG within bounds prevents mechanical periodicity.

## 16.4 Sector Rotation

| Phase | Outperforming Sectors |
|---|---|
| Early recovery | Financials, consumer discretionary |
| Mid expansion | Technology, industrials |
| Late expansion | Energy, materials |
| Contraction | Staples, healthcare |
| Trough | Utilities, REITs |

Investment Engine uses rotation for NPC fund flows.

---

# 17. Recessions

## 17.1 Recession Definition

**Technical recession:** Real GDP growth negative for 2 consecutive quarters.

Economy Engine publishes `economy.recession_entered` on confirmation.

## 17.2 Recession Severity Classes

| Class | GDP Decline | Unemployment Peak | Duration |
|---|---|---|---|
| **Mild** | −1% to −2% | +1–2 pp | 6–12 months |
| **Moderate** | −2% to −5% | +2–4 pp | 12–24 months |
| **Severe** | −5% to −10% | +4–7 pp | 18–36 months |
| **Depression analog** | > −10% | +7+ pp | 36+ months |

Severity emerges from shock composition, not dice roll.

## 17.3 Recession Channels

```
GDP decline
  → Unemployment ↑ (Okun)
  → Consumer confidence ↓
  → Discretionary demand ↓
  → Corporate earnings ↓ (Company Engine)
  → Credit defaults ↑ (Banking)
  → Credit spread ↑
  → Housing transactions ↓
  → Government automatic stabilizers ↑
  → Policy rate ↓ (Taylor rule)
```

## 17.4 Sector-Specific Recessions

Not all recessions are uniform:

| Type | Trigger | Affected Sectors |
|---|---|---|
| **Financial crisis** | Banking defaults | Financials, housing, construction |
| **Tech bust** | Valuation collapse | Technology, venture |
| **Commodity crash** | Export price collapse | Energy, mining, regions |
| **Pandemic analog** | Services disruption | Hospitality, travel |

## 17.5 Player Experience

During recession:

- Job market tightens (Career Engine)
- Credit harder to obtain (Banking)
- Competitors may fail or acquire cheap (Company)
- Opportunity for contrarian wealth (Investment)
- Media coverage educates causes (Media Engine)

**Symmetry:** AI citizens lose jobs, default, and adapt via Citizen AI.

## 17.6 Exit

`economy.recession_exited` when:

- GDP growth positive 2 quarters AND
- Unemployment peaked and declining 1 quarter

---

# 18. Booms & Overheating

## 18.1 Boom Definition

**Boom:** Output gap > 2% AND asset prices rising > 15% annualized AND credit growth > 10%.

## 18.2 Boom Characteristics

| Indicator | Boom Signal |
|---|---|
| Unemployment | Below natural rate |
| Wage growth | Above productivity + inflation |
| Housing | Accelerating price growth |
| Credit | Expanding rapidly |
| Confidence | > 120 |
| Inflation | Above target |

## 18.3 Overheating Risks

```
Boom → central bank tightening → rate shock → asset correction → recession
```

Classic **boom-bust cycle** emerges without scripted "bubble pop" event.

## 18.4 Sector Bubbles

Localized bubbles when `speculationBubbleTerm` elevated:

```typescript
function speculationBubbleTerm(cyclePhase: CyclePhase, housingMomentum: number): number {
  if (cyclePhase !== 'peak' && cyclePhase !== 'late_expansion') return 0;
  return Math.max(0, housingMomentum - 0.1) * 2;
}
```

## 18.5 Media & Euphoria

Media Engine amplifies boom narratives:

- "Can't lose" sentiment
- IPO frenzy coverage
- Celebrity billionaire profiles

Citizen AI euphoria state increases risk-taking (CDPS integration).

---

# 19. Sector Model

## 19.1 Sector Taxonomy

```typescript
enum SectorId {
  AGRICULTURE = 'agriculture',
  ENERGY = 'energy',
  MATERIALS = 'materials',
  INDUSTRIALS = 'industrials',
  CONSUMER_DISCRETIONARY = 'consumer_discretionary',
  CONSUMER_STAPLES = 'consumer_staples',
  HEALTHCARE = 'healthcare',
  FINANCIALS = 'financials',
  TECHNOLOGY = 'technology',
  COMMUNICATION = 'communication',
  UTILITIES = 'utilities',
  REAL_ESTATE = 'real_estate',
  HOSPITALITY = 'hospitality',
  EDUCATION_SERVICES = 'education_services',
  GOVERNMENT = 'government',
}
```

## 19.2 Sector State Update (Monthly)

```typescript
async function updateSectorState(
  sector: SectorId,
  macro: MacroStateVector,
  prior: SectorDemandState,
): Promise<SectorDemandState> {
  const demand = computeSectorDemand(sector, macro);
  const supply = computeSectorSupply(sector, prior, macro);
  const pricePressure = sectorPricePressure(demand, supply);

  return {
    sectorId: sector,
    demandIndex: demand,
    supplyIndex: supply,
    inventoryRatio: supply / demand,
    pricePressure,
    employmentShare: prior.employmentShare, // updated from Career aggregates
    profitMarginProxy: computeMarginProxy(pricePressure, wageIndex, macro),
  };
}
```

## 19.3 Company Mapping

Each company has `primarySector` and optional `secondarySectors[]`. Revenue exposure weights sector demand signals.

## 19.4 Emerging Sectors

Ruleset updates may introduce new sectors (e.g., `renewable_energy`):

- Migration from `energy` over 10-year transition
- Policy subsidies from Government Engine

---

# 20. Market Indices & Investment Bridge

## 20.1 Equity Index

```typescript
interface MarketIndex {
  indexId: string;
  level: number;
  dailyReturn: number;
  peRatio: number;
  dividendYield: number;
  components: SectorWeightMap;
}
```

**Broad market index** (e.g., FNX-500 analog):

```
indexReturn = Σ (sectorWeight_s × sectorReturn_s)
sectorReturn_s = earningsGrowth_s × peExpansion + dividendYield
```

## 20.2 Earnings Link

Company Engine quarterly `company.earnings_reported` aggregates to sector earnings growth.

## 20.3 Market Crash Event

`economy.market_crash` when:

- Index drops > 10% in 20 trading days (simulated)
- OR credit crisis triggers fire-sale cascade

Investment Engine handles portfolio marks; Citizen AI panic selling optional.

## 20.4 Bond Index

Government and corporate bond indices from yield curve and credit spread.

---

# 21. Shock Propagation

## 21.1 Shock Types

```typescript
interface EconomicShock {
  shockId: string;
  category: 'weather' | 'geopolitical' | 'financial' | 'technology' | 'health' | 'policy';
  magnitude: number;        // -1 to +1
  durationMonths: number;
  affectedSectors: SectorId[];
  transmissionSpeed: 'immediate' | 'lagged_3m' | 'lagged_6m';
  sourceEventId?: string;
}
```

## 21.2 Propagation Graph

```
Shock applied
  → Sector supply/demand adjusted
  → PPI/CPI components affected (lagged)
  → Confidence adjusted
  → Policy response (Government, 1–3 month lag)
  → Banking credit conditions
  → Company revenue forecasts
  → Career layoffs/hiring
  → Citizen spending
```

## 21.3 Fan-Out Pattern

Economy Engine **does not** synchronously call other engines. It publishes events; subscribers react:

```typescript
bus.publish({
  type: 'economy.shock_applied',
  payload: shock,
  asOfDate: macro.asOfDate,
});
```

## 21.4 Shock Decay

```typescript
function shockResidual(shock: EconomicShock, monthsElapsed: number): number {
  if (monthsElapsed >= shock.durationMonths) return 0;
  const decay = 1 - monthsElapsed / shock.durationMonths;
  return shock.magnitude * decay;
}
```

---

# 22. Tiered Fidelity & Aggregation

## 22.1 T3 Aggregate Economy

Millions of T3 citizens do not have individual consumption functions. Instead:

```typescript
interface T3ConsumptionAggregate {
  sector: SectorId;
  totalSpending: number;
  householdCount: number;
  avgPropensityToConsume: number;
}
```

Derived from sector employment × wage index × confidence.

## 22.2 T2 Statistical Agents

T2 citizens use simplified consumption:

```
spending = income × mpc(statisticalConfidence, sectorWage)
```

## 22.3 T0/T1 Full Fidelity

Named citizens use Citizen AI spending decisions (Document 20) against Economy price indices.

## 22.4 Aggregation Reconciliation

Monthly reconciliation ensures:

```
Σ T0/T1 spending + T2 aggregate + T3 aggregate ≈ sector demand target
```

Discrepancy adjusts T3 `avgPropensityToConsume` (not player spending).

---

# 23. Events & Integration Contracts

## 23.1 Published Events

| Event | Frequency | Payload Highlights |
|---|---|---|
| `economy.rate_changed` | On policy change | `{ oldRate, newRate, reason }` |
| `economy.inflation_index_updated` | Monthly | `{ cpi, coreCpi, monthlyRate }` |
| `economy.sector_demand_changed` | Monthly | `{ sectorId, demandIndex, pricePressure }` |
| `economy.recession_entered` | On trigger | `{ severity, gdpDecline }` |
| `economy.recession_exited` | On trigger | `{ durationMonths }` |
| `economy.market_crash` | On trigger | `{ indexDrop, trigger }` |
| `economy.wage_index_adjusted` | Monthly | `{ wageIndex, change }` |
| `economy.shock_applied` | On shock | `EconomicShock` |
| `economy.cycle_phase_changed` | Quarterly | `{ from, to }` |

## 23.2 Consumed Events

| Event | Source | Action |
|---|---|---|
| `government.policy_enacted` | Government | Update policy modifiers |
| `government.election_completed` | Government | Fiscal stance shift |
| `tax.revenue_reported` | Tax | Fiscal balance |
| `company.bankrupt` | Company | Sector supply, unemployment |
| `weather.crop_yield_changed` | Weather | Food/energy shocks |
| `media.sentiment_shifted` | Media | Confidence adjustment |
| `transportation.fuel_price_changed` | Transportation | Fuel index sync |
| `banking.defaulted` | Banking | Credit spread input |

## 23.3 Tick Participation

| Phase | Economy Actions |
|---|---|
| **Monthly** | Full index update, sector demand, wage, inflation |
| **Quarterly** | Cycle phase evaluation |
| **Annual** | Structural adjustment, bracket indexing, long-run productivity |

---

# 24. Performance & Caching

## 24.1 Caching Strategy

| Data | Cache Duration |
|---|---|
| `MacroStateVector` | Entire sub-tick (immutable until monthly) |
| Sector states | Monthly refresh; dirty on shock |
| Price indices | Monthly (daily marks for investment only) |

## 24.2 Computational Budget

| Operation | Budget |
|---|---|
| Monthly full update | < 15ms |
| Quarterly cycle check | < 3ms |
| Annual structural | < 10ms |
| Shock application | < 2ms |

## 24.3 Lazy Sector Loading

Only sectors with active companies, player exposure, or recent shocks load full detail. Dormant sectors use stale cache.

## 24.4 Memoization

```typescript
const monthlyUpdateMemo = memoize(
  (worldId: string, monthKey: string) => performMonthlyUpdate(worldId),
  { key: (worldId, monthKey) => `${worldId}:${monthKey}` },
);
```

---

# 25. Governance & Tuning

## 25.1 Ruleset Parameters

Tunable via Rule Registry `economy/v{version}.json`:

| Parameter | Default | Range |
|---|---|---|
| `inflationTarget` | 0.02 | 0.01–0.04 |
| `naturalUnemployment` | 0.045 | 0.03–0.07 |
| `neutralRate` | 0.025 | 0.01–0.05 |
| `phillipsSlope` | 0.5 | 0.2–0.8 |
| `fiscalMultiplierTrough` | 1.4 | 0.8–2.0 |
| `okunCoefficient` | 0.4 | 0.2–0.6 |

## 25.2 Live Ops Guardrails

Mods may not:

- Set inflation > 20% monthly
- Force depression without shock event
- Grant player-only negative rates on loans

## 25.3 QA Scenarios

| Scenario | Validation |
|---|---|
| 1970s stagflation analog | High inflation + unemployment |
| 2008 financial crisis | Credit spread spike → recession |
| Dot-com bust | Sector-specific crash |
| Soft landing | Peak without recession (rare) |

## 25.4 Anti-Patterns

| Anti-Pattern | Rejection Rationale |
|---|---|
| Flat ±30% random modifiers | Non-emergent |
| Player immune to recession | Violates Symmetry |
| Instant macro changes | No transmission lag |
| Economy reads bank balances directly | Violates aggregate boundaries |

---

## Appendix A — Monthly Update Pseudocode

```typescript
async function monthlyEconomyTick(ctx: TickPhaseContext, bus: DomainEventBus): Promise<void> {
  const macro = await repo.getMacroState(ctx.worldInstanceId);
  const sectors = await repo.getAllSectorStates(ctx.worldInstanceId);

  // 1. Update shocks
  const shockResidual = computeActiveShocks(macro.asOfDate);

  // 2. GDP and output gap
  const gdpGrowth = computeGdpGrowth(macro, sectors, shockResidual);
  const outputGap = computeOutputGap(gdpGrowth, macro);

  // 3. Inflation
  const monthlyInflation = computeMonthlyInflation(macro, outputGap, shockResidual);
  const newCpi = macro.cpiIndex * (1 + monthlyInflation);

  // 4. Labor market
  const unemployment = updateUnemployment(macro.unemploymentRate, gdpGrowth, shockResidual);
  const wageIndex = updateWageIndex(macro.wageIndex, unemployment, monthlyInflation);

  // 5. Policy rate
  const policyRate = taylorRuleTarget(
    annualize(monthlyInflation),
    rules.inflationTarget,
    outputGap,
    rules.neutralRate,
  );

  // 6. Sectors
  for (const sector of Object.values(SectorId)) {
    sectors[sector] = await updateSectorState(sector, { ...macro, cpiIndex: newCpi }, sectors[sector]);
  }

  // 7. Confidence
  const consumerConfidence = updateConsumerConfidence(macro, unemployment, monthlyInflation, gdpGrowth);

  // 8. Persist and publish
  const newMacro = buildMacroState({ ...macro, cpiIndex: newCpi, unemployment, policyRate, consumerConfidence });
  await repo.saveMacroState(newMacro);
  bus.publish({ type: 'economy.inflation_index_updated', payload: newMacro });
  bus.publish({ type: 'economy.rate_changed', payload: { newRate: policyRate } });
  for (const s of Object.values(sectors)) {
    bus.publish({ type: 'economy.sector_demand_changed', payload: s });
  }
}
```

---

## Appendix B — Sector Elasticity Reference Table

| Sector | Price Elasticity | Income Elasticity | Rate Sensitivity |
|---|---|---|---|
| Agriculture | 0.2 | 0.5 | Low |
| Energy | 0.1 | 0.3 | Medium |
| Technology | 1.2 | 1.5 | High |
| Financials | 0.8 | 1.2 | Very High |
| Real Estate | 0.5 | 1.3 | Very High |
| Healthcare | 0.3 | 0.6 | Low |
| Hospitality | 1.5 | 1.8 | Medium |
| Staples | 0.3 | 0.4 | Low |

---

## Appendix C — Glossary

| Term | Definition |
|---|---|
| **CPI** | Consumer Price Index — headline inflation measure |
| **PPI** | Producer Price Index — wholesale inflation |
| **Output gap** | Actual GDP vs potential GDP |
| **Policy rate** | Central bank overnight target |
| **Credit spread** | Extra yield over risk-free for corporate borrowing |
| **MPC** | Marginal propensity to consume |
| **Okun's law** | GDP-unemployment relationship |
| **Taylor rule** | Policy rate reaction function |

---

*End of Document 18 — Economy Engine*
