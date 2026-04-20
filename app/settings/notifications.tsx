import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

type Toggles = {
  priceAlerts: boolean;
  orderFilled: boolean;
  liquidationWarnings: boolean;
  fundingUpdates: boolean;
  news: boolean;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<Toggles>({
    priceAlerts: true,
    orderFilled: true,
    liquidationWarnings: true,
    fundingUpdates: false,
    news: false,
  });

  const update = (key: keyof Toggles) => (v: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: v }));

  const items: { key: keyof Toggles; label: string; hint: string }[] = [
    { key: 'priceAlerts', label: 'Price alerts', hint: 'Triggered when your watched symbols hit a threshold' },
    { key: 'orderFilled', label: 'Order filled', hint: 'Limit & stop order execution events' },
    { key: 'liquidationWarnings', label: 'Liquidation warnings', hint: 'Margin ratio approaches liquidation' },
    { key: 'fundingUpdates', label: 'Funding updates', hint: 'Hourly funding rate changes' },
    { key: 'news', label: 'Protocol news', hint: 'Announcements from Hyperliquid, Lighter, Aster' },
  ];

  return (
    <SafeArea>
      <Header leftIcon="chevron-back" onLeftPress={() => router.back()} title="Notifications" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <Card>
          {items.map((it, idx) => (
            <View key={it.key} style={[styles.row, idx < items.length - 1 && styles.divider]}>
              <View style={{ flex: 1, paddingRight: spacing.md }}>
                <Text style={styles.label}>{it.label}</Text>
                <Text style={styles.hint}>{it.hint}</Text>
              </View>
              <Switch
                value={toggles[it.key]}
                onValueChange={update(it.key)}
                trackColor={{ false: colors.bg.tertiary, true: colors.brand.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border.subtle },
  label: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  hint: { color: colors.text.tertiary, fontSize: 12, marginTop: 2 },
});
