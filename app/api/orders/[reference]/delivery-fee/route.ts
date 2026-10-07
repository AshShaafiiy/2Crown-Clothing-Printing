import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';
import { z } from 'zod';

const DeliveryFeeSchema = z.object({
  deliveryFee: z.number().min(0)
});

export async function PATCH(req: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { reference: id } = await params;
  
  const { data, error, status } = await parseBody(req, DeliveryFeeSchema);
  if (error) return NextResponse.json(error, { status });

  try {
    const updated = await orderRepository.updateDeliveryFee(id, data!.deliveryFee);
    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err.message === 'Order not found') return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
