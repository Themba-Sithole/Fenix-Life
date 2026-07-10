export type EmploymentStatus = 'employed' | 'self_employed' | 'founder' | 'unemployed';

export interface CareerState {
  readonly status: EmploymentStatus;
  readonly jobTitle: string;
  readonly employerName: string;
  readonly monthlySalaryCents: number;
  readonly performanceScore: number;
  readonly yearsExperience: number;
}

export function employmentStatusLabel(status: EmploymentStatus): string {
  switch (status) {
    case 'employed':
      return 'Employed';
    case 'self_employed':
      return 'Self-employed';
    case 'founder':
      return 'Founder / CEO';
    case 'unemployed':
      return 'Unemployed';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function createDefaultCareer(
  playerName: string,
  background = 'middle-class',
  companyName?: string,
): CareerState {
  const firstName = playerName.trim().split(/\s+/)[0] || 'Citizen';

  switch (background) {
    case 'wealthy':
    case 'entrepreneur-family':
      return {
        status: 'founder',
        jobTitle: 'Chief Executive Officer',
        employerName: companyName ?? `${firstName} Ventures`,
        monthlySalaryCents: 12_000_00,
        performanceScore: 82,
        yearsExperience: 8,
      };
    case 'working-class':
      return {
        status: 'employed',
        jobTitle: 'Operations Associate',
        employerName: 'Metro Logistics Co.',
        monthlySalaryCents: 3_200_00,
        performanceScore: 71,
        yearsExperience: 3,
      };
    case 'orphan':
      return {
        status: 'unemployed',
        jobTitle: 'Seeking work',
        employerName: '—',
        monthlySalaryCents: 0,
        performanceScore: 55,
        yearsExperience: 1,
      };
    case 'immigrant':
      return {
        status: 'employed',
        jobTitle: 'Junior Analyst',
        employerName: 'Regional Services Ltd.',
        monthlySalaryCents: 4_500_00,
        performanceScore: 68,
        yearsExperience: 2,
      };
    default:
      return {
        status: 'employed',
        jobTitle: 'Product Specialist',
        employerName: 'Horizon Digital',
        monthlySalaryCents: 6_500_00,
        performanceScore: 74,
        yearsExperience: 4,
      };
  }
}
