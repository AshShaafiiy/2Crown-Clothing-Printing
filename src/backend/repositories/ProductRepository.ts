import { db } from '../db/firebase';
import { Product } from '../schemas';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const snap = await db.collection('products').get();
    return snap.docs.map( (doc: any) => ({ id: doc.id, ...doc.data() } as Product));
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  }
  
  async findBySlug(slug: string): Promise<Product | null> {
    const snap = await db.collection('products').where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
  }

  async create(product: Product): Promise<Product> {
    await db.collection('products').doc(product.id).set(product);
    return product;
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const updateData = { ...updates };
    delete (updateData as any).id;
    
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    await db.collection('products').doc(id).update(filteredUpdateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await db.collection('products').doc(id).delete();
  }
}

export const productRepository = new ProductRepository();
