import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Market } from '@/types/market';
import { colors, spacing } from '@/constants/theme';
import { formatPrice, formatCompact } from '@/utils/format';
import { PriceChange } from './PriceChange';
import { useAppStore } from '@/store/useAppStore';

interface MarketListProps {
  markets: Market[];
  onSelect?: (symbol: string) => void;
  ListHeader?: React.ReactElement | null;
}

export function MarketList({ markets, onSelect, ListHeader }: MarketListProps) {
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  return (
    <FlashList
      data={markets}
      keyExtractor={(item) => item.symbol}
      estimatedItemSize={64}
      ListHeaderComponent={
        <>
          {ListHeader}
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, { flex: 1.2 }]}>Symbol</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>Price</Text>
            <Text style={[styles.headerText, { flex: 0.9, textAlign: 'right' }]}>24h</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>Vol</Text>
          </View>
        </>
      }
      renderItem={({ item }) => {
        const isFav = favorites.includes(item.symbol);
        return (
          <Pressable
            onPress={() =>
              onSelect ? onSelect(item.symbol) : router.push(`/trade/${item.symbol}`)
            }
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
          >
            <View style={[styles.cell, { flex: 1.2, flexDirection: 'row', alignItems: 'center' }]}>
              <Pressable onPress={() => toggleFavorite(item.symbol)} hitSlop={8} style={{ marginRight: 8 }}>
                <Ionicons
                  name={isFav ? 'star' : 'star-outline'}
                  size={14}
                  color={isFav ? colors.brand.primary : colors.text.tertiary}
                />
              </Pressable>
              <View>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.quote}>{item.baseAsset}/{item.quoteAsset} · {item.maxLeverage}x</Text>
              </View>
            </View>
            <Text style={[styles.price, { flex: 1, textAlign: 'right' }]}>
              ${formatPrice(item.markPrice)}
            </Text>
            <View style={{ flex: 0.9, alignItems: 'flex-end' }}>
              <PriceChange value={item.change24hPct} />
            </View>
            <Text style={[styles.vol, { flex: 1, textAlign: 'right' }]}>
              ${formatCompact(item.volume24h)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  headerText: { color: colors.text.tertiary, fontSize: 11, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  cell: {},
  symbol: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  quote: { color: colors.text.tertiary, fontSize: 11, marginTop: 2 },
  price: { color: colors.text.primary, fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  vol: { color: colors.text.secondary, fontSize: 12, fontVariant: ['tabular-nums'] },
});
