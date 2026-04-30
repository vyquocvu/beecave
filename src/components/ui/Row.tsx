import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/constants/theme';

interface RowProps {
  label: string;
  value: string | React.ReactNode;
  valueColor?: string;
  valueStyle?: TextStyle;
  compact?: boolean;
}

export function Row({ label, value, valueColor, valueStyle, compact }: RowProps) {
  return (
    <View style={[styles.row, compact && { paddingVertical: 4 }]}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={[styles.value, valueColor ? { color: valueColor } : null, valueStyle]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  value: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
