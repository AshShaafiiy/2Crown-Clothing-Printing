import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../app/api/auth/login/route';
import { userRepository } from '../../src/backend/repositories/UserRepository';

vi.mock('../../src/backend/repositories/UserRepository', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    update: vi.fn()
  }
}));

// Mock fetch for Google Identity Toolkit
global.fetch = vi.fn();

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRequest = (body: any) => {
    return new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  };

  it('successful login updates lastLoginAt', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ idToken: 'mock-token' })
    });

    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce({
      id: 'admin1',
      email: 'admin@test.com',
      role: 'admin',
      active: true,
      name: 'Admin'
    });

    const req = mockRequest({ email: 'admin@test.com', password: 'password123' });
    const res = await POST(req);
    
    expect(res.status).toBe(200);
    expect(userRepository.update).toHaveBeenCalledWith('admin1', expect.objectContaining({
      lastLogin: expect.any(String)
    }));
  });

  it('failed login (wrong password) does not update lastLoginAt', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'INVALID_PASSWORD' } })
    });

    const req = mockRequest({ email: 'admin@test.com', password: 'wrong' });
    const res = await POST(req);
    
    expect(res.status).toBe(401);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('inactive admin login does not update lastLoginAt', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ idToken: 'mock-token' })
    });

    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce({
      id: 'admin2',
      email: 'inactive@test.com',
      role: 'admin',
      active: false,
      name: 'Inactive Admin'
    });

    const req = mockRequest({ email: 'inactive@test.com', password: 'password123' });
    const res = await POST(req);
    
    expect(res.status).toBe(401);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
