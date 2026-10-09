export function formatCompactNaira(amount: number): string {
  if (amount < 10000) {
    return `₦${amount.toLocaleString()}`;
  }
  
  if (amount >= 999950) { // Will round up to 1M
    const value = amount / 1000000;
    return `₦${Number(value.toFixed(1))}M`;
  }
  
  if (amount >= 1000) {
    const value = amount / 1000;
    return `₦${Number(value.toFixed(1))}K`;
  }
  
  return `₦${amount.toLocaleString()}`;
}
