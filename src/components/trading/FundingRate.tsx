import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { formatFundingRate, toNumber } from '@/utils/format';

interface FundingRateProps {
  rate: string | number;
  intervalHours?: number;
}

export function FundingRate({ rate, intervalHours = 1 }: FundingRateProps) {
  const n = toNumber(rate);
  const color = n >= 0 ? colors.up : colors.down;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Funding</Text>
      <Text style={[styles.value, { color }]}>{formatFundingRate(rate)}</Text>
      <Text style={styles.interval}>/{intervalHours}h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  label: { color: colors.text.tertiary, fontSize: 11 },
  value: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  interval: { color: colors.text.tertiary, fontSize: 10 },
});
