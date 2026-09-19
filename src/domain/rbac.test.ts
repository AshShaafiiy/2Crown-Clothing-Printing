import { describe, it, expect } from 'vitest';
import { hasAtLeastRole, canManageUser, canDeleteUser, canAssignRole } from './rbac';

describe('RBAC Logic', () => {
  describe('hasAtLeastRole', () => {
    it('should correctly validate if user has at least the required role', () => {
      expect(hasAtLeastRole('root_super_admin', 'super_admin')).toBe(true);
      expect(hasAtLeastRole('super_admin', 'admin')).toBe(true);
      expect(hasAtLeastRole('admin', 'customer')).toBe(true);
      
      expect(hasAtLeastRole('admin', 'admin')).toBe(true);
      
      expect(hasAtLeastRole('customer', 'admin')).toBe(false);
      expect(hasAtLeastRole('admin', 'root_super_admin')).toBe(false);
    });
  });

  describe('canManageUser', () => {
    it('root_super_admin can manage anyone', () => {
      expect(canManageUser('root_super_admin', 'super_admin')).toBe(true);
      expect(canManageUser('root_super_admin', 'admin')).toBe(true);
      expect(canManageUser('root_super_admin', 'customer')).toBe(true);
      expect(canManageUser('root_super_admin', 'root_super_admin')).toBe(true);
    });

    it('super_admin can manage admin and customer, but not root or super_admin', () => {
      expect(canManageUser('super_admin', 'admin')).toBe(true);
      expect(canManageUser('super_admin', 'customer')).toBe(true);
      
      expect(canManageUser('super_admin', 'super_admin')).toBe(false);
      expect(canManageUser('super_admin', 'root_super_admin')).toBe(false);
    });

    it('admin can manage customer only', () => {
      expect(canManageUser('admin', 'customer')).toBe(true);
      
      expect(canManageUser('admin', 'admin')).toBe(false);
      expect(canManageUser('admin', 'super_admin')).toBe(false);
      expect(canManageUser('admin', 'root_super_admin')).toBe(false);
    });
  });

  describe('canDeleteUser (Root Protection)', () => {
    it('no one can delete a root_super_admin, not even another root', () => {
      expect(canDeleteUser('root_super_admin', 'root_super_admin')).toBe(false);
      expect(canDeleteUser('super_admin', 'root_super_admin')).toBe(false);
    });

    it('root_super_admin can delete anyone else', () => {
      expect(canDeleteUser('root_super_admin', 'super_admin')).toBe(true);
      expect(canDeleteUser('root_super_admin', 'admin')).toBe(true);
      expect(canDeleteUser('root_super_admin', 'customer')).toBe(true);
    });

    it('super_admin can delete admin and customer', () => {
      expect(canDeleteUser('super_admin', 'admin')).toBe(true);
      expect(canDeleteUser('super_admin', 'customer')).toBe(true);
      
      expect(canDeleteUser('super_admin', 'super_admin')).toBe(false);
    });
  });

  describe('canAssignRole', () => {
    it('root_super_admin can assign any role', () => {
      expect(canAssignRole('root_super_admin', 'root_super_admin')).toBe(true);
      expect(canAssignRole('root_super_admin', 'super_admin')).toBe(true);
      expect(canAssignRole('root_super_admin', 'admin')).toBe(true);
      expect(canAssignRole('root_super_admin', 'customer')).toBe(true);
    });

    it('super_admin can only assign admin and customer', () => {
      expect(canAssignRole('super_admin', 'admin')).toBe(true);
      expect(canAssignRole('super_admin', 'customer')).toBe(true);
      
      expect(canAssignRole('super_admin', 'super_admin')).toBe(false);
      expect(canAssignRole('super_admin', 'root_super_admin')).toBe(false);
    });

    it('admin can only assign customer', () => {
      expect(canAssignRole('admin', 'customer')).toBe(true);
      
      expect(canAssignRole('admin', 'admin')).toBe(false);
      expect(canAssignRole('admin', 'super_admin')).toBe(false);
      expect(canAssignRole('admin', 'root_super_admin')).toBe(false);
    });
  });
});
