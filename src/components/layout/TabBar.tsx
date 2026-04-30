import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  trade: 'trending-up-outline',
  portfolio: 'briefcase-outline',
  earn: 'leaf-outline',
  profile: 'person-outline',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const descriptor = descriptors[route.key];
        const label = descriptor.options.title ?? route.name;
        const icon = ICONS[route.name] ?? 'ellipse-outline';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <Ionicons name={icon} size={20} color={focused ? colors.brand.primary : colors.text.tertiary} />
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
    height: 64,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { fontSize: 11, fontWeight: '600', color: colors.text.tertiary },
  labelActive: { color: colors.brand.primary },
});
