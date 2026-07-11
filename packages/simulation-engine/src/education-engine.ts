import type { EducationState } from '@fenix/domain';

/** Education Engine v0 — daily progress while enrolled. */
export function applyDailyEducationTick(education: EducationState): EducationState {
  if (!education.enrolled || education.creditsCompleted >= education.creditsRequired) {
    return education;
  }

  const creditGain = Math.random() > 0.65 ? 1 : 0;
  const gpaDelta = Math.random() > 0.5 ? 0.01 : -0.01;

  return {
    ...education,
    creditsCompleted: Math.min(
      education.creditsRequired,
      education.creditsCompleted + creditGain,
    ),
    gpa: Number(Math.max(0, Math.min(4, education.gpa + gpaDelta)).toFixed(2)),
  };
}
