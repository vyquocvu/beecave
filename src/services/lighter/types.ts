export interface LighterOrderbook {
  market_id: number;
  asks: { price: string; size: string }[];
  bids: { price: string; size: string }[];
  timestamp: number;
}

export interface LighterMarketMeta {
  market_id: number;
  symbol: string;
  base_decimals: number;
  quote_decimals: number;
  price_decimals: number;
  min_base_amount: string;
  is_active: boolean;
  mark_price?: string;
  index_price?: string;
  funding_rate?: string;
  daily_volume?: string;
  open_interest?: string;
  prev_day_price?: string;
}

export interface LighterPositionRaw {
  market_id: number;
  size: string;
  entry_price: string;
  mark_price: string;
  unrealized_pnl: string;
  maintenance_margin: string;
  initial_margin: string;
  leverage: string;
  liquidation_price?: string | null;
}

export interface LighterOrderRaw {
  order_id: string;
  client_order_id?: string;
  market_id: number;
  price: string;
  size: string;
  filled: string;
  is_ask: boolean;
  status: string;
  created_at: number;
  order_type: number;
  reduce_only?: boolean;
}

export interface LighterCandleRaw {
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}
