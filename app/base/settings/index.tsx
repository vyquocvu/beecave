import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';

type Item = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function BaseSettingsScreen() {
  const router = useRouter();

  const items: Item[] = [
    { key: 'security', label: 'Security', icon: 'shield-checkmark-outline', onPress: () => router.push('/base/settings/security') },
    { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', onPress: () => router.push('/base/settings/notifications') },
    { key: 'trading', label: 'Trading preferences', icon: 'options-outline', onPress: () => {} },
    { key: 'about', label: 'About', icon: 'information-circle-outline', onPress: () => {} },
  ];

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Settings</BaseText>

        <BaseCard padded={false} style={{ overflow: 'hidden' }}>
          {items.map((it, idx) => (
            <Pressable
              key={it.key}
              onPress={it.onPress}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: baseColors.bg.tertiary },
                idx < items.length - 1 && styles.divider,
              ]}
            >
              <Ionicons name={it.icon} size={18} color={baseColors.text.secondary} />
              <BaseText style={{ flex: 1 }}>{it.label}</BaseText>
              <Ionicons name="chevron-forward" size={16} color={baseColors.text.tertiary} />
            </Pressable>
          ))}
        </BaseCard>

        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && { opacity: 0.9 }]}>
          <BaseText color={baseColors.text.secondary}>Back</BaseText>
        </Pressable>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: baseSpacing.md,
    paddingHorizontal: baseSpacing.lg,
    paddingVertical: baseSpacing.md,
  },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: baseColors.border.subtle },
  back: { paddingVertical: baseSpacing.md },
});
