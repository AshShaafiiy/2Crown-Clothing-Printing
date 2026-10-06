export function normalizeOrderHistoryDate(timestamp: any): string | null {
  if (!timestamp) return null;

  // 1. ISO String or standard date string
  if (typeof timestamp === 'string') {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d.toISOString();
    return null;
  }

  // 2. Numeric timestamp (milliseconds)
  if (typeof timestamp === 'number') {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d.toISOString();
    return null;
  }

  // 3. Date object
  if (timestamp instanceof Date) {
    if (!isNaN(timestamp.getTime())) return timestamp.toISOString();
    return null;
  }

  // 4. Firestore Timestamp object
  if (typeof timestamp === 'object') {
    // If it has toDate() method (actual Firestore Timestamp class in client SDK)
    if (typeof timestamp.toDate === 'function') {
      try {
        return timestamp.toDate().toISOString();
      } catch (e) {
        return null;
      }
    }
    
    // If it's a serialized Firestore Timestamp { _seconds, _nanoseconds } or { seconds, nanoseconds }
    const seconds = timestamp._seconds !== undefined ? timestamp._seconds : timestamp.seconds;
    if (typeof seconds === 'number') {
      return new Date(seconds * 1000).toISOString();
    }
  }

  return null;
}
