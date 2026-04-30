import type { WalletSigner } from '@/services/types';

// Lighter uses a custom signing scheme tied to zk-SNARK accounts.
// Here we provide an EIP-712 wrapper suitable for the orderbook submission
// endpoint as documented on https://docs.lighter.xyz.
const LIGHTER_DOMAIN = {
  name: 'Lighter',
  version: '1',
  chainId: 324, // zkSync Era
  verifyingContract: '0x0000000000000000000000000000000000000000' as const,
};

const LIGHTER_ORDER_TYPES = {
  Order: [
    { name: 'marketId', type: 'uint32' },
    { name: 'clientOrderId', type: 'uint64' },
    { name: 'amount', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'isAsk', type: 'bool' },
    { name: 'orderType', type: 'uint8' },
    { name: 'timeInForce', type: 'uint8' },
    { name: 'nonce', type: 'uint64' },
  ],
} as const;

export interface LighterOrderPayload {
  marketId: number;
  clientOrderId: number;
  amount: string;
  price: string;
  isAsk: boolean;
  orderType: 0 | 1; // 0 = limit, 1 = market
  timeInForce: 0 | 1 | 2; // 0 = GTC, 1 = IOC, 2 = FOK
  nonce: number;
}

export async function signLighterOrder(
  signer: WalletSigner,
  payload: LighterOrderPayload,
): Promise<`0x${string}`> {
  return signer.signTypedData({
    domain: LIGHTER_DOMAIN,
    types: LIGHTER_ORDER_TYPES,
    primaryType: 'Order',
    message: payload,
  });
}

export function nextClientOrderId(): number {
  return Math.floor(Date.now() / 1000) * 1000 + Math.floor(Math.random() * 1000);
}
