import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { BaseScreen } from '@/base/components/layout';
import { BaseButton, BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';
import { useWalletSnapshot } from '@/hooks';
import { useWalletStore } from '@/store/useWalletStore';
import { Skeleton } from '@/components/ui';
import { formatUsd } from '@/utils/format';

export default function BaseAssetsScreen() {
  const router = useRouter();
  const snapshot = useWalletStore((s) => s.snapshot);
  const balances = useWalletStore((s) => s.balances);
  const { isLoading } = useWalletSnapshot();

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title" style={{ marginBottom: baseSpacing.lg }}>
          Assets
        </BaseText>

        <BaseCard style={{ marginBottom: baseSpacing.lg }}>
          <BaseText color={baseColors.text.secondary} style={{ marginBottom: baseSpacing.sm }}>
            Total Assets
          </BaseText>
          <BaseText variant="price">{formatUsd(snapshot?.totalEquity ?? 0)}</BaseText>

          <View style={styles.actions}>
            <BaseButton title="Deposit" variant="primary" style={{ flex: 1 }} onPress={() => router.push('/wallet/deposit')} />
            <BaseButton title="Withdraw" variant="secondary" style={{ flex: 1 }} onPress={() => router.push('/wallet/withdraw')} />
          </View>
        </BaseCard>

        <BaseText color={baseColors.text.secondary} style={styles.sectionTitle}>
          Assets
        </BaseText>

        <BaseCard padded={false}>
          <View style={{ padding: baseSpacing.lg, paddingTop: baseSpacing.md }}>
            {isLoading ? (
              <Skeleton height={64} />
            ) : balances.length === 0 ? (
              <Text style={styles.empty}>No assets</Text>
            ) : (
              balances.slice(0, 25).map((b) => (
                <View key={b.asset} style={styles.assetRow}>
                  <BaseText style={{ flex: 1 }}>{b.asset}</BaseText>
                  <BaseText color={baseColors.text.secondary}>{b.total}</BaseText>
                </View>
              ))
            )}
          </View>
        </BaseCard>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: baseSpacing.sm, marginTop: baseSpacing.lg },
  sectionTitle: { marginBottom: baseSpacing.sm, fontSize: 12, textTransform: 'uppercase' },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: baseSpacing.md,
    paddingVertical: baseSpacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: baseColors.border.subtle,
  },
  empty: { color: baseColors.text.tertiary },
});
