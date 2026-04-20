import { useEffect, useState } from 'react';
import type { Candle, CandleInterval } from '@/types/market';
import { useProtocol } from './useProtocol';

export function useCandles(symbol: string, interval: CandleInterval, limit = 200) {
  const { protocol, service } = useProtocol();
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let mounted = true;
    setLoading(true);
    service
      .getCandles(symbol, interval, limit)
      .then((c) => {
        if (mounted) {
          setCandles(c);
          setLoading(false);
        }
      })
      .catch(() => mounted && setLoading(false));

    const ws = service.createWebSocket();
    ws.connect();
    const unsub = ws.subscribeCandles(symbol, interval, (incoming) => {
      if (!mounted) return;
      setCandles((prev) => mergeCandles(prev, incoming));
    });

    return () => {
      mounted = false;
      unsub();
      ws.disconnect();
    };
  }, [symbol, interval, limit, protocol, service]);

  return { candles, loading };
}

function mergeCandles(existing: Candle[], incoming: Candle[]): Candle[] {
  const map = new Map<number, Candle>();
  for (const c of existing) map.set(c.time, c);
  for (const c of incoming) map.set(c.time, c);
  return Array.from(map.values()).sort((a, b) => a.time - b.time);
}
