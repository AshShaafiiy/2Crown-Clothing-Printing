import { Router } from 'express';
import { db } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { SubmitRatingSchema } from '../schemas';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  const productReviews = db.reviews.filter(r => r.productId === productId && r.approved);
  
  if (productReviews.length === 0) {
    return res.json({ average: 0, count: 0 });
  }

  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
  res.json({
    average: sum / productReviews.length,
    count: productReviews.length
  });
});

router.post('/:productId', validateRequest(SubmitRatingSchema), (req, res) => {
  const { productId } = req.params;
  const newRating = {
    id: uuid(),
    productId,
    ...req.body,
    createdAt: new Date().toISOString(),
    approved: false
  };
  
  db.reviews.push(newRating);
  res.status(201).json(newRating);
});

export default router;
