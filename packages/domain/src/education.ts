export interface EducationState {
  readonly programName: string;
  readonly institution: string;
  readonly gpa: number;
  readonly creditsCompleted: number;
  readonly creditsRequired: number;
  readonly enrolled: boolean;
}

export function createDefaultEducation(background = 'middle-class'): EducationState {
  switch (background) {
    case 'wealthy':
    case 'entrepreneur-family':
      return {
        programName: 'Executive Business Certificate',
        institution: 'Regional Business School',
        gpa: 3.7,
        creditsCompleted: 96,
        creditsRequired: 120,
        enrolled: true,
      };
    case 'working-class':
    case 'orphan':
      return {
        programName: 'Trade Skills Program',
        institution: 'Community College',
        gpa: 3.1,
        creditsCompleted: 24,
        creditsRequired: 60,
        enrolled: true,
      };
    default:
      return {
        programName: 'Professional Development Track',
        institution: 'City University',
        gpa: 3.4,
        creditsCompleted: 48,
        creditsRequired: 120,
        enrolled: true,
      };
  }
}

export function educationProgressPercent(education: EducationState): number {
  if (education.creditsRequired <= 0) {
    return 0;
  }
  return Math.round((education.creditsCompleted / education.creditsRequired) * 100);
}

export function educationCompleted(education: EducationState): boolean {
  return education.creditsCompleted >= education.creditsRequired;
}
