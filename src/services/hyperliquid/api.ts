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
import { postJson } from '@/services/http';
import { APP_CONFIG } from '@/constants/config';
import type {
  HLMeta,
  HLAssetCtx,
  HLL2Book,
  HLClearinghouseState,
  HLOpenOrder,
  HLCandle,
  HLOrderRequest,
  HLCancelRequest,
} from './types';
import { signHLAction, buildCoinIndex, hlIsBuyFromSide } from './utils';
import { HyperliquidWebSocket } from './websocket';
import { toNumber } from '@/utils/format';
import { calcPctChange, buildOrderbookWithTotals, calcSpread } from '@/utils/math';

const CFG = PROTOCOLS.hyperliquid;

export class HyperliquidService implements ProtocolService {
  private coinIndexCache: Record<string, number> | null = null;
  private metaCache: HLMeta | null = null;

  private info<T>(body: unknown): Promise<T> {
    return postJson<T>(`${CFG.apiUrl}/info`, body);
  }

  private exchange<T>(body: unknown): Promise<T> {
    return postJson<T>(`${CFG.apiUrl}/exchange`, body);
  }

  private async meta(): Promise<HLMeta> {
    if (this.metaCache) return this.metaCache;
    const [meta] = await this.info<[HLMeta, HLAssetCtx[]]>({ type: 'metaAndAssetCtxs' });
    this.metaCache = meta;
    return meta;
  }

  private async coinIndex(symbol: string): Promise<number> {
    if (!this.coinIndexCache) {
      const meta = await this.meta();
      this.coinIndexCache = buildCoinIndex(meta);
    }
    const idx = this.coinIndexCache[symbol];
    if (idx === undefined) throw new Error(`Unknown Hyperliquid coin: ${symbol}`);
    return idx;
  }

  async getMarkets(): Promise<Market[]> {
    const [meta, ctxs] = await this.info<[HLMeta, HLAssetCtx[]]>({ type: 'metaAndAssetCtxs' });
    this.metaCache = meta;
    this.coinIndexCache = buildCoinIndex(meta);

    return meta.universe.map((u, i) => {
      const ctx = ctxs[i] ?? ({} as HLAssetCtx);
      const markPrice = ctx.markPx ?? ctx.midPx ?? '0';
      const prevDayPrice = ctx.prevDayPx ?? markPrice;
      return {
        symbol: u.name,
        baseAsset: u.name,
        quoteAsset: 'USDC',
        protocol: 'hyperliquid',
        protocolMarketId: i,
        markPrice,
        indexPrice: ctx.oraclePx,
        prevDayPrice,
        change24hPct: calcPctChange(markPrice, prevDayPrice),
        volume24h: ctx.dayNtlVlm ?? '0',
        openInterest: ctx.openInterest ?? '0',
        fundingRate: ctx.funding ?? '0',
        maxLeverage: u.maxLeverage,
        pricePrecision: inferPricePrecision(markPrice),
        sizePrecision: u.szDecimals,
        minSize: (1 / Math.pow(10, u.szDecimals)).toString(),
        isActive: true,
      };
    });
  }

  async getMarket(symbol: string): Promise<Market | null> {
    const markets = await this.getMarkets();
    return markets.find((m) => m.symbol === symbol) ?? null;
  }

  async getOrderbook(symbol: string, depth = APP_CONFIG.orderbookDepth): Promise<Orderbook> {
    const book = await this.info<HLL2Book>({ type: 'l2Book', coin: symbol });
    return normalizeL2Book(book, depth);
  }

  async getRecentTrades(symbol: string, limit = 50): Promise<Trade[]> {
    try {
      const trades = await this.info<
        Array<{ coin: string; side: 'A' | 'B'; px: string; sz: string; time: number; tid: number }>
      >({ type: 'recentTrades', coin: symbol });
      return trades.slice(0, limit).map((t) => ({
        id: String(t.tid),
        symbol: t.coin,
        price: t.px,
        size: t.sz,
        side: t.side === 'B' ? 'buy' : 'sell',
        time: t.time,
      }));
    } catch {
      return [];
    }
  }

