import { NextResponse } from 'next/server';
import { db } from '@/backend/store/db';
import { UpdateOrderStatusSchema } from '@/backend/schemas';
import { authenticateNext, parseBody } from '@/backend/utils/next-utils';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const { id } = params;
  const index = db.orders.findIndex((o: any) => o.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, UpdateOrderStatusSchema);
  if (error) return NextResponse.json(error, { status });

  db.orders[index].status = data!.status;
  db.orders[index].updatedAt = new Date().toISOString();
  return NextResponse.json(db.orders[index]);
}
