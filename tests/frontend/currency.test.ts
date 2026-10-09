import { formatCompactNaira } from '../../src/utils/currency';

describe('formatCompactNaira', () => {
  it('formats correctly', () => {
    expect(formatCompactNaira(0)).toBe('₦0');
    expect(formatCompactNaira(1)).toBe('₦1');
    expect(formatCompactNaira(999)).toBe('₦999');
    expect(formatCompactNaira(9999)).toBe('₦9,999');
    expect(formatCompactNaira(10000)).toBe('₦10K');
    expect(formatCompactNaira(10500)).toBe('₦10.5K');
    expect(formatCompactNaira(15000)).toBe('₦15K');
    expect(formatCompactNaira(100000)).toBe('₦100K');
    expect(formatCompactNaira(999999)).toBe('₦1M');
    expect(formatCompactNaira(1000000)).toBe('₦1M');
    expect(formatCompactNaira(1500000)).toBe('₦1.5M');
  });
});
