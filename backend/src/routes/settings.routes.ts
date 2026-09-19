import { Router } from 'express';
import { db } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { BusinessSettingsInputSchema } from '../schemas';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.settings);
});

router.put('/', authenticate, validateRequest(BusinessSettingsInputSchema), (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  res.json(db.settings);
});

export default router;
