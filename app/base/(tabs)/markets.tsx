import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMarkets } from '@/hooks';
import { useMarketStore } from '@/store/useMarketStore';
import { BaseScreen } from '@/base/components/layout';
import { BaseCard, BaseText } from '@/base/components/ui';
import { baseColors, baseSpacing } from '@/base/theme';

export default function BaseMarketsScreen() {
  const router = useRouter();
  useMarkets();
  const markets = useMarketStore((s) => s.markets);

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={{ paddingVertical: baseSpacing.lg, paddingBottom: 40 }}>
        <BaseText variant="title" style={{ marginBottom: baseSpacing.lg }}>
          Markets
        </BaseText>

        <BaseCard padded={false}>
          <View>
            {markets.slice(0, 30).map((m, idx) => (
              <Pressable
                key={m.symbol}
                onPress={() => router.push(`/base/trade/${m.symbol}`)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { backgroundColor: baseColors.bg.tertiary },
                  idx < Math.min(markets.length, 30) - 1 && styles.rowDivider,
                ]}
              >
                <BaseText style={{ flex: 1 }}>{m.symbol}-PERP</BaseText>
                <BaseText color={baseColors.text.secondary}>{m.baseAsset}</BaseText>
              </Pressable>
            ))}
          </View>
        </BaseCard>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: baseSpacing.md, paddingHorizontal: baseSpacing.lg, paddingVertical: baseSpacing.md },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: baseColors.border.subtle },
});
