import { NextResponse } from 'next/server';
import { orderRepository, productRepository } from '@/backend/repositories';
import { authenticateNext } from '@/backend/utils/next-utils';

export async function GET(req: Request) {
  const { user, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });

  if (user?.role === 'customer') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
  }

  const allOrders = await orderRepository.findAll();
  const allProducts = await productRepository.findAll();

  const terminalStates = ['Delivered', 'Picked Up', 'Cancelled'];
  const pendingOrders = allOrders.filter(o => !terminalStates.includes(o.status)).length;
  
  const totalSales = allOrders
    .filter(o => o.status === 'Delivered' || o.status === 'Picked Up')
    .reduce((sum, order) => sum + (order.subtotal - (order.discount || 0) + (order.deliveryFee || 0)), 0);

  return NextResponse.json({
    totalOrders: allOrders.length,
    pendingOrders,
    totalProducts: allProducts.length,
    totalSales
  });
}
