import type { LifePath } from './life-path.js';
import type { CitizenTraits } from './citizen.js';
import type { EducationState } from './education.js';
import type { WorldInstance } from './world-instance.js';

export interface AdolescenceChoiceOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly effectHint: string;
}

export interface AdolescenceStep {
  readonly id: string;
  readonly age: number;
  readonly title: string;
  readonly prompt: string;
  readonly choices: readonly AdolescenceChoiceOption[];
}

export const ADOLESCENCE_STEP_IDS = [
  'step-13-social',
  'step-14-activity',
  'step-15-study',
  'step-16-track',
  'step-17-senior',
] as const;

export type AdolescenceStepId = (typeof ADOLESCENCE_STEP_IDS)[number];

export function isAdolescenceStepId(value: string): value is AdolescenceStepId {
  return (ADOLESCENCE_STEP_IDS as readonly string[]).includes(value);
}

/** GDD §4.3 — five guided adolescent decisions (ages 13–17) before age 18. */
export function getAdolescenceSteps(lifePath: LifePath): AdolescenceStep[] {
  const suggestedTrack = suggestedTrackChoiceId(lifePath);

  return [
    {
      id: 'step-13-social',
      age: 13,
      title: 'Middle school social life',
      prompt: 'Age 13 — how do you navigate new social circles?',
      choices: [
        {
          id: 'team-leader',
          label: 'Team leader',
          description: 'Organize classmates and take initiative in group projects.',
          effectHint: '+Openness, +Conscientiousness',
        },
        {
          id: 'quiet-study',
          label: 'Quiet study group',
          description: 'Small circle focused on grades and stability.',
          effectHint: '+Conscientiousness, stable happiness',
        },
        {
          id: 'rebel-clique',
          label: 'Rebel clique',
          description: 'Push boundaries and chase excitement.',
          effectHint: '+Happiness, +Stress',
        },
        {
          id: 'volunteer',
          label: 'Community volunteer',
          description: 'Help locally and build early Social Capital.',
          effectHint: '+Openness, +Happiness',
        },
      ],
    },
    {
      id: 'step-14-activity',
      age: 14,
      title: 'After-school focus',
      prompt: 'Age 14 — what do you invest spare time in?',
      choices: [
        {
          id: 'sports',
          label: 'Team sports',
          description: 'Build discipline and health through competition.',
          effectHint: '+Health, +Energy',
        },
        {
          id: 'arts',
          label: 'Arts & performance',
          description: 'Develop creativity and social confidence.',
          effectHint: '+Openness, +Happiness',
        },
        {
          id: 'coding-club',
          label: 'Coding club',
          description: 'Learn technical problem-solving early.',
          effectHint: '+Conscientiousness, +Openness',
        },
        {
          id: 'business-club',
          label: 'Business club',
          description: 'Pitch ideas and meet local mentors.',
          effectHint: '+Openness, career performance',
        },
      ],
    },
    {
      id: 'step-15-study',
      age: 15,
      title: 'Study effort',
      prompt: 'Age 15 — how hard do you push academically?',
      choices: [
        {
          id: 'high-effort',
          label: 'High effort',
          description: 'Grind through exams and honor roll pressure.',
          effectHint: '+Conscientiousness, +Stress',
        },
        {
          id: 'balanced',
          label: 'Balanced',
          description: 'Keep grades solid without burning out.',
          effectHint: '+Conscientiousness, stable happiness',
        },
        {
          id: 'low-effort',
          label: 'Low effort',
          description: 'Prioritize social life over grades.',
          effectHint: '+Happiness, −Conscientiousness',
        },
      ],
    },
    {
      id: 'step-16-track',
      age: 16,
      title: 'Path fork',
      prompt: 'Age 16 — which direction calls to you?',
      choices: [
        {
          id: 'university-track',
          label: 'University track',
          description: 'Aim for credentials and alumni networks.',
          effectHint: 'Enrolls university prep',
        },
        {
          id: 'trade-track',
          label: 'Trade certification',
          description: 'Skilled labor path with faster income potential.',
          effectHint: 'Trade program enrollment',
        },
        {
          id: 'work-prep',
          label: 'Work-first prep',
          description: 'Part-time jobs and employability skills.',
          effectHint: '+Career performance',
        },
        {
          id: 'entrepreneur-track',
          label: 'Early entrepreneurship',
          description: 'Side hustles and small ventures.',
          effectHint: '+Openness, business affinity',
        },
      ],
    },
    {
      id: 'step-17-senior',
      age: 17,
      title: 'Senior year',
      prompt: `Age 17 — final year before adulthood${suggestedTrack ? ` (suggested: ${labelForTrack(suggestedTrack)})` : ''}.`,
      choices: [
        {
          id: 'internship',
          label: 'Internship focus',
          description: 'Resume-building experience over parties.',
          effectHint: '+Career performance, +Stress',
        },
        {
          id: 'social-network',
          label: 'Social network',
          description: 'Deepen friendships and community ties.',
          effectHint: '+Openness, +Happiness',
        },
        {
          id: 'part-time-job',
          label: 'Part-time job',
          description: 'Earn pocket money and work ethic.',
          effectHint: '+Conscientiousness, +Performance',
        },
      ],
    },
  ];
}

