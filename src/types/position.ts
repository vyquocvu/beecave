import type { OrderSide } from './order';

export interface Position {
  symbol: string;
  side: OrderSide;
  size: string; // absolute value; use `side` for direction
  entryPrice: string;
  markPrice: string;
  liquidationPrice: string | null;
  unrealizedPnl: string;
  realizedPnl?: string;
  leverage: number;
  marginMode: 'cross' | 'isolated';
  marginUsed: string;
  notional: string;
  roe: string; // return on equity (%)
  openedAt?: number;
  fundingAccrued?: string;
}
