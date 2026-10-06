import { NextResponse } from 'next/server';
import { orderRepository, reviewRepository } from '@/backend/repositories';
import { normalizePhone } from '@/backend/utils/phone';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function POST(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  try {
    const body = await req.json();
    const { reference, phone } = body;

    if (!reference || !/^2C-\d{6}$/i.test(reference.trim())) {
      return NextResponse.json({ error: 'We couldn\'t verify this purchase.' }, { status: 404 });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'We couldn\'t verify this purchase.' }, { status: 404 });
    }

    const normalizedReference = reference.trim().toUpperCase();
    const normalizedClientPhone = normalizePhone(phone);

    const order = await orderRepository.findByReference(normalizedReference);
    if (!order) {
      return NextResponse.json({ error: 'We couldn\'t verify this purchase.' }, { status: 404 });
    }

    const orderPhone = normalizePhone(order.customerPhone);
    if (orderPhone !== normalizedClientPhone) {
      return NextResponse.json({ error: 'We couldn\'t verify this purchase.' }, { status: 404 });
    }

    const productInOrder = order.items.some(item => item.productId === productId);
    if (!productInOrder) {
      return NextResponse.json({ error: 'We couldn\'t verify this purchase.' }, { status: 404 });
    }

    if (order.status !== 'Delivered') {
      return NextResponse.json({ 
        error: 'You can rate this product after delivery.',
        status: order.status
      }, { status: 403 });
    }

    const buyerFingerprint = crypto.createHmac('sha256', JWT_SECRET)
                                   .update(normalizedClientPhone)
                                   .digest('hex');

    const token = jwt.sign({ buyerFingerprint, productId }, JWT_SECRET, { expiresIn: '1h' });

    const existingId = `rating_${buyerFingerprint}_${productId}`;
    const existingRating = await reviewRepository.findById(existingId);

    return NextResponse.json({
      token,
      existingRating: existingRating ? existingRating.rating : undefined
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
