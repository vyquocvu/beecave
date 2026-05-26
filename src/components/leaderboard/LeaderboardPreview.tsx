import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { Skeleton } from '@/components/ui';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { formatAddress, formatUsd, toNumber } from '@/utils/format';

export function LeaderboardPreview() {
  const router = useRouter();
  const { entries, isLoading, isSupported } = useLeaderboard();

  if (!isSupported) return null;

  const top3 = entries.slice(0, 3);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push('/leaderboard')} style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy" size={16} color={colors.brand.primary} />
          <Text style={styles.title}>Top Traders</Text>
        </View>
        <View style={styles.seeAll}>
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.text.tertiary} />
        </View>
      </Pressable>

      {isLoading ? (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2].map((i) => <Skeleton key={i} height={52} style={{ marginBottom: 6 }} />)}
        </View>
      ) : (
        top3.map((entry) => {
          const pnl = toNumber(entry.unrealizedPnl);
          const pnlColor = pnl >= 0 ? colors.up : colors.down;
          return (
            <Pressable
              key={entry.address}
              onPress={() => router.push(`/trader/${entry.address}` as any)}
              style={styles.row}
            >
              <Text style={styles.rank}>#{entry.rank}</Text>
              <View style={styles.nameCol}>
                <Text style={styles.name} numberOfLines={1}>
                  {entry.label ?? formatAddress(entry.address, 6, 4)}
                </Text>
              </View>
              <Text style={[styles.pnl, { color: pnlColor }]}>
                {pnl >= 0 ? '+' : ''}{entry.pnlPct.toFixed(1)}%
              </Text>
              <Text style={styles.equity}>{formatUsd(entry.totalEquity)}</Text>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { color: colors.text.tertiary, fontSize: 12 },
  skeletonWrap: { padding: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  rank: { color: colors.text.tertiary, fontSize: 12, fontWeight: '700', width: 24 },
  nameCol: { flex: 1 },
  name: { color: colors.text.primary, fontSize: 13, fontWeight: '600' },
  pnl: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'], minWidth: 52, textAlign: 'right' },
  equity: { color: colors.text.secondary, fontSize: 12, fontVariant: ['tabular-nums'], minWidth: 68, textAlign: 'right' },
});
