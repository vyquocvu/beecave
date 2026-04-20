import type { ProtocolWebSocket } from '@/services/types';
import type { Orderbook, Trade, Candle, CandleInterval } from '@/types/market';
import type { Order } from '@/types/order';
import { PROTOCOLS } from '@/constants/protocols';
import { ReconnectingWebSocket } from '@/services/ws';
import { buildOrderbookWithTotals, calcSpread } from '@/utils/math';
import { toNumber } from '@/utils/format';

type Handler = (data: any) => void;

export class LighterWebSocket implements ProtocolWebSocket {
  private socket: ReconnectingWebSocket;
  private handlers: Map<string, Handler> = new Map();

  constructor() {
    this.socket = new ReconnectingWebSocket(PROTOCOLS.lighter.wsUrl);
    this.socket.onMessage((msg) => this.route(msg));
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
    this.handlers.clear();
  }

  private route(msg: any) {
    const channel = msg?.channel ?? msg?.type;
    if (!channel) return;
    const key = channelKey(channel, msg);
    const handler = this.handlers.get(key);
    handler?.(msg?.data ?? msg);
  }

  subscribeOrderbook(symbol: string, cb: (ob: Orderbook) => void): () => void {
    const key = `orderbook:${symbol}`;
    this.handlers.set(key, (data: any) => {
      const bids = buildOrderbookWithTotals(data?.bids ?? []);
      const asks = buildOrderbookWithTotals(data?.asks ?? []);
      const spread = calcSpread(bids[0]?.price, asks[0]?.price);
      const mid =
        bids[0] && asks[0]
          ? ((toNumber(bids[0].price) + toNumber(asks[0].price)) / 2).toString()
          : '0';
      cb({
        symbol,
        bids,
        asks,
        markPrice: mid,
        spread: spread.pct.toFixed(4),
        time: data?.timestamp ?? Date.now(),
      });
    });
    this.socket.send({ action: 'subscribe', channel: 'orderbook', symbol });
    return () => {
      this.socket.send({ action: 'unsubscribe', channel: 'orderbook', symbol });
      this.handlers.delete(key);
    };
  }

  subscribeTrades(symbol: string, cb: (trades: Trade[]) => void): () => void {
    const key = `trades:${symbol}`;
    this.handlers.set(key, (data: any) => {
      const arr = Array.isArray(data) ? data : [data];
      cb(
        arr.map((t) => ({
          id: String(t.id ?? t.tid ?? Math.random()),
          symbol,
          price: t.price,
          size: t.size,
          side: t.is_ask ? 'sell' : 'buy',
          time: t.timestamp ?? Date.now(),
        })),
      );
    });
    this.socket.send({ action: 'subscribe', channel: 'trades', symbol });
    return () => {
      this.socket.send({ action: 'unsubscribe', channel: 'trades', symbol });
      this.handlers.delete(key);
    };
  }

  subscribeTicker(cb: (prices: Record<string, string>) => void): () => void {
    const key = 'ticker:all';
    this.handlers.set(key, (data: any) => cb(data ?? {}));
    this.socket.send({ action: 'subscribe', channel: 'ticker' });
    return () => {
      this.socket.send({ action: 'unsubscribe', channel: 'ticker' });
      this.handlers.delete(key);
    };
  }

  subscribeCandles(
    symbol: string,
    interval: CandleInterval,
    cb: (candles: Candle[]) => void,
  ): () => void {
    const key = `candles:${symbol}:${interval}`;
    this.handlers.set(key, (data: any) => {
      const arr = Array.isArray(data) ? data : [data];
      cb(
        arr.map((c: any) => ({
          time: Math.floor((c.timestamp ?? c.t) / 1000),
          open: toNumber(c.open ?? c.o),
          high: toNumber(c.high ?? c.h),
          low: toNumber(c.low ?? c.l),
          close: toNumber(c.close ?? c.c),
          volume: toNumber(c.volume ?? c.v),
        })),
      );
    });
    this.socket.send({ action: 'subscribe', channel: 'candles', symbol, interval });
    return () => {
      this.socket.send({ action: 'unsubscribe', channel: 'candles', symbol, interval });
      this.handlers.delete(key);
    };
  }

  subscribeUserOrders(address: string, cb: (orders: Order[]) => void): () => void {
    const key = `orders:${address}`;
    this.handlers.set(key, (data: any) => {
      const arr = Array.isArray(data) ? data : [data];
      cb(
        arr.map((o: any) => ({
          id: String(o.order_id),
          symbol: o.symbol ?? '',
          side: o.is_ask ? 'short' : 'long',
          orderType: o.order_type === 1 ? 'market' : 'limit',
          price: o.price,
          size: o.size,
          filledSize: o.filled ?? '0',
          status: o.status ?? 'open',
          reduceOnly: !!o.reduce_only,
          createdAt: o.created_at ?? Date.now(),
          updatedAt: o.updated_at ?? Date.now(),
        })),
      );
    });
    this.socket.send({ action: 'subscribe', channel: 'user_orders', address });
    return () => {
      this.socket.send({ action: 'unsubscribe', channel: 'user_orders', address });
      this.handlers.delete(key);
    };
  }
}

function channelKey(channel: string, msg: any): string {
  if (channel === 'orderbook' || channel === 'trades' || channel === 'candles') {
    return `${channel}:${msg.symbol ?? msg.data?.symbol}${
      msg.interval ? ':' + msg.interval : ''
    }`;
  }
  if (channel === 'user_orders') return `orders:${msg.address}`;
  if (channel === 'ticker') return 'ticker:all';
  return channel;
}
