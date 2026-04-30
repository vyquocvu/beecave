import type { Protocol } from '@/types/protocol';
import { PROTOCOLS } from '@/constants/protocols';
import { toNumber } from './format';

export function calcNotional(size: number | string, price: number | string): number {
  return toNumber(size) * toNumber(price);
}

export function calcInitialMargin(
  size: number | string,
  price: number | string,
  leverage: number,
): number {
  if (leverage <= 0) return 0;
  return (toNumber(size) * toNumber(price)) / leverage;
}

export function calcLiquidationPrice(
  side: 'long' | 'short',
  entryPrice: number | string,
  leverage: number,
  maintenanceMarginRate = 0.005,
): number {
  const entry = toNumber(entryPrice);
  if (entry <= 0 || leverage <= 0) return 0;
  const invLev = 1 / leverage;
  return side === 'long'
    ? entry * (1 - invLev + maintenanceMarginRate)
    : entry * (1 + invLev - maintenanceMarginRate);
}

export function calcUnrealizedPnl(
  side: 'long' | 'short',
  size: number | string,
  entryPrice: number | string,
  markPrice: number | string,
): number {
  const s = toNumber(size);
  const diff = toNumber(markPrice) - toNumber(entryPrice);
  return side === 'long' ? s * diff : -s * diff;
}

export function calcRoe(unrealizedPnl: number, margin: number): number {
  if (margin <= 0) return 0;
  return (unrealizedPnl / margin) * 100;
}

export function calcFee(
  notional: number | string,
  protocol: Protocol,
  isTaker = true,
): number {
  const config = PROTOCOLS[protocol];
  const rate = isTaker ? config.takerFee : config.makerFee;
  return toNumber(notional) * rate;
}

export function calcPctChange(current: number | string, previous: number | string): number {
  const prev = toNumber(previous);
  if (prev === 0) return 0;
  return ((toNumber(current) - prev) / prev) * 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function roundToTick(price: number, tickSize: number): number {
  if (tickSize <= 0) return price;
  return Math.round(price / tickSize) * tickSize;
}

export function buildOrderbookWithTotals(
  levels: Array<{ price: string; size: string }>,
): Array<{ price: string; size: string; total: string }> {
  let running = 0;
  return levels.map((l) => {
    running += toNumber(l.size);
    return { ...l, total: running.toFixed(6) };
  });
}

export function calcSpread(
  bestBid: number | string | undefined,
  bestAsk: number | string | undefined,
): { absolute: number; pct: number } {
  const bid = toNumber(bestBid);
  const ask = toNumber(bestAsk);
  if (!bid || !ask) return { absolute: 0, pct: 0 };
  const absolute = ask - bid;
  const mid = (ask + bid) / 2;
  return { absolute, pct: mid ? (absolute / mid) * 100 : 0 };
}
