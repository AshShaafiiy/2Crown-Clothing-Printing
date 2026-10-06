const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

if (!getApps().length) {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
  } else {
    initializeApp({ projectId: 'demo-2crown-clothing' });
  }
}

const db = getFirestore();

async function audit() {
  const reviewsSnap = await db.collection('reviews').get();
  let total = 0;
  let verified = 0;
  let legacy = 0;
  let invalid = 0;

  for (const doc of reviewsSnap.docs) {
    total++;
    const review = doc.data();
    if (!review.customerId) {
      legacy++;
      continue;
    }
    
    // Check if deterministic ID exists
    const deterministicId = `${review.customerId}_${review.productId}`;
    if (doc.id !== deterministicId) {
      if (review.id === deterministicId) {
        // Document ID mismatch but ID field matches?
      } else {
        legacy++;
        continue;
      }
    }

    // Check if order exists
    const ordersSnap = await db.collection('orders')
      .where('customerId', '==', review.customerId)
      .where('status', '==', 'Delivered')
      .get();
      
    let hasPurchased = false;
    for (const orderDoc of ordersSnap.docs) {
      const order = orderDoc.data();
      if (order.items && order.items.some(i => i.productId === review.productId)) {
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

audit().catch(console.error);
