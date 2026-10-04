import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/firebase';
import { Order, OrderHistoryEntry } from '../schemas';

export class OrderRepository {
  async findAll(): Promise<Order[]> {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
    return snap.docs.map( (doc: any) => doc.data() as Order);
  }

  async findByReference(reference: string): Promise<Order | null> {
    const snap = await db.collection('orders').where('reference', '==', reference).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Order;
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Order;
  }

  async create(order: Order): Promise<Order> {
    const orderData = { ...order };
    // Ensure nested IDs for items if needed
    if (orderData.items) {
      orderData.items = orderData.items.map(item => ({
        ...item,
        id: item.id || uuidv4()
      }));
    }
    
    await db.collection('orders').doc(order.id).set(orderData);
    return orderData;
  }

  async updateStatus(id: string, newStatus: string, historyEntry: OrderHistoryEntry): Promise<Order | null> {
    const docRef = db.collection('orders').doc(id);
    
    await db.runTransaction(async (t: any) => {
      const doc = await t.get(docRef);
      if (!doc.exists) throw new Error('Order not found');
      
      const order = doc.data() as Order;
      const history = order.history || [];
      history.push(historyEntry);
      
      t.update(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history
      });
    });

    return this.findById(id);
  }

  async updateDeliveryFee(id: string, deliveryFee: number): Promise<Order | null> {
    const docRef = db.collection('orders').doc(id);

    await db.runTransaction(async (t: any) => {
      const doc = await t.get(docRef);
      if (!doc.exists) throw new Error('Order not found');
      
      const order = doc.data() as Order;
      const newTotal = order.subtotal - order.discount + deliveryFee;
      
      t.update(docRef, {
        deliveryFee,
        total: newTotal,
        updatedAt: new Date().toISOString()
      });
    });

    return this.findById(id);
  }
}

export const orderRepository = new OrderRepository();
