import { NextResponse } from 'next/server';
import { LoginRequestSchema } from '@/backend/schemas';
import { parseBody } from '@/backend/utils/next-utils';
import { userRepository } from '@/backend/repositories';

export async function POST(req: Request) {
  const { data, error, status } = await parseBody(req, LoginRequestSchema);
  if (error) return NextResponse.json(error, { status });

  const { email, password } = data!;
  
  // Swap email/password for Firebase idToken using the Identity Toolkit API
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!API_KEY) {
     return NextResponse.json({ error: 'Server misconfiguration: missing API KEY' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const result = await res.json();
    
    if (!res.ok) {
       return NextResponse.json({ error: 'Unauthorized: Invalid credentials' }, { status: 401 });
    }

    const token = result.idToken;

    // Fetch user profile from Firestore to return the user payload
    const user = await userRepository.findByEmail(email);
    if (!user || !user.active) {
       return NextResponse.json({ error: 'Unauthorized: User inactive or not found' }, { status: 401 });
    }

    // Update lastLogin on successful authentication of an active user
    const lastLogin = new Date().toISOString();
    await userRepository.update(user.id, { lastLogin });
    user.lastLogin = lastLogin;

    const response = NextResponse.json({ ...user, token });
    response.headers.set('Authorization', `Bearer ${token}`);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
