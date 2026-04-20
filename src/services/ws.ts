import { APP_CONFIG } from '@/constants/config';

export type WSMessageHandler = (data: any) => void;

export class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private closed = false;
  private messageHandlers: Set<WSMessageHandler> = new Set();
  private openHandlers: Set<() => void> = new Set();
  private queue: string[] = [];

  constructor(private url: string, private pingIntervalMs = 30000) {}

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.closed = false;
    try {
      this.ws = new WebSocket(this.url);
    } catch (err) {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.flushQueue();
      this.startPing();
      this.openHandlers.forEach((h) => h());
    };

    this.ws.onmessage = (event) => {
      let data: any;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        data = event.data;
      }
      this.messageHandlers.forEach((h) => h(data));
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };

    this.ws.onclose = () => {
      this.stopPing();
      if (!this.closed) this.scheduleReconnect();
    };
  }

  disconnect() {
    this.closed = true;
    this.stopPing();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.messageHandlers.clear();
    this.openHandlers.clear();
    this.queue = [];
  }

  send(data: object | string) {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    } else {
      this.queue.push(payload);
    }
  }

  onMessage(handler: WSMessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onOpen(handler: () => void): () => void {
    this.openHandlers.add(handler);
    return () => this.openHandlers.delete(handler);
  }

  isOpen() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private flushQueue() {
    while (this.queue.length && this.ws?.readyState === WebSocket.OPEN) {
      const msg = this.queue.shift()!;
      this.ws.send(msg);
    }
  }

  private scheduleReconnect() {
    if (this.closed) return;
    const { maxAttempts, initialDelay, maxDelay } = APP_CONFIG.wsReconnect;
    if (this.reconnectAttempt >= maxAttempts) return;
    const delay = Math.min(initialDelay * Math.pow(2, this.reconnectAttempt), maxDelay);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private startPing() {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ method: 'ping' }));
        } catch {
          // ignore
        }
      }
    }, this.pingIntervalMs);
  }

  private stopPing() {
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.pingTimer = null;
  }
}
