import React from 'react';
import { Stack } from 'expo-router';

export default function BaseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="trade/[symbol]" />
      <Stack.Screen name="auth/index" options={{ presentation: 'modal' }} />
      <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
      <Stack.Screen name="auth/register" options={{ presentation: 'modal' }} />
      <Stack.Screen name="auth/verify" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/security" />
      <Stack.Screen name="settings/notifications" />
    </Stack>
  );
}
