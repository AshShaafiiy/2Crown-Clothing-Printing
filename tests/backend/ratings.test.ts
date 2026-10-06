import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as verifyPOST } from '../../app/api/ratings/[productId]/verify/route';
import { GET, POST } from '../../app/api/ratings/[productId]/route';
import * as orderRepo from '../../src/backend/repositories/OrderRepository';
import * as reviewRepo from '../../src/backend/repositories/ReviewRepository';
import jwt from 'jsonwebtoken';

vi.mock('../../src/backend/repositories/OrderRepository', () => ({
  orderRepository: {
    findByReference: vi.fn()
  }
}));

vi.mock('../../src/backend/repositories/ReviewRepository', () => ({
  reviewRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    getRatingSummary: vi.fn()
  }
}));

const mockOrder = {
  id: 'order1',
  status: 'Delivered',
  customerPhone: '09012345678',
  items: [{ productId: 'prod1' }]
};

function createReq(body: any, method = 'POST', authHeader?: string) {
  const headers = new Headers();
  if (authHeader) headers.set('authorization', authHeader);
  return new Request('http://localhost:3000/api/test', {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
}

describe('Ratings API (Accountless)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Verification Endpoint', () => {
    it('rejects wrong reference', async () => {
      (orderRepo.orderRepository.findByReference as any).mockResolvedValue(null);
      const req = createReq({ reference: '2C-111111', phone: '09012345678' });
      const res = await verifyPOST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(404);
      expect(await res.json()).toHaveProperty('error', "We couldn't verify this purchase.");
    });

    it('rejects wrong phone', async () => {
      (orderRepo.orderRepository.findByReference as any).mockResolvedValue(mockOrder);
      const req = createReq({ reference: '2C-123456', phone: '08000000000' }); // diff phone
      const res = await verifyPOST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(404);
    });

    it('rejects product absent from order', async () => {
      (orderRepo.orderRepository.findByReference as any).mockResolvedValue(mockOrder);
      const req = createReq({ reference: '2C-123456', phone: '09012345678' });
      const res = await verifyPOST(req, { params: { productId: 'wrongProd' } });
      expect(res.status).toBe(404);
    });

    it('rejects non-Delivered order', async () => {
      (orderRepo.orderRepository.findByReference as any).mockResolvedValue({ ...mockOrder, status: 'Preparing' });
      const req = createReq({ reference: '2C-123456', phone: '09012345678' });
      const res = await verifyPOST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(403);
      expect(await res.json()).toHaveProperty('error', 'You can rate this product after delivery.');
    });

    it('allows valid verification and returns token', async () => {
      (orderRepo.orderRepository.findByReference as any).mockResolvedValue(mockOrder);
      (reviewRepo.reviewRepository.findById as any).mockResolvedValue(null);
      const req = createReq({ reference: '2C-123456', phone: '09012345678' });
      const res = await verifyPOST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.existingRating).toBeUndefined();
    });
    
    it('normalizes phone number correctly', async () => {
      (orderRepo.orderRepository.findByReference as any).mockResolvedValue(mockOrder); // order has 09012345678
      (reviewRepo.reviewRepository.findById as any).mockResolvedValue(null);
      const req = createReq({ reference: '2C-123456', phone: '+2349012345678' }); // client sends +234
      const res = await verifyPOST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(200);
    });
  });

  describe('Rating POST Endpoint', () => {
    it('rejects without token', async () => {
      const req = createReq({ rating: 5 });
      const res = await POST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(401);
    });

    it('rejects with token for wrong product', async () => {
      const token = jwt.sign({ buyerFingerprint: 'fingerprint1', productId: 'wrongProd' }, process.env.JWT_SECRET || 'dev_secret');
      const req = createReq({ rating: 5 }, 'POST', `Bearer ${token}`);
      const res = await POST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(403);
    });

    it('creates new rating', async () => {
      const token = jwt.sign({ buyerFingerprint: 'fingerprint1', productId: 'prod1' }, process.env.JWT_SECRET || 'dev_secret');
      (reviewRepo.reviewRepository.findById as any).mockResolvedValue(null);
      const req = createReq({ rating: 4 }, 'POST', `Bearer ${token}`);
      const res = await POST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(201);
      expect(reviewRepo.reviewRepository.create).toHaveBeenCalled();
      const callArgs = (reviewRepo.reviewRepository.create as any).mock.calls[0][0];
      expect(callArgs.rating).toBe(4);
      expect(callArgs.verifiedPurchase).toBe(true);
    });

    it('updates existing rating', async () => {
      const token = jwt.sign({ buyerFingerprint: 'fingerprint1', productId: 'prod1' }, process.env.JWT_SECRET || 'dev_secret');
      (reviewRepo.reviewRepository.findById as any).mockResolvedValue({ id: 'rating_fingerprint1_prod1', rating: 4 });
      const req = createReq({ rating: 5 }, 'POST', `Bearer ${token}`);
      const res = await POST(req, { params: { productId: 'prod1' } });
      expect(res.status).toBe(200);
      expect(reviewRepo.reviewRepository.update).toHaveBeenCalled();
    });
  });
});
