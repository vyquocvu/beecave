import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';

export default function BaseNotificationsScreen() {
  const router = useRouter();
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [news, setNews] = useState(false);

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Notifications</BaseText>

        <BaseCard>
          <Row label="Price alerts" value={priceAlerts} onChange={setPriceAlerts} />
          <Row label="Order updates" value={orderUpdates} onChange={setOrderUpdates} />
          <Row label="News" value={news} onChange={setNews} />
        </BaseCard>

        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && { opacity: 0.9 }]}>
          <BaseText color={baseColors.text.secondary}>Back</BaseText>
        </Pressable>
      </ScrollView>
    </BaseScreen>
  );
}

function Row({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <BaseText style={{ flex: 1 }}>{label}</BaseText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: baseColors.bg.overlay, true: baseColors.accent.primary }}
        thumbColor={baseColors.text.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: baseSpacing.md, paddingVertical: baseSpacing.md },
  back: { paddingVertical: baseSpacing.md },
});
