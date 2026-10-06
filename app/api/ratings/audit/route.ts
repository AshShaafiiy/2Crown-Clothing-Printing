import { NextResponse } from 'next/server';
import { db } from '@/backend/db/firebase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
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
      
      const deterministicId = `${review.customerId}_${review.productId}`;
      if (doc.id !== deterministicId && review.id !== deterministicId) {
        legacy++;
        continue;
      }

      const ordersSnap = await db.collection('orders')
        .where('customerId', '==', review.customerId)
        .where('status', '==', 'Delivered')
        .get();
        
      let hasPurchased = false;
      for (const orderDoc of ordersSnap.docs) {
        const order = orderDoc.data();
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

    return NextResponse.json({
      total,
      verified,
      legacy,
      invalid
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
