import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BottomSheet } from '@/components/ui';
import type { BottomSheetHandle } from '@/components/ui';
import { TradingPairSelector } from '@/components/trading/TradingPairSelector';
import { CandlestickChart } from '@/components/trading/CandlestickChart';
import { OrderBook } from '@/components/trading/OrderBook';
import { RecentTrades } from '@/components/trading/RecentTrades';
import { useCandles, useMarkets, useOrderBook, useRecentTrades, useTrading } from '@/hooks';
import { useSigner } from '@/hooks/useSigner';
import { useAppStore } from '@/store/useAppStore';
import { useMarketStore } from '@/store/useMarketStore';
import { useTradeStore } from '@/store/useTradeStore';
import type { CandleInterval } from '@/types/market';
import { DEFAULT_INTERVAL, DEFAULT_SYMBOL } from '@/constants/markets';
import { BaseScreen } from '@/base/components/layout';
import { BaseButton, BaseCard, BaseSegmentedControl, BaseText } from '@/base/components/ui';
import { baseColors, baseRadius, baseSpacing } from '@/base/theme';
import { formatPrice } from '@/utils/format';

type RightPanel = 'orderbook' | 'trades';

export default function BaseTradeDetailScreen() {
  const { symbol: rawSymbol } = useLocalSearchParams<{ symbol: string }>();
  const symbol = rawSymbol ?? DEFAULT_SYMBOL;
  const router = useRouter();
  const sheetRef = React.useRef<BottomSheetHandle>(null);

  const [interval, setInterval] = useState<CandleInterval>(DEFAULT_INTERVAL);
  const [rightPanel, setRightPanel] = useState<RightPanel>('orderbook');

  useMarkets();
  const markets = useMarketStore((s) => s.markets);
  const livePrices = useMarketStore((s) => s.prices);
  const setSelectedSymbol = useMarketStore((s) => s.setSelectedSymbol);
  const addRecent = useAppStore((s) => s.addRecentSymbol);

  const signer = useSigner();
  const tradeStore = useTradeStore();
  const { placeOrder, isPlacing } = useTrading({ signer });

  const market = useMemo(() => markets.find((m) => m.symbol === symbol), [markets, symbol]);
  const orderbook = useOrderBook(symbol);
  const trades = useRecentTrades(symbol);
  const { candles } = useCandles(symbol, interval);

  useEffect(() => {
    setSelectedSymbol(symbol);
    tradeStore.setSymbol(symbol);
    addRecent(symbol);
  }, [symbol, setSelectedSymbol, addRecent]);

  const livePrice = livePrices[symbol] ?? market?.markPrice;

  const submit = () => {
    placeOrder({
      symbol,
      side: tradeStore.side,
      orderType: tradeStore.orderType,
      price: tradeStore.price,
      size: tradeStore.size,
      leverage: tradeStore.leverage,
      reduceOnly: tradeStore.reduceOnly,
      tpPrice: tradeStore.tpPrice || undefined,
      slPrice: tradeStore.slPrice || undefined,
      triggerPrice: tradeStore.triggerPrice || undefined,
    });
  };

  return (
    <BaseScreen contentStyle={{ paddingHorizontal: 0 }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={20} color={baseColors.text.primary} />
        </Pressable>

        <Pressable onPress={() => sheetRef.current?.open()} style={styles.symbolBtn}>
          <BaseText style={styles.symbolText}>{symbol}-PERP</BaseText>
          <Ionicons name="chevron-down" size={16} color={baseColors.text.secondary} />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable onPress={() => useAppStore.getState().toggleFavorite(symbol)} hitSlop={10} style={styles.headerBtn}>
            <Ionicons name="star-outline" size={18} color={baseColors.text.secondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: baseSpacing.lg, paddingTop: baseSpacing.md, gap: baseSpacing.lg }}>
          <BaseCard>
            <BaseText color={baseColors.text.secondary} style={{ marginBottom: baseSpacing.sm }}>
              Mark Price
            </BaseText>
            <BaseText variant="price">{formatPrice(livePrice ?? 0)}</BaseText>
          </BaseCard>

          <BaseCard padded={false} style={{ overflow: 'hidden' }}>
            <View style={{ paddingTop: baseSpacing.md }}>
              <CandlestickChart
                candles={candles}
                interval={interval}
                onIntervalChange={setInterval}
                height={260}
              />
            </View>
          </BaseCard>

          <BaseSegmentedControl
            items={[
              { key: 'orderbook', label: 'Order book' },
              { key: 'trades', label: 'Trades' },
            ]}
            value={rightPanel}
            onChange={setRightPanel}
          />

          <BaseCard padded={false} style={{ overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: baseSpacing.md, paddingVertical: baseSpacing.sm }}>
              {rightPanel === 'orderbook' ? (
                <OrderBook
                  orderbook={orderbook ?? undefined}
                  onPriceSelect={(p) => tradeStore.setPrice(p)}
                />
              ) : (
                <RecentTrades trades={trades} />
              )}
            </View>
          </BaseCard>

          <BaseOrderPanel
            symbol={symbol}
            markPrice={livePrice ?? market?.markPrice}
            onSubmit={submit}
            submitting={isPlacing}
          />
        </View>
      </ScrollView>

      <BottomSheet ref={sheetRef} title="Select Trading Pair" snapPoints={['75%', '95%']}>
        <TradingPairSelector
          markets={markets}
          onSelect={(s) => {
            sheetRef.current?.close();
            router.replace(`/base/trade/${s}`);
          }}
        />
      </BottomSheet>
    </BaseScreen>
  );
}

