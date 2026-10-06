import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories/OrderRepository';
import { db } from '@/backend/db/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const order = await orderRepository.findByReference('2C-133380');
  if (order) {
    const fixedHistory = [
      {
        newStatus: 'Awaiting Confirmation',
        timestamp: '2026-10-06T14:45:45.668Z',
        actorName: 'System',
        note: 'Order placed and awaiting admin confirmation.'
      },
      {
        newStatus: 'Confirmed',
        timestamp: '2026-10-06T18:00:00.000Z',
        actorName: 'Admin',
        note: 'Admin updated status'
      },
      {
        newStatus: 'Processing',
        timestamp: '2026-10-06T20:22:59.624Z',
        actorName: 'Admin',
        note: 'Admin updated status'
      }
    ];
    await db.collection('orders').doc(order.id).update({ history: fixedHistory });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false });
}
