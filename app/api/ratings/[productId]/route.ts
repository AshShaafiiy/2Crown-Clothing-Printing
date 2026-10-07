import { NextResponse } from 'next/server';
import { reviewRepository } from '@/backend/repositories';
import { SubmitRatingSchema } from '@/backend/schemas';
import { parseBody } from '@/backend/utils/next-utils';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.RATING_TOKEN_SECRET || process.env.JWT_SECRET || 'dev_token_secret';

export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  
  const url = new URL(req.url);
  const checkEligibility = url.searchParams.get('eligibility') === 'true';
  
  if (checkEligibility) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ eligible: false, reason: 'not_authenticated' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, TOKEN_SECRET) as any;
      if (decoded.productId !== productId) {
        return NextResponse.json({ eligible: false, reason: 'not_authenticated' });
      }
      
      const existingId = `rating_${decoded.buyerFingerprint}_${productId}`;
      const existingRating = await reviewRepository.findById(existingId);
      
      if (existingRating) {
        return NextResponse.json({ eligible: true, reason: 'already_rated', existingRating: existingRating.rating });
      }
      return NextResponse.json({ eligible: true, reason: 'eligible' });
    } catch (e) {
      return NextResponse.json({ eligible: false, reason: 'not_authenticated' });
    }
  }

  const summary = await reviewRepository.getRatingSummary(productId);
  return NextResponse.json(summary);
}

export async function POST(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, TOKEN_SECRET) as any;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
  
  if (decoded.productId !== productId) {
    return NextResponse.json({ error: 'Token product mismatch' }, { status: 403 });
  }

  const { data, error, status } = await parseBody(req, SubmitRatingSchema);
  if (error || !data) return NextResponse.json(error || { error: 'Invalid input' }, { status: status || 400 });

  const ratingId = `rating_${decoded.buyerFingerprint}_${productId}`;
  const existingRating = await reviewRepository.findById(ratingId);
  
  if (existingRating) {
    await reviewRepository.update(ratingId, {
      rating: data.rating,
      updatedAt: new Date().toISOString(),
      
    });
    return NextResponse.json({ ...existingRating, rating: data.rating, updatedAt: new Date().toISOString() }, { status: 200 });
  } else {
    const newRating = {
      id: ratingId,
      productId,
      buyerFingerprint: decoded.buyerFingerprint,
      rating: data.rating,
      createdAt: new Date().toISOString(),
      approved: true,
      verifiedPurchase: true
    };
    
    await reviewRepository.create(newRating as any);
    return NextResponse.json(newRating, { status: 201 });
  }
}
