import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import type { Market } from '@/types/market';
import { colors, radius, spacing } from '@/constants/theme';
import { formatPrice, formatCompact } from '@/utils/format';
import { PriceChange } from './PriceChange';

interface MarketCardProps {
  market: Market;
  onPress?: () => void;
}

export function MarketCard({ market, onPress }: MarketCardProps) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.push(`/trade/${market.symbol}`))}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.symbol}>{market.symbol}</Text>
        <Text style={styles.quote}>/{market.quoteAsset}</Text>
      </View>
      <Text style={styles.price}>${formatPrice(market.markPrice)}</Text>
      <PriceChange value={market.change24hPct} showIcon />
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Vol</Text>
        <Text style={styles.footerValue}>${formatCompact(market.volume24h)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginRight: spacing.sm,
    gap: 6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'baseline' },
  symbol: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  quote: { color: colors.text.tertiary, fontSize: 11, marginLeft: 2 },
  price: { color: colors.text.primary, fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  footerLabel: { color: colors.text.tertiary, fontSize: 11 },
  footerValue: { color: colors.text.secondary, fontSize: 11, fontVariant: ['tabular-nums'] },
});
