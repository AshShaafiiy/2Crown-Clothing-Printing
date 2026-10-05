import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories';

export async function GET(req: Request, { params }: { params: { reference: string } }) {
  const { reference } = params;
  const order = await orderRepository.findByReference(reference);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}
