import { 
  IProductService, ICategoryService, IPromotionService, IOrderService, 
  IGalleryService, IAuthService, IRBACService,
  IReviewService, ITestimonialService, ISettingsService
} from '../interfaces';
import { 
  Product, Category, Promotion, Order, GalleryItem, 
  User, OrderStatus, ID, Role, Review, Testimonial, BusinessSettings 
} from '../../domain/models';

// Mock Data
let categories: Category[] = [
  { id: 'cat-1', name: 'Corporate Wears', slug: 'corporate-wears', active: true, order: 1 },
  { id: 'cat-2', name: 'Large Format Printing', slug: 'large-format-printing', active: true, order: 2 },
  { id: 'cat-3', name: 'Souvenirs & Gifts', slug: 'souvenirs-gifts', active: true, order: 3 },
  { id: 'cat-4', name: 'Awards & Plaques', slug: 'awards-plaques', active: true, order: 4 },
];

let products: Product[] = [
  {
    id: 'prod-1',
    name: 'Custom Polo Shirt (Owerri Spec)',
    slug: 'custom-polo-shirt',
    description: 'High quality corporate polo shirt with your logo.',
    categoryId: 'cat-1',
    type: 'customizable',
    price: 7500, // NGN
    images: [],
    stock: 500,
    featured: true,
    active: true,
    customizationFields: [
      { id: 'cf-1', name: 'logo', label: 'Upload Logo', type: 'file', required: true }
    ]
  },
  {
    id: 'prod-2',
    name: 'Roll-up Banner (8x8ft)',
    slug: 'rollup-banner',
    description: 'Durable flex banner for Lagos events.',
    categoryId: 'cat-2',
    type: 'quote',
    price: 35000,
    images: [],
    stock: 999,
    featured: true,
    active: true,
  },
  {
    id: 'prod-3',
    name: 'Branded Magic Mug',
    slug: 'branded-magic-mug',
    description: 'Ceramic mug with heat-sensitive custom print.',
    categoryId: 'cat-3',
    type: 'customizable',
    price: 4500,
    previousPrice: 5500,
    images: [],
    stock: 150,
    featured: false,
    active: true,
    promotionalBadge: 'Awoof'
  }
];

let orders: Order[] = [];

let reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerId: 'user-1',
    customerName: 'Anonymous',
    rating: 5,
    createdAt: new Date().toISOString(),
    approved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    customerId: 'user-2',
    customerName: 'Anonymous',
    rating: 4,
    createdAt: new Date().toISOString(),
    approved: true
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    customerId: 'user-3',
    customerName: 'Anonymous',
    rating: 5,
    createdAt: new Date().toISOString(),
    approved: true
  }
];
let testimonials: Testimonial[] = [
  {
    id: 'test-1',
    customerName: 'Chinedu Okeke',
    company: 'TechBro Ng',
    content: '2Crown Clothing handled our company merch with superb quality! The polo shirts were thick and the print didn\'t wash off. Highly recommend!',
    rating: 5,
    featured: true,
    createdAt: new Date().toISOString()
  }
];

let businessSettings: BusinessSettings = {
  id: 'biz-1',
  storeName: '2Crown Clothing & Printing',
  contactEmail: 'info@2crown.com.ng',
  contactPhone: '09061747646',
  whatsappNumber: '09061747646',
  address: 'Ikeja, Lagos, Nigeria',
  currency: 'NGN',
  currencySymbol: '₦',
  vatPercentage: 7.5,
  deliverySettings: {
    pickupEnabled: true,
    pickupAddress: 'Ikeja, Lagos, Nigeria',
    localDeliveryEnabled: true,
    localDeliveryFee: 3000,
    nationwideDeliveryEnabled: true,
    nationwideDeliveryBaseFee: 5000,
    freeDeliveryThreshold: 200000
  }
};

let users: User[] = [
  { id: 'root-1', email: 'annarsjay3@gmail.com', name: 'Root Admin', role: 'root_super_admin', active: true },
  { id: 'sa-1', email: 'super@2crown.com.ng', name: 'Super Admin', role: 'super_admin', active: true },
  { id: 'admin-1', email: 'admin@2crown.com.ng', name: 'Regular Admin', role: 'admin', active: true },
];

export class MockProductService implements IProductService {
  async getProducts(filters?: any): Promise<Product[]> {
    let result = [...products];
    if (filters?.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }
    return result;
  }
  async getProductById(id: ID): Promise<Product | null> {
    return products.find(p => p.id === id) || null;
  }
  async getProductBySlug(slug: string): Promise<Product | null> {
    return products.find(p => p.slug === slug) || null;
  }
  async getFeaturedProducts(): Promise<Product[]> {
    return products.filter(p => p.featured);
  }
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = { ...product, id: `prod-${Date.now()}` };
    products.push(newProduct as Product);
    return newProduct as Product;
  }
  async updateProduct(id: ID, product: Partial<Product>): Promise<Product> {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...product };
    return products[index];
  }
  async deleteProduct(id: ID): Promise<void> {
    products = products.filter(p => p.id !== id);
  }
}

export class MockCategoryService implements ICategoryService {
  async getCategories(): Promise<Category[]> {
    return categories.sort((a, b) => a.order - b.order);
  }
  async getCategoryById(id: ID): Promise<Category | null> {
    return categories.find(c => c.id === id) || null;
  }
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categories.find(c => c.slug === slug) || null;
  }
  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory = { ...category, id: `cat-${Date.now()}` };
    categories.push(newCategory as Category);
    return newCategory as Category;
  }
  async updateCategory(id: ID, category: Partial<Category>): Promise<Category> {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...category };
    return categories[index];
  }
  async deleteCategory(id: ID): Promise<void> {
    categories = categories.filter(c => c.id !== id);
  }
}

