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

    expect(migrated.schemaVersion).toBeGreaterThanOrEqual(12);
    expect(migrated.portfolio).toBeDefined();
    expect(migrated.housing).toBeDefined();
    expect(migrated.transportation).toBeDefined();
    expect(migrated.family).toBeDefined();
    expect(migrated.education).toBeDefined();
    expect(migrated.employees.length).toBeGreaterThan(0);
    expect(migrated.economy.cyclePhase).toBeDefined();
    expect(migrated.banking.creditScore).toBeGreaterThan(0);
    expect(migrated.banking.activeLoan).toBeNull();
    expect(migrated.onboarding.adolescencePlayCompleted).toBe(true);
    expect(migrated.onboarding.adolescenceChoices).toEqual({});
    expect(migrated.onboarding.homeTourCompleted).toBe(true);
    expect(migrated.career.applications).toEqual([]);
  });

  it('migrates schema v10 fresh-start world without injecting a company', () => {
    const freshWorld = {
      saveId: createSaveId('fresh-v10'),
      schemaVersion: 10,
      currentDate: '2000-06-15',
      clock: { timeScale: 1 as const, paused: false, tickCount: 0 },
      player: {
        id: createCitizenId('fresh-v10'),
        displayName: 'Fresh Citizen',
        ageYears: 18,
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
      company: null,
      career: {
        status: 'unemployed' as const,
        jobTitle: 'Seeking work',
        employerName: '—',
        monthlySalaryCents: 0,
        performanceScore: 58,
        yearsExperience: 0,
      },
      portfolio: { holdings: [], quotes: [], dividendsYtdCents: 0, costBasisCents: 0, history: [] },
      housing: { properties: [], monthlyMortgageCents: 0 },
      transportation: { vehicles: [], monthlyTransportCostCents: 0 },
      family: { members: [] },
      education: {
        programName: 'High School Graduate',
        institution: 'Public School',
        gpa: 3.3,
        creditsCompleted: 0,
        creditsRequired: 0,
        enrolled: false,
      },
      employees: [],
      events: [],
      origin: {
        nationalityCode: 'US',
        countryCode: 'US',
        cityId: 'us-washington-d-c',
        currency: 'USD',
      },
      lifePath: 'undecided' as const,
      lifeStage: 'young-adult' as const,
      onboarding: {
        childhoodSummarySeen: false,
        lifePathHintsSeen: false,
        firstYearSimulated: false,
        adolescencePlayCompleted: false,
        adolescenceChoices: {},
        homeTourCompleted: false,
      },
    };

    const migrated = ensureWorldV2(freshWorld as never, 'Fresh Citizen', 'middle-class');

    expect(migrated.company).toBeNull();
    expect(migrated.lifePath).toBe('undecided');
    expect(migrated.lifeStage).toBe('young-adult');
    expect(migrated.onboarding.childhoodSummarySeen).toBe(false);
    expect(migrated.onboarding.adolescencePlayCompleted).toBe(false);
    expect(migrated.onboarding.adolescenceChoices).toEqual({});
    expect(migrated.onboarding.homeTourCompleted).toBe(false);
    expect(migrated.career.applications).toEqual([]);
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
