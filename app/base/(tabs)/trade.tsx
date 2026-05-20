import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useMarketStore } from '@/store/useMarketStore';

export default function BaseTradeTab() {
  const router = useRouter();
  const selected = useMarketStore((s) => s.selectedSymbol);

  useEffect(() => {
    router.replace(`/base/trade/${selected}`);
  }, [router, selected]);

  return null;
}
