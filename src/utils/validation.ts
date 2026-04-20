import type { OrderParams } from '@/types/order';
import { toNumber } from './format';

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateOrder(
  params: OrderParams,
  opts: {
    availableBalance?: number;
    minSize?: number;
    maxLeverage?: number;
  } = {},
): ValidationResult {
  const size = toNumber(params.size);
  if (size <= 0) return { ok: false, error: 'Size must be greater than zero' };
  if (opts.minSize && size < opts.minSize) {
    return { ok: false, error: `Size must be at least ${opts.minSize}` };
  }

  if (params.orderType === 'limit' || params.orderType === 'stop-limit') {
    const price = toNumber(params.price);
    if (price <= 0) return { ok: false, error: 'Please enter a price' };
  }

  if (params.orderType === 'stop-limit' || params.orderType === 'stop-market') {
    const trigger = toNumber(params.triggerPrice);
    if (trigger <= 0) return { ok: false, error: 'Please enter a trigger price' };
  }

  if (params.leverage < 1) return { ok: false, error: 'Leverage must be at least 1x' };
  if (opts.maxLeverage && params.leverage > opts.maxLeverage) {
    return { ok: false, error: `Max leverage is ${opts.maxLeverage}x` };
  }

  if (params.tpPrice) {
    const tp = toNumber(params.tpPrice);
    const entry = toNumber(params.price);
    if (entry > 0) {
      if (params.side === 'long' && tp <= entry) {
        return { ok: false, error: 'TP must be above entry for long' };
      }
      if (params.side === 'short' && tp >= entry) {
        return { ok: false, error: 'TP must be below entry for short' };
      }
    }
  }

  if (params.slPrice) {
    const sl = toNumber(params.slPrice);
    const entry = toNumber(params.price);
    if (entry > 0) {
      if (params.side === 'long' && sl >= entry) {
        return { ok: false, error: 'SL must be below entry for long' };
      }
      if (params.side === 'short' && sl <= entry) {
        return { ok: false, error: 'SL must be above entry for short' };
      }
    }
  }

  if (opts.availableBalance !== undefined) {
    const notional = size * toNumber(params.price);
    const margin = notional / params.leverage;
    if (margin > opts.availableBalance) {
      return { ok: false, error: 'Insufficient balance' };
    }
  }

  return { ok: true };
}

export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export function isNumericString(value: string): boolean {
  return /^-?\d*\.?\d*$/.test(value);
}
