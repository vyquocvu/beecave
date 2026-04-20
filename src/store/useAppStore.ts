import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, StorageKeys } from '@/utils/storage';
import { DEFAULT_PROTOCOL } from '@/constants/protocols';
import type { Protocol } from '@/types/protocol';

type Theme = 'dark' | 'light';

interface AppState {
  protocol: Protocol;
  theme: Theme;
  favorites: string[];
  recentSymbols: string[];
  onboardingComplete: boolean;

  setProtocol: (p: Protocol) => void;
  setTheme: (t: Theme) => void;
  toggleFavorite: (symbol: string) => void;
  addRecentSymbol: (symbol: string) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      protocol: DEFAULT_PROTOCOL,
      theme: 'dark',
      favorites: [],
      recentSymbols: [],
      onboardingComplete: false,

      setProtocol: (protocol) => set({ protocol }),
      setTheme: (theme) => set({ theme }),
      toggleFavorite: (symbol) => {
        const favorites = get().favorites;
        set({
          favorites: favorites.includes(symbol)
            ? favorites.filter((s) => s !== symbol)
            : [...favorites, symbol],
        });
      },
      addRecentSymbol: (symbol) => {
        const recents = get().recentSymbols.filter((s) => s !== symbol);
        set({ recentSymbols: [symbol, ...recents].slice(0, 10) });
      },
      completeOnboarding: () => set({ onboardingComplete: true }),
      reset: () =>
        set({
          protocol: DEFAULT_PROTOCOL,
          theme: 'dark',
          favorites: [],
          recentSymbols: [],
          onboardingComplete: false,
        }),
    }),
    {
      name: StorageKeys.protocol,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
