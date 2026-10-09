import { NextResponse } from 'next/server';
import { authenticateNext, requireRolesNext } from '@/backend/utils/next-utils';
import { getImageKitClient } from '@/backend/utils/imagekit';

export async function GET(req: Request) {
  try {
    const { user, error: authError, status: authStatus } = await authenticateNext(req);
    if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

    const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
    if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

    const imagekit = getImageKitClient();
    const authParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json({
      ...authParameters,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    }, { status: 200 });
  } catch (err: any) {
    console.error('ImageKit Auth Error:', err);
    return NextResponse.json({ error: 'Failed to generate ImageKit auth parameters' }, { status: 500 });
  }
}
