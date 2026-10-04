import fs from 'fs';
import os from 'os';
import path from 'path';

// Arbitrary externally supplied paths are deliberately never authorized for seeding.
export function resolveTestDatabasePath(env: NodeJS.ProcessEnv): string {
  if (env.TEST_DATABASE_URL && env.TEST_DATABASE_URL !== ':memory:') {
    throw new Error('TEST_DATABASE_URL file overrides are unsafe. Allocate disposable storage with allocateTestDatabase().');
  }
  return ':memory:';
}
export function allocateTestDatabase() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), '2crown-test-'));
  return { filename: path.join(directory, 'database.sqlite3'), cleanup: () => fs.rmSync(directory, { recursive: true, force: true }) };
}
