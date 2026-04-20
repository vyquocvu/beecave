import { useMemo } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import type { WalletSigner } from '@/services/types';

// Adapts the wagmi WalletClient into our ProtocolService-compatible signer.
export function useSigner(): WalletSigner | null {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!address || !walletClient) return null;
    return {
      address: address as `0x${string}`,
      signTypedData: (args) => walletClient.signTypedData(args as any),
      signMessage: (args) => walletClient.signMessage({ message: args.message }),
    };
  }, [address, walletClient]);
}
