export const APP_CONFIG = {
  name: 'PerpDEX',
  scheme: 'perpdex',
  wcProjectId: process.env.EXPO_PUBLIC_WC_PROJECT_ID ?? '',
  environment: (process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'mainnet') as 'mainnet' | 'testnet',
  orderbookDepth: 20,
  pollInterval: {
    positions: 5000,
    orders: 5000,
    balance: 10000,
  },
  wsReconnect: {
    maxAttempts: 10,
    initialDelay: 1000,
    maxDelay: 30000,
  },
};
