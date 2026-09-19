import { Router } from 'express';
import { db } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { CategoryInputSchema } from '../schemas';
import { authenticate } from '../middleware/auth.middleware';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.categories);
});

router.post('/', authenticate, validateRequest(CategoryInputSchema), (req, res) => {
  const newCategory = { id: uuid(), ...req.body };
  db.categories.push(newCategory);
  res.status(201).json(newCategory);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const cat = db.categories.find(c => c.id === id || c.slug === id);
  if (!cat) return res.status(404).json({ error: 'Not found' });
  res.json(cat);
});

router.put('/:id', authenticate, validateRequest(CategoryInputSchema), (req, res) => {
  const { id } = req.params;
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  db.categories[index] = { id, ...req.body };
  res.json(db.categories[index]);
});

router.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  db.categories.splice(index, 1);
  res.status(204).send();
});

export default router;
