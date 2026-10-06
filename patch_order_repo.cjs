const fs = require('fs');
const file = 'src/backend/repositories/OrderRepository.ts';
let code = fs.readFileSync(file, 'utf8');

const newMethod = `
  async hasDeliveredProduct(customerId: string, productId: string): Promise<boolean> {
    const snap = await db.collection('orders')
      .where('customerId', '==', customerId)
      .where('status', '==', 'Delivered')
      .get();
    
    if (snap.empty) return false;

    for (const doc of snap.docs) {
      const order = doc.data() as Order;
      if (order.items && order.items.some(item => item.productId === productId)) {
        return true;
      }
    }
    return false;
  }
`;

if (!code.includes('hasDeliveredProduct')) {
  code = code.replace('export const orderRepository', newMethod + '\nexport const orderRepository');
  fs.writeFileSync(file, code);
  console.log('OrderRepository patched');
} else {
  console.log('Already patched');
}
