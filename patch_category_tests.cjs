const fs = require('fs');

const path = 'src/services/mock/CategoryService.test.ts';
let content = fs.readFileSync(path, 'utf8');

const newTests = `
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
    expect(created.slug).toBe('men-s-clothing-winter-summer-'); // depending on regex: /[^a-z0-9]+/g => men-s-clothing-winter-summer- but wait, trailing hyphens are removed by replacing /^-+|-+$/g
    // Actually men-s-clothing-winter-summer
    expect(created.slug).toBe('men-s-clothing-winter-summer');
  });
`;

if (!content.includes('should auto-generate a slug')) {
  content = content.replace('});\n', newTests + '});\n');
  fs.writeFileSync(path, content);
}
