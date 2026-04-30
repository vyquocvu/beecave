import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '@/constants/theme';
import { hapticSelection } from '@/utils/haptics';

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'pill' | 'underline' | 'segment';
  style?: ViewStyle;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'underline',
  style,
}: TabsProps<T>) {
  return (
    <View style={[styles[`${variant}Container` as const], style]}>
      {items.map((item) => {
        const active = value === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => {
              hapticSelection();
              onChange(item.key);
            }}
            style={[styles[`${variant}Item` as const], active && styles[`${variant}Active` as const]]}
          >
            <Text
              style={[
                styles[`${variant}Label` as const],
                active && styles[`${variant}LabelActive` as const],
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Underline
  underlineContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  underlineItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  underlineActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.brand.primary,
  },
  underlineLabel: { color: colors.text.secondary, fontSize: 14 },
  underlineLabelActive: { color: colors.text.primary, fontWeight: '600' },

  // Pill
  pillContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pillItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  pillActive: {
    borderColor: colors.brand.primary,
    backgroundColor: 'rgba(240,180,41,0.1)',
  },
  pillLabel: { color: colors.text.secondary, fontSize: 13 },
  pillLabelActive: { color: colors.brand.primary, fontWeight: '600' },

  // Segment
  segmentContainer: {
    flexDirection: 'row',
    padding: 3,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.bg.overlay,
  },
  segmentLabel: { color: colors.text.secondary, fontSize: 13 },
  segmentLabelActive: { color: colors.text.primary, fontWeight: '600' },
});
