import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useWeb3Modal } from '@web3modal/wagmi-react-native';
import { useDisconnect } from 'wagmi';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Card, Button, Badge } from '@/components/ui';
import { ProtocolSwitcher } from '@/components/trading/ProtocolSwitcher';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { showToast } from '@/store/useToastStore';
import { colors, spacing } from '@/constants/theme';
import { formatAddress } from '@/utils/format';
import { APP_CONFIG } from '@/constants/config';

interface MenuItem {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  value?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const address = useWalletStore((s) => s.address);
  const isConnected = useWalletStore((s) => s.isConnected);
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const reset = useAppStore((s) => s.reset);

  const menu: MenuItem[] = [
    { key: 'trading', icon: 'options-outline', label: 'Trading Settings', onPress: () => router.push('/settings') },
    { key: 'notifications', icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/settings/notifications') },
    { key: 'security', icon: 'shield-checkmark-outline', label: 'Security', onPress: () => router.push('/settings/security') },
    { key: 'stats', icon: 'stats-chart-outline', label: 'Trading Stats', onPress: () => showToast({ type: 'info', message: 'Coming soon' }) },
    { key: 'network', icon: 'globe-outline', label: 'Network', value: APP_CONFIG.environment, onPress: () => showToast({ type: 'info', message: `Environment: ${APP_CONFIG.environment}` }) },
    { key: 'help', icon: 'help-circle-outline', label: 'Help & Support', onPress: () => showToast({ type: 'info', message: 'Reach us at support@perpdex.app' }) },
    { key: 'legal', icon: 'document-text-outline', label: 'Terms & Privacy', onPress: () => showToast({ type: 'info', message: 'Docs coming soon' }) },
  ];

  const handleCopy = async () => {
    if (!address) return;
    await Clipboard.setStringAsync(address);
    showToast({ type: 'success', message: 'Address copied' });
  };

  return (
    <SafeArea>
      <Header title="Profile" />
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.walletCard}>
          <View style={styles.walletRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={colors.text.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.walletAddress}>
                {address ? formatAddress(address) : 'No wallet connected'}
              </Text>
              {isConnected && <Badge label="Connected" variant="up" />}
            </View>
            {address && (
              <Pressable onPress={handleCopy} hitSlop={8}>
                <Ionicons name="copy-outline" size={18} color={colors.text.secondary} />
              </Pressable>
            )}
          </View>
          {isConnected ? (
            <Button title="Disconnect" variant="outline" size="sm" onPress={() => disconnect()} />
          ) : (
            <Button title="Connect Wallet" variant="primary" size="md" onPress={() => open()} />
          )}
        </Card>

        <View>
          <Text style={styles.sectionTitle}>Protocol</Text>
          <ProtocolSwitcher />
        </View>

        <Card padded={false} style={{ overflow: 'hidden' }}>
          {menu.map((item, idx) => (
            <Pressable
              key={item.key}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuRow,
                pressed && { backgroundColor: colors.bg.tertiary },
                idx < menu.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.subtle },
              ]}
            >
              <Ionicons name={item.icon} size={18} color={colors.text.secondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
              <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
            </Pressable>
          ))}
        </Card>

        <Button title="Reset App Data" variant="ghost" size="sm" onPress={reset} />
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 40 },
  walletCard: { gap: spacing.md },
  walletRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletAddress: { color: colors.text.primary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  sectionTitle: { color: colors.text.secondary, fontSize: 12, textTransform: 'uppercase', marginBottom: spacing.sm, paddingHorizontal: spacing.lg },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuLabel: { flex: 1, color: colors.text.primary, fontSize: 14 },
  menuValue: { color: colors.text.secondary, fontSize: 12, textTransform: 'capitalize' },
});