  async getCandles(symbol: string, interval: CandleInterval, limit = 200): Promise<Candle[]> {
    const endTime = Date.now();
    const intervalMs = intervalToMs(interval);
    const startTime = endTime - intervalMs * limit;
    const candles = await this.info<HLCandle[]>({
      type: 'candleSnapshot',
      req: { coin: symbol, interval, startTime, endTime },
    });
    return candles.map((c) => ({
      time: Math.floor(c.t / 1000),
      open: toNumber(c.o),
      high: toNumber(c.h),
      low: toNumber(c.l),
      close: toNumber(c.c),
      volume: toNumber(c.v),
    }));
  }

  async getFundingRates(): Promise<FundingRate[]> {
    const [meta, ctxs] = await this.info<[HLMeta, HLAssetCtx[]]>({ type: 'metaAndAssetCtxs' });
    return meta.universe.map((u, i) => ({
      symbol: u.name,
      rate: ctxs[i]?.funding ?? '0',
      intervalHours: 1,
      nextFundingTime: nextHourlyFundingTime(),
    }));
  }

  async getUserPositions(address: string): Promise<Position[]> {
    const state = await this.info<HLClearinghouseState>({
      type: 'clearinghouseState',
      user: address,
    });
    return state.assetPositions
      .map(({ position: p }) => {
        const size = toNumber(p.szi);
        if (size === 0) return null;
        const side: 'long' | 'short' = size > 0 ? 'long' : 'short';
        return {
          symbol: p.coin,
          side,
          size: Math.abs(size).toString(),
          entryPrice: p.entryPx,
          markPrice: p.entryPx, // ctxs would provide mark; hooks update it
          liquidationPrice: p.liquidationPx,
          unrealizedPnl: p.unrealizedPnl,
          leverage: p.leverage.value,
          marginMode: p.leverage.type,
          marginUsed: p.marginUsed,
          notional: p.positionValue,
          roe: (toNumber(p.returnOnEquity) * 100).toFixed(2),
          fundingAccrued: p.cumFunding.sinceOpen,
        } as Position;
      })
      .filter(Boolean) as Position[];
  }

  async getUserOrders(address: string): Promise<Order[]> {
    const orders = await this.info<HLOpenOrder[]>({ type: 'openOrders', user: address });
    return orders.map((o) => ({
      id: String(o.oid),
      symbol: o.coin,
      side: o.side === 'B' ? 'long' : 'short',
      orderType: 'limit',
      price: o.limitPx,
      size: o.sz,
      filledSize: ((toNumber(o.origSz) - toNumber(o.sz)) || 0).toString(),
      status: 'open',
      reduceOnly: !!o.reduceOnly,
      createdAt: o.timestamp,
      updatedAt: o.timestamp,
    }));
  }

  async getUserOrderHistory(address: string): Promise<Order[]> {
    try {
      const fills = await this.info<
        Array<{ coin: string; side: 'A' | 'B'; px: string; sz: string; time: number; oid: number }>
      >({ type: 'userFills', user: address });
      return fills.map((f) => ({
        id: String(f.oid),
        symbol: f.coin,
        side: f.side === 'B' ? 'long' : 'short',
        orderType: 'limit',
        price: f.px,
        size: f.sz,
        filledSize: f.sz,
        status: 'filled',
        reduceOnly: false,
        createdAt: f.time,
        updatedAt: f.time,
      }));
    } catch {
      return [];
    }
  }

  async getUserBalances(address: string): Promise<Balance[]> {
    const state = await this.info<HLClearinghouseState>({
      type: 'clearinghouseState',
      user: address,
    });
    return [
      {
        asset: 'USDC',
        total: state.marginSummary.accountValue,
        available: state.withdrawable,
        locked: (
          toNumber(state.marginSummary.accountValue) - toNumber(state.withdrawable)
        ).toString(),
        usdValue: state.marginSummary.accountValue,
      },
    ];
  }

  async getUserSnapshot(address: string): Promise<WalletSnapshot> {
    const state = await this.info<HLClearinghouseState>({
      type: 'clearinghouseState',
      user: address,
    });
    const balances = await this.getUserBalances(address);
    const positions = await this.getUserPositions(address);
    const upnl = positions.reduce((acc, p) => acc + toNumber(p.unrealizedPnl), 0);
    return {
      address,
      balances,
      totalEquity: state.marginSummary.accountValue,
      totalMarginUsed: state.marginSummary.totalMarginUsed,
      totalAvailable: state.withdrawable,
      unrealizedPnl: upnl.toFixed(2),
    };
  }

