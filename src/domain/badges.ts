import { Product, Promotion, Order } from './models';

export interface ProductBadge {
  label: string;
  type: 'discount' | 'status' | 'featured';
  priority: number;
}

export function computeProductBadges(
  product: Product, 
  activePromotions: Promotion[] = [], 
  orders: Order[] = []
): ProductBadge[] {
  const badges: ProductBadge[] = [];

  // 1. FEATURED (Admin controlled, but we compute it as a badge for consistency)
  if (product.featured) {
    badges.push({ label: 'FEATURED', type: 'featured', priority: 10 });
  }

  // 2. FLASH SALE / SALE / % OFF (Discount badges)
  // Check active promotions first
  const activePromo = activePromotions.find(p => 
    p.active && 
    new Date(p.startDate) <= new Date() && 
    new Date(p.endDate) >= new Date() &&
    (p.applicableProductIds?.includes(product.id) || p.applicableCategoryIds?.includes(product.categoryId))
  );

  let hasDiscount = false;
  if (activePromo) {
    if (activePromo.type === 'flash_sale') {
      badges.push({ label: 'FLASH SALE', type: 'discount', priority: 100 });
      hasDiscount = true;
    }
  }

  // Automatic % OFF calculation
  if (product.previousPrice && product.previousPrice > product.price) {
    const percentOff = Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100);
    badges.push({ label: `${percentOff}% OFF`, type: 'discount', priority: 90 });
    hasDiscount = true;
    
    // If there's a discount but no flash sale, we can add a generic SALE badge
    if (!activePromo || activePromo.type !== 'flash_sale') {
      badges.push({ label: 'SALE', type: 'discount', priority: 80 });
    }
  }

  // 3. STOCK STATUS (Removed per requirements)

  // 4. NEW
  if (product.createdAt) {
    const daysSinceCreation = (new Date().getTime() - new Date(product.createdAt).getTime()) / (1000 * 3600 * 24);
    if (daysSinceCreation <= 14) { // 14 days threshold for "NEW"
      badges.push({ label: 'NEW', type: 'status', priority: 70 });
    }
  }

  // 5. BEST SELLER
  if (orders && orders.length > 0) {
    // Count how many times this product appears in confirmed/completed orders
    const salesCount = orders.reduce((count, order) => {
      if (['Processing', 'Ready', 'Completed'].includes(order.status)) {
        const item = order.items.find(i => i.productId === product.id);
        if (item) return count + item.quantity;
      }
      return count;
    }, 0);
    
    if (salesCount >= 5) { // Threshold for Best Seller
      badges.push({ label: 'BEST SELLER', type: 'status', priority: 85 });
    }
  }

  // Sort by priority (highest first)
  return badges.sort((a, b) => b.priority - a.priority);
}
