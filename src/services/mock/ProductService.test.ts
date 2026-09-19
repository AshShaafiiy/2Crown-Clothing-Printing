import { describe, it, expect, beforeEach } from 'vitest';
import { MockProductService } from './index';
import { Product } from '../../domain/models';

describe('MockProductService', () => {
  let service: MockProductService;
  
  beforeEach(() => {
    service = new MockProductService();
  });

  it('should get all products', async () => {
    const products = await service.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should get products filtered by categoryId', async () => {
    const products = await service.getProducts({ categoryId: 'cat-1' });
    expect(products.every(p => p.categoryId === 'cat-1')).toBe(true);
  });

  it('should get a product by ID', async () => {
    const products = await service.getProducts();
    const targetId = products[0].id;
    
    const product = await service.getProductById(targetId);
    expect(product).not.toBeNull();
    expect(product?.id).toBe(targetId);
  });

  it('should return null for non-existent product ID', async () => {
    const product = await service.getProductById('non-existent-id');
    expect(product).toBeNull();
  });

  it('should get a product by slug', async () => {
    const products = await service.getProducts();
    const targetSlug = products[0].slug;
    
    const product = await service.getProductBySlug(targetSlug);
    expect(product).not.toBeNull();
    expect(product?.slug).toBe(targetSlug);
  });

  it('should get featured products', async () => {
    const featured = await service.getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every(p => p.featured)).toBe(true);
  });

  it('should create a new product', async () => {
    const newProductData: Omit<Product, 'id'> = {
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      categoryId: 'cat-1',
      type: 'standard',
      price: 1000,
      images: [],
      stock: 10,
      featured: false,
      active: true,
    };

    const createdProduct = await service.createProduct(newProductData);
    expect(createdProduct.id).toBeDefined();
    expect(createdProduct.name).toBe(newProductData.name);

    const fetchedProduct = await service.getProductById(createdProduct.id);
    expect(fetchedProduct).not.toBeNull();
  });

  it('should update an existing product', async () => {
    const products = await service.getProducts();
    const targetId = products[0].id;
    
    const updatedProduct = await service.updateProduct(targetId, { name: 'Updated Name', price: 9999 });
    expect(updatedProduct.name).toBe('Updated Name');
    expect(updatedProduct.price).toBe(9999);

    const fetchedProduct = await service.getProductById(targetId);
    expect(fetchedProduct?.name).toBe('Updated Name');
  });

  it('should throw error when updating non-existent product', async () => {
    await expect(service.updateProduct('invalid-id', { name: 'test' })).rejects.toThrow('Product not found');
  });

  it('should delete a product', async () => {
    // Create a product to delete first so we don't wipe out global state shared across tests if they run in sequence
    const product = await service.createProduct({
      name: 'To be deleted',
      slug: 'delete-me',
      description: '',
      categoryId: 'cat-1',
      type: 'standard',
      price: 1,
      images: [],
      stock: 1,
      featured: false,
      active: true,
    });

    await service.deleteProduct(product.id);
    const fetchedProduct = await service.getProductById(product.id);
    expect(fetchedProduct).toBeNull();
  });
});
