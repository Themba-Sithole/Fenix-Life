import type { ContentOccupation } from './index.js';

/** Extended occupation catalogue beyond the starter JSON pack. */
export const EXTENDED_OCCUPATIONS: ReadonlyArray<ContentOccupation> = [
  // Finance
  { id: 'occ-fin-analyst-sr', title: 'Senior Financial Analyst', sector: 'finance', salaryBandCents: 7_200_00 },
  { id: 'occ-fin-cfo', title: 'Chief Financial Officer', sector: 'finance', salaryBandCents: 22_000_00 },
  { id: 'occ-fin-auditor', title: 'Internal Auditor', sector: 'finance', salaryBandCents: 5_800_00 },
  { id: 'occ-fin-trader', title: 'Equities Trader', sector: 'finance', salaryBandCents: 14_000_00 },
  { id: 'occ-fin-actuary', title: 'Actuary', sector: 'finance', salaryBandCents: 10_500_00 },
  // Technology
  { id: 'occ-tech-sr-eng', title: 'Senior Software Engineer', sector: 'tech', salaryBandCents: 12_000_00 },
  { id: 'occ-tech-principal', title: 'Principal Engineer', sector: 'tech', salaryBandCents: 17_000_00 },
  { id: 'occ-tech-data-sci', title: 'Data Scientist', sector: 'tech', salaryBandCents: 11_000_00 },
  { id: 'occ-tech-devops', title: 'DevOps Engineer', sector: 'tech', salaryBandCents: 10_000_00 },
  { id: 'occ-tech-cto', title: 'Chief Technology Officer', sector: 'tech', salaryBandCents: 25_000_00 },
  { id: 'occ-tech-ml-eng', title: 'ML Engineer', sector: 'tech', salaryBandCents: 13_500_00 },
  // Healthcare
  { id: 'occ-health-gp', title: 'General Practitioner', sector: 'healthcare', salaryBandCents: 15_000_00 },
  { id: 'occ-health-surgeon', title: 'Surgeon', sector: 'healthcare', salaryBandCents: 28_000_00 },
  { id: 'occ-health-pharmacist', title: 'Pharmacist', sector: 'healthcare', salaryBandCents: 9_000_00 },
  { id: 'occ-health-physio', title: 'Physiotherapist', sector: 'healthcare', salaryBandCents: 6_500_00 },
  // Education
  { id: 'occ-edu-professor', title: 'University Professor', sector: 'education', salaryBandCents: 9_500_00 },
  { id: 'occ-edu-principal', title: 'School Principal', sector: 'education', salaryBandCents: 8_000_00 },
  { id: 'occ-edu-tutor', title: 'Private Tutor', sector: 'education', salaryBandCents: 3_500_00 },
  // Law & Public Sector
  { id: 'occ-law-associate', title: 'Associate Attorney', sector: 'legal', salaryBandCents: 10_000_00 },
  { id: 'occ-law-partner', title: 'Law Firm Partner', sector: 'legal', salaryBandCents: 24_000_00 },
  { id: 'occ-gov-policy', title: 'Policy Analyst', sector: 'government', salaryBandCents: 6_200_00 },
  { id: 'occ-gov-diplomat', title: 'Diplomat', sector: 'government', salaryBandCents: 8_500_00 },
  // Creative
  { id: 'occ-creative-copywriter', title: 'Copywriter', sector: 'media', salaryBandCents: 5_000_00 },
  { id: 'occ-creative-director', title: 'Creative Director', sector: 'media', salaryBandCents: 12_000_00 },
  { id: 'occ-creative-ux', title: 'UX Researcher', sector: 'tech', salaryBandCents: 9_000_00 },
  // Entrepreneurship
  { id: 'occ-entre-ceo', title: 'CEO (Series A)', sector: 'entrepreneurship', salaryBandCents: 18_000_00 },
  { id: 'occ-entre-angel', title: 'Angel Investor', sector: 'entrepreneurship', salaryBandCents: 30_000_00 },
  // Skilled Trades & Blue-Collar
  { id: 'occ-trades-electrician', title: 'Master Electrician', sector: 'trades', salaryBandCents: 6_500_00 },
  { id: 'occ-trades-plumber', title: 'Plumber', sector: 'trades', salaryBandCents: 5_800_00 },
  { id: 'occ-trades-carpenter', title: 'Carpenter', sector: 'trades', salaryBandCents: 5_000_00 },
  // Sales & Customer Success
  { id: 'occ-sales-vp', title: 'VP of Sales', sector: 'sales', salaryBandCents: 16_000_00 },
  { id: 'occ-sales-csm', title: 'Customer Success Manager', sector: 'sales', salaryBandCents: 7_000_00 },
];

