import { NextResponse } from 'next/server';
import { authenticateNext, requireRolesNext } from '@/backend/utils/next-utils';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy',
});

export async function GET(req: Request) {
  try {
    const { user, error: authError, status: authStatus } = await authenticateNext(req);
    if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

    const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
    if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

    const authParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json(authParameters, { status: 200 });
  } catch (err: any) {
    console.error('ImageKit Auth Error:', err);
    return NextResponse.json({ error: 'Failed to generate ImageKit auth parameters' }, { status: 500 });
  }
}
