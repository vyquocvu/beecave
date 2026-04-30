import { useEffect, useMemo, useRef, useState } from 'react';

type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

interface UseWebSocketOptions {
  onMessage?: (event: WebSocketMessageEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: WebSocketErrorEvent) => void;
}

export function useWebSocket(url?: string, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WsStatus>('idle');

  const handlers = useMemo(
    () => ({
      onMessage: options.onMessage,
      onOpen: options.onOpen,
      onClose: options.onClose,
      onError: options.onError,
    }),
    [options.onMessage, options.onOpen, options.onClose, options.onError]
  );

  useEffect(() => {
    if (!url) return;

    setStatus('connecting');
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('open');
      handlers.onOpen?.();
    };

    ws.onclose = () => {
      setStatus('closed');
      handlers.onClose?.();
    };

    ws.onerror = (event) => {
      setStatus('error');
      handlers.onError?.(event);
    };

    ws.onmessage = (event) => handlers.onMessage?.(event);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url, handlers]);

  const send = (payload: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload);
      return true;
    }
    return false;
  };

  return { status, send, socket: wsRef.current };
}
