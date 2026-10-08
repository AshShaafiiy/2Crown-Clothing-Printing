import { NextResponse } from 'next/server';
import { productRepository } from '@/backend/repositories';
import { ProductInputSchema } from '@/backend/schemas';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';
import { deleteImageKitFile } from '@/backend/utils/imagekit';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = await productRepository.findById(id);
  if (!product) {
    product = await productRepository.findBySlug(id);
  }
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { id } = await params;
  const existing = await productRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, ProductInputSchema);
  if (error || !data) return NextResponse.json(error || { error: 'Invalid input' }, { status: status || 400 });

  const updated = await productRepository.update(id, data);
  
  if (updated && existing.imageFileId && data.imageFileId && existing.imageFileId !== data.imageFileId) {
    await deleteImageKitFile(existing.imageFileId);
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { id } = await params;
  const existing = await productRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await productRepository.delete(id);

  if (existing.imageFileId) {
    await deleteImageKitFile(existing.imageFileId);
  }

  return new NextResponse(null, { status: 204 });
}
