import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { KNOWN_TRADERS, LEADERBOARD_STALE_TIME, LEADERBOARD_REFETCH_INTERVAL } from '@/constants/leaderboard';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { useCopyTradingStore } from '@/store/useCopyTradingStore';
import { useProtocol } from './useProtocol';
import { toNumber } from '@/utils/format';
import type { LeaderboardEntry } from '@/types/leaderboard';

export function useLeaderboard() {
  const { protocol, service } = useProtocol();
  const customAddresses = useLeaderboardStore((s) => s.customAddresses);
  const sortKey = useLeaderboardStore((s) => s.sortKey);
  const configs = useCopyTradingStore((s) => s.configs);

  const allTraders = useMemo(
    () => [
      ...KNOWN_TRADERS,
      ...customAddresses.map((address) => ({ address, label: undefined })),
    ],
    [customAddresses],
  );

  const isSupported = protocol === 'hyperliquid';

  const results = useQueries({
    queries: allTraders.map((trader) => ({
      queryKey: ['leaderboard', 'snapshot', trader.address],
      queryFn: () => service.getUserSnapshot(trader.address),
      staleTime: LEADERBOARD_STALE_TIME,
      refetchInterval: LEADERBOARD_REFETCH_INTERVAL,
      retry: 1,
      enabled: isSupported,
    })),
  });

  const entries = useMemo((): LeaderboardEntry[] => {
    return allTraders
      .map((trader, i) => {
        const result = results[i];
        const snapshot = result?.data;
        const isError = result?.isError ?? false;
        if (!snapshot) return null;

        const equity = toNumber(snapshot.totalEquity);
        const upnl = toNumber(snapshot.unrealizedPnl);
        const invested = equity - upnl;
        const pnlPct = invested > 0 ? (upnl / invested) * 100 : 0;

        return {
          address: trader.address,
          label: (trader as { label?: string }).label,
          rank: 0,
          totalEquity: snapshot.totalEquity,
          unrealizedPnl: snapshot.unrealizedPnl,
          pnlPct,
          openPositionsCount: 0,
          isFollowing: !!configs[trader.address]?.isEnabled,
          fetchedAt: Date.now(),
          isError,
        } as LeaderboardEntry;
      })
      .filter(Boolean) as LeaderboardEntry[];
  }, [allTraders, results, configs]);

  const sorted = useMemo(() => {
    const copy = [...entries].sort((a, b) => {
      if (sortKey === 'pnlPct') return b.pnlPct - a.pnlPct;
      if (sortKey === 'equity') return toNumber(b.totalEquity) - toNumber(a.totalEquity);
      return b.openPositionsCount - a.openPositionsCount;
    });
    return copy.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [entries, sortKey]);

  const isLoading = results.some((r) => r.isLoading) && entries.length === 0;
  const isRefreshing = results.some((r) => r.isFetching);

  return { entries: sorted, isLoading, isRefreshing, isSupported };
}
