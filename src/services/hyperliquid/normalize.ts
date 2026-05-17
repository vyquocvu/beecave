import type { Orderbook } from '@/types/market';
import type { HLL2Book } from './types';
import { toNumber } from '@/utils/format';
import { buildOrderbookWithTotals, calcSpread } from '@/utils/math';

export function normalizeL2Book(book: HLL2Book, depth: number): Orderbook {
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
