"use client";
import { PasswordInput } from '../../components/ui/PasswordInput';
import { PasswordStrengthMeter } from '../../components/ui/PasswordStrengthMeter';
import { evaluatePasswordStrength } from '../../utils/passwordPolicy';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { services } from '../../services';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully.');
    } catch (err: any) {
      setProfileMsg({ text: err.message === 'Validation Error' ? 'Please correct the highlighted fields.' : (err.message || err.data?.error) || 'Unable to update your profile. Please try again.', type: 'error' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePwdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSaving(true);
    
    const strength = evaluatePasswordStrength(pwdData.newPassword);
    if (!strength.isStrongEnough) {
      toast.error('Password is too weak. ' + strength.feedback.join('. '));
      setPwdSaving(false);
      return;
    }
    
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      toast.error('Passwords do not match.');
      setPwdSaving(false);
      return;
    }
    
    try {
      await services.auth.changePassword(pwdData.currentPassword, pwdData.newPassword);
      toast.success('Password changed successfully.');
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message === 'Validation Error' ? 'Please correct the highlighted fields.' : (err.message || err.data?.error || 'Current password is incorrect.'));
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-6 uppercase tracking-wide border-b pb-2">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                id="profile-name"
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                id="profile-email"
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                id="profile-phone"
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="profile-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                id="profile-role"
                type="text"
                disabled
                value={user.role.replace(/_/g, ' ').toUpperCase()}
                className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="profile-status" className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <input
                id="profile-status"
                type="text"
                disabled
                value={user.active ? 'Active' : 'Disabled'}
                className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-6 uppercase tracking-wide border-b pb-2">Change Password</h2>
        <form onSubmit={handlePwdSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
              <PasswordInput
                id="currentPassword"
                required
                value={pwdData.currentPassword}
                onChange={e => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                wrapperClassName="w-full md:w-1/2"
                className="w-full px-4 py-2 border rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
              <PasswordInput
                id="newPassword"
                required
                minLength={8}
                value={pwdData.newPassword}
                onChange={e => setPwdData({ ...pwdData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus-visible:ring-primary focus:border-primary"
              />
              {pwdData.newPassword && (
                <PasswordStrengthMeter password={pwdData.newPassword} />
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password *</label>
              <PasswordInput
                id="confirmPassword"
                required
                minLength={8}
                value={pwdData.confirmPassword}
                onChange={e => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus-visible:ring-primary focus:border-primary"
              />
              {pwdData.newPassword && pwdData.confirmPassword && (
                <p className={`text-xs mt-1 ${pwdData.newPassword === pwdData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {pwdData.newPassword === pwdData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={pwdSaving}
              className="px-6 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              {pwdSaving ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
