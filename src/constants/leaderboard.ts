export interface KnownTrader {
  address: string;
  label: string;
}

export const KNOWN_TRADERS: KnownTrader[] = [
  { address: '0x3516c42fae2917da78be6d0d9c7432ebca3b5078', label: 'Hyperliquid DAO' },
  { address: '0x0d86aad9ef4ebc4c3af01cd1c0e89d98d5fcc86e', label: 'Whale Alpha' },
  { address: '0xe84aa96562cb1e8028dbb7d13ad21b5b2c2a8f56', label: 'DeltaHedger' },
  { address: '0x563b2b1e7e23e37a81bb39e6fcf6d10e827c5ac4', label: 'PerpWizard' },
  { address: '0x8b1e3ade47b2b11f1dcd6e6b7e9c7023fd0b2c72', label: 'TrendFollower' },
  { address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', label: 'FundingFarmer' },
  { address: '0x9f8e7d6c5b4a3e2f1d0c9b8a7f6e5d4c3b2a1f0e', label: 'VolTrader' },
  { address: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', label: 'LongTermBull' },
  { address: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', label: 'ShortSqueezer' },
  { address: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', label: 'BitcoinMaxi' },
  { address: '0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0', label: 'AltSeason' },
  { address: '0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', label: 'DegenTrader' },
];

export const LEADERBOARD_STALE_TIME = 30_000;
export const LEADERBOARD_REFETCH_INTERVAL = 60_000;
export const COPY_POLL_INTERVAL = 5_000;
export const LEADERBOARD_MAX_CUSTOM = 5;
