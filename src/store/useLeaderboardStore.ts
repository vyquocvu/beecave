import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, StorageKeys } from '@/utils/storage';
import { LEADERBOARD_MAX_CUSTOM } from '@/constants/leaderboard';
import type { LeaderboardPeriod, LeaderboardSortKey } from '@/types/leaderboard';

interface LeaderboardState {
  period: LeaderboardPeriod;
  sortKey: LeaderboardSortKey;
  customAddresses: string[];

  setPeriod: (p: LeaderboardPeriod) => void;
  setSortKey: (k: LeaderboardSortKey) => void;
  addCustomAddress: (address: string) => void;
  removeCustomAddress: (address: string) => void;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      period: 'all',
      sortKey: 'equity',
      customAddresses: [],

      setPeriod: (period) => set({ period }),
      setSortKey: (sortKey) => set({ sortKey }),
      addCustomAddress: (address) => {
        const current = get().customAddresses;
        if (current.includes(address) || current.length >= LEADERBOARD_MAX_CUSTOM) return;
        set({ customAddresses: [...current, address] });
      },
      removeCustomAddress: (address) =>
        set({ customAddresses: get().customAddresses.filter((a) => a !== address) }),
    }),
    {
      name: StorageKeys.leaderboard,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ customAddresses: state.customAddresses }),
    },
  ),
);
