import { NextResponse } from 'next/server';
import { reviewRepository } from '@/backend/repositories';
import { SubmitRatingSchema } from '@/backend/schemas';
import { parseBody } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  const summary = await reviewRepository.getRatingSummary(productId);
  return NextResponse.json(summary);
}

export async function POST(req: Request, { params }: { params: { productId: string } }) {
  const { productId } = await params;
  
  const { data, error, status } = await parseBody(req, SubmitRatingSchema);
  if (error) return NextResponse.json(error, { status });

  const newRating = {
    id: uuid(),
    productId,
    ...data,
    createdAt: new Date().toISOString(),
    approved: true
  };
  
  await reviewRepository.create(newRating as any);
  return NextResponse.json(newRating, { status: 201 });
}
