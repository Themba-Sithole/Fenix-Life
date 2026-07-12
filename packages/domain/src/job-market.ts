import type { CareerState } from './career.js';
import type { EducationState } from './education.js';
import { hasCredential, highestCredentialGpa } from './education.js';

export interface JobListing {
  readonly id: string;
  readonly title: string;
  readonly employerName: string;
  readonly monthlySalaryCents: number;
  readonly minPerformanceScore: number;
  readonly sector: string;
  readonly minGpa: number;
  readonly requiredCredentialId?: string;
  readonly requiresUniversityEnrollment?: boolean;
}

export const JOB_LISTINGS: readonly JobListing[] = [
  {
    id: 'job-retail-associate',
    title: 'Retail Associate',
    employerName: 'City Market Co.',
    monthlySalaryCents: 2_400_00,
    minPerformanceScore: 45,
    sector: 'Retail',
    minGpa: 2.0,
  },
  {
    id: 'job-warehouse',
    title: 'Warehouse Associate',
    employerName: 'Metro Logistics Co.',
    monthlySalaryCents: 3_200_00,
    minPerformanceScore: 50,
    sector: 'Operations',
    minGpa: 2.0,
  },
  {
    id: 'job-junior-analyst',
    title: 'Junior Analyst',
    employerName: 'Regional Services Ltd.',
    monthlySalaryCents: 4_800_00,
    minPerformanceScore: 62,
    sector: 'Professional',
    minGpa: 3.0,
    requiredCredentialId: 'cred-associate',
  },
  {
    id: 'job-customer-success',
    title: 'Customer Success Lead',
    employerName: 'Northwind Partners',
    monthlySalaryCents: 5_500_00,
    minPerformanceScore: 65,
    sector: 'Technology',
    minGpa: 3.1,
    requiredCredentialId: 'cred-bachelors',
  },
  {
    id: 'job-product-specialist',
    title: 'Product Specialist',
    employerName: 'Horizon Digital',
    monthlySalaryCents: 6_200_00,
    minPerformanceScore: 70,
    sector: 'Technology',
    minGpa: 3.3,
    requiredCredentialId: 'cred-bachelors',
  },
  {
    id: 'job-graduate-trainee',
    title: 'Graduate Trainee',
    employerName: 'City University Placement Office',
    monthlySalaryCents: 4_200_00,
    minPerformanceScore: 58,
    sector: 'Professional',
    minGpa: 3.2,
    requiresUniversityEnrollment: true,
  },
  {
    id: 'job-trade-tech',
    title: 'Certified Technician',
    employerName: 'Metro Facilities Guild',
    monthlySalaryCents: 4_100_00,
    minPerformanceScore: 55,
    sector: 'Trades',
    minGpa: 2.5,
    requiredCredentialId: 'cred-trade',
  },
] as const;

export const JOB_APPLICATION_FEE_CENTS = 75_00;

/** Extra listings merged from content packs at bootstrap. */
let CONTENT_JOB_LISTINGS: readonly JobListing[] = [];

export function mergeContentJobListings(listings: readonly JobListing[]): void {
  const seen = new Set(JOB_LISTINGS.map((listing) => listing.id));
  CONTENT_JOB_LISTINGS = listings.filter((listing) => !seen.has(listing.id));
}

export function getAllJobListings(): readonly JobListing[] {
  return CONTENT_JOB_LISTINGS.length === 0
    ? JOB_LISTINGS
    : [...JOB_LISTINGS, ...CONTENT_JOB_LISTINGS];
}

export function getJobListingById(listingId: string): JobListing | undefined {
  return getAllJobListings().find((listing) => listing.id === listingId);
}

export function getAvailableJobListings(input: {
  career: CareerState;
  education: EducationState;
}): JobListing[] {
  if (input.career.status !== 'unemployed') {
    return [];
  }

  const gpa = highestCredentialGpa(input.education);

  return getAllJobListings().filter((listing) => {
    if (input.career.performanceScore < listing.minPerformanceScore) {
      return false;
    }
    if (gpa < listing.minGpa) {
      return false;
    }
    if (listing.requiresUniversityEnrollment && !input.education.enrolled) {
      return false;
    }
    if (listing.requiredCredentialId && !hasCredential(input.education, listing.requiredCredentialId)) {
      // Allow undergrad track while enrolled for graduate trainee only
      if (!(listing.requiresUniversityEnrollment && input.education.enrolled)) {
        return false;
      }
    }
    return true;
  });
}

export function jobListingMatchScore(
  listing: JobListing,
  performanceScore: number,
  education: EducationState,
): number {
  const gpa = highestCredentialGpa(education);
  const perfHeadroom = performanceScore - listing.minPerformanceScore;
  const gpaHeadroom = (gpa - listing.minGpa) * 20;
  const credentialBonus =
    listing.requiredCredentialId && hasCredential(education, listing.requiredCredentialId) ? 12 : 0;
  return Math.max(0, Math.min(100, Math.round(42 + perfHeadroom * 1.5 + gpaHeadroom + credentialBonus)));
}

export function formatJobSalary(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
