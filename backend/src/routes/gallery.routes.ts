import { Router } from 'express';
import { db } from '../store/db';

const router = Router();

router.get('/', (req, res) => {
  let items = db.gallery;
  if (req.query.categoryId) {
    items = items.filter(g => g.categoryId === req.query.categoryId);
  }
  res.json(items);
});

export default router;
