const fs = require('fs');
const file = 'src/backend/repositories/ReviewRepository.ts';
let code = fs.readFileSync(file, 'utf8');

const newMethod = `
  async findById(id: string): Promise<Review | null> {
    const doc = await db.collection('reviews').doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Review;
  }

  async update(id: string, updates: Partial<Review>): Promise<void> {
    await db.collection('reviews').doc(id).update(updates);
  }
`;

if (!code.includes('findById(')) {
  code = code.replace('export const reviewRepository', newMethod + '\nexport const reviewRepository');
  fs.writeFileSync(file, code);
  console.log('ReviewRepository patched');
} else {
  console.log('Already patched');
}
