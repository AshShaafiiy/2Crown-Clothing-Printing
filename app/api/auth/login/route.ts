import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, _passwordHashes } from '@/backend/store/db';
import { LoginRequestSchema } from '@/backend/schemas';
import { parseBody } from '@/backend/utils/next-utils';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  const { data, error, status } = await parseBody(req, LoginRequestSchema);
  if (error) return NextResponse.json(error, { status });

  const { email, password } = data!;
  
  const user = db.users.find((u: any) => u.email === email && u.active);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Invalid credentials' }, { status: 401 });
  }

  const hash = _passwordHashes[email];
  if (!hash) {
    return NextResponse.json({ error: 'Unauthorized: Invalid credentials' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) {
    return NextResponse.json({ error: 'Unauthorized: Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

  const response = NextResponse.json({ ...user, token });
  response.headers.set('Authorization', `Bearer ${token}`);
  return response;
}
