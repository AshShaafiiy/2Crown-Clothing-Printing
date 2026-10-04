import { db } from '../db/firebase';
import { Promotion } from '../schemas';

export class PromotionRepository {
  async findAll(): Promise<Promotion[]> {
    const snap = await db.collection('promotions').get();
    return snap.docs.map( (doc: any) => doc.data() as Promotion);
  }

  async findActive(): Promise<Promotion[]> {
    const now = new Date().toISOString();
    const snap = await db.collection('promotions')
      .where('active', '==', true)
      .where('startDate', '<=', now)
      .get();
      
    return snap.docs
      .map( (doc: any) => doc.data() as Promotion)
      .filter((promo: any) => promo.endDate >= now);
  }

  async create(promotion: Promotion): Promise<Promotion> {
    await db.collection('promotions').doc(promotion.id).set(promotion);
    return promotion;
  }

  async update(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
    const updateData = { ...updates };
    delete (updateData as any).id;
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );
    await db.collection('promotions').doc(id).update(filteredUpdateData);
    return this.findById(id);
  }

  async findById(id: string): Promise<Promotion | null> {
    const doc = await db.collection('promotions').doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Promotion;
  }

  async delete(id: string): Promise<void> {
    await db.collection('promotions').doc(id).delete();
  }
}

export const promotionRepository = new PromotionRepository();
