import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import { baseColors, baseRadius, baseSpacing } from '@/base/theme';

type Props = ViewProps & {
  padded?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function BaseCard({ padded = true, style, ...rest }: Props) {
  return <View {...rest} style={[styles.base, padded && styles.padded, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: baseColors.bg.secondary,
    borderRadius: baseRadius.md,
    borderWidth: 1,
    borderColor: baseColors.border.subtle,
  },
  padded: {
    padding: baseSpacing.lg,
  },
});
