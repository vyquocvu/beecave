import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { OrderBook } from '@/components/trading/OrderBook';
import { useOrderBook } from '@/hooks';
import { DEFAULT_SYMBOL } from '@/constants/markets';

export default function FullOrderbookScreen() {
  const router = useRouter();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const sym = symbol ?? DEFAULT_SYMBOL;
  const orderbook = useOrderBook(sym);

  return (
    <SafeArea>
      <Header
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
        title={`${sym}-PERP`}
        subtitle="Full Order Book"
      />
      <OrderBook orderbook={orderbook ?? undefined} depth={25} />
    </SafeArea>
  );
}
