import type { Position } from './position';
import type { Order } from './order';

export type LeaderboardPeriod = '24h' | '7d' | 'all';
export type LeaderboardSortKey = 'pnlPct' | 'equity' | 'openPositions';

export interface LeaderboardEntry {
  address: string;
  label?: string;
  rank: number;
  totalEquity: string;
  unrealizedPnl: string;
  pnlPct: number;
  openPositionsCount: number;
  isFollowing: boolean;
  fetchedAt: number;
  isError: boolean;
}

export interface TraderProfile extends LeaderboardEntry {
  positions: Position[];
  recentOrders: Order[];
}
