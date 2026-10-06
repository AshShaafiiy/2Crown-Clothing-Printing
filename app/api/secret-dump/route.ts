import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories/OrderRepository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const orders = await orderRepository.findAll();
  return NextResponse.json(orders);
}
