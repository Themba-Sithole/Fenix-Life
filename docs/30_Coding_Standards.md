# Fenix Life — Official Coding Standards Document

**Document Version:** 1.0  
**Status:** Canonical — Engineering Standards Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Principal Engineering & Architecture Council  
**Audience:** Engineering, QA, AI Coding Assistants, Code Reviewers  

---

## Document Authority

This Coding Standards Document defines **how Fenix Life code is written, structured, reviewed, and maintained** for a 10–15 year codebase lifespan. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Symmetry, Citizen Equality |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Development standards (§12) |
| [28_Project_Architecture.md](./28_Project_Architecture.md) | Package boundaries, folder structure |
| [29_Testing_Strategy.md](./29_Testing_Strategy.md) | Test requirements |
| [31_Cursor_AI_Studio.md](./31_Cursor_AI_Studio.md) | AI assistant behavior |

Violations of these standards are **merge blockers** unless documented exception in ADR.

---

## Table of Contents

1. [Standards Philosophy](#1-standards-philosophy)
2. [TypeScript Standards](#2-typescript-standards)
3. [Naming Conventions](#3-naming-conventions)
4. [File & Folder Organization](#4-file--folder-organization)
5. [Clean Architecture Rules](#5-clean-architecture-rules)
6. [Domain-Driven Design Rules](#6-domain-driven-design-rules)
7. [SOLID Principles](#7-solid-principles)
8. [Event-Driven Code Standards](#8-event-driven-code-standards)
9. [API & Controller Standards](#9-api--controller-standards)
10. [Client & UI Standards](#10-client--ui-standards)
11. [Simulation Engine Standards](#11-simulation-engine-standards)
12. [Database & Prisma Standards](#12-database--prisma-standards)
13. [Error Handling](#13-error-handling)
14. [Logging Standards](#14-logging-standards)
15. [Comments & Documentation](#15-comments--documentation)
16. [Imports & Dependencies](#16-imports--dependencies)
17. [Git & Commit Standards](#17-git--commit-standards)
18. [Code Review Checklist](#18-code-review-checklist)
19. [Performance Guidelines](#19-performance-guidelines)
20. [Security Coding Rules](#20-security-coding-rules)
21. [Anti-Patterns Catalog](#21-anti-patterns-catalog)
22. [Appendices](#22-appendices)

---

## Executive Summary

Fenix Life code must be **boring at the infrastructure layer** and **expressive at the domain layer**. Standards enforce:

| Principle | Enforcement |
|---|---|
| Strict TypeScript | `strict: true`, no `any` |
| Clean Architecture layers | ESLint import zones |
| DDD ubiquitous language | Code review |
| No business logic in UI | Architecture review |
| Symmetry for player/AI rules | Dedicated review check |
| Event schema compatibility | CI validation |

---

# 1. Standards Philosophy

## 1.1 Code Is a Liability

Every line must earn its place. Prefer clarity over cleverness. Prefer deletion over accumulation.

## 1.2 Consistency Over Preference

Individual style preferences yield to team standards. Debate happens in ADRs, not PR comments.

## 1.3 Automate Enforcement

ESLint, Prettier, TypeScript, and CI enforce what can be automated. Humans review architecture and design.

## 1.4 Long-Horizon Readability

Code written today will be read in 2036. Name things for **domain concepts**, not implementation details.

---

# 2. TypeScript Standards

## 2.1 Compiler Options (Required)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

## 2.2 Forbidden Patterns

| Pattern | Alternative |
|---|---|
| `any` | Proper type or `unknown` + narrowing |
| `as` casting (except tests) | Type guards, schema validation |
| `// @ts-ignore` | Fix the type error |
| `enum` (TypeScript) | `const` object + union type |
| Non-null assertion `!` | Explicit null check |
| `default export` (domain) | Named exports |

## 2.3 Preferred Patterns

### Discriminated Unions

```typescript
type TransferStatus =
  | { status: 'pending'; createdAt: string }
  | { status: 'accepted'; acceptedAt: string }
  | { status: 'declined'; reason: string };

function handleTransfer(t: TransferStatus): void {
  switch (t.status) {
    case 'pending':
      // ...
      break;
    case 'accepted':
      // ...
      break;
    case 'declined':
      // ...
      break;
    default: {
      const _exhaustive: never = t;
      throw new Error(`Unhandled status: ${(_exhaustive as TransferStatus).status}`);
    }
  }
}
```

### Branded Types

```typescript
type AccountId = string & { readonly __brand: 'AccountId' };
type MoneyCents = number & { readonly __brand: 'MoneyCents' };

function createAccountId(id: string): AccountId {
  return id as AccountId;
}
```

### Result Type (Application Layer)

```typescript
type Result<T, E = DomainError> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

## 2.4 Null Handling

- Prefer `undefined` over `null` in application code
- Database nulls mapped at repository boundary
- Use optional chaining; avoid deep nesting

---

# 3. Naming Conventions

## 3.1 Artifact Naming Table

| Artifact | Convention | Example |
|---|---|---|
| Files | kebab-case | `loan-approval.service.ts` |
| React components | PascalCase file | `BankingDashboard.tsx` |
| Classes | PascalCase | `LoanApprovalService` |
| Interfaces | `I` prefix | `ILoanRepository` |
| Types | PascalCase | `TransferStatus` |
| Functions | camelCase | `calculateNetWorth` |
| Constants | SCREAMING_SNAKE | `MAX_TRANSFER_AMOUNT` |
| Domain events | PascalCase past tense | `LoanApprovedEvent` |
| Event type string | dot.notation | `banking.loan_approved` |
| DB tables | snake_case | `loan_applications` |
| DB columns | snake_case | `created_at` |
| API routes | kebab-case plural | `/loan-applications` |
| ENV vars | SCREAMING_SNAKE | `DATABASE_URL` |
| CSS classes | Tailwind utilities | `text-primary` |
| Test files | `*.spec.ts` / `*.test.ts` | `loan-approval.service.spec.ts` |

## 3.2 Ubiquitous Language

Use Product Bible / Constitution terms in code:

| Domain Term | Code Usage |
|---|---|
| Citizen | `Citizen`, not `Player` (except UI copy) |
| Five Capitals | `FiveCapitals` enum/const |
| Heir generation | `heirGeneration` |
| Fenix Network | `FenixNetwork`, `network` module |
| Living World | `LivingWorldEngine` |
| World Memory | `WorldMemory`, event log |
| Symmetry | `symmetry` in test names for AI/player parity |

## 3.3 Boolean Naming

Prefix with `is`, `has`, `can`, `should`:

```typescript
isApproved: boolean;
hasChildren: boolean;
canAdvanceTime: boolean;
shouldTriggerAutosave: boolean;
```

## 3.4 Async Function Naming

Async functions that return promises: verb prefix, no `Async` suffix.

```typescript
// Good
async function approveLoan(id: LoanId): Promise<Result<Loan>> {}

// Avoid
async function approveLoanAsync() {}
```

---

# 4. File & Folder Organization

## 4.1 One Primary Export Per File

Domain aggregates: one aggregate per file. Large modules split by sub-domain.

## 4.2 File Size Limits

| File Type | Soft Limit | Action |
|---|---|---|
| Domain aggregate | 400 lines | Split sub-entities |
| Service/handler | 300 lines | Extract helpers |
| React component | 250 lines | Split sub-components |
| Test file | 500 lines | Split describe blocks |

## 4.3 Index Barrel Files

`index.ts` re-exports public API only. No logic in barrel files.

```typescript
// features/banking/index.ts
export { BankingDashboard } from './screens/BankingDashboard';
export { useBankAccounts } from './hooks/use-bank-accounts';
// Do NOT export internal utilities
```

## 4.4 Co-location

Tests co-located with source. Types co-located unless shared in `@fenix/domain`.

---

# 5. Clean Architecture Rules

## 5.1 Layer Dependencies

```
Presentation → Application → Domain ← Infrastructure
```

Infrastructure implements domain interfaces. Domain knows nothing outward.

## 5.2 Layer Contents

| Layer | Contains | Must Not Contain |
|---|---|---|
| Domain | Entities, VOs, events, repo interfaces | Prisma, HTTP, React |
| Application | Handlers, use cases, DTOs | SQL, UI components |
| Infrastructure | Prisma repos, Redis, Blob | Business rules |
| Presentation | Controllers, React, Phaser | Direct DB access |

## 5.3 Use Case Pattern

```typescript
// application/commands/approve-loan.handler.ts
@CommandHandler(ApproveLoanCommand)
export class ApproveLoanHandler implements ICommandHandler<ApproveLoanCommand> {
  constructor(
    private readonly loanRepo: ILoanRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: ApproveLoanCommand): Promise<Result<LoanDto>> {
    const loan = await this.loanRepo.findById(command.loanId);
    if (!loan) return err(new NotFoundError('Loan', command.loanId));

    const result = loan.approve(command.approverId);
    if (!result.ok) return result;

    await this.loanRepo.save(loan);
    await this.eventBus.publishAll(loan.pullDomainEvents());
    return ok(LoanDto.fromDomain(loan));
  }
}
```

## 5.4 DTO Mapping

DTOs exist at application boundary. Never expose domain aggregates to API or UI.

```typescript
// Good
return LoanDto.fromDomain(loan);

// Forbidden
return loan; // domain aggregate in controller response
```

---

# 6. Domain-Driven Design Rules

## 6.1 Aggregates

- One aggregate root per consistency boundary
- External references by ID only (not object reference)
- Mutations through aggregate root methods
- Domain events raised inside aggregate

```typescript
class BankAccount {
  approveWithdrawal(amount: Money): Result<void> {
    if (this.balance.lessThan(amount)) {
      return err(new InsufficientFundsError());
    }
    this.balance = this.balance.subtract(amount);
    this.addDomainEvent(new WithdrawalApprovedEvent({ ... }));
    return ok(undefined);
  }
}
```

## 6.2 Value Objects

Immutable, equality by value:

```typescript
class Money {
  private constructor(readonly cents: MoneyCents) {}

  static ofCents(cents: number): Money {
    if (!Number.isInteger(cents)) throw new InvalidMoneyError();
    return new Money(cents as MoneyCents);
  }

  add(other: Money): Money {
    return Money.ofCents(this.cents + other.cents);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }
}
```

## 6.3 Repositories

Interface in domain, implementation in infrastructure:

```typescript
// domain
interface ILoanRepository {
  findById(id: LoanId): Promise<Loan | null>;
  save(loan: Loan): Promise<void>;
}

// infrastructure
class PrismaLoanRepository implements ILoanRepository { ... }
```

## 6.4 Bounded Contexts

No shared mutable models between feature modules. Use contracts:

```typescript
// packages/domain/src/contracts/banking.contract.ts
interface IBankingQuery {
  getAccountBalance(accountId: AccountId): Promise<Money>;
}
```

## 6.5 Domain Events

```typescript
class LoanApprovedEvent implements DomainEvent {
  readonly eventType = 'banking.loan_approved' as const;
  readonly schemaVersion = 1;

  constructor(
    readonly eventId: string,
    readonly aggregateId: string,
    readonly payload: LoanApprovedPayload,
    readonly simulationTime: string,
    readonly realTime: string,
  ) {}
}
```

---

# 7. SOLID Principles

## 7.1 Single Responsibility

Each class/function has one reason to change.

```typescript
// Bad: LoanService does approval + email + credit check
// Good: LoanApprovalService, CreditCheckService, NotificationDispatcher
```

## 7.2 Open/Closed

Extend via data (mod hooks) and events, not modifying core switch statements.

```typescript
// Bad
switch (industry) {
  case 'tech': ...
  case 'healthcare': ...
}

// Good
const industry = ruleRegistry.resolve('industries', industryId);
```

## 7.3 Liskov Substitution

Repository implementations must honor interface contracts. Mock repos in tests must match real behavior.

## 7.4 Interface Segregation

Small focused interfaces:

```typescript
// Bad: ICompanyRepository with 30 methods
// Good: ICompanyReadRepository, ICompanyWriteRepository
```

## 7.5 Dependency Inversion

Depend on abstractions:

```typescript
constructor(private readonly loanRepo: ILoanRepository) {}
// Not: constructor(private readonly prisma: PrismaService) {}
```

---

# 8. Event-Driven Code Standards

## 8.1 Event Naming

| Convention | Example |
|---|---|
| Class name | `CitizenDiedEvent` |
| eventType string | `citizen.died` |
| Past tense | `approved`, not `approve` |

## 8.2 Event Handlers

```typescript
@EventHandler(CitizenDiedEvent)
export class OnCitizenDiedHandler {
  async handle(event: CitizenDiedEvent): Promise<void> {
    if (await this.processedEvents.exists(event.eventId)) return;
    // idempotent logic
    await this.processedEvents.mark(event.eventId);
  }
}
```

## 8.3 No Circular Sync Calls

```typescript
// Bad: CompanyService calls BankingService which calls CompanyService
// Good: Company publishes CompanyFoundedEvent, Banking handler reacts
```

## 8.4 Event Schema Versioning

New fields optional. Never remove fields without deprecation window. `schemaVersion` in payload.

---

# 9. API & Controller Standards

## 9.1 Controller Thin

Controllers validate input, dispatch command, return DTO. No business logic.

```typescript
@Post()
async createSave(@Body() dto: CreateSaveDto, @CurrentUser() user: Account) {
  const result = await this.commandBus.execute(
    new CreateSaveCommand(user.id, dto.slotName),
  );
  if (!result.ok) throw mapToHttpException(result.error);
  return result.value;
}
```

## 9.2 DTO Validation

```typescript
class CreateSaveDto {
  @IsString()
  @MaxLength(100)
  slotName: string;
}
```

## 9.3 HTTP Status Mapping

| Domain Error | HTTP |
|---|---|
| `NotFoundError` | 404 |
| `ValidationError` | 400 |
| `ForbiddenError` | 403 |
| `ConflictError` | 409 |
| `DomainError` (generic) | 422 |

---

# 10. Client & UI Standards

## 10.1 No Business Logic in Components

```typescript
// Bad
function LoanButton() {
  const approve = () => {
    if (creditScore > 700 && debtRatio < 0.4) { ... }
  };
}

// Good
function LoanButton() {
  const { approve, canApprove } = useLoanApproval(); // calls simulation bridge
}
```

## 10.2 View Models

Map simulation state to display values in view-model hooks:

```typescript
function useBankingDashboard() {
  const state = useSimulationSelector(s => s.banking);
  return useMemo(() => ({
    formattedBalance: formatMoney(state.balance),
    accounts: state.accounts.map(AccountRowVm.from),
  }), [state]);
}
```

## 10.3 Component Structure

```typescript
// 1. imports
// 2. types
// 3. component
// 4. sub-components (if small)
// 5. helpers (if tiny and local)
```

## 10.4 React Rules

| Rule | Detail |
|---|---|
| Hooks at top level | No conditional hooks |
| Keys on lists | Stable IDs, not index |
| Memoization | `useMemo`/`useCallback` for expensive only |
| State location | Closest common ancestor |
| Forms | `react-hook-form` + zod |

## 10.5 Styling

- TailwindCSS utility classes
- Design tokens from `theme.css`
- No inline styles except dynamic values
- shadcn/ui components from `components/ui/`

## 10.6 Accessibility

- Semantic HTML
- `aria-label` on icon buttons
- Focus management in dialogs

---

# 11. Simulation Engine Standards

## 11.1 Determinism

```typescript
// Seeded RNG — never Math.random() in simulation
const rng = createRng(worldSeed, tickNumber);
```

## 11.2 Tick Handlers

Pure where possible. Side effects via events.

```typescript
monthlyTick(ctx: TickContext): void {
  const payroll = this.calculatePayroll(ctx.company);
  ctx.publish(new PayrollProcessedEvent({ ... }));
}
```

## 11.3 Symmetry

Player and AI code paths share functions:

```typescript
// Good
evaluateLoanApplicant(citizen: Citizen): LoanDecision;

// Bad
evaluatePlayerLoan(...) / evaluateAiLoan(...) with different rules
```

## 11.4 Performance Hot Paths

- No allocations in inner loops where avoidable
- Typed arrays for agent stats
- Batch DB writes at tick end

---

# 12. Database & Prisma Standards

## 12.1 Prisma Conventions

Per workspace Prisma rules:

- Both sides of relations with `@relation`
- `@id @default(cuid())` or autoincrement
- `createdAt` + `updatedAt` on all tables
- `@@index` on frequently queried fields

## 12.2 Migrations

- One migration per logical change
- Never edit applied migrations
- Data migrations in separate script if complex

## 12.3 Queries

- No raw SQL except performance-critical (documented in ADR)
- Select only needed fields
- Pagination on all list queries

## 12.4 Transactions

Cross-aggregate consistency via transactions in application layer:

```typescript
await this.prisma.$transaction(async (tx) => {
  await this.loanRepo.save(loan, tx);
  await this.ledgerRepo.post(entries, tx);
});
```

---

# 13. Error Handling

## 13.1 Domain Errors

```typescript
class InsufficientFundsError extends DomainError {
  readonly code = 'INSUFFICIENT_FUNDS';
  constructor(readonly accountId: AccountId, readonly requested: Money) {
    super(`Insufficient funds on account ${accountId}`);
  }
}
```

## 13.2 Never Swallow Errors

```typescript
// Bad
try { await save(); } catch (e) { console.log(e); }

// Good
try { await save(); } catch (e) {
  logger.error({ err: e, saveId }, 'Save failed');
  throw new SavePersistenceError('Failed to persist save', { cause: e });
}
```

## 13.3 User-Facing Messages

Map domain errors to player-friendly copy in presentation layer. Never expose stack traces.

---

# 14. Logging Standards

## 14.1 Structured Logging

```typescript
logger.info({
  event: 'tick.completed',
  worldInstanceId,
  durationMs,
  simulationDate,
}, 'Monthly tick completed');
```

## 14.2 Log Levels

| Level | Use |
|---|---|
| `error` | Failures requiring attention |
| `warn` | Degraded, recoverable |
| `info` | Significant business events |
| `debug` | Development only |

## 14.3 Never Log

- Passwords, tokens, encryption keys
- Full save blobs
- Message content (log message ID only)
- PII beyond account ID

---

# 15. Comments & Documentation

## 15.1 When to Comment

| Comment | OK |
|---|---|
| Why (non-obvious business rule) | Yes |
| What (restating code) | No |
| PRD reference for unusual logic | Yes |
| TODO with ticket number | Yes |
| TODO without ticket | No |

```typescript
// Constitution Article I: AI citizens use identical credit thresholds.
// See FENIX-2847 for 2031 recession exception (documented in ADR-0012).
const MIN_CREDIT_SCORE = 580;
```

## 15.2 JSDoc

Public package APIs (`@fenix/domain`, `@fenix/mod-sdk`) require JSDoc on exported functions.

## 15.3 README per Module

Each feature module has `README.md` with:

- Purpose
- Public interfaces
- Events published/consumed
- Dependencies

---

# 16. Imports & Dependencies

## 16.1 Import Order

```typescript
// 1. Node builtins
import { randomUUID } from 'crypto';
// 2. External packages
import { Injectable } from '@nestjs/common';
// 3. @fenix packages
import { Money } from '@fenix/domain';
// 4. Relative imports
import { LoanDto } from './loan.dto';
// 5. Types only
import type { LoanId } from '@fenix/domain';
```

## 16.2 No Inline Imports

All imports at top of file (workspace rule). Exception: documented circular dependency only.

## 16.3 No Deep Imports

```typescript
// Bad
import { Money } from '@fenix/domain/src/value-objects/money';

// Good
import { Money } from '@fenix/domain';
```

---

# 17. Git & Commit Standards

## 17.1 Branch Naming

```
feature/FENIX-1234-loan-approval
fix/FENIX-5678-save-checksum
chore/update-dependencies
```

## 17.2 Commit Messages

```
type(scope): imperative summary

Body explaining why (not what).

Refs: FENIX-1234
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`

## 17.3 PR Size

Target < 400 lines changed. Split large features.

---

# 18. Code Review Checklist

## 18.1 Required Checks

- [ ] Symmetry: player/AI same rules?
- [ ] Layer boundaries respected?
- [ ] Domain events for cross-module effects?
- [ ] Tests included?
- [ ] Migration if schema changed?
- [ ] No business logic in UI?
- [ ] No `any` or `@ts-ignore`?
- [ ] Performance note if hot path?
- [ ] Event schema backward compatible?
- [ ] PRD/constitution alignment?

## 18.2 Review SLAs

| PR Size | Review Within |
|---|---|
| < 200 lines | 1 business day |
| 200–400 lines | 2 business days |
| > 400 lines | Split PR |

---

# 19. Performance Guidelines

## 19.1 Hot Path Identification

Simulation tick, save serialize, API leaderboard read = hot paths. Require benchmark if changed.

## 19.2 Client

- Virtualize lists > 50 items
- Lazy load feature routes
- React.memo only with measured benefit

## 19.3 API

- Cache read models in Redis
- N+1 query prevention via Prisma `include` audit

---

# 20. Security Coding Rules

## 20.1 Input Validation

Validate all external input at boundary. Trust nothing from client simulation for Network actions.

## 20.2 Secrets

Never commit secrets. Use environment variables and Key Vault.

## 20.3 SQL/Command Injection

Prisma parameterized queries only. No string concatenation SQL.

## 20.4 Authorization

Check ownership on every save/account resource access.

---

# 21. Anti-Patterns Catalog

| Anti-Pattern | Fix |
|---|---|
| God class | Split by aggregate |
| Anemic domain model | Behavior in aggregates |
| Primitive obsession | Value objects |
| Shotgun surgery | Events + bounded contexts |
| Feature envy | Move method to owning aggregate |
| Magic numbers | Named constants with PRD ref |
| Stringly typed events | Typed event classes |

---

# 22. Appendices

## A. ESLint Config Summary

- `@typescript-eslint/strict`
- `import/no-restricted-paths` (boundaries)
- `no-console` (warn, allow in scripts)
- `@typescript-eslint/no-explicit-any` (error)

## B. Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

## C. Cross-Reference Index

| Topic | Document |
|---|---|
| Architecture | [28_Project_Architecture.md](./28_Project_Architecture.md) |
| Testing | [29_Testing_Strategy.md](./29_Testing_Strategy.md) |
| AI assistants | [31_Cursor_AI_Studio.md](./31_Cursor_AI_Studio.md) |

## D. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | Engineering Council | Initial canonical release |

---

*End of Fenix Life Coding Standards Document v1.0*
