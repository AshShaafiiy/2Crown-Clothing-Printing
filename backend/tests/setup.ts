import { beforeEach } from 'vitest';
import { db } from '../src/store/db';

beforeEach(() => {
  db.reset();
});
