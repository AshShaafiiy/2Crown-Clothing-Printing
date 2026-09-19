import { Router } from 'express';
import { db } from '../store/db';

const router = Router();

router.get('/', (req, res) => {
  let promos = db.promotions;
  
  if (req.query.activeOnly === 'true') {
    promos = promos.filter(p => p.active);
  }
  if (req.query.flashSalesOnly === 'true') {
    promos = promos.filter(p => p.type === 'flash_sale');
  }

  res.json(promos);
});

export default router;
