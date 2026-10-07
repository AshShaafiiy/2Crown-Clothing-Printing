import { describe, it, expect, vi } from 'vitest';
import { orderRepository } from '../../src/backend/repositories/OrderRepository';
import { db } from '../../src/backend/db/firebase';

vi.mock('../../src/backend/db/firebase', () => ({
  db: {
    collection: vi.fn()
  }
}));

describe('OrderRepository Normalization', () => {
  it('normalizes legacy orders without crashing', async () => {
    const mockLegacyData = {
      reference: '2C-XXX',
      subtotal: '2000', // string instead of number
      // missing total
      // missing discount
      deliveryFee: null,
      history: ['Order Confirmed'] // string history
      // missing createdAt
    };

    const mockGet = vi.fn().mockResolvedValue({
      docs: [{ data: () => mockLegacyData }]
    });

    const mockOrderBy = vi.fn().mockReturnValue({ get: mockGet });
    (db.collection as any).mockReturnValue({ orderBy: mockOrderBy });

    const orders = await orderRepository.findAll();
    expect(orders.length).toBe(1);
    const order = orders[0];
    
    // Check normalization
    expect(order.subtotal).toBe(2000);
    expect(order.total).toBe(2000); // 2000 - 0 + 0
    expect(order.discount).toBe(0);
    expect(typeof order.createdAt).toBe('string');
    expect(order.createdAt).toBe(new Date(0).toISOString());
    expect(Array.isArray(order.history)).toBe(true);
    expect(order.history?.[0]?.note).toBe('Order Confirmed');
  });
});
