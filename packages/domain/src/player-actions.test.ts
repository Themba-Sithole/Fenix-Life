import { describe, expect, it } from 'vitest';
import { createDefaultCompany } from './company.js';
import { generateCompanyEmployees } from './employees.js';
import { createSaveId } from './save-id.js';
import { createWorldInstance } from './world-instance.js';
import { applyPlayerAction } from './player-actions.js';
import { getAvailableJobListings } from './job-market.js';
import { totalNetWorthCents } from './banking.js';

describe('player actions', () => {
  it('buys stock shares and debits checking', () => {
    const world = createWorldInstance({
      saveId: createSaveId('action-test-buy'),
      playerName: 'Tester',
    });
    const checkingBefore = world.banking.accounts.find((a) => a.id === 'checking')!.balanceCents;
    const quote = world.portfolio.quotes.find((q) => q.symbol === 'AAPL')!;
    const shares = 2;

    const next = applyPlayerAction(world, {
      kind: 'BUY_STOCK',
      symbol: 'AAPL',
      shares,
    });

    const checkingAfter = next.banking.accounts.find((a) => a.id === 'checking')!.balanceCents;
    expect(checkingAfter).toBe(checkingBefore - quote.priceCents * shares);
    expect(next.portfolio.holdings.find((h) => h.symbol === 'AAPL')?.shares).toBeGreaterThan(0);
  });

  it('purchases an unowned property', () => {
    let world = createWorldInstance({
      saveId: createSaveId('action-test-property'),
      playerName: 'Tester',
    });
    const property = world.housing.properties
      .filter((p) => !p.owned)
      .sort((left, right) => left.priceCents - right.priceCents)[0];
    expect(property).toBeDefined();

    world = {
      ...world,
      banking: {
        ...world.banking,
        accounts: world.banking.accounts.map((account) =>
          account.id === 'checking'
            ? { ...account, balanceCents: property!.priceCents + 1_000_00 }
            : account,
        ),
      },
    };

    const next = applyPlayerAction(world, {
      kind: 'PURCHASE_PROPERTY',
      propertyId: property!.id,
    });

    expect(next.housing.properties.find((p) => p.id === property!.id)?.owned).toBe(true);
  });

  it('applies a loan when credit is sufficient', () => {
    const world = createWorldInstance({
      saveId: createSaveId('action-test-loan'),
      playerName: 'Tester',
    });
    const next = applyPlayerAction(world, { kind: 'APPLY_LOAN', amountCents: 10_000_00 });
    expect(next.banking.activeLoan).not.toBeNull();
    expect(next.banking.activeLoan?.principalCents).toBe(10_000_00);
  });

  it('hires an employee and increases headcount', () => {
    const base = createWorldInstance({
      saveId: createSaveId('action-test-hire'),
      playerName: 'Tester',
    });
    const company = createDefaultCompany('Tester', 'middle-class');
    const world = {
      ...base,
      company,
      employees: generateCompanyEmployees(company, 'action-test-hire', 4),
      banking: {
        ...base.banking,
        accounts: base.banking.accounts.map((account) =>
          account.id === 'checking'
            ? { ...account, balanceCents: 20_000_00 }
            : account,
        ),
      },
    };
    const before = world.company!.employeeCount;
    const next = applyPlayerAction(world, { kind: 'COMPANY_HIRE' });
    expect(next.company!.employeeCount).toBe(before + 1);
  });

  it('promotes an employee and increases salary', () => {
    const company = createDefaultCompany('Tester', 'middle-class');
    const world = {
      ...createWorldInstance({
        saveId: createSaveId('action-test-promote'),
        playerName: 'Tester',
      }),
      company,
      employees: generateCompanyEmployees(company, 'action-test-promote', 4),
    };
    const employee = world.employees[0]!;
    const next = applyPlayerAction(world, { kind: 'EMPLOYEE_PROMOTE', employeeId: employee.id });
    const updated = next.employees.find((item) => item.id === employee.id)!;
    expect(updated.salaryCents).toBeGreaterThan(employee.salaryCents);
  });

  it('plans a family event and boosts happiness', () => {
    const world = createWorldInstance({
      saveId: createSaveId('action-test-family'),
      playerName: 'Tester',
    });
    const before = world.family.members[0]!.happiness;
    const next = applyPlayerAction(world, { kind: 'FAMILY_PLAN_EVENT' });
    expect(next.family.members[0]!.happiness).toBeGreaterThanOrEqual(before);
  });

  it('grants a raise when performance is sufficient', () => {
    const base = createWorldInstance({
      saveId: createSaveId('action-test-raise'),
      playerName: 'Tester',
    });
    let raised = false;
    let nextSalary = 6_500_00;
    for (let tick = 40; tick < 200 && !raised; tick += 1) {
      const world = {
        ...base,
        career: {
          ...base.career,
          status: 'employed' as const,
          jobTitle: 'Product Specialist',
          employerName: 'Horizon Digital',
          monthlySalaryCents: 6_500_00,
          performanceScore: 95,
          monthsInRole: 8,
          lastRaiseTick: -9999,
        },
        clock: { ...base.clock, tickCount: tick },
        banking: { ...base.banking, monthlySalaryCents: 6_500_00 },
      };
      const next = applyPlayerAction(world, { kind: 'CAREER_REQUEST_RAISE' });
      if (next.career.monthlySalaryCents > 6_500_00) {
        raised = true;
        nextSalary = next.career.monthlySalaryCents;
        expect(next.banking.monthlySalaryCents).toBe(next.career.monthlySalaryCents);
      }
    }
    expect(raised).toBe(true);
    expect(nextSalary).toBeGreaterThan(6_500_00);
  });

  it('sells an owned property for partial value', () => {
    let world = createWorldInstance({
      saveId: createSaveId('action-test-sell-property'),
      playerName: 'Tester',
    });
    const property = world.housing.properties.find((p) => !p.owned)!;
    world = {
      ...world,
      banking: {
        ...world.banking,
        accounts: world.banking.accounts.map((account) =>
          account.id === 'checking'
            ? { ...account, balanceCents: property.priceCents + 1_000_00 }
            : account,
        ),
      },
    };

    const purchased = applyPlayerAction(world, {
      kind: 'PURCHASE_PROPERTY',
      propertyId: property.id,
    });
    const sold = applyPlayerAction(purchased, {
      kind: 'SELL_PROPERTY',
      propertyId: property.id,
    });

    expect(sold.housing.properties.find((p) => p.id === property.id)?.owned).toBe(false);
  });

  it('pays off an active loan and clears balance', () => {
    let world = applyPlayerAction(
      createWorldInstance({ saveId: createSaveId('action-test-payoff'), playerName: 'Tester' }),
      { kind: 'APPLY_LOAN', amountCents: 5_000_00 },
    );

    world = {
      ...world,
      banking: {
        ...world.banking,
        accounts: world.banking.accounts.map((account) =>
          account.id === 'checking'
            ? { ...account, balanceCents: account.balanceCents + 10_000_00 }
            : account,
        ),
      },
    };

    const next = applyPlayerAction(world, { kind: 'PAY_LOAN' });
    expect(next.banking.activeLoan).toBeNull();
  });

  it('applies for a job when unemployed', () => {
    let world = createWorldInstance({
      saveId: createSaveId('action-test-job'),
      playerName: 'Tester',
    });

    world = {
      ...world,
      career: {
        ...world.career,
        status: 'unemployed',
        jobTitle: 'Seeking work',
        employerName: '—',
        monthlySalaryCents: 0,
      },
      banking: { ...world.banking, monthlySalaryCents: 0 },
      clock: { ...world.clock, tickCount: 2 },
    };

    const listings = getAvailableJobListings({
      career: world.career,
      education: world.education,
    });
    expect(listings.length).toBeGreaterThan(0);

    const next = applyPlayerAction(world, {
      kind: 'CAREER_APPLY_JOB',
      listingId: listings[0]!.id,
    });
    expect(next.career.status).toBe('unemployed');
    expect(next.career.applications).toHaveLength(1);
    expect(next.career.applications[0]?.status).toBe('pending');
  });

  it('creates a citizen with age derived from birthday', () => {
    const world = createWorldInstance({
      saveId: createSaveId('birthday-test'),
      playerName: 'Tester',
      birthday: '1981-06-15',
      currentDate: '2000-01-01',
    });

    expect(world.player.ageYears).toBe(18);
    expect(world.player.birthday).toBe('1981-06-15');
  });

  it('starts wealthy backgrounds with higher net worth', () => {
    const wealthy = createWorldInstance({
      saveId: createSaveId('wealthy-test'),
      playerName: 'Tester',
      background: 'wealthy',
    });
    const orphan = createWorldInstance({
      saveId: createSaveId('orphan-test'),
      playerName: 'Tester',
      background: 'orphan',
    });

    expect(totalNetWorthCents(wealthy.banking)).toBeGreaterThan(totalNetWorthCents(orphan.banking));
  });

  it('visits a district and logs a life event', () => {
    const world = createWorldInstance({
      saveId: createSaveId('action-test-visit'),
      playerName: 'Tester',
    });
    const happinessBefore = world.player.traits.happiness;

    const next = applyPlayerAction(world, { kind: 'VISIT_DISTRICT', districtId: 'mall' });
    expect(next.player.traits.happiness).toBeGreaterThanOrEqual(happinessBefore);
    expect(next.events.some((event) => event.headline.includes('Mall'))).toBe(true);
  });
});
