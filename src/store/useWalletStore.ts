import { create } from 'zustand';
import type { Balance, WalletSnapshot } from '@/types/wallet';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  snapshot: WalletSnapshot | null;
  balances: Balance[];

  setAddress: (address: string | null) => void;
  setConnected: (v: boolean) => void;
  setSnapshot: (s: WalletSnapshot | null) => void;
  setBalances: (b: Balance[]) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  address: null,
  isConnected: false,
  snapshot: null,
  balances: [],

  setAddress: (address) => set({ address }),
  setConnected: (isConnected) => set({ isConnected }),
  setSnapshot: (snapshot) => set({ snapshot }),
  setBalances: (balances) => set({ balances }),
  disconnect: () => set({ address: null, isConnected: false, snapshot: null, balances: [] }),
}));
