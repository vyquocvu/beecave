import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { hapticSelection } from '@/utils/haptics';
import { baseColors, baseRadius } from '@/base/theme';

export type BaseSegmentItem<T extends string = string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  items: BaseSegmentItem<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
};

export function BaseSegmentedControl<T extends string>({ items, value, onChange, style }: Props<T>) {
  return (
    <View style={[styles.container, style]}>
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => {
              hapticSelection();
              onChange(item.key);
            }}
            style={({ pressed }) => [styles.item, active && styles.activeItem, pressed && { opacity: 0.9 }]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    backgroundColor: baseColors.bg.tertiary,
    borderRadius: baseRadius.md,
    borderWidth: 1,
    borderColor: baseColors.border.subtle,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: baseRadius.sm,
  },
  activeItem: {
    backgroundColor: baseColors.bg.overlay,
  },
  label: { color: baseColors.text.secondary, fontSize: 13, fontWeight: '600' },
  activeLabel: { color: baseColors.text.primary },
});
