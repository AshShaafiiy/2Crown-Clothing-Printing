import { db } from './src/backend/db/firebase';

async function audit() {
  const reviewsSnap = await db.collection('reviews').get();
  let total = 0;
  let verified = 0;
  let legacy = 0;
  let invalid = 0;

  for (const doc of reviewsSnap.docs) {
    total++;
    const review = doc.data() as any;
    
    if (!review.customerId) {
      legacy++;
      continue;
    }
    
    // Check if deterministic ID exists
    const deterministicId = `${review.customerId}_${review.productId}`;
    if (doc.id !== deterministicId && review.id !== deterministicId) {
      legacy++;
      continue;
    }

    // Check if order exists
    const ordersSnap = await db.collection('orders')
      .where('customerId', '==', review.customerId)
      .where('status', '==', 'Delivered')
      .get();
      
    let hasPurchased = false;
    for (const orderDoc of ordersSnap.docs) {
      const order = orderDoc.data() as any;
      if (order.items && order.items.some((i: any) => i.productId === review.productId)) {
        hasPurchased = true;
        break;
      }
    }
    
    if (hasPurchased) {
      verified++;
    } else {
      invalid++;
    }
  }

  console.log(`TOTAL RATINGS: ${total}`);
  console.log(`VERIFIED UNDER NEW RULE: ${verified}`);
  console.log(`LEGACY UNVERIFIED: ${legacy}`);
  console.log(`INVALID/DUPLICATE: ${invalid}`);
}

audit().then(() => process.exit(0)).catch(console.error);
