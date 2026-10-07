import { db } from './src/backend/db/firebase';

async function run() {
  const snap = await db.collection('orders').where('status', '==', 'Processing').limit(1).get();
  if (snap.empty) {
    console.log("No processing orders found.");
    return;
  }
  const order = snap.docs[0].data();
  console.log(JSON.stringify(order.history, null, 2));
}

run().catch(console.error);
