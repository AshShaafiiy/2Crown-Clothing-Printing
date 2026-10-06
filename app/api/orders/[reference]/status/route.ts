import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories';
import { UpdateOrderStatusSchema } from '@/backend/schemas';
import { authenticateNext, parseBody, requireRolesNext } from '@/backend/utils/next-utils';

export async function PATCH(req: Request, { params }: { params: { reference: string } }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  // Note: the route says [reference] but it's used as ID based on the old code.
  // Actually, Vercel frontend uses the ID in /api/orders/:id/status.
  // Let's use it as ID.
  const { reference: id } = await params;
  const existing = await orderRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, UpdateOrderStatusSchema);
  if (error) return NextResponse.json(error, { status });

  const updated = await orderRepository.updateStatus(id, data!.status, 'Admin updated status');
  return NextResponse.json(updated);
}
