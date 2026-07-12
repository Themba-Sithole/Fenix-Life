import type { LifePath } from './life-path.js';
import { lifePathLabel } from './life-path.js';
import { describeAdolescenceChoices } from './adolescence-play.js';
import type { WorldInstance } from './world-instance.js';
import type { SimEvent } from './sim-event.js';

export interface OnboardingState {
  readonly childhoodSummarySeen: boolean;
  readonly lifePathHintsSeen: boolean;
  readonly firstYearSimulated: boolean;
  readonly adolescencePlayCompleted: boolean;
  readonly adolescenceChoices: Readonly<Record<string, string>>;
  readonly homeTourCompleted: boolean;
}

export interface ChildhoodSummaryBeat {
  readonly ageRange: string;
  readonly title: string;
  readonly description: string;
  readonly capital: 'human' | 'social' | 'financial' | 'legacy';
}

export interface ChildhoodSummary {
  readonly headline: string;
  readonly beats: ChildhoodSummaryBeat[];
  readonly traitNotes: string[];
}

export interface LifePathHintAction {
  readonly label: string;
  readonly path: string;
  readonly reason: string;
}

export function createDefaultOnboarding(seen = false): OnboardingState {
  return {
    childhoodSummarySeen: seen,
    lifePathHintsSeen: seen,
    firstYearSimulated: false,
    adolescencePlayCompleted: seen,
    adolescenceChoices: {},
    homeTourCompleted: seen,
  };
}

/** GDD §4.2–4.3 — background-shaped childhood recap (not a playable chapter in EA). */
export function buildChildhoodSummary(params: {
  background: string;
  lifePath: LifePath;
  playerName: string;
  adolescenceChoices?: Readonly<Record<string, string>>;
}): ChildhoodSummary {
  const firstName = params.playerName.trim().split(/\s+/)[0] || 'You';
  const beats = backgroundBeats(params.background, params.lifePath, params.adolescenceChoices);
  const traitNotes = backgroundTraitNotes(params.background);

  if (params.adolescenceChoices && Object.keys(params.adolescenceChoices).length > 0) {
    traitNotes.push(`Your teen years: ${describeAdolescenceChoices(params.adolescenceChoices)}`);
  }

  return {
    headline: `${firstName}'s path to adulthood`,
    beats,
    traitNotes,
  };
}

function backgroundBeats(
  background: string,
  lifePath: LifePath,
  adolescenceChoices?: Readonly<Record<string, string>>,
): ChildhoodSummaryBeat[] {
  const common: ChildhoodSummaryBeat[] = [
    {
      ageRange: 'Ages 3–12',
      title: 'Childhood foundations',
      description: 'School, hobbies, and family bonds shaped early affinities.',
      capital: 'human',
    },
    {
      ageRange: 'Ages 13–17',
      title: 'Adolescence',
      description: adolescenceChoices && Object.keys(adolescenceChoices).length > 0
        ? `Your choices shaped this period: ${describeAdolescenceChoices(adolescenceChoices)}.`
        : adolescenceDescription(lifePath),
      capital: 'social',
    },
    {
      ageRange: 'Age 18',
      title: 'Young adulthood begins',
      description: 'You enter the world with a clean slate — no job, no company, no assets yet.',
      capital: 'financial',
    },
  ];

  const backgroundBeat = backgroundOpeningBeat(background);
  return backgroundBeat ? [backgroundBeat, ...common] : common;
}

function adolescenceDescription(lifePath: LifePath): string {
  switch (lifePath) {
    case 'business-founder':
      return 'Side projects and business clubs sparked an entrepreneurial curiosity.';
    case 'corporate-ladder':
      return 'University track selected — credentials and internships lie ahead.';
    case 'market-wizard':
      return 'Finance club and math competitions built market literacy early.';
    case 'family-first':
      return 'Strong family ties and community roots defined your social world.';
    case 'free-spirit':
      return 'Exploring the city and local news fed a restless curiosity.';
    case 'undecided':
      return 'Multiple interests competed — no single path locked in yet.';
    default: {
      const _exhaustive: never = lifePath;
      return _exhaustive;
    }
  }
}

