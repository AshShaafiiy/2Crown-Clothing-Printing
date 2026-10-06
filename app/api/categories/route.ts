import { NextResponse } from 'next/server';
import { categoryRepository } from '@/backend/repositories';
import { CategoryInputSchema } from '@/backend/schemas';
import { authenticateNext, parseBody, requireRolesNext } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';


function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: Request) {
  const categories = await categoryRepository.findAll();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { user, error: authError, status: authStatus } = await authenticateNext(req);
  if (authError) return NextResponse.json({ error: authError }, { status: authStatus });
  const roleErr = requireRolesNext(user, ['admin', 'super_admin', 'root_super_admin']);
  if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

  const { data, error, status } = await parseBody(req, CategoryInputSchema);
  if (error) return NextResponse.json(error, { status });

  data.slug = generateSlug(data.name);
  const existingBySlug = await categoryRepository.findBySlug(data.slug);
  if (existingBySlug) {
    return NextResponse.json({ error: 'A category with a similar name already exists.' }, { status: 409 });
  }
  const newCategory = await categoryRepository.create({ id: uuid(), ...data, createdAt: new Date().toISOString() });
  return NextResponse.json(newCategory, { status: 201 });
}
