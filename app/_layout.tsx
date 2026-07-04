
import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { WalletProvider } from '@/providers';
import { ToastHost } from '@/components/ui';
import { CopyTradingEngine } from '@/components/copyTrading/CopyTradingEngine';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <BottomSheetModalProvider>
              <StatusBar style="light" />
              <CopyTradingEngine />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.bg.primary },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="base" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="trade/[symbol]" />
                <Stack.Screen name="leaderboard/index" />
                <Stack.Screen name="trader/[address]" />
                <Stack.Screen name="wallet/deposit" options={{ presentation: 'modal' }} />
                <Stack.Screen name="wallet/withdraw" options={{ presentation: 'modal' }} />
                <Stack.Screen name="settings/index" />
                <Stack.Screen name="settings/notifications" />
                <Stack.Screen name="settings/security" />
              </Stack>
              <ToastHost />
            </BottomSheetModalProvider>
          </WalletProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
