import { NextResponse } from 'next/server';
import { authenticateNext } from '@/backend/utils/next-utils';

export async function POST(req: Request) {
  const { error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });
  return new NextResponse(null, { status: 204 });
}
