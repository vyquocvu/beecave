export type OrderSide = 'long' | 'short';
export type OrderType = 'limit' | 'market' | 'stop-limit' | 'stop-market';
export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'ALO';
export type OrderStatus = 'pending' | 'open' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';

export interface OrderParams {
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  price?: string;
  size: string;
  leverage: number;
  reduceOnly?: boolean;
  timeInForce?: TimeInForce;
  tpPrice?: string;
  slPrice?: string;
  triggerPrice?: string;
}

export interface Order {
  id: string;
  clientId?: string;
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  price: string;
  size: string;
  filledSize: string;
  status: OrderStatus;
  reduceOnly: boolean;
  createdAt: number;
  updatedAt: number;
  leverage?: number;
  tpPrice?: string;
  slPrice?: string;
  triggerPrice?: string;
}

export interface OrderResult {
  orderId: string;
  status: OrderStatus;
  filledSize?: string;
  avgPrice?: string;
  message?: string;
}