/** Extended industry catalogue with deeper sector coverage. */
export interface ContentIndustryExtended {
  readonly id: string;
  readonly name: string;
  readonly growthRate: number;
  readonly volatility: number;
  readonly sector: string;
  readonly description: string;
}

export const EXTENDED_INDUSTRIES: ReadonlyArray<ContentIndustryExtended> = [
  { id: 'ind-ai', name: 'Artificial Intelligence', growthRate: 0.18, volatility: 0.20, sector: 'tech', description: 'AI platforms, LLMs, automation tooling' },
  { id: 'ind-biotech', name: 'Biotechnology', growthRate: 0.10, volatility: 0.16, sector: 'healthcare', description: 'Drug discovery, genomics, medical devices' },
  { id: 'ind-fintech', name: 'FinTech', growthRate: 0.12, volatility: 0.14, sector: 'finance', description: 'Payments, neobanks, crypto infrastructure' },
  { id: 'ind-clean-energy', name: 'Clean Energy', growthRate: 0.09, volatility: 0.11, sector: 'energy', description: 'Solar, wind, battery storage' },
  { id: 'ind-saas', name: 'SaaS & Cloud', growthRate: 0.11, volatility: 0.13, sector: 'tech', description: 'B2B software subscriptions, cloud platforms' },
  { id: 'ind-ecommerce', name: 'E-Commerce', growthRate: 0.07, volatility: 0.09, sector: 'retail', description: 'Online retail, fulfilment, marketplace platforms' },
  { id: 'ind-cybersec', name: 'Cybersecurity', growthRate: 0.13, volatility: 0.10, sector: 'tech', description: 'Threat detection, zero-trust, identity management' },
  { id: 'ind-legaltech', name: 'LegalTech', growthRate: 0.08, volatility: 0.08, sector: 'legal', description: 'Contract automation, e-discovery, compliance tools' },
  { id: 'ind-edtech', name: 'EdTech', growthRate: 0.06, volatility: 0.07, sector: 'education', description: 'Online learning, credentialing, tutoring platforms' },
  { id: 'ind-proptech', name: 'PropTech', growthRate: 0.07, volatility: 0.09, sector: 'real_estate', description: 'Smart building, digital mortgages, rental platforms' },
  { id: 'ind-agri', name: 'AgriTech', growthRate: 0.06, volatility: 0.08, sector: 'agriculture', description: 'Precision farming, supply chain, food-tech' },
  { id: 'ind-insurtech', name: 'InsurTech', growthRate: 0.07, volatility: 0.08, sector: 'finance', description: 'AI underwriting, parametric insurance, embedded cover' },
];

/**
 * Merges starter occupations with the extended catalogue, deduplicating by ID.
 */
export function mergeOccupations(
  starter: ReadonlyArray<ContentOccupation>,
): ReadonlyArray<ContentOccupation> {
  const seen = new Set(starter.map((o) => o.id));
  return [
    ...starter,
    ...EXTENDED_OCCUPATIONS.filter((o) => !seen.has(o.id)),
  ];
}

/**
 * Returns all occupations for a given sector (case-insensitive).
 */
export function getOccupationsBySector(
  sector: string,
  allOccupations: ReadonlyArray<ContentOccupation>,
): ReadonlyArray<ContentOccupation> {
  const normalised = sector.toLowerCase();
  return allOccupations.filter((o) => o.sector.toLowerCase() === normalised);
}

/** Domain-compatible job listing shape produced from content occupations. */
export interface ContentJobListing {
  readonly id: string;
  readonly title: string;
  readonly employerName: string;
  readonly monthlySalaryCents: number;
  readonly minPerformanceScore: number;
  readonly sector: string;
  readonly minGpa: number;
  readonly requiredCredentialId?: string;
  readonly requiresUniversityEnrollment?: boolean;
  readonly promotesTo?: string;
}

/**
 * Converts occupation catalogue into job-market listings with salary bands + ladder hints.
 */
export function occupationsToJobListings(
  occupations: ReadonlyArray<ContentOccupation>,
): readonly ContentJobListing[] {
  return occupations.map((occupation, index) => {
    const mid = occupation.salaryBandCents;
    const isSenior = /senior|principal|chief|vp|partner|director|master/i.test(occupation.title);
    const isEntry = /junior|associate|trainee|tutor/i.test(occupation.title);
    return {
      id: `content-${occupation.id}`,
      title: occupation.title,
      employerName: `${occupation.sector.charAt(0).toUpperCase()}${occupation.sector.slice(1)} Employers Guild`,
      monthlySalaryCents: mid,
      minPerformanceScore: isSenior ? 78 : isEntry ? 48 : 60,
      sector: occupation.sector,
      minGpa: isSenior ? 3.2 : isEntry ? 2.2 : 2.8,
      promotesTo: occupations[index + 1] ? `content-${occupations[index + 1]!.id}` : undefined,
    };
  });
}
