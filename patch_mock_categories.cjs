const fs = require('fs');

const path = 'src/services/mock/index.ts';
let content = fs.readFileSync(path, 'utf8');

const slugifyStr = `
function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
`;

if (!content.includes('generateSlug')) {
  content = content.replace('export class MockCategoryService', slugifyStr + '\nexport class MockCategoryService');
}

content = content.replace(
  /async createCategory\(category: Omit<Category, 'id'>\): Promise<Category> {[\s\S]*?categories\.push\(newCategory\);[\s\S]*?return newCategory;[\s\S]*?}/,
  `async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const slug = generateSlug(category.name);
    if (categories.find(c => c.slug === slug)) {
      throw new Error('A category with a similar name already exists.');
    }
    const newCategory: Category = { ...category, slug, id: \`cat-\${Date.now()}\`, createdAt: new Date().toISOString() };
    categories.push(newCategory);
    return newCategory;
  }`
);

content = content.replace(
  /async updateCategory\(id: ID, category: Partial<Category>\): Promise<Category> {[\s\S]*?const index = categories\.findIndex\(c => c\.id === id\);[\s\S]*?if \(index === -1\) throw new Error\('Category not found'\);[\s\S]*?categories\[index\] = { \.\.\.categories\[index\], \.\.\.category, id: categories\[index\]\.id, createdAt: categories\[index\]\.createdAt };[\s\S]*?return categories\[index\];[\s\S]*?}/,
  `async updateCategory(id: ID, category: Partial<Category>): Promise<Category> {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    let updatedSlug = categories[index].slug;
    if (category.name) {
      updatedSlug = generateSlug(category.name);
      if (categories.find(c => c.slug === updatedSlug && c.id !== id)) {
        throw new Error('A category with a similar name already exists.');
      }
    }

    categories[index] = { 
      ...categories[index], 
      ...category, 
      slug: updatedSlug,
      id: categories[index].id, 
      createdAt: categories[index].createdAt 
    };
    return categories[index];
  }`
);

fs.writeFileSync(path, content);
