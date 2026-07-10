import { describe, expect, it } from 'vitest';
import { createSaveId, createWorldInstance } from '@fenix/domain';
import { addDays, runDailyTick } from './index.js';

describe('time-engine', () => {
  it('addDays advances the calendar', () => {
    expect(addDays('2000-01-01', 1)).toBe('2000-01-02');
    expect(addDays('2000-01-31', 1)).toBe('2000-02-01');
  });
});

describe('tick-orchestrator', () => {
  it('runDailyTick advances date and tick count', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save_test'),
      currentDate: '2000-06-15',
    });

    const next = runDailyTick(world);
    expect(next.currentDate).toBe('2000-06-16');
    expect(next.clock.tickCount).toBe(1);
  });

  it('runDailyTick is a no-op when paused', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save_test'),
      currentDate: '2000-06-15',
    });
    world.clock.paused = true;

    const next = runDailyTick(world);
    expect(next.currentDate).toBe('2000-06-15');
    expect(next.clock.tickCount).toBe(0);
  });
});
