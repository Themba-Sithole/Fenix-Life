import { describe, expect, it } from 'vitest';
import { createDefaultEconomy, deriveCyclePhase } from './economy.js';

describe('economy cycle phase', () => {
  it('derives phase from tech sector index thresholds', () => {
    expect(deriveCyclePhase(120)).toBe('peak');
    expect(deriveCyclePhase(110)).toBe('expansion');
    expect(deriveCyclePhase(100)).toBe('contraction');
    expect(deriveCyclePhase(90)).toBe('trough');
  });

  it('defaults new economy to contraction at index 100', () => {
    const economy = createDefaultEconomy();
    expect(economy.cyclePhase).toBe('contraction');
  });
});
