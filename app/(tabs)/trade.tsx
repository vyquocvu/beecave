import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useMarketStore } from '@/store/useMarketStore';

export default function TradeTab() {
  const router = useRouter();
  const selected = useMarketStore((s) => s.selectedSymbol);

  useEffect(() => {
    router.replace(`/trade/${selected}`);
  }, [router, selected]);

  return null;
}
