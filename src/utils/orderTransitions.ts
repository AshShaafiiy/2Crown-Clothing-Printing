import { OrderStatus, Order } from '../domain/models';

export const getValidNextStatuses = (currentStatus: OrderStatus, deliveryMethod: Order['deliveryMethod']): OrderStatus[] => {
  const transitions: Record<string, OrderStatus[]> = {
    'Awaiting Confirmation': ['Confirmed', 'Cancelled'],
    'Confirmed': ['Processing', 'Cancelled'],
    'Processing': deliveryMethod === 'pickup' ? ['Ready for Pickup', 'Cancelled'] : ['Ready for Delivery', 'Cancelled'],
    'Ready for Delivery': ['Out for Delivery', 'Cancelled'],
    'Out for Delivery': ['Delivered', 'Cancelled'],
    'Ready for Pickup': ['Picked Up', 'Cancelled']
  };
  return transitions[currentStatus] || [];
};

export const getCustomerFacingStatus = (status: OrderStatus): OrderStatus => {
  return status;
};

export const getStatusLabel = (status: OrderStatus, isCustomerView = false): string => {
  const effectiveStatus = isCustomerView ? getCustomerFacingStatus(status) : status;
  const labels: Record<OrderStatus, string> = {
    'Awaiting Confirmation': 'Awaiting Confirmation',
    'Confirmed': 'Order Confirmed',
    'Processing': 'Order Being Prepared', // Per instructions "Order Being Prepared"
    'Ready for Delivery': 'Ready for Delivery',
    'Out for Delivery': 'Out for Delivery',
    'Delivered': 'Delivered',
    'Ready for Pickup': 'Ready for Pickup',
    'Picked Up': 'Picked Up',
    'Cancelled': 'Cancelled'
  };
  return labels[effectiveStatus] || effectiveStatus;
};

export const getStatusDescription = (status: OrderStatus, isCustomerView = false): string => {
  const effectiveStatus = isCustomerView ? getCustomerFacingStatus(status) : status;
  const descriptions: Record<OrderStatus, string> = {
    'Awaiting Confirmation': 'We are waiting for your confirmation.',
    'Confirmed': 'Your order has been confirmed and will be processed soon.',
    'Processing': 'Your order is currently being prepared.',
    'Ready for Delivery': 'Your order is ready and will be dispatched for delivery.',
    'Out for Delivery': 'Your order is out for delivery.',
    'Delivered': 'Your order has been delivered.',
    'Ready for Pickup': 'Your order is ready to be picked up at our store.',
    'Picked Up': 'Your order has been picked up.',
    'Cancelled': 'Your order has been cancelled.'
  };
  return descriptions[effectiveStatus] || '';
};
