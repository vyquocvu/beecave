import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'neutral' | 'up' | 'down' | 'brand' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', size = 'sm', style }: BadgeProps) {
  const palette = palettes[variant];
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        size === 'md' ? styles.md : styles.sm,
        style,
      ]}
    >
      <Text style={[styles.label, { color: palette.fg }, size === 'md' && { fontSize: 12 }]}>
        {label}
      </Text>
    </View>
  );
}

const palettes: Record<string, { bg: string; fg: string; border: string }> = {
  neutral: { bg: colors.bg.tertiary, fg: colors.text.secondary, border: colors.border.subtle },
  up: { bg: 'rgba(14,203,129,0.15)', fg: colors.up, border: 'rgba(14,203,129,0.3)' },
  down: { bg: 'rgba(246,70,93,0.15)', fg: colors.down, border: 'rgba(246,70,93,0.3)' },
  brand: { bg: 'rgba(240,180,41,0.15)', fg: colors.brand.primary, border: 'rgba(240,180,41,0.3)' },
  info: { bg: 'rgba(123,97,255,0.15)', fg: '#B9A6FF', border: 'rgba(123,97,255,0.3)' },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
