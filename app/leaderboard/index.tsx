import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Input, Skeleton } from '@/components/ui';
import { TraderRow } from '@/components/leaderboard/TraderRow';
import { PeriodSelector } from '@/components/leaderboard/PeriodSelector';
import { LeaderboardSortBar } from '@/components/leaderboard/LeaderboardSortBar';
import { CopySettingsSheet } from '@/components/copyTrading/CopySettingsSheet';
import type { BottomSheetHandle } from '@/components/ui';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useLeaderboardStore } from '@/store/useLeaderboardStore';
import { useCopyTradingStore } from '@/store/useCopyTradingStore';
import { colors, spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import type { LeaderboardEntry } from '@/types/leaderboard';

export default function LeaderboardScreen() {
  const router = useRouter();
  const sheetRef = useRef<BottomSheetHandle>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { entries, isLoading, isSupported } = useLeaderboard();
  const { period, sortKey, setPeriod, setSortKey, addCustomAddress } = useLeaderboardStore();
  const { configs, setConfig } = useCopyTradingStore();

  const filtered = entries.filter(
    (e) =>
      !searchQuery ||
      e.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.label?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  );

  const isAddressInput =
    searchQuery.startsWith('0x') &&
    searchQuery.length >= 10 &&
    !entries.find((e) => e.address.toLowerCase() === searchQuery.toLowerCase());

  const handleFollow = (address: string) => {
    setSelectedAddress(address);
    sheetRef.current?.open();
  };

  const handleSaveConfig = (cfg: {
    isEnabled: boolean;
    sizeRatio: number;
    maxLeverage: number;
    maxOpenPositions: number;
  }) => {
    const now = Date.now();
    setConfig({
      traderAddress: selectedAddress,
      ...cfg,
      createdAt: configs[selectedAddress]?.createdAt ?? now,
      updatedAt: now,
    });
  };

  if (!isSupported) {
    return (
      <SafeArea>
        <Header title="Leaders" leftIcon="chevron-back" onLeftPress={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.unsupportedText}>Leaderboard is available on Hyperliquid.</Text>
          <Text style={styles.unsupportedSub}>Switch to Hyperliquid to view top traders.</Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Header title="Leaders" leftIcon="chevron-back" onLeftPress={() => router.back()} />
      <View style={styles.controls}>
        <PeriodSelector value={period} onChange={setPeriod} />
        <View style={styles.sortRow}>
          <LeaderboardSortBar sortKey={sortKey} onChange={setSortKey} />
        </View>
        <Input
          placeholder="Search or enter 0x address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.search}
        />
        {isAddressInput && (
          <View style={styles.addBanner}>
            <Text style={styles.addBannerText}>Add this address to the leaderboard?</Text>
            <Text
              style={styles.addBannerBtn}
              onPress={() => { addCustomAddress(searchQuery); setSearchQuery(''); }}
            >
              Add
            </Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <View style={styles.skeletons}>
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={56} style={{ marginBottom: 6 }} />)}
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No traders found</Text>
        </View>
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={(item: LeaderboardEntry) => item.address}
          estimatedItemSize={72}
          renderItem={({ item }: { item: LeaderboardEntry }) => (
            <TraderRow
              entry={item}
              onPress={() => router.push(`/trader/${item.address}` as any)}
              onFollow={() => handleFollow(item.address)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <CopySettingsSheet
        ref={sheetRef}
        traderAddress={selectedAddress}
        existingConfig={configs[selectedAddress]}
        onSave={handleSaveConfig}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  controls: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  sortRow: { flexDirection: 'row' },
  search: { marginTop: 2 },
  addBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg.tertiary,
    padding: spacing.sm,
    borderRadius: 8,
  },
  addBannerText: { color: colors.text.secondary, fontSize: 12 },
  addBannerBtn: { color: colors.brand.primary, fontSize: 13, fontWeight: '700' },
  skeletons: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  separator: { height: 1, backgroundColor: colors.border.subtle, marginHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { color: colors.text.tertiary, fontSize: 14 },
  unsupportedText: { color: colors.text.primary, fontSize: 15, fontWeight: '600' },
  unsupportedSub: { color: colors.text.tertiary, fontSize: 13 },
});
