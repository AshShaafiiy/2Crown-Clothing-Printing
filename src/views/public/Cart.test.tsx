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

  it('handles cart quantity changes and explicitly disables minus at 1', async () => {
    useCartStore.getState().addItem({
      id: 'cart-1',
      productId: 'prod-1',
      productName: 'Test Cart Item',
      price: 1000,
      quantity: 2,
    });

    render(<Cart />);

    expect(screen.queryByRole('spinbutton')).toBeNull();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // "each" label is visible for quantity > 1
    expect(screen.getByText('₦1,000 each')).toBeInTheDocument();

    const incBtn = screen.getByRole('button', { name: /Increase quantity/i });
    const decBtn = screen.getByRole('button', { name: /Decrease quantity/i });

    fireEvent.click(incBtn);
    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());

    fireEvent.click(decBtn);
    fireEvent.click(decBtn);
    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());

    // at quantity 1, "each" label is not visible
    expect(screen.queryByText('₦1,000 each')).toBeNull();

    // minus is disabled at 1
    expect(decBtn).toBeDisabled();

    // clicking minus does nothing
    fireEvent.click(decBtn);
    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());
    expect(screen.queryByText('Your Cart is Empty')).toBeNull();

    // explicit remove button works
    const removeBtn = screen.getByRole('button', { name: /Remove Test Cart Item/i });
    fireEvent.click(removeBtn);
    await waitFor(() => expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument());
  });

  it('displays discount information correctly', () => {
    useCartStore.getState().addItem({
      id: 'cart-2',
      productId: 'prod-2',
      productName: 'Discounted Item',
      price: 600,
      previousPrice: 1000,
      quantity: 1,
    });

    render(<Cart />);
    
    expect(screen.getAllByText('₦600')[0]).toBeInTheDocument();
    expect(screen.getByText('₦1,000')).toBeInTheDocument(); // original price
    expect(screen.getByText('-40%')).toBeInTheDocument(); // discount badge
  });
});
