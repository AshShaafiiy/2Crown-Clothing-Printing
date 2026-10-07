import { Role, User } from '../schemas';
import { normalizeTimestamp } from './date';

export const STAFF_ROLES: Role[] = ['root_super_admin', 'super_admin', 'admin'];
export const MANAGER_ROLES: Role[] = ['root_super_admin', 'super_admin'];

export const adminDto = (user: User) => ({
  id: user.id, email: user.email, name: user.name, role: user.role,
  phone: user.phone, 
  createdAt: normalizeTimestamp(user.createdAt), 
  active: user.active, 
  lastLogin: normalizeTimestamp(user.lastLogin)
});