  async placeOrder(signer: WalletSigner, params: OrderParams): Promise<OrderResult> {
    const assetIdx = await this.coinIndex(params.symbol);
    const isBuy = hlIsBuyFromSide(params.side);
    const isMarket = params.orderType === 'market' || params.orderType === 'stop-market';

    const orderReq: HLOrderRequest = {
      a: assetIdx,
      b: isBuy,
      p: params.price ?? '0',
      s: params.size,
      r: params.reduceOnly ?? false,
      t:
        params.orderType === 'stop-limit' || params.orderType === 'stop-market'
          ? {
              trigger: {
                triggerPx: params.triggerPrice ?? params.price ?? '0',
                isMarket,
                tpsl: 'tp',
              },
            }
          : { limit: { tif: params.timeInForce === 'IOC' ? 'Ioc' : 'Gtc' } },
    };

    const action = { type: 'order', orders: [orderReq], grouping: 'na' };
    const nonce = Date.now();
    const isMainnet = APP_CONFIG.environment === 'mainnet';
    const signature = await signHLAction(signer, action, nonce, isMainnet);

    const res = await this.exchange<{
      status: string;
      response?: { data?: { statuses?: Array<{ resting?: { oid: number }; filled?: any }> } };
    }>({ action, nonce, signature });

    const status = res.response?.data?.statuses?.[0];
    const oid = status?.resting?.oid ?? status?.filled?.oid ?? 0;
    return {
      orderId: String(oid),
      status: status?.filled ? 'filled' : 'open',
    };
  }

  async cancelOrder(signer: WalletSigner, symbol: string, orderId: string): Promise<void> {
    const assetIdx = await this.coinIndex(symbol);
    const cancel: HLCancelRequest = { a: assetIdx, o: Number(orderId) };
    const action = { type: 'cancel', cancels: [cancel] };
    const nonce = Date.now();
    const isMainnet = APP_CONFIG.environment === 'mainnet';
    const signature = await signHLAction(signer, action, nonce, isMainnet);
    await this.exchange({ action, nonce, signature });
  }

  async cancelAllOrders(signer: WalletSigner, symbol?: string): Promise<void> {
    const orders = await this.getUserOrders(signer.address);
    const targets = symbol ? orders.filter((o) => o.symbol === symbol) : orders;
    if (!targets.length) return;
    const cancels: HLCancelRequest[] = [];
    for (const o of targets) {
      const a = await this.coinIndex(o.symbol);
      cancels.push({ a, o: Number(o.id) });
    }
    const action = { type: 'cancel', cancels };
    const nonce = Date.now();
    const isMainnet = APP_CONFIG.environment === 'mainnet';
    const signature = await signHLAction(signer, action, nonce, isMainnet);
    await this.exchange({ action, nonce, signature });
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
    return new HyperliquidWebSocket();
  }
}

function normalizeL2Book(book: HLL2Book, depth: number): Orderbook {
  const [rawBids, rawAsks] = book.levels;
  const bids = buildOrderbookWithTotals(
    rawBids.slice(0, depth).map((l) => ({ price: l.px, size: l.sz })),
  );
  const asks = buildOrderbookWithTotals(
    rawAsks.slice(0, depth).map((l) => ({ price: l.px, size: l.sz })),
  );
  const spread = calcSpread(bids[0]?.price, asks[0]?.price);
  const mid =
    bids[0] && asks[0] ? ((toNumber(bids[0].price) + toNumber(asks[0].price)) / 2).toString() : '0';
  return {
    symbol: book.coin,
    bids,
    asks,
    markPrice: mid,
    spread: spread.pct.toFixed(4),
    time: book.time,
  };
}

function intervalToMs(interval: CandleInterval): number {
  switch (interval) {
    case '1m':
      return 60_000;
    case '5m':
      return 5 * 60_000;
    case '15m':
      return 15 * 60_000;
    case '1h':
      return 60 * 60_000;
    case '4h':
      return 4 * 60 * 60_000;
    case '1d':
      return 24 * 60 * 60_000;
  }
}

function nextHourlyFundingTime(): number {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  return Math.ceil(now / hour) * hour;
}

function inferPricePrecision(price: string | number): number {
  const n = toNumber(price);
  if (n >= 1000) return 2;
  if (n >= 1) return 4;
  if (n >= 0.01) return 5;
  return 8;
}

export { normalizeL2Book };
