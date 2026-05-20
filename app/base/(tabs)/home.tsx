import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseButton, BaseCard, BaseText } from '@/base/components/ui';
import { baseSpacing } from '@/base/theme';

export default function BaseHomeScreen() {
  const router = useRouter();

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">UI Reference</BaseText>
        <BaseText color="#A0A7B8">
          This route group is a UI-focused implementation intended to match a trading app screen structure and interactions.
        </BaseText>

        <BaseCard>
          <View style={{ gap: baseSpacing.md }}>
            <BaseText variant="heading">Quick Actions</BaseText>
            <View style={{ flexDirection: 'row', gap: baseSpacing.sm }}>
              <BaseButton title="Trade" variant="primary" style={{ flex: 1 }} onPress={() => router.push('/base/trade/BTC')} />
              <BaseButton title="Assets" variant="secondary" style={{ flex: 1 }} onPress={() => router.push('/base/(tabs)/assets')} />
            </View>
          </View>
        </BaseCard>
      </ScrollView>
    </BaseScreen>
  );
}
