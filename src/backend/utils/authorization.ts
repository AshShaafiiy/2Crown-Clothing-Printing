import { RequestHandler } from 'express';
import { Role, User } from '../schemas';

export const STAFF_ROLES: Role[] = ['root_super_admin', 'super_admin', 'admin'];
export const MANAGER_ROLES: Role[] = ['root_super_admin', 'super_admin'];
export const requireRoles = (...roles: Role[]): RequestHandler => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    return;
  }
  next();
};
export const adminDto = (user: User) => ({
  id: user.id, email: user.email, name: user.name, role: user.role,
  phone: user.phone, createdAt: user.createdAt, active: user.active, lastLogin: user.lastLogin
});
