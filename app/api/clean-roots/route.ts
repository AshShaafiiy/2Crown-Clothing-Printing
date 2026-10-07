import { NextResponse } from 'next/server';
import { db, auth } from '@/backend/db/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const usersSnap = await db.collection('users').where('role', '==', 'root_super_admin').get();
  const deleted = [];
  
  for (const doc of usersSnap.docs) {
    const user = doc.data();
    if (user.email !== 'annarsjay3@gmail.com') {
      await db.collection('users').doc(doc.id).delete();
      try {
        await auth.deleteUser(doc.id);
      } catch (e) {}
      deleted.push(user.email);
    }
  }

  // Also check Firebase Auth users directly
  let pageToken;
  do {
    const listResult = await auth.listUsers(1000, pageToken);
    for (const userRecord of listResult.users) {
      if (userRecord.customClaims?.role === 'root_super_admin' && userRecord.email !== 'annarsjay3@gmail.com') {
        if (!deleted.includes(userRecord.email)) {
          await auth.deleteUser(userRecord.uid);
          deleted.push(userRecord.email + ' (auth-only)');
        }
      }
    }
    pageToken = listResult.pageToken;
  } while (pageToken);

  return NextResponse.json({ success: true, deleted });
}
