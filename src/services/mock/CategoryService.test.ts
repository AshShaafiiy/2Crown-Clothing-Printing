import { describe, it, expect, beforeEach } from 'vitest';
import { MockCategoryService } from './index';
import { Category } from '../../domain/models';

describe('MockCategoryService', () => {
  let service: MockCategoryService;
  
  beforeEach(() => {
    service = new MockCategoryService();
  });

  it('should get all categories sorted by order', async () => {
    const categories = await service.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    // Check if sorted
    for (let i = 0; i < categories.length - 1; i++) {
      expect(categories[i].order).toBeLessThanOrEqual(categories[i + 1].order);
    }
  });

  it('should get a category by ID', async () => {
    const categories = await service.getCategories();
    const targetId = categories[0].id;
    
    const category = await service.getCategoryById(targetId);
    expect(category).not.toBeNull();
    expect(category?.id).toBe(targetId);
  });

  it('should return null for non-existent category ID', async () => {
    const category = await service.getCategoryById('non-existent-id');
    expect(category).toBeNull();
  });

  it('should get a category by slug', async () => {
    const categories = await service.getCategories();
    const targetSlug = categories[0].slug;
    
    const category = await service.getCategoryBySlug(targetSlug);
    expect(category).not.toBeNull();
    expect(category?.slug).toBe(targetSlug);
  });

  it('should create a new category', async () => {
    const newCategoryData: Omit<Category, 'id'> = {
      name: 'New Category',
      slug: 'new-category',
      active: true,
      order: 10,
    };

    const createdCategory = await service.createCategory(newCategoryData);
    expect(createdCategory.id).toBeDefined();
    expect(createdCategory.name).toBe(newCategoryData.name);

    const fetchedCategory = await service.getCategoryById(createdCategory.id);
    expect(fetchedCategory).not.toBeNull();
  });

  it('should update an existing category', async () => {
    const categories = await service.getCategories();
    const targetId = categories[0].id;
    
    const updatedCategory = await service.updateCategory(targetId, { name: 'Updated Cat Name' });
    expect(updatedCategory.name).toBe('Updated Cat Name');

    const fetchedCategory = await service.getCategoryById(targetId);
    expect(fetchedCategory?.name).toBe('Updated Cat Name');
  });

  it('should throw error when updating non-existent category', async () => {
    await expect(service.updateCategory('invalid-id', { name: 'test' })).rejects.toThrow('Category not found');
  });

  it('should delete a category', async () => {
    const category = await service.createCategory({
      name: 'To be deleted',
      slug: 'delete-me',
      active: true,
      order: 99,
    });

    await service.deleteCategory(category.id);
    const fetchedCategory = await service.getCategoryById(category.id);
    expect(fetchedCategory).toBeNull();
  });
});
