import { describe, it, expect, beforeEach } from 'vitest';
import { services } from '../index';

describe('Settings Service (Mock)', () => {
  beforeEach(async () => {
    // Reset settings to known state
    await services.settings.updateBusinessSettings({
      storeName: '2Crown Clothing & Printing',
      contactEmail: 'info@2crown.com.ng',
      contactPhone: '09061747646',
      whatsappNumber: '09061747646',
      address: 'Ikeja, Lagos, Nigeria',
      currency: 'NGN',
    });
  });

  it('can get business settings', async () => {
    const settings = await services.settings.getBusinessSettings();
    expect(settings).toBeDefined();
    expect(settings.storeName).toBe('2Crown Clothing & Printing');
    expect(settings.currency).toBe('NGN');
  });

  it('can update store name and persist', async () => {
    await services.settings.updateBusinessSettings({ storeName: 'New Name' });
    const settings = await services.settings.getBusinessSettings();
    expect(settings.storeName).toBe('New Name');
  });

  it('can update contact email and persist', async () => {
    await services.settings.updateBusinessSettings({ contactEmail: 'test@example.com' });
    const settings = await services.settings.getBusinessSettings();
    expect(settings.contactEmail).toBe('test@example.com');
  });

  it('can update contact phone and persist', async () => {
    await services.settings.updateBusinessSettings({ contactPhone: '+23480000000' });
    const settings = await services.settings.getBusinessSettings();
    expect(settings.contactPhone).toBe('+23480000000');
  });

  it('can update address and persist', async () => {
    await services.settings.updateBusinessSettings({ address: 'New Address, Abuja' });
    const settings = await services.settings.getBusinessSettings();
    expect(settings.address).toBe('New Address, Abuja');
  });

  it('can update whatsapp number and persist', async () => {
    await services.settings.updateBusinessSettings({ whatsappNumber: '08000000000' });
    const settings = await services.settings.getBusinessSettings();
    expect(settings.whatsappNumber).toBe('08000000000');
  });
});
