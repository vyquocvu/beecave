import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Balance } from '@/types/wallet';
import { colors, radius, spacing } from '@/constants/theme';
import { formatSize, formatUsd, toNumber } from '@/utils/format';

interface AssetCardProps {
  balance: Balance;
}

export function AssetCard({ balance }: AssetCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{balance.asset[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.asset}>{balance.asset}</Text>
          <Text style={styles.sub}>
            Avail: {formatSize(balance.available, 4)}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.total}>{formatSize(balance.total, 4)}</Text>
          <Text style={styles.usd}>{formatUsd(toNumber(balance.usdValue ?? balance.total))}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: colors.text.primary, fontWeight: '700' },
  asset: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  sub: { color: colors.text.tertiary, fontSize: 12, marginTop: 2 },
  total: { color: colors.text.primary, fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  usd: { color: colors.text.secondary, fontSize: 12, marginTop: 2, fontVariant: ['tabular-nums'] },
});