function backgroundOpeningBeat(background: string): ChildhoodSummaryBeat | null {
  switch (background) {
    case 'wealthy':
      return {
        ageRange: 'Ages 3–12',
        title: 'Privileged upbringing',
        description: 'Private schooling and high expectations — plus family scrutiny.',
        capital: 'social',
      };
    case 'orphan':
      return {
        ageRange: 'Ages 3–12',
        title: 'Foster system years',
        description: 'Minimal safety net forged independence early.',
        capital: 'legacy',
      };
    case 'immigrant':
      return {
        ageRange: 'Ages 3–12',
        title: 'New country, new rules',
        description: 'Credential transfer friction and diaspora networks shaped your outlook.',
        capital: 'human',
      };
    case 'entrepreneur-family':
      return {
        ageRange: 'Ages 3–12',
        title: 'Business at the dinner table',
        description: 'Early exposure to entrepreneurship — and comparison pressure.',
        capital: 'financial',
      };
    case 'working-class':
      return {
        ageRange: 'Ages 3–12',
        title: 'Working-class household',
        description: 'Resilience and work ethic learned through scarcity, not privilege.',
        capital: 'human',
      };
    default:
      return null;
  }
}

function backgroundTraitNotes(background: string): string[] {
  switch (background) {
    case 'wealthy':
      return ['Family credit line available — not liquid cash', 'Higher lifestyle expenses expected'];
    case 'orphan':
      return ['Minimal starting cash', 'Independence traits boosted'];
    case 'immigrant':
      return ['Multilingual edge', 'Credential friction in hiring markets'];
    case 'entrepreneur-family':
      return ['Business literacy from upbringing', 'No pre-built company — you start at zero'];
    case 'working-class':
      return ['Strong work ethic affinity', 'Credit constraints at start'];
    default:
      return ['Balanced starting package', 'No hidden stat boosts'];
  }
}

/** GDD §6.3 — UX hints for first Home visit. */
export function getLifePathHintActions(lifePath: LifePath): LifePathHintAction[] {
  switch (lifePath) {
    case 'business-founder':
      return [
        { label: 'Banking', path: '/banking', reason: 'Track runway before you incorporate' },
        { label: 'Company', path: '/company', reason: 'Found your first venture when ready' },
      ];
    case 'corporate-ladder':
      return [
        { label: 'Education', path: '/education', reason: 'Invest in Human Capital credentials' },
        { label: 'Career', path: '/career', reason: 'Apply for jobs when ready' },
        { label: 'Banking', path: '/banking', reason: 'Manage student-life expenses' },
      ];
    case 'market-wizard':
      return [
        { label: 'Stocks', path: '/stocks', reason: 'Build a portfolio from zero' },
        { label: 'Banking', path: '/banking', reason: 'Fund your first trades' },
      ];
    case 'family-first':
      return [
        { label: 'Family', path: '/family', reason: 'Strengthen Social Capital bonds' },
        { label: 'Timeline', path: '/timeline', reason: 'See your life arc unfold' },
      ];
    case 'free-spirit':
      return [
        { label: 'City', path: '/city', reason: 'Explore districts and opportunities' },
        { label: 'News', path: '/news', reason: 'The world moves whether you watch or not' },
      ];
    case 'undecided':
      return [
        { label: 'Banking', path: '/banking', reason: 'Three numbers to decide — start here' },
        { label: 'Career', path: '/career', reason: 'Browse jobs and apply when unemployed' },
        { label: 'News', path: '/news', reason: 'See what the living world is doing' },
        { label: 'Education', path: '/education', reason: 'Credentials open career doors' },
      ];
    default: {
      const _exhaustive: never = lifePath;
      return _exhaustive;
    }
  }
}

export function lifePathHintTitle(lifePath: LifePath): string {
  if (lifePath === 'undecided') {
    return 'Getting started';
  }
  return `Suggested focus: ${lifePathLabel(lifePath)}`;
}

function appendEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  return [event, ...events].slice(0, 50);
}

export function completeChildhoodOnboarding(
  world: WorldInstance,
  options?: { simulateFirstYear?: boolean },
): WorldInstance {
  const events = appendEvent(world.events, {
    id: `evt-onboard-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'life',
    headline: options?.simulateFirstYear
      ? `${world.player.displayName} completed their first year of adulthood`
      : `${world.player.displayName} begins young adulthood in earnest`,
    tone: 'info',
  });

  return {
    ...world,
    onboarding: {
      ...world.onboarding,
      childhoodSummarySeen: true,
      firstYearSimulated: options?.simulateFirstYear ?? world.onboarding.firstYearSimulated,
    },
    events,
  };
}

export function dismissLifePathHints(world: WorldInstance): WorldInstance {
  return {
    ...world,
    onboarding: {
      ...world.onboarding,
      lifePathHintsSeen: true,
    },
  };
}

export function dismissHomeTour(world: WorldInstance): WorldInstance {
  return {
    ...world,
    onboarding: {
      ...world.onboarding,
      homeTourCompleted: true,
    },
  };
}

/** In-game days for optional first-year onboarding simulation (GDD §6.2). */
export const ONBOARDING_FIRST_YEAR_DAYS = 365;
