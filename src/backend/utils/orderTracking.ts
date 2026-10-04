import { randomBytes } from 'node:crypto';
import { Order, OrderStatusSchema } from '../schemas';

// 16 random bytes (128 bits); uppercase hex groups are easy to copy and read.
export const generateOrderReference = () => `2C-${randomBytes(16).toString('hex').toUpperCase().match(/.{8}/g)!.join('-')}`;
export const REFERENCE_PATTERN = /^2C-[A-F0-9]{8}(?:-[A-F0-9]{8}){3}$/;
export const canonicalReference = (value: string) => value.trim().toUpperCase();
// Legacy communication/audit states are internal; customers see fulfillment only.
const publicStatus = (status: string) => OrderStatusSchema.safeParse(status).success ? status : 'Awaiting Confirmation';
const publicTimeline = (order: Order) => {
  const seen = new Set<string>();
  return (order.history || []).filter(entry => {
    if (!OrderStatusSchema.safeParse(entry.newStatus).success || entry.previousStatus === entry.newStatus || seen.has(entry.newStatus)) return false;
    seen.add(entry.newStatus);
    return true;
  }).map(entry => ({ newStatus: entry.newStatus, timestamp: entry.timestamp }));
};
export const publicOrderDto = (order: Order) => ({
  reference: order.reference, status: publicStatus(order.status), deliveryMethod: order.deliveryMethod,
  subtotal: order.subtotal, discount: order.discount, total: order.total,
  deliveryFee: order.deliveryFee, createdAt: order.createdAt, updatedAt: order.updatedAt,
  items: order.items.map(item => ({ productName: item.productName, quantity: item.quantity, price: item.price, variantName: item.variantName })),
  history: publicTimeline(order)
});
export const isReferenceCollision = (error: unknown): boolean => {
  const e = error as { code?: string; message?: string; constraint?: string };
  return !!((e?.code === 'SQLITE_CONSTRAINT' && /UNIQUE constraint failed: orders\.reference\s*$/.test(e.message || '')) || (e?.code === '23505' && (e.constraint === 'orders_reference_unique' || (e.message && e.message.includes('orders_reference_unique')))));
};
export async function createWithReferenceRetry<T>(create: (reference: string) => Promise<T>, generate = generateOrderReference): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await create(generate()); }
    catch (error) { if (!isReferenceCollision(error)) throw error; }
  }
  throw new Error('Unable to allocate order reference');
}
