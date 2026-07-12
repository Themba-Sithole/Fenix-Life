import { describe, expect, it } from 'vitest';
import { createSaveId } from './save-id.js';
import { createFreshStartWorld } from './fresh-start.js';
import { applyPlayerAction } from './player-actions.js';
import { buildChildhoodSummary, getLifePathHintActions } from './onboarding.js';
import { INCORPORATION_FEE_CENTS } from './company.js';

describe('onboarding', () => {
  it('builds childhood summary beats from background', () => {
    const summary = buildChildhoodSummary({
      background: 'orphan',
      lifePath: 'business-founder',
      playerName: 'Alex Chen',
      adolescenceChoices: {
        'step-16-track': 'entrepreneur-track',
        'step-14-activity': 'business-club',
      },
    });

    expect(summary.beats.length).toBeGreaterThanOrEqual(3);
    expect(summary.traitNotes.some((note) => note.includes('Minimal'))).toBe(true);
    expect(summary.traitNotes.some((note) => note.includes('teen years'))).toBe(true);
  });

  it('returns life-path hint routes per GDD §6.3', () => {
    const hints = getLifePathHintActions('market-wizard');
    expect(hints.some((hint) => hint.path === '/stocks')).toBe(true);
    expect(hints.some((hint) => hint.path === '/banking')).toBe(true);
  });

  it('completes childhood onboarding and marks flags', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('onboard-test'),
      playerName: 'Tester',
    });

    expect(world.onboarding.childhoodSummarySeen).toBe(false);

    const next = applyPlayerAction(world, {
      kind: 'COMPLETE_CHILDHOOD_ONBOARDING',
      simulateFirstYear: true,
    });

    expect(next.onboarding.childhoodSummarySeen).toBe(true);
    expect(next.onboarding.firstYearSimulated).toBe(true);
  });

  it('dismisses life path hints', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('hints-test'),
    });

    const next = applyPlayerAction(world, { kind: 'DISMISS_LIFE_PATH_HINTS' });
    expect(next.onboarding.lifePathHintsSeen).toBe(true);
  });

  it('dismisses home tour', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('tour-test'),
    });

    expect(world.onboarding.homeTourCompleted).toBe(false);
    const next = applyPlayerAction(world, { kind: 'DISMISS_HOME_TOUR' });
    expect(next.onboarding.homeTourCompleted).toBe(true);
  });
});

describe('FOUND_COMPANY', () => {
  it('incorporates an idea-stage company and debits the filing fee', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('found-test'),
      playerName: 'Jordan Lee',
      background: 'middle-class',
    });

    const checkingBefore =
      world.banking.accounts.find((a) => a.id === 'checking')!.balanceCents;

    const next = applyPlayerAction(world, {
      kind: 'FOUND_COMPANY',
      name: 'Lee Labs',
    });

    expect(next.company).not.toBeNull();
    expect(next.company!.stage).toBe('idea');
    expect(next.company!.employeeCount).toBe(0);
    expect(next.career.status).toBe('founder');
    expect(next.employees).toHaveLength(0);

    const checkingAfter =
      next.banking.accounts.find((a) => a.id === 'checking')!.balanceCents;
    expect(checkingBefore - checkingAfter).toBe(INCORPORATION_FEE_CENTS);
  });

  it('rejects founding when a company already exists', () => {
    let world = createFreshStartWorld({
      saveId: createSaveId('found-twice'),
      playerName: 'Tester',
    });

    world = applyPlayerAction(world, { kind: 'FOUND_COMPANY', name: 'First Co' });

    expect(() =>
      applyPlayerAction(world, { kind: 'FOUND_COMPANY', name: 'Second Co' }),
    ).toThrow(/already have/i);
  });
});
