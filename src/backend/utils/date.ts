export function normalizeTimestamp(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  // Firestore Timestamp with toDate method
  if (value && typeof value === 'object' && typeof (value as any).toDate === 'function') {
    const d = (value as any).toDate();
    return d.getTime() === 0 ? '' : d.toISOString();
  }
  // Serialized Firestore Timestamp from another layer
  if (value && typeof value === 'object' && value._seconds !== undefined) {
    if (value._seconds === 0) return '';
    return new Date(value._seconds * 1000).toISOString();
  }
  if (value && typeof value === 'object' && value.seconds !== undefined) {
    if (value.seconds === 0) return '';
    return new Date(value.seconds * 1000).toISOString();
  }
  // Native JS Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) || value.getTime() === 0 ? '' : value.toISOString();
  }
  // String or Number (ISO or epoch)
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  // Prevent synthetic epoch bugs
  if (d.getTime() === 0) return '';
  return d.toISOString();
}