function suggestedTrackChoiceId(lifePath: LifePath): string | null {
  switch (lifePath) {
    case 'corporate-ladder':
      return 'university-track';
    case 'business-founder':
      return 'entrepreneur-track';
    case 'market-wizard':
      return 'university-track';
    default:
      return null;
  }
}

function labelForTrack(trackId: string): string {
  switch (trackId) {
    case 'university-track':
      return 'University';
    case 'trade-track':
      return 'Trade';
    case 'work-prep':
      return 'Work prep';
    case 'entrepreneur-track':
      return 'Entrepreneurship';
    default:
      return trackId;
  }
}

export function getNextAdolescenceStep(
  steps: readonly AdolescenceStep[],
  choices: Readonly<Record<string, string>>,
): AdolescenceStep | null {
  return steps.find((step) => choices[step.id] === undefined) ?? null;
}

export function isAdolescencePlayComplete(
  choices: Readonly<Record<string, string>>,
): boolean {
  return ADOLESCENCE_STEP_IDS.every((stepId) => choices[stepId] !== undefined);
}

function clampTrait(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function applyTraitDelta(traits: CitizenTraits, delta: Partial<CitizenTraits>): CitizenTraits {
  return {
    conscientiousness: clampTrait(traits.conscientiousness + (delta.conscientiousness ?? 0)),
    openness: clampTrait(traits.openness + (delta.openness ?? 0)),
    happiness: clampTrait(traits.happiness + (delta.happiness ?? 0)),
    health: clampTrait(traits.health + (delta.health ?? 0)),
    energy: clampTrait(traits.energy + (delta.energy ?? 0)),
    stress: clampTrait(traits.stress + (delta.stress ?? 0)),
  };
}

function applyChoiceEffects(
  world: WorldInstance,
  stepId: AdolescenceStepId,
  choiceId: string,
): WorldInstance {
  let traits = world.player.traits;
  let education = world.education;
  let career = world.career;

  if (stepId === 'step-13-social') {
    switch (choiceId) {
      case 'team-leader':
        traits = applyTraitDelta(traits, { openness: 5, conscientiousness: 4 });
        break;
      case 'quiet-study':
        traits = applyTraitDelta(traits, { conscientiousness: 5, happiness: 2 });
        break;
      case 'rebel-clique':
        traits = applyTraitDelta(traits, { happiness: 6, stress: 5, conscientiousness: -3 });
        break;
      case 'volunteer':
        traits = applyTraitDelta(traits, { openness: 4, happiness: 4 });
        break;
      default:
        break;
    }
  }

  if (stepId === 'step-14-activity') {
    switch (choiceId) {
      case 'sports':
        traits = applyTraitDelta(traits, { health: 5, energy: 4, conscientiousness: 2 });
        break;
      case 'arts':
        traits = applyTraitDelta(traits, { openness: 6, happiness: 4 });
        break;
      case 'coding-club':
        traits = applyTraitDelta(traits, { conscientiousness: 4, openness: 5 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 3) };
        break;
      case 'business-club':
        traits = applyTraitDelta(traits, { openness: 5 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 4) };
        break;
      default:
        break;
    }
  }

  if (stepId === 'step-15-study') {
    switch (choiceId) {
      case 'high-effort':
        traits = applyTraitDelta(traits, { conscientiousness: 8, stress: 6 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 5) };
        break;
      case 'balanced':
        traits = applyTraitDelta(traits, { conscientiousness: 4, happiness: 2 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 2) };
        break;
      case 'low-effort':
        traits = applyTraitDelta(traits, { happiness: 5, conscientiousness: -4 });
        break;
      default:
        break;
    }
  }

  if (stepId === 'step-16-track') {
    education = applyTrackEducation(education, choiceId);
    switch (choiceId) {
      case 'university-track':
        traits = applyTraitDelta(traits, { conscientiousness: 3, openness: 2 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 3) };
        break;
      case 'trade-track':
        traits = applyTraitDelta(traits, { conscientiousness: 5, energy: 2 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 4) };
        break;
      case 'work-prep':
        traits = applyTraitDelta(traits, { conscientiousness: 4 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 6) };
        break;
      case 'entrepreneur-track':
        traits = applyTraitDelta(traits, { openness: 6, stress: 3 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 4) };
        break;
      default:
        break;
    }
  }

  if (stepId === 'step-17-senior') {
    switch (choiceId) {
      case 'internship':
        traits = applyTraitDelta(traits, { stress: 4, conscientiousness: 3 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 8) };
        break;
      case 'social-network':
        traits = applyTraitDelta(traits, { openness: 6, happiness: 5 });
        break;
      case 'part-time-job':
        traits = applyTraitDelta(traits, { conscientiousness: 5, energy: -3 });
        career = { ...career, performanceScore: clampTrait(career.performanceScore + 6) };
        break;
      default:
        break;
    }
  }

  return {
    ...world,
    player: { ...world.player, traits },
    education,
    career,
  };
}

function applyTrackEducation(education: EducationState, choiceId: string): EducationState {
  switch (choiceId) {
    case 'university-track':
      return {
        ...education,
        programName: 'Undergraduate Degree',
        institution: 'City University',
        gpa: 0,
        creditsCompleted: 0,
        creditsRequired: 120,
        enrolled: true,
      };
    case 'trade-track':
      return {
        ...education,
        programName: 'Trade Skills Program',
        institution: 'Community College',
        gpa: 0,
        creditsCompleted: 0,
        creditsRequired: 60,
        enrolled: true,
      };
    default:
      return education;
  }
}

export function applyAdolescenceChoice(
  world: WorldInstance,
  stepId: string,
  choiceId: string,
): WorldInstance {
  if (world.onboarding.adolescencePlayCompleted) {
    throw new Error('Adolescence play is already complete');
  }
  if (!isAdolescenceStepId(stepId)) {
    throw new Error('Unknown adolescence step');
  }
  if (world.onboarding.adolescenceChoices[stepId] !== undefined) {
    throw new Error('This year has already been decided');
  }

  const steps = getAdolescenceSteps(world.lifePath);
  const step = steps.find((item) => item.id === stepId);
  if (!step) {
    throw new Error('Adolescence step not found');
  }
  const choice = step.choices.find((item) => item.id === choiceId);
  if (!choice) {
    throw new Error('Invalid choice for this step');
  }

  const nextChoices = { ...world.onboarding.adolescenceChoices, [stepId]: choiceId };
  let nextWorld = applyChoiceEffects(world, stepId, choiceId);

  const complete = isAdolescencePlayComplete(nextChoices);

  nextWorld = {
    ...nextWorld,
    onboarding: {
      ...nextWorld.onboarding,
      adolescenceChoices: nextChoices,
      adolescencePlayCompleted: complete,
    },
    events: [
      {
        id: `evt-teen-${stepId}-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `Age ${step.age}: chose ${choice.label.toLowerCase()}`,
        tone: 'info' as const,
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };

  return nextWorld;
}

/** Life-path suggested defaults when player skips interactive play (GDD §4.3, §6.3). */
export function buildSuggestedAdolescenceChoices(lifePath: LifePath): Record<AdolescenceStepId, string> {
  switch (lifePath) {
    case 'business-founder':
      return {
        'step-13-social': 'team-leader',
        'step-14-activity': 'business-club',
        'step-15-study': 'balanced',
        'step-16-track': 'entrepreneur-track',
        'step-17-senior': 'part-time-job',
      };
    case 'corporate-ladder':
      return {
        'step-13-social': 'quiet-study',
        'step-14-activity': 'coding-club',
        'step-15-study': 'high-effort',
        'step-16-track': 'university-track',
        'step-17-senior': 'internship',
      };
    case 'market-wizard':
      return {
        'step-13-social': 'quiet-study',
        'step-14-activity': 'coding-club',
        'step-15-study': 'high-effort',
        'step-16-track': 'university-track',
        'step-17-senior': 'internship',
      };
    case 'family-first':
      return {
        'step-13-social': 'volunteer',
        'step-14-activity': 'sports',
        'step-15-study': 'balanced',
        'step-16-track': 'work-prep',
        'step-17-senior': 'social-network',
      };
    case 'free-spirit':
      return {
        'step-13-social': 'rebel-clique',
        'step-14-activity': 'arts',
        'step-15-study': 'low-effort',
        'step-16-track': 'work-prep',
        'step-17-senior': 'social-network',
      };
    case 'undecided':
      return {
        'step-13-social': 'volunteer',
        'step-14-activity': 'sports',
        'step-15-study': 'balanced',
        'step-16-track': 'work-prep',
        'step-17-senior': 'part-time-job',
      };
    default: {
      const _exhaustive: never = lifePath;
      return _exhaustive;
    }
  }
}

/** Skip interactive adolescence with life-path defaults; childhood summary shows outcomes. */
export function skipAdolescencePlay(world: WorldInstance): WorldInstance {
  if (world.onboarding.adolescencePlayCompleted) {
    throw new Error('Adolescence play is already complete');
  }

  const choices = buildSuggestedAdolescenceChoices(world.lifePath);
  let nextWorld = world;

  for (const stepId of ADOLESCENCE_STEP_IDS) {
    nextWorld = applyChoiceEffects(nextWorld, stepId, choices[stepId]);
  }

  return {
    ...nextWorld,
    onboarding: {
      ...nextWorld.onboarding,
      adolescenceChoices: choices,
      adolescencePlayCompleted: true,
    },
    events: [
      {
        id: `evt-teen-skip-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: 'Adolescence summarized — suggested path applied',
        tone: 'info' as const,
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };
}

export function describeAdolescenceChoices(
  choices: Readonly<Record<string, string>>,
): string {
  const labels: string[] = [];
  if (choices['step-16-track']) {
    labels.push(labelForTrack(choices['step-16-track']));
  }
  if (choices['step-14-activity']) {
    labels.push(choices['step-14-activity'].replace(/-/g, ' '));
  }
  if (choices['step-17-senior']) {
    labels.push(choices['step-17-senior'].replace(/-/g, ' '));
  }
  return labels.length > 0 ? labels.join(' · ') : 'Standard adolescence';
}
