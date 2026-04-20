import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout/SafeArea';
import { Button } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Screen not found</Text>
        <Text style={styles.body}>The page you were looking for doesn't exist.</Text>
        <View style={{ marginTop: spacing.xl, width: '100%' }}>
          <Button title="Go home" variant="primary" size="lg" fullWidth onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  code: { color: colors.brand.primary, fontSize: 64, fontWeight: '900' },
  title: { color: colors.text.primary, fontSize: 20, fontWeight: '700', marginTop: spacing.sm },
  body: { color: colors.text.secondary, fontSize: 14, marginTop: spacing.xs, textAlign: 'center' },
});
