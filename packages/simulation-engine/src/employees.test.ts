import { describe, expect, it } from 'vitest';
import { createDefaultCompany, generateCompanyEmployees } from '@fenix/domain';

describe('generateCompanyEmployees', () => {
  it('returns deterministic roster for the same seed', () => {
    const company = createDefaultCompany('Alex Chen', 'middle-class');
    const first = generateCompanyEmployees(company, 'save-1');
    const second = generateCompanyEmployees(company, 'save-1');

    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(0);
    expect(first.length).toBeLessThanOrEqual(8);
  });

  it('scales visible roster with company size up to the limit', () => {
    const company = createDefaultCompany('Alex Chen', 'wealthy');
    const roster = generateCompanyEmployees(company, 'save-2', 8);

    expect(company.employeeCount).toBe(42);
    expect(roster).toHaveLength(8);
  });
});
