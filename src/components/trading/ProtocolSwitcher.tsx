import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { ALL_PROTOCOLS } from '@/constants/protocols';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing } from '@/constants/theme';
import { hapticSelection } from '@/utils/haptics';
import type { Protocol } from '@/types/protocol';

interface ProtocolSwitcherProps {
  onChange?: (p: Protocol) => void;
}

export function ProtocolSwitcher({ onChange }: ProtocolSwitcherProps) {
  const selected = useAppStore((s) => s.protocol);
  const setProtocol = useAppStore((s) => s.setProtocol);

  const handleChange = (p: Protocol) => {
    hapticSelection();
    setProtocol(p);
    onChange?.(p);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ALL_PROTOCOLS.map((p) => {
        const active = selected === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => handleChange(p.id)}
            style={[
              styles.pill,
              active && { borderColor: p.color, backgroundColor: `${p.color}1A` },
            ]}
          >
            <Text style={styles.icon}>{p.icon}</Text>
            <Text style={[styles.label, active && { color: p.color, fontWeight: '700' }]}>
              {p.shortName}
            </Text>
            {active && <View style={[styles.dot, { backgroundColor: p.color }]} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.bg.secondary,
    marginRight: 8,
  },
  icon: { fontSize: 14 },
  label: { color: colors.text.secondary, fontSize: 13, fontWeight: '500' },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: 4 },
});
