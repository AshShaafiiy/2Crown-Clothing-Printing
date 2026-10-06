import { NextResponse } from 'next/server';
import { auth } from '../db/firebase';
import { userRepository } from '../repositories';
import { User, Role } from '../schemas';
import { ZodSchema } from 'zod';

export async function authenticateNext(req: Request): Promise<{ user?: User; error?: string; status?: number }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized: Missing or invalid token', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await auth.verifyIdToken(token);
    const user = await userRepository.findByEmail(decoded.email || '');
    if (!user || !user.active) {
      return { error: 'Unauthorized: User not found or inactive', status: 401 };
    }
    return { user };
  } catch (err) {
    return { error: 'Unauthorized: Invalid token', status: 401 };
  }
}

export function requireRolesNext(user: User | undefined, roles: Role[]): { error?: string; status?: number } | null {
  if (!user || !roles.includes(user.role)) {
    return { error: 'Forbidden: Insufficient privileges', status: 403 };
  }
  return null;
}

export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<{ data?: T; error?: any; status?: number }> {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return { error: { error: 'Validation Error', details: parsed.error.issues }, status: 400 };
    }
    return { data: parsed.data };
  } catch (e) {
    return { error: { error: 'Invalid JSON' }, status: 400 };
  }
}

export async function authenticateCustomerNext(req: Request): Promise<{ uid?: string; name?: string; email?: string; phone?: string; error?: string; status?: number }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized: Missing or invalid token', status: 401 };
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await auth.verifyIdToken(token);
    return { uid: decoded.uid, name: decoded.name || decoded.email || 'Customer', email: decoded.email, phone: decoded.phone_number };
  } catch (err) {
    return { error: 'Unauthorized: Invalid token', status: 401 };
  }
}
