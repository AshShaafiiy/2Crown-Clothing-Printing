import { NextResponse } from 'next/server';
import { categoryRepository } from '@/backend/repositories';
import { CategoryInputSchema } from '@/backend/schemas';
import { authenticateNext, parseBody, requireRolesNext } from '@/backend/utils/next-utils';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  let cat = await categoryRepository.findById(id);
  if (!cat) {
    cat = await categoryRepository.findBySlug(id);
  }
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  const { id } = params;
  const existing = await categoryRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, CategoryInputSchema);
  if (error) return NextResponse.json(error, { status });

  const updated = await categoryRepository.update(id, data!);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  const { id } = params;
  const existing = await categoryRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await categoryRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}
