import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, _passwordHashes } from '../store/db';
import { validateRequest } from '../middleware/validate.middleware';
import { LoginRequestSchema } from '../schemas';
import { authenticate, JWT_SECRET } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', validateRequest(LoginRequestSchema), async (req, res) => {
  const { email, password } = req.body;
  
  const user = db.users.find(u => u.email === email && u.active);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

  const hash = _passwordHashes[email];
  if (!hash) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

  // In standard practice, we might return the token in response,
  // but OpenAPI spec just returns the user schema for 200.
  // We'll append the token in headers or as part of a custom response, 
  // wait, the OpenAPI spec says:
  // responses: '200': content: application/json: schema: $ref: '#/components/schemas/User'
  // How does the client get the token? Often in header or body.
  // We will return it in a custom header and also allow it to be ignored by strict schema validators.
  res.setHeader('Authorization', `Bearer ${token}`);
  res.json({ ...user, token }); 
});

router.post('/logout', authenticate, (req, res) => {
  res.status(204).send();
});

router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

export default router;
