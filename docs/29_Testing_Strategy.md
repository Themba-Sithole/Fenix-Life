# Fenix Life — Official Testing Strategy Document

**Document Version:** 1.0  
**Status:** Canonical — Quality Assurance Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal QA Engineering & Test Architecture  
**Audience:** Engineering, QA, Live Ops, AI Systems, Economy Design  

---

## Document Authority

This Testing Strategy Document defines **how Fenix Life verifies correctness, performance, balance, and longevity** across a simulation that must run for decades of in-game time and years of real-world patches. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Acceptance criteria, pillars, loops |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Symmetry Principle, Citizen Equality |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Testing targets (§12.5) |
| [26_Save_System.md](./26_Save_System.md) | Save testing requirements |
| [28_Project_Architecture.md](./28_Project_Architecture.md) | Test folder layout |
| [30_Coding_Standards.md](./30_Coding_Standards.md) | Test naming conventions |

Every test category must map to acceptance criteria from PRDs or constitution articles.

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Pyramid](#2-test-pyramid)
3. [Toolchain](#3-toolchain)
4. [Unit Testing](#4-unit-testing)
5. [Integration Testing](#5-integration-testing)
6. [API Contract Testing](#6-api-contract-testing)
7. [Simulation Testing](#7-simulation-testing)
8. [Golden Tests & Determinism](#8-golden-tests--determinism)
9. [AI Behavior Testing](#9-ai-behavior-testing)
10. [Economy Balancing Tests](#10-economy-balancing-tests)
11. [Save System Testing](#11-save-system-testing)
12. [Mod Compatibility Testing](#12-mod-compatibility-testing)
13. [End-to-End Testing](#13-end-to-end-testing)
14. [Performance & Load Testing](#14-performance--load-testing)
15. [Regression Testing](#15-regression-testing)
16. [Security Testing](#16-security-testing)
17. [Accessibility Testing](#17-accessibility-testing)
18. [CI/CD Integration](#18-cicd-integration)
19. [Test Data Management](#19-test-data-management)
20. [Bug Classification & SLAs](#20-bug-classification--slas)
21. [Future-Proofing](#21-future-proofing)
22. [Appendices](#22-appendices)

---

## Executive Summary

Fenix Life testing prioritizes **simulation integrity** and **long-horizon stability** over superficial coverage metrics.

| Layer | Tool | Coverage Target |
|---|---|---|
| Unit | Vitest | 80% domain + application |
| Integration | Jest + Testcontainers | Critical paths |
| API contract | Supertest + OpenAPI | 100% public endpoints |
| Simulation golden | Vitest | All tick phases |
| E2E | Playwright | Core gameplay loops |
| Load | k6 | API + save sync peak |
| Economy balance | Custom harness | Macro invariants |
| AI behavior | Statistical + scenario | Symmetry validation |

**North-star testing constraints:**

| Constraint | Validation |
|---|---|
| Player and AI follow same rules | Symmetry test suite |
| Saves survive migration | Golden save CI matrix |
| Ticks are deterministic | Checksum golden tests |
| Economy does not collapse in 100 years | Monte Carlo balance runs |
| API contracts stable | OpenAPI diff on PR |

---

# 1. Testing Philosophy

## 1.1 Tests Serve Believability

A passing test suite that allows unrealistic economy collapse or AI player cheating is **worthless**. Tests must encode **design law**, not just code behavior.

## 1.2 Test the Contracts

Priority order:

1. Domain invariants (money never negative without explicit debt)
2. Public API contracts (OpenAPI)
3. Event schemas (backward compatible)
4. Save schema migrations
5. UI flows (E2E)

## 1.3 Flaky Tests Are Bugs

Flaky tests fixed within 48 hours or quarantined with ticket. No permanent `@retry` without root cause fix.

## 1.4 Tests Are Documentation

Test names describe behavior: `should reject loan when credit score below minimum`.

---

# 2. Test Pyramid

```
                    ┌─────────┐
                    │   E2E   │  ~50 scenarios (Playwright)
                    ├─────────┤
                    │  API    │  ~200 contract tests
                    ├─────────┤
                    │ Integr. │  ~150 integration tests
                    ├─────────┤
                    │ Sim/Gold│  ~100 golden + balance
                    ├─────────┤
                    │  Unit   │  ~3000+ unit tests
                    └─────────┘
```

| Layer | Speed | Isolation | When Run |
|---|---|---|---|
| Unit | < 5 min total | Full | Every PR |
| Integration | < 15 min | DB/Redis containers | Every PR |
| Simulation | < 20 min | Seeded RNG | Every PR |
| API contract | < 10 min | Test server | Every PR |
| E2E | < 45 min | Staging-like | Nightly + release |
| Load | < 30 min | Staging | Weekly + pre-release |
| Balance Monte Carlo | Hours | Batch | Weekly |

---

# 3. Toolchain

## 3.1 Tools by Package

| Package | Unit | Integration | E2E |
|---|---|---|---|
| `@fenix/domain` | Vitest | — | — |
| `@fenix/simulation-engine` | Vitest | Vitest + fixtures | — |
| `@fenix/mod-sdk` | Vitest | — | — |
| `@fenix/api` | Jest | Jest + Testcontainers | Supertest |
| `@fenix/client` | Vitest + RTL | — | Playwright |
| Cross-cutting | — | — | Playwright, k6 |

## 3.2 Supporting Libraries

| Library | Purpose |
|---|---|
| `@testing-library/react` | Component tests |
| `msw` | API mocking in client tests |
| `testcontainers` | Postgres, Redis in integration |
| `@faker-js/faker` | Test data generation (not simulation) |
| `fast-check` | Property-based testing (domain) |
| `playwright` | Browser E2E |
| `k6` | Load testing |

## 3.3 Test File Conventions

```
src/
├── loan-approval.service.ts
└── loan-approval.service.spec.ts    # Co-located unit test

tests/
├── e2e/
│   ├── banking.spec.ts
│   └── save-sync.spec.ts
├── fixtures/
│   ├── saves/
│   └── seeds/
└── load/
    └── api-save-sync.js
```

---

# 4. Unit Testing

## 4.1 Scope

Unit tests cover:

- Domain aggregates (pure logic)
- Value objects (`Money`, `CreditScore`)
- Application handlers (mocked repositories)
- Utility functions
- Mod SDK validators

## 4.2 Coverage Targets

| Layer | Line Coverage | Branch Coverage |
|---|---|---|
| `packages/domain` | 90% | 85% |
| `packages/simulation-engine` (domain logic) | 85% | 80% |
| `apps/api/application` | 80% | 75% |
| `apps/client/view-models` | 70% | 65% |
| UI components | 50% (critical paths) | — |

## 4.3 Unit Test Patterns

### Aggregate Behavior

```typescript
describe('BankAccount', () => {
  it('should reject withdrawal exceeding balance', () => {
    const account = BankAccount.create({ balance: Money.ofCents(1000) });
    expect(() => account.withdraw(Money.ofCents(1001)))
      .toThrow(InsufficientFundsError);
  });
});
```

### Property-Based (fast-check)

```typescript
it('ledger entries always balance', () => {
  fc.assert(fc.property(
    fc.array(ledgerEntryArbitrary),
    (entries) => {
      const result = Ledger.post(entries);
      expect(result.totalDebits).toEqual(result.totalCredits);
    }
  ));
});
```

## 4.4 Mocking Rules

| Mock | Allowed |
|---|---|
| Repository interfaces | Yes |
| External APIs (Azure, Steam) | Yes |
| Event bus (unit) | Yes, verify publish |
| Domain aggregates | **No** — test real aggregates |
| Date/time | Yes, inject clock |

---

# 5. Integration Testing

## 5.1 Scope

- Prisma repositories against real PostgreSQL (Testcontainers)
- Redis cache behavior
- BullMQ job enqueue and process
- Blob storage (Azurite emulator)
- Cross-module event handler chains

## 5.2 Testcontainers Setup

```typescript
beforeAll(async () => {
  postgres = await new PostgreSQLContainer('postgres:16').start();
  redis = await new RedisContainer('redis:7').start();
  process.env.DATABASE_URL = postgres.getConnectionUri();
});
```

## 5.3 Critical Integration Paths

| Path | Test |
|---|---|
| Register → login → create save | Full account lifecycle |
| Upload save → download → checksum | Blob round-trip |
| Friend request → accept → message | Social flow |
| Transfer initiate → accept → audit log | Network transfer |
| Report → moderation action | Moderation pipeline |

## 5.4 Database State

Each test runs in transaction rolled back, OR uses fresh schema per suite via `prisma migrate reset --force`.

---

# 6. API Contract Testing

## 6.1 OpenAPI Validation

Every controller endpoint has Supertest test validating:

- Status code
- Response schema (AJV against OpenAPI)
- Auth requirements (401 without token)
- Permission requirements (403 wrong role)

## 6.2 Contract Diff CI

```bash
openapi-diff main.openapi.yaml pr.openapi.yaml --fail-on-breaking
```

Breaking changes block merge unless major version bump.

## 6.3 Example Contract Test

```typescript
describe('POST /v1/saves', () => {
  it('returns 201 with SaveMetadata schema', async () => {
    const res = await request(app)
      .post('/v1/saves')
      .set('Authorization', `Bearer ${token}`)
      .send({ slotName: 'Test Save' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchSchema(saveMetadataSchema);
  });
});
```

## 6.4 WebSocket Contract Tests

Socket.IO client in integration tests verifies:

- Auth rejection without token
- `message:new` delivery on send
- Rate limit `error:rate_limit`

---

# 7. Simulation Testing

## 7.1 Tick Phase Tests

Each tick phase (daily, weekly, monthly, quarterly, yearly) has isolated tests:

| Phase | Key Assertions |
|---|---|
| Daily | Energy recovery, notification generation |
| Weekly | Relationship drift bounds |
| Monthly | Payroll sums, loan payments, P&L |
| Quarterly | Earnings report generation |
| Yearly | Aging, graduation cohorts, archive |

## 7.2 Module Integration Simulation

```typescript
it('should process full monthly tick without invariant violation', async () => {
  const world = await WorldLoader.fromFixture('mid-career-v12');
  await orchestrator.advanceTo(world, '2042-04-01');
  assertWorldInvariants(world);
});
```

## 7.3 Invariant Assertion Library

```typescript
function assertWorldInvariants(world: WorldState): void {
  assertAllLedgerBalanced(world);
  assertCapTablesSumTo100(world);
  assertNoNegativeAge(world);
  assertSimulationDateMonotonic(world);
}
```

## 7.4 Long-Horizon Smoke

Nightly job: advance fixture world 10 in-game years, assert invariants at each year boundary.

---

# 8. Golden Tests & Determinism

## 8.1 Purpose

Verify that given **same seed + same inputs**, simulation produces **identical checksum**.

## 8.2 Golden Test Structure

```
tests/fixtures/saves/
├── early-life-v12.fls
├── mid-career-v12.fls
├── dynasty-v12.fls
└── golden-checksums.json
```

```json
{
  "early-life-v12": {
    "schemaVersion": 12,
    "seed": "0xDEADBEEF",
    "advanceTo": "2005-06-01",
    "expectedChecksum": "sha256:abc..."
  }
}
```

## 8.3 Golden Test CI

On simulation-engine changes:

1. Load each golden save
2. Advance to target date
3. Compare checksum
4. Mismatch → fail with diff report (intentional rule change requires golden update PR)

## 8.4 Replay Tests

Record 1000 player commands from playtest → replay → compare final state checksum.

---

# 9. AI Behavior Testing

## 9.1 Symmetry Tests (Constitution Article I)

| Test | Assertion |
|---|---|
| Loan approval AI vs player | Same credit threshold |
| Promotion criteria | Same performance gates |
| Bankruptcy consequences | Same asset seizure rules |
| Relationship decay | Same rate constants |
| Tax assessment | Same brackets |

```typescript
it('AI citizen and player citizen receive same loan denial at score 550', () => {
  const aiResult = loanService.evaluate(aiCitizenWithScore(550));
  const playerResult = loanService.evaluate(playerCitizenWithScore(550));
  expect(aiResult.approved).toBe(playerResult.approved);
});
```

## 9.2 Statistical AI Tests

Run 10,000 AI citizens for 5 in-game years:

| Metric | Bounds |
|---|---|
| Employment rate | 85%–98% |
| Bankruptcy rate | 1%–8% |
| Marriage rate by 30 | 20%–60% |
| Company founding rate | 2%–15% |

Out-of-bounds → balance review, not auto-fail (configurable thresholds).

## 9.3 Scenario Tests

Scripted AI scenarios:

```yaml
# tests/scenarios/ai-startup-founder.yaml
seed: 0x12345
citizens:
  - id: npc_founder
    personality: { ambition: 0.9, riskTolerance: 0.8 }
advanceMonths: 120
assert:
  - citizen.npc_founder.hasCompany: true
  - citizen.npc_founder.company.valuationMinor: { min: 1000000 }
```

## 9.4 Agent Tier Tests

| Test | Assertion |
|---|---|
| T2 → T1 promotion on hire | Named NPC created |
| T1 → T2 demotion after 2 years no interaction | Statistical representation |
| T3 aggregate counts conserved | Population sum stable |

---

# 10. Economy Balancing Tests

## 10.1 Macro Invariant Tests

Over 100 in-game year Monte Carlo (100 runs):

| Invariant | Bound |
|---|---|
| Inflation annual | -5% to +50% |
| Unemployment | 1% to 30% |
| GDP growth (real) | -10% to +15% annual |
| Bank failure rate | < 5% per decade |
| Stock index | Never zero (floor at 1) |

## 10.2 Sink/Source Balance

```typescript
it('money supply does not grow unbounded over 50 years', async () => {
  const results = await monteCarloEconomy({ years: 50, runs: 50 });
  for (const run of results) {
    expect(run.moneySupplyGrowthAnnual).toBeLessThan(0.25);
  }
});
```

## 10.3 Progression Pacing Tests

| Milestone | Target % of players (simulated) |
|---|---|
| First job by 22 | > 70% |
| First company by 30 | 15%–40% |
| Millionaire by 45 | 5%–20% |
| Bankruptcy at least once | 20%–50% |

## 10.4 Sector Cycle Tests

Verify economy produces recessions and recoveries:

- At least 2 recessions per 100 years
- Recovery within 5 years (median)

## 10.5 Balance Dashboard

Weekly CI publishes HTML report:

- Wealth Gini over time
- Sector employment shares
- Player vs NPC success ratios

---

# 11. Save System Testing

See [26_Save_System.md](./26_Save_System.md) §22.

## 11.1 Golden Save Matrix

| Schema Version | Fixtures | Tests |
|---|---|---|
| v10 | 3 saves | Load, migrate to v12, invariants |
| v11 | 3 saves | Load, migrate to v12 |
| v12 | 5 saves | Load, round-trip serialize |

## 11.2 Chaos Tests

| Scenario | Expected Recovery |
|---|---|
| Kill during local write | Previous autosave loads |
| Corrupt byte in chunk | Recovery ladder activates |
| Dual-device conflict | Conflict UI data correct |
| Migration transform error | Pre-migration backup restored |

## 11.3 Performance Benchmarks

| Operation | Fixture Size | Max Time |
|---|---|---|
| Serialize | 10 MB | 200 ms |
| Deserialize | 10 MB | 2000 ms |
| Migrate v11→v12 | 10 MB | 30 s |
| ZSTD compress | 40 MB raw | 500 ms |

Fail CI if > 20% regression from baseline.

---

# 12. Mod Compatibility Testing

## 12.1 Mod Validation Tests

```typescript
it('should reject mod with out-of-bounds formula', () => {
  const result = validatePackage('./fixtures/mods/bad-economy');
  expect(result.errors).toContainEqual(
    expect.objectContaining({ code: 'FORMULA_OUT_OF_BOUNDS' })
  );
});
```

## 12.2 Mod Simulation Tests

Official sample mods run 12-month golden scenario in CI.

## 12.3 Workshop Top-50 Regression

Weekly: download top 50 subscribed mods, validate + load test.

---

# 13. End-to-End Testing

## 13.1 Playwright Setup

```typescript
// tests/e2e/playwright.config.ts
export default defineConfig({
  testDir: './',
  timeout: 120_000,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
  },
});
```

## 13.2 Core Loop Scenarios

| ID | Scenario | Steps |
|---|---|---|
| E2E-001 | New life month | Create character → advance month → verify stats |
| E2E-002 | Company month | Found company → hire → advance month → payroll |
| E2E-003 | Banking flow | Open account → deposit → apply loan |
| E2E-004 | Save cloud sync | Play → exit → reload from cloud |
| E2E-005 | Stock trade | Buy shares → advance month → verify portfolio |
| E2E-006 | Family event | Marry → child born → verify family tree |
| E2E-007 | Fenix Network gift | Friend → send gift → accept |
| E2E-008 | Character death | Age to death → heir selection |
| E2E-009 | Mod load | Enable mod → verify industry appears |
| E2E-010 | Offline catch-up | Set away → return → digest screen |

## 13.3 E2E Environment

- API against test database (seeded)
- Client dev server or staging build
- Mock Steam in CI (no real Workshop)

## 13.4 Visual Regression (Phase 2)

Percy or Playwright screenshots for key dashboards.

---

# 14. Performance & Load Testing

## 14.1 k6 Scenarios

```javascript
// tests/load/api-save-sync.js
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
};
```

## 14.2 Load Test Targets

| Scenario | VUs | p95 Target |
|---|---|---|
| API read (profile) | 500 | < 100 ms |
| API write (save init) | 100 | < 300 ms |
| Save upload complete | 50 | < 5 s |
| WebSocket connect | 1000 | < 500 ms |
| Leaderboard read | 500 | < 100 ms |

## 14.3 Client Performance Tests

| Metric | Target | Tool |
|---|---|---|
| Monthly tick | < 200 ms | Custom benchmark |
| UI frame rate | 60 FPS | Chrome Performance API |
| Save load | < 2 s | Benchmark fixture |
| Initial load | < 8 s cold | Lighthouse CI |

## 14.4 Simulation Profiling

Dev-only profiler mode logs per-phase timing. Regression if any phase > 2x baseline.

---

# 15. Regression Testing

## 15.1 Regression Suite

On every release candidate:

- Full unit + integration + simulation golden
- Full E2E core loops
- Save migration matrix
- API contract full suite
- Economy Monte Carlo (abbreviated: 20 runs)

## 15.2 Bug Regression Tests

Every fixed bug (severity P1+) requires regression test in same PR or follow-up within 1 sprint.

```typescript
// Regression for FENIX-1234: double payroll on month boundary
it('FENIX-1234: should not apply payroll twice on month boundary tick', ...);
```

## 15.3 Release Checklist

- [ ] Golden checksums updated (if intentional)
- [ ] OpenAPI changelog updated
- [ ] Save migration tested
- [ ] E2E green on staging
- [ ] Load test within thresholds
- [ ] Symmetry tests pass

---

# 16. Security Testing

## 16.1 Automated

| Test | Tool |
|---|---|
| Dependency vulnerabilities | `pnpm audit`, Snyk |
| SAST | CodeQL |
| API auth bypass | Custom Supertest suite |
| IDOR (save access) | Integration tests |
| Rate limit enforcement | k6 + unit |

## 16.2 Manual (Release)

- OWASP top 10 review for API
- Penetration test annually
- Mod malware scan validation

## 16.3 Security Test Cases

| Case | Expected |
|---|---|
| Access other user's save | 403 |
| Transfer without friendship (when required) | 422 |
| Replay expired JWT | 401 |
| Upload save with invalid signature | 409 |
| SQL injection in search | Sanitized, no error |

---

# 17. Accessibility Testing

## 17.1 Automated

- `axe-core` in Playwright E2E
- Fail on critical violations

## 17.2 Manual Checklist (Major releases)

- Keyboard navigation all core screens
- Screen reader labels on forms
- Color contrast WCAG AA
- Reduce motion respects preference

Aligned with Product Bible §18.

---

# 18. CI/CD Integration

## 18.1 PR Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  lint: ...
  typecheck: ...
  unit: ...
  integration: ...
  simulation-golden: ...
  api-contract: ...
  openapi-diff: ...
```

## 18.2 Nightly Pipeline

```yaml
e2e: ...
load-smoke: ...
economy-monte-carlo: ...
workshop-mod-regression: ...
```

## 18.3 Release Pipeline

Full regression + staging deploy + manual QA sign-off + production deploy.

## 18.4 Test Reporting

- Vitest/Jest → JUnit XML → GitHub Checks
- Playwright → HTML report artifact
- Coverage → Codecov (informational, not blocking except domain)

---

# 19. Test Data Management

## 19.1 Fixtures

| Fixture | Location | Purpose |
|---|---|---|
| Golden saves | `tests/fixtures/saves/` | Determinism, migration |
| Seed worlds | `tests/fixtures/seeds/` | Economy Monte Carlo |
| API seed data | `apps/api/test/seed.ts` | Integration tests |
| Mod samples | `examples/mods/` | Mod validation |

## 19.2 Data Generation

- **Simulation tests:** Fixed seeds only (reproducible)
- **API tests:** Faker for names/emails (not simulation logic)
- **Never** random in golden tests without seed

## 19.3 PII in Tests

No real PII. Use `test@fenixlife.internal` domain.

---

# 20. Bug Classification & SLAs

## 20.1 Severity

| Level | Definition | Fix SLA |
|---|---|---|
| P0 | Data loss, security breach, game unplayable | 4 hours |
| P1 | Major feature broken, save corruption risk | 24 hours |
| P2 | Feature degraded, workaround exists | 1 sprint |
| P3 | Minor UI, cosmetic | Backlog |

## 20.2 Save-Related Escalation

Any bug risking save data is **minimum P1** automatically.

---

# 21. Future-Proofing

## 21.1 Planned Test Infrastructure

| Feature | Phase |
|---|---|
| Visual regression | Phase 2 |
| Mutation testing (domain) | Phase 2 |
| Chaos engineering (staging) | Phase 3 |
| ML-based anomaly detection on economy | Phase 3 |

---

# 22. Appendices

## A. Test Naming Convention

```
describe('{UnitUnderTest}', () => {
  describe('{method/scenario}', () => {
    it('should {expected behavior} when {condition}', () => {});
  });
});
```

## B. PR Test Requirements

| Change Type | Required Tests |
|---|---|
| Domain logic | Unit + invariant |
| API endpoint | Contract + integration |
| Simulation rule | Golden + symmetry |
| Save format | Migration + round-trip |
| UI screen | Component or E2E |
| Mod API | Mod SDK validation |

## C. Cross-Reference Index

| Topic | Document |
|---|---|
| Save tests | [26_Save_System.md](./26_Save_System.md) §22 |
| Architecture test layout | [28_Project_Architecture.md](./28_Project_Architecture.md) |
| Coding test standards | [30_Coding_Standards.md](./30_Coding_Standards.md) |

## D. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | QA Engineering | Initial canonical release |

---

*End of Fenix Life Testing Strategy Document v1.0*
