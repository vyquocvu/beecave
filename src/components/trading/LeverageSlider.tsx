import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { LEVERAGE_PRESETS } from '@/constants/markets';
import { hapticSelection } from '@/utils/haptics';

interface LeverageSliderProps {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}

function riskColor(value: number, max: number) {
  const pct = value / max;
  if (pct < 0.2) return colors.up;
  if (pct < 0.5) return colors.brand.primary;
  return colors.down;
}

export function LeverageSlider({ value, onChange, max = 50 }: LeverageSliderProps) {
  const presets = LEVERAGE_PRESETS.filter((p) => p <= max);
  const color = riskColor(value, max);

  const handleChange = useCallback(
    (v: number) => {
      hapticSelection();
      onChange(v);
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Leverage</Text>
        <Text style={[styles.value, { color }]}>{value}x</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.presets}>
        {presets.map((p) => {
          const active = p === value;
          return (
            <Pressable
              key={p}
              onPress={() => handleChange(p)}
              style={[styles.preset, active && { backgroundColor: color, borderColor: color }]}
            >
              <Text style={[styles.presetLabel, active && { color: '#0A0B0E', fontWeight: '700' }]}>
                {p}x
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingVertical: spacing.md },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.text.secondary, fontSize: 13 },
  value: { fontSize: 16, fontWeight: '700' },
  track: {
    height: 4,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: radius.full },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  preset: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  presetLabel: { color: colors.text.secondary, fontSize: 12 },
});
