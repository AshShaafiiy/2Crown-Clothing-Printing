"use client";
import { create } from 'zustand';
import { BusinessSettings } from '../domain/models';
import { services } from '../services';

interface SettingsState {
  settings: BusinessSettings | null;
  loading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const data = await services.settings.getBusinessSettings();
      set({ settings: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  }
}));
