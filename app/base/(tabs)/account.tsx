import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseCard, BaseText, BaseButton } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';

type Row = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function BaseAccountScreen() {
  const router = useRouter();

  const rows: Row[] = [
    { key: 'settings', label: 'Settings', icon: 'settings-outline', onPress: () => router.push('/base/settings') },
    { key: 'security', label: 'Security', icon: 'shield-checkmark-outline', onPress: () => router.push('/base/settings/security') },
    { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', onPress: () => router.push('/base/settings/notifications') },
  ];

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Account</BaseText>

        <BaseCard>
          <View style={{ gap: baseSpacing.md }}>
            <BaseText variant="heading">Authentication (UI)</BaseText>
            <BaseButton title="Sign in / Sign up" variant="primary" onPress={() => router.push('/base/auth')} />
          </View>
        </BaseCard>

        <BaseCard padded={false} style={{ overflow: 'hidden' }}>
          {rows.map((row, idx) => (
            <Pressable
              key={row.key}
              onPress={row.onPress}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: baseColors.bg.tertiary },
                idx < rows.length - 1 && styles.divider,
              ]}
            >
              <Ionicons name={row.icon} size={18} color={baseColors.text.secondary} />
              <BaseText style={{ flex: 1 }}>{row.label}</BaseText>
              <Ionicons name="chevron-forward" size={16} color={baseColors.text.tertiary} />
            </Pressable>
          ))}
        </BaseCard>
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
});
