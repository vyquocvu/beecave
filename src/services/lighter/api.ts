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
  LighterMarketMeta,
  LighterOrderbook,
  LighterPositionRaw,
  LighterOrderRaw,
  LighterCandleRaw,
} from './types';
import { signLighterOrder, nextClientOrderId } from './utils';
import { LighterWebSocket } from './websocket';

const CFG = PROTOCOLS.lighter;

export class LighterService implements ProtocolService {
  private metaCache: LighterMarketMeta[] | null = null;

  private async meta(): Promise<LighterMarketMeta[]> {
    if (this.metaCache) return this.metaCache;
    const res = await getJson<{ markets: LighterMarketMeta[] } | LighterMarketMeta[]>(
      `${CFG.apiUrl}/orderbooks`,
    );
    const arr = Array.isArray(res) ? res : res.markets ?? [];
    this.metaCache = arr;
    return arr;
  }

  private async marketIdFromSymbol(symbol: string): Promise<number> {
    const meta = await this.meta();
    const m = meta.find((x) => x.symbol === symbol || x.symbol.split('/')[0] === symbol);
    if (!m) throw new Error(`Unknown Lighter market: ${symbol}`);
    return m.market_id;
  }

  async getMarkets(): Promise<Market[]> {
    const meta = await this.meta();
    return meta.map((m) => {
      const [base = m.symbol, quote = 'USDC'] = m.symbol.split('/');
      const mark = m.mark_price ?? '0';
      const prev = m.prev_day_price ?? mark;
      return {
        symbol: base,
        baseAsset: base,
        quoteAsset: quote,
        protocol: 'lighter',
        protocolMarketId: m.market_id,
        markPrice: mark,
        indexPrice: m.index_price,
        prevDayPrice: prev,
        change24hPct: calcPctChange(mark, prev),
        volume24h: m.daily_volume ?? '0',
        openInterest: m.open_interest ?? '0',
        fundingRate: m.funding_rate ?? '0',
        maxLeverage: CFG.maxLeverage,
        pricePrecision: m.price_decimals,
        sizePrecision: m.base_decimals,
        minSize: m.min_base_amount,
        isActive: m.is_active,
      };
    });
  }

  async getMarket(symbol: string): Promise<Market | null> {
    const markets = await this.getMarkets();
    return markets.find((m) => m.symbol === symbol) ?? null;
  }

