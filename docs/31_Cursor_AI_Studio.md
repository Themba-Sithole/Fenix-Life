# Fenix Life — Official Cursor AI Studio Document

**Document Version:** 1.0  
**Status:** Canonical — AI Assistant Operating Manual  
**Last Updated:** July 10, 2026  
**Owner:** Principal Engineering & AI Workflow Architecture  
**Audience:** Cursor AI, GitHub Copilot, Claude, All AI Coding Assistants, Engineering Team  

---

## Document Authority

This Cursor AI Studio Document defines **how AI assistants must behave when working on Fenix Life** — what to read first, what rules are non-negotiable, how to structure work, and how to participate in code review. It is the **primary onboarding document for AI agents**.

It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Product vision — AI must not invent features that violate pillars |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Immutable design law — highest priority for gameplay decisions |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | System architecture |
| [28_Project_Architecture.md](./28_Project_Architecture.md) | Repository structure, package boundaries |
| [30_Coding_Standards.md](./30_Coding_Standards.md) | TypeScript, DDD, SOLID rules |
| [29_Testing_Strategy.md](./29_Testing_Strategy.md) | Required tests per change type |
| [25_API_Design.md](./25_API_Design.md) | API contracts |
| [26_Save_System.md](./26_Save_System.md) | Save system — critical, do not improvise |
| [27_Mod_Framework.md](./27_Mod_Framework.md) | Mod extension rules |

**When AI output conflicts with the Design Constitution, the Constitution wins.**

---

## Table of Contents

