import type { WorldInstance } from './world-instance.js';

/** Action kinds that can resolve a life gate (mirrors PlayerAction.kind subset). */
export type LifeGateResolveAction =
  | 'ACCEPT_HEIR'
  | 'PAY_LOAN'
  | 'RESTRUCTURE_LOAN'
  | 'SETTLE_LOAN'
  | 'CAREER_UPSKILL'
  | 'CAREER_QUIT'
  | 'EDUCATION_PAY_TUITION'
  | 'EDUCATION_DROP_OUT'
  | 'FILE_TAXES'
  | 'PAY_TAX_BALANCE'
  | 'TREAT_ILLNESS'
  | 'IGNORE_ILLNESS';

/** BitLife-style blocking crises that pause free time advance until resolved. */
export type LifeGateKind =
  | 'loan_default'
  | 'loan_delinquent'
  | 'pip_active'
  | 'tuition_overdue'
  | 'death_pending'
  | 'tax_filing_overdue'
  | 'illness_pending';

export type LifeGateSeverity = 'soft' | 'hard';

export interface LifeGate {
  readonly kind: LifeGateKind;
  readonly severity: LifeGateSeverity;
  readonly message: string;
  /** PlayerAction kinds that can clear or progress this gate. */
  readonly resolveActions: readonly LifeGateResolveAction[];
  /** Optional deep-link route for the client. */
  readonly route?: string;
}

export const LIFE_GATE_BLOCK_MESSAGE =
  'Resolve this crisis before time moves forward.';

/**
 * Derives active life gates from world state. Prefer derivation over stale caches
 * so gates always match domain truth.
 */
export function deriveBlockingGates(world: WorldInstance): readonly LifeGate[] {
  const gates: LifeGate[] = [];

  if (world.deathPending) {
    gates.push({
      kind: 'death_pending',
      severity: 'hard',
      message: `${world.deathPending.deceasedName} has passed away — choose an heir to continue`,
      resolveActions: ['ACCEPT_HEIR'],
      route: '/death',
    });
  }

  const loan = world.banking.activeLoan;
  if (loan) {
    if (loan.status === 'defaulted') {
      gates.push({
        kind: 'loan_default',
        severity: 'hard',
        message: `Loan in default — ${(loan.remainingCents / 100).toLocaleString()} remaining. Pay, restructure, or settle before advancing.`,
        resolveActions: ['PAY_LOAN', 'RESTRUCTURE_LOAN', 'SETTLE_LOAN'],
        route: '/banking',
      });
    } else if (loan.status === 'delinquent' || (loan.missedPayments ?? 0) >= 1) {
      gates.push({
        kind: 'loan_delinquent',
        severity: 'soft',
        message: `Loan payment missed (${loan.missedPayments ?? 1}×) — credit and collections risk rising`,
        resolveActions: ['PAY_LOAN'],
        route: '/banking',
      });
    }
  }

  if (world.career.pipActive && world.career.pipDaysRemaining <= 7) {
    gates.push({
      kind: 'pip_active',
      severity: 'soft',
      message: `Performance improvement plan — ${world.career.pipDaysRemaining} days left before termination risk`,
      resolveActions: ['CAREER_UPSKILL', 'CAREER_QUIT'],
      route: '/career',
    });
  }

  if (world.education.enrolled && world.education.tuitionDueCents > 0) {
    const overdueDays = world.education.tuitionOverdueDays ?? 0;
    const pastGrace = overdueDays > 14;
    gates.push({
      kind: 'tuition_overdue',
      severity: pastGrace ? 'hard' : 'soft',
      message: pastGrace
        ? `Tuition overdue — ${(world.education.tuitionDueCents / 100).toLocaleString()} owed past grace. Pay before advancing.`
        : `Tuition balance due — ${(world.education.tuitionDueCents / 100).toLocaleString()} outstanding`,
      resolveActions: ['EDUCATION_PAY_TUITION', 'EDUCATION_DROP_OUT'],
      route: '/education',
    });
  }

  if (world.civic?.taxFilingOverdue) {
    gates.push({
      kind: 'tax_filing_overdue',
      severity: 'hard',
      message: 'Annual tax filing ignored — resolve refund/owe before time advances',
      resolveActions: ['FILE_TAXES', 'PAY_TAX_BALANCE'],
      route: '/phone',
    });
  }

  if (world.civic?.pendingIllness) {
    gates.push({
      kind: 'illness_pending',
      severity: 'soft',
      message: world.civic.pendingIllness.description,
      resolveActions: ['TREAT_ILLNESS', 'IGNORE_ILLNESS'],
      route: '/phone',
    });
  }

  return gates;
}

export function hardGates(gates: readonly LifeGate[]): readonly LifeGate[] {
  return gates.filter((gate) => gate.severity === 'hard');
}

export function hasHardBlockingGate(world: WorldInstance): boolean {
  return hardGates(deriveBlockingGates(world)).length > 0;
}

/** Whether advancing the day/clock is allowed. Death always blocks. */
export function canAdvanceTime(world: WorldInstance): boolean {
  if (world.clock.paused && world.deathPending) {
    return false;
  }
  return !hasHardBlockingGate(world);
}

export function advanceBlockedReason(world: WorldInstance): string | null {
  const hard = hardGates(deriveBlockingGates(world));
  if (hard.length === 0) {
    return null;
  }
  return `${hard[0]!.message} — ${LIFE_GATE_BLOCK_MESSAGE}`;
}

export function isGateResolvingAction(
  world: WorldInstance,
  actionKind: string,
): boolean {
  return deriveBlockingGates(world).some((gate) =>
    (gate.resolveActions as readonly string[]).includes(actionKind),
  );
}
