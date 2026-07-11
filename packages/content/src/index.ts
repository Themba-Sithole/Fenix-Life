import headlinesPack from '../../../content/headlines/news-headlines.json' with { type: 'json' };
import occupationsPack from '../../../content/occupations/starter.json' with { type: 'json' };
import industriesPack from '../../../content/industries/starter.json' with { type: 'json' };

export interface ContentHeadline {
  readonly id: string;
  readonly template: string;
  readonly tags: readonly string[];
}

export interface ContentOccupation {
  readonly id: string;
  readonly title: string;
  readonly sector: string;
  readonly salaryBandCents: number;
}

export interface ContentIndustry {
  readonly id: string;
  readonly name: string;
  readonly growthRate: number;
  readonly volatility: number;
}

export const NEWS_HEADLINES = headlinesPack.headlines as ContentHeadline[];
export const STARTER_OCCUPATIONS = occupationsPack.occupations as ContentOccupation[];
export const STARTER_INDUSTRIES = industriesPack.industries as ContentIndustry[];

function seededIndex(seed: string, length: number): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(31, hash) + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % Math.max(length, 1);
}

export function pickNewsHeadline(
  seed: string,
  context: {
    city?: string;
    index?: number;
    inflation?: number;
    industry?: string;
  } = {},
): string {
  const headline = NEWS_HEADLINES[seededIndex(seed, NEWS_HEADLINES.length)];
  if (!headline) {
    return 'Markets open with steady volume across major sectors';
  }

  return headline.template
    .replace('{city}', context.city ?? 'the region')
    .replace('{index}', (context.index ?? 100).toFixed(1))
    .replace('{inflation}', (context.inflation ?? 3).toFixed(1))
    .replace('{industry}', context.industry ?? 'Growth');
}

export function getOccupationById(id: string): ContentOccupation | undefined {
  return STARTER_OCCUPATIONS.find((occupation) => occupation.id === id);
}

export function getIndustryById(id: string): ContentIndustry | undefined {
  return STARTER_INDUSTRIES.find((industry) => industry.id === id);
}
