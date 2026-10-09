// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Orders from './Orders';
import { services } from '../../services';

// Mock Services
vi.mock('../../services', () => ({
  services: {
    orders: {
      getOrders: vi.fn(),
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

const validOrders = [
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
];

describe('Admin Orders Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (services.orders.getOrders as any).mockResolvedValue(validOrders);
  });

  it('blocks local delivery order confirmation if fee is missing', async () => {
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('2C-123')).toBeInTheDocument());
    fireEvent.click(screen.getByText('2C-123'));
    await waitFor(() => expect(screen.getAllByText('Confirm Order')[0]).toBeInTheDocument());
    
    const confirmBtn = screen.getAllByText('Confirm Order')[0];
    expect(confirmBtn).toBeDisabled();
  });

  it('allows pickup order confirmation without fee', async () => {
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('2C-456')).toBeInTheDocument());
    fireEvent.click(screen.getByText('2C-456'));
    await waitFor(() => expect(screen.getAllByText('Confirm Order')[0]).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Confirm Order')[0]);
    expect(mockConfirm).toHaveBeenCalled();
  });

  it('legacy history order does not crash and handles gracefully', async () => {
    const malformedOrder = {
      id: 'order-legacy',
      reference: '2C-999',
      customerName: 'Legacy User',
      items: [],
      status: 'Delivered',
      deliveryMethod: 'local',
      // Simulating what the normalization should have patched, 
      // but testing the UI handles missing things securely if it sneaks past.
      subtotal: 5000,
      total: 5000,
      createdAt: 'Invalid-Date-String', // Will test Date parsing fallback
      history: [
        'Order Placed', // Legacy string entry
        { newStatus: 'Confirmed', timestamp: '' } // Legacy empty timestamp
      ]
    };
    (services.orders.getOrders as any).mockResolvedValue([malformedOrder]);
    
    render(<Orders />);
    
    await waitFor(() => expect(screen.getByText('2C-999')).toBeInTheDocument());
    // Should not say "Invalid Date" on UI
    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('2C-999'));
    // Should gracefully render "Date unavailable" for empty timestamp
    await waitFor(() => expect(screen.getAllByText('Date unavailable')[0]).toBeInTheDocument());
  });
});
