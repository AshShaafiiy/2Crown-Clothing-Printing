import { describe, it, expect, beforeEach } from 'vitest';
import { services } from './index';

describe('MockReviewService', () => {
  beforeEach(async () => {
    // We could reset the mock state here if it wasn't a singleton module export.
    // For now, we will use unique product IDs to isolate tests.
  });

  it('should correctly calculate average rating and count for a product with no ratings', async () => {
    const summary = await services.reviews.getRatingSummary('non-existent-product');
    expect(summary.average).toBe(0);
    expect(summary.count).toBe(0);
  });

  it('should correctly add a 1-5 star submission and calculate the average rating', async () => {
    const testProductId = `test-prod-${Date.now()}`;
    
    // Add first rating: 5 stars
    await services.reviews.addReview({
      productId: testProductId,
      customerId: 'user-1',
      customerName: 'Test User 1',
      rating: 5,
    });
    
    let summary = await services.reviews.getRatingSummary(testProductId);
    expect(summary.count).toBe(1);
    expect(summary.average).toBe(5);

    // Add second rating: 3 stars
    await services.reviews.addReview({
      productId: testProductId,
      customerId: 'user-2',
      customerName: 'Test User 2',
      rating: 3,
    });
    
    summary = await services.reviews.getRatingSummary(testProductId);
    expect(summary.count).toBe(2);
    expect(summary.average).toBe(4); // (5 + 3) / 2 = 4
  });

  it('should auto-approve reviews so they appear in getReviewsByProductId', async () => {
    const testProductId = `test-prod-${Date.now()}-2`;
    
    const review = await services.reviews.addReview({
      productId: testProductId,
      customerId: 'user-1',
      customerName: 'Test User 1',
      rating: 4,
    });
    
    expect(review.approved).toBe(true);

    const reviews = await services.reviews.getReviewsByProductId(testProductId);
    expect(reviews.length).toBe(1);
    expect(reviews[0].rating).toBe(4);
  });
});
