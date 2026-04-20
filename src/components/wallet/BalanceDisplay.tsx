import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { formatUsd, toNumber } from '@/utils/format';
import { PriceChange } from '@/components/market/PriceChange';
import type { WalletSnapshot } from '@/types/wallet';

interface BalanceDisplayProps {
  snapshot: WalletSnapshot | null;
}

export function BalanceDisplay({ snapshot }: BalanceDisplayProps) {
  const equity = toNumber(snapshot?.totalEquity ?? 0);
  const upnl = toNumber(snapshot?.unrealizedPnl ?? 0);
  const pnlPct = equity > 0 ? (upnl / equity) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Portfolio Value</Text>
      <Text style={styles.value}>{formatUsd(equity)}</Text>
      <View style={styles.row}>
        <PriceChange value={pnlPct} showIcon />
        <Text style={styles.pnl}>
          {upnl >= 0 ? '+' : ''}
          {formatUsd(upnl)}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Available</Text>
        <Text style={styles.metaValue}>{formatUsd(snapshot?.totalAvailable ?? 0)}</Text>
        <Text style={styles.metaLabel}>Margin</Text>
        <Text style={styles.metaValue}>{formatUsd(snapshot?.totalMarginUsed ?? 0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, gap: 6 },
  label: { color: colors.text.secondary, fontSize: 13 },
  value: { color: colors.text.primary, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pnl: { color: colors.text.secondary, fontSize: 13, fontVariant: ['tabular-nums'] },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 8 },
  metaLabel: { color: colors.text.tertiary, fontSize: 11, textTransform: 'uppercase' },
  metaValue: { color: colors.text.primary, fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
