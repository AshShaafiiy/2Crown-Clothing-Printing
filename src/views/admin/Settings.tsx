"use client";
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { toast } from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { services } from '../../services';

const Settings: React.FC = () => {
  const { confirm } = useConfirm();
  const [settings, setSettings] = useState({
    storeName: '',
    currency: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    
    services.settings.getBusinessSettings().then(data => {
      setSettings(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError(err.message || "An error occurred");
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'currency') {
      const symbols: Record<string, string> = { NGN: '₦' };
      setSettings(prev => ({ ...prev, [name]: value, currencySymbol: symbols[value] || '₦' }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    services.settings.updateBusinessSettings(settings as any).then(() => {
      setSaving(false);
      toast.success('Settings saved successfully.');
    }).catch(err => {
      console.error(err);
      setSaving(false);
      toast.error('Failed to save settings.');
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Business Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label htmlFor="settings-store-name" className="block text-sm font-medium text-gray-700">Store Name *</label>
            <input 
              id="settings-store-name"
              type="text" 
              name="storeName" 
              required
              maxLength={100}
              value={settings.storeName} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus-visible:ring-primary sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="settings-currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="settings-currency"
              name="currency"
              required
              value={settings.currency}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus-visible:ring-primary sm:text-sm p-2 border bg-white"
            >
              <option value="NGN">NGN — Nigerian Naira (₦)</option>
            </select>
          </div>
          <div>
            <label htmlFor="settings-contact-email" className="block text-sm font-medium text-gray-700">Contact Email *</label>
            <input 
              id="settings-contact-email"
              type="email" 
              name="contactEmail" 
              required
              maxLength={255}
              value={settings.contactEmail} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus-visible:ring-primary sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="settings-contact-phone" className="block text-sm font-medium text-gray-700">Contact Phone *</label>
            <input 
              id="settings-contact-phone"
              type="text" 
              name="contactPhone" 
              required
              maxLength={50}
              value={settings.contactPhone} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus-visible:ring-primary sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="settings-whatsapp-number" className="block text-sm font-medium text-gray-700">WhatsApp Number *</label>
            <input
              id="settings-whatsapp-number"
              type="text"
              name="whatsappNumber"
              required
              maxLength={50}
              value={settings.whatsappNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus-visible:ring-primary sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="settings-address" className="block text-sm font-medium text-gray-700">Business Address *</label>
            <textarea
              id="settings-address"
              name="address"
              required
              maxLength={255}
              rows={3}
              value={settings.address}
              onChange={(e) => handleChange(e as any)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus-visible:ring-primary sm:text-sm p-2 border"
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-primary text-secondary px-4 py-2 rounded shadow hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
