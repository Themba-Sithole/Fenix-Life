import { describe, expect, it } from 'vitest';
import { createSaveId } from './save-id.js';
import { createFreshStartWorld } from './fresh-start.js';
import { applyPlayerAction } from './player-actions.js';
import {
  applyAdolescenceChoice,
  getAdolescenceSteps,
  getNextAdolescenceStep,
  isAdolescencePlayComplete,
} from './adolescence-play.js';

describe('adolescence play', () => {
  it('returns four steps for any life path', () => {
    const steps = getAdolescenceSteps('undecided');
    expect(steps).toHaveLength(5);
    expect(steps[0]?.age).toBe(13);
    expect(steps[4]?.age).toBe(17);
  });

  it('advances through choices and completes play', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('teen-play'),
      playerName: 'Teen Tester',
    });

    expect(world.onboarding.adolescencePlayCompleted).toBe(false);

    const steps = getAdolescenceSteps(world.lifePath);
    let current = world;

    for (const step of steps) {
      const nextStep = getNextAdolescenceStep(steps, current.onboarding.adolescenceChoices);
      expect(nextStep?.id).toBe(step.id);

      current = applyAdolescenceChoice(current, step.id, step.choices[0]!.id);
      expect(current.onboarding.adolescenceChoices[step.id]).toBe(step.choices[0]!.id);
    }

    expect(isAdolescencePlayComplete(current.onboarding.adolescenceChoices)).toBe(true);
    expect(current.onboarding.adolescencePlayCompleted).toBe(true);
  });

  it('applies via player action', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('teen-action'),
    });

    const next = applyPlayerAction(world, {
      kind: 'APPLY_ADOLESCENCE_CHOICE',
      stepId: 'step-14-activity',
      choiceId: 'coding-club',
    });

    expect(next.onboarding.adolescenceChoices['step-14-activity']).toBe('coding-club');
    expect(next.career.performanceScore).toBeGreaterThan(world.career.performanceScore);
  });

  it('rejects duplicate choices for the same step', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('teen-dup'),
    });

    const once = applyAdolescenceChoice(world, 'step-14-activity', 'sports');
    expect(() =>
      applyAdolescenceChoice(once, 'step-14-activity', 'arts'),
    ).toThrow(/already been decided/i);
  });

  it('skips adolescence with life-path defaults', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('teen-skip'),
      lifePath: 'corporate-ladder',
    });

    const next = applyPlayerAction(world, { kind: 'SKIP_ADOLESCENCE_PLAY' });

    expect(next.onboarding.adolescencePlayCompleted).toBe(true);
    expect(next.onboarding.adolescenceChoices['step-16-track']).toBe('university-track');
    expect(next.education.enrolled).toBe(true);
  });
});
