import { db } from '../db/firebase';
import { Category } from '../schemas';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const snap = await db.collection('categories').orderBy('order', 'asc').get();
    return snap.docs.map( (doc: any) => ({ id: doc.id, ...doc.data() } as Category));
  }

  async findById(id: string): Promise<Category | null> {
    const doc = await db.collection('categories').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Category;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const snap = await db.collection('categories').where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Category;
  }

  async create(category: Category): Promise<Category> {
    if (!category.id) throw new Error('Category id required');
    await db.collection('categories').doc(category.id).set(category);
    return category;
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const updateData = { ...updates };
    delete (updateData as any).id;
    await db.collection('categories').doc(id).update(updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.collection('categories').doc(id).delete();
  }
}

export const categoryRepository = new CategoryRepository();
