import type { Protocol } from './protocol';

export interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  protocol: Protocol;
  protocolMarketId?: string | number;
  markPrice: string;
  indexPrice?: string;
  prevDayPrice?: string;
  change24hPct: number;
  volume24h: string;
  openInterest: string;
  fundingRate: string;
  nextFundingTime?: number;
  maxLeverage: number;
  pricePrecision: number;
  sizePrecision: number;
  minSize: string;
  isActive: boolean;
}

export interface Candle {
  time: number; // epoch seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type CandleInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface OrderbookLevel {
  price: string;
  size: string;
  total?: string;
  count?: number;
}

export interface Orderbook {
  symbol: string;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  markPrice?: string;
  spread?: string;
  time: number;
}

export interface Trade {
  id: string;
  symbol: string;
  price: string;
  size: string;
  side: 'buy' | 'sell';
  time: number;
}

export interface FundingRate {
  symbol: string;
  rate: string;
  intervalHours: number;
  nextFundingTime: number;
}
