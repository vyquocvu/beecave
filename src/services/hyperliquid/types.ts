export interface HLMeta {
  universe: Array<{
    name: string;
    szDecimals: number;
    maxLeverage: number;
    marginTableId?: number;
  }>;
}

export interface HLAssetCtx {
  funding: string;
  openInterest: string;
  prevDayPx: string;
  dayNtlVlm: string;
  premium: string;
  oraclePx: string;
  markPx: string;
  midPx: string;
  impactPxs: [string, string];
}

export interface HLL2Book {
  coin: string;
  levels: [
    Array<{ px: string; sz: string; n: number }>,
    Array<{ px: string; sz: string; n: number }>,
  ];
  time: number;
}

export interface HLPosition {
  coin: string;
  szi: string;
  entryPx: string;
  positionValue: string;
  unrealizedPnl: string;
  returnOnEquity: string;
  liquidationPx: string | null;
  leverage: { type: 'cross' | 'isolated'; value: number };
  maxLeverage: number;
  marginUsed: string;
  cumFunding: { allTime: string; sinceOpen: string; sinceChange: string };
}

export interface HLClearinghouseState {
  assetPositions: Array<{ position: HLPosition; type: string }>;
  crossMarginSummary: {
    accountValue: string;
    totalNtlPos: string;
    totalRawUsd: string;
    totalMarginUsed: string;
  };
  marginSummary: {
    accountValue: string;
    totalNtlPos: string;
    totalRawUsd: string;
    totalMarginUsed: string;
  };
  withdrawable: string;
  time: number;
}

export interface HLOpenOrder {
  coin: string;
  side: 'A' | 'B'; // A = ask/sell, B = bid/buy
  limitPx: string;
  sz: string;
  oid: number;
  timestamp: number;
  origSz: string;
  reduceOnly?: boolean;
  orderType?: string;
}

export interface HLCandle {
  t: number;
  T: number;
  s: string;
  i: string;
  o: string;
  c: string;
  h: string;
  l: string;
  v: string;
  n: number;
}

export interface HLOrderRequest {
  a: number; // asset index
  b: boolean; // isBuy
  p: string; // price
  s: string; // size
  r: boolean; // reduceOnly
  t:
    | { limit: { tif: 'Gtc' | 'Ioc' | 'Alo' } }
    | { trigger: { triggerPx: string; isMarket: boolean; tpsl: 'tp' | 'sl' } };
  c?: string; // client order id
}

export interface HLCancelRequest {
  a: number;
  o: number;
}
