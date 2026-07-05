import * as SecureStore from 'expo-secure-store';

export const storage = {
  getString: (key: string) => SecureStore.getItemAsync(key),
  setString: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  getNumber: async (key: string) => {
    const val = await SecureStore.getItemAsync(key);
    return val ? Number(val) : undefined;
  },
  setNumber: (key: string, value: number) => SecureStore.setItemAsync(key, String(value)),
  getBoolean: async (key: string) => {
    const val = await SecureStore.getItemAsync(key);
    return val ? val === 'true' : undefined;
  },
  setBoolean: (key: string, value: boolean) => SecureStore.setItemAsync(key, String(value)),
  delete: (key: string) => SecureStore.deleteItemAsync(key),

  async getJSON<T>(key: string): Promise<T | undefined> {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  },

  setJSON<T>(key: string, value: T) {
    return SecureStore.setItemAsync(key, JSON.stringify(value));
  },
};

export const zustandStorage = {
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  getItem: (name: string) => SecureStore.getItemAsync(name),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export const StorageKeys = {
  favorites: 'app.favorites',
  recentSymbols: 'app.recentSymbols',
  theme: 'app.theme',
  protocol: 'app.protocol',
  onboardingComplete: 'app.onboardingComplete',
  leaderboard: 'app.leaderboard',
  copyTrading: 'app.copyTrading',
} as const;
