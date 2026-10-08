import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PUT, DELETE } from '../../app/api/products/[id]/route';
import { productRepository } from '../../src/backend/repositories/ProductRepository';
import { deleteImageKitFile } from '../../src/backend/utils/imagekit';
import { auth } from '../../src/backend/db/firebase';

vi.mock('../../src/backend/repositories/ProductRepository', () => ({
  productRepository: {
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('../../src/backend/utils/imagekit', () => ({
  deleteImageKitFile: vi.fn()
}));

vi.mock('../../src/backend/repositories/UserRepository', () => ({
  userRepository: {
    findByEmail: vi.fn().mockImplementation(async () => ({ uid: 'root', email: 'admin@test.com', role: 'root_super_admin', active: true }))
  }
}));

vi.mock('../../src/backend/db/firebase', () => ({
  auth: { verifyIdToken: vi.fn() },
  db: { collection: vi.fn(), settings: vi.fn() }
}));

function createMockRequest(body: any, token?: string) {
  return {
    json: async () => body,
    headers: { get: (name: string) => token ? `Bearer ${token}` : null }
  } as unknown as Request;
}

describe('Product Edit & Delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.verifyIdToken).mockResolvedValue({ uid: 'root', email: 'admin@test.com', role: 'root_super_admin' } as any);
  });

  const validPayload = {
    name: "Updated Product",
    slug: "updated-product",
    description: "Updated Description",
    categoryId: "test-cat",
    price: 6000,
    imageUrl: "https://example.com/img2.png",
    active: true,
    featured: false
  };

  it('keeps old image metadata if replacement not provided', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({ id: '1', name: 'Old', imageFileId: 'ik_1' } as any);
    vi.mocked(productRepository.update).mockResolvedValue({ id: '1', ...validPayload, imageFileId: 'ik_1' } as any);

    const req = createMockRequest({ ...validPayload, imageFileId: 'ik_1' }, 'valid');
    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
    expect(deleteImageKitFile).not.toHaveBeenCalled();
  });

  it('deletes old image from ImageKit after successful update', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({ id: '1', name: 'Old', imageFileId: 'ik_1' } as any);
    vi.mocked(productRepository.update).mockResolvedValue({ id: '1', ...validPayload, imageFileId: 'ik_2' } as any);

    const req = createMockRequest({ ...validPayload, imageFileId: 'ik_2' }, 'valid');
    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
    expect(deleteImageKitFile).toHaveBeenCalledWith('ik_1');
  });

  it('deletes image from ImageKit on product delete', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({ id: '1', name: 'Old', imageFileId: 'ik_1' } as any);
    vi.mocked(productRepository.delete).mockResolvedValue();

    const req = createMockRequest(null, 'valid');
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(204);
    expect(deleteImageKitFile).toHaveBeenCalledWith('ik_1');
  });

  it('handles delete on legacy product without imageFileId safely', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({ id: '1', name: 'Old', imageUrl: 'old.png' } as any);
    vi.mocked(productRepository.delete).mockResolvedValue();

    const req = createMockRequest(null, 'valid');
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(204);
    expect(deleteImageKitFile).not.toHaveBeenCalled();
  });
});
