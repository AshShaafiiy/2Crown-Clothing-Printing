import { describe, it, expect } from 'vitest';
import { computeProductBadges } from './badges';
import { Product } from './models';

describe('Discount Badge Calculation', () => {
  it('should calculate precise percentage and render discount badge', () => {
    const product: Product = {
      id: 'test-1',
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test',
      categoryId: 'cat-1',
      price: 8000,
      previousPrice: 10000,
      imageUrl: 'test.jpg',
      featured: false,
      active: true
    };
    
    const badges = computeProductBadges(product);
    const discountBadge = badges.find(b => b.type === 'discount' && b.label.includes('% OFF'));
    
    expect(discountBadge).toBeDefined();
    expect(discountBadge?.label).toBe('20% OFF');
  });

  it('should not show generic % OFF if there is no previous price', () => {
    const product: Product = {
      id: 'test-1',
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test',
      categoryId: 'cat-1',
      price: 8000,
      imageUrl: 'test.jpg',
      featured: false,
      active: true
    };
    
    const badges = computeProductBadges(product);
    const discountBadge = badges.find(b => b.type === 'discount');
    expect(discountBadge).toBeUndefined();
  });
});
