import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { Tabs, Button, Skeleton } from '@/components/ui';
import { PositionCard } from '@/components/trading/PositionCard';
import { OrderCard } from '@/components/trading/OrderCard';
import { usePositions, useOpenOrders, useOrderHistory, useTrading, useWalletSnapshot } from '@/hooks';
import { useSigner } from '@/hooks/useSigner';
import { useWalletStore } from '@/store/useWalletStore';
import { colors, spacing } from '@/constants/theme';

type TabKey = 'positions' | 'orders' | 'history';

export default function PortfolioScreen() {
  const [tab, setTab] = useState<TabKey>('positions');
  const snapshot = useWalletStore((s) => s.snapshot);
  const isConnected = useWalletStore((s) => s.isConnected);
  const signer = useSigner();
  useWalletSnapshot();

  const positions = usePositions();
  const openOrders = useOpenOrders();
  const history = useOrderHistory();
  const { cancelOrder, closePosition, isClosing } = useTrading({ signer });

  return (
    <SafeArea>
      <Header title="Portfolio" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <BalanceDisplay snapshot={snapshot} />

        <View style={styles.tabsWrap}>
          <Tabs
            variant="segment"
            items={[
              { key: 'positions', label: `Positions (${positions.data?.length ?? 0})` },
              { key: 'orders', label: `Orders (${openOrders.data?.length ?? 0})` },
              { key: 'history', label: 'History' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {!isConnected ? (
          <EmptyState message="Connect your wallet to view positions and orders" />
        ) : tab === 'positions' ? (
          <View style={styles.list}>
            {positions.isLoading ? (
              <Skeleton height={120} />
            ) : (positions.data?.length ?? 0) === 0 ? (
              <EmptyState message="No open positions" />
            ) : (
              positions.data!.map((p) => (
                <PositionCard
                  key={`${p.symbol}-${p.side}`}
                  position={p}
                  onClose={() => closePosition(p.symbol)}
                />
              ))
            )}
            {(positions.data?.length ?? 0) > 0 && (
              <Button
                title="Close All Positions"
                variant="outline"
                size="md"
                loading={isClosing}
                onPress={() => positions.data?.forEach((p) => closePosition(p.symbol))}
              />
            )}
          </View>
        ) : tab === 'orders' ? (
          <View style={styles.list}>
            {openOrders.isLoading ? (
              <Skeleton height={100} />
            ) : (openOrders.data?.length ?? 0) === 0 ? (
              <EmptyState message="No open orders" />
            ) : (
              openOrders.data!.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onCancel={() => cancelOrder({ symbol: o.symbol, orderId: o.id })}
                />
              ))
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {history.isLoading ? (
              <Skeleton height={100} />
            ) : (history.data?.length ?? 0) === 0 ? (
              <EmptyState message="No trade history yet" />
            ) : (
              history.data!.map((o) => <OrderCard key={o.id} order={o} />)
            )}
          </View>
        )}
      </ScrollView>
    </SafeArea>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg, gap: spacing.md },
  empty: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { color: colors.text.tertiary, fontSize: 13 },
});
