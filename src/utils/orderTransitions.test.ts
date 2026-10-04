import { describe, it, expect } from 'vitest';
import { getValidNextStatuses, getStatusLabel } from './orderTransitions';
import { OrderStatus } from '../domain/models';

describe('orderTransitions', () => {
  it('should allow valid transitions for STORE PICKUP', () => {
    const validNext = getValidNextStatuses('Processing', 'pickup');
    expect(validNext).toContain('Ready for Pickup');
    expect(validNext).not.toContain('Ready for Delivery');
  });

  it('should allow valid transitions for LOCAL DELIVERY', () => {
    const validNext = getValidNextStatuses('Processing', 'local');
    expect(validNext).toContain('Ready for Delivery');
    expect(validNext).not.toContain('Ready for Pickup');
  });

  it('should not allow Store Pickup to progress to Out for Delivery or Delivered', () => {
    const fromReadyForPickup = getValidNextStatuses('Ready for Pickup', 'pickup');
    expect(fromReadyForPickup).toContain('Picked Up');
    expect(fromReadyForPickup).not.toContain('Out for Delivery');
    expect(fromReadyForPickup).not.toContain('Delivered');
  });

  it('should map statuses to customer labels', () => {
    expect(getStatusLabel('Awaiting Confirmation')).toBe('Awaiting Confirmation');
    expect(getStatusLabel('Confirmed')).toBe('Order Confirmed');
  });
});