1. [AI Mission Statement](#1-ai-mission-statement)
2. [Context Loading Protocol](#2-context-loading-protocol)
3. [AI Roles & Modes](#3-ai-roles--modes)
4. [Non-Negotiable Rules](#4-non-negotiable-rules)
5. [Architecture Compliance](#5-architecture-compliance)
6. [Constitution Compliance Checks](#6-constitution-compliance-checks)
7. [Feature Implementation Workflow](#7-feature-implementation-workflow)
8. [API & Save System Rules for AI](#8-api--save-system-rules-for-ai)
9. [Mod Development Rules for AI](#9-mod-development-rules-for-ai)
10. [UI Implementation Rules for AI](#10-ui-implementation-rules-for-ai)
11. [Testing Requirements for AI](#11-testing-requirements-for-ai)
12. [Documentation Rules for AI](#12-documentation-rules-for-ai)
13. [Code Review Protocol](#13-code-review-protocol)
14. [Prompt Templates](#14-prompt-templates)
15. [Anti-Patterns for AI](#15-anti-patterns-for-ai)
16. [Cursor Configuration](#16-cursor-configuration)
17. [Multi-Agent Workflow](#17-multi-agent-workflow)
18. [Escalation & Human Handoff](#18-escalation--human-handoff)
19. [Quality Checklist](#19-quality-checklist)
20. [Appendices](#20-appendices)

---

## Executive Summary

AI assistants working on Fenix Life are **junior principal engineers with amnesia**. They are capable but must **re-read the law** before every significant task.

```
┌─────────────────────────────────────────────────────────────┐
│                    AI WORKFLOW LOOP                          │
│  1. Load context (this doc + relevant canonical docs)        │
│  2. Identify Product Bible pillar + Constitution article   │
│  3. Plan within architecture boundaries                    │
│  4. Implement minimal correct diff                           │
│  5. Add required tests                                       │
│  6. Self-review against checklist                            │
│  7. Present PR-ready output                                  │
└─────────────────────────────────────────────────────────────┘
```

**AI must never:**

- Invent gameplay rules that favor the player over AI citizens
- Put business logic in React components
- Skip save migration scripts
- Break API contracts without version bump
- Create cross-feature infrastructure imports
- Commit secrets or `.env` files
- Expand scope beyond the user's request

---

# 1. AI Mission Statement

## 1.1 Purpose

AI assistants exist to **accelerate implementation of Fenix Life's vision** — a deep, believable life simulation — while **protecting architectural integrity and design law**.

## 1.2 Success Criteria

AI work is successful when:

1. Code merges without architecture review rejection
2. Symmetry tests pass (player/AI parity)
3. Changes trace to a Product Bible pillar
4. Diff is minimal and focused
5. Tests cover acceptance criteria from PRD
6. No constitution violations introduced

## 1.3 Failure Modes

| Failure | Consequence |
|---|---|
| Player-only shortcut mechanics | Constitution violation — reject |
| God service refactoring | Architecture violation — reject |
| Missing save migration | Data loss risk — reject |
| Over-engineered abstraction | Review rejection — simplify |
| Hallucinated API endpoints | Integration failure — use 25_API_Design.md |

---

# 2. Context Loading Protocol

## 2.1 Before Any Feature Work

AI **must** read (or recall from session) in order:

1. **This document** (`31_Cursor_AI_Studio.md`)
2. **Relevant PRD** in `prd/` or feature spec
3. **Design Constitution** — at minimum the article related to the feature
4. **Project Architecture** — for package/folder placement
5. **Coding Standards** — for naming and patterns
6. **Domain-specific doc** (API, Save, Mod, Testing as applicable)

## 2.2 Context Priority Table

| Task Type | Required Reading |
|---|---|
| New feature screen | Product Bible §5, Constitution, Architecture §9, Coding Standards §10 |
| API endpoint | 25_API_Design.md, Architecture §10, Database DDD |
| Simulation logic | Fenix-Simulation-Framework.md, Constitution Article I, Testing §7-9 |
| Save changes | 26_Save_System.md (full), Testing §11 |
| Mod hook | 27_Mod_Framework.md, Constitution Article I (symmetry) |
| Bug fix | Relevant module README, regression test rules |
| Refactor | Architecture §8, ADRs in `docs/adr/` |

## 2.3 Files AI Should Search First

```
prd/FENIX-LIFE-PRODUCT-BIBLE.md
docs/Fenix-Life-Design-Constitution.md
docs/28_Project_Architecture.md
docs/30_Coding_Standards.md
packages/domain/src/
apps/client/src/features/
apps/api/src/modules/
```

## 2.4 Context Size Management

When context is limited:

1. Read Constitution articles I, II, V (Citizen, Living World, World Memory)
2. Read Architecture dependency rules
3. Read specific section of task-relevant doc
4. **Do not guess** — ask human or read file

---

# 3. AI Roles & Modes

## 3.1 Role Definitions

| Role | Responsibility | Activates When |
|---|---|---|
| **Implementer** | Write code per spec | Default for feature tasks |
| **Reviewer** | Critique diffs against standards | "Review this PR" |
| **Architect** | Propose design within boundaries | "How should we build X?" |
| **Debugger** | Trace failures with evidence | Errors, test failures |
| **Documenter** | Update canonical docs | Explicit doc tasks |
| **Balance Analyst** | Economy/simulation impact | Tuning, AI behavior |

## 3.2 Implementer Mode Rules

- Minimal diff — only change what task requires
- Match existing code style in surrounding files
- No drive-by refactors
- No new dependencies without justification
- Run tests if available

## 3.3 Reviewer Mode Rules

When reviewing code, check in order:

1. Constitution compliance (symmetry, living world)
2. Architecture boundaries
3. Coding standards
4. Test coverage
5. Performance implications
6. Security

Output format:

```
## Summary
[1-2 sentences]

## Critical (must fix)
- ...

## Important (should fix)
- ...

## Suggestions (optional)
- ...

## Constitution Check
- [ ] Symmetry preserved
- [ ] World Memory respected
- [ ] Five Capitals considered
```

## 3.4 Architect Mode Rules

- Present 2-3 options with tradeoffs
- Recommend one aligned with TDD
- Never propose MMO shared world state (Product Bible §9)
- Reference ADR template for significant decisions

---

# 4. Non-Negotiable Rules

## 4.1 Design Law (Constitution)

| Article | AI Rule |
|---|---|
| I — Citizen Philosophy | Player and AI share rules. No hidden player buffs. |
| II — Living World | World continues offline. Do not freeze economy for convenience without explicit tradeoff setting. |
| III — Five Capitals | Features must connect to at least one capital. |
| V — World Memory | Append history, don't overwrite. Events for consequential changes. |
| VIII — Fenix Network | Sovereign instances. No shared mutable world state. |
| IX — Dynamic History | Past facts explain present state. |

## 4.2 Architecture Law

| Rule | Source |
|---|---|
| No business logic in UI | TDD, Coding Standards §10 |
| Dependencies point inward | Architecture §8 |
| Modules communicate via events | TDD §3 |
| Domain has zero framework deps | Architecture §5.1 |
| Client never imports Prisma | Architecture §8.2 |

## 4.3 Save Law

| Rule | Source |
|---|---|
| Schema changes require migration | 26_Save_System.md §13 |
| Never skip migration versions | 26_Save_System.md §13.3 |
| Pre-migration backup mandatory | 26_Save_System.md §13 |
| Autosave non-blocking | 26_Save_System.md §6 |

## 4.4 API Law

| Rule | Source |
|---|---|
| Contract-first | 25_API_Design.md §1.1 |
| Idempotency on retryable writes | 25_API_Design.md §1.4 |
| Validate all inputs | 25_API_Design.md |
| Breaking changes = version bump | 25_API_Design.md §4 |

## 4.5 Git Law

| Rule | Detail |
|---|---|
| No commits unless asked | User rule |
| No force push to main | User rule |
| No secrets in commits | Security |
| No `--no-verify` | User rule |

---

# 5. Architecture Compliance

## 5.1 Package Placement Decision Tree

```
Is it a domain entity, event, or value object?
  → packages/domain/src/{module}/

Is it simulation tick logic?
  → packages/simulation-engine/src/modules/{module}/

Is it a React screen or component?
  → apps/client/src/features/{feature}/

Is it a REST endpoint?
  → apps/api/src/modules/{module}/

Is it a mod schema or validator?
  → packages/mod-sdk/

Is it a shared UI component?
  → packages/ui-kit/
```

## 5.2 Import Validation

Before finishing, AI verifies:

- [ ] No import from another feature's `infrastructure/`
- [ ] No `@prisma/client` in client
- [ ] No `nestjs` in simulation-engine
- [ ] No circular imports introduced

## 5.3 New Module Checklist

When creating a new domain module:

- [ ] Aggregate in `@fenix/domain`
- [ ] Repository interface in domain
- [ ] Simulation tick handler in `simulation-engine`
- [ ] API module (if platform exposure needed)
- [ ] Client feature folder (if UI needed)
- [ ] Events in domain event catalog
- [ ] README in module folder
- [ ] Tests per Testing Strategy matrix

---

# 6. Constitution Compliance Checks

## 6.1 Symmetry Check (Mandatory for Simulation Changes)

Ask before implementing:

> Does this change apply identically to player-controlled citizens and AI citizens?

If NO:

- Is it UI-only affordance (display, not stat)? → OK
- Is it a player advantage? → **STOP. Redesign.**

## 6.2 Living World Check

Ask:

> Does the world continue evolving when the player is away?

If implementing pause/freeze:

- Must be explicit player mode with tradeoff
- Default must remain continuous (Constitution Article II)

## 6.3 Five Capitals Check

For new features, identify:

| Capital | How Feature Connects |
|---|---|
| Financial | |
| Human | |
| Social | |
| Business | |
| Legacy | |

At least one must be non-trivial.

## 6.4 World Memory Check

For state changes:

> Will we need to know this happened in 10 in-game years?

If YES → emit domain event, append to history.

---

# 7. Feature Implementation Workflow

## 7.1 Standard Workflow

```
Step 1: UNDERSTAND
  - Read PRD acceptance criteria
  - Identify pillar(s) served
  - List constitution articles

Step 2: LOCATE
  - Search existing code for similar patterns
  - Identify affected packages

Step 3: PLAN
  - List files to create/modify
  - Identify events, migrations, API changes
  - Present plan if task is large (>3 files)

Step 4: IMPLEMENT
  - Domain first (aggregates, events)
  - Application handlers
  - Infrastructure (repos)
  - Presentation (UI/controllers)
  - Minimal diff

Step 5: TEST
  - Unit tests for domain logic
  - Integration/contract if API
  - Golden if simulation rule change

Step 6: VERIFY
  - Run quality checklist (§19)
  - Self-review as Reviewer role
```

## 7.2 PRD Traceability Comment

For significant features, add code comment linking to PRD:

```typescript
// PRD: Banking v2 §3.2 — Loan amortization schedule
// Pillar: Financial Literacy (Product Bible §4)
```

## 7.3 Scope Control

| User Request | AI Behavior |
|---|---|
| "Fix this bug" | Fix only the bug + regression test |
| "Add feature X" | Feature X only, not X + Y |
| "Refactor this file" | That file only |
| "Improve performance" | Profile-guided, not speculative |

---

# 8. API & Save System Rules for AI

## 8.1 API Implementation

When adding endpoints:

1. Check `25_API_Design.md` — endpoint may already be specified
2. If new endpoint needed, follow URL conventions (`/v1/{service}/{resource}`)
3. Add OpenAPI decorators to controller
4. Regenerate `@fenix/api-contracts`
5. Add Supertest contract test
6. Update `25_API_Design.md` if canonical change (or flag for human)

## 8.2 API Response Shape

Always use standard error model:

```json
{ "error": { "code": "...", "message": "...", "requestId": "..." } }
```

## 8.3 Save System Implementation

**CRITICAL:** AI must read `26_Save_System.md` before any save work.

| Change | Required Actions |
|---|---|
| New field in save | Bump `schemaVersion`, write migration, golden save test |
| New chunk type | Update serializer, migration, format docs |
| Compression change | Benchmark, update §7 in save doc |
| Sync logic change | Integration test, conflict scenario test |

## 8.4 Save Migration Template

```typescript
// packages/simulation-engine/src/migrations/v12-to-v13.ts
export const migrationV12ToV13: SaveMigration = {
  fromVersion: 12,
  toVersion: 13,
  description: 'Add healthInsurance field to citizen aggregate',
  transform(save: SavePackage): SavePackage {
    // idempotent transform
  },
  validate(result: SavePackage): ValidationResult {
    // invariant checks
  },
};
```

---

# 9. Mod Development Rules for AI

## 9.1 Engine Extension vs Mod

| Need | Solution |
|---|---|
| New industry for official game | Data pack + possibly engine hook |
| One-off custom content | Mod |
| Bug fix in core rules | Engine code, not mod |

## 9.2 Symmetry in Mods

When helping mod authors or creating sample mods:

- Set `aiEligible: true` unless cosmetic only
- Include `aiUtility` on decision options
- Include `aiFoundingWeight` on industries

## 9.3 Mod Validation

Run `fenix-mod validate` before suggesting mod is complete.

---

# 10. UI Implementation Rules for AI

## 10.1 Diegetic Design

UI must look like **professional in-world software** (banking apps, dashboards, phones) — Product Bible §3.5.

| Screen Type | Reference |
|---|---|
| Banking | Modern neobank UI |
| Company | ERP/HR dashboard |
| Stock | Bloomberg-lite |
| Phone | iOS/Android hybrid |
| News | News aggregator |

## 10.2 Component Reuse

Before creating new component:

1. Check `apps/client/src/app/components/ui/` (shadcn)
2. Check `packages/ui-kit/`
3. Check existing feature components

## 10.3 Simulation Bridge

UI commands go through bridge:

```typescript
// Good
simulationBridge.dispatch({ type: 'APPLY_FOR_LOAN', payload: { amount } });

// Bad
simulationState.banking.balance += amount; // direct mutation
```

## 10.4 Tailwind Standards

- Use design tokens from `theme.css`
- Responsive by default (mobile not primary but supported)
- No arbitrary magic numbers without token

---

# 11. Testing Requirements for AI

## 11.1 Minimum Tests per Change

| Change | Required Test |
|---|---|
| Domain aggregate method | Unit test |
| Simulation rule | Golden or scenario test |
| API endpoint | Contract test |
| Save schema | Migration + round-trip |
| Bug fix | Regression test (FENIX-XXXX) |
| UI critical path | E2E or component test |

## 11.2 AI Must Run Tests

When terminal available:

```bash
pnpm test --filter @fenix/domain
pnpm test --filter @fenix/simulation-engine
pnpm test --filter @fenix/api
```

Report results to user.

## 11.3 Test Naming

```typescript
it('should deny loan when credit score below minimum (symmetry: AI same rule)', () => {});
```

---

# 12. Documentation Rules for AI

## 12.1 When to Update Docs

| Change | Update |
|---|---|
| New API endpoint | 25_API_Design.md |
| Save format change | 26_Save_System.md |
| New mod hook | 27_Mod_Framework.md |
| New package/folder | 28_Project_Architecture.md |
| New test category | 29_Testing_Strategy.md |
| New coding rule | 30_Coding_Standards.md |
| AI workflow change | This document |

## 12.2 When NOT to Create Docs

- Do not create README/docs unless user asks
- Do not create ADR unless architect mode and significant decision
- Prefer updating canonical docs over new random markdown files

## 12.3 Canonical Doc Format

```markdown
# Fenix Life — Official {Title}

**Document Version:** 1.0
**Status:** Canonical
**Last Updated:** {date}
**Owner:** {team}
**Audience:** {audience}

## Document Authority
...

---
```

---

# 13. Code Review Protocol

## 13.1 AI Self-Review Before Presenting Code

Run checklist from §19. Fix critical items before showing user.

## 13.2 AI Reviewing Human PRs

Use Reviewer mode output format (§3.3). Cite specific files and lines. Reference constitution articles when flagging design issues.

## 13.3 Severity Classification

| Severity | Examples |
|---|---|
| **Blocker** | Constitution violation, data loss risk, security hole |
| **Major** | Architecture boundary break, missing migration |
| **Minor** | Naming, missing test for edge case |
| **Nit** | Style preference |

## 13.4 Symmetry Review Template

```markdown
### Symmetry Review
- Rule changed: [description]
- Player path: [file:line]
- AI path: [file:line]
- Identical: [yes/no]
- If no, justification: [must be UI-only affordance]
```

---

# 14. Prompt Templates

## 14.1 Feature Implementation Prompt

```
Implement [FEATURE] for Fenix Life.

Before coding:
1. Read prd/[relevant-prd].md acceptance criteria
2. Read Design Constitution Article [X]
3. Follow 28_Project_Architecture.md package boundaries
4. Follow 30_Coding_Standards.md

Requirements:
- [list from PRD]

Constraints:
- Symmetry: player and AI share rules
- No business logic in React
- Include tests per 29_Testing_Strategy.md

Output: minimal diff, list of files changed, test commands run.
```

## 14.2 Bug Fix Prompt

```
Fix bug [FENIX-XXXX]: [description]

1. Reproduce from description
2. Find root cause (not symptom)
3. Minimal fix
4. Add regression test named FENIX-XXXX
5. Verify symmetry not broken
```

## 14.3 API Endpoint Prompt

```
Add API endpoint per 25_API_Design.md §[section]:
[path and method]

Include:
- Controller + DTO + handler
- OpenAPI decorators
- Supertest contract test
- Update api-contracts generation
```

## 14.4 Save Migration Prompt

```
Add save migration v[N] → v[N+1] per 26_Save_System.md:
[description of schema change]

Include:
- Migration transform (idempotent)
- Validation function
- Golden save fixture update
- Pre-migration backup compatibility
```

## 14.5 Review Prompt

```
Review this diff as Fenix Life Reviewer per 31_Cursor_AI_Studio.md §3.3.
Check constitution, architecture, tests, security.
```

---

# 15. Anti-Patterns for AI

## 15.1 Code Anti-Patterns

| AI Tendency | Correct Behavior |
|---|---|
| Create `utils.ts` god file | Put helpers in owning module |
| Add `any` to silence errors | Fix types properly |
| Implement feature without reading PRD | Read PRD first |
| Copy-paste boilerplate across modules | Extract to @fenix/domain if shared |
| Add lodash for one function | Inline or native |
| Create abstract factory for one implementation | YAGNI |

## 15.2 Design Anti-Patterns

| AI Tendency | Correct Behavior |
|---|---|
| "Give player 2x income for fun" | Constitution violation |
| "Simplify by removing AI competition" | Living World violation |
| "Store everything in one JSON blob" | Use proper aggregates |
| "Real-time multiplayer sync" | Fenix Network async contracts |

## 15.3 Process Anti-Patterns

| AI Tendency | Correct Behavior |
|---|---|
| Commit without being asked | Wait for user |
| 500-line unsolicited refactor | Minimal diff |
| Create 5 doc files | Update canonical docs only if needed |
| Guess API shape | Read 25_API_Design.md |
| Skip tests "for speed" | Tests are mandatory |

---

# 16. Cursor Configuration

## 16.1 Recommended `.cursor/rules`

Create rules pointing to canonical docs:

```markdown
---
description: Fenix Life core constraints
alwaysApply: true
---

# Fenix Life AI Rules

1. Read docs/31_Cursor_AI_Studio.md before feature work
2. Design Constitution is immutable law
3. No business logic in React components
4. Player and AI citizens share simulation rules (Symmetry)
5. Save changes require migration per docs/26_Save_System.md
6. Follow docs/30_Coding_Standards.md naming and DDD patterns
7. Minimal diff — no drive-by refactors
8. Do not commit unless user asks
```

## 16.2 `guidelines/Guidelines.md`

Should contain project-specific UI rules:

- Tailwind + shadcn/ui
- Diegetic professional UI aesthetic
- 14px base font
- Feature-first folder structure

## 16.3 Indexed Docs

Ensure Cursor indexes:

```
docs/*.md
prd/*.md
packages/domain/src/
```

## 16.4 MCP Tools

When available:

- Prisma MCP for schema inspection
- Use `GetMcpTools` before MCP calls
- Do not guess database schema

---

# 17. Multi-Agent Workflow

## 17.1 Task Decomposition

Large features split across agents:

| Agent | Scope |
|---|---|
| Agent A | Domain + simulation |
| Agent B | API + infrastructure |
| Agent C | Client UI |
| Agent D | Tests |
| Reviewer Agent | Cross-cutting review |

## 17.2 Handoff Format

```markdown
## Handoff: [Feature] — Domain Complete

### Files changed
- packages/domain/src/banking/...

### Events added
- banking.loan_restructured

### Interface for next agent
- IBankingQuery.getRestructureOptions(saveId, loanId)

### Constitution check
- [x] Symmetry verified

### Tests
- packages/domain/src/banking/loan.spec.ts (passing)
```

## 17.3 Conflict Resolution

If agents produce conflicting approaches, Architect role human (or lead agent) decides per TDD.

---

# 18. Escalation & Human Handoff

## 18.1 When AI Must Stop and Ask

| Situation | Action |
|---|---|
| Constitution conflict | Ask human for ADR exception |
| Breaking API change needed | Ask human for version strategy |
| Save format breaking change | Ask human — high risk |
| Security-sensitive change | Flag for human security review |
| PRD ambiguous | Ask human, don't assume |
| Missing PRD for large feature | Ask human to confirm scope |

## 18.2 Escalation Message Template

```
⚠️ Escalation Required

**Issue:** [description]
**Constitution/PRD reference:** [article/section]
**Options:**
1. [option A — aligned with constitution]
2. [option B — requires exception]

**Recommendation:** [A/B with rationale]

Awaiting human decision before proceeding.
```

---

# 19. Quality Checklist

## 19.1 Pre-Completion Checklist

AI copies this into response for non-trivial tasks:

```
### Fenix Life Quality Checklist

**Product**
- [ ] Traces to Product Bible pillar: ___
- [ ] Constitution articles checked: ___

**Architecture**
- [ ] Files in correct packages
- [ ] No forbidden imports
- [ ] Events for cross-module effects

**Code**
- [ ] No `any` or `@ts-ignore`
- [ ] Naming per Coding Standards
- [ ] No business logic in UI

**Symmetry**
- [ ] Player/AI same rules (or UI-only exception documented)

**Persistence**
- [ ] Migration if save schema changed
- [ ] API contract if endpoint changed

**Tests**
- [ ] Unit tests added
- [ ] Tests run: [pass/fail]

**Scope**
- [ ] Minimal diff, no unrelated changes
- [ ] No secrets committed
```

---

# 20. Appendices

## A. Document Map for AI

| Question | Read |
|---|---|
| What are we building? | Product Bible |
| What is allowed? | Design Constitution |
| How is code organized? | 28_Project_Architecture.md |
| How do I name things? | 30_Coding_Standards.md |
| What API exists? | 25_API_Design.md |
| How do saves work? | 26_Save_System.md |
| How do mods work? | 27_Mod_Framework.md |
| What tests to write? | 29_Testing_Strategy.md |
| How should I behave? | This document |

## B. Quick Reference — Package Imports

```
✅ apps/client → @fenix/domain, @fenix/simulation-engine, @fenix/ui-kit
✅ apps/api → @fenix/domain, @fenix/simulation-engine
✅ simulation-engine → @fenix/domain
❌ domain → anything external
❌ client → @prisma/client
❌ features/A → features/B/infrastructure
```

## C. Quick Reference — Constitution Articles

| Article | Topic |
|---|---|
| I | Citizen Equality / Symmetry |
| II | Living World |
| III | Five Capitals |
| V | World Memory |
| VIII | Fenix Network |
| IX | Dynamic History |
| X | Expansion Philosophy |

## D. Example AI Session (Good)

**User:** Add loan restructuring feature.

**AI:**
1. Reads `prd/banking-v2.md` — acceptance criteria: player can restructure once per loan per year
2. Reads Constitution I — symmetry check planned
3. Plans: `Loan` aggregate method, event `LoanRestructured`, banking feature UI
4. Implements domain → handler → UI
5. Adds symmetry test + unit tests
6. Presents checklist — all pass
7. Does NOT commit unless asked

## E. Example AI Session (Bad)

**User:** Add loan restructuring.

**AI:**
- Adds `restructureLoan()` only on player path ❌
- Puts approval logic in React component ❌
- Creates `utils/helpers.ts` with 200 lines ❌
- No tests ❌
- Commits without asking ❌

## F. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-10 | AI Workflow Architecture | Initial canonical release |

---

## Final Instruction to AI Assistants

You are building **the deepest life simulation ever made**. Every shortcut degrades player trust. Every symmetry violation breaks the illusion of a living world. Every save migration mistake destroys a decade of legacy.

**Read the law. Write the minimal correct code. Test it. Respect the world.**

---

*End of Fenix Life Cursor AI Studio Document v1.0*
