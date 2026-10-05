// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '../../domain/models';

const mockProduct: Product = {
  id: 'test-product',
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  categoryId: 'cat-1',
  price: 5000,
  imageUrl: 'https://example.com/image.jpg',
  featured: true,
  active: true,
};

describe('ProductCard', () => {
  it('renders safely without optional fields like previousPrice', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₦5,000')).toBeInTheDocument();
    // Verify Link renders href, not 'to'
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/product/test-product');
    });
  });

  it('renders discount badge when previousPrice is provided and valid', () => {
    const discountedProduct = { ...mockProduct, previousPrice: 10000, price: 5000 };
    render(<ProductCard product={discountedProduct} />);
    expect(screen.getByText('50% OFF')).toBeInTheDocument();
  });

  it('safely skips discount calculation when previousPrice is 0 or undefined', () => {
    const noDiscountProduct = { ...mockProduct, previousPrice: 0, price: 5000 };
    render(<ProductCard product={noDiscountProduct} />);
    expect(screen.queryByText(/OFF/)).toBeNull();
  });

  it('renders correctly without an image URL', () => {
    const noImageProduct = { ...mockProduct, imageUrl: '' };
    render(<ProductCard product={noImageProduct} />);
    expect(screen.getByText('Product image coming soon')).toBeInTheDocument();
  });
});
