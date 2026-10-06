import { NextResponse } from 'next/server';
import { userRepository } from '@/backend/repositories';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';
import { adminDto, MANAGER_ROLES } from '@/backend/utils/authorization';
import { z } from 'zod';

const UpdateStatusRequestSchema = z.object({ active: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { user: currentUser, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });

  const authErr = requireRolesNext(currentUser, MANAGER_ROLES);
  if (authErr) return NextResponse.json({ error: authErr.error }, { status: authErr.status });

  const { id } = await params;
  const targetUser = await userRepository.findById(id);
  
  if (!targetUser || targetUser.role === 'customer') return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (targetUser.id === currentUser!.id) {
    return NextResponse.json({ error: 'Forbidden: Cannot change your own status' }, { status: 403 });
  }

  if (targetUser.role === 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Root Super Admin status cannot be modified' }, { status: 403 });
  }

  if (currentUser!.role === 'admin' || currentUser!.role === 'customer') {
    return NextResponse.json({ error: 'Forbidden: Admins cannot modify status' }, { status: 403 });
  }

  if (targetUser.role === 'super_admin' && currentUser!.role !== 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Only Root Super Admin can modify Super Admin status' }, { status: 403 });
  }

  const { data, error: parseErr, status: parseStatus } = await parseBody(req, UpdateStatusRequestSchema);
  if (parseErr) return NextResponse.json(parseErr, { status: parseStatus });

  const affected = await userRepository.updateManagedStatus(id, data!.active, currentUser!.role === 'root_super_admin' ? ['admin', 'super_admin'] : ['admin']);
  if (!affected) return NextResponse.json({ error: 'Forbidden: Target privileges changed' }, { status: 403 });
  
  const updatedUser = await userRepository.findById(id);
  return NextResponse.json(updatedUser ? adminDto(updatedUser as any) : null);
}
