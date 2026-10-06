const fs = require('fs');
let code = fs.readFileSync('src/backend/repositories/OrderRepository.ts', 'utf8');

const replacement = `
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
`;

code = code.replace(/async checkPurchaseStatus[\s\S]*?return \{ purchased, delivered \};\n\s*\}/, replacement.trim());
fs.writeFileSync('src/backend/repositories/OrderRepository.ts', code);
