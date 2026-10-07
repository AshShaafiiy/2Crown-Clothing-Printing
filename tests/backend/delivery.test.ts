process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'mock-key';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from '../../app/api/orders/[reference]/delivery-fee/route';
import { orderRepository } from '../../src/backend/repositories/OrderRepository';
import * as nextUtils from '../../src/backend/utils/next-utils';

vi.mock('../../src/backend/repositories/OrderRepository', () => ({
  orderRepository: {
    updateDeliveryFee: vi.fn(),
  }
}));

describe('Delivery Fee API (PATCH /api/orders/[reference]/delivery-fee)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('authorized edit: success', async () => {
    vi.spyOn(nextUtils, 'authenticateNext').mockResolvedValue({ user: { id: 'admin1', role: 'admin' } } as any);
    vi.spyOn(nextUtils, 'requireRolesNext').mockReturnValue(null);
    vi.spyOn(nextUtils, 'parseBody').mockResolvedValue({ data: { deliveryFee: 1500 } } as any);
    vi.mocked(orderRepository.updateDeliveryFee).mockResolvedValue({ id: 'ref-123', deliveryFee: 1500 } as any);

    const req = new Request('http://localhost/api/orders/ref-123/delivery-fee', { method: 'PATCH' });
    const res = await PATCH(req, { params: Promise.resolve({ reference: 'ref-123' }) });

    expect(res.status).toBe(200);
    expect(orderRepository.updateDeliveryFee).toHaveBeenCalledWith('ref-123', 1500);
  });

  it('unauthenticated: 401', async () => {
    vi.spyOn(nextUtils, 'authenticateNext').mockResolvedValue({ error: 'Unauthorized', status: 401 } as any);
    const req = new Request('http://localhost/api/orders/ref-123/delivery-fee', { method: 'PATCH' });
    const res = await PATCH(req, { params: Promise.resolve({ reference: 'ref-123' }) });
    expect(res.status).toBe(401);
  });

  it('unauthorized: 403', async () => {
    vi.spyOn(nextUtils, 'authenticateNext').mockResolvedValue({ user: { id: 'user1', role: 'customer' } } as any);
    vi.spyOn(nextUtils, 'requireRolesNext').mockReturnValue({ error: 'Forbidden', status: 403 });
    const req = new Request('http://localhost/api/orders/ref-123/delivery-fee', { method: 'PATCH' });
    const res = await PATCH(req, { params: Promise.resolve({ reference: 'ref-123' }) });
    expect(res.status).toBe(403);
  });

  it('invalid payload: 400', async () => {
    vi.spyOn(nextUtils, 'authenticateNext').mockResolvedValue({ user: { id: 'admin1', role: 'admin' } } as any);
    vi.spyOn(nextUtils, 'requireRolesNext').mockReturnValue(null);
    vi.spyOn(nextUtils, 'parseBody').mockResolvedValue({ error: 'Invalid payload', status: 400 } as any);

    const req = new Request('http://localhost/api/orders/ref-123/delivery-fee', { method: 'PATCH' });
    const res = await PATCH(req, { params: Promise.resolve({ reference: 'ref-123' }) });

    expect(res.status).toBe(400);
  });
});
