import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Button, Badge, Row } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { formatAddress, formatUsd, toNumber } from '@/utils/format';
import { useCopyTradingStore } from '@/store/useCopyTradingStore';
import type { CopyTradingConfig, CopiedPosition } from '@/types/copyTrading';

interface CopyTradingCardProps {
  config: CopyTradingConfig;
  copiedPositions: CopiedPosition[];
  onViewTrader: () => void;
  onStopAll: () => void;
}

export function CopyTradingCard({ config, copiedPositions, onViewTrader, onStopAll }: CopyTradingCardProps) {
  const toggleEnabled = useCopyTradingStore((s) => s.toggleEnabled);
  const openPositions = copiedPositions.filter((p) => p.isOpen);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.address}>{config.label ?? formatAddress(config.traderAddress, 6, 4)}</Text>
          <Badge
            label={`${openPositions.length} active`}
            variant={openPositions.length > 0 ? 'brand' : 'neutral'}
          />
        </View>
        <Switch
          value={config.isEnabled}
          onValueChange={() => toggleEnabled(config.traderAddress)}
          trackColor={{ true: colors.brand.primary, false: colors.bg.tertiary }}
          thumbColor={config.isEnabled ? '#fff' : colors.text.tertiary}
        />
      </View>

      <View style={styles.settings}>
        <Row label="Size Ratio" value={`${Math.round(config.sizeRatio * 100)}%`} compact />
        <Row label="Max Leverage" value={`${config.maxLeverage}x`} compact />
        <Row label="Max Positions" value={String(config.maxOpenPositions)} compact />
      </View>

      {openPositions.length > 0 && (
        <View style={styles.positions}>
          {openPositions.map((pos) => {
            const pnlColor = toNumber(pos.size) >= 0 ? colors.text.secondary : colors.down;
            return (
              <View key={pos.id} style={styles.posRow}>
                <Text style={styles.posSymbol}>{pos.symbol}</Text>
                <Badge
                  label={pos.side === 'long' ? 'L' : 'S'}
                  variant={pos.side === 'long' ? 'up' : 'down'}
                  size="sm"
                />
                <Text style={[styles.posSize, { color: pnlColor }]}>
                  {formatUsd(pos.size)}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.actions}>
        <Button title="View Trader" variant="secondary" size="sm" onPress={onViewTrader} style={{ flex: 1 }} />
        {openPositions.length > 0 && (
          <Button title="Stop All" variant="danger" size="sm" onPress={onStopAll} style={{ flex: 1 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  address: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  settings: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  positions: { gap: 4 },
  posRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  posSymbol: { flex: 1, color: colors.text.primary, fontSize: 13, fontWeight: '600' },
  posSize: { fontSize: 12, fontVariant: ['tabular-nums'] },
  actions: { flexDirection: 'row', gap: 8 },
});
