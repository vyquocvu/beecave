import React from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Card, Row } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { colors, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <SafeArea>
      <Header leftIcon="chevron-back" onLeftPress={() => router.back()} title="Trading Settings" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <Card>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Dark theme</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
              trackColor={{ false: colors.bg.tertiary, true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Defaults</Text>
          <Row label="Order confirmations" value="On" />
          <Row label="Haptics" value="On" />
          <Row label="Price alerts" value="Off" />
        </Card>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  label: { color: colors.text.primary, fontSize: 14 },
});
