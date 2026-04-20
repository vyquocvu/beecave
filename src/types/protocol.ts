export type Protocol = 'hyperliquid' | 'lighter' | 'aster';

export interface ProtocolConfig {
  id: Protocol;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  apiUrl: string;
  wsUrl: string;
  chainId?: number;
  maxLeverage: number;
  takerFee: number;
  makerFee: number;
}
