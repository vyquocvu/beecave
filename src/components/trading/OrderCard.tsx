import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Order } from '@/types/order';
import { colors, radius, spacing } from '@/constants/theme';
import { Badge, Button, Row } from '@/components/ui';
import { formatPrice, formatSize, formatDate } from '@/utils/format';

interface OrderCardProps {
  order: Order;
  onCancel?: () => void;
}

export function OrderCard({ order, onCancel }: OrderCardProps) {
  const isLong = order.side === 'long';
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Badge label={isLong ? 'LONG' : 'SHORT'} variant={isLong ? 'up' : 'down'} />
          <Text style={styles.symbol}>{order.symbol}-PERP</Text>
          <Badge label={order.orderType.toUpperCase()} variant="neutral" />
          {order.reduceOnly && <Badge label="RO" variant="info" />}
        </View>
        <Badge
          label={order.status.toUpperCase()}
          variant={order.status === 'open' ? 'brand' : 'neutral'}
        />
      </View>
      <Row label="Price" value={`$${formatPrice(order.price)}`} compact />
      <Row
        label="Size"
        value={`${formatSize(order.filledSize, 4)} / ${formatSize(order.size, 4)}`}
        compact
      />
      <Row label="Placed" value={formatDate(order.createdAt)} compact />
      {onCancel && (
        <Button title="Cancel Order" variant="outline" size="sm" onPress={onCancel} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    gap: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  symbol: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
});
