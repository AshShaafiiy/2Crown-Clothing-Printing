import { describe, it, expect, beforeEach } from 'vitest';
import { MockOrderService } from './index';
import { Order, OrderStatus } from '../../domain/models';

describe('MockOrderService', () => {
  let service: MockOrderService;
  
  beforeEach(() => {
    service = new MockOrderService();
  });

  it('should create a new order', async () => {
    const newOrderData: Omit<Order, 'id' | 'reference' | 'createdAt' | 'updatedAt'> = {
      customerName: 'John Doe',
      customerPhone: '1234567890',
      items: [],
      subtotal: 1000,
      discount: 0,
      total: 1000,
      status: 'Awaiting Confirmation',
      deliveryMethod: 'pickup',
    };

    const createdOrder = await service.createOrder(newOrderData);
    
    expect(createdOrder.id).toBeDefined();
    expect(createdOrder.reference).toMatch(/^2C-[A-F0-9]{8}(?:-[A-F0-9]{8}){3}$/);
    expect(createdOrder.createdAt).toBeDefined();
    expect(createdOrder.updatedAt).toBeDefined();
    expect(createdOrder.customerName).toBe(newOrderData.customerName);
  });

  it('should get all orders', async () => {
    const orders = await service.getOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  it('should get an order by ID', async () => {
    const order = await service.createOrder({
      customerName: 'Jane Doe',
      customerPhone: '0987654321',
      items: [],
      subtotal: 500,
      discount: 0,
      total: 500,
      status: 'Awaiting Confirmation',
      deliveryMethod: 'local',
    });

    const fetchedOrder = await service.getOrderById(order.id);
    expect(fetchedOrder).not.toBeNull();
    expect(fetchedOrder?.id).toBe(order.id);
  });

  it('should get an order by reference', async () => {
    const order = await service.createOrder({
      customerName: 'Ref User',
      customerPhone: '111111111',
      items: [],
      subtotal: 200,
      discount: 0,
      total: 200,
      status: 'Awaiting Confirmation',
      deliveryMethod: 'local',
    });

    const fetchedOrder = await service.getOrderByReference(order.reference);
    expect(fetchedOrder).not.toBeNull();
    expect(fetchedOrder?.reference).toBe(order.reference);
  });

  it('should return null for non-existent order ID or reference', async () => {
    const byId = await service.getOrderById('invalid-id');
    expect(byId).toBeNull();
    
    const byRef = await service.getOrderByReference('invalid-ref');
    expect(byRef).toBeNull();
  });

  it('should update order status and append to history', async () => {
    const order = await service.createOrder({
      customerName: 'Status User',
      customerPhone: '222222222',
      items: [],
      subtotal: 300,
      discount: 0,
      total: 300,
      status: 'Awaiting Confirmation',
      deliveryMethod: 'local',
    });

    const updatedOrder = await service.updateOrderStatus(order.id, 'Confirmed');
    expect(updatedOrder.status).toBe('Confirmed');
    expect(updatedOrder.history).toBeDefined();
    expect(updatedOrder.history!.length).toBe(2);
    expect(updatedOrder.history![1].newStatus).toBe('Confirmed');
    expect(updatedOrder.history![1].previousStatus).toBe('Awaiting Confirmation');
    expect(updatedOrder.history![1].actorName).toBe('Admin (Mock)');
    
    const fetchedOrder = await service.getOrderById(order.id);
    expect(fetchedOrder?.status).toBe('Confirmed');
  });

  it('should throw error when updating status of non-existent order', async () => {
    await expect(service.updateOrderStatus('invalid-id', 'Confirmed')).rejects.toThrow('Order not found');
  });

  it('should allow updating delivery fee for local delivery', async () => {
    const order = await service.createOrder({
      customerName: 'Delivery Fee User',
      customerPhone: '09012345678',
      items: [],
      subtotal: 10000,
      discount: 0,
      total: 10000,
      status: 'Confirmed',
      deliveryMethod: 'local',
    });
    expect(order.deliveryFee).toBeNull();

    const updated = await service.updateOrderDeliveryFee(order.id, 2000);
    expect(updated.deliveryFee).toBe(2000);
    expect(updated.total).toBe(12000);
    expect(updated.history?.some(h => h.note?.includes('2,000'))).toBe(true);
  });

  it('should throw error when setting delivery fee for store pickup', async () => {
    const order = await service.createOrder({
      customerName: 'Pickup User',
      customerPhone: '09012345678',
      items: [],
      subtotal: 10000,
      discount: 0,
      total: 10000,
      status: 'Confirmed',
      deliveryMethod: 'pickup',
    });

    await expect(service.updateOrderDeliveryFee(order.id, 2000)).rejects.toThrow('Cannot set delivery fee for store pickup');
  });
});
