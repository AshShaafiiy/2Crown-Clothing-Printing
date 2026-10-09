import { NextResponse } from 'next/server';
import { db } from '../../../../src/backend/db/firebase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get('secret') !== 'CROWN_RESET_999') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await db.collection('orders').get();
    const orderCountBefore = orders.size;
    let totalSalesBefore = 0;

    const batch = db.batch();
    orders.forEach(doc => {
      const data = doc.data();
      if (data.total) totalSalesBefore += Number(data.total);
      else if (data.subtotal) totalSalesBefore += (Number(data.subtotal) - (Number(data.discount) || 0) + (Number(data.deliveryFee) || 0));
      batch.delete(doc.ref);
    });

    await batch.commit();

    const customersCount = await db.collection('customers').count().get().catch(() => ({ data: () => ({ count: 0 }) }));
    const ratingsCount = await db.collection('ratings').count().get().catch(() => ({ data: () => ({ count: 0 }) }));
    const productCount = await db.collection('products').count().get().catch(() => ({ data: () => ({ count: 0 }) }));
    const categoryCount = await db.collection('categories').count().get().catch(() => ({ data: () => ({ count: 0 }) }));
    const adminCount = await db.collection('users').count().get().catch(() => ({ data: () => ({ count: 0 }) }));

    const orderCountAfter = (await db.collection('orders').count().get()).data().count;

    return NextResponse.json({
      message: 'Orders wiped successfully',
      stats: {
        orderCountBefore,
        orderCountAfter,
        totalSalesBefore,
        customerCount: customersCount.data().count,
        productCount: productCount.data().count,
        categoryCount: categoryCount.data().count,
        ratingsCount: ratingsCount.data().count,
        adminCount: adminCount.data().count
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
