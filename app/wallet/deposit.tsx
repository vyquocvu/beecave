import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Button, Input, Card, Row } from '@/components/ui';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { PROTOCOLS } from '@/constants/protocols';
import { colors, spacing } from '@/constants/theme';
import { formatAddress } from '@/utils/format';
import { showToast } from '@/store/useToastStore';

export default function DepositScreen() {
  const router = useRouter();
  const address = useWalletStore((s) => s.address);
  const protocol = useAppStore((s) => s.protocol);
  const config = PROTOCOLS[protocol];
  const [amount, setAmount] = useState('');

  const handleCopy = async () => {
    if (!address) return;
    await Clipboard.setStringAsync(address);
    showToast({ type: 'success', message: 'Address copied' });
  };

  return (
    <SafeArea>
      <Header leftIcon="close" onLeftPress={() => router.back()} title="Deposit USDC" />
      <View style={styles.container}>
        <Card>
          <Row label="Network" value={config.name} />
          <Row label="Asset" value="USDC" />
          <Row label="Chain ID" value={String(config.chainId ?? '—')} />
        </Card>

        <Card>
          <Text style={styles.label}>Your Address</Text>
          <Pressable onPress={handleCopy}>
            <Text style={styles.address}>{address ? formatAddress(address, 10, 8) : 'Not connected'}</Text>
          </Pressable>
          <Text style={styles.helper}>Tap to copy. Send USDC only on {config.name}.</Text>
        </Card>

        <Input
          label="Amount (USDC)"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Button
          title="Generate Deposit Tx"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!address || !amount}
          onPress={() => showToast({ type: 'info', message: 'On-chain deposit flow is wallet-specific' })}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md },
  label: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
  address: { color: colors.text.primary, fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  helper: { color: colors.text.tertiary, fontSize: 11, marginTop: 6 },
});
