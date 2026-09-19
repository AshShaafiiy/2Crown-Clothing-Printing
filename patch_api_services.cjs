const fs = require('fs');
const file = 'src/services/api/index.ts';
let content = fs.readFileSync(file, 'utf8');

const prodRegex = /async getProductBySlug\(slug: string\): Promise<Product \| null> \{[\s\S]*?catch \(err: any\) \{ if \(err\.status === 404\) return null; throw err; \}\s*\}/;
content = content.replace(prodRegex, `async getProductBySlug(slug: string): Promise<Product | null> {
    try { return await apiClient<Product>(\`/products/\${slug}\`); } 
    catch (err: any) { if (err.status === 404) return null; throw err; }
  }
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return apiClient<Product>('/products', { method: 'POST', body: JSON.stringify(product) });
  }
  async deleteProduct(id: ID): Promise<void> {
    return apiClient<void>(\`/products/\${id}\`, { method: 'DELETE' });
  }`);

const catRegex = /async getCategories\(\): Promise<Category\[\]> \{\s*return apiClient<Category\[\]>\('\/categories'\);\s*\}/;
content = content.replace(catRegex, `async getCategories(): Promise<Category[]> {
    return apiClient<Category[]>('/categories');
  }
  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return apiClient<Category>('/categories', { method: 'POST', body: JSON.stringify(category) });
  }
  async deleteCategory(id: ID): Promise<void> {
    return apiClient<void>(\`/categories/\${id}\`, { method: 'DELETE' });
  }`);

fs.writeFileSync(file, content);
