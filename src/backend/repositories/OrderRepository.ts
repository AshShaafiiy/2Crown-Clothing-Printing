import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/firebase';
import { Order, OrderHistoryEntry } from '../schemas';


function normalizeOrderData(data: any): Order {
  if (!data) return data;
  
  let createdAt = data.createdAt;
  if (!createdAt || isNaN(new Date(createdAt).getTime())) {
    createdAt = data.updatedAt;
    if (!createdAt || isNaN(new Date(createdAt).getTime())) {
      createdAt = ''; // Explicit missing, no synthetic epoch
    }
  }

  let updatedAt = data.updatedAt;
  if (!updatedAt || isNaN(new Date(updatedAt).getTime())) {
    updatedAt = createdAt;
  }

  let subtotal = Number(data.subtotal);
  if (isNaN(subtotal) || !data.subtotal) {
    // Dynamically derive from factual item data if missing
    subtotal = (data.items || []).reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity) || 0), 0);
  }

  const discount = Number(data.discount) || 0;
  
  let deliveryFee = data.deliveryFee;
  if (data.deliveryMethod === 'pickup') {
    deliveryFee = 0; // Business Rule: Store pickup is exactly 0
  } else if (deliveryFee !== null && deliveryFee !== undefined) {
    deliveryFee = Number(deliveryFee);
    if (isNaN(deliveryFee)) deliveryFee = null;
  } else {
    deliveryFee = null; // Unset local/nationwide delivery remains null
  }
  
  let total = Number(data.total);
  if (isNaN(total) || !data.total) {
    total = subtotal - discount + (deliveryFee || 0);
  }

  let history = data.history;
  if (!Array.isArray(history)) {
    history = [];
  } else {
    history = history.map((entry: any, index: number) => {
      if (typeof entry === 'string') {
        return {
          id: `legacy-${index}-${Date.now()}`,
          newStatus: 'Unknown',
          timestamp: '', // Explicit missing, no synthetic date
          actorName: 'System',
          note: entry
        };
      }
      return entry;
    });
  }

  return {
    ...data,
    createdAt,
    updatedAt,
    subtotal,
    discount,
    total,
    deliveryFee,
    history,
    items: Array.isArray(data.items) ? data.items : [],
    status: data.status || 'Unknown Status',
    customerName: data.customerName || 'Unknown',
    customerPhone: data.customerPhone || 'Unknown',
    reference: data.reference || 'Unknown-Ref'
  } as Order;
}


export class OrderRepository {
  async findAll(): Promise<Order[]> {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
    return snap.docs.map( (doc: any) => normalizeOrderData(doc.data()));
  }

  async findByReference(reference: string): Promise<Order | null> {
    const snap = await db.collection('orders').where('reference', '==', reference).limit(1).get();
    if (snap.empty) return null;
    return normalizeOrderData(snap.docs[0].data());
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) return null;
    return normalizeOrderData(doc.data());
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

  async checkPurchaseStatus(customerId: string, productId: string, email?: string, phone?: string): Promise<{ purchased: boolean; delivered: boolean }> {
    // Orders might not have a customerId if checked out as guest. 
    // We must match by customerId, or email, or phone.
    // Firestore doesn't support complex OR queries easily across different fields without multiple queries or composite indexes that we may not have.
    // Instead, we query all delivered and non-delivered orders for these identities in parallel, or just query all orders for this product?
    // Wait, getting ALL orders for a product and filtering in memory is bad if there are thousands of orders.
    // Querying by customerId, email, and phone in three separate queries is efficient.
    
    const queries = [];
    queries.push(db.collection('orders').where('customerId', '==', customerId).get());
    
    if (email) {
      queries.push(db.collection('orders').where('customerEmail', '==', email).get());
    }
    
    if (phone) {
      queries.push(db.collection('orders').where('customerPhone', '==', phone).get());
      // Also handle potential formatting differences like +234 vs 090
      if (phone.startsWith('+234')) {
        const localPhone = '0' + phone.slice(4);
        queries.push(db.collection('orders').where('customerPhone', '==', localPhone).get());
      }
    }
    
    const snapshots = await Promise.all(queries);
    
    let purchased = false;
    let delivered = false;

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const order = doc.data() as Order;
        if (order.items && order.items.some(item => item.productId === productId)) {
          purchased = true;
          if (order.status === 'Delivered') {
            delivered = true;
            break;
          }
        }
      }
      if (delivered) break;
    }
    
    return { purchased, delivered };
  }
}

export const orderRepository = new OrderRepository();
