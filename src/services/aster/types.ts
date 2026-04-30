export interface AsterMarketRaw {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  price_precision: number;
  size_precision: number;
  min_size: string;
  max_leverage: number;
  is_active: boolean;
  mark_price: string;
  index_price?: string;
  funding_rate: string;
  next_funding_time?: number;
  volume_24h: string;
  open_interest: string;
  prev_day_price: string;
}

export interface AsterOrderbookRaw {
  symbol: string;
  bids: Array<[string, string]>;
  asks: Array<[string, string]>;
  timestamp: number;
}

export interface AsterOrderParams {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET';
  price?: string;
  size: string;
  trigger_price?: string;
  reduce_only?: boolean;
  time_in_force?: 'GTC' | 'IOC' | 'FOK';
  leverage: number;
  nonce: number;
}

export interface AsterPositionRaw {
  symbol: string;
  size: string;
  entry_price: string;
  mark_price: string;
  liquidation_price: string | null;
  unrealized_pnl: string;
  realized_pnl: string;
  leverage: number;
  margin_mode: 'cross' | 'isolated';
  margin_used: string;
}

export interface AsterOrderRaw {
  id: string;
  client_id?: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: string;
  price: string;
  size: string;
  filled_size: string;
  status: string;
  reduce_only: boolean;
  created_at: number;
  updated_at: number;
}

export interface AsterCandleRaw {
  open_time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  close_time: number;
}
