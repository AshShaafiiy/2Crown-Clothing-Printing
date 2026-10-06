import { Product, Promotion, Order } from './models';

export interface ProductBadge {
  label: string;
  type: 'discount' | 'status' | 'featured';
  priority: number;
}

const NEW_PRODUCT_WINDOW_HOURS = 24;

export function computeProductBadges(
  product: Product, 
  activePromotions: Promotion[] = [], 
  orders: Order[] = []
): ProductBadge[] {
  const badges: ProductBadge[] = [];

  // 1. % OFF
  if (product.previousPrice && product.previousPrice > product.price && product.previousPrice > 0) {
    const percentOff = Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100);
    if (!isNaN(percentOff) && percentOff > 0) {
      badges.push({ label: `${percentOff}% OFF`, type: 'discount', priority: 100 });
    }
  }

  // 2. NEW
  if (product.createdAt) {
    const hoursSinceCreation = (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 3600);
    if (hoursSinceCreation <= NEW_PRODUCT_WINDOW_HOURS) {
      badges.push({ label: 'NEW', type: 'status', priority: 90 });
    }
  }

  // 3. FEATURED
  if (product.featured) {
    badges.push({ label: 'FEATURED', type: 'featured', priority: 80 });
  }

  // 4. BEST SELLER (Retained for future compatibility)
  if (orders && orders.length > 0) {
    const salesCount = orders.reduce((count, order) => {
      if (['Processing', 'Ready', 'Completed'].includes(order.status)) {
        const item = order.items.find(i => i.productId === product.id);
        if (item) return count + item.quantity;
      }
      return count;
    }, 0);
    
    if (salesCount >= 5) {
      badges.push({ label: 'BEST SELLER', type: 'status', priority: 85 });
    }
  }

  // Sort by priority (highest first)
  return badges.sort((a, b) => b.priority - a.priority);
}
