import React, { useRef } from 'react';
import { View, Text, ScrollView, Switch, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Card, Row, Badge, Button, Skeleton } from '@/components/ui';
import { PositionCard } from '@/components/trading/PositionCard';
import { CopySettingsSheet } from '@/components/copyTrading/CopySettingsSheet';
import type { BottomSheetHandle } from '@/components/ui';
import { useTraderProfile } from '@/hooks/useTraderProfile';
import { useCopyTradingStore } from '@/store/useCopyTradingStore';
import { useWalletStore } from '@/store/useWalletStore';
import { colors, spacing } from '@/constants/theme';
import { formatAddress, formatUsd, toNumber } from '@/utils/format';
import { showToast } from '@/store/useToastStore';

export default function TraderDetailScreen() {
  const { address } = useLocalSearchParams<{ address: string }>();
  const router = useRouter();
  const sheetRef = useRef<BottomSheetHandle>(null);

  const { profile, isLoading, isError, refetch } = useTraderProfile(address ?? '');
  const { configs, setConfig, toggleEnabled } = useCopyTradingStore();
  const isConnected = useWalletStore((s) => s.isConnected);

  const config = configs[address ?? ''];
  const isFollowing = !!config;

  const copyAddress = async () => {
    if (!address) return;
    await Clipboard.setStringAsync(address);
    showToast({ type: 'success', message: 'Address copied' });
  };

  const handleSaveConfig = (cfg: {
    isEnabled: boolean;
    sizeRatio: number;
    maxLeverage: number;
    maxOpenPositions: number;
  }) => {
    if (!address) return;
    const now = Date.now();
    setConfig({
      traderAddress: address,
      ...cfg,
      createdAt: config?.createdAt ?? now,
      updatedAt: now,
    });
  };

  if (!address) return null;

  const pnl = toNumber(profile?.unrealizedPnl ?? '0');
  const pnlColor = pnl >= 0 ? colors.up : colors.down;

  return (
    <SafeArea>
      <Header
        title={profile?.label ?? formatAddress(address, 8, 6)}
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
        rightActions={[{ icon: 'copy-outline', onPress: copyAddress }]}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading ? (
          <>
            <Skeleton height={100} />
            <Skeleton height={60} style={{ marginTop: 12 }} />
          </>
        ) : isError ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>Could not load trader data</Text>
            <Button title="Retry" variant="secondary" size="sm" onPress={refetch} />
          </View>
        ) : profile ? (
          <>
            <Card style={styles.statsCard}>
              <Row label="Equity" value={formatUsd(profile.totalEquity)} />
              <View style={styles.pnlRow}>
                <Text style={styles.rowLabel}>Unrealized PnL</Text>
                <Text style={[styles.pnlValue, { color: pnlColor }]}>
                  {pnl >= 0 ? '+' : ''}{formatUsd(pnl)} ({pnl >= 0 ? '+' : ''}{profile.pnlPct.toFixed(2)}%)
                </Text>
              </View>
              <Row
                label="Open Positions"
                value={String(profile.openPositionsCount)}
              />
            </Card>

            <View style={styles.copyRow}>
              <View style={styles.copyLeft}>
                <Ionicons
                  name={isFollowing ? 'copy' : 'copy-outline'}
                  size={18}
                  color={isFollowing ? colors.brand.primary : colors.text.secondary}
                />
                <Text style={styles.copyLabel}>
                  {isFollowing ? 'Copying this trader' : 'Not copying'}
                </Text>
                {isFollowing && (
                  <Badge
                    label={config.isEnabled ? 'Active' : 'Paused'}
                    variant={config.isEnabled ? 'up' : 'neutral'}
                  />
                )}
              </View>
              {isFollowing && (
                <Switch
                  value={config.isEnabled}
                  onValueChange={() => toggleEnabled(address)}
                  trackColor={{ true: colors.brand.primary, false: colors.bg.tertiary }}
                  thumbColor={config.isEnabled ? '#fff' : colors.text.tertiary}
                />
              )}
            </View>

            {!isConnected && (
              <View style={styles.walletBanner}>
                <Ionicons name="wallet-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.walletBannerText}>Connect your wallet to enable copy trading</Text>
              </View>
            )}

            {profile.positions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Open Positions ({profile.positions.length})
                </Text>
                <View style={styles.positionList}>
                  {profile.positions.map((p) => (
                    <Pressable key={`${p.symbol}-${p.side}`}>
                      <PositionCard position={p} />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Button
              title={isFollowing ? 'Edit Copy Settings' : 'Set Up Copy Trading'}
              variant={isFollowing ? 'secondary' : 'primary'}
              size="lg"
              disabled={!isConnected}
              onPress={() => sheetRef.current?.open()}
              style={styles.ctaBtn}
            />
          </>
        ) : null}
      </ScrollView>

      <CopySettingsSheet
        ref={sheetRef}
        traderAddress={address}
        existingConfig={config}
        onSave={handleSaveConfig}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 },
  statsCard: { gap: 6 },
  pnlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3 },
  rowLabel: { color: colors.text.secondary, fontSize: 13 },
  pnlValue: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  copyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  copyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  copyLabel: { color: colors.text.primary, fontSize: 14, fontWeight: '500' },
  walletBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg.tertiary,
    padding: spacing.sm,
    borderRadius: 8,
  },
  walletBannerText: { color: colors.text.secondary, fontSize: 12, flex: 1 },
  sectionTitle: { color: colors.text.primary, fontSize: 15, fontWeight: '700', marginTop: spacing.sm },
  positionList: { gap: spacing.sm },
  ctaBtn: { marginTop: spacing.sm },
  errorWrap: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  errorText: { color: colors.text.secondary, fontSize: 14 },
});
