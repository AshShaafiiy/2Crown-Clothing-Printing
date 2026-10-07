const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

const app = initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const usersSnap = await db.collection('users').where('role', '==', 'root_super_admin').get();
  usersSnap.forEach(doc => {
    const user = doc.data();
    console.log("Firestore User:", user.email, user.role);
  });
  
  // Also check Auth users with custom claim
  const listUsersResult = await auth.listUsers(1000);
  listUsersResult.users.forEach((userRecord) => {
    if (userRecord.customClaims && userRecord.customClaims.role === 'root_super_admin') {
      console.log("Auth User Claim:", userRecord.email, userRecord.customClaims.role);
    }
  });
}
run().catch(console.error);
