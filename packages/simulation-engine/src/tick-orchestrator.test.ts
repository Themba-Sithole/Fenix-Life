import { createSaveId, createWorldInstance } from '@fenix/domain';
import { describe, expect, it } from 'vitest';
import { runDailyTick } from './tick-orchestrator.js';

describe('runDailyTick', () => {
  it('advances date and tick count when not paused', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-1'),
      currentDate: '2000-01-01',
    });

    const next = runDailyTick(world);

    expect(next.currentDate).toBe('2000-01-02');
    expect(next.clock.tickCount).toBe(1);
  });

  it('does not advance when paused', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-1'),
      currentDate: '2000-01-01',
    });
    world.clock.paused = true;

    const next = runDailyTick(world);

    expect(next.currentDate).toBe('2000-01-01');
    expect(next.clock.tickCount).toBe(0);
  });

  it('deposits salary on the first day of the month', () => {
    let world = createWorldInstance({
      saveId: createSaveId('save-1'),
      currentDate: '2000-01-31',
    });

    world = runDailyTick(world);

    expect(world.currentDate).toBe('2000-02-01');
    const checking = world.banking.accounts.find((a) => a.id === 'checking');
    expect(checking?.balanceCents).toBeGreaterThan(12_500_00);
    expect(world.events.some((e) => e.headline.includes('Salary deposited'))).toBe(true);
  });

  it('generates economy news on weekly ticks', () => {
    let world = createWorldInstance({
      saveId: createSaveId('save-1'),
      currentDate: '2000-01-01',
    });

    for (let i = 0; i < 7; i += 1) {
      world = runDailyTick(world);
    }

    expect(world.events.some((e) => e.category === 'news')).toBe(true);
  });
});
