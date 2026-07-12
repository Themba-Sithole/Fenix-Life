import type { WorldImpactTag } from './world-impact.js';

export type SimEventCategory = 'finance' | 'career' | 'news' | 'life';
export type SimEventTone = 'success' | 'info' | 'warning';

export interface SimEvent {
  id: string;
  tickCount: number;
  date: string;
  category: SimEventCategory;
  headline: string;
  tone: SimEventTone;
  /** Optional world-mutating impact — BitLife headlines that change the game. */
  impact?: WorldImpactTag;
}
