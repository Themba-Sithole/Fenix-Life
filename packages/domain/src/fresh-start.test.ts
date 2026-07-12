import { describe, expect, it } from 'vitest';
import { createSaveId } from './save-id.js';
import { createFreshStartWorld, deriveYoungAdultStartDate } from './fresh-start.js';
import { totalNetWorthCents } from './banking.js';
import { ownedProperties } from './housing.js';
import { ownedVehicles } from './transportation.js';
import { createDefaultCompany } from './company.js';
import { generateCompanyEmployees } from './employees.js';

describe('createFreshStartWorld', () => {
  it('starts at age 18 with no company, employees, or owned assets', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('fresh-start'),
      playerName: 'Alex Rivera',
      background: 'middle-class',
      birthday: '1982-06-15',
      lifePath: 'undecided',
    });

    expect(world.schemaVersion).toBe(13);
    expect(world.currentDate).toBe('2000-06-15');
    expect(world.player.ageYears).toBe(18);
    expect(world.company).toBeNull();
    expect(world.employees).toHaveLength(0);
    expect(world.portfolio.holdings).toHaveLength(0);
    expect(ownedProperties(world.housing)).toHaveLength(0);
    expect(ownedVehicles(world.transportation)).toHaveLength(0);
    expect(world.career.status).toBe('unemployed');
    expect(world.career.monthlySalaryCents).toBe(0);
    expect(world.onboarding.childhoodSummarySeen).toBe(false);
    expect(world.onboarding.adolescencePlayCompleted).toBe(false);
    expect(world.onboarding.homeTourCompleted).toBe(false);
    expect(world.career.applications).toEqual([]);
    expect(world.career.unemployedSinceDate).toBe('2000-06-15');
    expect(world.lifeStage).toBe('young-adult');
    expect(world.lifePath).toBe('undecided');
  });

  it('uses modest background cash — wealthy is not a pre-built empire', () => {
    const wealthy = createFreshStartWorld({
      saveId: createSaveId('wealthy-fresh'),
      background: 'wealthy',
    });
    const orphan = createFreshStartWorld({
      saveId: createSaveId('orphan-fresh'),
      background: 'orphan',
    });

    expect(totalNetWorthCents(wealthy.banking)).toBe(25_000_00);
    expect(totalNetWorthCents(orphan.banking)).toBe(500_00);
    expect(wealthy.banking.familyCreditLineLimitCents).toBe(50_000_00);
    expect(orphan.banking.familyCreditLineLimitCents).toBeNull();
    expect(wealthy.company).toBeNull();
  });

  it('enrolls corporate-ladder path as university student', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('ladder-fresh'),
      lifePath: 'corporate-ladder',
    });

    expect(world.education.enrolled).toBe(true);
    expect(world.career.jobTitle).toBe('University Student');
  });

  it('derives young-adult start date from birthday', () => {
    expect(deriveYoungAdultStartDate('1982-06-15')).toBe('2000-06-15');
    expect(deriveYoungAdultStartDate('invalid')).toBe('2000-01-01');
  });
});

describe('legacy company test helper pattern', () => {
  it('allows tests to attach a company when simulating mid-game state', () => {
    const world = createFreshStartWorld({
      saveId: createSaveId('with-company'),
      playerName: 'Founder Test',
    });
    const company = createDefaultCompany('Founder Test', 'middle-class');
    const withCompany = {
      ...world,
      company,
      employees: generateCompanyEmployees(company, 'with-company', 4),
    };

    expect(withCompany.company).not.toBeNull();
    expect(withCompany.employees.length).toBeGreaterThan(0);
  });
});
