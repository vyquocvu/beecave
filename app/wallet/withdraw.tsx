import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Button, Input, Card, Row } from '@/components/ui';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { PROTOCOLS } from '@/constants/protocols';
import { spacing } from '@/constants/theme';
import { formatUsd, toNumber } from '@/utils/format';
import { isValidAddress } from '@/utils/validation';
import { showToast } from '@/store/useToastStore';

export default function WithdrawScreen() {
  const router = useRouter();
  const snapshot = useWalletStore((s) => s.snapshot);
  const protocol = useAppStore((s) => s.protocol);
  const config = PROTOCOLS[protocol];
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  const available = toNumber(snapshot?.totalAvailable ?? 0);
  const amountOk = toNumber(amount) > 0 && toNumber(amount) <= available;
  const destOk = isValidAddress(destination);

  const handleWithdraw = () => {
    if (!amountOk) return showToast({ type: 'error', message: 'Invalid amount' });
    if (!destOk) return showToast({ type: 'error', message: 'Invalid destination address' });
    showToast({ type: 'info', message: 'Withdraw flow is wallet-specific; integrate per protocol.' });
  };

  return (
    <SafeArea>
      <Header leftIcon="close" onLeftPress={() => router.back()} title="Withdraw USDC" />
      <View style={styles.container}>
        <Card>
          <Row label="Network" value={config.name} />
          <Row label="Available" value={formatUsd(available)} />
        </Card>

        <Input
          label="Destination (0x…)"
          placeholder="0x..."
          autoCapitalize="none"
          value={destination}
          onChangeText={setDestination}
          error={destination && !destOk ? 'Invalid address' : undefined}
        />
        <Input
          label="Amount (USDC)"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          error={amount && !amountOk ? 'Amount exceeds available balance' : undefined}
        />

        <Button
          title="Withdraw"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!amountOk || !destOk}
          onPress={handleWithdraw}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md },
});
