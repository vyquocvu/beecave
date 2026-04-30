import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryProvider, WalletProvider } from '@/providers';
import { ToastHost } from '@/components/ui';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <SafeAreaProvider>
        <QueryProvider>
          <WalletProvider>
            <BottomSheetModalProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.bg.primary },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="trade/[symbol]" />
                <Stack.Screen name="wallet/deposit" options={{ presentation: 'modal' }} />
                <Stack.Screen name="wallet/withdraw" options={{ presentation: 'modal' }} />
                <Stack.Screen name="settings/index" />
                <Stack.Screen name="settings/notifications" />
                <Stack.Screen name="settings/security" />
              </Stack>
              <ToastHost />
            </BottomSheetModalProvider>
          </WalletProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
