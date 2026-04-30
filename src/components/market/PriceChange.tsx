import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/constants/theme';
import { formatPctChange, toNumber } from '@/utils/format';

interface PriceChangeProps {
  value: number | string;
  style?: TextStyle;
  showIcon?: boolean;
}

export function PriceChange({ value, style, showIcon = false }: PriceChangeProps) {
  const n = toNumber(value);
  const isUp = n >= 0;
  const color = isUp ? colors.up : colors.down;
  return (
    <Text style={[styles.text, { color }, style]}>
      {showIcon ? (isUp ? '↑ ' : '↓ ') : ''}
      {formatPctChange(n)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
