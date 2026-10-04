import { NextResponse } from 'next/server';
import { userRepository } from '@/backend/repositories';
import { ChangePasswordRequestSchema } from '@/backend/schemas';
import { authenticateNext, parseBody } from '@/backend/utils/next-utils';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { user: currentUser, error: authErr, status: authStatus } = await authenticateNext(req);
  if (authErr) return NextResponse.json({ error: authErr }, { status: authStatus });

  const targetUser = await userRepository.findById(currentUser!.id);
  if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data, error, status } = await parseBody(req, ChangePasswordRequestSchema);
  if (error) return NextResponse.json(error, { status });

  const { currentPassword, newPassword } = data!;
  
  const currentHash = await userRepository.getPasswordHash(targetUser.id);
  if (!currentHash) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(currentPassword, currentHash);
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(targetUser.id, newHash);

  return NextResponse.json({ message: 'Password changed successfully.' });
}
