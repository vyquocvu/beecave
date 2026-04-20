import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Position } from '@/types/position';
import { colors, radius, spacing } from '@/constants/theme';
import { Button, Badge, Row } from '@/components/ui';
import { formatPrice, formatSize, formatUsd, toNumber } from '@/utils/format';

interface PositionCardProps {
  position: Position;
  onClose?: () => void;
  onEditTPSL?: () => void;
  onShare?: () => void;
}

export function PositionCard({ position, onClose, onEditTPSL, onShare }: PositionCardProps) {
  const isLong = position.side === 'long';
  const pnl = toNumber(position.unrealizedPnl);
  const pnlColor = pnl >= 0 ? colors.up : colors.down;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Badge
            label={isLong ? 'LONG' : 'SHORT'}
            variant={isLong ? 'up' : 'down'}
            size="md"
          />
          <Text style={styles.symbol}>{position.symbol}-PERP</Text>
          <Badge label={`${position.leverage}x`} variant="neutral" />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.pnl, { color: pnlColor }]}>
            {pnl >= 0 ? '+' : ''}
            {formatUsd(pnl)}
          </Text>
          <Text style={[styles.roe, { color: pnlColor }]}>
            {pnl >= 0 ? '+' : ''}
            {position.roe}%
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Row
          label="Size"
          value={`${formatSize(position.size, 4)} ${position.symbol}`}
          compact
        />
        <Row label="Notional" value={formatUsd(position.notional)} compact />
        <Row label="Entry" value={`$${formatPrice(position.entryPrice)}`} compact />
        <Row label="Mark" value={`$${formatPrice(position.markPrice)}`} compact />
        <Row
          label="Liq. Price"
          value={position.liquidationPrice ? `$${formatPrice(position.liquidationPrice)}` : '—'}
          valueColor={colors.down}
          compact
        />
        <Row label="Margin" value={formatUsd(position.marginUsed)} compact />
      </View>

      <View style={styles.actions}>
        <Button title="TP/SL" variant="secondary" size="sm" onPress={onEditTPSL} style={{ flex: 1 }} />
        <Button title="Close" variant="danger" size="sm" onPress={onClose} style={{ flex: 1 }} />
        {onShare && (
          <Button title="Share" variant="outline" size="sm" onPress={onShare} style={{ flex: 1 }} />
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  symbol: { color: colors.text.primary, fontSize: 15, fontWeight: '700' },
  pnl: { fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  roe: { fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
  metrics: {
    backgroundColor: colors.bg.tertiary,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  actions: { flexDirection: 'row', gap: 8 },
});
