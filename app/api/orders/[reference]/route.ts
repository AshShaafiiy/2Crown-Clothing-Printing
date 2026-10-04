import { NextResponse } from 'next/server';
import { db } from '@/backend/store/db';

export async function GET(req: Request, { params }: { params: { reference: string } }) {
  const { reference } = params;
  const order = db.orders.find((o: any) => o.reference === reference);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}
