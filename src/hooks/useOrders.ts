import { useQuery } from '@tanstack/react-query';
import { useProtocol } from './useProtocol';
import { useWalletStore } from '@/store/useWalletStore';
import { APP_CONFIG } from '@/constants/config';

export function useOpenOrders() {
  const { protocol, service } = useProtocol();
  const address = useWalletStore((s) => s.address);

  return useQuery({
    queryKey: ['orders', 'open', protocol, address],
    queryFn: () => (address ? service.getUserOrders(address) : Promise.resolve([])),
    enabled: !!address,
    refetchInterval: APP_CONFIG.pollInterval.orders,
  });
}

export function useOrderHistory() {
  const { protocol, service } = useProtocol();
  const address = useWalletStore((s) => s.address);

  return useQuery({
    queryKey: ['orders', 'history', protocol, address],
    queryFn: () => (address ? service.getUserOrderHistory(address) : Promise.resolve([])),
    enabled: !!address,
    staleTime: 30_000,
  });
}
