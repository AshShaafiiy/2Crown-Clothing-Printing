const fs = require('fs');
const file = 'src/backend/repositories/OrderRepository.ts';
let code = fs.readFileSync(file, 'utf8');

const newMethod = `
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
`;

code = code.replace('export const orderRepository', newMethod + '\nexport const orderRepository');
fs.writeFileSync(file, code);
