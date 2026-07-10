export type SimEventCategory = 'finance' | 'career' | 'news' | 'life';
export type SimEventTone = 'success' | 'info' | 'warning';

export interface SimEvent {
  id: string;
  tickCount: number;
  date: string;
  category: SimEventCategory;
  headline: string;
  tone: SimEventTone;
}
