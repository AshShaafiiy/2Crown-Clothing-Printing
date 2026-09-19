import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';
import { OrderItem } from '../domain/models';

describe('cartStore', () => {
  const initialStoreState = useCartStore.getState();

  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState(initialStoreState, true);
    useCartStore.getState().clearCart();
  });

  it('should add an item to the cart', () => {
    const item: OrderItem = {
      id: 'temp-id',
      productId: 'prod-1',
      productName: 'T-Shirt',
      quantity: 1,
      price: 1000,
    };

    useCartStore.getState().addItem(item);
    
    const { items } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].productId).toBe('prod-1');
    expect(items[0].quantity).toBe(1);
    // The store generates a new ID, so we verify it's a cart-item id
    expect(items[0].id).toMatch(/^cart-item-\d+$/);
  });

  it('should increase quantity if the exact same item is added', () => {
    const item: OrderItem = {
      id: 'temp-id',
      productId: 'prod-2',
      productName: 'Mug',
      quantity: 2,
      price: 500,
      customization: { text: 'Hello' }
    };

    // Add first time
    useCartStore.getState().addItem(item);
    // Add second time
    useCartStore.getState().addItem(item);

    const { items } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(4);
  });

  it('should add as separate item if customization differs', () => {
    const item1: OrderItem = {
      id: 'temp-1',
      productId: 'prod-2',
      productName: 'Mug',
      quantity: 1,
      price: 500,
      customization: { text: 'Hello' }
    };

    const item2: OrderItem = {
      id: 'temp-2',
      productId: 'prod-2',
      productName: 'Mug',
      quantity: 1,
      price: 500,
      customization: { text: 'World' }
    };

    useCartStore.getState().addItem(item1);
    useCartStore.getState().addItem(item2);

    const { items } = useCartStore.getState();
    expect(items.length).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const item: OrderItem = {
      id: 'temp-1',
      productId: 'prod-1',
      productName: 'T-Shirt',
      quantity: 1,
      price: 1000,
    };

    useCartStore.getState().addItem(item);
    let { items } = useCartStore.getState();
    const cartItemId = items[0].id;

    useCartStore.getState().removeItem(cartItemId);
    
    items = useCartStore.getState().items;
    expect(items.length).toBe(0);
  });

  it('should update item quantity', () => {
    const item: OrderItem = {
      id: 'temp-1',
      productId: 'prod-1',
      productName: 'T-Shirt',
      quantity: 1,
      price: 1000,
    };

    useCartStore.getState().addItem(item);
    let { items } = useCartStore.getState();
    const cartItemId = items[0].id;

    useCartStore.getState().updateQuantity(cartItemId, 5);
    
    items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(5);
  });

  it('should calculate the correct subtotal', () => {
    useCartStore.getState().addItem({
      id: 'temp-1',
      productId: 'p1',
      productName: 'Item 1',
      quantity: 2,
      price: 100, // 2 * 100 = 200
    });

    useCartStore.getState().addItem({
      id: 'temp-2',
      productId: 'p2',
      productName: 'Item 2',
      quantity: 3,
      price: 50, // 3 * 50 = 150
    });

    const subtotal = useCartStore.getState().getSubtotal();
    expect(subtotal).toBe(350);
  });

  it('should clear the cart', () => {
    useCartStore.getState().addItem({
      id: 'temp-1',
      productId: 'p1',
      productName: 'Item 1',
      quantity: 1,
      price: 100,
    });

    expect(useCartStore.getState().items.length).toBe(1);

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
