import { NextResponse } from 'next/server';
import { db } from '@/backend/store/db';
import { CategoryInputSchema } from '@/backend/schemas';
import { authenticateNext, parseBody } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';

export async function GET(req: Request) {
  return NextResponse.json(db.categories);
}

export async function POST(req: Request) {
  const { error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const { data, error, status } = await parseBody(req, CategoryInputSchema);
  if (error) return NextResponse.json(error, { status });

  const newCategory = { id: uuid(), ...data };
  db.categories.push(newCategory as any);
  return NextResponse.json(newCategory, { status: 201 });
}
