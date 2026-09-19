import { Router } from 'express';
import { db } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { OrderInputSchema, UpdateOrderStatusSchema } from '../schemas';
import { authenticate } from '../middleware/auth.middleware';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json(db.orders);
});

router.post('/', validateRequest(OrderInputSchema), (req, res) => {
  const newOrder = {
    id: uuid(),
    reference: `2C-${Math.floor(10000 + Math.random() * 90000)}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Rule: Store pickup fee MUST be 0
  if (newOrder.deliveryMethod === 'pickup') {
    newOrder.deliveryFee = 0;
  } else if (newOrder.deliveryMethod === 'local') {
    // Rule: Local delivery MUST NOT calculate the fee, keep as passed or null
    // Assuming passed correctly by frontend (or set to null if missing)
  }

  db.orders.push(newOrder);
  res.status(201).json(newOrder);
});

router.get('/:reference', (req, res) => {
  const { reference } = req.params;
  const order = db.orders.find(o => o.reference === reference);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

router.patch('/:id/status', authenticate, validateRequest(UpdateOrderStatusSchema), (req, res) => {
  const { id } = req.params;
  const index = db.orders.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  db.orders[index].status = req.body.status;
  db.orders[index].updatedAt = new Date().toISOString();
  res.json(db.orders[index]);
});

export default router;
