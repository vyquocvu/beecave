import type { OrderSide } from './order';

export interface CopyTradingConfig {
  traderAddress: string;
  label?: string;
  isEnabled: boolean;
  sizeRatio: number;
  maxLeverage: number;
  maxOpenPositions: number;
  createdAt: number;
  updatedAt: number;
}

export interface CopiedPosition {
  id: string;
  traderAddress: string;
  symbol: string;
  side: OrderSide;
  size: string;
  entryPrice: string;
  originalSize: string;
  appliedLeverage: number;
  copiedAt: number;
  isOpen: boolean;
}
