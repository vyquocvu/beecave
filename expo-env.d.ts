/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_WC_PROJECT_ID: string;
    EXPO_PUBLIC_ALCHEMY_KEY?: string;
    EXPO_PUBLIC_DEFAULT_PROTOCOL: 'hyperliquid' | 'lighter' | 'aster';
    EXPO_PUBLIC_ENVIRONMENT: 'mainnet' | 'testnet';
    EXPO_PUBLIC_HL_API_URL: string;
    EXPO_PUBLIC_HL_WS_URL: string;
    EXPO_PUBLIC_LIGHTER_API_URL: string;
    EXPO_PUBLIC_LIGHTER_WS_URL: string;
    EXPO_PUBLIC_ASTER_API_URL: string;
    EXPO_PUBLIC_ASTER_WS_URL: string;
  }
}
