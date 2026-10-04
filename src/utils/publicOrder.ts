import { Order, PublicOrder } from '../domain/models';

// Only the current browser's freshly submitted order; never hydrated from public API.
let submittedOrder: Order | null = null;
export const rememberSubmittedOrder = (order: Order) => { submittedOrder = order; };
export const getSubmittedOrder = (reference: string): Order | null => submittedOrder?.reference === reference.trim().toUpperCase() ? submittedOrder : null;
export const toPublicOrder = (order: Order): PublicOrder => ({
  reference: order.reference, status: order.status, deliveryMethod: order.deliveryMethod,
  subtotal: order.subtotal, discount: order.discount, total: order.total, deliveryFee: order.deliveryFee,
  createdAt: order.createdAt, updatedAt: order.updatedAt,
  items: order.items.map(({ productName, quantity, price, variantName }) => ({ productName, quantity, price, variantName })),
  history: (order.history || []).map(({ newStatus, timestamp }) => ({ newStatus, timestamp }))
});
