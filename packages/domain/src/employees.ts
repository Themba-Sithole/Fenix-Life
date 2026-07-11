import type { CompanyState } from './company.js';

export type EmployeeDepartment = 'Engineering' | 'Sales' | 'Marketing' | 'Operations';

export interface EmployeeRecord {
  readonly id: string;
  readonly name: string;
  readonly position: string;
  readonly department: EmployeeDepartment;
  readonly salaryCents: number;
  readonly productivity: number;
  readonly creativity: number;
  readonly leadership: number;
  readonly loyalty: number;
  readonly yearsExperience: number;
}

const FIRST_NAMES = [
  'Sarah',
  'Michael',
  'Emily',
  'David',
  'Priya',
  'James',
  'Aisha',
  'Carlos',
  'Nina',
  'Oliver',
  'Mei',
  'Daniel',
  'Fatima',
  'Lucas',
  'Hannah',
] as const;

const LAST_NAMES = [
  'Johnson',
  'Chen',
  'Rodriguez',
  'Kim',
  'Patel',
  'Williams',
  'Okonkwo',
  'Silva',
  'Andersen',
  'Brown',
  'Nguyen',
  'Martinez',
  'Ali',
  'Schmidt',
  'Taylor',
] as const;

const DEPARTMENTS: EmployeeDepartment[] = ['Engineering', 'Sales', 'Marketing', 'Operations'];

const POSITIONS: Record<EmployeeDepartment, readonly string[]> = {
  Engineering: ['Lead Engineer', 'Senior Developer', 'Software Engineer', 'QA Lead'],
  Sales: ['Sales Director', 'Account Executive', 'Business Development Lead'],
  Marketing: ['Marketing Manager', 'Brand Strategist', 'Growth Lead'],
  Operations: ['Operations Manager', 'People Ops Lead', 'Finance Controller'],
};

function createSeededRandom(seed: string): () => number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(31, hash) + seed.charCodeAt(index);
    hash |= 0;
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Deterministic roster derived from company size — Doc 19 HR stub. */
export function generateCompanyEmployees(
  company: CompanyState,
  seed: string,
  limit = 8,
): EmployeeRecord[] {
  const count = Math.min(Math.max(company.employeeCount, 1), limit);
  const random = createSeededRandom(`${seed}:${company.id}:${company.employeeCount}`);
  const avgSalaryCents = Math.round(company.monthlyExpensesCents / Math.max(company.employeeCount, 1));

  return Array.from({ length: count }, (_, index) => {
    const firstName = pick(FIRST_NAMES, random);
    const lastName = pick(LAST_NAMES, random);
    const department = DEPARTMENTS[index % DEPARTMENTS.length]!;
    const position = pick(POSITIONS[department], random);
    const salaryVariance = 0.75 + random() * 0.5;
    const yearsExperience = clamp(Math.floor(2 + random() * 12), 1, 20);

    return {
      id: `${company.id}-emp-${index + 1}`,
      name: `${firstName} ${lastName}`,
      position,
      department,
      salaryCents: Math.round(avgSalaryCents * salaryVariance),
      productivity: clamp(Math.round(65 + random() * 30), 50, 99),
      creativity: clamp(Math.round(60 + random() * 35), 45, 99),
      leadership: clamp(Math.round(55 + random() * 40), 40, 99),
      loyalty: clamp(Math.round(70 + random() * 25), 55, 99),
      yearsExperience,
    };
  });
}

export function employeeInitials(employee: EmployeeRecord): string {
  return initialsFor(employee.name);
}

export function employeeExperienceLabel(yearsExperience: number): string {
  return yearsExperience === 1 ? '1 year' : `${yearsExperience} years`;
}

export function ensureCompanyEmployees(
  company: CompanyState,
  seed: string,
  existing?: readonly EmployeeRecord[],
  limit = 8,
): EmployeeRecord[] {
  if (existing && existing.length > 0) {
    return [...existing];
  }
  return generateCompanyEmployees(company, seed, limit);
}

/** Append one deterministic hire to the visible roster. */
export function createHiredEmployee(
  company: CompanyState,
  seed: string,
  rosterIndex: number,
): EmployeeRecord {
  const random = createSeededRandom(`${seed}:${company.id}:hire:${company.employeeCount}:${rosterIndex}`);
  const firstName = pick(FIRST_NAMES, random);
  const lastName = pick(LAST_NAMES, random);
  const department = DEPARTMENTS[rosterIndex % DEPARTMENTS.length]!;
  const position = pick(POSITIONS[department], random);
  const avgSalaryCents = Math.round(company.monthlyExpensesCents / Math.max(company.employeeCount, 1));

  return {
    id: `${company.id}-emp-${rosterIndex + 1}`,
    name: `${firstName} ${lastName}`,
    position,
    department,
    salaryCents: Math.round(avgSalaryCents * (0.85 + random() * 0.2)),
    productivity: clamp(Math.round(62 + random() * 25), 50, 95),
    creativity: clamp(Math.round(58 + random() * 28), 45, 95),
    leadership: clamp(Math.round(50 + random() * 30), 40, 90),
    loyalty: clamp(Math.round(72 + random() * 20), 60, 95),
    yearsExperience: clamp(Math.floor(1 + random() * 8), 1, 15),
  };
}

export function clampEmployeeStat(value: number): number {
  return clamp(value, 0, 99);
}
