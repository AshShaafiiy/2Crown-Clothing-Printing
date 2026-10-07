// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import userEvent from '@testing-library/user-event';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../domain/models';

vi.mock('../../services', () => ({
  services: {
    reviews: {
      getRatingSummary: vi.fn().mockResolvedValue({ average: 4.5, count: 10 })
    }
  }
}));

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
  it('renders safely without optional fields like previousPrice', async () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₦5,000')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('(10)')).toBeInTheDocument();
    });

  it('adds product to cart with canonical payload and prevents navigation', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    
    // Check Add to Cart button
    const addButton = screen.getByRole('button', { name: /Add to Cart/i });
    expect(addButton).toHaveClass('focus-visible:ring-2'); // verify focus ring
    
    await user.click(addButton);
    
    // Verify it changed to quantity control
    expect(screen.getByRole('button', { name: /Increase/i })).toBeInTheDocument();
    
    // Clear cart for clean state
    useCartStore.getState().clearCart();
  });


    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/product/test-product');
    });
  });

  it('renders discount badge when previousPrice is provided and valid', async () => {
    const discountedProduct = { ...mockProduct, previousPrice: 10000, price: 5000 };
    render(<ProductCard product={discountedProduct} />);
    await waitFor(() => {
      expect(screen.getByText('50% OFF')).toBeInTheDocument();
    });
  });

  it('safely skips discount calculation when previousPrice is 0 or undefined', async () => {
    const noDiscountProduct = { ...mockProduct, previousPrice: 0, price: 5000 };
    render(<ProductCard product={noDiscountProduct} />);
    await waitFor(() => {
      expect(screen.queryByText(/OFF/)).toBeNull();
    });
  });

  it('renders correctly without an image URL', async () => {
    const noImageProduct = { ...mockProduct, imageUrl: '' };
    render(<ProductCard product={noImageProduct} />);
    await waitFor(() => {
      expect(screen.getByText('Product image coming soon')).toBeInTheDocument();
    });
  });
});
