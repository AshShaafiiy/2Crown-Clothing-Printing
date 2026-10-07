import { NextResponse } from 'next/server';
import { auth } from '@/backend/db/firebase';
import { userRepository } from '@/backend/repositories';
import { CreateUserRequestSchema } from '@/backend/schemas';
import { authenticateNext, requireRolesNext, parseBody } from '@/backend/utils/next-utils';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import { adminDto, STAFF_ROLES, MANAGER_ROLES } from '@/backend/utils/authorization';

export async function GET(req: Request) {
  const { user, error, status } = await authenticateNext(req);
  if (error) return NextResponse.json({ error }, { status });
  
  const authErr = requireRolesNext(user, MANAGER_ROLES);
  if (authErr) return NextResponse.json({ error: authErr.error }, { status: authErr.status });

  const allUsers = await userRepository.findAll();
  const admins = allUsers.filter(u => STAFF_ROLES.includes(u.role));
  return NextResponse.json(admins.map(adminDto));
}

export async function POST(req: Request) {
  const { user: currentUser, error: authErr1, status: status1 } = await authenticateNext(req);
  if (authErr1) return NextResponse.json({ error: authErr1 }, { status: status1 });

  const authErr2 = requireRolesNext(currentUser, MANAGER_ROLES);
  if (authErr2) return NextResponse.json({ error: authErr2.error }, { status: authErr2.status });

  const { data, error, status } = await parseBody(req, CreateUserRequestSchema);
  if (error) return NextResponse.json(error, { status });

  if (currentUser!.role === 'admin' || currentUser!.role === 'customer') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges to create administrators' }, { status: 403 });
  }

  const { email, password, name, role } = data!;
  
  if (role === 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Cannot create Root Super Admin' }, { status: 403 });
  }

  if (role === 'super_admin' && currentUser!.role !== 'root_super_admin') {
    return NextResponse.json({ error: 'Forbidden: Only Root Super Admin can create Super Admins' }, { status: 403 });
  }

  if (role === 'customer') {
    return NextResponse.json({ error: 'Bad Request: Use customer endpoints for customers' }, { status: 400 });
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }

  // 1. Create Firebase Auth user
  
  let fbUser;
  try {
    fbUser = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    // 2. Set Custom Claims
    await auth.setCustomUserClaims(fbUser.uid, { role });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Email already exists in Firebase Auth' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // 3. Create Firestore User Profile
  try {
    const newUser = await userRepository.create({
      id: fbUser.uid,
      email,
      name,
      role,
      active: true,
      createdAt: new Date().toISOString(), passwordHash: ''
    });
    return NextResponse.json(adminDto(newUser as any), { status: 201 });
  } catch (err: any) {
    // Rollback Firebase Auth user if Firestore fails
    await auth.deleteUser(fbUser.uid);
    return NextResponse.json({ error: 'Failed to create user profile. Rolled back auth.' }, { status: 500 });
  }
}
