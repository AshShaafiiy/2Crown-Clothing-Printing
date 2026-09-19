import { z } from 'zod';

export const RoleSchema = z.enum(['root_super_admin', 'super_admin', 'admin', 'customer']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  phone: z.string().optional(),
  address: z.string().optional(),
  createdAt: z.string().optional(),
  active: z.boolean().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  attributes: z.record(z.string()),
  price: z.number(),
  stock: z.number(),
  sku: z.string().optional()
});

export const CustomizationFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'longtext', 'number', 'dropdown', 'radio', 'checkbox', 'color', 'size', 'file']),
  required: z.boolean(),
  options: z.array(z.string()).optional()
});

export const ProductInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  categoryId: z.string(),
  type: z.enum(['standard', 'variant', 'customizable', 'quote']),
  price: z.number(),
  previousPrice: z.number().optional(),
  images: z.array(z.string()),
  stock: z.number(),
  featured: z.boolean(),
  active: z.boolean(),
  variants: z.array(ProductVariantSchema).optional(),
  customizationFields: z.array(CustomizationFieldSchema).optional(),
  specifications: z.record(z.string()).optional(),
  turnaroundTime: z.string().optional(),
  tags: z.array(z.string()).optional(),
  promotionalBadge: z.string().optional()
});

export const ProductSchema = ProductInputSchema.extend({
  id: z.string()
});
export type Product = z.infer<typeof ProductSchema>;

export const CategoryInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  active: z.boolean(),
  order: z.number()
});

export const CategorySchema = CategoryInputSchema.extend({
  id: z.string()
});
export type Category = z.infer<typeof CategorySchema>;

export const PromotionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['flash_sale', 'percentage', 'fixed']),
  value: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.boolean(),
  applicableProductIds: z.array(z.string()).optional(),
  applicableCategoryIds: z.array(z.string()).optional()
});
export type Promotion = z.infer<typeof PromotionSchema>;

export const OrderItemInputSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  customization: z.record(z.any()).optional()
});

export const OrderItemSchema = OrderItemInputSchema.extend({
  id: z.string()
});

export const OrderStatusSchema = z.enum([
  'WhatsApp Pending', 'WhatsApp Opened', 'Customer Contacted',
  'Quotation Sent', 'Awaiting Confirmation', 'Confirmed',
  'Processing', 'Ready', 'Completed', 'Cancelled'
]);

export const OrderInputSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().optional(),
  items: z.array(OrderItemInputSchema),
  subtotal: z.number(),
  discount: z.number(),
  total: z.number(),
  status: OrderStatusSchema,
  deliveryMethod: z.enum(['pickup', 'local', 'nationwide']),
  deliveryAddress: z.string().optional(),
  deliveryFee: z.number().nullable().optional()
});

export const OrderSchema = OrderInputSchema.extend({
  id: z.string(),
  reference: z.string(),
  items: z.array(OrderItemSchema),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type Order = z.infer<typeof OrderSchema>;

export const GalleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string(),
  categoryId: z.string()
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  rating: z.number().min(1).max(5),
  createdAt: z.string(),
  approved: z.boolean()
});
export type Review = z.infer<typeof ReviewSchema>;

export const DeliverySettingsSchema = z.object({
  pickupEnabled: z.boolean(),
  pickupAddress: z.string(),
  localDeliveryEnabled: z.boolean(),
  localDeliveryFee: z.number().nullable(),
  nationwideDeliveryEnabled: z.boolean(),
  nationwideDeliveryBaseFee: z.number().nullable(),
  freeDeliveryThreshold: z.number().nullable().optional()
});

export const BusinessSettingsInputSchema = z.object({
  storeName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
  whatsappNumber: z.string(),
  address: z.string(),
  currency: z.string(),
  currencySymbol: z.string(),
  vatPercentage: z.number(),
  deliverySettings: DeliverySettingsSchema
});

export const BusinessSettingsSchema = BusinessSettingsInputSchema.extend({
  id: z.string()
});
export type BusinessSettings = z.infer<typeof BusinessSettingsSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  password: z.string()
});

export const UpdateRoleRequestSchema = z.object({
  role: RoleSchema
});

export const SubmitRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  customerId: z.string(),
  customerName: z.string()
});

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema
});
