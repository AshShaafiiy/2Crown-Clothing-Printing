import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../app/api/products/route';
import { productRepository } from '../../src/backend/repositories/ProductRepository';
import { auth } from '../../src/backend/db/firebase';

vi.mock('../../src/backend/repositories/ProductRepository', () => ({
  productRepository: {
    create: vi.fn().mockResolvedValue({})
  }
}));

vi.mock('../../src/backend/db/firebase', () => ({
  auth: {
    verifySessionCookie: vi.fn()
  },
  db: {
    collection: vi.fn(),
    settings: vi.fn()
  }
}));

function createMockRequest(body: any, authCookie?: string) {
  return {
    json: async () => body,
    headers: {
      get: (name: string) => {
        if (name === 'cookie' && authCookie) return `session=${authCookie}`;
        return null;
      }
    }
  } as unknown as Request;
}

describe('POST /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    name: "QA Product",
    slug: "qa-product",
    description: "QA Description",
    categoryId: "test-cat",
    price: 5000,
    imageUrl: "https://example.com/img.png",
    active: true,
    featured: false
  };

  it('allows root_super_admin to create a product', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest(validPayload, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(productRepository.create).toHaveBeenCalled();
  });

  it('rejects unauthenticated request', async () => {
    const req = createMockRequest(validPayload);
    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('rejects unauthorized request (customer)', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'user', role: 'customer' } as any);
    const req = createMockRequest(validPayload, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(403);
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('rejects blank name', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest({ ...validPayload, name: "" }, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('rejects blank selling price', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest({ ...validPayload, price: undefined }, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('rejects missing image', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest({ ...validPayload, imageUrl: undefined }, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('allows valid previousPrice', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest({ ...validPayload, previousPrice: 6000 }, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('allows blank/omitted previousPrice', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest({ ...validPayload, previousPrice: undefined }, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects previousPrice <= sellingPrice', async () => {
    vi.mocked(auth.verifySessionCookie).mockResolvedValue({ uid: 'root', role: 'root_super_admin' } as any);
    const req = createMockRequest({ ...validPayload, price: 5000, previousPrice: 5000 }, 'valid_cookie');
    const res = await POST(req);
    expect(res.status).toBe(400);

    const req2 = createMockRequest({ ...validPayload, price: 5000, previousPrice: 4000 }, 'valid_cookie');
    const res2 = await POST(req2);
    expect(res2.status).toBe(400);
  });
});
