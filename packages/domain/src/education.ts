import type { LifePath } from './life-path.js';

export type EducationEffortLevel = 'slacking' | 'normal' | 'grind';

export interface EducationCredential {
  readonly id: string;
  readonly name: string;
  readonly institution: string;
  readonly earnedDate: string;
  readonly gpa: number;
}

export interface EducationProgramOption {
  readonly id: string;
  readonly programName: string;
  readonly institution: string;
  readonly creditsRequired: number;
  readonly tuitionCents: number;
  readonly minEnrollmentGpa: number;
  readonly credentialId: string;
}

export interface EducationState {
  readonly programName: string;
  readonly institution: string;
  readonly gpa: number;
  readonly creditsCompleted: number;
  readonly creditsRequired: number;
  readonly enrolled: boolean;
  readonly effortLevel: EducationEffortLevel;
  readonly attendanceScore: number;
  readonly studyHoursThisWeek: number;
  readonly probation: boolean;
  readonly failedTerms: number;
  readonly tuitionDueCents: number;
  /** Days tuition has been unpaid while enrolled (grace → hard gate). */
  readonly tuitionOverdueDays: number;
  readonly credentials: readonly EducationCredential[];
  readonly termDaysElapsed: number;
  readonly lastStudyTick: number;
}

export const EDUCATION_PROGRAMS: readonly EducationProgramOption[] = [
  {
    id: 'trade',
    programName: 'Trade Skills Program',
    institution: 'Community College',
    creditsRequired: 60,
    tuitionCents: 4_500_00,
    minEnrollmentGpa: 2.0,
    credentialId: 'cred-trade',
  },
  {
    id: 'undergrad',
    programName: 'Undergraduate Degree',
    institution: 'City University',
    creditsRequired: 120,
    tuitionCents: 12_000_00,
    minEnrollmentGpa: 2.5,
    credentialId: 'cred-bachelors',
  },
  {
    id: 'community',
    programName: 'Associate Track',
    institution: 'Metro Community College',
    creditsRequired: 60,
    tuitionCents: 3_200_00,
    minEnrollmentGpa: 2.0,
    credentialId: 'cred-associate',
  },
  {
    id: 'grad',
    programName: 'Graduate Certificate',
    institution: 'City University Graduate School',
    creditsRequired: 36,
    tuitionCents: 18_000_00,
    minEnrollmentGpa: 3.0,
    credentialId: 'cred-graduate',
  },
] as const;

export const GRADUATION_MIN_GPA = 2.0;
export const PROBATION_GPA = 2.2;
export const FAIL_TERM_GPA = 2.0;
export const TERM_LENGTH_DAYS = 90;
export const TUITION_GRACE_DAYS = 14;
export const STUDY_COOLDOWN_TICKS = 3;
/** Attendance below this triggers probation alongside GPA. */
export const ATTENDANCE_PROBATION_THRESHOLD = 55;

function educationDefaults(
  partial: Partial<EducationState> &
    Pick<EducationState, 'programName' | 'institution' | 'gpa' | 'creditsCompleted' | 'creditsRequired' | 'enrolled'>,
): EducationState {
  return {
    effortLevel: 'normal',
    attendanceScore: 80,
    studyHoursThisWeek: 0,
    probation: false,
    failedTerms: 0,
    tuitionDueCents: 0,
    tuitionOverdueDays: 0,
    credentials: [],
    termDaysElapsed: 0,
    lastStudyTick: -999,
    ...partial,
  };
}

export function createFreshStartEducation(
  background = 'middle-class',
  lifePath: LifePath = 'undecided',
): EducationState {
  if (lifePath === 'corporate-ladder') {
    return educationDefaults({
      programName: 'Undergraduate Degree',
      institution: 'City University',
      gpa: 2.8,
      creditsCompleted: 0,
      creditsRequired: 120,
      enrolled: true,
      tuitionDueCents: 12_000_00,
      effortLevel: 'normal',
    });
  }

  const hsGpa =
    background === 'wealthy' || background === 'entrepreneur-family'
      ? 3.6
      : background === 'working-class' || background === 'orphan'
        ? 3.0
        : 3.3;

  return educationDefaults({
    programName: 'High School Graduate',
    institution:
      background === 'wealthy' || background === 'entrepreneur-family'
        ? 'Private Academy'
        : 'Public School',
    gpa: hsGpa,
    creditsCompleted: 0,
    creditsRequired: 0,
    enrolled: false,
    credentials: [
      {
        id: 'cred-hs',
        name: 'High School Diploma',
        institution:
          background === 'wealthy' || background === 'entrepreneur-family'
            ? 'Private Academy'
            : 'Public School',
        earnedDate: 'prior',
        gpa: hsGpa,
      },
    ],
  });
}

export function createDefaultEducation(background = 'middle-class'): EducationState {
  switch (background) {
    case 'wealthy':
    case 'entrepreneur-family':
      return educationDefaults({
        programName: 'Executive Business Certificate',
        institution: 'Regional Business School',
        gpa: 3.7,
        creditsCompleted: 96,
        creditsRequired: 120,
        enrolled: true,
      });
    case 'working-class':
    case 'orphan':
      return educationDefaults({
        programName: 'Trade Skills Program',
        institution: 'Community College',
        gpa: 3.1,
        creditsCompleted: 24,
        creditsRequired: 60,
        enrolled: true,
      });
    default:
      return educationDefaults({
        programName: 'Professional Development Track',
        institution: 'City University',
        gpa: 3.4,
        creditsCompleted: 48,
        creditsRequired: 120,
        enrolled: true,
      });
  }
}

export function normalizeEducationState(
  education: Partial<EducationState> &
    Pick<EducationState, 'programName' | 'institution' | 'gpa' | 'creditsCompleted' | 'creditsRequired' | 'enrolled'>,
): EducationState {
  return educationDefaults(education);
}

export function educationProgressPercent(education: EducationState): number {
  if (education.creditsRequired <= 0) {
    return education.enrolled ? 0 : 100;
  }
  return Math.round((education.creditsCompleted / education.creditsRequired) * 100);
}

export function educationCompleted(education: EducationState): boolean {
  return (
    education.creditsRequired > 0 &&
    education.creditsCompleted >= education.creditsRequired &&
    education.gpa >= GRADUATION_MIN_GPA
  );
}

export function getEducationProgramById(programId: string): EducationProgramOption | undefined {
  return EDUCATION_PROGRAMS.find((program) => program.id === programId);
}

export function highestCredentialGpa(education: EducationState): number {
  if (education.credentials.length === 0) {
    return education.gpa;
  }
  return Math.max(education.gpa, ...education.credentials.map((credential) => credential.gpa));
}

export function hasCredential(education: EducationState, credentialId: string): boolean {
  return education.credentials.some((credential) => credential.id === credentialId);
}

export function effortLevelLabel(level: EducationEffortLevel): string {
  switch (level) {
    case 'slacking':
      return 'Slacking';
    case 'normal':
      return 'Normal';
    case 'grind':
      return 'Grind';
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}
