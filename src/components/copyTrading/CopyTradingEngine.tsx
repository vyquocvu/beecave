import { useCopyTrading } from '@/hooks/useCopyTrading';
import { useSigner } from '@/hooks/useSigner';

export function CopyTradingEngine() {
  const signer = useSigner();
  useCopyTrading(signer);
  return null;
}
