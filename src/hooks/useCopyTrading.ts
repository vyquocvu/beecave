import { useEffect, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useCopyTradingStore } from '@/store/useCopyTradingStore';
import { useProtocol } from './useProtocol';
import { showToast } from '@/store/useToastStore';
import { COPY_POLL_INTERVAL } from '@/constants/leaderboard';
import { toNumber } from '@/utils/format';
import type { WalletSigner } from '@/services/types';

export function useCopyTrading(signer: WalletSigner | null) {
  const { service } = useProtocol();
  const store = useCopyTradingStore();
  const activeConfigs = store.getActiveConfigs();
  const processingRef = useRef<Set<string>>(new Set());

  const results = useQueries({
    queries: activeConfigs.map((cfg) => ({
      queryKey: ['copyTrading', 'positions', cfg.traderAddress],
      queryFn: () => service.getUserPositions(cfg.traderAddress),
      refetchInterval: COPY_POLL_INTERVAL,
      retry: 0,
      staleTime: 4_000,
      enabled: cfg.isEnabled && !!signer,
    })),
  });

  useEffect(() => {
    if (!signer) return;

    activeConfigs.forEach((cfg, i) => {
      const result = results[i];
      if (!result?.data || result.isError) return;

      const traderPositions = result.data;
      const currentSymbols = traderPositions.map((p) => p.symbol);
      const lastKnown = store.lastKnownPositions[cfg.traderAddress] ?? [];

      const newPositions = traderPositions.filter((p) => !lastKnown.includes(p.symbol));
      const closedSymbols = lastKnown.filter((s) => !currentSymbols.includes(s));

      newPositions.forEach((pos) => {
        const copyId = `${cfg.traderAddress}-${pos.symbol}`;
        if (processingRef.current.has(copyId)) return;
        if (store.copiedPositions[copyId]?.isOpen) return;

        const activeCopies = Object.values(store.copiedPositions).filter(
          (cp) => cp.traderAddress === cfg.traderAddress && cp.isOpen,
        );
        if (activeCopies.length >= cfg.maxOpenPositions) return;

        processingRef.current.add(copyId);
        const size = (toNumber(pos.size) * cfg.sizeRatio).toFixed(4);
        const leverage = Math.min(pos.leverage, cfg.maxLeverage);

        service
          .placeOrder(signer, {
            symbol: pos.symbol,
            side: pos.side,
            orderType: 'market',
            size,
            leverage,
          })
          .then(() => {
            store.addCopiedPosition({
              id: copyId,
              traderAddress: cfg.traderAddress,
              symbol: pos.symbol,
              side: pos.side,
              size,
              entryPrice: pos.entryPrice,
              originalSize: pos.size,
              appliedLeverage: leverage,
              copiedAt: Date.now(),
              isOpen: true,
            });
            store.updateLastKnown(cfg.traderAddress, currentSymbols);
          })
          .catch((err: Error) => {
            showToast({ type: 'error', message: 'Copy failed', description: err.message });
          })
          .finally(() => {
            processingRef.current.delete(copyId);
          });
      });

      closedSymbols.forEach((symbol) => {
        const copyId = `${cfg.traderAddress}-${symbol}`;
        const copy = store.copiedPositions[copyId];
        if (!copy?.isOpen) return;

        const closeKey = `close-${copyId}`;
        if (processingRef.current.has(closeKey)) return;

        processingRef.current.add(closeKey);
        service
          .closePosition(signer, symbol)
          .then(() => {
            store.removeCopiedPosition(copyId);
            store.updateLastKnown(cfg.traderAddress, currentSymbols);
          })
          .catch(() => {
            store.updateLastKnown(cfg.traderAddress, currentSymbols);
          })
          .finally(() => {
            processingRef.current.delete(closeKey);
          });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);
}
