import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../app/api/upload/imagekit-auth/route';
import { authenticateNext, requireRolesNext } from '../../src/backend/utils/next-utils';

vi.mock('../../src/backend/utils/next-utils', () => ({
  authenticateNext: vi.fn(),
  requireRolesNext: vi.fn(),
}));

vi.mock('imagekit', () => {
  return {
    default: class {
      getAuthenticationParameters() {
        return {
          token: 'mock-token',
          expire: 1234567890,
          signature: 'mock-signature'
        };
      }
    }
  };
});

describe('ImageKit Auth Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if unauthenticated', async () => {
    (authenticateNext as any).mockResolvedValue({ error: 'Unauthorized', status: 401 });
    
    const req = new Request('http://localhost/api/upload/imagekit-auth');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 if unauthorized role', async () => {
    (authenticateNext as any).mockResolvedValue({ user: { uid: '123' } });
    (requireRolesNext as any).mockReturnValue({ error: 'Forbidden', status: 403 });
    
    const req = new Request('http://localhost/api/upload/imagekit-auth');
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it('returns auth payload for authorized admin', async () => {
    (authenticateNext as any).mockResolvedValue({ user: { uid: '123' } });
    (requireRolesNext as any).mockReturnValue(null);
    
    const req = new Request('http://localhost/api/upload/imagekit-auth');
    const res = await GET(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.token).toBeDefined();
    expect(data.expire).toBeDefined();
    expect(data.signature).toBeDefined();
    expect(data.privateKey).toBeUndefined();
  });
});
