import {
  Product, Category, Promotion, Order, GalleryItem,
  User, ID, OrderStatus, Review, Testimonial, BusinessSettings, Role
} from '../../domain/models';
import {
  IProductService, ICategoryService, IPromotionService, IOrderService,
  IGalleryService, IReviewService, ITestimonialService, ISettingsService,
  IAuthService, IRBACService
} from '../interfaces';
import { apiClient, setTokenProvider } from './client';

export class ApiProductService implements IProductService {
  async getProducts(filters?: any): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.active !== undefined) params.append('active', String(filters.active));
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    
    const qs = params.toString();
    return apiClient<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  }
  async getProductById(id: ID): Promise<Product | null> {
    try { return await apiClient<Product>(`/products/${id}`); } 
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async getProductBySlug(slug: string): Promise<Product | null> {
    try { return await apiClient<Product>(`/products/${slug}`); } 
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return this.getProducts({ featured: true });
  }
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return apiClient<Product>('/products', { method: 'POST', body: JSON.stringify(product) });
  }
  async updateProduct(id: ID, product: Partial<Product>): Promise<Product> {
    return apiClient<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
  }
  async deleteProduct(id: ID): Promise<void> {
    await apiClient(`/products/${id}`, { method: 'DELETE' });
  }
}

export class ApiCategoryService implements ICategoryService {
  async getCategories(): Promise<Category[]> {
    const cats = await apiClient<Category[]>('/categories');
    return cats.sort((a, b) => a.order - b.order);
  }
  async getCategoryById(id: ID): Promise<Category | null> {
    try { return await apiClient<Category>(`/categories/${id}`); } 
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try { return await apiClient<Category>(`/categories/${slug}`); } 
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return apiClient<Category>('/categories', { method: 'POST', body: JSON.stringify(category) });
  }
  async updateCategory(id: ID, category: Partial<Category>): Promise<Category> {
    return apiClient<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(category) });
  }
  async deleteCategory(id: ID): Promise<void> {
    await apiClient(`/categories/${id}`, { method: 'DELETE' });
  }
}

export class ApiPromotionService implements IPromotionService {
  async getPromotions(): Promise<Promotion[]> {
    return apiClient<Promotion[]>('/promotions');
  }
  async getActivePromotions(): Promise<Promotion[]> {
    return apiClient<Promotion[]>('/promotions?activeOnly=true');
  }
  async getFlashSales(): Promise<Promotion[]> {
    return apiClient<Promotion[]>('/promotions?flashSalesOnly=true');
  }
}

export class ApiOrderService implements IOrderService {
  async getOrders(_filters?: any): Promise<Order[]> {
    return apiClient<Order[]>('/orders');
  }
  async getOrderById(_id: ID): Promise<Order | null> {
    // API only has getOrderByReference based on OpenAPI spec
    // We'll throw or simulate if needed, but normally frontend tracks by reference
    throw new Error('getOrderById not supported in API. Use reference.');
  }
  async getOrderByReference(reference: string): Promise<Order | null> {
    try { return await apiClient<Order>(`/orders/${reference}`); } 
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async createOrder(order: Omit<Order, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    return apiClient<Order>('/orders', { method: 'POST', body: JSON.stringify(order) });
  }
  async updateOrderStatus(id: ID, status: OrderStatus): Promise<Order> {
    return apiClient<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }
}

export class ApiGalleryService implements IGalleryService {
  async getGalleryItems(categoryId?: ID): Promise<GalleryItem[]> {
    return apiClient<GalleryItem[]>(categoryId ? `/gallery?categoryId=${categoryId}` : '/gallery');
  }
}

export class ApiReviewService implements IReviewService {
  async getReviewsByProductId(_productId: ID): Promise<Review[]> {
    return []; // No endpoint to get full review objects directly in OpenAPI spec, only summary. 
    // Actually wait, let's implement if we need it, but the UI might just need summary.
  }
  async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {
    return apiClient<{ average: number; count: number }>(`/ratings/${productId}`);
  }
  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'approved'>): Promise<Review> {
    return apiClient<Review>(`/ratings/${review.productId}`, { 
      method: 'POST', 
      body: JSON.stringify({
        rating: review.rating,
        customerId: review.customerId,
        customerName: review.customerName
      }) 
    });
  }
  async approveReview(_id: ID): Promise<void> {
    // Not explicitly in openapi.yaml
  }
}

// Dead code for API
export class ApiTestimonialService implements ITestimonialService {
  async getTestimonials(): Promise<Testimonial[]> { return []; }
  async getFeaturedTestimonials(): Promise<Testimonial[]> { return []; }
}

export class ApiSettingsService implements ISettingsService {
  async getBusinessSettings(): Promise<BusinessSettings> {
    return apiClient<BusinessSettings>('/settings');
  }
  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    // In actual implementation, we might need to GET first and merge, 
    // but the PUT endpoint replaces it. Let's merge here if partial.
    const current = await this.getBusinessSettings();
    const updated = { ...current, ...settings };
    return apiClient<BusinessSettings>('/settings', { method: 'PUT', body: JSON.stringify(updated) });
  }
}

export class ApiAuthService implements IAuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('2crown_admin_token');
    setTokenProvider(() => this.token);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;
    if (this.currentUser) return this.currentUser;
    try {
      this.currentUser = await apiClient<User>('/auth/me');
      return this.currentUser;
    } catch {
      this.logout();
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const res: any = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Express res adds token to the response payload in our backend
    this.token = res.token;
    if (this.token) {
      localStorage.setItem('2crown_admin_token', this.token);
    }
    
    // Remove token from returned user object to strictly match User model
    const user = { ...res };
    delete user.token;
    this.currentUser = user;
    
    return user as User;
  }

  async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('2crown_admin_token');
  }
}

export class ApiRBACService implements IRBACService {
  async getUsers(): Promise<User[]> {
    return apiClient<User[]>('/users');
  }
  async createUser(user: Omit<User, 'id'>, _currentUser: User): Promise<User> {
    return apiClient<User>('/users', { method: 'POST', body: JSON.stringify(user) });
  }
  async updateUserRole(targetUserId: ID, newRole: Role, _currentUser: User): Promise<User> {
    return apiClient<User>(`/users/${targetUserId}/role`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
  }
  async deleteUser(targetUserId: ID, _currentUser: User): Promise<void> {
    await apiClient(`/users/${targetUserId}`, { method: 'DELETE' });
  }
}

export const apiServices = {
  products: new ApiProductService(),
  categories: new ApiCategoryService(),
  promotions: new ApiPromotionService(),
  orders: new ApiOrderService(),
  gallery: new ApiGalleryService(),
  reviews: new ApiReviewService(),
  testimonials: new ApiTestimonialService(),
  settings: new ApiSettingsService(),
  auth: new ApiAuthService(),
  rbac: new ApiRBACService(),
};
