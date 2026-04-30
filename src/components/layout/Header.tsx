import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  rightActions?: Array<{ icon: keyof typeof Ionicons.glyphMap; onPress: () => void }>;
  center?: React.ReactNode;
}

export function Header({ title, subtitle, leftIcon, onLeftPress, rightActions, center }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {leftIcon && (
          <Pressable onPress={onLeftPress} hitSlop={12}>
            <Ionicons name={leftIcon} size={22} color={colors.text.primary} />
          </Pressable>
        )}
      </View>

      <View style={styles.center}>
        {center ? (
          center
        ) : (
          <>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </>
        )}
      </View>

      <View style={styles.side}>
        {rightActions?.map((a, i) => (
          <Pressable key={i} onPress={a.onPress} hitSlop={12} style={{ marginLeft: 12 }}>
            <Ionicons name={a.icon} size={22} color={colors.text.primary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  side: { minWidth: 48, flexDirection: 'row', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text.primary, fontSize: 16, fontWeight: '600' },
  subtitle: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
});
