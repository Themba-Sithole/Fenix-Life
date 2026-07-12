import type { CareerState } from './career.js';
import type { EducationState } from './education.js';

export interface JobListing {
  readonly id: string;
  readonly title: string;
  readonly employerName: string;
  readonly monthlySalaryCents: number;
  readonly minPerformanceScore: number;
  readonly sector: string;
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
  },
  {
    id: 'job-warehouse',
    title: 'Warehouse Associate',
    employerName: 'Metro Logistics Co.',
    monthlySalaryCents: 3_200_00,
    minPerformanceScore: 50,
    sector: 'Operations',
  },
  {
    id: 'job-junior-analyst',
    title: 'Junior Analyst',
    employerName: 'Regional Services Ltd.',
    monthlySalaryCents: 4_800_00,
    minPerformanceScore: 58,
    sector: 'Professional',
  },
  {
    id: 'job-customer-success',
    title: 'Customer Success Lead',
    employerName: 'Northwind Partners',
    monthlySalaryCents: 5_500_00,
    minPerformanceScore: 62,
    sector: 'Technology',
  },
  {
    id: 'job-product-specialist',
    title: 'Product Specialist',
    employerName: 'Horizon Digital',
    monthlySalaryCents: 6_200_00,
    minPerformanceScore: 65,
    sector: 'Technology',
  },
  {
    id: 'job-graduate-trainee',
    title: 'Graduate Trainee',
    employerName: 'City University Placement Office',
    monthlySalaryCents: 4_200_00,
    minPerformanceScore: 55,
    sector: 'Professional',
    requiresUniversityEnrollment: true,
  },
] as const;

export const JOB_APPLICATION_FEE_CENTS = 50_00;

export function getJobListingById(listingId: string): JobListing | undefined {
  return JOB_LISTINGS.find((listing) => listing.id === listingId);
}

export function getAvailableJobListings(input: {
  career: CareerState;
  education: EducationState;
}): JobListing[] {
  if (input.career.status !== 'unemployed') {
    return [];
  }

  return JOB_LISTINGS.filter((listing) => {
    if (input.career.performanceScore < listing.minPerformanceScore) {
      return false;
    }
    if (listing.requiresUniversityEnrollment && !input.education.enrolled) {
      return false;
    }
    return true;
  });
}

export function jobListingMatchScore(
  listing: JobListing,
  performanceScore: number,
): number {
  const headroom = performanceScore - listing.minPerformanceScore;
  return Math.max(0, Math.min(100, 50 + headroom * 2));
}

export function formatJobSalary(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
