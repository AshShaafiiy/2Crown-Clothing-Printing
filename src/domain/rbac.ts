import { User } from './models';

// Defines the hierarchy of roles. Higher number means more privileges.
export const RoleHierarchy: Record<User['role'], number> = {
  root_super_admin: 4,
  super_admin: 3,
  admin: 2,
  customer: 1,
};

/**
 * Checks if a user has at least the required role.
 */
export function hasAtLeastRole(userRole: User['role'], requiredRole: User['role']): boolean {
  return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}

/**
 * Validates if the current user can perform administrative actions on a target user.
 * - root_super_admin can manage anyone (except another root_super_admin's deletion/demotion which could be restricted, but typically they manage all).
 * - super_admin can manage admin and customer.
 * - admin can manage customer.
 */
export function canManageUser(currentUserRole: User['role'], targetUserRole: User['role']): boolean {
  // A root_super_admin can manage anyone, but might not be able to delete another root.
  // For simplicity, root can manage everyone.
  if (currentUserRole === 'root_super_admin') {
    return true;
  }
  
  // A user can only manage users with a strictly lower role
  return RoleHierarchy[currentUserRole] > RoleHierarchy[targetUserRole];
}

/**
 * Specific protection logic for root_super_admin accounts.
 * Root super admins cannot be deleted, deactivated, or modified by anyone except another root_super_admin.
 */
export function canDeleteUser(currentUserRole: User['role'], targetUserRole: User['role']): boolean {
  if (targetUserRole === 'root_super_admin') {
    return false; // Root accounts cannot be deleted, even by another root
  }
  return canManageUser(currentUserRole, targetUserRole);
}

/**
 * Checks if a user can assign a specific role to another user.
 * Users can only assign roles that are lower or equal to their own role.
 */
export function canAssignRole(currentUserRole: User['role'], roleToAssign: User['role']): boolean {
  if (currentUserRole === 'root_super_admin') return true;
  
  // Cannot assign a role higher than or equal to one's own role
  // e.g., super_admin cannot assign super_admin (or root_super_admin). They can only assign admin and below.
  return RoleHierarchy[currentUserRole] > RoleHierarchy[roleToAssign];
}
