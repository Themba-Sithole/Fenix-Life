import { debitFromBestAccount } from './banking-actions.js';
import { clampEmployeeStat } from './employees.js';
import type { EducationEffortLevel, EducationState } from './education.js';
import {
  getEducationProgramById,
  GRADUATION_MIN_GPA,
} from './education.js';
import type { WorldInstance } from './world-instance.js';

export function enrollEducation(world: WorldInstance, programId: string): WorldInstance {
  if (world.education.enrolled) {
    throw new Error('Already enrolled in a program — drop out first');
  }
  if (world.education.tuitionDueCents > 0) {
    throw new Error('Clear outstanding tuition before enrolling again');
  }

  const program = getEducationProgramById(programId);
  if (!program) {
    throw new Error('Unknown education program');
  }

  const priorGpa = world.education.gpa;
  if (priorGpa < program.minEnrollmentGpa) {
    throw new Error(
      `Need GPA ${program.minEnrollmentGpa.toFixed(1)}+ to enroll (yours: ${priorGpa.toFixed(2)})`,
    );
  }

  if (programId === 'grad') {
    const hasBachelors = world.education.credentials.some((credential) =>
      credential.id === 'cred-bachelors' || credential.name.toLowerCase().includes('undergrad'),
    );
    if (!hasBachelors) {
      throw new Error('Graduate programs require a completed undergraduate credential');
    }
  }

  const banking = debitFromBestAccount(
    world.banking,
    Math.min(program.tuitionCents, Math.round(program.tuitionCents * 0.35)),
    world.currentDate,
    `Tuition deposit — ${program.programName}`,
  );

  const education: EducationState = {
    ...world.education,
    programName: program.programName,
    institution: program.institution,
    creditsCompleted: 0,
    creditsRequired: program.creditsRequired,
    enrolled: true,
    gpa: Math.max(2.5, Math.min(priorGpa, 3.2)),
    effortLevel: 'normal',
    probation: false,
    tuitionDueCents: program.tuitionCents - Math.round(program.tuitionCents * 0.35),
    termDaysElapsed: 0,
    attendanceScore: 85,
    studyHoursThisWeek: 0,
  };

  return {
    ...world,
    banking,
    education,
    events: [
      {
        id: `evt-enroll-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `Enrolled in ${program.programName} at ${program.institution}`,
        tone: 'info' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

export function setEducationEffort(
  world: WorldInstance,
  effortLevel: EducationEffortLevel,
): WorldInstance {
  if (!world.education.enrolled) {
    throw new Error('Enroll in a program before setting effort');
  }
  return {
    ...world,
    education: { ...world.education, effortLevel },
  };
}

export function studySession(world: WorldInstance): WorldInstance {
  if (!world.education.enrolled) {
    throw new Error('Not enrolled');
  }
  const ticksSince = world.clock.tickCount - world.education.lastStudyTick;
  if (ticksSince < 1) {
    throw new Error('Already studied today — rest and return tomorrow');
  }
  if (world.player.traits.energy < 20) {
    throw new Error('Too exhausted to study effectively');
  }

  const grindBonus = world.education.effortLevel === 'grind' ? 0.04 : 0.02;
  const slackPenalty = world.education.effortLevel === 'slacking' ? -0.01 : 0;

  return {
    ...world,
    education: {
      ...world.education,
      gpa: Number(
        Math.max(
          0,
          Math.min(4, world.education.gpa + grindBonus + slackPenalty),
        ).toFixed(2),
      ),
      studyHoursThisWeek: world.education.studyHoursThisWeek + 2,
      attendanceScore: clampEmployeeStat(world.education.attendanceScore + 1),
      lastStudyTick: world.clock.tickCount,
    },
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        energy: clampEmployeeStat(world.player.traits.energy - 8),
        stress: clampEmployeeStat(world.player.traits.stress + 4),
        conscientiousness: clampEmployeeStat(world.player.traits.conscientiousness + 1),
      },
    },
  };
}

export function dropOutEducation(world: WorldInstance): WorldInstance {
  if (!world.education.enrolled) {
    throw new Error('Not enrolled');
  }

  return {
    ...world,
    education: {
      ...world.education,
      enrolled: false,
      effortLevel: 'normal',
      // Tuition debt remains
    },
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        stress: clampEmployeeStat(world.player.traits.stress + 5),
        happiness: clampEmployeeStat(world.player.traits.happiness - 4),
      },
    },
    events: [
      {
        id: `evt-dropout-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `Dropped out of ${world.education.programName} — outstanding tuition ${world.education.tuitionDueCents > 0 ? 'still due' : 'cleared'}`,
        tone: 'warning' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

export function payTuition(world: WorldInstance, amountCents: number): WorldInstance {
  if (world.education.tuitionDueCents <= 0) {
    throw new Error('No tuition balance due');
  }
  const payment = Math.min(amountCents, world.education.tuitionDueCents);
  if (payment <= 0) {
    throw new Error('Invalid tuition payment');
  }

  const banking = debitFromBestAccount(
    world.banking,
    payment,
    world.currentDate,
    'Tuition payment',
  );

  return {
    ...world,
    banking,
    education: {
      ...world.education,
      tuitionDueCents: world.education.tuitionDueCents - payment,
      tuitionOverdueDays:
        world.education.tuitionDueCents - payment <= 0 ? 0 : world.education.tuitionOverdueDays ?? 0,
    },
  };
}

export { GRADUATION_MIN_GPA };
