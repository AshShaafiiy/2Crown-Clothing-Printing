import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Use emulator if configured
if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST.replace('8080', '9099');
}

if (!getApps().length) {
  initializeApp({
    projectId: 'demo-2crown-clothing' // Demo project for emulators
  });
}

export const db = getFirestore();
export const auth = getAuth();
