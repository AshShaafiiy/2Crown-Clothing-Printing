import { db } from './src/backend/db/firebase';
db.settings({ ignoreUndefinedProperties: true });
async function test() {
  try {
    await db.collection('test').doc('test').set({ name: "test", desc: undefined });
    console.log("Success with ignoreUndefinedProperties");
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}
test();
