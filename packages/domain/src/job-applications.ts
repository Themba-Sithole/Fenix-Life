import type { BankingState } from './banking.js';
import type { CareerState } from './career.js';
import type { JobListing } from './job-market.js';

export type JobApplicationStatus = 'pending' | 'rejected' | 'accepted';

export interface JobApplicationRecord {
  readonly id: string;
  readonly listingId: string;
  readonly listingTitle: string;
  readonly employerName: string;
  readonly appliedDate: string;
  readonly status: JobApplicationStatus;
  readonly matchScore: number;
  readonly rejectionReason?: string;
  readonly resolveOnDate?: string;
}

export const MAX_JOB_APPLICATIONS = 12;
/** Number of game days before a pending job application resolves (accepted or rejected). */
export const JOB_APPLICATION_RESOLVE_DAYS = 5;

export function createJobApplication(input: {
  listing: JobListing;
  appliedDate: string;
  matchScore: number;
  status: JobApplicationStatus;
  rejectionReason?: string;
  idSuffix: number;
  resolveOnDate?: string;
}): JobApplicationRecord {
  return {
    id: `app-${input.listing.id}-${input.idSuffix}`,
    listingId: input.listing.id,
    listingTitle: input.listing.title,
    employerName: input.listing.employerName,
    appliedDate: input.appliedDate,
    status: input.status,
    matchScore: input.matchScore,
    rejectionReason: input.rejectionReason,
    resolveOnDate: input.resolveOnDate,
  };
}

export function appendJobApplication(
  applications: readonly JobApplicationRecord[],
  record: JobApplicationRecord,
): JobApplicationRecord[] {
  return [record, ...applications].slice(0, MAX_JOB_APPLICATIONS);
}

export function weeksUnemployed(unemployedSinceDate: string | null, currentDate: string): number {
  if (!unemployedSinceDate) {
    return 0;
  }
  const start = new Date(unemployedSinceDate);
  const end = new Date(currentDate);
  const diffMs = end.getTime() - start.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) {
    return 0;
  }
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
}

export function unemploymentRunwayMonths(banking: BankingState): number {
  const liquid = banking.accounts.reduce((sum, account) => sum + account.balanceCents, 0);
  const monthlyBurn = Math.max(banking.monthlyExpensesCents, 1);
  return Math.floor(liquid / monthlyBurn);
}

export function activeJobApplications(
  applications: readonly JobApplicationRecord[],
): JobApplicationRecord[] {
  return applications.filter((application) => application.status === 'pending');
}

export function normalizeCareerJobSearch(
  career: CareerState,
  currentDate: string,
): CareerState {
  return {
    ...career,
    unemployedSinceDate:
      career.unemployedSinceDate ??
      (career.status === 'unemployed' ? currentDate : null),
    applications: career.applications ?? [],
  };
}

export function unemploymentPhaseLabel(weeks: number): string {
  if (weeks <= 4) {
    return 'Active search';
  }
  if (weeks <= 12) {
    return 'Broaden criteria';
  }
  if (weeks <= 26) {
    return 'Reskilling phase';
  }
  return 'Career pivot';
}
