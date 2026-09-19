import bcrypt from 'bcryptjs';
import {
  User, Product, Category, Promotion, Order,
  GalleryItem, Review, BusinessSettings
} from '../schemas';

// Seed initial state
const initialUsers: User[] = [
  {
    id: 'u1',
    email: 'annarsjay3@gmail.com',
    name: 'Root Admin',
    role: 'root_super_admin',
    createdAt: new Date().toISOString(),
    active: true
  },
  {
    id: 'u2',
    email: 'admin@2crown.com',
    name: 'Regular Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    active: true
  }
];

export const _passwordHashes: Record<string, string> = {
  'annarsjay3@gmail.com': bcrypt.hashSync('password123', 10),
  'admin@2crown.com': bcrypt.hashSync('password123', 10)
};

const initialCategories: Category[] = [
  { id: 'c1', name: 'T-Shirts', slug: 't-shirts', active: true, order: 1 },
  { id: 'c2', name: 'Hoodies', slug: 'hoodies', active: true, order: 2 }
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Classic Black Tee',
    slug: 'classic-black-tee',
    description: 'A premium cotton t-shirt.',
    categoryId: 'c1',
    type: 'standard',
    price: 15000,
    images: ['/images/tee.jpg'],
    stock: 50,
    featured: true,
    active: true
  }
];

const initialSettings: BusinessSettings = {
  id: 'settings_1',
  storeName: '2Crown Clothing & Printing',
  contactEmail: 'info@2crown.com',
  contactPhone: '09061747646',
  whatsappNumber: '2349061747646',
  address: 'Lagos, Nigeria',
  currency: 'NGN',
  currencySymbol: '₦',
  vatPercentage: 0,
  deliverySettings: {
    pickupEnabled: true,
    pickupAddress: 'Store Location, Lagos',
    localDeliveryEnabled: true,
    localDeliveryFee: null, 
    nationwideDeliveryEnabled: false,
    nationwideDeliveryBaseFee: null
  }
};

export class InMemoryDB {
  public users: User[] = [];
  public products: Product[] = [];
  public categories: Category[] = [];
  public promotions: Promotion[] = [];
  public orders: Order[] = [];
  public gallery: GalleryItem[] = [];
  public reviews: Review[] = [];
  public settings: BusinessSettings = initialSettings;

  constructor() {
    this.reset();
  }

  public reset() {
    this.users = [...initialUsers];
    this.products = [...initialProducts];
    this.categories = [...initialCategories];
    this.promotions = [];
    this.orders = [];
    this.gallery = [];
    this.reviews = [];
    this.settings = { ...initialSettings };
  }
}

export const db = new InMemoryDB();
