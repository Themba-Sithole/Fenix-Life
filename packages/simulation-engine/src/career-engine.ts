import type { CareerState, SimEvent, WorldInstance } from '@fenix/domain';
import {
  JOB_APPLICATION_RESOLVE_DAYS,
  getJobListingById,
  jobListingMatchScore,
} from '@fenix/domain';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Career Engine — slow experience, hard reviews, delayed applications, PIP risk.
 * Promotions/raises are NOT granted here from clicks; player actions enforce cooldowns.
 */
export function applyDailyCareerTick(world: WorldInstance): WorldInstance {
  let next = resolvePendingApplications(world);
  next = applyPerformanceDrift(next);
  next = applyMonthlyTenure(next);
  next = applyPipTick(next);
  return next;
}

function applyPerformanceDrift(world: WorldInstance): WorldInstance {
  if (world.career.status === 'unemployed') {
    return {
      ...world,
      banking: { ...world.banking, monthlySalaryCents: 0 },
    };
  }

  const energy = world.player.traits.energy;
  const stress = world.player.traits.stress;
  let delta = 0;
  if (energy > 60 && stress < 55) {
    delta = 1;
  } else if (energy < 35 || stress > 75) {
    delta = -2;
  } else if (Math.random() > 0.7) {
    delta = energy > 50 ? 1 : -1;
  }

  if (world.education.enrolled && world.education.effortLevel === 'grind') {
    delta -= 1;
  }

  const performanceScore = clamp(world.career.performanceScore + delta, 0, 100);
  let career: CareerState = { ...world.career, performanceScore };
  let events = world.events;

  if (performanceScore < 40 && !career.pipActive && career.status === 'employed') {
    career = {
      ...career,
      pipActive: true,
      pipDaysRemaining: 60,
      warnings: career.warnings + 1,
    };
    events = prependEvent(events, {
      id: `evt-pip-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'career',
      headline: `PIP issued at ${career.employerName} — 60 days to improve`,
      tone: 'warning',
    });
  }

  return {
    ...world,
    career,
    banking: { ...world.banking, monthlySalaryCents: career.monthlySalaryCents },
    events,
  };
}

function applyMonthlyTenure(world: WorldInstance): WorldInstance {
  const day = Number(world.currentDate.slice(8, 10));
  if (day !== 1 || world.career.status === 'unemployed') {
    return world;
  }

  const monthsInRole = world.career.monthsInRole + 1;
  const yearsExperience =
    monthsInRole % 12 === 0
      ? world.career.yearsExperience + 1
      : world.career.yearsExperience;

  return {
    ...world,
    career: {
      ...world.career,
      monthsInRole,
      yearsExperience,
    },
  };
}

function applyPipTick(world: WorldInstance): WorldInstance {
  if (!world.career.pipActive) {
    return world;
  }

  const pipDaysRemaining = world.career.pipDaysRemaining - 1;
  if (world.career.performanceScore >= 70) {
    return {
      ...world,
      career: {
        ...world.career,
        pipActive: false,
        pipDaysRemaining: 0,
      },
      events: prependEvent(world.events, {
        id: `evt-pip-clear-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career',
        headline: `PIP cleared at ${world.career.employerName}`,
        tone: 'success',
      }),
    };
  }

  if (pipDaysRemaining <= 0) {
    return {
      ...world,
      career: {
        ...world.career,
        status: 'unemployed',
        jobTitle: 'Seeking work',
        employerName: '—',
        monthlySalaryCents: 0,
        unemployedSinceDate: world.currentDate,
        pipActive: false,
        pipDaysRemaining: 0,
        monthsInRole: 0,
        performanceScore: clamp(world.career.performanceScore - 10, 0, 100),
      },
      banking: { ...world.banking, monthlySalaryCents: 0 },
      events: prependEvent(world.events, {
        id: `evt-terminated-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career',
        headline: `Terminated from ${world.career.employerName} after failed PIP`,
        tone: 'warning',
      }),
    };
  }

  return {
    ...world,
    career: { ...world.career, pipDaysRemaining },
  };
}

function resolvePendingApplications(world: WorldInstance): WorldInstance {
  const pending = world.career.applications.filter(
    (application) =>
      application.status === 'pending' &&
      application.resolveOnDate &&
      application.resolveOnDate <= world.currentDate,
  );
  if (pending.length === 0) {
    return world;
  }

  let nextWorld = world;
  for (const application of pending) {
    if (nextWorld.career.status !== 'unemployed') {
      nextWorld = {
        ...nextWorld,
        career: {
          ...nextWorld.career,
          applications: nextWorld.career.applications.map((item) =>
            item.id === application.id
              ? {
                  ...item,
                  status: 'rejected' as const,
                  rejectionReason: 'Already employed when offer arrived',
                }
              : item,
          ),
        },
      };
      continue;
    }

    const listing = getJobListingById(application.listingId);
    const match =
      listing != null
        ? jobListingMatchScore(listing, nextWorld.career.performanceScore, nextWorld.education)
        : application.matchScore;
    const success = match >= 62 || (match >= 50 && nextWorld.clock.tickCount % 4 === 0);

    if (!success || !listing) {
      nextWorld = {
        ...nextWorld,
        career: {
          ...nextWorld.career,
          applications: nextWorld.career.applications.map((item) =>
            item.id === application.id
              ? {
                  ...item,
                  status: 'rejected' as const,
                  rejectionReason:
                    match < 55
                      ? 'GPA/credentials or interview performance below bar'
                      : 'Stronger candidates selected',
                }
              : item,
          ),
        },
        player: {
          ...nextWorld.player,
          traits: {
            ...nextWorld.player.traits,
            stress: clamp(nextWorld.player.traits.stress + 4, 0, 100),
          },
        },
        events: prependEvent(nextWorld.events, {
          id: `evt-job-reject-${nextWorld.clock.tickCount}-${application.id}`,
          tickCount: nextWorld.clock.tickCount,
          date: nextWorld.currentDate,
          category: 'career',
          headline: `Application declined — ${application.listingTitle}`,
          tone: 'warning',
        }),
      };
      continue;
    }

    nextWorld = {
      ...nextWorld,
      career: {
        ...nextWorld.career,
        status: 'employed',
        jobTitle: listing.title,
        employerName: listing.employerName,
        monthlySalaryCents: listing.monthlySalaryCents,
        performanceScore: clamp(nextWorld.career.performanceScore + 3, 0, 100),
        unemployedSinceDate: null,
        monthsInRole: 0,
        pipActive: false,
        pipDaysRemaining: 0,
        applications: nextWorld.career.applications.map((item) =>
          item.id === application.id ? { ...item, status: 'accepted' as const } : item,
        ),
      },
      banking: {
        ...nextWorld.banking,
        monthlySalaryCents: listing.monthlySalaryCents,
      },
      events: prependEvent(nextWorld.events, {
        id: `evt-job-hire-${nextWorld.clock.tickCount}`,
        tickCount: nextWorld.clock.tickCount,
        date: nextWorld.currentDate,
        category: 'career',
        headline: `Hired as ${listing.title} at ${listing.employerName}`,
        tone: 'success',
      }),
    };
  }

  return nextWorld;
}

export function careerHeadline(career: CareerState): string {
  if (career.status === 'unemployed') {
    return 'Job market tightens — credentials and performance decide callbacks';
  }
  if (career.pipActive) {
    return `PIP active at ${career.employerName} — ${career.pipDaysRemaining} days left`;
  }
  if (career.performanceScore >= 85) {
    return `${career.jobTitle} performance strong — promotions still require tenure`;
  }
  return `${career.employerName} reviews ${career.jobTitle} this quarter`;
}

export function daysUntilApplicationResolve(appliedDate: string, currentDate: string): number {
  const start = Date.parse(`${appliedDate}T12:00:00`);
  const end = Date.parse(`${currentDate}T12:00:00`);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return JOB_APPLICATION_RESOLVE_DAYS;
  }
  const elapsed = Math.floor((end - start) / (24 * 60 * 60 * 1000));
  return Math.max(0, JOB_APPLICATION_RESOLVE_DAYS - elapsed);
}

function prependEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  return [event, ...events].slice(0, 50);
}
