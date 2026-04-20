import { create } from 'zustand';
import type { Market, Orderbook, Candle } from '@/types/market';
import { DEFAULT_SYMBOL } from '@/constants/markets';

interface MarketState {
  markets: Market[];
  selectedSymbol: string;
  prices: Record<string, string>;
  orderbooks: Record<string, Orderbook>;
  candles: Record<string, Candle[]>;

  setMarkets: (m: Market[]) => void;
  setSelectedSymbol: (s: string) => void;
  updatePrice: (symbol: string, price: string) => void;
  updatePrices: (prices: Record<string, string>) => void;
  updateOrderbook: (symbol: string, ob: Orderbook) => void;
  updateCandles: (symbol: string, candles: Candle[]) => void;
  getMarket: (symbol: string) => Market | undefined;
}

export const useMarketStore = create<MarketState>()((set, get) => ({
  markets: [],
  selectedSymbol: DEFAULT_SYMBOL,
  prices: {},
  orderbooks: {},
  candles: {},

  setMarkets: (markets) => set({ markets }),
  setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
  updatePrice: (symbol, price) =>
    set((state) => ({ prices: { ...state.prices, [symbol]: price } })),
  updatePrices: (prices) => set((state) => ({ prices: { ...state.prices, ...prices } })),
  updateOrderbook: (symbol, ob) =>
    set((state) => ({ orderbooks: { ...state.orderbooks, [symbol]: ob } })),
  updateCandles: (symbol, candles) =>
    set((state) => ({ candles: { ...state.candles, [symbol]: candles } })),
  getMarket: (symbol) => get().markets.find((m) => m.symbol === symbol),
}));
