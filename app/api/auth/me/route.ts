import { NextResponse } from 'next/server';
import { authenticateNext } from '@/backend/utils/next-utils';

export async function GET(req: Request) {
  const { user, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });
  return NextResponse.json(user);
}
