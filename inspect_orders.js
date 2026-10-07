const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'twocrown-clothing-printing',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
  })
});

const db = getFirestore();

async function run() {
  const snap = await db.collection('orders').get();
  console.log(`Total orders: ${snap.docs.length}`);
  snap.docs.forEach(doc => {
    const data = doc.data();
    if (!data.total || !data.subtotal || !data.createdAt || !data.history || !Array.isArray(data.history)) {
      console.log(`MALFORMED ORDER: ${doc.id}`);
      console.log(JSON.stringify(data, null, 2).substring(0, 500));
    }
  });
}
run();
