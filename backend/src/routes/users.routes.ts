import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, _passwordHashes } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { CreateUserRequestSchema, UpdateRoleRequestSchema } from '../schemas';
import { authenticate } from '../middleware/auth.middleware';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', authenticate, (req, res) => {
  // Omit password hashes
  res.json(db.users);
});

router.post('/', authenticate, validateRequest(CreateUserRequestSchema), async (req, res) => {
  // Only root_super_admin and super_admin can create users
  if (req.user?.role === 'admin' || req.user?.role === 'customer') {
    return res.status(403).json({ error: 'Forbidden: Admins cannot create administrators' });
  }

  const { email, password, name, role } = req.body;
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: uuid(),
    email,
    name,
    role,
    active: true,
    createdAt: new Date().toISOString()
  };

  const hash = await bcrypt.hash(password, 10);
  _passwordHashes[email] = hash;
  
  db.users.push(newUser);
  res.status(201).json(newUser);
});

router.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const targetUser = db.users.find(u => u.id === id);
  
  if (!targetUser) return res.status(404).json({ error: 'Not found' });
  
  if (targetUser.email === 'annarsjay3@gmail.com') {
    return res.status(403).json({ error: 'Forbidden: Root Super Admin cannot be deleted' });
  }
  
  if (req.user?.role === 'admin' || req.user?.role === 'customer') {
    return res.status(403).json({ error: 'Forbidden: Admins cannot delete administrators' });
  }

  db.users = db.users.filter(u => u.id !== id);
  delete _passwordHashes[targetUser.email];

  res.status(204).send();
});

router.patch('/:id/role', authenticate, validateRequest(UpdateRoleRequestSchema), (req, res) => {
  const { id } = req.params;
  const targetUser = db.users.find(u => u.id === id);
  
  if (!targetUser) return res.status(404).json({ error: 'Not found' });

  if (targetUser.email === 'annarsjay3@gmail.com') {
    return res.status(403).json({ error: 'Forbidden: Root Super Admin role cannot be modified' });
  }

  if (req.user?.role === 'admin' || req.user?.role === 'customer') {
    return res.status(403).json({ error: 'Forbidden: Admins cannot modify roles' });
  }

  targetUser.role = req.body.role;
  res.json(targetUser);
});

export default router;
