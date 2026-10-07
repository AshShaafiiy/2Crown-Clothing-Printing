import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (now > entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (entry.count >= limit) {
    return { success: false };
  }

  entry.count++;
  return { success: true };
}

// Clean up expired entries every hour (if memory persists)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(store.entries())) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000);
