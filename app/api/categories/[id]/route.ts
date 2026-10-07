import { NextResponse } from 'next/server';
import { categoryRepository, productRepository } from '@/backend/repositories';
import { CategoryInputSchema } from '@/backend/schemas';
import { authenticateNext, parseBody, requireRolesNext } from '@/backend/utils/next-utils';


function generateSlug(text: string) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let cat = await categoryRepository.findById(id);
  if (!cat) {
    cat = await categoryRepository.findBySlug(id);
  }
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  const { id } = await params;
  const existing = await categoryRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, CategoryInputSchema);
  if (error || !data) return NextResponse.json(error || { error: 'Invalid input' }, { status: status || 400 });

  data.slug = generateSlug(data.name);
  const existingBySlug = await categoryRepository.findBySlug(data.slug);
  if (existingBySlug && existingBySlug.id !== id) {
    return NextResponse.json({ error: 'A category with a similar name already exists.' }, { status: 409 });
  }
  const updated = await categoryRepository.update(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  const { id } = await params;
  const existing = await categoryRepository.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const allProducts = await productRepository.findAll();
  const hasProducts = allProducts.some(p => p.categoryId === id);
  if (hasProducts) {
    return NextResponse.json({ error: 'Cannot delete category with associated products' }, { status: 400 });
  }

  await categoryRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}
