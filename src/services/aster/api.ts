import type {
  Market,
  Orderbook,
  Trade,
  Candle,
  CandleInterval,
  FundingRate,
} from '@/types/market';
import type { Order, OrderParams, OrderResult } from '@/types/order';
import type { Position } from '@/types/position';
import type { Balance, WalletSnapshot } from '@/types/wallet';
import type { ProtocolService, ProtocolWebSocket, WalletSigner } from '@/services/types';
import { PROTOCOLS } from '@/constants/protocols';
import { getJson, postJson } from '@/services/http';
import { APP_CONFIG } from '@/constants/config';
import { toNumber } from '@/utils/format';
import { buildOrderbookWithTotals, calcPctChange, calcSpread } from '@/utils/math';
import type {
  AsterMarketRaw,
  AsterOrderbookRaw,
  AsterPositionRaw,
  AsterOrderRaw,
  AsterCandleRaw,
  AsterOrderParams,
} from './types';
import { signAsterOrder, signAsterCancel } from './utils';
import { AsterWebSocket } from './websocket';

const CFG = PROTOCOLS.aster;

export class AsterService implements ProtocolService {
  async getMarkets(): Promise<Market[]> {
    const res = await getJson<{ markets: AsterMarketRaw[] } | AsterMarketRaw[]>(
      `${CFG.apiUrl}/v1/markets`,
    );
    const arr = Array.isArray(res) ? res : res.markets ?? [];
    return arr.map((m) => ({
      symbol: m.base_asset,
      baseAsset: m.base_asset,
      quoteAsset: m.quote_asset,
      protocol: 'aster',
      protocolMarketId: m.symbol,
      markPrice: m.mark_price,
      indexPrice: m.index_price,
      prevDayPrice: m.prev_day_price,
      change24hPct: calcPctChange(m.mark_price, m.prev_day_price),
      volume24h: m.volume_24h,
      openInterest: m.open_interest,
      fundingRate: m.funding_rate,
      nextFundingTime: m.next_funding_time,
      maxLeverage: m.max_leverage,
      pricePrecision: m.price_precision,
      sizePrecision: m.size_precision,
      minSize: m.min_size,
      isActive: m.is_active,
    }));
  }

  async getMarket(symbol: string): Promise<Market | null> {
    try {
      const m = await getJson<AsterMarketRaw>(`${CFG.apiUrl}/v1/ticker?symbol=${symbol}`);
      return {
        symbol: m.base_asset,
        baseAsset: m.base_asset,
        quoteAsset: m.quote_asset,
        protocol: 'aster',
        protocolMarketId: m.symbol,
        markPrice: m.mark_price,
        indexPrice: m.index_price,
        prevDayPrice: m.prev_day_price,
        change24hPct: calcPctChange(m.mark_price, m.prev_day_price),
        volume24h: m.volume_24h,
        openInterest: m.open_interest,
        fundingRate: m.funding_rate,
        nextFundingTime: m.next_funding_time,
        maxLeverage: m.max_leverage,
        pricePrecision: m.price_precision,
        sizePrecision: m.size_precision,
        minSize: m.min_size,
        isActive: m.is_active,
      };
    } catch {
      return null;
    }
  }

  async getOrderbook(symbol: string, depth = APP_CONFIG.orderbookDepth): Promise<Orderbook> {
    const res = await getJson<AsterOrderbookRaw>(
      `${CFG.apiUrl}/v1/orderbook?symbol=${symbol}&depth=${depth}`,
    );
    const bids = buildOrderbookWithTotals(
      (res.bids ?? []).map(([price, size]) => ({ price, size })),
    );
    const asks = buildOrderbookWithTotals(
      (res.asks ?? []).map(([price, size]) => ({ price, size })),
    );
    const spread = calcSpread(bids[0]?.price, asks[0]?.price);
    const mid =
      bids[0] && asks[0]
        ? ((toNumber(bids[0].price) + toNumber(asks[0].price)) / 2).toString()
        : '0';
    return {
      symbol,
      bids,
      asks,
      markPrice: mid,
      spread: spread.pct.toFixed(4),
      time: res.timestamp,
    };
  }

  async getRecentTrades(symbol: string, limit = 50): Promise<Trade[]> {
    try {
      const res = await getJson<
        Array<{ id: string; price: string; size: string; side: string; time: number }>
      >(`${CFG.apiUrl}/v1/trades?symbol=${symbol}&limit=${limit}`);
      return res.map((t) => ({
        id: t.id,
        symbol,
        price: t.price,
        size: t.size,
        side: t.side.toLowerCase() === 'buy' ? 'buy' : 'sell',
        time: t.time,
      }));
    } catch {
      return [];
    }
  }

