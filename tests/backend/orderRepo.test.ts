import { describe, it, expect, vi } from 'vitest';
import { orderRepository } from '../../src/backend/repositories/OrderRepository';
import { db } from '../../src/backend/db/firebase';

vi.mock('../../src/backend/db/firebase', () => ({
  db: {
    collection: vi.fn()
  }
}));

describe('OrderRepository Normalization', () => {
  it('normalizes legacy orders without synthetic dates', async () => {
    const mockLegacyData = {
      reference: '2C-XXX',
      // missing subtotal
      // missing total
      // missing discount
      deliveryMethod: 'local',
      deliveryFee: null,
      history: ['Order Confirmed'],
      items: [
        { price: 1500, quantity: 2 }
      ]
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
    
    // Check missing subtotal dynamically derived
    expect(order.subtotal).toBe(3000); // 1500 * 2
    expect(order.total).toBe(3000);
    
    // Check unset local delivery remains null
    expect(order.deliveryFee).toBeNull();

    // Check missing date remains empty string, NOT epoch
    expect(order.createdAt).toBe('');
    
    // Check string history normalized with empty timestamp
    expect(order.history?.[0]?.timestamp).toBe('');
  });

  it('normalizes pickup delivery to 0', async () => {
    const mockPickupData = {
      deliveryMethod: 'pickup'
      // missing deliveryFee
    };

    const mockGet = vi.fn().mockResolvedValue({
      docs: [{ data: () => mockPickupData }]
    });

    const mockOrderBy = vi.fn().mockReturnValue({ get: mockGet });
    (db.collection as any).mockReturnValue({ orderBy: mockOrderBy });

    const orders = await orderRepository.findAll();
    expect(orders[0].deliveryFee).toBe(0);
  });

  it('normalizes legacy WhatsApp Pending to Awaiting Confirmation', async () => {
    const mockData = {
      status: 'WhatsApp Pending',
    };

    const mockGet = vi.fn().mockResolvedValue({
      docs: [{ data: () => mockData }]
    });
    const mockOrderBy = vi.fn().mockReturnValue({ get: mockGet });
    (db.collection as any).mockReturnValue({ orderBy: mockOrderBy });

    const orders = await orderRepository.findAll();
    expect(orders[0].status).toBe('Awaiting Confirmation');
  });
});
