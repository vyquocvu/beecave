import React, { useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
} from '@web3modal/wagmi-react-native';
import { useAccount, useWalletClient } from 'wagmi';
import { useWalletStore } from '@/store/useWalletStore';
import { APP_CONFIG } from '@/constants/config';

const metadata = {
  name: 'PerpDEX',
  description: 'Decentralized Perpetual Exchange',
  url: 'https://perpdex.app',
  icons: ['https://perpdex.app/icon.png'],
  redirect: {
    native: `${APP_CONFIG.scheme}://`,
    universal: 'https://perpdex.app',
  },
};

// @web3modal/wagmi-react-native 2.0.5 still expects viem v1's chain.displayName
const chains = [
  { ...arbitrum, displayName: arbitrum.name },
  { ...mainnet, displayName: mainnet.name },
] as unknown as readonly [typeof arbitrum, typeof mainnet];

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: APP_CONFIG.wcProjectId,
  metadata,
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
