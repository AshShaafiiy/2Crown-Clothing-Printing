const { v4: uuid } = require('uuid');
const payload = {
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test',
  price: 1000,
  compareAtPrice: null,
  categoryId: 'category-1',
  sizes: ['M'],
  colors: ['Black'],
  images: ['/test.jpg'],
  active: true,
  featured: false
};
console.log(JSON.stringify(payload));
