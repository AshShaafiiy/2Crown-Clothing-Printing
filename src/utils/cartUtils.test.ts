import { describe, it, expect } from 'vitest';
import { toCartItem } from './cartUtils';
import { Product } from '../domain/models';

describe('cartUtils', () => {
  const mockProduct: Product = {
    id: 'prod-1',
    slug: 'prod-1-slug',
    name: 'Discounted Shirt',
    description: 'A shirt',
    categoryId: 'cat-1',
    price: 3000,
    previousPrice: 5000,
    imageUrl: 'image.jpg',
    featured: true,
    active: true,
  };

  it('preserves price and previousPrice from ProductCard (Home/Shop)', () => {
    const item = toCartItem(mockProduct, 1);
    expect(item.price).toBe(3000);
    expect(item.previousPrice).toBe(5000);
    expect(item.quantity).toBe(1);
    expect(item.productName).toBe('Discounted Shirt');
  });

  it('preserves overridden price and previousPrice from ProductDetails', () => {
    // When a variant is selected with its own pricing
    const item = toCartItem(mockProduct, 1, 'var-1', 'Large', undefined, 4000, 6000);
    expect(item.price).toBe(4000);
    expect(item.previousPrice).toBe(6000);
    expect(item.variantId).toBe('var-1');
  });

  it('handles old products without previousPrice', () => {
    const p = { ...mockProduct };
    delete p.previousPrice;
    const item = toCartItem(p, 1);
    expect(item.price).toBe(3000);
    expect(item.previousPrice).toBeUndefined();
  });
});
