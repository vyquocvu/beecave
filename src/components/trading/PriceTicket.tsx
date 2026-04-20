import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Market } from '@/types/market';
import { colors, spacing } from '@/constants/theme';
import { formatPrice, formatCompact, formatFundingRate } from '@/utils/format';
import { PriceChange } from '@/components/market/PriceChange';

interface PriceTicketProps {
  market: Market | undefined;
  livePrice?: string;
}

export function PriceTicket({ market, livePrice }: PriceTicketProps) {
  if (!market) return null;
  const price = livePrice ?? market.markPrice;
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.price}>${formatPrice(price)}</Text>
        <PriceChange value={market.change24hPct} showIcon />
      </View>
      <View style={styles.metricsRow}>
        <Metric label="24h Vol" value={`$${formatCompact(market.volume24h)}`} />
        <Metric label="OI" value={`$${formatCompact(market.openInterest)}`} />
        <Metric label="Funding" value={formatFundingRate(market.fundingRate)} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  price: { color: colors.text.primary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  metricsRow: { flexDirection: 'row', gap: spacing.xl },
  metricLabel: { color: colors.text.tertiary, fontSize: 10, textTransform: 'uppercase' },
  metricValue: { color: colors.text.primary, fontSize: 13, fontWeight: '600', marginTop: 2, fontVariant: ['tabular-nums'] },
});
