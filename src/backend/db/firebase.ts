import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Use emulator if configured
if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST.replace('8080', '9099');
}

if (!getApps().length) {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
  } else {
    initializeApp({
      projectId: 'demo-2crown-clothing' // Fallback for local emulator
    });
  }
}

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
export const auth = getAuth();
