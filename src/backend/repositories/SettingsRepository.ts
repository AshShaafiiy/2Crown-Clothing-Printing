import { db } from '../db/firebase';
import { BusinessSettings } from '../schemas';

export class SettingsRepository {
  async getSettings(): Promise<BusinessSettings> {
    const snap = await db.collection('business_settings').limit(1).get();
    if (snap.empty) {
      return {
        id: 'config',
        storeName: '2Crown Clothing & Printing',
        contactEmail: 'contact@2crown.com',
        contactPhone: '+234 906 174 7646',
        whatsappNumber: '2349061747646',
        address: 'Nigeria',
        currency: 'NGN',
        currencySymbol: '₦',
        vatPercentage: 0,
        deliverySettings: { pickupFee: 0, localDeliveryBaseFee: 0, outOfStateBaseFee: 0 }
      };
    }
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as BusinessSettings;
  }

  async updateSettings(id: string, settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const updateData: any = { ...settings };
    delete updateData.id;

    // Use a fixed ID if none exists, else update the existing one
    const targetId = (id === 'default' || !id) ? 'config' : id;
    
    // We use set with merge: true so we don't fail if it doesn't exist
    await db.collection('business_settings').doc(targetId).set(updateData, { merge: true });
    
    return this.getSettings();
  }
}

export const settingsRepository = new SettingsRepository();
