import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, StorageKeys } from '@/utils/storage';
import type { CopyTradingConfig, CopiedPosition } from '@/types/copyTrading';

interface CopyTradingState {
  configs: Record<string, CopyTradingConfig>;
  copiedPositions: Record<string, CopiedPosition>;
  lastKnownPositions: Record<string, string[]>;

  setConfig: (cfg: CopyTradingConfig) => void;
  removeConfig: (traderAddress: string) => void;
  toggleEnabled: (traderAddress: string) => void;
  addCopiedPosition: (pos: CopiedPosition) => void;
  removeCopiedPosition: (id: string) => void;
  updateLastKnown: (traderAddress: string, symbols: string[]) => void;
  getActiveConfigs: () => CopyTradingConfig[];
}

export const useCopyTradingStore = create<CopyTradingState>()(
  persist(
    (set, get) => ({
      configs: {},
      copiedPositions: {},
      lastKnownPositions: {},

      setConfig: (cfg) =>
        set((s) => ({ configs: { ...s.configs, [cfg.traderAddress]: cfg } })),

      removeConfig: (traderAddress) =>
        set((s) => {
          const configs = { ...s.configs };
          delete configs[traderAddress];
          const lastKnownPositions = { ...s.lastKnownPositions };
          delete lastKnownPositions[traderAddress];
          return { configs, lastKnownPositions };
        }),

      toggleEnabled: (traderAddress) =>
        set((s) => {
          const cfg = s.configs[traderAddress];
          if (!cfg) return s;
          return {
            configs: {
              ...s.configs,
              [traderAddress]: { ...cfg, isEnabled: !cfg.isEnabled, updatedAt: Date.now() },
            },
          };
        }),

      addCopiedPosition: (pos) =>
        set((s) => ({ copiedPositions: { ...s.copiedPositions, [pos.id]: pos } })),

      removeCopiedPosition: (id) =>
        set((s) => {
          const copiedPositions = { ...s.copiedPositions };
          const pos = copiedPositions[id];
          if (pos) copiedPositions[id] = { ...pos, isOpen: false };
          return { copiedPositions };
        }),

      updateLastKnown: (traderAddress, symbols) =>
        set((s) => ({
          lastKnownPositions: { ...s.lastKnownPositions, [traderAddress]: symbols },
        })),

      getActiveConfigs: () =>
        Object.values(get().configs).filter((c) => c.isEnabled),
    }),
    {
      name: StorageKeys.copyTrading,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