  async getOrderbook(symbol: string, depth = APP_CONFIG.orderbookDepth): Promise<Orderbook> {
    const marketId = await this.marketIdFromSymbol(symbol);
    const book = await getJson<LighterOrderbook>(
      `${CFG.apiUrl}/orderbook?marketId=${marketId}&depth=${depth}`,
    );
    const bids = buildOrderbookWithTotals(book.bids.slice(0, depth));
    const asks = buildOrderbookWithTotals(book.asks.slice(0, depth));
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
      time: book.timestamp,
    };
  }

  async getRecentTrades(symbol: string, limit = 50): Promise<Trade[]> {
    try {
      const marketId = await this.marketIdFromSymbol(symbol);
      const res = await getJson<
        { id: string; price: string; size: string; is_ask: boolean; timestamp: number }[]
      >(`${CFG.apiUrl}/trades?marketId=${marketId}&limit=${limit}`);
      return res.map((t) => ({
        id: t.id,
        symbol,
        price: t.price,
        size: t.size,
        side: t.is_ask ? 'sell' : 'buy',
        time: t.timestamp,
      }));
    } catch {
      return [];
    }
  }

  async getCandles(symbol: string, interval: CandleInterval, limit = 200): Promise<Candle[]> {
    const marketId = await this.marketIdFromSymbol(symbol);
    try {
      const res = await getJson<LighterCandleRaw[]>(
        `${CFG.apiUrl}/candles?marketId=${marketId}&interval=${interval}&limit=${limit}`,
      );
      return res.map((c) => ({
        time: Math.floor(c.timestamp / 1000),
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
    const meta = await this.meta();
    return meta.map((m) => ({
      symbol: m.symbol.split('/')[0],
      rate: m.funding_rate ?? '0',
      intervalHours: 8,
      nextFundingTime: Date.now() + 8 * 60 * 60 * 1000,
    }));
  }

  async getUserPositions(address: string): Promise<Position[]> {
    try {
      const res = await getJson<LighterPositionRaw[]>(
        `${CFG.apiUrl}/positions?address=${address}`,
      );
      const meta = await this.meta();
      return res
        .map((p) => {
          const size = toNumber(p.size);
          if (size === 0) return null;
          const market = meta.find((m) => m.market_id === p.market_id);
          const symbol = market?.symbol.split('/')[0] ?? `M${p.market_id}`;
          const side: 'long' | 'short' = size > 0 ? 'long' : 'short';
          return {
            symbol,
            side,
            size: Math.abs(size).toString(),
            entryPrice: p.entry_price,
            markPrice: p.mark_price,
            liquidationPrice: p.liquidation_price ?? null,
            unrealizedPnl: p.unrealized_pnl,
            leverage: toNumber(p.leverage) || 1,
            marginMode: 'cross',
            marginUsed: p.initial_margin,
            notional: (Math.abs(size) * toNumber(p.mark_price)).toString(),
            roe: (
              (toNumber(p.unrealized_pnl) / Math.max(toNumber(p.initial_margin), 1)) *
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
      const res = await getJson<LighterOrderRaw[]>(
        `${CFG.apiUrl}/orders?address=${address}&status=open`,
      );
      const meta = await this.meta();
      return res.map((o) => ({
        id: o.order_id,
        clientId: o.client_order_id,
        symbol: meta.find((m) => m.market_id === o.market_id)?.symbol.split('/')[0] ?? '',
        side: o.is_ask ? 'short' : 'long',
        orderType: o.order_type === 1 ? 'market' : 'limit',
        price: o.price,
        size: o.size,
        filledSize: o.filled,
        status: 'open',
        reduceOnly: !!o.reduce_only,
        createdAt: o.created_at,
        updatedAt: o.created_at,
      }));
    } catch {
      return [];
    }
  }

  async getUserOrderHistory(address: string): Promise<Order[]> {
    try {
      const res = await getJson<LighterOrderRaw[]>(
        `${CFG.apiUrl}/orders?address=${address}&status=filled&limit=100`,
      );
      const meta = await this.meta();
      return res.map((o) => ({
        id: o.order_id,
        symbol: meta.find((m) => m.market_id === o.market_id)?.symbol.split('/')[0] ?? '',
        side: o.is_ask ? 'short' : 'long',
        orderType: o.order_type === 1 ? 'market' : 'limit',
        price: o.price,
        size: o.size,
        filledSize: o.filled,
        status: 'filled',
        reduceOnly: !!o.reduce_only,
        createdAt: o.created_at,
        updatedAt: o.created_at,
      }));
    } catch {
      return [];
    }
  }

  async getUserBalances(address: string): Promise<Balance[]> {
    try {
      const res = await getJson<{ total: string; available: string; locked: string }>(
        `${CFG.apiUrl}/balance?address=${address}`,
      );
      return [
        {
          asset: 'USDC',
          total: res.total,
          available: res.available,
          locked: res.locked,
          usdValue: res.total,
        },
      ];
    } catch {
      return [];
    }
  }

  async getUserSnapshot(address: string): Promise<WalletSnapshot> {
    const balances = await this.getUserBalances(address);
    const positions = await this.getUserPositions(address);
    const total = balances.reduce((acc, b) => acc + toNumber(b.total), 0);
    const marginUsed = positions.reduce((acc, p) => acc + toNumber(p.marginUsed), 0);
    const available = balances.reduce((acc, b) => acc + toNumber(b.available), 0);
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
    const marketId = await this.marketIdFromSymbol(params.symbol);
    const payload = {
      marketId,
      clientOrderId: nextClientOrderId(),
      amount: params.size,
      price: params.price ?? '0',
      isAsk: params.side === 'short',
      orderType: params.orderType === 'market' ? (1 as const) : (0 as const),
      timeInForce:
        params.timeInForce === 'IOC' ? (1 as const) : params.timeInForce === 'FOK' ? (2 as const) : (0 as const),
      nonce: Date.now(),
    };
    const signature = await signLighterOrder(signer, payload);
    const res = await postJson<{ order_id: string; status: string }>(
      `${CFG.apiUrl}/create_order`,
      { ...payload, address: signer.address, signature },
    );
    return { orderId: res.order_id, status: res.status === 'open' ? 'open' : 'filled' };
  }

  async cancelOrder(signer: WalletSigner, symbol: string, orderId: string): Promise<void> {
    const marketId = await this.marketIdFromSymbol(symbol);
    const payload = { marketId, orderId, nonce: Date.now() };
    const signature = await signer.signTypedData({
      domain: { name: 'Lighter', version: '1', chainId: 324 },
      types: {
        Cancel: [
          { name: 'marketId', type: 'uint32' },
          { name: 'orderId', type: 'string' },
          { name: 'nonce', type: 'uint64' },
        ],
      },
      primaryType: 'Cancel',
      message: payload,
    });
    await postJson(`${CFG.apiUrl}/cancel_order`, { ...payload, address: signer.address, signature });
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
    return new LighterWebSocket();
  }
}
