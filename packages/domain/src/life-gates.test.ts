import { describe, expect, it } from 'vitest';
import {
  applyMonthlyLoanPayment,
  applyWorldImpact,
  canAdvanceTime,
  createLoan,
  createSaveId,
  createWorldInstance,
  deriveBlockingGates,
  districtCooldownRemaining,
  applyDistrictVisit,
  applyPlayerAction,
  LOAN_DEFAULT_AFTER_MISSES,
  RAISE_COOLDOWN_TICKS,
  RAISE_MIN_MONTHS,
  RAISE_MIN_PERFORMANCE,
} from './index.js';

function richWorld() {
  const world = createWorldInstance({
    saveId: createSaveId('bitlife-gates'),
    playerName: 'Tester',
  });
  return {
    ...world,
    banking: {
      ...world.banking,
      accounts: world.banking.accounts.map((account) =>
        account.id === 'checking' ? { ...account, balanceCents: 50_000_00 } : account,
      ),
    },
  };
}

describe('life gates', () => {
  it('blocks advance on loan default', () => {
    let world = richWorld();
    const loan = createLoan(10_000_00, 650);
    world = {
      ...world,
      banking: {
        ...world.banking,
        accounts: world.banking.accounts.map((account) =>
          account.id === 'checking' ? { ...account, balanceCents: 0 } : account,
        ),
        activeLoan: { ...loan, missedPayments: LOAN_DEFAULT_AFTER_MISSES - 1, status: 'delinquent' },
      },
    };

    const result = applyMonthlyLoanPayment(world.banking, world.currentDate);
    world = { ...world, banking: result.banking };
    expect(result.defaulted).toBe(true);
    expect(world.banking.activeLoan?.status).toBe('defaulted');

    const gates = deriveBlockingGates(world);
    expect(gates.some((gate) => gate.kind === 'loan_default' && gate.severity === 'hard')).toBe(true);
    expect(canAdvanceTime(world)).toBe(false);
  });

  it('rejects raise during cooldown', () => {
    let world = richWorld();
    world = {
      ...world,
      career: {
        ...world.career,
        status: 'employed',
        monthlySalaryCents: 5_000_00,
        performanceScore: RAISE_MIN_PERFORMANCE + 5,
        monthsInRole: RAISE_MIN_MONTHS + 1,
        lastRaiseTick: world.clock.tickCount,
      },
      clock: { ...world.clock, tickCount: 10 },
    };

    expect(() =>
      applyPlayerAction(world, { kind: 'CAREER_REQUEST_RAISE' }),
    ).toThrow(/cooldown/i);

    world = {
      ...world,
      career: {
        ...world.career,
        lastRaiseTick: world.clock.tickCount - RAISE_COOLDOWN_TICKS - 1,
      },
    };
    const next = applyPlayerAction(world, { kind: 'CAREER_REQUEST_RAISE' });
    expect(next.career.lastRaiseTick).toBe(world.clock.tickCount);
  });

  it('news impact mutates expenses', () => {
    const world = richWorld();
    const before = world.banking.monthlyExpensesCents || 1_800_00;
    const withExpenses = {
      ...world,
      banking: { ...world.banking, monthlyExpensesCents: before },
    };
    const next = applyWorldImpact(withExpenses, 'expense_spike', 10);
    expect(next.banking.monthlyExpensesCents).toBeGreaterThan(before);
    expect(next.economy.expenseMultiplier ?? 1).toBeGreaterThan(1);
  });

  it('district visit has cooldown', () => {
    let world = richWorld();
    const first = applyDistrictVisit(world, 'cafe');
    world = first.world;
    expect(districtCooldownRemaining(world, 'cafe')).toBeGreaterThan(0);
    expect(() => applyDistrictVisit(world, 'cafe')).toThrow(/ready in/i);
  });
});
