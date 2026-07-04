import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTradeStore } from '@/store/useTradeStore';
import { useAppStore } from '@/store/useAppStore';
import { useMarketStore } from '@/store/useMarketStore';
import { useWalletStore } from '@/store/useWalletStore';
import { colors, radius, spacing } from '@/constants/theme';
import { Button, Input, Row, Tabs } from '@/components/ui';
import { LeverageSlider } from './LeverageSlider';
import { formatPrice, formatUsd, toNumber } from '@/utils/format';
import { calcFee } from '@/utils/math';
import { validateOrder } from '@/utils/validation';
import { showToast } from '@/store/useToastStore';
import type { OrderSide, OrderType } from '@/types/order';
import { hapticMedium } from '@/utils/haptics';

interface TradeFormProps {
  symbol: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const ORDER_TYPES: { key: OrderType; label: string }[] = [
  { key: 'limit', label: 'Limit' },
  { key: 'market', label: 'Market' },
  { key: 'stop-limit', label: 'Stop-Limit' },
  { key: 'stop-market', label: 'Stop-Market' },
];

export function TradeForm({ symbol, onSubmit, isSubmitting }: TradeFormProps) {
  const store = useTradeStore();
  const protocol = useAppStore((s) => s.protocol);
  const market = useMarketStore((s) => s.getMarket(symbol));
  const snapshot = useWalletStore((s) => s.snapshot);

  const available = toNumber(snapshot?.totalAvailable ?? '0');
  const isLong = store.side === 'long';

  const fee = useMemo(
    () => calcFee(store.notional, protocol, store.orderType === 'market'),
    [store.notional, store.orderType, protocol],
  );

  const handleSubmit = () => {
    const v = validateOrder(
      {
        symbol,
        side: store.side,
        orderType: store.orderType,
        price: store.price,
        size: store.size,
        leverage: store.leverage,
        tpPrice: store.tpPrice,
        slPrice: store.slPrice,
        triggerPrice: store.triggerPrice,
        reduceOnly: store.reduceOnly,
      },
      {
        availableBalance: available,
        minSize: market ? toNumber(market.minSize) : undefined,
        maxLeverage: market?.maxLeverage,
      },
    );
    if (!v.ok) {
      showToast({ type: 'error', message: 'Invalid order', description: v.error });
      return;
    }
    hapticMedium();
    onSubmit();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.sideToggle}>
        <Pressable
          style={[styles.sideBtn, isLong && styles.longActive]}
          onPress={() => store.setSide('long')}
        >
          <Text style={[styles.sideBtnText, isLong && styles.sideBtnActiveText]}>Long / Buy</Text>
        </Pressable>
        <Pressable
          style={[styles.sideBtn, !isLong && styles.shortActive]}
          onPress={() => store.setSide('short')}
        >
          <Text style={[styles.sideBtnText, !isLong && styles.sideBtnActiveText]}>Short / Sell</Text>
        </Pressable>
      </View>

      <Tabs
        variant="segment"
        items={ORDER_TYPES.map((t) => ({ key: t.key, label: t.label }))}
        value={store.orderType}
        onChange={(k) => store.setOrderType(k)}
      />

      {(store.orderType === 'stop-limit' || store.orderType === 'stop-market') && (
        <Input
          label="Trigger Price"
          value={store.triggerPrice}
          onChangeText={store.setTriggerPrice}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
      )}

      {store.orderType !== 'market' && store.orderType !== 'stop-market' && (
        <Input
          label={`Price (${market?.quoteAsset ?? 'USDC'})`}
          value={store.price}
          onChangeText={store.setPrice}
          keyboardType="decimal-pad"
          placeholder="0.00"
          onIncrement={() => store.setPrice(String(toNumber(store.price) + 1))}
          onDecrement={() => store.setPrice(String(Math.max(toNumber(store.price) - 1, 0)))}
        />
      )}

      <Input
        label={`Size (${market?.baseAsset ?? symbol})`}
        value={store.size}
        onChangeText={store.setSize}
        keyboardType="decimal-pad"
        placeholder="0.0000"
        hint={`Available: ${formatUsd(available)} · Max lev: ${market?.maxLeverage ?? 50}x`}
      />

      <View style={styles.pctRow}>
        {[25, 50, 75, 100].map((pct) => (
          <Pressable
            key={pct}
            onPress={() => store.setSizePercent(pct / 100, available)}
            style={styles.pctBtn}
          >
            <Text style={styles.pctBtnText}>{pct}%</Text>
          </Pressable>
        ))}
      </View>

      <LeverageSlider
        value={store.leverage}
        onChange={store.setLeverage}
        max={market?.maxLeverage ?? 50}
      />

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Input
            label="TP Price"
            value={store.tpPrice}
            onChangeText={store.setTPPrice}
            keyboardType="decimal-pad"
            placeholder="optional"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="SL Price"
            value={store.slPrice}
            onChangeText={store.setSLPrice}
            keyboardType="decimal-pad"
            placeholder="optional"
          />
        </View>
      </View>

      <Pressable
        onPress={() => store.setReduceOnly(!store.reduceOnly)}
        style={styles.reduceRow}
      >
        <View style={[styles.checkbox, store.reduceOnly && styles.checkboxOn]}>
          {store.reduceOnly && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.reduceLabel}>Reduce-only</Text>
      </Pressable>

      <View style={styles.summary}>
        <Row label="Notional" value={formatUsd(store.notional)} />
        <Row label="Margin" value={formatUsd(store.margin)} />
        <Row
          label="Liq. Price"
          value={store.liquidationPrice ? `$${formatPrice(store.liquidationPrice)}` : '—'}
          valueColor={colors.down}
        />
        <Row label="Est. Fee" value={formatUsd(fee, 4)} />
      </View>

      <Button
        title={`Place ${isLong ? 'Long' : 'Short'} Order`}
        variant={isLong ? 'success' : 'danger'}
        size="lg"
        fullWidth
        loading={isSubmitting}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md },
  sideToggle: {
    flexDirection: 'row',
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: 3,
  },
  sideBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  longActive: { backgroundColor: colors.up },
  shortActive: { backgroundColor: colors.down },
  sideBtnText: { color: colors.text.secondary, fontSize: 14, fontWeight: '600' },
  sideBtnActiveText: { color: '#FFFFFF' },
  pctRow: { flexDirection: 'row', gap: 6 },
  pctBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  pctBtnText: { color: colors.text.secondary, fontSize: 12, fontWeight: '600' },
  row2: { flexDirection: 'row', gap: spacing.sm },
  reduceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary },
  checkmark: { color: '#0A0B0E', fontSize: 12, fontWeight: '700' },
  reduceLabel: { color: colors.text.secondary, fontSize: 13 },
  summary: {
    backgroundColor: colors.bg.tertiary,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: 2,
  },
});
