import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseButton, BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseRadius, baseSpacing } from '@/base/theme';

export default function BaseLoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, gap: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title">Sign in</BaseText>

        <BaseCard>
          <View style={{ gap: baseSpacing.md }}>
            <View style={{ gap: baseSpacing.sm }}>
              <BaseText color={baseColors.text.secondary}>Email / Phone</BaseText>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                placeholder="name@example.com"
                placeholderTextColor={baseColors.text.tertiary}
                style={styles.input}
              />
            </View>

            <View style={{ gap: baseSpacing.sm }}>
              <BaseText color={baseColors.text.secondary}>Password</BaseText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={baseColors.text.tertiary}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <BaseButton
              title="Continue"
              variant="primary"
              fullWidth
              onPress={() => router.push('/base/auth/verify')}
              disabled={!identifier || !password}
            />
          </View>
        </BaseCard>

        <BaseButton title="Back" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: baseColors.border.default,
    backgroundColor: baseColors.bg.tertiary,
    borderRadius: baseRadius.md,
    paddingHorizontal: baseSpacing.md,
    paddingVertical: baseSpacing.md,
    color: baseColors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
