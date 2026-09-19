const fs = require('fs');
const file = 'src/services/api/index.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove my recently injected ones if they are duplicates.
const toRemoveProd = `async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return apiClient<Product>('/products', { method: 'POST', body: JSON.stringify(product) });
  }
  async deleteProduct(id: ID): Promise<void> {
    return apiClient<void>(\`/products/\${id}\`, { method: 'DELETE' });
  }`;
content = content.replace(toRemoveProd, '');

const toRemoveCat = `async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return apiClient<Category>('/categories', { method: 'POST', body: JSON.stringify(category) });
  }
  async deleteCategory(id: ID): Promise<void> {
    return apiClient<void>(\`/categories/\${id}\`, { method: 'DELETE' });
  }`;
content = content.replace(toRemoveCat, '');

fs.writeFileSync(file, content);
