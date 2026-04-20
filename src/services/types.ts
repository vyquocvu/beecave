import type { Market, Orderbook, Candle, CandleInterval, Trade, FundingRate } from '@/types/market';
import type { Order, OrderParams, OrderResult } from '@/types/order';
import type { Position } from '@/types/position';
import type { Balance, WalletSnapshot } from '@/types/wallet';

export interface WalletSigner {
  address: `0x${string}`;
  signTypedData: (args: any) => Promise<`0x${string}`>;
  signMessage?: (args: { message: string }) => Promise<`0x${string}`>;
}

export interface ProtocolWebSocket {
  connect(): void;
  disconnect(): void;
  subscribeOrderbook(symbol: string, cb: (ob: Orderbook) => void): () => void;
  subscribeTrades(symbol: string, cb: (trades: Trade[]) => void): () => void;
  subscribeTicker(cb: (prices: Record<string, string>) => void): () => void;
  subscribeCandles(
    symbol: string,
    interval: CandleInterval,
    cb: (candles: Candle[]) => void,
  ): () => void;
  subscribeUserOrders(address: string, cb: (orders: Order[]) => void): () => void;
  subscribeUserPositions?(address: string, cb: (positions: Position[]) => void): () => void;
}

export interface ProtocolService {
  getMarkets(): Promise<Market[]>;
  getMarket(symbol: string): Promise<Market | null>;
  getOrderbook(symbol: string, depth?: number): Promise<Orderbook>;
  getRecentTrades(symbol: string, limit?: number): Promise<Trade[]>;
  getCandles(symbol: string, interval: CandleInterval, limit?: number): Promise<Candle[]>;
  getFundingRates(): Promise<FundingRate[]>;

  getUserPositions(address: string): Promise<Position[]>;
  getUserOrders(address: string): Promise<Order[]>;
  getUserOrderHistory(address: string): Promise<Order[]>;
  getUserBalances(address: string): Promise<Balance[]>;
  getUserSnapshot(address: string): Promise<WalletSnapshot>;

  placeOrder(signer: WalletSigner, params: OrderParams): Promise<OrderResult>;
  cancelOrder(signer: WalletSigner, symbol: string, orderId: string): Promise<void>;
  cancelAllOrders(signer: WalletSigner, symbol?: string): Promise<void>;
  closePosition(signer: WalletSigner, symbol: string): Promise<OrderResult>;

  createWebSocket(): ProtocolWebSocket;
}
