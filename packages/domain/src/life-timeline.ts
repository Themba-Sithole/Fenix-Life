import { companyMonthlyProfitCents } from './company.js';
import { totalNetWorthCents } from './banking.js';
import { housingTotalValueCents } from './housing.js';
import { portfolioValueCents } from './portfolio.js';
import { transportationTotalValueCents } from './transportation.js';
import { formatOriginLocation } from './location-helpers.js';
import type { WorldInstance } from './world-instance.js';

export type TimelineCategory = 'life' | 'finance' | 'career' | 'family' | 'news';

export interface TimelineEntry {
  readonly id: string;
  readonly gameDate: string;
  readonly calendarYear: number;
  readonly ageYears: number;
  readonly title: string;
  readonly description: string;
  readonly category: TimelineCategory;
}

export interface LegacySnapshot {
  readonly score: number;
  readonly label: string;
  readonly achievementCount: number;
  readonly netWorthCents: number;
  readonly ageYears: number;
}

function parseBirthYear(currentDate: string, ageYears: number): number {
  const year = Number.parseInt(currentDate.slice(0, 4), 10);
  return Number.isNaN(year) ? 2000 : year - ageYears;
}

export function buildLifeTimeline(world: WorldInstance): TimelineEntry[] {
  const birthYear = parseBirthYear(world.currentDate, world.player.ageYears);
  const milestones: TimelineEntry[] = [
    {
      id: 'tl-born',
      gameDate: `${birthYear}-01-01`,
      calendarYear: birthYear,
      ageYears: 0,
      title: 'Born',
      description: `Born in ${formatOriginLocation(world.origin)}`,
      category: 'life',
    },
    {
      id: 'tl-grad-hs',
      gameDate: `${birthYear + 18}-06-01`,
      calendarYear: birthYear + 18,
      ageYears: 18,
      title: 'Finished secondary school',
      description: 'Completed core education requirements',
      category: 'life',
    },
    {
      id: 'tl-career-start',
      gameDate: `${birthYear + 22}-03-01`,
      calendarYear: birthYear + 22,
      ageYears: 22,
      title: 'Career start',
      description: `${world.career.jobTitle} at ${world.career.employerName}`,
      category: 'career',
    },
  ];

  if (world.career.status === 'founder') {
    milestones.push({
      id: 'tl-founded',
      gameDate: `${birthYear + 24}-01-01`,
      calendarYear: birthYear + 24,
      ageYears: 24,
      title: `Founded ${world.company.name}`,
      description: 'Launched an independent venture',
      category: 'career',
    });
  }

  const eventEntries: TimelineEntry[] = world.events.map((event) => ({
    id: event.id,
    gameDate: event.date,
    calendarYear: Number.parseInt(event.date.slice(0, 4), 10) || birthYear,
    ageYears: world.player.ageYears,
    title: event.category === 'finance' ? 'Financial milestone' : 'Life event',
    description: event.headline,
    category:
      event.category === 'news'
        ? 'news'
        : event.category === 'career'
          ? 'career'
          : event.category === 'finance'
            ? 'finance'
            : 'life',
  }));

  milestones.push({
    id: 'tl-present',
    gameDate: world.currentDate,
    calendarYear: Number.parseInt(world.currentDate.slice(0, 4), 10) || birthYear,
    ageYears: world.player.ageYears,
    title: 'Present day',
    description: `${world.career.jobTitle} · Day ${world.clock.tickCount + 1}`,
    category: 'life',
  });

  return [...milestones, ...eventEntries]
    .sort((left, right) => left.gameDate.localeCompare(right.gameDate))
    .slice(-24);
}

export function computeLegacySnapshot(world: WorldInstance): LegacySnapshot {
  const netWorth =
    totalNetWorthCents(world.banking) +
    portfolioValueCents(world.portfolio.holdings, world.portfolio.quotes) +
    housingTotalValueCents(world.housing) +
    transportationTotalValueCents(world.transportation);

  const profit = companyMonthlyProfitCents(world.company);
  const achievementCount = world.events.length;
  const rawScore =
    world.player.ageYears * 0.08 +
    Math.log10(Math.max(netWorth / 100, 1)) * 1.4 +
    world.company.marketSharePct * 0.12 +
    (profit > 0 ? 0.8 : 0) +
    achievementCount * 0.05;

  const score = Math.min(10, Math.max(0, Number(rawScore.toFixed(1))));
  const label =
    score >= 9 ? 'Exceptional' : score >= 7 ? 'Strong' : score >= 5 ? 'Growing' : 'Early';

  return {
    score,
    label,
    achievementCount,
    netWorthCents: netWorth,
    ageYears: world.player.ageYears,
  };
}
