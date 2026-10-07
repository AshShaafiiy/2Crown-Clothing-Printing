import { describe, it, expect } from 'vitest';
import { normalizeTimestamp } from './date';

describe('normalizeTimestamp', () => {
  it('formats valid ISO string correctly', () => {
    const iso = '2026-10-07T12:00:00.000Z';
    expect(normalizeTimestamp(iso)).toBe(iso);
  });

  it('formats valid Date correctly', () => {
    const d = new Date('2026-10-07T12:00:00.000Z');
    expect(normalizeTimestamp(d)).toBe('2026-10-07T12:00:00.000Z');
  });

  it('handles mock Firestore Timestamp with toDate', () => {
    const mockTimestamp = {
      toDate: () => new Date('2026-10-07T12:00:00.000Z')
    };
    expect(normalizeTimestamp(mockTimestamp)).toBe('2026-10-07T12:00:00.000Z');
  });

  it('handles serialized Firestore Timestamp (_seconds)', () => {
    const serialized = { _seconds: 1791326400, _nanoseconds: 0 };
    expect(normalizeTimestamp(serialized)).toBe(new Date(1791326400000).toISOString());
  });

  it('handles serialized Firestore Timestamp (seconds)', () => {
    const serialized = { seconds: 1791326400, nanoseconds: 0 };
    expect(normalizeTimestamp(serialized)).toBe(new Date(1791326400000).toISOString());
  });

  it('returns empty string for missing createdAt', () => {
    expect(normalizeTimestamp(undefined)).toBe('');
    expect(normalizeTimestamp(null)).toBe('');
  });

  it('returns empty string for invalid createdAt', () => {
    expect(normalizeTimestamp('Invalid Date')).toBe('');
    expect(normalizeTimestamp('not-a-date')).toBe('');
  });

  it('prevents synthetic epoch bugs', () => {
    expect(normalizeTimestamp(0)).toBe('');
    expect(normalizeTimestamp(new Date(0))).toBe('');
  });
});
