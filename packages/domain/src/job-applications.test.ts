import { describe, expect, it } from 'vitest';
import { createSaveId } from './save-id.js';
import { createFreshStartWorld } from './fresh-start.js';
import { applyPlayerAction } from './player-actions.js';
import { getAvailableJobListings } from './job-market.js';

describe('job applications', () => {
  it('records rejected and accepted applications on apply', () => {
    let world = createFreshStartWorld({
      saveId: createSaveId('job-app'),
      playerName: 'Applicant',
    });

    world = {
      ...world,
      career: {
        ...world.career,
        performanceScore: 70,
      },
      clock: { ...world.clock, tickCount: 4 },
    };

    const listings = getAvailableJobListings({
      career: world.career,
      education: world.education,
    });
    expect(listings.length).toBeGreaterThan(0);

    const next = applyPlayerAction(world, {
      kind: 'CAREER_APPLY_JOB',
      listingId: listings[0]!.id,
    });

    expect(next.career.applications.length).toBe(1);
    expect(next.career.applications[0]?.status).toBe('pending');
    expect(next.career.applications[0]?.resolveOnDate).toBeDefined();
    expect(next.career.status).toBe('unemployed');
  });
});
