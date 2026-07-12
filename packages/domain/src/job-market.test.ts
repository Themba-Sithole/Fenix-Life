import { describe, expect, it } from 'vitest';
import {
  getAvailableJobListings,
  getJobListingById,
  jobListingMatchScore,
  JOB_LISTINGS,
} from './job-market.js';
import { createFreshStartCareer } from './career.js';
import { createFreshStartEducation } from './education.js';

describe('job market', () => {
  it('lists jobs when unemployed and performance meets threshold', () => {
    const career = createFreshStartCareer('middle-class');
    const education = createFreshStartEducation('middle-class');

    const listings = getAvailableJobListings({ career, education });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings.every((listing) => listing.minPerformanceScore <= career.performanceScore)).toBe(
      true,
    );
  });

  it('returns empty listings when employed', () => {
    const career = {
      ...createFreshStartCareer('middle-class'),
      status: 'employed' as const,
    };
    const education = createFreshStartEducation('middle-class');

    expect(getAvailableJobListings({ career, education })).toHaveLength(0);
  });

  it('filters graduate trainee when not enrolled', () => {
    const career = {
      ...createFreshStartCareer('middle-class'),
      status: 'unemployed' as const,
      performanceScore: 70,
    };
    const education = createFreshStartEducation('middle-class');

    const listings = getAvailableJobListings({ career, education });
    expect(listings.some((listing) => listing.id === 'job-graduate-trainee')).toBe(false);

    const enrolled = getAvailableJobListings({
      career,
      education: { ...education, enrolled: true },
    });
    expect(enrolled.some((listing) => listing.id === 'job-graduate-trainee')).toBe(true);
  });

  it('resolves listings by id', () => {
    const first = JOB_LISTINGS[0]!;
    expect(getJobListingById(first.id)?.title).toBe(first.title);
    expect(getJobListingById('missing')).toBeUndefined();
  });

  it('computes match score from performance headroom', () => {
    const listing = JOB_LISTINGS.find((item) => item.id === 'job-junior-analyst')!;
    const score = jobListingMatchScore(listing, listing.minPerformanceScore);
    expect(score).toBe(50);
    expect(jobListingMatchScore(listing, listing.minPerformanceScore + 10)).toBeGreaterThan(score);
  });
});
