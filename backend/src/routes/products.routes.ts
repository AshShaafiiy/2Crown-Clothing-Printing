import { Router } from 'express';
import { db } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { ProductInputSchema } from '../schemas';
import { authenticate } from '../middleware/auth.middleware';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
  let products = db.products;

  const categoryId = req.query.categoryId as string;
  const active = req.query.active as string;
  const featured = req.query.featured as string;

  if (categoryId) products = products.filter(p => p.categoryId === categoryId);
  if (active !== undefined) products = products.filter(p => p.active === (active === 'true'));
  if (featured !== undefined) products = products.filter(p => p.featured === (featured === 'true'));

  res.json(products);
});

router.post('/', authenticate, validateRequest(ProductInputSchema), (req, res) => {
  const newProduct = {
    id: uuid(),
    ...req.body
  };
  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === id || p.slug === id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

router.put('/:id', authenticate, validateRequest(ProductInputSchema), (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  db.products[index] = { id, ...req.body };
  res.json(db.products[index]);
});

router.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  db.products.splice(index, 1);
  res.status(204).send();
});

export default router;
