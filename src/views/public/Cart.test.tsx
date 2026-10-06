// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Cart from './Cart';
import { useCartStore } from '../../store/cartStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('Cart UX', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    vi.clearAllMocks();
  });

  it('renders cart, has no quantity input field, handles +/- and remove at 1', async () => {
    // Add item to cart
    useCartStore.getState().addItem({
      id: 'cart-1',
      productId: 'prod-1',
      productName: 'Test Cart Item',
      price: 1000,
      quantity: 2,
    });

    render(<Cart />);

    // 11. Cart page has no editable quantity field
    expect(screen.queryByRole('spinbutton')).toBeNull();

    // Show quantity 2
    expect(screen.getByText('2')).toBeInTheDocument();

    const incBtn = screen.getByLabelText('Increase quantity');
    const decBtn = screen.getByLabelText('Decrease quantity');

    fireEvent.click(incBtn);
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    fireEvent.click(decBtn);
    fireEvent.click(decBtn);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    // - at 1 removes item
    fireEvent.click(decBtn);
    await waitFor(() => {
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });
  });
});
