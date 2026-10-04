import { NextResponse } from 'next/server';
import { db } from '@/backend/store/db';
import { CategoryInputSchema } from '@/backend/schemas';
import { authenticateNext, parseBody } from '@/backend/utils/next-utils';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const cat = db.categories.find((c: any) => c.id === id || c.slug === id);
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const { id } = params;
  const index = db.categories.findIndex((c: any) => c.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, CategoryInputSchema);
  if (error) return NextResponse.json(error, { status });

  db.categories[index] = { id, ...data } as any;
  return NextResponse.json(db.categories[index]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const { id } = params;
  const index = db.categories.findIndex((c: any) => c.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.categories.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
