import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories/OrderRepository';
import { OrderInputSchema } from '@/backend/schemas';
import { authenticateNext, parseBody } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';
import { rateLimit } from '@/utils/rateLimit';

export async function GET(req: Request) {
  const { error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });
  const orders = await orderRepository.findAll();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rl = rateLimit(ip, 5, 60 * 1000); // 5 requests per minute
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { data, error, status } = await parseBody(req, OrderInputSchema);
  if (error) return NextResponse.json(error, { status });

  const now = new Date().toISOString();
    const initialHistory = [{
    id: uuid(),
    newStatus: 'Awaiting Confirmation',
    timestamp: now,
    actorName: 'System',
    note: 'Order placed and awaiting admin confirmation.'
  }];

  const newOrder = {
    id: uuid(),
    reference: `2C-${Math.floor(100000 + Math.random() * 900000)}`,
    ...data,
    status: 'Awaiting Confirmation',
    history: initialHistory,
    createdAt: now,
    updatedAt: now
  };
  
  if (newOrder.deliveryMethod === 'pickup') {
    newOrder.deliveryFee = 0;
  }

  const savedOrder = await orderRepository.create(newOrder as any);
  return NextResponse.json(savedOrder, { status: 201 });
}
