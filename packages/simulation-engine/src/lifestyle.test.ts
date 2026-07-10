import { describe, expect, it } from 'vitest';
import {
  buildLifeTimeline,
  computeLegacySnapshot,
  createSaveId,
  createWorldInstance,
  housingTotalValueCents,
  ownedProperties,
} from '@fenix/domain';
import { applyDailyHousingTick } from './lifestyle-engine.js';
import { createDefaultEconomy } from '@fenix/domain';

describe('lifestyle simulation', () => {
  it('creates owned properties for established backgrounds', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-lifestyle'),
      background: 'wealthy',
      playerName: 'Alex Chen',
    });

    expect(ownedProperties(world.housing).length).toBeGreaterThan(0);
    expect(housingTotalValueCents(world.housing)).toBeGreaterThan(0);
    expect(world.family.members.length).toBeGreaterThan(0);
    expect(world.transportation.vehicles.some((vehicle) => vehicle.owned)).toBe(true);
  });

  it('drifts owned property values over time', () => {
    const world = createWorldInstance({
      saveId: createSaveId('save-housing'),
      background: 'middle-class',
    });
    const before = housingTotalValueCents(world.housing);
    const nextHousing = applyDailyHousingTick(world.housing, createDefaultEconomy());

    expect(housingTotalValueCents(nextHousing)).toBeTypeOf('number');
    expect(nextHousing.properties.length).toBe(world.housing.properties.length);
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
