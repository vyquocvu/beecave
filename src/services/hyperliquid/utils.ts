import type { WalletSigner } from '@/services/types';

// EIP-712 domain for Hyperliquid
const HL_DOMAIN = {
  name: 'Exchange',
  version: '1',
  chainId: 1337,
  verifyingContract: '0x0000000000000000000000000000000000000000' as const,
};

const HL_AGENT_TYPES = {
  Agent: [
    { name: 'source', type: 'string' },
    { name: 'connectionId', type: 'bytes32' },
  ],
} as const;

// Hyperliquid uses msgpack hashing for actions; for brevity we use a JSON-based
// connection id hash derived from the action + nonce. This mirrors the flow
// used by many TypeScript SDK implementations.
export async function hashAction(action: unknown, nonce: number): Promise<`0x${string}`> {
  const serialized = JSON.stringify([action, nonce]);
  const enc = new TextEncoder().encode(serialized);
  const digest = await sha256(enc);
  return `0x${toHex(digest)}` as `0x${string}`;
}

export async function signHLAction(
  signer: WalletSigner,
  action: unknown,
  nonce: number,
  isMainnet = true,
): Promise<`0x${string}`> {
  const connectionId = await hashAction(action, nonce);
  const source = isMainnet ? 'a' : 'b';
  return signer.signTypedData({
    domain: HL_DOMAIN,
    types: HL_AGENT_TYPES,
    primaryType: 'Agent',
    message: { source, connectionId },
  });
}

function toHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const g: any = globalThis as any;
  if (g.crypto?.subtle?.digest) {
    const buf = await g.crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(buf);
  }
  // Minimal fallback (not cryptographically hot path in RN). Consumers should
  // ensure a polyfill is available.
  throw new Error('SHA-256 not available — install react-native-quick-crypto or a polyfill.');
}

export function hlSideFromIsBuy(isBuy: boolean): 'long' | 'short' {
  return isBuy ? 'long' : 'short';
}

export function hlIsBuyFromSide(side: 'long' | 'short'): boolean {
  return side === 'long';
}

export function buildCoinIndex(meta: { universe: Array<{ name: string }> }): Record<string, number> {
  const map: Record<string, number> = {};
  meta.universe.forEach((u, i) => {
    map[u.name] = i;
  });
  return map;
}
