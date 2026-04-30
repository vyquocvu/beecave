import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { Candle, CandleInterval } from '@/types/market';
import { colors, spacing } from '@/constants/theme';
import { Tabs } from '@/components/ui';
import { CANDLE_INTERVALS } from '@/constants/markets';
import { formatPrice } from '@/utils/format';

interface CandlestickChartProps {
  candles: Candle[];
  interval: CandleInterval;
  onIntervalChange: (i: CandleInterval) => void;
  height?: number;
}

// Lightweight SVG-free candlestick view. Uses flex layout for bodies/wicks so
// it renders fast and avoids pulling in SVG for the initial render path.
// Swap in `react-native-wagmi-charts` by wrapping this component if desired.
export function CandlestickChart({
  candles,
  interval,
  onIntervalChange,
  height = 260,
}: CandlestickChartProps) {
  const { min, max, visible } = useMemo(() => {
    const screenW = Dimensions.get('window').width;
    const maxCandles = Math.floor((screenW - 32) / 6);
    const slice = candles.slice(-maxCandles);
    if (!slice.length) return { min: 0, max: 1, visible: [] };
    let lo = Infinity;
    let hi = -Infinity;
    for (const c of slice) {
      if (c.low < lo) lo = c.low;
      if (c.high > hi) hi = c.high;
    }
    return { min: lo, max: hi, visible: slice };
  }, [candles]);

  const range = max - min || 1;

  return (
    <View style={{ height }}>
      <View style={styles.axisRow}>
        <Text style={styles.axisLabel}>${formatPrice(max)}</Text>
        <Text style={styles.axisLabel}>${formatPrice((max + min) / 2)}</Text>
        <Text style={styles.axisLabel}>${formatPrice(min)}</Text>
      </View>
      <View style={styles.chart}>
        {visible.map((c, i) => {
          const isUp = c.close >= c.open;
          const color = isUp ? colors.up : colors.down;
          const bodyTop = ((max - Math.max(c.open, c.close)) / range) * 100;
          const bodyHeight = Math.max((Math.abs(c.close - c.open) / range) * 100, 0.5);
          const wickTop = ((max - c.high) / range) * 100;
          const wickHeight = ((c.high - c.low) / range) * 100;
          return (
            <View key={i} style={styles.candleSlot}>
              <View
                style={[
                  styles.wick,
                  {
                    top: `${wickTop}%`,
                    height: `${wickHeight}%`,
                    backgroundColor: color,
                  },
                ]}
              />
              <View
                style={[
                  styles.body,
                  {
                    top: `${bodyTop}%`,
                    height: `${bodyHeight}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.intervalRow}>
        <Tabs
          variant="segment"
          items={CANDLE_INTERVALS.map((i) => ({ key: i, label: i }))}
          value={interval}
          onChange={onIntervalChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axisRow: {
    position: 'absolute',
    right: 8,
    top: 8,
    bottom: 40,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  axisLabel: { color: colors.text.tertiary, fontSize: 10, fontVariant: ['tabular-nums'] },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  candleSlot: { flex: 1, position: 'relative', marginHorizontal: 1 },
  wick: { position: 'absolute', left: '50%', width: 1, marginLeft: -0.5 },
  body: { position: 'absolute', left: 1, right: 1, borderRadius: 1 },
  intervalRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
});
