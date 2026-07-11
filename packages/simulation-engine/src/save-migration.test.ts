import { describe, expect, it } from 'vitest';
import {
  createCitizenId,
  createDefaultBanking,
  createSaveId,
  ensureWorldV2,
  transferBetweenAccounts,
} from '@fenix/domain';

describe('save migration', () => {
  it('migrates legacy schema v1 world to current playable state', () => {
    const legacyWorld = {
      saveId: createSaveId('legacy-save'),
      schemaVersion: 1,
      currentDate: '2000-03-15',
      clock: { timeScale: 1 as const, paused: false, tickCount: 12 },
      player: {
        id: createCitizenId('legacy-save'),
        displayName: 'Legacy Citizen',
        ageYears: 24,
        traits: {
          conscientiousness: 60,
          openness: 55,
          happiness: 75,
          health: 85,
          energy: 70,
          stress: 25,
        },
      },
      banking: createDefaultBanking(),
      economy: { inflationRateAnnual: 0.03, techSectorIndex: 100 },
      events: [],
      origin: {
        nationalityCode: 'US',
        countryCode: 'US',
        cityId: 'us-nyc',
        currency: 'USD',
      },
    };

    const migrated = ensureWorldV2(legacyWorld as never, 'Legacy Citizen');

    expect(migrated.schemaVersion).toBeGreaterThanOrEqual(6);
    expect(migrated.portfolio).toBeDefined();
    expect(migrated.housing).toBeDefined();
    expect(migrated.transportation).toBeDefined();
    expect(migrated.family).toBeDefined();
    expect(migrated.banking.creditScore).toBeGreaterThan(0);
  });
});

describe('banking transfers', () => {
  it('moves funds between accounts and records a transaction', () => {
    const banking = createDefaultBanking();
    const checkingBefore = banking.accounts.find((account) => account.id === 'checking')!.balanceCents;

    const next = transferBetweenAccounts(banking, {
      fromAccountId: 'checking',
      toAccountId: 'savings',
      amountCents: 100_00,
      date: '2000-01-02',
    });

    const checkingAfter = next.accounts.find((account) => account.id === 'checking')!.balanceCents;
    expect(checkingAfter).toBe(checkingBefore - 100_00);
    expect(next.transactions[0]?.amountCents).toBe(-100_00);
  });
});
