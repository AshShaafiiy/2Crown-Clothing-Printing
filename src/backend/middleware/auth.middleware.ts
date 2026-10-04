import { Request, Response, NextFunction } from 'express';
import { auth } from '../db/firebase';
import { userRepository } from '../repositories';
import { User } from '../schemas';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      decodedToken?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    const user = await userRepository.findByEmail(decoded.email || '');
    
    if (!user || !user.active) {
      return res.status(401).json({ error: 'Unauthorized: User not found or inactive' });
    }

    // Ensure the custom claims role matches the DB
    if (decoded.role && decoded.role !== user.role) {
      await auth.setCustomUserClaims(decoded.uid, { role: user.role });
    } else if (!decoded.role) {
      await auth.setCustomUserClaims(decoded.uid, { role: user.role });
    }

    req.user = user;
    req.decodedToken = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
