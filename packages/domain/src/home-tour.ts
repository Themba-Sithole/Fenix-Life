/** GDD §6.2 — first Home visit guided tour steps (UX hints only). */
export interface HomeTourStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetPath?: string;
  readonly teachingMoment: string;
}

export const HOME_TOUR_STEPS: readonly HomeTourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to young adulthood',
    description: 'You are a citizen in a living world — the same rules apply to everyone.',
    teachingMoment: 'Home is your command center for time, vitals, and quick actions.',
  },
  {
    id: 'quick-actions',
    title: 'Quick actions',
    description: 'Phone, City, Banking, Career, and more live here — tap any tile to explore.',
    teachingMoment: 'Diegetic domains replace abstract menus.',
  },
  {
    id: 'banking',
    title: 'Banking — three numbers',
    description: 'Open Banking to see cash, credit, and monthly burn.',
    targetPath: '/banking',
    teachingMoment: 'Runway = liquid cash ÷ monthly expenses.',
  },
  {
    id: 'news',
    title: 'Living world news',
    description: 'Read at least one headline — the economy moves without you.',
    targetPath: '/news',
    teachingMoment: 'Competitors and markets advance while you play.',
  },
  {
    id: 'career',
    title: 'Human Capital',
    description: 'Browse jobs on Career or invest in Education credentials.',
    targetPath: '/career',
    teachingMoment: 'Micro choices (apply, study) link to meso career arcs.',
  },
  {
    id: 'advance-time',
    title: 'Advance time',
    description: 'Use Advance Day or time controls to complete your first in-game month.',
    teachingMoment: 'Meso loop: decisions → time passes → consequences.',
  },
  {
    id: 'offline-teaser',
    title: 'While you were away',
    description: 'When you return later, a summary catches you up on what changed.',
    teachingMoment: 'The world continues offline — plan accordingly.',
  },
] as const;

export type HomeTourStepId = (typeof HOME_TOUR_STEPS)[number]['id'];
