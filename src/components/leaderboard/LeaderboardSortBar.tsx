import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import type { LeaderboardSortKey } from '@/types/leaderboard';

interface LeaderboardSortBarProps {
  sortKey: LeaderboardSortKey;
  onChange: (k: LeaderboardSortKey) => void;
}

const OPTIONS: { key: LeaderboardSortKey; label: string }[] = [
  { key: 'equity', label: 'Equity' },
  { key: 'pnlPct', label: 'PnL %' },
  { key: 'openPositions', label: 'Positions' },
];

export function LeaderboardSortBar({ sortKey, onChange }: LeaderboardSortBarProps) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => {
        const active = opt.key === sortKey;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.bg.tertiary,
  },
  chipActive: { borderColor: colors.brand.primary, backgroundColor: 'transparent' },
  chipText: { color: colors.text.secondary, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.brand.primary },
});
