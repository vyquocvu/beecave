import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  containerStyle?: ViewStyle;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftAdornment,
  rightAdornment,
  containerStyle,
  onIncrement,
  onDecrement,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.row,
          isFocused && styles.rowFocused,
          error ? styles.rowError : null,
        ]}
      >
        {onDecrement && (
          <Pressable onPress={onDecrement} style={styles.adjBtn}>
            <Text style={styles.adjBtnText}>−</Text>
          </Pressable>
        )}
        {leftAdornment}
        <TextInput
          placeholderTextColor={colors.text.tertiary}
          style={[styles.input, style]}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightAdornment}
        {onIncrement && (
          <Pressable onPress={onIncrement} style={styles.adjBtn}>
            <Text style={styles.adjBtnText}>+</Text>
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  rowFocused: {
    borderColor: colors.brand.primary,
  },
  rowError: {
    borderColor: colors.down,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  adjBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  adjBtnText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: colors.down,
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 4,
  },
});
