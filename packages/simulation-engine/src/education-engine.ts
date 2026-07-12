import type { EducationState, SimEvent, WorldInstance } from '@fenix/domain';
import {
  ATTENDANCE_PROBATION_THRESHOLD,
  FAIL_TERM_GPA,
  GRADUATION_MIN_GPA,
  PROBATION_GPA,
  TERM_LENGTH_DAYS,
  TUITION_GRACE_DAYS,
  educationCompleted,
} from '@fenix/domain';

function clampGpa(value: number): number {
  return Number(Math.max(0, Math.min(4, value)).toFixed(2));
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Education Engine — effort-driven progress. Slacking fails; grind costs energy.
 * Citizen Equality: same rules for all enrolled citizens.
 */
export function applyDailyEducationTick(world: WorldInstance): WorldInstance {
  const education = world.education;
  if (!education.enrolled || education.creditsRequired <= 0) {
    return {
      ...world,
      education: {
        ...education,
        studyHoursThisWeek: education.studyHoursThisWeek > 0 ? Math.max(0, education.studyHoursThisWeek - 1) : 0,
        tuitionOverdueDays: education.tuitionDueCents > 0 ? (education.tuitionOverdueDays ?? 0) + 1 : 0,
      },
    };
  }

  if (educationCompleted(education) && education.enrolled) {
    return graduateIfEligible(world);
  }

  const energy = world.player.traits.energy;
  const stress = world.player.traits.stress;
  let gpaDelta = 0;
  let creditChance = 0;
  let attendanceDelta = 0;
  let energyDelta = 0;
  let stressDelta = 0;

  switch (education.effortLevel) {
    case 'slacking':
      gpaDelta = energy < 40 ? -0.04 : -0.02;
      creditChance = 0.08;
      attendanceDelta = -2;
      energyDelta = 2;
      stressDelta = -1;
      break;
    case 'normal':
      gpaDelta = energy > 50 ? 0.01 : -0.01;
      creditChance = energy > 45 ? 0.35 : 0.18;
      attendanceDelta = 0;
      energyDelta = -1;
      stressDelta = 1;
      break;
    case 'grind':
      gpaDelta = energy > 35 ? 0.03 : 0.005;
      creditChance = energy > 30 ? 0.55 : 0.25;
      attendanceDelta = 1;
      energyDelta = -3;
      stressDelta = 3;
      break;
    default: {
      const _exhaustive: never = education.effortLevel;
      return _exhaustive;
    }
  }

  // Full-time job + school conflict
  if (world.career.status === 'employed' || world.career.status === 'founder') {
    creditChance *= 0.65;
    gpaDelta -= 0.01;
    stressDelta += 1;
  }

  const roll = (world.clock.tickCount * 17 + education.termDaysElapsed * 3) % 100;
  const creditGain = roll < creditChance * 100 ? 1 : 0;

  const tuitionOverdueDays =
    education.tuitionDueCents > 0 ? (education.tuitionOverdueDays ?? 0) + 1 : 0;

  let nextEducation: EducationState = {
    ...education,
    gpa: clampGpa(education.gpa + gpaDelta),
    creditsCompleted: Math.min(
      education.creditsRequired,
      education.creditsCompleted + creditGain,
    ),
    attendanceScore: clampStat(education.attendanceScore + attendanceDelta),
    termDaysElapsed: education.termDaysElapsed + 1,
    studyHoursThisWeek: Math.max(0, education.studyHoursThisWeek - (education.effortLevel === 'grind' ? 0 : 1)),
    tuitionOverdueDays,
  };

  // Ongoing tuition drain each term day while enrolled with balance due
  if (education.tuitionDueCents > 0 && education.termDaysElapsed % 30 === 0) {
    nextEducation = {
      ...nextEducation,
      tuitionDueCents: nextEducation.tuitionDueCents + Math.round(education.tuitionDueCents * 0.02),
    };
  }

  let events = world.events;
  let nextWorld: WorldInstance = {
    ...world,
    education: nextEducation,
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        energy: clampStat(world.player.traits.energy + energyDelta),
        stress: clampStat(stress + stressDelta),
      },
    },
  };

  if (
    nextEducation.attendanceScore < ATTENDANCE_PROBATION_THRESHOLD &&
    !nextEducation.probation
  ) {
    nextEducation = { ...nextEducation, probation: true };
    events = prependEvent(events, {
      id: `evt-edu-skip-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'life',
      headline: `${world.player.displayName} skipped too many classes — academic probation (attendance ${nextEducation.attendanceScore})`,
      tone: 'warning',
    });
    nextWorld = { ...nextWorld, education: nextEducation, events };
  }

  if (tuitionOverdueDays === TUITION_GRACE_DAYS + 1 && nextEducation.tuitionDueCents > 0) {
    events = prependEvent(nextWorld.events, {
      id: `evt-tuition-overdue-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'finance',
      headline: 'Tuition past grace — resolve balance before time can advance',
      tone: 'warning',
    });
    nextWorld = { ...nextWorld, events };
  }

  if (nextEducation.termDaysElapsed >= TERM_LENGTH_DAYS) {
    nextWorld = resolveAcademicTerm(nextWorld);
    return nextWorld;
  }

  if (nextEducation.gpa < PROBATION_GPA && !nextEducation.probation) {
    nextEducation = { ...nextEducation, probation: true };
    events = prependEvent(nextWorld.events, {
      id: `evt-edu-probation-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'life',
      headline: `${world.player.displayName} placed on academic probation (GPA ${nextEducation.gpa.toFixed(2)})`,
      tone: 'warning',
    });
    nextWorld = { ...nextWorld, education: nextEducation, events };
  }

  if (educationCompleted(nextWorld.education)) {
    return graduateIfEligible(nextWorld);
  }

  return nextWorld;
}

function resolveAcademicTerm(world: WorldInstance): WorldInstance {
  const education = world.education;
  let next = { ...education, termDaysElapsed: 0 };
  let events = world.events;

  if (next.gpa < FAIL_TERM_GPA) {
    const lostCredits = Math.min(12, next.creditsCompleted);
    next = {
      ...next,
      creditsCompleted: Math.max(0, next.creditsCompleted - lostCredits),
      failedTerms: next.failedTerms + 1,
      probation: true,
      gpa: clampGpa(next.gpa),
    };
    events = prependEvent(events, {
      id: `evt-edu-fail-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'life',
      headline: `Failed term — lost ${lostCredits} credits. Tuition still owed.`,
      tone: 'warning',
    });
  } else {
    events = prependEvent(events, {
      id: `evt-edu-term-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'life',
      headline: `Term complete — GPA ${next.gpa.toFixed(2)}, ${next.creditsCompleted}/${next.creditsRequired} credits`,
      tone: next.gpa >= 3.5 ? 'success' : 'info',
    });
    if (next.gpa >= PROBATION_GPA) {
      next = { ...next, probation: false };
    }
  }

  return { ...world, education: next, events };
}

function graduateIfEligible(world: WorldInstance): WorldInstance {
  const education = world.education;
  if (!educationCompleted(education) || !education.enrolled) {
    return world;
  }

  const credentialId =
    education.programName.includes('Trade')
      ? 'cred-trade'
      : education.programName.includes('Associate')
        ? 'cred-associate'
        : education.programName.includes('Graduate')
          ? 'cred-graduate'
          : 'cred-bachelors';

  const already = education.credentials.some((credential) => credential.id === credentialId);
  const credentials = already
    ? education.credentials
    : [
        ...education.credentials,
        {
          id: credentialId,
          name: education.programName,
          institution: education.institution,
          earnedDate: world.currentDate,
          gpa: education.gpa,
        },
      ];

  return {
    ...world,
    education: {
      ...education,
      enrolled: false,
      creditsCompleted: education.creditsRequired,
      tuitionDueCents: 0,
      credentials,
      effortLevel: 'normal',
    },
    career: {
      ...world.career,
      performanceScore: Math.min(100, world.career.performanceScore + 8),
    },
    events: prependEvent(world.events, {
      id: `evt-edu-grad-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'life',
      headline: `Graduated: ${education.programName} (GPA ${education.gpa.toFixed(2)})`,
      tone: 'success',
    }),
  };
}

function prependEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  return [event, ...events].slice(0, 50);
}
