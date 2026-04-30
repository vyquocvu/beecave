import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV({ id: 'perpdex-storage' });

export const storage = {
  getString: (key: string) => mmkv.getString(key),
  setString: (key: string, value: string) => mmkv.set(key, value),
  getNumber: (key: string) => mmkv.getNumber(key),
  setNumber: (key: string, value: number) => mmkv.set(key, value),
  getBoolean: (key: string) => mmkv.getBoolean(key),
  setBoolean: (key: string, value: boolean) => mmkv.set(key, value),
  delete: (key: string) => mmkv.delete(key),
  clearAll: () => mmkv.clearAll(),

  getJSON<T>(key: string): T | undefined {
    const raw = mmkv.getString(key);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  },

  setJSON<T>(key: string, value: T) {
    mmkv.set(key, JSON.stringify(value));
  },
};

// Zustand persist adapter
export const zustandStorage = {
  setItem: (name: string, value: string) => mmkv.set(name, value),
  getItem: (name: string) => mmkv.getString(name) ?? null,
  removeItem: (name: string) => mmkv.delete(name),
};

export const StorageKeys = {
  favorites: 'app.favorites',
  recentSymbols: 'app.recentSymbols',
  theme: 'app.theme',
  protocol: 'app.protocol',
  onboardingComplete: 'app.onboardingComplete',
} as const;
