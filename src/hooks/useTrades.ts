import { useEffect, useState } from 'react';
import type { Trade } from '@/types/market';
import { useProtocol } from './useProtocol';

export function useRecentTrades(symbol: string, limit = 50) {
  const { protocol, service } = useProtocol();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!symbol) return;
    let mounted = true;
    service
      .getRecentTrades(symbol, limit)
      .then((t) => mounted && setTrades(t))
      .catch(() => {});

    const ws = service.createWebSocket();
    ws.connect();
    const unsub = ws.subscribeTrades(symbol, (incoming) => {
      if (!mounted) return;
      setTrades((prev) => [...incoming, ...prev].slice(0, limit));
    });

    return () => {
      mounted = false;
      unsub();
      ws.disconnect();
    };
  }, [symbol, limit, protocol, service]);

  return trades;
}
