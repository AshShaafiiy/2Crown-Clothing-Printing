import { describe, it, expect, vi } from 'vitest';
import { ReviewRepository } from '../../src/backend/repositories/ReviewRepository';

vi.mock('../../src/backend/db/firebase', () => ({
  db: {
    collection: () => ({
      where: () => ({
        where: () => ({
          get: async () => ({
            empty: false,
            docs: [
              { data: () => ({ rating: 5, verifiedPurchase: true }) },
              { data: () => ({ rating: 4, verifiedPurchase: true }) },
              { data: () => ({ rating: 2 }) }, // legacy, should be ignored
              { data: () => ({ rating: 1, verifiedPurchase: false }) } // explicitly false, ignored
            ]
          })
        })
      })
    })
  }
}));

describe('ReviewRepository', () => {
  it('getRatingSummary excludes unverified legacy ratings', async () => {
    const repo = new ReviewRepository();
    const summary = await repo.getRatingSummary('prod1');
    // Only the 5 and 4 star ratings are verifiedPurchase: true
    // Sum = 9, count = 2 -> Average = 4.5
    expect(summary.count).toBe(2);
    expect(summary.average).toBe(4.5);
  });
});