export class MockPromotionService implements IPromotionService {
  async getPromotions(): Promise<Promotion[]> { return []; }
  async getActivePromotions(): Promise<Promotion[]> { return []; }
  async getFlashSales(): Promise<Promotion[]> { return []; }
}

export class MockOrderService implements IOrderService {
  async getOrders(_filters?: any): Promise<Order[]> { return orders; }
  async getOrderById(id: ID): Promise<Order | null> { return orders.find(o => o.id === id) || null; }
  async getOrderByReference(reference: string): Promise<Order | null> { return orders.find(o => o.reference === reference) || null; }
  async createOrder(order: Omit<Order, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      reference: `2CROWN-${Math.floor(Math.random() * 1000000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return newOrder;
  }
  async updateOrderStatus(id: ID, status: OrderStatus): Promise<Order> {
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}


export class MockGalleryService implements IGalleryService {
  async getGalleryItems(_categoryId?: ID): Promise<GalleryItem[]> { return []; }
}

export class MockReviewService implements IReviewService {
  async getReviewsByProductId(productId: ID): Promise<Review[]> { return reviews.filter(r => r.productId === productId && r.approved); }
  async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {
    const productReviews = reviews.filter(r => r.productId === productId && r.approved);
    if (productReviews.length === 0) return { average: 0, count: 0 };
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return { average: Number((sum / productReviews.length).toFixed(1)), count: productReviews.length };
  }
  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'approved'>): Promise<Review> {
    const newReview: Review = { ...review, id: `rev-${Date.now()}`, createdAt: new Date().toISOString(), approved: true };
    reviews.push(newReview);
    return newReview;
  }
  async approveReview(id: ID): Promise<void> {
    const r = reviews.find(x => x.id === id);
    if (r) r.approved = true;
  }
}

export class MockTestimonialService implements ITestimonialService {
  async getTestimonials(): Promise<Testimonial[]> { return testimonials; }
  async getFeaturedTestimonials(): Promise<Testimonial[]> { return testimonials.filter(t => t.featured); }
}

export class MockSettingsService implements ISettingsService {
  async getBusinessSettings(): Promise<BusinessSettings> { return businessSettings; }
  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    businessSettings = { ...businessSettings, ...settings };
    return businessSettings;
  }
}

export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
  async login(email: string, _password: string): Promise<User> {
    const user = users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      return user;
    }
    // Default login for testing if not explicitly in the mock array
    if (email === 'annarsjay3@gmail.com') {
      const rootUser: User = { id: 'root-1', email, name: 'Root Admin', role: 'root_super_admin', active: true };
      this.currentUser = rootUser;
      if(!users.find(u => u.email === email)) users.push(rootUser);
      return rootUser;
    }
    
    this.currentUser = { id: `user-${Date.now()}`, email, name: 'Test User', role: 'customer', active: true };
    return this.currentUser;
  }
  async logout(): Promise<void> {
    this.currentUser = null;
  }
}

export class MockRBACService implements IRBACService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async createUser(user: Omit<User, 'id'>, currentUser: User): Promise<User> {
    // RBAC logic for creating users
    if (currentUser.role === 'customer') throw new Error('Unauthorized');

    if (user.role === 'root_super_admin') {
      throw new Error('Unauthorized: Cannot create root super admin');
    }

    if (user.role === 'super_admin' || user.role === 'admin') {
      if (currentUser.role !== 'root_super_admin') {
        throw new Error('Unauthorized: Only root super admin can create administrators');
      }
    }

    const newUser: User = { ...user, id: `user-${Date.now()}` };
    users.push(newUser);
    return newUser;
  }

  async updateUserRole(targetUserId: ID, newRole: Role, currentUser: User): Promise<User> {
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) throw new Error('User not found');

    if (targetUser.email === 'annarsjay3@gmail.com' || targetUser.role === 'root_super_admin') {
      throw new Error('Unauthorized: Cannot modify root super admin role');
    }

    if (newRole === 'root_super_admin') {
      throw new Error('Unauthorized: Cannot assign root super admin role');
    }

    if (currentUser.role !== 'root_super_admin') {
      throw new Error('Unauthorized: Only root super admin can modify roles');
    }

    targetUser.role = newRole;
    return targetUser;
  }

  async deleteUser(targetUserId: ID, currentUser: User): Promise<void> {
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) throw new Error('User not found');

    if (targetUser.email === 'annarsjay3@gmail.com' || targetUser.role === 'root_super_admin') {
      throw new Error('Unauthorized: Cannot delete root super admin');
    }

    if (targetUser.role === 'super_admin' || targetUser.role === 'admin') {
      if (currentUser.role !== 'root_super_admin') {
        throw new Error('Unauthorized: Only root super admin can delete administrators');
      }
    }

    users = users.filter(u => u.id !== targetUserId);
  }
}

// Service Locator
export const services = {
  products: new MockProductService(),
  categories: new MockCategoryService(),
  promotions: new MockPromotionService(),
  orders: new MockOrderService(),
  gallery: new MockGalleryService(),
  reviews: new MockReviewService(),
  testimonials: new MockTestimonialService(),
  settings: new MockSettingsService(),
  auth: new MockAuthService(),
  rbac: new MockRBACService(),
};
