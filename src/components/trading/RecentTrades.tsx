import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Trade } from '@/types/market';
import { colors, spacing } from '@/constants/theme';
import { formatPrice, formatSize, formatTime } from '@/utils/format';

interface RecentTradesProps {
  trades: Trade[];
  limit?: number;
}

export function RecentTrades({ trades, limit = 20 }: RecentTradesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Price</Text>
        <Text style={styles.headerText}>Size</Text>
        <Text style={[styles.headerText, { textAlign: 'right' }]}>Time</Text>
      </View>
      {trades.slice(0, limit).map((t) => (
        <View key={t.id} style={styles.row}>
          <Text style={[styles.price, { color: t.side === 'buy' ? colors.up : colors.down }]}>
            {formatPrice(t.price)}
          </Text>
          <Text style={styles.size}>{formatSize(t.size, 4)}</Text>
          <Text style={styles.time}>{formatTime(t.time)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.sm },
  headerRow: { flexDirection: 'row', paddingVertical: 6 },
  headerText: { flex: 1, color: colors.text.tertiary, fontSize: 10, textTransform: 'uppercase' },
  row: { flexDirection: 'row', paddingVertical: 3 },
  price: { flex: 1, fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
  size: { flex: 1, color: colors.text.secondary, fontSize: 12, fontVariant: ['tabular-nums'] },
  time: { flex: 1, color: colors.text.tertiary, fontSize: 11, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
