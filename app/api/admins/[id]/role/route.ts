import { NextResponse } from 'next/server';
import { userRepository } from '@/backend/repositories';
import { UpdateRoleRequestSchema } from '@/backend/schemas';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';
import { adminDto } from '@/backend/utils/authorization';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { user: currentUser, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });

  const authErr = requireRolesNext(currentUser, ['root_super_admin']);
  if (authErr) return NextResponse.json({ error: authErr.error }, { status: authErr.status });

  const { id } = params;
  const targetUser = await userRepository.findById(id);
  
  if (!targetUser || targetUser.role === 'customer') return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (targetUser.role === 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Root Super Admin role cannot be modified' }, { status: 403 });
  }

  const { data, error: parseErr, status: parseStatus } = await parseBody(req, UpdateRoleRequestSchema);
  if (parseErr) return NextResponse.json(parseErr, { status: parseStatus });

  if (data!.role === 'root_super_admin' || data!.role === 'customer') {
    return NextResponse.json({ error: 'Forbidden: Cannot promote to Root Super Admin' }, { status: 403 });
  }

  if (currentUser!.role !== 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Only Root Super Admin can modify roles' }, { status: 403 });
  }

  const updatedUser = await userRepository.update(id, { role: data!.role });
  return NextResponse.json(updatedUser ? adminDto(updatedUser as any) : null);
}
