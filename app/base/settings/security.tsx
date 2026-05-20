import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';

export default function BaseSecurityScreen() {
  const router = useRouter();

  const items = [
    { key: 'auth', label: 'Authenticator app', icon: 'key-outline' as const },
    { key: 'passkey', label: 'Passkey', icon: 'finger-print-outline' as const },
    { key: 'anti', label: 'Anti-phishing code', icon: 'shield-outline' as const },
    { key: 'devices', label: 'Device management', icon: 'phone-portrait-outline' as const },
  ];

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Security</BaseText>
        <BaseText color={baseColors.text.secondary}>This section is UI-only in the initial implementation phase.</BaseText>

        <BaseCard padded={false} style={{ overflow: 'hidden' }}>
          {items.map((it, idx) => (
            <Pressable
              key={it.key}
              onPress={() => {}}
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

        <View>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && { opacity: 0.9 }]}>
            <BaseText color={baseColors.text.secondary}>Back</BaseText>
          </Pressable>
        </View>
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
