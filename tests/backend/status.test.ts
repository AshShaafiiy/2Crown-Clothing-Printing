process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'mock-key';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from '../../app/api/orders/[reference]/status/route';
import { orderRepository } from '../../src/backend/repositories/OrderRepository';
import * as nextUtils from '../../src/backend/utils/next-utils';

vi.mock('../../src/backend/repositories/OrderRepository', () => ({
  orderRepository: {
    findById: vi.fn(),
    updateStatus: vi.fn(),
    updateDeliveryFee: vi.fn(),
  }
}));

describe('Status API (PATCH /api/orders/[reference]/status)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks Confirm without fee for local delivery', async () => {
    vi.spyOn(nextUtils, 'authenticateNext').mockResolvedValue({ user: { id: 'admin1', role: 'admin' } } as any);
    vi.spyOn(nextUtils, 'requireRolesNext').mockReturnValue(null);
    vi.mocked(orderRepository.findById).mockResolvedValue({ id: 'ref-123', deliveryMethod: 'local', deliveryFee: null, status: 'Awaiting Confirmation' } as any);
    vi.spyOn(nextUtils, 'parseBody').mockResolvedValue({ data: { status: 'Confirmed' } } as any);

    const req = new Request('http://localhost/api/orders/ref-123/status', { method: 'PATCH' });
    const res = await PATCH(req, { params: Promise.resolve({ reference: 'ref-123' }) });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('delivery fee');
  });

  it('auto-sets zero fee for pickup on confirm', async () => {
    vi.spyOn(nextUtils, 'authenticateNext').mockResolvedValue({ user: { id: 'admin1', role: 'admin' } } as any);
    vi.spyOn(nextUtils, 'requireRolesNext').mockReturnValue(null);
    vi.mocked(orderRepository.findById).mockResolvedValue({ id: 'ref-123', deliveryMethod: 'pickup', deliveryFee: null, status: 'Awaiting Confirmation' } as any);
    vi.spyOn(nextUtils, 'parseBody').mockResolvedValue({ data: { status: 'Confirmed' } } as any);
    vi.mocked(orderRepository.updateStatus).mockResolvedValue({ id: 'ref-123', status: 'Confirmed' } as any);

    const req = new Request('http://localhost/api/orders/ref-123/status', { method: 'PATCH' });
    const res = await PATCH(req, { params: Promise.resolve({ reference: 'ref-123' }) });

    expect(res.status).toBe(200);
    expect(orderRepository.updateDeliveryFee).toHaveBeenCalledWith('ref-123', 0);
  });
});
