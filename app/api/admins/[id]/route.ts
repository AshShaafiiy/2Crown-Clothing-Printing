import { NextResponse } from 'next/server';
import { userRepository } from '@/backend/repositories';
import { authenticateNext, requireRolesNext } from '@/backend/utils/next-utils';
import { adminDto, MANAGER_ROLES } from '@/backend/utils/authorization';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });

  const authErr = requireRolesNext(user, MANAGER_ROLES);
  if (authErr) return NextResponse.json({ error: authErr.error }, { status: authErr.status });

  const { id } = await params;
  const admin = await userRepository.findById(id);
  if (!admin || admin.role === 'customer') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(adminDto(admin as any));
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: currentUser, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });

  const authErr = requireRolesNext(currentUser, MANAGER_ROLES);
  if (authErr) return NextResponse.json({ error: authErr.error }, { status: authErr.status });

  const { id } = await params;
  const targetUser = await userRepository.findById(id);
  
  if (!targetUser || targetUser.role === 'customer') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  if (targetUser.role === 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Root Super Admin cannot be deleted' }, { status: 403 });
  }
  
  if (targetUser.id === currentUser!.id) {
    return NextResponse.json({ error: 'Bad Request: Cannot delete yourself' }, { status: 400 });
  }

  if (currentUser!.role === 'admin' || currentUser!.role === 'customer') {
    return NextResponse.json({ error: 'Forbidden: Admins cannot delete administrators' }, { status: 403 });
  }

  if (targetUser.role === 'super_admin' && currentUser!.role !== 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Only Root Super Admin can delete Super Admins' }, { status: 403 });
  }

  const affected = await userRepository.deleteManaged(id, currentUser!.role === 'root_super_admin' ? ['admin', 'super_admin'] : ['admin']);
  if (!affected) return NextResponse.json({ error: 'Forbidden: Target privileges changed' }, { status: 403 });
  return new NextResponse(null, { status: 204 });
}
