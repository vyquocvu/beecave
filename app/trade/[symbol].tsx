import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { PriceTicket } from '@/components/trading/PriceTicket';
import { OrderBook } from '@/components/trading/OrderBook';
import { RecentTrades } from '@/components/trading/RecentTrades';
import { CandlestickChart } from '@/components/trading/CandlestickChart';
import { TradeForm } from '@/components/trading/TradeForm';
import { TradingPairSelector } from '@/components/trading/TradingPairSelector';
import { BottomSheet, Tabs } from '@/components/ui';
import type { BottomSheetHandle } from '@/components/ui';
import { useOrderBook, useRecentTrades, useCandles, useMarkets, useTrading } from '@/hooks';
import { useSigner } from '@/hooks/useSigner';
import { useMarketStore } from '@/store/useMarketStore';
import { useTradeStore } from '@/store/useTradeStore';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing } from '@/constants/theme';
import { DEFAULT_INTERVAL, DEFAULT_SYMBOL } from '@/constants/markets';
import type { CandleInterval } from '@/types/market';

export default function TradeDetailScreen() {
  const { symbol: rawSymbol } = useLocalSearchParams<{ symbol: string }>();
  const symbol = rawSymbol ?? DEFAULT_SYMBOL;
  const router = useRouter();
  const sheetRef = React.useRef<BottomSheetHandle>(null);

  const [interval, setInterval] = useState<CandleInterval>(DEFAULT_INTERVAL);
  const [rightPanel, setRightPanel] = useState<'orderbook' | 'trades'>('orderbook');

  useMarkets();
  const markets = useMarketStore((s) => s.markets);
  const livePrices = useMarketStore((s) => s.prices);
  const setSelectedSymbol = useMarketStore((s) => s.setSelectedSymbol);
  const addRecent = useAppStore((s) => s.addRecentSymbol);
  const tradeStore = useTradeStore();
  const signer = useSigner();
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

  const handleSubmit = () => {
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
    <SafeArea>
      <Header
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
        center={
          <Pressable onPress={() => sheetRef.current?.open()} style={styles.pairBtn}>
            <Text style={styles.pairText}>{symbol}-PERP</Text>
            <Ionicons name="chevron-down" size={16} color={colors.text.secondary} />
          </Pressable>
        }
        rightActions={[{ icon: 'star-outline', onPress: () => useAppStore.getState().toggleFavorite(symbol) }]}
      />

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        <PriceTicket market={market} livePrice={livePrice} />

        <CandlestickChart
          candles={candles}
          interval={interval}
          onIntervalChange={setInterval}
          height={260}
        />

        <View style={styles.bookRow}>
          <View style={{ flex: 1 }}>
            <Tabs
              variant="underline"
              items={[
                { key: 'orderbook', label: 'Order Book' },
                { key: 'trades', label: 'Trades' },
              ]}
              value={rightPanel}
              onChange={setRightPanel}
            />
          </View>
        </View>
        <View style={styles.panel}>
          {rightPanel === 'orderbook' ? (
            <OrderBook
              orderbook={orderbook ?? undefined}
              onPriceSelect={(price) => tradeStore.setPrice(price)}
            />
          ) : (
            <RecentTrades trades={trades} />
          )}
        </View>

        <TradeForm symbol={symbol} onSubmit={handleSubmit} isSubmitting={isPlacing} />
      </ScrollView>

      <BottomSheet ref={sheetRef} title="Select Trading Pair" snapPoints={['75%', '95%']}>
        <TradingPairSelector
          markets={markets}
          onSelect={(s) => {
            sheetRef.current?.close();
            router.replace(`/trade/${s}`);
          }}
        />
      </BottomSheet>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  pairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  pairText: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  bookRow: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  panel: { minHeight: 320, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
