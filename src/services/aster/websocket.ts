import type { ProtocolWebSocket } from '@/services/types';
import type { Orderbook, Trade, Candle, CandleInterval } from '@/types/market';
import type { Order } from '@/types/order';
import { PROTOCOLS } from '@/constants/protocols';
import { ReconnectingWebSocket } from '@/services/ws';
import { buildOrderbookWithTotals, calcSpread } from '@/utils/math';
import { toNumber } from '@/utils/format';

type Handler = (data: any) => void;

export class AsterWebSocket implements ProtocolWebSocket {
  private socket: ReconnectingWebSocket;
  private handlers: Map<string, Handler> = new Map();

  constructor() {
    this.socket = new ReconnectingWebSocket(PROTOCOLS.aster.wsUrl);
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
    const stream: string | undefined = msg?.stream;
    if (!stream) return;
    const handler = this.handlers.get(stream);
    handler?.(msg.data ?? msg);
  }

  subscribeOrderbook(symbol: string, cb: (ob: Orderbook) => void): () => void {
    const stream = `${symbol}@orderbook`;
    this.handlers.set(stream, (data: any) => {
      const bids = buildOrderbookWithTotals(
        (data.bids ?? []).map(([price, size]: [string, string]) => ({ price, size })),
      );
      const asks = buildOrderbookWithTotals(
        (data.asks ?? []).map(([price, size]: [string, string]) => ({ price, size })),
      );
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
        time: data.timestamp ?? Date.now(),
      });
    });
    this.socket.send({ method: 'SUBSCRIBE', params: [stream] });
    return () => {
      this.socket.send({ method: 'UNSUBSCRIBE', params: [stream] });
      this.handlers.delete(stream);
    };
  }

  subscribeTrades(symbol: string, cb: (trades: Trade[]) => void): () => void {
    const stream = `${symbol}@trades`;
    this.handlers.set(stream, (data: any) => {
      const arr = Array.isArray(data) ? data : [data];
      cb(
        arr.map((t: any) => ({
          id: String(t.id),
          symbol,
          price: t.price,
          size: t.size,
          side: t.side?.toLowerCase() === 'buy' ? 'buy' : 'sell',
          time: t.time,
        })),
      );
    });
    this.socket.send({ method: 'SUBSCRIBE', params: [stream] });
    return () => {
      this.socket.send({ method: 'UNSUBSCRIBE', params: [stream] });
      this.handlers.delete(stream);
    };
  }

  subscribeTicker(cb: (prices: Record<string, string>) => void): () => void {
    const stream = 'all@ticker';
    this.handlers.set(stream, (data: any) => {
      const arr = Array.isArray(data) ? data : [];
      const prices: Record<string, string> = {};
      for (const t of arr) prices[t.symbol ?? t.s] = t.mark_price ?? t.c;
      cb(prices);
    });
    this.socket.send({ method: 'SUBSCRIBE', params: [stream] });
    return () => {
      this.socket.send({ method: 'UNSUBSCRIBE', params: [stream] });
      this.handlers.delete(stream);
    };
  }

  subscribeCandles(
    symbol: string,
    interval: CandleInterval,
    cb: (candles: Candle[]) => void,
  ): () => void {
    const stream = `${symbol}@kline_${interval}`;
    this.handlers.set(stream, (data: any) => {
      const arr = Array.isArray(data) ? data : [data];
      cb(
        arr.map((c: any) => ({
          time: Math.floor((c.t ?? c.open_time) / 1000),
          open: toNumber(c.o ?? c.open),
          high: toNumber(c.h ?? c.high),
          low: toNumber(c.l ?? c.low),
          close: toNumber(c.c ?? c.close),
          volume: toNumber(c.v ?? c.volume),
        })),
      );
    });
    this.socket.send({ method: 'SUBSCRIBE', params: [stream] });
    return () => {
      this.socket.send({ method: 'UNSUBSCRIBE', params: [stream] });
      this.handlers.delete(stream);
    };
  }

  subscribeUserOrders(address: string, cb: (orders: Order[]) => void): () => void {
    const stream = `user@${address}@orders`;
    this.handlers.set(stream, (data: any) => {
      const arr = Array.isArray(data) ? data : [data];
      cb(
        arr.map((o: any) => ({
          id: o.id,
          symbol: o.symbol,
          side: o.side === 'BUY' ? 'long' : 'short',
          orderType: (o.type ?? 'limit').toLowerCase().replace('_', '-'),
          price: o.price,
          size: o.size,
          filledSize: o.filled_size ?? '0',
          status: o.status ?? 'open',
          reduceOnly: !!o.reduce_only,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        })),
      );
    });
    this.socket.send({ method: 'SUBSCRIBE', params: [stream] });
    return () => {
      this.socket.send({ method: 'UNSUBSCRIBE', params: [stream] });
      this.handlers.delete(stream);
    };
  }
}
