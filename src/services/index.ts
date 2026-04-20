import type { Protocol } from '@/types/protocol';
import type { ProtocolService } from './types';
import { HyperliquidService } from './hyperliquid';
import { LighterService } from './lighter';
import { AsterService } from './aster';

const instances: Partial<Record<Protocol, ProtocolService>> = {};

export function createProtocolService(protocol: Protocol): ProtocolService {
  if (!instances[protocol]) {
    switch (protocol) {
      case 'hyperliquid':
        instances.hyperliquid = new HyperliquidService();
        break;
      case 'lighter':
        instances.lighter = new LighterService();
        break;
      case 'aster':
        instances.aster = new AsterService();
        break;
    }
  }
  return instances[protocol]!;
}

export * from './types';
export { HyperliquidService } from './hyperliquid';
export { LighterService } from './lighter';
export { AsterService } from './aster';
