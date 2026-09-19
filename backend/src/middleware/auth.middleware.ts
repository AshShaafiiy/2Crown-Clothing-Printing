import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../store/db';
import { User } from '../schemas';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-development-key';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = db.users.find(u => u.id === decoded.id && u.active);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
