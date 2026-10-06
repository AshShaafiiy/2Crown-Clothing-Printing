import { OrderItem, Product, ID } from '../domain/models';

export function toCartItem(
  product: Product, 
  quantity: number = 1, 
  variantId?: ID, 
  variantName?: string, 
  customization?: Record<string, any>,
  priceOverride?: number,
  previousPriceOverride?: number
): OrderItem {
  return {
    id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    price: priceOverride !== undefined ? priceOverride : product.price,
    previousPrice: previousPriceOverride !== undefined ? previousPriceOverride : product.previousPrice,
    quantity,
    imageUrl: product.imageUrl,
    variantId,
    variantName,
    customization
  };
}
