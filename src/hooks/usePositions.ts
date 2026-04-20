import { useQuery } from '@tanstack/react-query';
import { useProtocol } from './useProtocol';
import { useWalletStore } from '@/store/useWalletStore';
import { APP_CONFIG } from '@/constants/config';

export function usePositions() {
  const { protocol, service } = useProtocol();
  const address = useWalletStore((s) => s.address);

  return useQuery({
    queryKey: ['positions', protocol, address],
    queryFn: () => (address ? service.getUserPositions(address) : Promise.resolve([])),
    enabled: !!address,
    refetchInterval: APP_CONFIG.pollInterval.positions,
    staleTime: 3_000,
  });
}
