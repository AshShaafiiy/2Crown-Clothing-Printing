import { NextResponse } from 'next/server';
import { productRepository } from '@/backend/repositories';
import { ProductInputSchema } from '@/backend/schemas';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';

export async function GET(req: Request) {
  const url = new URL(req.url);
  let products = await productRepository.findAll();

  const categoryId = url.searchParams.get('categoryId');
  const active = url.searchParams.get('active');
  const featured = url.searchParams.get('featured');

  if (categoryId) products = products.filter(p => p.categoryId === categoryId);
  if (active !== null) products = products.filter(p => p.active === (active === 'true'));
  if (featured !== null) products = products.filter(p => p.featured === (featured === 'true'));

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

  const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
  if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

  const { data, error, status } = await parseBody(req, ProductInputSchema);
  if (error) return NextResponse.json(error, { status });

  const newProduct = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    ...data
  };
  await productRepository.create(newProduct as any);
  return NextResponse.json(newProduct, { status: 201 });
}
