import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore, Toast as ToastType } from '@/store/useToastStore';
import { colors, radius, spacing } from '@/constants/theme';

const iconFor = (type: ToastType['type']) =>
  type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '!' : 'i';

const colorFor = (type: ToastType['type']) => {
  switch (type) {
    case 'success':
      return colors.up;
    case 'error':
      return colors.down;
    case 'warning':
      return colors.brand.primary;
    default:
      return '#7B61FF';
  }
};

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }]}>
      {toasts.map((t) => (
        <Animated.View
          key={t.id}
          entering={FadeInUp.duration(180)}
          exiting={FadeOutDown.duration(120)}
          style={styles.toast}
        >
          <View style={[styles.iconBubble, { backgroundColor: colorFor(t.type) }]}>
            <Text style={styles.icon}>{iconFor(t.type)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.message}>{t.message}</Text>
            {t.description ? <Text style={styles.description}>{t.description}</Text> : null}
          </View>
          <Pressable onPress={() => dismiss(t.id)} hitSlop={12}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 1000,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderColor: colors.border.default,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { color: '#000', fontWeight: '800' },
  message: { color: colors.text.primary, fontSize: 14, fontWeight: '600' },
  description: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  close: { color: colors.text.secondary, fontSize: 14, padding: 4 },
});
