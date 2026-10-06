// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductDetails from './ProductDetails';
import { useCartStore } from '../../store/cartStore';

// Mock params
vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'test-product' })
}));

// Mock services
vi.mock('../../services', () => ({
  services: {
    products: {
      getProductBySlug: vi.fn().mockResolvedValue({
        id: 'test-prod',
        name: 'Test Product',
        slug: 'test-product',
        price: 1000,
        active: true,
      })
    },
    reviews: {
      getRatingSummary: vi.fn().mockResolvedValue({ average: 0, count: 0 })
    }
  }
}));

describe('ProductDetails Cart UX', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    vi.clearAllMocks();
  });

  it('renders Add to Cart initially, handles quantity +/-, and removes at 1', async () => {
    render(<ProductDetails />);
    
    // Wait for product to load
    await waitFor(() => {
      expect(screen.getAllByText('Test Product')[0]).toBeInTheDocument();
    });

    // 1. Quantity input field is absent
    expect(screen.queryByRole('spinbutton')).toBeNull();

    // Initial state: Add to Cart button
    const addBtn = screen.getByText('Add to Cart');
    expect(addBtn).toBeInTheDocument();

    // 2. Add to Cart -> quantity 1
    fireEvent.click(addBtn);

    // Now it should show quantity 1
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('(1 item added)')).toBeInTheDocument();
    });
    
    // 3. + -> 2
    const incBtn = screen.getByLabelText('Increase quantity');
    fireEvent.click(incBtn);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('(2 items added)')).toBeInTheDocument();
    });

    // 4. + -> 3
    fireEvent.click(incBtn);
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    // 5. - -> 2
    const decBtn = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decBtn);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // 6. - -> 1
    fireEvent.click(decBtn);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    // 7 & 8. - at 1 removes item, returns to Add to Cart
    fireEvent.click(decBtn);
    await waitFor(() => {
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });
  });
});
