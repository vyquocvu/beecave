import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useProtocol } from './useProtocol';
import { useCopyTradingStore } from '@/store/useCopyTradingStore';
import { KNOWN_TRADERS } from '@/constants/leaderboard';
import { toNumber } from '@/utils/format';
import type { TraderProfile } from '@/types/leaderboard';

export function useTraderProfile(address: string) {
  const { service } = useProtocol();
  const configs = useCopyTradingStore((s) => s.configs);

  const snapshot = useQuery({
    queryKey: ['leaderboard', 'snapshot', address],
    queryFn: () => service.getUserSnapshot(address),
    staleTime: 15_000,
    retry: 2,
    enabled: !!address,
  });

  const positions = useQuery({
    queryKey: ['leaderboard', 'positions', address],
    queryFn: () => service.getUserPositions(address),
    staleTime: 10_000,
    refetchInterval: 15_000,
    retry: 1,
    enabled: !!address,
  });

  const orders = useQuery({
    queryKey: ['leaderboard', 'orders', address],
    queryFn: () => service.getUserOrders(address),
    staleTime: 15_000,
    retry: 1,
    enabled: !!address,
  });

  const label = KNOWN_TRADERS.find((t) => t.address === address)?.label;

  const profile = useMemo((): TraderProfile | null => {
    if (!snapshot.data) return null;
    const equity = toNumber(snapshot.data.totalEquity);
    const upnl = toNumber(snapshot.data.unrealizedPnl);
    const invested = equity - upnl;
    const pnlPct = invested > 0 ? (upnl / invested) * 100 : 0;

    return {
      address,
      label,
      rank: 0,
      totalEquity: snapshot.data.totalEquity,
      unrealizedPnl: snapshot.data.unrealizedPnl,
      pnlPct,
      openPositionsCount: positions.data?.length ?? 0,
      isFollowing: !!configs[address]?.isEnabled,
      fetchedAt: Date.now(),
      isError: snapshot.isError,
      positions: positions.data ?? [],
      recentOrders: orders.data ?? [],
    };
  }, [snapshot.data, snapshot.isError, positions.data, orders.data, address, label, configs]);

  return {
    profile,
    isLoading: snapshot.isLoading || positions.isLoading,
    isError: snapshot.isError,
    refetch: () => {
      snapshot.refetch();
      positions.refetch();
      orders.refetch();
    },
  };
}
