import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { hapticLight } from '@/utils/haptics';
import { baseColors, baseRadius, baseSpacing } from '@/base/theme';

export type BaseButtonVariant = 'primary' | 'secondary' | 'buy' | 'sell' | 'ghost';
export type BaseButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: BaseButtonVariant;
  size?: BaseButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
};

export function BaseButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  style,
  textStyle,
  haptic = true,
}: Props) {
  const isDisabled = disabled || loading;
  const paletteStyle = palette[variant];
  const sizeStyle = sizes[size];

  return (
    <Pressable
      onPress={() => {
        if (isDisabled) return;
        if (haptic) hapticLight();
        onPress?.();
      }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        paletteStyle.container,
        sizeStyle.container,
        fullWidth && { alignSelf: 'stretch' },
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        isDisabled && { opacity: 0.4 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={paletteStyle.textColor} />
      ) : (
        <Text style={[styles.text, sizeStyle.text, { color: paletteStyle.textColor }, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const palette: Record<BaseButtonVariant, { container: ViewStyle; textColor: string }> = {
  primary: { container: { backgroundColor: baseColors.accent.primary }, textColor: '#FFFFFF' },
  secondary: { container: { backgroundColor: baseColors.bg.tertiary }, textColor: baseColors.text.primary },
  buy: { container: { backgroundColor: baseColors.semantic.buy }, textColor: '#FFFFFF' },
  sell: { container: { backgroundColor: baseColors.semantic.sell }, textColor: '#FFFFFF' },
  ghost: { container: { backgroundColor: 'transparent' }, textColor: baseColors.text.primary },
};

const sizes: Record<BaseButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingVertical: baseSpacing.sm, paddingHorizontal: baseSpacing.md, borderRadius: baseRadius.sm },
    text: { fontSize: 13, fontWeight: '700' },
  },
  md: {
    container: { paddingVertical: baseSpacing.md, paddingHorizontal: baseSpacing.lg, borderRadius: baseRadius.md },
    text: { fontSize: 14, fontWeight: '700' },
  },
  lg: {
    container: { paddingVertical: baseSpacing.lg, paddingHorizontal: baseSpacing.xl, borderRadius: baseRadius.md },
    text: { fontSize: 16, fontWeight: '800' },
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
