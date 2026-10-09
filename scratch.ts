import { db } from './src/backend/db/firebase';

async function run() {
  const collections = ['orders', 'products', 'categories', 'users', 'customers', 'ratings', 'reviews'];
  for (const c of collections) {
    const snap = await db.collection(c).count().get();
    console.log(`${c.toUpperCase()} COUNT: ${snap.data().count}`);
  }

  // Calculate total sales
  const orders = await db.collection('orders').get();
  let totalSales = 0;
  orders.forEach(doc => {
    const data = doc.data();
    if (data.total) totalSales += Number(data.total);
    else if (data.subtotal) totalSales += (Number(data.subtotal) - (Number(data.discount) || 0) + (Number(data.deliveryFee) || 0));
  });
  console.log(`TOTAL SALES: ${totalSales}`);
}

run().catch(console.error);
