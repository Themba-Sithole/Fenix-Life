import { describe, expect, it } from 'vitest';
import { computeFiveCapitals, createSaveId, createWorldInstance } from '@fenix/domain';

describe('computeFiveCapitals', () => {
  it('returns scores for all five capitals', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-1'),
      playerName: 'Alex Rivers',
      background: 'middle-class',
    });

    const capitals = computeFiveCapitals({
      player: world.player,
      banking: world.banking,
      company: world.company,
      career: world.career,
      tickCount: world.clock.tickCount,
      currency: world.origin.currency,
    });

    expect(capitals.financial).toBeGreaterThan(0);
    expect(capitals.human).toBeGreaterThan(0);
    expect(capitals.social).toBeGreaterThan(0);
    expect(capitals.business).toBeGreaterThan(0);
    expect(capitals.legacy).toBeGreaterThanOrEqual(0);
    expect(capitals.financialLabel).toContain('Net worth');
  });
});
