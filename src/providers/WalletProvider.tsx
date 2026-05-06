import React, { useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import { createAppKit, AppKit } from '@web3modal/wagmi-react-native';
import { useAccount, useWalletClient } from 'wagmi';
import { useWalletStore } from '@/store/useWalletStore';
import { APP_CONFIG } from '@/constants/config';

const chains = [arbitrum, mainnet] as const;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
  },
});

if (APP_CONFIG.wcProjectId) {
  createAppKit({
    projectId: APP_CONFIG.wcProjectId,
    wagmiConfig,
    defaultChain: arbitrum,
    enableAnalytics: false,
  });
}

function WalletStateSync() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const setAddress = useWalletStore((s) => s.setAddress);
  const setConnected = useWalletStore((s) => s.setConnected);

  useEffect(() => {
    setAddress(address ?? null);
    setConnected(isConnected);
  }, [address, isConnected, setAddress, setConnected]);

  // walletClient is consumed via useSigner() elsewhere
  void walletClient;
  return null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <WalletStateSync />
      {children}
      <AppKit />
    </WagmiProvider>
  );
}
