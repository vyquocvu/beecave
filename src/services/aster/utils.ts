import type { WalletSigner } from '@/services/types';
import type { AsterOrderParams } from './types';

const ASTER_DOMAIN = {
  name: 'AsterDEX',
  version: '1',
  chainId: 1,
  verifyingContract: '0x0000000000000000000000000000000000000000' as const,
};

const ASTER_ORDER_TYPES = {
  PlaceOrder: [
    { name: 'symbol', type: 'string' },
    { name: 'side', type: 'string' },
    { name: 'orderType', type: 'string' },
    { name: 'price', type: 'string' },
    { name: 'size', type: 'string' },
    { name: 'leverage', type: 'uint32' },
    { name: 'reduceOnly', type: 'bool' },
    { name: 'nonce', type: 'uint64' },
  ],
} as const;

export async function signAsterOrder(
  signer: WalletSigner,
  params: AsterOrderParams,
): Promise<`0x${string}`> {
  return signer.signTypedData({
    domain: ASTER_DOMAIN,
    types: ASTER_ORDER_TYPES,
    primaryType: 'PlaceOrder',
    message: {
      symbol: params.symbol,
      side: params.side,
      orderType: params.type,
      price: params.price ?? '0',
      size: params.size,
      leverage: params.leverage,
      reduceOnly: !!params.reduce_only,
      nonce: params.nonce,
    },
  });
}

export async function signAsterCancel(
  signer: WalletSigner,
  payload: { symbol: string; orderId: string; nonce: number },
): Promise<`0x${string}`> {
  return signer.signTypedData({
    domain: ASTER_DOMAIN,
    types: {
      CancelOrder: [
        { name: 'symbol', type: 'string' },
        { name: 'orderId', type: 'string' },
        { name: 'nonce', type: 'uint64' },
      ],
    },
    primaryType: 'CancelOrder',
    message: payload,
  });
}
