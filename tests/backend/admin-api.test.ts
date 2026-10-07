import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../app/api/admins/route';

vi.mock('@/backend/utils/next-utils', () => ({
  authenticateNext: vi.fn().mockResolvedValue({ user: { role: 'admin' } }),
  requireRolesNext: vi.fn().mockReturnValue({ error: 'Forbidden', status: 403 }),
  parseBody: vi.fn().mockResolvedValue({ data: { name: 'test' } }),
}));

describe('Admin API Route', () => {
  it('rejects unauthorized caller', async () => {
    const req = new Request('http://localhost/api/admins', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
