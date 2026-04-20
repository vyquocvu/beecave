import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProtocol } from './useProtocol';
import { useMarketStore } from '@/store/useMarketStore';

export function useMarkets() {
  const { protocol, service } = useProtocol();
  const setMarkets = useMarketStore((s) => s.setMarkets);

  const query = useQuery({
    queryKey: ['markets', protocol],
    queryFn: () => service.getMarkets(),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (query.data) setMarkets(query.data);
  }, [query.data, setMarkets]);

  return query;
}

export function useMarket(symbol: string) {
  const { protocol, service } = useProtocol();
  return useQuery({
    queryKey: ['market', protocol, symbol],
    queryFn: () => service.getMarket(symbol),
    enabled: !!symbol,
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}

export function useLivePrices() {
  const { protocol, service } = useProtocol();
  const updatePrices = useMarketStore((s) => s.updatePrices);

  useEffect(() => {
    const ws = service.createWebSocket();
    ws.connect();
    const unsub = ws.subscribeTicker((prices) => updatePrices(prices));
    return () => {
      unsub();
      ws.disconnect();
    };
  }, [protocol, service, updatePrices]);
}
