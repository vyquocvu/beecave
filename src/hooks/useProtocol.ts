import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createProtocolService } from '@/services';
import { PROTOCOLS } from '@/constants/protocols';

export function useProtocol() {
  const protocol = useAppStore((s) => s.protocol);
  const service = useMemo(() => createProtocolService(protocol), [protocol]);
  const config = PROTOCOLS[protocol];
  return { protocol, service, config };
}
