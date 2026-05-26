import React, { forwardRef, useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { BottomSheet, Button, Row } from '@/components/ui';
import type { BottomSheetHandle } from '@/components/ui';
import { LeverageSlider } from '@/components/trading/LeverageSlider';
import { colors, radius, spacing } from '@/constants/theme';
import { formatAddress } from '@/utils/format';
import type { CopyTradingConfig } from '@/types/copyTrading';

interface CopySettingsConfig {
  isEnabled: boolean;
  sizeRatio: number;
  maxLeverage: number;
  maxOpenPositions: number;
}

interface CopySettingsSheetProps {
  traderAddress: string;
  existingConfig?: CopyTradingConfig;
  onSave: (cfg: CopySettingsConfig) => void;
}

const SIZE_PRESETS = [5, 10, 25, 50, 100];
const MAX_POSITIONS_OPTIONS = [1, 2, 3, 5, 10];

export const CopySettingsSheet = forwardRef<BottomSheetHandle, CopySettingsSheetProps>(
  ({ traderAddress, existingConfig, onSave }, ref) => {
    const [isEnabled, setIsEnabled] = useState(existingConfig?.isEnabled ?? true);
    const [sizeRatioPct, setSizeRatioPct] = useState(
      existingConfig ? Math.round(existingConfig.sizeRatio * 100) : 10,
    );
    const [maxLeverage, setMaxLeverage] = useState(existingConfig?.maxLeverage ?? 5);
    const [maxPositions, setMaxPositions] = useState(existingConfig?.maxOpenPositions ?? 3);

    const handleSave = () => {
      onSave({ isEnabled, sizeRatio: sizeRatioPct / 100, maxLeverage, maxOpenPositions: maxPositions });
      if (ref && typeof ref !== 'function') ref.current?.close();
    };

    return (
      <BottomSheet ref={ref} title="Copy Trading Settings" snapPoints={['70%', '90%']}>
        <View style={styles.content}>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Following</Text>
            <Text style={styles.address}>{formatAddress(traderAddress, 8, 6)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Enable Copy Trading</Text>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ true: colors.brand.primary, false: colors.bg.tertiary }}
              thumbColor={isEnabled ? '#fff' : colors.text.tertiary}
            />
          </View>

          <View style={styles.section}>
            <Row label="Size Ratio" value={`${sizeRatioPct}% of trader's size`} compact />
            <View style={styles.presets}>
              {SIZE_PRESETS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setSizeRatioPct(p)}
                  style={[styles.preset, sizeRatioPct === p && styles.presetActive]}
                >
                  <Text style={[styles.presetText, sizeRatioPct === p && styles.presetTextActive]}>
                    {p}%
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <LeverageSlider value={maxLeverage} onChange={setMaxLeverage} max={20} />

          <View style={styles.section}>
            <Row label="Max Open Positions" value={String(maxPositions)} compact />
            <View style={styles.presets}>
              {MAX_POSITIONS_OPTIONS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setMaxPositions(p)}
                  style={[styles.preset, maxPositions === p && styles.presetActive]}
                >
                  <Text style={[styles.presetText, maxPositions === p && styles.presetTextActive]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Button title="Save Settings" variant="primary" size="lg" onPress={handleSave} />
        </View>
      </BottomSheet>
    );
  },
);

CopySettingsSheet.displayName = 'CopySettingsSheet';

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg.tertiary,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  addressLabel: { color: colors.text.secondary, fontSize: 12 },
  address: { color: colors.text.primary, fontSize: 13, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { color: colors.text.primary, fontSize: 14, fontWeight: '500' },
  section: { gap: spacing.sm },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preset: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  presetActive: { borderColor: colors.brand.primary, backgroundColor: 'transparent' },
  presetText: { color: colors.text.secondary, fontSize: 13, fontWeight: '600' },
  presetTextActive: { color: colors.brand.primary },
});
