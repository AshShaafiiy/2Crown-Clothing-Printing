import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories';
import { UpdateOrderStatusSchema } from '@/backend/schemas';
import { authenticateNext, parseBody, requireRolesNext } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';

export async function PATCH(req: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  const { reference: id } = await params;
  const existing = await orderRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, UpdateOrderStatusSchema);
  if (error) return NextResponse.json(error, { status });

  const newStatus = data!.status;
  const historyEntry = {
    id: uuid(),
    previousStatus: existing.status,
    newStatus: newStatus as any, // Cast to any to avoid complex type union mismatch if not perfectly matching
    timestamp: new Date().toISOString(),
    actorId: user?.id,
    actorName: user?.email || 'Admin',
    note: 'Admin updated status'
  };

  const updated = await orderRepository.updateStatus(id, newStatus, historyEntry as any);
  return NextResponse.json(updated);
}
