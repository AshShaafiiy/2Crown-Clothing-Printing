import { NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';
import { authenticateNext, requireRolesNext } from '@/backend/utils/next-utils';
import '@/backend/db/firebase'; // ensure firebase is initialized

export async function POST(req: Request) {
  try {
    const { user, error: authError, status: authStatus } = await authenticateNext(req);
    if (authError) return NextResponse.json({ error: authError }, { status: authStatus });

    const roleError = requireRolesNext(user, ['root_super_admin', 'super_admin', 'admin']);
    if (roleError) return NextResponse.json({ error: roleError.error }, { status: roleError.status });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    let ext = 'png';
    if (file.name && file.name.includes('.')) {
      ext = file.name.split('.').pop() || 'png';
    } else if (file.type) {
      ext = file.type.split('/')[1] || 'png';
    }

    const filename = `uploads/${uuid()}.${ext}`;

    const bucket = getStorage().bucket();
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type || 'application/octet-stream' }
    });
    
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
