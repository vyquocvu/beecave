import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeArea } from '@/components/layout/SafeArea';
import { Header } from '@/components/layout/Header';
import { Card, Badge, Button, Row } from '@/components/ui';
import { useMarkets } from '@/hooks';
import { useMarketStore } from '@/store/useMarketStore';
import { colors, spacing } from '@/constants/theme';
import { formatCompact, formatFundingRate, formatUsd, toNumber } from '@/utils/format';

const VAULTS = [
  {
    id: 'hl-mm',
    name: 'HL Market Maker Vault',
    icon: '🏦',
    apy: 18.5,
    tvl: 12_400_000,
    risk: 'Low' as const,
  },
  {
    id: 'delta-neutral',
    name: 'Delta Neutral Strategy',
    icon: '⚡',
    apy: 24.2,
    tvl: 5_100_000,
    risk: 'Medium' as const,
  },
  {
    id: 'funding-arb',
    name: 'Funding Rate Arbitrage',
    icon: '🔄',
    apy: 31.8,
    tvl: 2_800_000,
    risk: 'Medium' as const,
  },
];

export default function EarnScreen() {
  useMarkets();
  const markets = useMarketStore((s) => s.markets);
  const topFunding = [...markets]
    .sort((a, b) => Math.abs(toNumber(b.fundingRate)) - Math.abs(toNumber(a.fundingRate)))
    .slice(0, 5);

  return (
    <SafeArea>
      <Header title="Earn" />
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.summary}>
          <Row label="My Earnings" value={formatUsd(0)} />
          <Row label="APY" value="0.00%" valueColor={colors.up} />
        </Card>

        <Text style={styles.sectionTitle}>Vault Strategies</Text>
        {VAULTS.map((v) => (
          <Card key={v.id} style={{ gap: 8 }}>
            <View style={styles.vaultHeader}>
              <Text style={styles.vaultIcon}>{v.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaultName}>{v.name}</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <Badge
                    label={`Risk: ${v.risk}`}
                    variant={v.risk === 'Low' ? 'up' : 'brand'}
                  />
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.apy}>{v.apy.toFixed(1)}%</Text>
                <Text style={styles.apyLabel}>APY</Text>
              </View>
            </View>
            <Row label="TVL" value={`$${formatCompact(v.tvl)}`} compact />
            <Button title="Deposit" variant="secondary" size="sm" />
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Funding Rate Arbitrage</Text>
        <Card>
          {topFunding.map((m) => (
            <View key={m.symbol} style={styles.fundingRow}>
              <Text style={styles.fundingSymbol}>{m.symbol}</Text>
              <Text
                style={[
                  styles.fundingRate,
                  { color: toNumber(m.fundingRate) >= 0 ? colors.up : colors.down },
                ]}
              >
                {formatFundingRate(m.fundingRate)}/1h
              </Text>
              <Button title="Trade" variant="outline" size="sm" />
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 },
  summary: { gap: 4 },
  sectionTitle: { color: colors.text.primary, fontSize: 16, fontWeight: '700', marginTop: spacing.sm },
  vaultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vaultIcon: { fontSize: 22 },
  vaultName: { color: colors.text.primary, fontSize: 14, fontWeight: '700' },
  apy: { color: colors.up, fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  apyLabel: { color: colors.text.tertiary, fontSize: 10, textTransform: 'uppercase' },
  fundingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  fundingSymbol: { flex: 1, color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  fundingRate: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
