import { create } from 'zustand';
import type { OrderSide, OrderType } from '@/types/order';
import { calcInitialMargin, calcLiquidationPrice } from '@/utils/math';
import { toNumber } from '@/utils/format';
import { DEFAULT_SYMBOL } from '@/constants/markets';

interface TradeState {
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  price: string;
  size: string;
  leverage: number;
  reduceOnly: boolean;
  tpPrice: string;
  slPrice: string;
  triggerPrice: string;

  // Derived
  notional: number;
  margin: number;
  liquidationPrice: number;

  setSymbol: (s: string) => void;
  setSide: (s: OrderSide) => void;
  setOrderType: (t: OrderType) => void;
  setPrice: (p: string) => void;
  setSize: (s: string) => void;
  setSizePercent: (pct: number, availableBalance: number) => void;
  setLeverage: (l: number) => void;
  setReduceOnly: (v: boolean) => void;
  setTPPrice: (p: string) => void;
  setSLPrice: (p: string) => void;
  setTriggerPrice: (p: string) => void;
  reset: () => void;
}

function recompute(state: Partial<TradeState>): Partial<TradeState> {
  const price = toNumber(state.price);
  const size = toNumber(state.size);
  const leverage = state.leverage ?? 1;
  const side = state.side ?? 'long';
  const notional = price * size;
  const margin = calcInitialMargin(size, price, leverage);
  const liquidationPrice = price > 0 ? calcLiquidationPrice(side, price, leverage) : 0;
  return { notional, margin, liquidationPrice };
}

const initial = {
  symbol: DEFAULT_SYMBOL,
  side: 'long' as OrderSide,
  orderType: 'limit' as OrderType,
  price: '',
  size: '',
  leverage: 10,
  reduceOnly: false,
  tpPrice: '',
  slPrice: '',
  triggerPrice: '',
  notional: 0,
  margin: 0,
  liquidationPrice: 0,
};

export const useTradeStore = create<TradeState>()((set, get) => ({
  ...initial,

  setSymbol: (symbol) => set({ symbol, price: '', size: '' }),
  setSide: (side) => set((s) => ({ ...s, side, ...recompute({ ...s, side }) })),
  setOrderType: (orderType) => set({ orderType }),
  setPrice: (price) => set((s) => ({ ...s, price, ...recompute({ ...s, price }) })),
  setSize: (size) => set((s) => ({ ...s, size, ...recompute({ ...s, size }) })),
  setSizePercent: (pct, availableBalance) => {
    const price = toNumber(get().price);
    const leverage = get().leverage;
    if (!price || !availableBalance) return;
    const maxNotional = availableBalance * leverage;
    const size = ((maxNotional * pct) / price).toFixed(4);
    set((s) => ({ ...s, size, ...recompute({ ...s, size }) }));
  },
  setLeverage: (leverage) => set((s) => ({ ...s, leverage, ...recompute({ ...s, leverage }) })),
  setReduceOnly: (reduceOnly) => set({ reduceOnly }),
  setTPPrice: (tpPrice) => set({ tpPrice }),
  setSLPrice: (slPrice) => set({ slPrice }),
  setTriggerPrice: (triggerPrice) => set({ triggerPrice }),
  reset: () => set(initial),
}));
