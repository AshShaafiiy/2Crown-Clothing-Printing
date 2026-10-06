import { describe, it, expect } from 'vitest';
import { normalizeOrderHistoryDate } from './orderHistory';

describe('orderHistory utilities', () => {
  it('normalizes ISO string', () => {
    const iso = '2026-10-06T12:00:00.000Z';
    expect(normalizeOrderHistoryDate(iso)).toBe(iso);
  });

  it('normalizes Date object', () => {
    const d = new Date('2026-10-06T12:00:00.000Z');
    expect(normalizeOrderHistoryDate(d)).toBe('2026-10-06T12:00:00.000Z');
  });

  it('normalizes numeric milliseconds', () => {
    const time = new Date('2026-10-06T12:00:00.000Z').getTime();
    expect(normalizeOrderHistoryDate(time)).toBe('2026-10-06T12:00:00.000Z');
  });

  it('normalizes Firestore Timestamp emulator format', () => {
    const ts = { toDate: () => new Date('2026-10-06T12:00:00.000Z') };
    expect(normalizeOrderHistoryDate(ts)).toBe('2026-10-06T12:00:00.000Z');
  });

  it('normalizes serialized Firestore Timestamp (_seconds)', () => {
    const seconds = new Date('2026-10-06T12:00:00.000Z').getTime() / 1000;
    expect(normalizeOrderHistoryDate({ _seconds: seconds, _nanoseconds: 0 })).toBe('2026-10-06T12:00:00.000Z');
  });

  it('normalizes serialized Firestore Timestamp (seconds)', () => {
    const seconds = new Date('2026-10-06T12:00:00.000Z').getTime() / 1000;
    expect(normalizeOrderHistoryDate({ seconds: seconds, nanoseconds: 0 })).toBe('2026-10-06T12:00:00.000Z');
  });

  it('returns null for invalid values', () => {
    expect(normalizeOrderHistoryDate(null)).toBeNull();
    expect(normalizeOrderHistoryDate(undefined)).toBeNull();
    expect(normalizeOrderHistoryDate('invalid-date')).toBeNull();
    expect(normalizeOrderHistoryDate({})).toBeNull();
  });
});
