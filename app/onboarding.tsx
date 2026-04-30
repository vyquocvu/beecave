import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { colors, spacing, radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

type Slide = { key: string; emoji: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    key: 'multi',
    emoji: '⚡️',
    title: 'Trade three DEXes, one app',
    body: 'Switch between Hyperliquid, Lighter, and Aster without leaving PerpDEX.',
  },
  {
    key: 'chart',
    emoji: '📈',
    title: 'Pro-grade charts & order book',
    body: 'Real-time candles, depth, and recent trades streamed over WebSocket.',
  },
  {
    key: 'wallet',
    emoji: '🔐',
    title: 'Non-custodial by design',
    body: 'Connect any WalletConnect-compatible wallet. Your keys never leave the device.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const next = () => {
    if (index >= SLIDES.length - 1) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    setIndex(index + 1);
  };

  return (
    <SafeArea>
      <View style={styles.topRow}>
        <Pressable onPress={finish} hitSlop={8}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View
            key={s.key}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={index === SLIDES.length - 1 ? 'Get started' : 'Next'}
          variant="primary"
          size="lg"
          fullWidth
          onPress={next}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.lg },
  skip: { color: colors.text.secondary, fontSize: 14 },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    flex: 1,
  },
  emoji: { fontSize: 64, marginBottom: spacing.lg },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.text.secondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.brand.primary,
  },
  footer: { padding: spacing.lg },
});
