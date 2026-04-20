import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';
import { useWalletStore } from '@/store/useWalletStore';
import { formatAddress } from '@/utils/format';
import { colors, spacing, radius } from '@/constants/theme';

export default function SecurityScreen() {
  const router = useRouter();
  const address = useWalletStore((s) => s.address);
  const [biometric, setBiometric] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  return (
    <SafeArea>
      <Header leftIcon="chevron-back" onLeftPress={() => router.back()} title="Security" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <Card>
          <Text style={styles.sectionTitle}>Wallet</Text>
          <View style={styles.walletRow}>
            <View style={styles.walletIcon}>
              <Ionicons name="wallet-outline" color={colors.brand.primary} size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Connected address</Text>
              <Text style={styles.value}>{address ? formatAddress(address) : 'Not connected'}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>App lock</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Biometric unlock</Text>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: colors.bg.tertiary, true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border.subtle }]}>
            <Text style={styles.label}>Auto-lock after 5 min</Text>
            <Switch
              value={autoLock}
              onValueChange={setAutoLock}
              trackColor={{ false: colors.bg.tertiary, true: colors.brand.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Session</Text>
          <Pressable style={styles.actionRow} onPress={() => router.back()}>
            <Text style={[styles.label, { color: colors.down }]}>Revoke all sessions</Text>
            <Ionicons name="chevron-forward" color={colors.text.tertiary} size={18} />
          </Pressable>
        </Card>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  walletRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: colors.text.primary, fontSize: 14 },
  value: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
});
