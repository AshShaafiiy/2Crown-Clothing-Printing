import { 
  Product, Category, Promotion, Order, PublicOrder,
  User, ID, OrderStatus, Review,
  Testimonial, BusinessSettings, Role 
} from '../../domain/models';

export interface IProductService {
  getProducts(filters?: any): Promise<Product[]>;
  getProductById(id: ID): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: ID, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: ID): Promise<void>;
}

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: ID): Promise<Category | null>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  createCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(id: ID, category: Partial<Category>): Promise<Category>;
  deleteCategory(id: ID): Promise<void>;
}

export interface IPromotionService {
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  getFlashSales(): Promise<Promotion[]>;
}

export interface IOrderService {
  getOrders(filters?: any): Promise<Order[]>;
  getOrderById(id: ID): Promise<Order | null>;
  getOrderByReference(reference: string, phone: string): Promise<PublicOrder | null>;
  createOrder(order: Omit<Order, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateOrderStatus(id: ID, status: OrderStatus): Promise<Order>;
  updateOrderDeliveryFee(id: ID, fee: number): Promise<Order>;
}



export interface IReviewService {
  verifyPurchase(productId: string, reference: string, phone: string): Promise<{ token: string; existingRating?: number }>;
  getReviewsByProductId(productId: ID): Promise<Review[]>;
  checkEligibility?(productId: ID): Promise<{ eligible: boolean; reason: string; existingRating?: number }>;
  getRatingSummary(productId: ID): Promise<{ average: number; count: number }>;
  addReview(review: Omit<Review, 'id' | 'createdAt' | 'approved'>): Promise<Review>;
  approveReview(id: ID): Promise<void>;
}

export interface ITestimonialService {
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalSales: number;
}

export interface IDashboardService {
  getStats(): Promise<DashboardStats>;
}

export interface ISettingsService {
  getBusinessSettings(): Promise<BusinessSettings>;
  updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings>;
}

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  updateProfile(data: { name: string; email: string; phone?: string }): Promise<User>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}

export interface IRBACService {
  getUsers(): Promise<User[]>;
  createUser(user: Omit<User, 'id'>, currentUser: User): Promise<User>;
  updateUserRole(targetUserId: ID, newRole: Role, currentUser: User): Promise<User>;
  updateUserStatus(targetUserId: ID, active: boolean, currentUser: User): Promise<User>;
  deleteUser(targetUserId: ID, currentUser: User): Promise<void>;
}