  async getCandles(symbol: string, interval: CandleInterval, limit = 200): Promise<Candle[]> {
    try {
      const res = await getJson<AsterCandleRaw[]>(
        `${CFG.apiUrl}/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      );
      return res.map((c) => ({
        time: Math.floor(c.open_time / 1000),
        open: toNumber(c.open),
        high: toNumber(c.high),
        low: toNumber(c.low),
        close: toNumber(c.close),
        volume: toNumber(c.volume),
      }));
    } catch {
      return [];
    }
  }

  async getFundingRates(): Promise<FundingRate[]> {
    const markets = await this.getMarkets();
    return markets.map((m) => ({
      symbol: m.symbol,
      rate: m.fundingRate,
      intervalHours: 8,
      nextFundingTime: m.nextFundingTime ?? Date.now() + 8 * 60 * 60 * 1000,
    }));
  }

  async getUserPositions(address: string): Promise<Position[]> {
    try {
      const res = await getJson<AsterPositionRaw[]>(
        `${CFG.apiUrl}/v1/positions?address=${address}`,
      );
      return res
        .map((p) => {
          const size = toNumber(p.size);
          if (size === 0) return null;
          const side: 'long' | 'short' = size > 0 ? 'long' : 'short';
          return {
            symbol: p.symbol,
            side,
            size: Math.abs(size).toString(),
            entryPrice: p.entry_price,
            markPrice: p.mark_price,
            liquidationPrice: p.liquidation_price,
            unrealizedPnl: p.unrealized_pnl,
            realizedPnl: p.realized_pnl,
            leverage: p.leverage,
            marginMode: p.margin_mode,
            marginUsed: p.margin_used,
            notional: (Math.abs(size) * toNumber(p.mark_price)).toString(),
            roe: (
              (toNumber(p.unrealized_pnl) / Math.max(toNumber(p.margin_used), 1)) *
              100
            ).toFixed(2),
          } as Position;
        })
        .filter(Boolean) as Position[];
    } catch {
      return [];
    }
  }

  async getUserOrders(address: string): Promise<Order[]> {
    try {
      const res = await getJson<AsterOrderRaw[]>(
        `${CFG.apiUrl}/v1/orders?address=${address}&status=open`,
      );
      return res.map((o) => ({
        id: o.id,
        clientId: o.client_id,
        symbol: o.symbol,
        side: o.side === 'BUY' ? 'long' : 'short',
        orderType: (o.type.toLowerCase().replace('_', '-') as any) ?? 'limit',
        price: o.price,
        size: o.size,
        filledSize: o.filled_size,
        status: 'open',
        reduceOnly: o.reduce_only,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      }));
    } catch {
      return [];
    }
  }

  async getUserOrderHistory(address: string): Promise<Order[]> {
    try {
      const res = await getJson<AsterOrderRaw[]>(
        `${CFG.apiUrl}/v1/orders?address=${address}&status=filled&limit=100`,
      );
      return res.map((o) => ({
        id: o.id,
        symbol: o.symbol,
        side: o.side === 'BUY' ? 'long' : 'short',
        orderType: (o.type.toLowerCase().replace('_', '-') as any) ?? 'limit',
        price: o.price,
        size: o.size,
        filledSize: o.filled_size,
        status: 'filled',
        reduceOnly: o.reduce_only,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      }));
    } catch {
      return [];
    }
  }

  async getUserBalances(address: string): Promise<Balance[]> {
    try {
      const res = await getJson<Balance[]>(`${CFG.apiUrl}/v1/balances?address=${address}`);
      return res;
    } catch {
      return [];
    }
  }

  async getUserSnapshot(address: string): Promise<WalletSnapshot> {
    const balances = await this.getUserBalances(address);
    const positions = await this.getUserPositions(address);
    const total = balances.reduce((acc, b) => acc + toNumber(b.total), 0);
    const available = balances.reduce((acc, b) => acc + toNumber(b.available), 0);
    const marginUsed = positions.reduce((acc, p) => acc + toNumber(p.marginUsed), 0);
    const upnl = positions.reduce((acc, p) => acc + toNumber(p.unrealizedPnl), 0);
    return {
      address,
      balances,
      totalEquity: total.toFixed(2),
      totalMarginUsed: marginUsed.toFixed(2),
      totalAvailable: available.toFixed(2),
      unrealizedPnl: upnl.toFixed(2),
    };
  }

  async placeOrder(signer: WalletSigner, params: OrderParams): Promise<OrderResult> {
    const payload: AsterOrderParams = {
      symbol: params.symbol,
      side: params.side === 'long' ? 'BUY' : 'SELL',
      type:
        params.orderType === 'market'
          ? 'MARKET'
          : params.orderType === 'stop-limit'
          ? 'STOP_LIMIT'
          : params.orderType === 'stop-market'
          ? 'STOP_MARKET'
          : 'LIMIT',
      price: params.price,
      size: params.size,
      trigger_price: params.triggerPrice,
      reduce_only: params.reduceOnly,
      time_in_force: params.timeInForce && params.timeInForce !== 'ALO' ? params.timeInForce : 'GTC',
      leverage: params.leverage,
      nonce: Date.now(),
    };
    const signature = await signAsterOrder(signer, payload);
    const res = await postJson<{ id: string; status: string }>(`${CFG.apiUrl}/v1/orders`, {
      ...payload,
      address: signer.address,
      signature,
    });
    return { orderId: res.id, status: res.status === 'FILLED' ? 'filled' : 'open' };
  }

  async cancelOrder(signer: WalletSigner, symbol: string, orderId: string): Promise<void> {
    const nonce = Date.now();
    const signature = await signAsterCancel(signer, { symbol, orderId, nonce });
    await postJson(`${CFG.apiUrl}/v1/orders/cancel`, {
      symbol,
      orderId,
      nonce,
      address: signer.address,
      signature,
    });
  }

  async cancelAllOrders(signer: WalletSigner, symbol?: string): Promise<void> {
    const orders = await this.getUserOrders(signer.address);
    const targets = symbol ? orders.filter((o) => o.symbol === symbol) : orders;
    await Promise.all(targets.map((o) => this.cancelOrder(signer, o.symbol, o.id)));
  }

  async closePosition(signer: WalletSigner, symbol: string): Promise<OrderResult> {
    const positions = await this.getUserPositions(signer.address);
    const p = positions.find((x) => x.symbol === symbol);
    if (!p) throw new Error(`No open position for ${symbol}`);
    return this.placeOrder(signer, {
      symbol,
      side: p.side === 'long' ? 'short' : 'long',
      orderType: 'market',
      size: p.size,
      leverage: p.leverage,
      reduceOnly: true,
    });
  }

  createWebSocket(): ProtocolWebSocket {
    return new AsterWebSocket();
  }
}
