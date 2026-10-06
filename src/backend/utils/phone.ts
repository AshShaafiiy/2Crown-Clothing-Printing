export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return '0' + cleaned.substring(3);
  }
  if (cleaned.startsWith('234') && cleaned.length === 12) {
    return '0' + cleaned.substring(2);
  }
  return cleaned;
}
