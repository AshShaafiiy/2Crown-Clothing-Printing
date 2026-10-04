export type ID = string;

export type Role = 'root_super_admin' | 'super_admin' | 'admin' | 'customer';

export interface Category {
  createdAt?: string;
  id: ID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: ID;
  active: boolean;
  order: number;
}

export interface ProductVariant {
  id: ID;
  name: string; 
  attributes: Record<string, string>; 
  price: number;
  sku?: string;
}

export type CustomizationFieldType = 'text' | 'longtext' | 'number' | 'dropdown' | 'radio' | 'checkbox' | 'color' | 'size' | 'file';

export interface CustomizationField {
  id: ID;
  name: string;
  label: string;
  type: CustomizationFieldType;
  required: boolean;
  options?: string[]; 
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  description: string;
  categoryId: ID;
  price: number; // in NGN ₦
  previousPrice?: number;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  variants?: ProductVariant[];
  customizationFields?: CustomizationField[];
  specifications?: Record<string, string>;
  turnaroundTime?: string;
  tags?: string[];
  createdAt?: string;
}

export interface Promotion {
  id: ID;
  title: string;
  description?: string;
  type: 'flash_sale' | 'percentage' | 'fixed';
  value: number; 
  startDate: string;
  endDate: string;
  active: boolean;
  applicableProductIds?: ID[];
  applicableCategoryIds?: ID[];
}

export interface User {
  id: ID;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  createdAt?: string;
  active?: boolean;
  lastLogin?: string;
}

export type OrderStatus = 'Awaiting Confirmation' | 'Confirmed' | 'Processing' | 'Ready for Delivery' | 'Out for Delivery' | 'Delivered' | 'Ready for Pickup' | 'Picked Up' | 'Cancelled';

export interface OrderItem {
  id: ID;
  productId: ID;
  productSlug?: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  variantId?: ID;
  variantName?: string;
  customization?: Record<string, any>;
}

export interface OrderHistoryEntry {
  id: ID;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  timestamp: string;
  actorId?: ID;
  actorName: string;
  note?: string;
}

export interface Order {
  id: ID;
  reference: string;
  customerId?: ID;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryMethod: 'pickup' | 'local' | 'nationwide';
  deliveryAddress?: string;
  deliveryFee?: number | null;
  createdAt: string;
  updatedAt: string;
  history?: OrderHistoryEntry[];
}


export interface Review {
  id: ID;
  productId: ID;
  customerId: ID;
  customerName: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  approved: boolean;
}

export interface Testimonial {
  id: ID;
  customerName: string;
  company?: string;
  content: string;
  imageUrl?: string;
  rating: number;
  featured: boolean;
  createdAt: string;
}

export interface DeliverySettings {
  pickupEnabled: boolean;
  pickupAddress: string;
  localDeliveryEnabled: boolean;
  localDeliveryFee: number;
  nationwideDeliveryEnabled: boolean;
  nationwideDeliveryBaseFee: number;
  freeDeliveryThreshold?: number; // e.g. Free delivery over ₦200,000
}

export interface BusinessSettings {
  id: ID;
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  currency: string; // "NGN"
  currencySymbol: string; // "₦"
  vatPercentage: number; // 7.5
  deliverySettings: DeliverySettings;
}

/** Public tracking deliberately omits customer details and internal identifiers. */
export interface PublicOrder {
  reference: string;
  status: OrderStatus;
  deliveryMethod: Order['deliveryMethod'];
  subtotal: number;
  discount: number;
  total: number;
  deliveryFee?: number | null;
  createdAt: string;
  updatedAt: string;
  items: Pick<OrderItem, 'productName' | 'quantity' | 'price' | 'variantName'>[];
  history: { newStatus: OrderStatus; timestamp: string }[];
}
