import React, { useEffect, useState } from 'react';
import { services } from '../../services/mock';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    currency: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // @ts-ignore
    services.settings.getSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Business Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input 
              type="text" 
              name="storeName" 
              value={settings.storeName} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <input 
              type="text" 
              name="currency" 
              value={settings.currency} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input 
              type="email" 
              name="contactEmail" 
              value={settings.contactEmail} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input 
              type="text" 
              name="contactPhone" 
              value={settings.contactPhone} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
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
