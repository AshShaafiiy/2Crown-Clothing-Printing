const fs = require('fs');
const file = 'app/api/ratings/[productId]/route.ts';

const code = `import { NextResponse } from 'next/server';
import { reviewRepository, orderRepository } from '@/backend/repositories';
import { SubmitRatingSchema } from '@/backend/schemas';
import { parseBody, authenticateCustomerNext } from '@/backend/utils/next-utils';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  
  const url = new URL(req.url);
  const checkEligibility = url.searchParams.get('eligibility') === 'true';
  
  if (checkEligibility) {
    const authRes = await authenticateCustomerNext(req);
    if (authRes.error) {
      return NextResponse.json({ eligible: false, reason: 'not_authenticated' });
    }
    
    const uid = authRes.uid!;
    
    const hasDelivered = await orderRepository.hasDeliveredProduct(uid, productId);
    if (!hasDelivered) {
      return NextResponse.json({ eligible: false, reason: 'not_purchased_or_delivered' });
    }
    
    const existingId = \`\${uid}_\${productId}\`;
    const existingRating = await reviewRepository.findById(existingId);
    
    if (existingRating) {
      return NextResponse.json({ eligible: true, reason: 'already_rated', existingRating: existingRating.rating });
    }
    
    return NextResponse.json({ eligible: true, reason: 'eligible' });
  }

  const summary = await reviewRepository.getRatingSummary(productId);
  return NextResponse.json(summary);
}

export async function POST(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  
  const authRes = await authenticateCustomerNext(req);
  if (authRes.error) return NextResponse.json({ error: authRes.error }, { status: authRes.status });
  const uid = authRes.uid!;
  
  const hasDelivered = await orderRepository.hasDeliveredProduct(uid, productId);
  if (!hasDelivered) {
    return NextResponse.json({ error: 'Forbidden: You must have a Delivered order of this product to rate it.' }, { status: 403 });
  }

  const { data, error, status } = await parseBody(req, SubmitRatingSchema);
  if (error) return NextResponse.json(error, { status });

  const ratingId = \`\${uid}_\${productId}\`;
  const existingRating = await reviewRepository.findById(ratingId);
  
  if (existingRating) {
    await reviewRepository.update(ratingId, {
      rating: data.rating,
      updatedAt: new Date().toISOString()
    });
    return NextResponse.json({ ...existingRating, rating: data.rating, updatedAt: new Date().toISOString() }, { status: 200 });
  } else {
    const newRating = {
      id: ratingId,
      productId,
      customerId: uid,
      customerName: authRes.name || 'Customer',
      rating: data.rating,
      createdAt: new Date().toISOString(),
      approved: true
    };
    
    await reviewRepository.create(newRating as any);
    return NextResponse.json(newRating, { status: 201 });
  }
}
`;

fs.writeFileSync(file, code);
console.log('API route patched');
