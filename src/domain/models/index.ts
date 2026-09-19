export type ID = string;

export type Role = 'root_super_admin' | 'super_admin' | 'admin' | 'customer';

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: ID;
  active: boolean;
  order: number;
}

export type ProductType = 'standard' | 'variant' | 'customizable' | 'quote';

export interface ProductVariant {
  id: ID;
  name: string; 
  attributes: Record<string, string>; 
  price: number;
  stock: number;
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
  type: ProductType;
  price: number; // in NGN ₦
  previousPrice?: number;
  images: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  variants?: ProductVariant[];
  customizationFields?: CustomizationField[];
  specifications?: Record<string, string>;
  turnaroundTime?: string;
  tags?: string[];
  promotionalBadge?: string;
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
}

export type OrderStatus = 'WhatsApp Pending' | 'WhatsApp Opened' | 'Customer Contacted' | 'Quotation Sent' | 'Awaiting Confirmation' | 'Confirmed' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: ID;
  productId: ID;
  productName: string;
  quantity: number;
  price: number;
  variantId?: ID;
  variantName?: string;
  customization?: Record<string, any>;
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
  deliveryFee?: number;
  createdAt: string;
  updatedAt: string;
}


export interface GalleryItem {
  id: ID;
  title: string;
  description?: string;
  imageUrl: string;
  categoryId: ID;
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
