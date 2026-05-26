import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { formatAddress, formatUsd, formatPctChange, toNumber } from '@/utils/format';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface TraderRowProps {
  entry: LeaderboardEntry;
  onPress: () => void;
  onFollow: () => void;
}

const RANK_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export function TraderRow({ entry, onPress, onFollow }: TraderRowProps) {
  const pnl = toNumber(entry.unrealizedPnl);
  const pnlColor = pnl >= 0 ? colors.up : colors.down;
  const rankColor = RANK_COLORS[entry.rank] ?? colors.text.tertiary;

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={[styles.rankBadge, entry.rank <= 3 && { borderColor: rankColor }]}>
        <Text style={[styles.rankText, { color: rankColor }]}>{entry.rank}</Text>
      </View>

      <View style={styles.traderInfo}>
        <Text style={styles.label} numberOfLines={1}>
          {entry.label ?? formatAddress(entry.address, 6, 4)}
        </Text>
        {entry.label && (
          <Text style={styles.address} numberOfLines={1}>
            {formatAddress(entry.address, 6, 4)}
          </Text>
        )}
      </View>

      <View style={styles.pnlCol}>
        <Text style={[styles.pnlPct, { color: pnlColor }]}>
          {entry.pnlPct >= 0 ? '+' : ''}{formatPctChange(entry.pnlPct)}
        </Text>
      </View>

      <View style={styles.equityCol}>
        <Text style={styles.equity}>{formatUsd(entry.totalEquity)}</Text>
      </View>

      <Pressable onPress={onFollow} style={styles.followBtn} hitSlop={8}>
        <Ionicons
          name={entry.isFollowing ? 'checkmark-circle' : 'add-circle-outline'}
          size={22}
          color={entry.isFollowing ? colors.up : colors.text.tertiary}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  traderInfo: { flex: 2 },
  label: { color: colors.text.primary, fontSize: 13, fontWeight: '600' },
  address: { color: colors.text.tertiary, fontSize: 11, marginTop: 1 },
  pnlCol: { flex: 1, alignItems: 'flex-end' },
  pnlPct: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  equityCol: { flex: 1.2, alignItems: 'flex-end' },
  equity: { color: colors.text.secondary, fontSize: 12, fontVariant: ['tabular-nums'] },
  followBtn: { width: 32, alignItems: 'center' },
});
