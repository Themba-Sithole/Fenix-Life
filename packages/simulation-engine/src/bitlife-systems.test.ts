import { describe, expect, it } from 'vitest';
import {
  createSaveId,
  createWorldInstance,
  educationCompleted,
  FAIL_TERM_GPA,
  TERM_LENGTH_DAYS,
} from '@fenix/domain';
import { applyDailyEducationTick } from './education-engine.js';
import { buildWhileYouWereAwaySummary, runCatchUpTicks } from './catch-up.js';
import { runDailyTick } from './tick-orchestrator.js';

function baseWorld() {
  return createWorldInstance({
    saveId: createSaveId('edu-catchup'),
    playerName: 'Scholar',
  });
}

describe('education engine', () => {
  it('fails a term when GPA collapses', () => {
    let world = baseWorld();
    world = {
      ...world,
      education: {
        ...world.education,
        enrolled: true,
        programName: 'Undergraduate Degree',
        institution: 'City University',
        creditsRequired: 120,
        creditsCompleted: 40,
        gpa: FAIL_TERM_GPA - 0.3,
        termDaysElapsed: TERM_LENGTH_DAYS - 1,
        tuitionDueCents: 5_000_00,
        failedTerms: 0,
      },
      player: {
        ...world.player,
        traits: { ...world.player.traits, energy: 20 },
      },
    };

    world = applyDailyEducationTick(world);
    expect(world.education.failedTerms).toBeGreaterThanOrEqual(1);
    expect(world.education.probation).toBe(true);
  });

  it('graduates when credits and GPA clear', () => {
    let world = baseWorld();
    world = {
      ...world,
      education: {
        ...world.education,
        enrolled: true,
        programName: 'Trade Skills Program',
        institution: 'Community College',
        creditsRequired: 60,
        creditsCompleted: 60,
        gpa: 3.2,
        tuitionDueCents: 0,
        credentials: [],
      },
    };

    world = applyDailyEducationTick(world);
    expect(world.education.enrolled).toBe(false);
    expect(educationCompleted({ ...world.education, enrolled: false, creditsCompleted: 60 })).toBe(
      true,
    );
    expect(world.education.credentials.some((c) => c.name.includes('Trade'))).toBe(true);
  });
});

describe('catch-up respects gates', () => {
  it('stops catch-up when hard gate is active', () => {
    let world = baseWorld();
    world = {
      ...world,
      banking: {
        ...world.banking,
        activeLoan: {
          id: 'loan-1',
          principalCents: 10_000_00,
          remainingCents: 9_000_00,
          monthlyPaymentCents: 500_00,
          apr: 0.12,
          missedPayments: 3,
          status: 'defaulted',
          collectionsFeeCents: 720_00,
        },
      },
    };

    const after = runCatchUpTicks(world, 10);
    expect(after.clock.tickCount).toBe(world.clock.tickCount);

    const summary = buildWhileYouWereAwaySummary(world, world.events, 10);
    expect(summary.summary.daysSimulated).toBe(0);
    expect(summary.summary.unresolvedGates.length).toBeGreaterThan(0);
  });

  it('advances when no hard gate', () => {
    const world = baseWorld();
    const after = runDailyTick(world);
    expect(after.clock.tickCount).toBe(world.clock.tickCount + 1);
  });
});
