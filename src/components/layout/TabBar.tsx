import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  trade: { active: 'swap-vertical', inactive: 'swap-vertical-outline' },
  portfolio: { active: 'wallet', inactive: 'wallet-outline' },
  earn: { active: 'leaf', inactive: 'leaf-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const descriptor = descriptors[route.key];
        const label = descriptor.options.title ?? route.name;
        const iconPair = ICONS[route.name];
        const icon = focused ? iconPair?.active : iconPair?.inactive;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <Ionicons
              name={icon ?? 'ellipse-outline'}
              size={20}
              color={focused ? colors.brand.primary : colors.text.tertiary}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bg.primary,
    borderTopColor: colors.border.subtle,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    minHeight: 64,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { fontSize: 11, fontWeight: '600', color: colors.text.tertiary },
  labelActive: { color: colors.brand.primary },
});
