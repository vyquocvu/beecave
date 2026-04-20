export interface Balance {
  asset: string;
  total: string;
  available: string;
  locked: string;
  usdValue?: string;
}

export interface WalletSnapshot {
  address: string;
  balances: Balance[];
  totalEquity: string;
  totalMarginUsed: string;
  totalAvailable: string;
  unrealizedPnl: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'funding' | 'fee' | 'pnl' | 'liquidation';
  asset: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  time: number;
  txHash?: string;
}
