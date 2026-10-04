import { db } from '../db/firebase';
import { Review } from '../schemas';

export class ReviewRepository {
  async findByProductId(productId: string): Promise<Review[]> {
    const snap = await db.collection('reviews')
      .where('productId', '==', productId)
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map( (doc: any) => doc.data() as Review);
  }

  async create(review: Review): Promise<Review> {
    await db.collection('reviews').doc(review.id).set(review);
    return review;
  }

  async getRatingSummary(productId: string): Promise<{ average: number; count: number }> {
    const snap = await db.collection('reviews')
      .where('productId', '==', productId)
      .where('approved', '==', true)
      .get();
      
    if (snap.empty) return { average: 0, count: 0 };
    
    let sum = 0;
    snap.docs.forEach( (doc: any) => {
      sum += doc.data().rating;
    });
    
    return { average: sum / snap.docs.length, count: snap.docs.length };
  }
}

export const reviewRepository = new ReviewRepository();
