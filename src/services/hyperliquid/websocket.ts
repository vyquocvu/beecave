import type { ProtocolWebSocket } from '@/services/types';
import type {
  Orderbook,
  Trade,
  Candle,
  CandleInterval,
} from '@/types/market';
import type { Order } from '@/types/order';
import { PROTOCOLS } from '@/constants/protocols';
import { ReconnectingWebSocket } from '@/services/ws';
import { normalizeL2Book } from './normalize';
import { toNumber } from '@/utils/format';
import type { HLL2Book, HLCandle } from './types';

type Sub = { channel: string; key: string; handler: (data: any) => void };

export class HyperliquidWebSocket implements ProtocolWebSocket {
  private socket: ReconnectingWebSocket;
  private subs: Map<string, Sub> = new Map();

  constructor() {
    this.socket = new ReconnectingWebSocket(PROTOCOLS.hyperliquid.wsUrl);
    this.socket.onMessage((msg) => this.route(msg));
    this.socket.onOpen(() => this.resubscribe());
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
    this.subs.clear();
  }

  private send(obj: object) {
    this.socket.send(obj);
  }

  private resubscribe() {
    this.subs.forEach((s) => this.send({ method: 'subscribe', subscription: parseKey(s.key) }));
  }

  private route(msg: any) {
    const channel: string | undefined = msg?.channel;
    if (!channel) return;
    const data = msg.data;
    // Match by channel; handlers inspect data themselves for coin.
    this.subs.forEach((s) => {
      if (s.channel === channel) s.handler(data);
    });
  }

  subscribeOrderbook(symbol: string, cb: (ob: Orderbook) => void): () => void {
    const key = JSON.stringify({ type: 'l2Book', coin: symbol });
    const sub: Sub = {
      channel: 'l2Book',
      key,
      handler: (data: HLL2Book) => {
        if (data?.coin === symbol) cb(normalizeL2Book(data, 20));
      },
    };
    this.subs.set(key + Math.random(), sub);
    this.send({ method: 'subscribe', subscription: { type: 'l2Book', coin: symbol } });
    return () => {
      this.send({ method: 'unsubscribe', subscription: { type: 'l2Book', coin: symbol } });
      this.subs.delete(sub.key);
    };
  }

  subscribeTrades(symbol: string, cb: (trades: Trade[]) => void): () => void {
    const key = JSON.stringify({ type: 'trades', coin: symbol });
    const sub: Sub = {
      channel: 'trades',
      key,
      handler: (data: any[]) => {
        if (!Array.isArray(data)) return;
        const filtered = data.filter((t) => t.coin === symbol);
        if (!filtered.length) return;
        cb(
          filtered.map((t) => ({
            id: String(t.tid),
            symbol: t.coin,
            price: t.px,
            size: t.sz,
            side: t.side === 'B' ? 'buy' : 'sell',
            time: t.time,
          })),
        );
      },
    };
    this.subs.set(key, sub);
    this.send({ method: 'subscribe', subscription: { type: 'trades', coin: symbol } });
    return () => {
      this.send({ method: 'unsubscribe', subscription: { type: 'trades', coin: symbol } });
      this.subs.delete(key);
    };
  }

  subscribeTicker(cb: (prices: Record<string, string>) => void): () => void {
    const key = JSON.stringify({ type: 'allMids' });
    const sub: Sub = {
      channel: 'allMids',
      key,
      handler: (data: any) => {
        if (data?.mids) cb(data.mids);
        else if (typeof data === 'object') cb(data);
      },
    };
    this.subs.set(key, sub);
    this.send({ method: 'subscribe', subscription: { type: 'allMids' } });
    return () => {
      this.send({ method: 'unsubscribe', subscription: { type: 'allMids' } });
      this.subs.delete(key);
    };
  }

  subscribeCandles(
    symbol: string,
    interval: CandleInterval,
    cb: (candles: Candle[]) => void,
  ): () => void {
    const key = JSON.stringify({ type: 'candle', coin: symbol, interval });
    const buffer: Candle[] = [];
    const sub: Sub = {
      channel: 'candle',
      key,
      handler: (data: HLCandle | HLCandle[]) => {
        const arr = Array.isArray(data) ? data : [data];
        for (const c of arr) {
          if (c.s !== symbol || c.i !== interval) continue;
          const candle: Candle = {
            time: Math.floor(c.t / 1000),
            open: toNumber(c.o),
            high: toNumber(c.h),
            low: toNumber(c.l),
            close: toNumber(c.c),
            volume: toNumber(c.v),
          };
          const last = buffer[buffer.length - 1];
          if (last && last.time === candle.time) buffer[buffer.length - 1] = candle;
          else buffer.push(candle);
        }
        cb([...buffer]);
      },
    };
    this.subs.set(key, sub);
    this.send({ method: 'subscribe', subscription: { type: 'candle', coin: symbol, interval } });
    return () => {
      this.send({
        method: 'unsubscribe',
        subscription: { type: 'candle', coin: symbol, interval },
      });
      this.subs.delete(key);
    };
  }

  subscribeUserOrders(address: string, cb: (orders: Order[]) => void): () => void {
    const key = JSON.stringify({ type: 'orderUpdates', user: address });
    const sub: Sub = {
      channel: 'orderUpdates',
      key,
      handler: (data: any[]) => {
        if (!Array.isArray(data)) return;
        const orders: Order[] = data.map((o: any) => ({
          id: String(o.order?.oid ?? o.oid),
          symbol: o.order?.coin ?? o.coin,
          side: (o.order?.side ?? o.side) === 'B' ? 'long' : 'short',
          orderType: 'limit',
          price: o.order?.limitPx ?? o.limitPx ?? '0',
          size: o.order?.sz ?? o.sz ?? '0',
          filledSize: '0',
          status: o.status ?? 'open',
          reduceOnly: o.order?.reduceOnly ?? false,
          createdAt: o.order?.timestamp ?? Date.now(),
          updatedAt: o.time ?? Date.now(),
        }));
        cb(orders);
      },
    };
    this.subs.set(key, sub);
    this.send({ method: 'subscribe', subscription: { type: 'orderUpdates', user: address } });
    return () => {
      this.send({ method: 'unsubscribe', subscription: { type: 'orderUpdates', user: address } });
      this.subs.delete(key);
    };
  }
}

function parseKey(key: string): object {
  try {
    return JSON.parse(key);
  } catch {
    return {};
  }
}
