import { NextResponse } from 'next/server';
import { productRepository } from '@/backend/repositories';
import { ProductInputSchema } from '@/backend/schemas';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  let product = await productRepository.findById(id);
  if (!product) {
    product = await productRepository.findBySlug(id);
  }
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { id } = params;
  const existing = await productRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, ProductInputSchema);
  if (error) return NextResponse.json(error, { status });

  const updated = await productRepository.update(id, data!);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { id } = params;
  const existing = await productRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await productRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}
