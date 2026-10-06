const fs = require('fs');

let orderCode = fs.readFileSync('src/backend/repositories/OrderRepository.ts', 'utf8');

// Strip out everything from `async hasDeliveredProduct` down to the bottom
orderCode = orderCode.replace(/async hasDeliveredProduct[\s\S]*$/, '');
orderCode = orderCode.replace(/^}\s*$/mg, ''); // remove trailing braces

const newTail = `
  async checkPurchaseStatus(customerId: string, productId: string): Promise<{ purchased: boolean; delivered: boolean }> {
    const snap = await db.collection('orders')
      .where('customerId', '==', customerId)
      .get();
      
    if (snap.empty) return { purchased: false, delivered: false };
    
    let purchased = false;
    let delivered = false;

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
    return { purchased, delivered };
  }
}

export const orderRepository = new OrderRepository();
`;

fs.writeFileSync('src/backend/repositories/OrderRepository.ts', orderCode + newTail);
console.log('Fixed OrderRepository');
