import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import type { Market } from '@/types/market';
import { colors, radius, spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';
import { PriceChange } from '@/components/market/PriceChange';

interface TradingPairSelectorProps {
  markets: Market[];
  onSelect: (symbol: string) => void;
  onClose?: () => void;
}

export function TradingPairSelector({ markets, onSelect }: TradingPairSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return markets;
    return markets.filter((m) => m.symbol.toUpperCase().includes(q));
  }, [markets, query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.text.tertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search pair"
          placeholderTextColor={colors.text.tertiary}
          style={styles.searchInput}
          autoCapitalize="characters"
        />
      </View>
      <FlashList
        data={filtered}
        keyExtractor={(m) => m.symbol}
        estimatedItemSize={56}
        renderItem={({ item }) => (
          <Pressable onPress={() => onSelect(item.symbol)} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.symbol}>{item.symbol}-PERP</Text>
              <Text style={styles.sub}>Max {item.maxLeverage}x</Text>
            </View>
            <Text style={styles.price}>${formatPrice(item.markPrice)}</Text>
            <View style={{ width: 60, alignItems: 'flex-end' }}>
              <PriceChange value={item.change24hPct} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, color: colors.text.primary, fontSize: 14, paddingVertical: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  symbol: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  sub: { color: colors.text.tertiary, fontSize: 11, marginTop: 2 },
  price: { color: colors.text.primary, fontSize: 14, fontWeight: '600', marginRight: 8, fontVariant: ['tabular-nums'] },
});
