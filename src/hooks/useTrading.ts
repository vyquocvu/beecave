import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtocol } from './useProtocol';
import { useWalletStore } from '@/store/useWalletStore';
import { showToast } from '@/store/useToastStore';
import { hapticError, hapticSuccess } from '@/utils/haptics';
import type { OrderParams, OrderResult } from '@/types/order';
import type { WalletSigner } from '@/services/types';

interface UseTradingOptions {
  signer?: WalletSigner | null;
}

export function useTrading({ signer }: UseTradingOptions = {}) {
  const { protocol, service } = useProtocol();
  const address = useWalletStore((s) => s.address);
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['positions', protocol, address] });
    queryClient.invalidateQueries({ queryKey: ['orders', 'open', protocol, address] });
    queryClient.invalidateQueries({ queryKey: ['snapshot', protocol, address] });
  }, [queryClient, protocol, address]);

  const placeOrder = useMutation<OrderResult, Error, OrderParams>({
    mutationFn: async (params) => {
      if (!signer) throw new Error('Connect your wallet to trade');
      return service.placeOrder(signer, params);
    },
    onSuccess: (res) => {
      hapticSuccess();
      showToast({
        type: 'success',
        message: 'Order placed',
        description: `Order #${res.orderId.slice(0, 8)} · ${res.status}`,
      });
      invalidate();
    },
    onError: (err) => {
      hapticError();
      showToast({ type: 'error', message: 'Order failed', description: err.message });
    },
  });

  const cancelOrder = useMutation<void, Error, { symbol: string; orderId: string }>({
    mutationFn: async ({ symbol, orderId }) => {
      if (!signer) throw new Error('Connect your wallet to cancel orders');
      return service.cancelOrder(signer, symbol, orderId);
    },
    onSuccess: () => {
      hapticSuccess();
      showToast({ type: 'success', message: 'Order cancelled' });
      invalidate();
    },
    onError: (err) => {
      hapticError();
      showToast({ type: 'error', message: 'Cancel failed', description: err.message });
    },
  });

  const closePosition = useMutation<OrderResult, Error, string>({
    mutationFn: async (symbol) => {
      if (!signer) throw new Error('Connect your wallet to close positions');
      return service.closePosition(signer, symbol);
    },
    onSuccess: () => {
      hapticSuccess();
      showToast({ type: 'success', message: 'Position closed' });
      invalidate();
    },
    onError: (err) => {
      hapticError();
      showToast({ type: 'error', message: 'Close failed', description: err.message });
    },
  });

  return {
    placeOrder: placeOrder.mutate,
    placeOrderAsync: placeOrder.mutateAsync,
    cancelOrder: cancelOrder.mutate,
    closePosition: closePosition.mutate,
    isPlacing: placeOrder.isPending,
    isCancelling: cancelOrder.isPending,
    isClosing: closePosition.isPending,
  };
}
