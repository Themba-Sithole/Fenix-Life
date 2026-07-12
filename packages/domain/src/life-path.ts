/** GDD §6.3 — UX hints only; never hard locks gameplay. */
export type LifePath =
  | 'business-founder'
  | 'corporate-ladder'
  | 'market-wizard'
  | 'family-first'
  | 'free-spirit'
  | 'undecided';

export type LifeStage =
  | 'young-adult'
  | 'establishment'
  | 'peak'
  | 'pre-retirement'
  | 'retirement'
  | 'elder';

export function isLifePath(value: string): value is LifePath {
  switch (value) {
    case 'business-founder':
    case 'corporate-ladder':
    case 'market-wizard':
    case 'family-first':
    case 'free-spirit':
    case 'undecided':
      return true;
    default:
      return false;
  }
}

export function lifePathLabel(path: LifePath): string {
  switch (path) {
    case 'business-founder':
      return 'Business Founder';
    case 'corporate-ladder':
      return 'Corporate Ladder';
    case 'market-wizard':
      return 'Market Wizard';
    case 'family-first':
      return 'Family First';
    case 'free-spirit':
      return 'Free Spirit';
    case 'undecided':
      return 'Undecided';
    default: {
      const _exhaustive: never = path;
      return _exhaustive;
    }
  }
}

export function lifeStageForAge(ageYears: number): LifeStage {
  if (ageYears < 26) {
    return 'young-adult';
  }
  if (ageYears < 41) {
    return 'establishment';
  }
  if (ageYears < 56) {
    return 'peak';
  }
  if (ageYears < 65) {
    return 'pre-retirement';
  }
  if (ageYears < 80) {
    return 'retirement';
  }
  return 'elder';
}
