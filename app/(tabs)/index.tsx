import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { ProtocolSwitcher } from '@/components/trading/ProtocolSwitcher';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { MarketCard } from '@/components/market/MarketCard';
import { MarketList } from '@/components/market/MarketList';
import { Button, Skeleton, Tabs } from '@/components/ui';
import { useMarkets, useLivePrices } from '@/hooks';
import { useWalletSnapshot } from '@/hooks';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { useMarketStore } from '@/store/useMarketStore';
import { colors, spacing } from '@/constants/theme';
import { toNumber } from '@/utils/format';

type FilterKey = 'favorites' | 'all' | 'gainers' | 'losers';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoading } = useMarkets();
  const markets = useMarketStore((s) => s.markets);
  const livePrices = useMarketStore((s) => s.prices);
  const favorites = useAppStore((s) => s.favorites);
  const snapshot = useWalletStore((s) => s.snapshot);
  useWalletSnapshot();
  useLivePrices();

  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    const withLive = markets.map((m) => ({
      ...m,
      markPrice: livePrices[m.symbol] ?? m.markPrice,
    }));
    switch (filter) {
      case 'favorites':
        return withLive.filter((m) => favorites.includes(m.symbol));
      case 'gainers':
        return [...withLive].sort((a, b) => b.change24hPct - a.change24hPct).slice(0, 50);
      case 'losers':
        return [...withLive].sort((a, b) => a.change24hPct - b.change24hPct).slice(0, 50);
      default:
        return [...withLive].sort((a, b) => toNumber(b.volume24h) - toNumber(a.volume24h));
    }
  }, [markets, livePrices, filter, favorites]);

  const trending = useMemo(
    () => [...markets].sort((a, b) => toNumber(b.volume24h) - toNumber(a.volume24h)).slice(0, 8),
    [markets],
  );

  return (
    <SafeArea>
      <Header
        title="PerpDEX"
        rightActions={[
          { icon: 'notifications-outline', onPress: () => router.push('/settings/notifications') },
          { icon: 'person-circle-outline', onPress: () => router.push('/profile') },
        ]}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ProtocolSwitcher />
        <BalanceDisplay snapshot={snapshot} />

        <View style={styles.quickActions}>
          <Button title="Deposit" variant="primary" size="md" fullWidth onPress={() => router.push('/wallet/deposit')} style={{ flex: 1 }} />
          <Button title="Withdraw" variant="secondary" size="md" fullWidth onPress={() => router.push('/wallet/withdraw')} style={{ flex: 1 }} />
          <Button title="Trade" variant="outline" size="md" fullWidth onPress={() => router.push('/trade')} style={{ flex: 1 }} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Trending Markets</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={{ width: 140, marginRight: spacing.sm }}>
                  <Skeleton height={90} />
                </View>
              ))
            : trending.map((m) => <MarketCard key={m.symbol} market={m} />)}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Tabs
            variant="pill"
            items={[
              { key: 'all', label: 'All' },
              { key: 'favorites', label: 'Favorites' },
              { key: 'gainers', label: 'Gainers' },
              { key: 'losers', label: 'Losers' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </View>

        <View style={{ height: Math.max(filtered.length * 64 + 40, 200) }}>
          <MarketList markets={filtered} />
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  sectionHeader: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  sectionTitle: { color: colors.text.primary, fontSize: 16, fontWeight: '700' },
});
