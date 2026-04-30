import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProtocol } from './useProtocol';
import { useWalletStore } from '@/store/useWalletStore';
import { APP_CONFIG } from '@/constants/config';

export function useWalletSnapshot() {
  const { protocol, service } = useProtocol();
  const address = useWalletStore((s) => s.address);
  const setSnapshot = useWalletStore((s) => s.setSnapshot);
  const setBalances = useWalletStore((s) => s.setBalances);

  const query = useQuery({
    queryKey: ['snapshot', protocol, address],
    queryFn: () => (address ? service.getUserSnapshot(address) : Promise.resolve(null)),
    enabled: !!address,
    refetchInterval: APP_CONFIG.pollInterval.balance,
    staleTime: 5_000,
  });

  useEffect(() => {
    if (query.data) {
      setSnapshot(query.data);
      setBalances(query.data.balances);
    }
  }, [query.data, setSnapshot, setBalances]);

  return query;
}
