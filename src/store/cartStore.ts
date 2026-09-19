import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem, ID } from '../domain/models';

interface CartState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: ID) => void;
  updateQuantity: (id: ID, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => 
          i.productId === item.productId && 
          i.variantId === item.variantId &&
          JSON.stringify(i.customization) === JSON.stringify(item.customization)
        );
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { items: [...state.items, { ...item, id: `cart-item-${Date.now()}` }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }),
    {
      name: '2crown-cart-storage'
    }
  )
);
