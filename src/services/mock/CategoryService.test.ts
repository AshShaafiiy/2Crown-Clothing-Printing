import { describe, it, expect, beforeEach } from 'vitest';
import { MockCategoryService } from './index';
import { Category } from '../../domain/models';

describe('MockCategoryService', () => {
  let service: MockCategoryService;
  
  beforeEach(() => {
    service = new MockCategoryService();
  });

  it('should auto-generate a slug from the category name when creating', async () => {
    const created = await service.createCategory({
      name: 'Custom Picture Frames',
      active: true,
      order: 10,
    } as any);
    expect(created.slug).toBe('custom-picture-frames');
  });

  it('should automatically update the slug when editing the name', async () => {
    const created = await service.createCategory({
      name: 'Frames',
      active: true,
      order: 10,
    } as any);
    expect(created.slug).toBe('frames');
    expect(created.id).toBeDefined();

    const updated = await service.updateCategory(created.id, { name: 'Wall Frames' });
    expect(updated.slug).toBe('wall-frames');
    expect(updated.id).toBe(created.id); // same document ID retained
  });

  it('should reject a category creation if slug already exists', async () => {
    await service.createCategory({
      name: 'Duplicate Test',
      active: true,
      order: 10,
    } as any);
    
    await expect(service.createCategory({
      name: 'duplicate test',
      active: true,
      order: 11,
    } as any)).rejects.toThrow('A category with a similar name already exists.');
  });
  
  it('should reject a category update if new slug conflicts with another category', async () => {
    const cat1 = await service.createCategory({
      name: 'Category A',
      active: true,
      order: 1,
    } as any);
    
    const cat2 = await service.createCategory({
      name: 'Category B',
      active: true,
      order: 2,
    } as any);
    
    await expect(service.updateCategory(cat2.id, { name: 'Category A' }))
      .rejects.toThrow('A category with a similar name already exists.');
  });
  
  it('should handle whitespace and punctuation normalization', async () => {
    const created = await service.createCategory({
      name: "Men's Clothing (Winter & Summer)!!!",
      active: true,
      order: 1,
    } as any);
    expect(created.slug).toBe('men-s-clothing-winter-summer');
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
