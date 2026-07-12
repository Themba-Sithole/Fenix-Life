import { describe, expect, it } from 'vitest';
import {
  buildLifeTimeline,
  computeLegacySnapshot,
  createDefaultHousing,
  createSaveId,
  createWorldInstance,
  housingTotalValueCents,
  ownedProperties,
} from '@fenix/domain';
import { applyDailyHousingTick } from './lifestyle-engine.js';
import { createDefaultEconomy } from '@fenix/domain';

describe('lifestyle simulation', () => {
  it('fresh start has no owned property or vehicles regardless of background', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-lifestyle'),
      background: 'wealthy',
      playerName: 'Alex Chen',
    });

    expect(ownedProperties(world.housing).length).toBe(0);
    expect(housingTotalValueCents(world.housing)).toBe(0);
    expect(world.family.members.length).toBeGreaterThan(0);
    expect(world.transportation.vehicles.some((vehicle) => vehicle.owned)).toBe(false);
  });

  it('drifts owned property values over time', () => {
    const housing = createDefaultHousing('Metro', 'middle-class', 'startup');
    const before = housingTotalValueCents(housing);
    const nextHousing = applyDailyHousingTick(housing, createDefaultEconomy());

    expect(housingTotalValueCents(nextHousing)).toBeTypeOf('number');
    expect(nextHousing.properties.length).toBe(housing.properties.length);
    expect(housingTotalValueCents(nextHousing)).not.toBeLessThan(before * 0.8);
  });

  it('builds a timeline and legacy snapshot from world state', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-timeline'),
      playerName: 'Jordan Lee',
    });

    const timeline = buildLifeTimeline(world);
    const legacy = computeLegacySnapshot(world);

    expect(timeline.length).toBeGreaterThan(2);
    expect(legacy.score).toBeGreaterThan(0);
    expect(legacy.netWorthCents).toBeGreaterThan(0);
  });
});
