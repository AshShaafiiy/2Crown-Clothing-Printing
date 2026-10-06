import { NextResponse } from 'next/server';
import { orderRepository } from '@/backend/repositories/OrderRepository';
import { rateLimit } from '@/utils/rateLimit';
import { normalizePhone } from '@/backend/utils/phone';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rl = rateLimit(ip, 10, 60 * 1000); // 10 requests per minute
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { reference, phone } = body;

    // 1. Validate format
    if (!reference || !/^2C-\d{6}$/i.test(reference.trim())) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Normalize inputs
    const normalizedReference = reference.trim().toUpperCase();
    const normalizedPhone = normalizePhone(phone);

    // 2. Locate order
    const order = await orderRepository.findByReference(normalizedReference);
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 3. Compare phone securely
    const orderPhone = normalizePhone(order.customerPhone);
    if (orderPhone !== normalizedPhone) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 4. Return sanitized DTO
    const {
      id,
      customerEmail,
      customerPhone,
      customerAddress,
      ...sanitized
    } = order as any;

    return NextResponse.json(sanitized, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
