import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Orderbook, OrderbookLevel } from '@/types/market';
import { colors, spacing } from '@/constants/theme';
import { formatPrice, formatSize, toNumber } from '@/utils/format';

interface OrderBookProps {
  orderbook?: Orderbook;
  onPriceSelect?: (price: string) => void;
  depth?: number;
}

export function OrderBook({ orderbook, onPriceSelect, depth = 10 }: OrderBookProps) {
  const maxSize = useMemo(() => {
    if (!orderbook) return 1;
    const sizes = [...orderbook.asks, ...orderbook.bids].map((l) => toNumber(l.size));
    return Math.max(...sizes, 1);
  }, [orderbook]);

  const asks = useMemo(() => orderbook?.asks.slice(0, depth) ?? [], [orderbook, depth]);
  const bids = useMemo(() => orderbook?.bids.slice(0, depth) ?? [], [orderbook, depth]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { textAlign: 'left' }]}>Price</Text>
        <Text style={[styles.headerText, { textAlign: 'right' }]}>Size</Text>
        <Text style={[styles.headerText, { textAlign: 'right' }]}>Total</Text>
      </View>
      {[...asks].reverse().map((level, i) => (
        <Level key={`ask-${i}`} level={level} side="ask" maxSize={maxSize} onPress={onPriceSelect} />
      ))}
      <View style={styles.spreadRow}>
        <Text style={styles.markPrice}>
          {orderbook?.markPrice ? `$${formatPrice(orderbook.markPrice)}` : '—'}
        </Text>
        <Text style={styles.spread}>
          Spread {orderbook?.spread ? `${parseFloat(orderbook.spread).toFixed(3)}%` : '—'}
        </Text>
      </View>
      {bids.map((level, i) => (
        <Level key={`bid-${i}`} level={level} side="bid" maxSize={maxSize} onPress={onPriceSelect} />
      ))}
    </View>
  );
}

function Level({
  level,
  side,
  maxSize,
  onPress,
}: {
  level: OrderbookLevel;
  side: 'ask' | 'bid';
  maxSize: number;
  onPress?: (price: string) => void;
}) {
  const depthPct = Math.min((toNumber(level.size) / maxSize) * 100, 100);
  const depthColor = side === 'ask' ? 'rgba(246,70,93,0.15)' : 'rgba(14,203,129,0.15)';
  const priceColor = side === 'ask' ? colors.down : colors.up;
  return (
    <Pressable
      onPress={() => onPress?.(level.price)}
      style={({ pressed }) => [styles.level, pressed && { backgroundColor: 'rgba(255,255,255,0.02)' }]}
    >
      <View
        style={[
          styles.depthBar,
          { width: `${depthPct}%`, backgroundColor: depthColor, [side === 'ask' ? 'right' : 'left']: 0 },
        ]}
      />
      <Text style={[styles.price, { color: priceColor }]}>{formatPrice(level.price)}</Text>
      <Text style={styles.size}>{formatSize(level.size, 3)}</Text>
      <Text style={styles.total}>{formatSize(level.total ?? '0', 3)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  headerText: { color: colors.text.tertiary, fontSize: 10, flex: 1, textTransform: 'uppercase' },
  level: {
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 4,
    position: 'relative',
    alignItems: 'center',
  },
  depthBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  price: { flex: 1, fontSize: 12, fontVariant: ['tabular-nums'], fontWeight: '600' },
  size: { flex: 1, textAlign: 'right', color: colors.text.secondary, fontSize: 12, fontVariant: ['tabular-nums'] },
  total: { flex: 1, textAlign: 'right', color: colors.text.tertiary, fontSize: 12, fontVariant: ['tabular-nums'] },
  spreadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginVertical: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
  },
  markPrice: { color: colors.text.primary, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  spread: { color: colors.text.tertiary, fontSize: 11 },
});
