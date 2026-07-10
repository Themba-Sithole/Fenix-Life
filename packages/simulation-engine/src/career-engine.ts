import type { CareerState, WorldInstance } from '@fenix/domain';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Career Engine v0 — Doc 07 simplified performance drift. */
export function applyDailyCareerTick(world: WorldInstance): WorldInstance {
  const performanceDelta = world.player.traits.energy > 50 ? 1 : -1;
  const career: CareerState = {
    ...world.career,
    performanceScore: clamp(
      world.career.performanceScore + (Math.random() > 0.65 ? performanceDelta : 0),
      0,
      100,
    ),
  };

  const banking = world.career.status === 'unemployed'
    ? { ...world.banking, monthlySalaryCents: 0 }
    : { ...world.banking, monthlySalaryCents: career.monthlySalaryCents };

  return { ...world, career, banking };
}

export function careerHeadline(career: CareerState): string {
  if (career.status === 'unemployed') {
    return 'Job market tightens — keep networking and upskilling';
  }

  if (career.performanceScore >= 85) {
    return `${career.jobTitle} performance exceeds expectations at ${career.employerName}`;
  }

  return `${career.employerName} reviews ${career.jobTitle} performance this quarter`;
}
