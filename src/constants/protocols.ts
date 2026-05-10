import type { ProtocolConfig, Protocol } from '@/types/protocol';

const env = {
  hlApi: process.env.EXPO_PUBLIC_HL_API_URL ?? 'https://api.hyperliquid.xyz',
  hlWs: process.env.EXPO_PUBLIC_HL_WS_URL ?? 'wss://api.hyperliquid.xyz/ws',
  lighterApi: process.env.EXPO_PUBLIC_LIGHTER_API_URL ?? 'https://mainnet.zklighter.elliot.ai',
  lighterWs: process.env.EXPO_PUBLIC_LIGHTER_WS_URL ?? 'wss://mainnet.zklighter.elliot.ai/stream',
  asterApi: process.env.EXPO_PUBLIC_ASTER_API_URL ?? 'https://api.aster.finance',
  asterWs: process.env.EXPO_PUBLIC_ASTER_WS_URL ?? 'wss://api.aster.finance/ws',
};

export const PROTOCOLS: Record<Protocol, ProtocolConfig> = {
  hyperliquid: {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    shortName: 'Hyper',
    color: '#00D4AA',
    icon: '⚡',
    apiUrl: env.hlApi,
    wsUrl: env.hlWs,
    chainId: 42161,
    maxLeverage: 50,
    takerFee: 0.00035,
    makerFee: -0.0001,
  },
  lighter: {
    id: 'lighter',
    name: 'Lighter',
    shortName: 'Lighter',
    color: '#7B61FF',
    icon: '🔮',
    apiUrl: env.lighterApi,
    wsUrl: env.lighterWs,
    chainId: 324,
    maxLeverage: 20,
    takerFee: 0.0003,
    makerFee: 0.0001,
  },
  aster: {
    id: 'aster',
    name: 'Aster DEX',
    shortName: 'Aster',
    color: '#FF6B35',
    icon: '🌟',
    apiUrl: env.asterApi,
    wsUrl: env.asterWs,
    chainId: 1,
    maxLeverage: 25,
    takerFee: 0.0006,
    makerFee: 0.0002,
  },
};

const VALID_PROTOCOLS: Protocol[] = ['hyperliquid', 'lighter', 'aster'];
const _rawProtocol = process.env.EXPO_PUBLIC_DEFAULT_PROTOCOL;
export const DEFAULT_PROTOCOL: Protocol =
  _rawProtocol && VALID_PROTOCOLS.includes(_rawProtocol as Protocol)
    ? (_rawProtocol as Protocol)
    : 'hyperliquid';

export const ALL_PROTOCOLS = Object.values(PROTOCOLS);
