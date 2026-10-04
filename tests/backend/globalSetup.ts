// import removed
import fs from 'fs';

export default async function setup() {
  console.log('Running globalSetup...');
  if (fs.existsSync('test.sqlite3')) fs.unlinkSync('test.sqlite3');
  console.log('Migrating...');
  await db.migrate.latest();
  console.log('Migration complete. Destroying db connection.');
  await db.destroy();
}
