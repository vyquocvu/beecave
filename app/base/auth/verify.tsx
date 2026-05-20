import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseButton, BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseRadius, baseSpacing } from '@/base/theme';

export default function BaseVerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const sanitized = useMemo(() => code.replace(/\D/g, '').slice(0, 6), [code]);

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Verification</BaseText>
        <BaseText color={baseColors.text.secondary}>Enter the 6-digit code.</BaseText>

        <BaseCard>
          <View style={{ gap: baseSpacing.md }}>
            <TextInput
              value={sanitized}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="000000"
              placeholderTextColor={baseColors.text.tertiary}
              style={styles.codeInput}
            />
            <BaseButton
              title="Confirm"
              variant="primary"
              fullWidth
              disabled={sanitized.length !== 6}
              onPress={() => router.replace('/base/(tabs)/account')}
            />
          </View>
        </BaseCard>

        <BaseButton title="Back" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  codeInput: {
    borderWidth: 1,
    borderColor: baseColors.border.default,
    backgroundColor: baseColors.bg.tertiary,
    borderRadius: baseRadius.md,
    paddingHorizontal: baseSpacing.md,
    paddingVertical: baseSpacing.md,
    color: baseColors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 6,
    textAlign: 'center',
  },
});
