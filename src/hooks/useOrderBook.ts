import { useEffect, useState } from 'react';
import type { Orderbook } from '@/types/market';
import { useProtocol } from './useProtocol';

export function useOrderBook(symbol: string) {
  const { protocol, service } = useProtocol();
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);

  useEffect(() => {
    if (!symbol) return;
    let mounted = true;
    service
      .getOrderbook(symbol)
      .then((ob) => mounted && setOrderbook(ob))
      .catch(() => {});

    const ws = service.createWebSocket();
    ws.connect();
    const unsub = ws.subscribeOrderbook(symbol, (ob) => {
      if (mounted) setOrderbook(ob);
    });

    return () => {
      mounted = false;
      unsub();
      ws.disconnect();
    };
  }, [symbol, protocol, service]);

  return orderbook;
}
