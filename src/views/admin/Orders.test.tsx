// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Orders from './Orders';

// Mock Services
vi.mock('../../services', () => ({
  services: {
    orders: {
      getOrders: vi.fn().mockResolvedValue([
        {
          id: 'order-local',
          reference: '2C-123',
          customerName: 'Test Local',
          items: [],
          status: 'Awaiting Confirmation',
          deliveryMethod: 'local',
          subtotal: 5000,
          total: 5000,
          createdAt: new Date().toISOString(),
          history: []
        },
        {
          id: 'order-pickup',
          reference: '2C-456',
          customerName: 'Test Pickup',
          items: [],
          status: 'Awaiting Confirmation',
          deliveryMethod: 'pickup',
          subtotal: 5000,
          total: 5000,
          createdAt: new Date().toISOString(),
          history: []
        }
      ]),
      updateOrderStatus: vi.fn().mockResolvedValue({})
    }
  }
}));

const mockConfirm = vi.fn().mockResolvedValue(true);
vi.mock('../../components/ui/ConfirmProvider', () => ({
  useConfirm: () => ({ confirm: mockConfirm })
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('Admin Orders Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks local delivery order confirmation if fee is missing', async () => {
    render(<Orders />);
    
    // Wait for orders to load
    await waitFor(() => expect(screen.getByText('2C-123')).toBeInTheDocument());

    // Click to expand local order
    fireEvent.click(screen.getByText('2C-123'));

    // Click Confirm Order
    await waitFor(() => expect(screen.getAllByText('Confirm Order')[0]).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Confirm Order')[0]);

    // Toast error should be called
    const toast = await import('react-hot-toast');
    expect(toast.default.error).toHaveBeenCalledWith(
      'Enter the delivery fee before confirming this order.',
      expect.anything()
    );
    // Modal confirm should NOT be called
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it('allows pickup order confirmation without fee', async () => {
    render(<Orders />);
    
    await waitFor(() => expect(screen.getByText('2C-456')).toBeInTheDocument());

    // Click to expand pickup order
    fireEvent.click(screen.getByText('2C-456'));

    await waitFor(() => expect(screen.getAllByText('Confirm Order')[0]).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Confirm Order')[0]);

    expect(mockConfirm).toHaveBeenCalled();
  });
});
