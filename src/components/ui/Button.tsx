import React from 'react';
import { Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import { colors, radius, spacing } from '@/constants/theme';
import { hapticLight } from '@/utils/haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export function Button({
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  children,
  title,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const paletteStyle = palette[variant];
  const sizeStyle = sizes[size];

  return (
    <MotiPressable
      onPress={() => {
        if (isDisabled) return;
        if (haptic) hapticLight();
        onPress?.();
      }}
      disabled={isDisabled}
      style={[
        styles.base,
        paletteStyle.container,
        sizeStyle.container,
        fullWidth && { alignSelf: 'stretch' },
        isDisabled && { opacity: 0.4 },
        style,
      ]}
      animate={({ pressed }) => {
        'worklet';
        return {
          scale: pressed && !isDisabled ? 0.96 : 1,
          opacity: pressed && !isDisabled ? 0.85 : 1,
        };
      }}
      transition={{ type: 'timing', duration: 150 }}
    >
      {loading ? (
        <ActivityIndicator color={paletteStyle.textColor} size="small" />
      ) : children ? (
        children
      ) : (
        <Text style={[styles.text, { color: paletteStyle.textColor }, sizeStyle.text, textStyle]}>
          {title}
        </Text>
      )}
    </MotiPressable>
  );
}

const palette: Record<ButtonVariant, { container: ViewStyle; textColor: string }> = {
  primary: {
    container: { backgroundColor: colors.brand.primary },
    textColor: '#181a20',
  },
  secondary: {
    container: { backgroundColor: colors.bg.tertiary },
    textColor: colors.text.primary,
  },
  success: {
    container: { backgroundColor: colors.up },
    textColor: '#FFFFFF',
  },
  danger: {
    container: { backgroundColor: colors.down },
    textColor: '#FFFFFF',
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    textColor: colors.text.primary,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    textColor: colors.text.primary,
  },
};

const sizes: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.sm },
    text: { fontSize: 13, fontWeight: '600' },
  },
  md: {
    container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.md },
    text: { fontSize: 14, fontWeight: '600' },
  },
  lg: {
    container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radius.lg },
    text: { fontSize: 16, fontWeight: '700' },
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
