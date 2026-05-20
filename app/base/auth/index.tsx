import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseButton, BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';

export default function BaseAuthEntry() {
  const router = useRouter();

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Welcome</BaseText>
        <BaseText color={baseColors.text.secondary}>
          Authentication flow is UI-only in this phase. Screens mirror a typical exchange navigation structure (login, register, verification).
        </BaseText>

        <BaseCard>
          <View style={{ gap: baseSpacing.md }}>
            <BaseButton title="Sign in" variant="primary" onPress={() => router.push('/base/auth/login')} />
            <BaseButton title="Create account" variant="secondary" onPress={() => router.push('/base/auth/register')} />
          </View>
        </BaseCard>

        <BaseButton title="Close" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </BaseScreen>
  );
}
