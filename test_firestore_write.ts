import { db } from './src/backend/db/firebase';
import { orderRepository } from './src/backend/repositories/OrderRepository';
import { v4 as uuid } from 'uuid';

async function run() {
  const reference = `QA-${Date.now()}`;
  const now = new Date().toISOString();
  
  // 1. Create order
  const newOrder = {
    id: uuid(),
    reference,
    customerName: 'QA Test',
    customerPhone: '09012345678',
    customerEmail: 'qa@example.com',
    deliveryMethod: 'pickup',
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
    status: 'Awaiting Confirmation',
    history: [{
      id: uuid(),
      newStatus: 'Awaiting Confirmation',
      timestamp: now,
      actorName: 'System',
      note: 'Order placed'
    }],
    createdAt: now,
    updatedAt: now
  };
  
  await orderRepository.create(newOrder as any);
  let order = await orderRepository.findById(newOrder.id);
  console.log("AFTER CREATION HISTORY LENGTH:", order?.history?.length);
  console.log(JSON.stringify(order?.history, null, 2));

  // 2. Confirm
  await orderRepository.updateStatus(newOrder.id, 'Confirmed', {
    id: uuid(),
    previousStatus: 'Awaiting Confirmation',
    newStatus: 'Confirmed',
    timestamp: new Date().toISOString(),
    actorName: 'Admin',
    note: 'Confirmed'
  } as any);

  order = await orderRepository.findById(newOrder.id);
  console.log("AFTER CONFIRM HISTORY LENGTH:", order?.history?.length);
  console.log(JSON.stringify(order?.history, null, 2));

  // 3. Mark as Preparing
  await orderRepository.updateStatus(newOrder.id, 'Processing', {
    id: uuid(),
    previousStatus: 'Confirmed',
    newStatus: 'Processing',
    timestamp: new Date().toISOString(),
    actorName: 'Admin',
    note: 'Preparing'
  } as any);

  order = await orderRepository.findById(newOrder.id);
  console.log("AFTER PREPARING HISTORY LENGTH:", order?.history?.length);
  console.log(JSON.stringify(order?.history, null, 2));
}

run().catch(console.error);
