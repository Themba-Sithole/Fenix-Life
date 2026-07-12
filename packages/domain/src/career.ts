import type { JobApplicationRecord } from './job-applications.js';
import type { LifePath } from './life-path.js';

export type EmploymentStatus = 'employed' | 'self_employed' | 'founder' | 'unemployed';

export interface CareerState {
  readonly status: EmploymentStatus;
  readonly jobTitle: string;
  readonly employerName: string;
  readonly monthlySalaryCents: number;
  readonly performanceScore: number;
  readonly yearsExperience: number;
  readonly unemployedSinceDate: string | null;
  readonly applications: readonly JobApplicationRecord[];
  readonly monthsInRole: number;
  readonly lastRaiseTick: number;
  readonly lastPromotionTick: number;
  readonly lastUpskillTick: number;
  readonly lastNetworkTick: number;
  readonly pipActive: boolean;
  readonly pipDaysRemaining: number;
  readonly warnings: number;
}

export const RAISE_COOLDOWN_TICKS = 180;
export const PROMOTION_COOLDOWN_TICKS = 365;
export const UPSKILL_COOLDOWN_TICKS = 30;
export const NETWORK_COOLDOWN_TICKS = 14;
export const RAISE_MIN_PERFORMANCE = 78;
export const RAISE_MIN_MONTHS = 6;
export const PROMOTION_MIN_PERFORMANCE = 88;
export const PROMOTION_MIN_MONTHS = 12;

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

const CAREER_LOOP_DEFAULTS = {
  monthsInRole: 0,
  lastRaiseTick: -9999,
  lastPromotionTick: -9999,
  lastUpskillTick: -9999,
  lastNetworkTick: -9999,
  pipActive: false,
  pipDaysRemaining: 0,
  warnings: 0,
};

export function careerLoopDefaults(
  career: Partial<CareerState>,
): Pick<
  CareerState,
  | 'monthsInRole'
  | 'lastRaiseTick'
  | 'lastPromotionTick'
  | 'lastUpskillTick'
  | 'lastNetworkTick'
  | 'pipActive'
  | 'pipDaysRemaining'
  | 'warnings'
> {
  return {
    monthsInRole: career.monthsInRole ?? CAREER_LOOP_DEFAULTS.monthsInRole,
    lastRaiseTick: career.lastRaiseTick ?? CAREER_LOOP_DEFAULTS.lastRaiseTick,
    lastPromotionTick: career.lastPromotionTick ?? CAREER_LOOP_DEFAULTS.lastPromotionTick,
    lastUpskillTick: career.lastUpskillTick ?? CAREER_LOOP_DEFAULTS.lastUpskillTick,
    lastNetworkTick: career.lastNetworkTick ?? CAREER_LOOP_DEFAULTS.lastNetworkTick,
    pipActive: career.pipActive ?? CAREER_LOOP_DEFAULTS.pipActive,
    pipDaysRemaining: career.pipDaysRemaining ?? CAREER_LOOP_DEFAULTS.pipDaysRemaining,
    warnings: career.warnings ?? CAREER_LOOP_DEFAULTS.warnings,
  };
}

/** Defaults for job-search fields on legacy career blobs. */
export function careerJobSearchDefaults(
  career: Omit<CareerState, 'unemployedSinceDate' | 'applications'> &
    Partial<Pick<CareerState, 'unemployedSinceDate' | 'applications'>>,
  currentDate: string,
): Pick<CareerState, 'unemployedSinceDate' | 'applications'> {
  return {
    unemployedSinceDate:
      career.unemployedSinceDate ??
      (career.status === 'unemployed' ? currentDate : null),
    applications: career.applications ?? [],
  };
}

export function normalizeCareerState(
  career: Partial<CareerState> &
    Pick<CareerState, 'status' | 'jobTitle' | 'employerName' | 'monthlySalaryCents' | 'performanceScore' | 'yearsExperience'>,
  currentDate: string,
): CareerState {
  return {
    ...career,
    ...careerJobSearchDefaults(career as CareerState, currentDate),
    ...careerLoopDefaults(career),
  };
}

/** Young-adult entry — unemployed or student track (GDD §4.4, §6.3). */
export function createFreshStartCareer(
  background = 'middle-class',
  lifePath: LifePath = 'undecided',
  currentDate = '2000-01-01',
): CareerState {
  const base = {
    unemployedSinceDate: currentDate,
    applications: [] as JobApplicationRecord[],
    ...CAREER_LOOP_DEFAULTS,
  };

  if (lifePath === 'corporate-ladder') {
    return {
      status: 'unemployed',
      jobTitle: 'University Student',
      employerName: '—',
      monthlySalaryCents: 0,
      performanceScore: 60,
      yearsExperience: 0,
      ...base,
    };
  }

  switch (background) {
    case 'working-class':
    case 'orphan':
      return {
        status: 'unemployed',
        jobTitle: 'Seeking first job',
        employerName: '—',
        monthlySalaryCents: 0,
        performanceScore: 55,
        yearsExperience: 0,
        ...base,
      };
    default:
      return {
        status: 'unemployed',
        jobTitle: 'Seeking work',
        employerName: '—',
        monthlySalaryCents: 0,
        performanceScore: 58,
        yearsExperience: 0,
        ...base,
      };
  }
}

export function createDefaultCareer(
  playerName: string,
  background = 'middle-class',
  companyName?: string,
): CareerState {
  const firstName = playerName.trim().split(/\s+/)[0] || 'Citizen';
  const employedDefaults = {
    unemployedSinceDate: null as string | null,
    applications: [] as JobApplicationRecord[],
    ...CAREER_LOOP_DEFAULTS,
    monthsInRole: 24,
  };

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
        ...employedDefaults,
      };
    case 'working-class':
      return {
        status: 'employed',
        jobTitle: 'Operations Associate',
        employerName: 'Metro Logistics Co.',
        monthlySalaryCents: 3_200_00,
        performanceScore: 71,
        yearsExperience: 3,
        ...employedDefaults,
      };
    case 'orphan':
      return {
        status: 'unemployed',
        jobTitle: 'Seeking work',
        employerName: '—',
        monthlySalaryCents: 0,
        performanceScore: 55,
        yearsExperience: 1,
        unemployedSinceDate: '1998-01-01',
        applications: [],
        ...CAREER_LOOP_DEFAULTS,
      };
    case 'immigrant':
      return {
        status: 'employed',
        jobTitle: 'Junior Analyst',
        employerName: 'Regional Services Ltd.',
        monthlySalaryCents: 4_500_00,
        performanceScore: 68,
        yearsExperience: 2,
        ...employedDefaults,
      };
    default:
      return {
        status: 'employed',
        jobTitle: 'Product Specialist',
        employerName: 'Horizon Digital',
        monthlySalaryCents: 6_500_00,
        performanceScore: 74,
        yearsExperience: 4,
        ...employedDefaults,
      };
  }
}
