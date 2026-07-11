import { describe, expect, it } from 'vitest';
import { createSaveId, createWorldInstance } from '@fenix/domain';
import { estimateCatchUpDays, runCatchUpTicks } from './catch-up.js';

describe('runCatchUpTicks', () => {
  it('advances bounded offline days', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-catchup'),
      currentDate: '2000-01-01',
    });

    const next = runCatchUpTicks(world, 3);

    expect(next.clock.tickCount).toBe(3);
    expect(next.currentDate).toBe('2000-01-04');
  });

  it('estimates catch-up days from savedAt timestamp', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(estimateCatchUpDays(threeDaysAgo)).toBe(3);
  });
});
