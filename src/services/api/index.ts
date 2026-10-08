import { rememberSubmittedOrder } from '../../utils/publicOrder';
import {
  Product, Category, Promotion, Order, PublicOrder,
  User, ID, OrderStatus, Review, Testimonial, BusinessSettings, Role
} from '../../domain/models';
import {
  IProductService, ICategoryService, IPromotionService, IOrderService,
   IReviewService, ITestimonialService, ISettingsService,
  IAuthService, IRBACService, IDashboardService, DashboardStats
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

  async uploadImage(file: File): Promise<{url: string, imageFileId: string}> {
    const authRes = await apiClient<{token: string, expire: number, signature: string}>('/upload/imagekit-auth');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name || 'product');
    formData.append('folder', '/2crown/products/');
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '');
    formData.append('signature', authRes.signature);
    formData.append('expire', authRes.expire.toString());
    formData.append('token', authRes.token);

    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });

    if (!uploadRes.ok) throw new Error('ImageKit upload failed');
    const data = await uploadRes.json();
    return { url: data.url, imageFileId: data.fileId };
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
  async getOrderById(id: ID): Promise<Order | null> {
    try { return await apiClient<Order>(`/orders/id/${encodeURIComponent(id)}`); }
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async getOrderByReference(reference: string, phone: string): Promise<PublicOrder | null> {
    try {
      if (!/^2C-\d{6}$/i.test(reference.trim())) return null;
      return await apiClient<PublicOrder>('/orders/track', { method: 'POST', body: JSON.stringify({ reference, phone }) });
    }
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async createOrder(order: Omit<Order, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const saved = await apiClient<PublicOrder>('/orders', { method: 'POST', body: JSON.stringify(order) });
    // Preserve only this customer's submitted details for the WhatsApp handoff.
    const ownOrder: Order = { ...order, ...saved, id: '', items: order.items, history: [] };
    rememberSubmittedOrder(ownOrder);
    return ownOrder;
  }
  async updateOrderStatus(id: ID, status: OrderStatus): Promise<Order> {
    return apiClient<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }
  async updateOrderDeliveryFee(id: ID, fee: number): Promise<Order> {
    return apiClient<Order>(`/orders/${id}/delivery-fee`, { method: 'PATCH', body: JSON.stringify({ deliveryFee: fee }) });
  }
}

export class ApiReviewService implements IReviewService {
  async getReviewsByProductId(_productId: ID): Promise<Review[]> {
    return []; // No endpoint to get full review objects directly in OpenAPI spec, only summary. 
    // Actually wait, let's implement if we need it, but the UI might just need summary.
  }
  async checkEligibility(productId: ID): Promise<{ eligible: boolean; reason: string; existingRating?: number }> {
    const token = localStorage.getItem(`rating_token_${productId}`);
    if (!token) return { eligible: false, reason: 'not_authenticated' };
    try {
      const res = await fetch(`/api/ratings/${productId}?eligibility=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
           localStorage.removeItem(`rating_token_${productId}`);
        }
        return { eligible: false, reason: 'not_authenticated' };
      }
      return await res.json();
    } catch {
      return { eligible: false, reason: 'not_authenticated' };
    }
  }
  
  async verifyPurchase(productId: ID, reference: string, phone: string): Promise<{ token: string; existingRating?: number }> {
    return apiClient<{ token: string; existingRating?: number }>(`/ratings/${productId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ reference, phone })
    });
  }

  async getRatingSummary(productId: ID): Promise<{ average: number; count: number }> {
    return apiClient<{ average: number; count: number }>(`/ratings/${productId}`);
  }
  
  async addReview(review: Omit<Review, 'id' | 'createdAt' | 'approved'>): Promise<Review> {
    const token = localStorage.getItem(`rating_token_${review.productId}`);
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`/api/ratings/${review.productId}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: review.rating })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to submit rating');
    }
    return res.json();
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
    this.token = typeof window !== 'undefined' ? localStorage.getItem('2crown_admin_token') : null;
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

  async updateProfile(data: { name: string; email: string; phone?: string }): Promise<User> {
    const user = await apiClient<User>('/admins/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    this.currentUser = user;
    return user;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient('/admins/me/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
}

export class ApiRBACService implements IRBACService {
  async getUsers(): Promise<User[]> {
    return apiClient<User[]>('/admins');
  }
  async createUser(user: Omit<User, 'id'>, _currentUser: User): Promise<User> {
    return apiClient<User>('/admins', { method: 'POST', body: JSON.stringify(user) });
  }
  async updateUserRole(targetUserId: ID, newRole: Role, _currentUser: User): Promise<User> {
    return apiClient<User>(`/admins/${targetUserId}/role`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
  }
  async updateUserStatus(targetUserId: ID, active: boolean, _currentUser: User): Promise<User> {
    return apiClient<User>(`/admins/${targetUserId}/status`, { method: 'PATCH', body: JSON.stringify({ active }) });
  }
  async deleteUser(targetUserId: ID, _currentUser: User): Promise<void> {
    await apiClient(`/admins/${targetUserId}`, { method: 'DELETE' });
  }
}

export class ApiDashboardService implements IDashboardService {
  async getStats(): Promise<DashboardStats> {
    return apiClient<DashboardStats>('/dashboard/stats');
  }
}

export const apiServices = {
  products: new ApiProductService(),
  categories: new ApiCategoryService(),
  promotions: new ApiPromotionService(),
  orders: new ApiOrderService(),
  reviews: new ApiReviewService(),
  testimonials: new ApiTestimonialService(),
  settings: new ApiSettingsService(),
  auth: new ApiAuthService(),
  rbac: new ApiRBACService(),
  dashboard: new ApiDashboardService(),
};
