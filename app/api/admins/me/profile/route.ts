import { NextResponse } from 'next/server';
import { userRepository } from '@/backend/repositories';
import { UpdateProfileRequestSchema } from '@/backend/schemas';
import { authenticateNext, parseBody } from '@/backend/utils/next-utils';
import { adminDto } from '@/backend/utils/authorization';

export async function GET(req: Request) {
  const { user: currentUser, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });

  const admin = await userRepository.findById(currentUser!.id);
  if (!admin) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(adminDto(admin as any));
}

export async function PATCH(req: Request) {
  const { user: currentUser, error: authErr, status: authStatus } = await authenticateNext(req);
  if (authErr) return NextResponse.json({ error: authErr }, { status: authStatus });

  const targetUser = await userRepository.findById(currentUser!.id);
  if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, UpdateProfileRequestSchema);
  if (error) return NextResponse.json(error, { status });

  const { name, email, phone } = data!;
  if (email !== targetUser.email) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'This email address is already in use.' }, { status: 400 });
    }
  }

  const updatedUser = await userRepository.update(currentUser!.id, {
    name,
    email,
    phone: phone !== undefined ? phone : targetUser.phone
  });
  
  return NextResponse.json(updatedUser ? adminDto(updatedUser as any) : null);
}
