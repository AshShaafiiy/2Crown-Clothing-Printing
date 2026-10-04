import { db } from '../db/firebase';
import { BusinessSettings } from '../schemas';

export class SettingsRepository {
  async getSettings(): Promise<BusinessSettings> {
    const snap = await db.collection('business_settings').limit(1).get();
    if (snap.empty) {
      throw new Error('Business settings not initialized');
    }
    return snap.docs[0].data() as BusinessSettings;
  }

  async updateSettings(id: string, settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const updateData: any = { ...settings };
    
    // Safety against trying to change ID
    delete updateData.id;

    await db.collection('business_settings').doc(id).update(updateData);
    return this.getSettings();
  }
}

export const settingsRepository = new SettingsRepository();
