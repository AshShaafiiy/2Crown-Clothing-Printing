"use client";
import { PasswordInput } from '../../components/ui/PasswordInput';
import { PasswordStrengthMeter } from '../../components/ui/PasswordStrengthMeter';
import { evaluatePasswordStrength } from '../../utils/passwordPolicy';
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { toast } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { services } from '../../services';
import { User } from '../../domain/models';
import { AdminSearch } from '../../components/admin/AdminSearch';

const Administrators: React.FC = () => {
  const { confirm } = useConfirm();
  const { user } = useAuthStore();
  
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<User> & { password?: string, confirmPassword?: string }>({
    name: '',
    email: '',
    role: 'admin',
    active: true
  });
  
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await services.rbac.getUsers();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      name: '', email: '', role: 'admin', password: '', confirmPassword: '', active: true
    });
    setFormError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin: User) => {
    setModalMode('edit');
    setFormData({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active ?? true
    });
    setFormError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    setSuccessMessage(null);
    
    if (!formData.name || !formData.email) {
      return setFormError('Name and email are required');
    }

    if (modalMode === 'create') {
      if (!formData.password) return setFormError('Password is required');
      
      const strength = evaluatePasswordStrength(formData.password);
      if (!strength.isStrongEnough) {
        return setFormError('Password is too weak. ' + strength.feedback.join('. '));
      }
      
      if (formData.password !== formData.confirmPassword) return setFormError('Passwords do not match');
    }

    setIsSaving(true);
    try {
      if (modalMode === 'create') {
        if (!user) return;
        await services.rbac.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: true,
          password: formData.password
        } as any, user);
        setSuccessMessage('Administrator created successfully');
      } else {
        if (!user || !formData.id || !formData.role) return;
        await services.rbac.updateUserRole(formData.id, formData.role, user);
        setSuccessMessage('Administrator updated successfully');
      }
      
      await fetchAdmins();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save administrator');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (admin: User) => {
    if (admin.role === 'root_super_admin') {
      return toast.error('Root super admin cannot be disabled');
    }
    
    const isConfirmed = await confirm({
      title: `${admin.active ? 'Disable' : 'Enable'} Administrator`,
      message: `Are you sure you want to ${admin.active ? 'disable' : 'enable'} ${admin.name}?`,
      confirmLabel: `${admin.active ? 'Disable' : 'Enable'} Administrator`,
      isDestructive: admin.active
    });
    if (isConfirmed && user) {
      try {
        await services.rbac.updateUserStatus(admin.id, !admin.active, user);
        fetchAdmins();
      } catch (err: any) {
        toast.error(err.message || 'Failed to update status');
      }
    }
  };

  const handleDelete = async (admin: User) => {
    if (admin.role === 'root_super_admin') {
      return toast.error('Root super admin cannot be deleted');
    }
    
    if (admin.id === user?.id) {
      return toast.error('You cannot delete yourself');
    }

    const isConfirmed = await confirm({
      title: 'Delete Administrator',
      message: `Are you sure you want to delete ${admin.name}? This action cannot be undone.`,
      confirmLabel: 'Delete Administrator',
      isDestructive: true
    });

    if (isConfirmed && user) {
      try {
        await services.rbac.deleteUser(admin.id, user);
        fetchAdmins();
        toast.success('Administrator deleted successfully');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete administrator');
      }
    }
  };

  const filteredAdmins = admins.filter(a => {
    const term = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system access and roles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink">
          <div className="flex-1 w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
            <AdminSearch 
            placeholder="Search administrators by name or email..." 
            value={searchQuery} 
            onChange={setSearchQuery} 
          />
          </div>
          {(user?.role === 'root_super_admin' || user?.role === 'super_admin') && (
            <button 
              onClick={handleOpenCreate} 
              className="bg-primary text-secondary px-4 py-2 rounded shadow hover:bg-primary/90 font-medium whitespace-nowrap"
            >
              Add Administrator
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200 whitespace-nowrap">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Administrator</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Role</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Created</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Last Login</th>
                <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No administrators found.</td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No administrators found matching your search.</td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const isRoot = admin.role === 'root_super_admin';
                  const isSelf = admin.id === user?.id;
                  
                  const canModify = user?.role === 'root_super_admin' 
                    ? !isRoot 
                    : (user?.role === 'super_admin' ? admin.role === 'admin' : false);
                  
                  return (
                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{admin.name} {isSelf && <span className="text-gray-400 font-normal ml-1">(You)</span>}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded ${
                          isRoot ? 'bg-purple-100 text-purple-800' : 
                          admin.role === 'super_admin' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {admin.role.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded ${(admin.active ?? true) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {(admin.active ?? true) ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Date unavailable'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!isRoot && canModify && !isSelf && (
                          <div className="flex justify-end gap-3">
                            <button onClick={() => handleToggleStatus(admin)} className="text-gray-500 hover:text-gray-900 transition-colors">
                              {(admin.active ?? true) ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => handleOpenEdit(admin)} className="text-gray-500 hover:text-blue-600 transition-colors">Edit</button>
                            <button onClick={() => handleDelete(admin)} className="text-gray-500 hover:text-red-600 transition-colors">Delete</button>
                          </div>
                        )}
                        {isRoot && <span className="text-gray-400 italic text-xs bg-gray-100 px-2 py-1 rounded">Protected</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              {modalMode === 'create' ? 'Add Administrator' : 'Edit Administrator'}
            </h2>
            
            {formError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{formError}</p>}
            {successMessage && <p className="text-green-700 text-sm mb-4 bg-green-50 p-2 rounded">{successMessage}</p>}
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
                <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={modalMode === 'edit'} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                <input type="email" className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={modalMode === 'edit'} />
              </div>
              
              {modalMode === 'create' && (
                <>
                  <div>
                    <label htmlFor="adminPassword" className="block text-sm font-medium mb-1 text-gray-700">Password *</label>
                    <PasswordInput id="adminPassword" required className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <PasswordStrengthMeter password={formData.password} />
                  </div>
                  <div>
                    <label htmlFor="adminConfirmPassword" className="block text-sm font-medium mb-1 text-gray-700">Confirm Password *</label>
                    <PasswordInput id="adminConfirmPassword" required className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary outline-none" value={formData.confirmPassword || ''} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                    )}
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Role *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary outline-none" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value as User['role']})}
                  disabled={user?.role !== 'root_super_admin'}
                >
                  <option value="admin">Admin</option>
                  {user?.role === 'root_super_admin' && <option value="super_admin">Super Admin</option>}
                </select>
                {user?.role !== 'root_super_admin' && (
                  <p className="text-xs text-gray-500 mt-1">Only Root Super Admin can modify roles.</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSaving}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-secondary rounded hover:bg-primary/90 font-medium flex items-center transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrators;
