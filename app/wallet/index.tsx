import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { AssetCard } from '@/components/wallet/AssetCard';
import { Button, Skeleton } from '@/components/ui';
import { useWalletSnapshot } from '@/hooks';
import { useWalletStore } from '@/store/useWalletStore';
import { colors, spacing } from '@/constants/theme';

export default function WalletScreen() {
  const router = useRouter();
  const snapshot = useWalletStore((s) => s.snapshot);
  const balances = useWalletStore((s) => s.balances);
  const { isLoading } = useWalletSnapshot();

  return (
    <SafeArea>
      <Header
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
        title="Wallet"
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <BalanceDisplay snapshot={snapshot} />

        <View style={styles.actions}>
          <Button title="Deposit" variant="primary" fullWidth onPress={() => router.push('/wallet/deposit')} style={{ flex: 1 }} />
          <Button title="Withdraw" variant="secondary" fullWidth onPress={() => router.push('/wallet/withdraw')} style={{ flex: 1 }} />
        </View>

        <Text style={styles.sectionTitle}>Assets</Text>
        <View style={styles.list}>
          {isLoading ? (
            <Skeleton height={64} />
          ) : balances.length === 0 ? (
            <Text style={styles.empty}>No assets</Text>
          ) : (
            balances.map((b) => <AssetCard key={b.asset} balance={b} />)
          )}
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  empty: { color: colors.text.tertiary, paddingHorizontal: spacing.lg },
});