function BaseOrderPanel({
  symbol,
  markPrice,
  onSubmit,
  submitting,
}: {
  symbol: string;
  markPrice?: number | string;
  onSubmit: () => void;
  submitting?: boolean;
}) {
  const tradeStore = useTradeStore();

  return (
    <BaseCard>
      <View style={{ gap: baseSpacing.md }}>
        <BaseSegmentedControl
          items={[
            { key: 'long', label: 'Buy / Long' },
            { key: 'short', label: 'Sell / Short' },
          ]}
          value={tradeStore.side}
          onChange={(v) => tradeStore.setSide(v)}
        />

        <BaseSegmentedControl
          items={[
            { key: 'market', label: 'Market' },
            { key: 'limit', label: 'Limit' },
          ]}
          value={tradeStore.orderType}
          onChange={(v) => tradeStore.setOrderType(v)}
        />

        {tradeStore.orderType === 'limit' ? (
          <View style={{ gap: baseSpacing.sm }}>
            <BaseText color={baseColors.text.secondary}>Price</BaseText>
            <TextInput
              value={String(tradeStore.price ?? '')}
              onChangeText={(t) => tradeStore.setPrice(t)}
              placeholder={markPrice ? String(markPrice) : '0'}
              placeholderTextColor={baseColors.text.tertiary}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>
        ) : (
          <View style={{ gap: baseSpacing.sm }}>
            <BaseText color={baseColors.text.secondary}>Price</BaseText>
            <View style={[styles.input, styles.readonly]}>
              <BaseText>Market</BaseText>
            </View>
          </View>
        )}

        <View style={{ gap: baseSpacing.sm }}>
          <BaseText color={baseColors.text.secondary}>Size</BaseText>
          <TextInput
            value={String(tradeStore.size ?? '')}
            onChangeText={(t) => tradeStore.setSize(t)}
            placeholder="0"
            placeholderTextColor={baseColors.text.tertiary}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        <BaseButton
          title={`${tradeStore.side === 'long' ? 'Buy' : 'Sell'} ${symbol}-PERP`}
          variant={tradeStore.side === 'long' ? 'buy' : 'sell'}
          fullWidth
          loading={submitting}
          onPress={onSubmit}
        />
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: baseSpacing.md,
    paddingTop: baseSpacing.sm,
    paddingBottom: baseSpacing.sm,
    backgroundColor: baseColors.bg.primary,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: baseRadius.full,
  },
  symbolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: baseRadius.md,
    backgroundColor: baseColors.bg.tertiary,
    borderWidth: 1,
    borderColor: baseColors.border.subtle,
  },
  symbolText: { fontWeight: '800' },
  headerRight: { width: 36, alignItems: 'flex-end' },
  input: {
    borderWidth: 1,
    borderColor: baseColors.border.default,
    backgroundColor: baseColors.bg.tertiary,
    borderRadius: baseRadius.md,
    paddingHorizontal: baseSpacing.md,
    paddingVertical: baseSpacing.md,
    color: baseColors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  readonly: {
    justifyContent: 'center',
  },
});
