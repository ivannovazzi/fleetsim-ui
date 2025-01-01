type HandlerFn<T = unknown> = (data: T) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, HandlerFn<unknown>>();

  constructor(private wsUrl: string) {}

  connect() {
    if (this.ws) return; // Already connected
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        const handler = this.handlers.get(msg.type);
        if (handler) handler(msg.data);
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    this.ws.onopen = () => {
      this.handlers.get("connect")?.({});
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.handlers.get("disconnect")?.({});
      setTimeout(() => this.connect(), 5000); // Attempt reconnect
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.ws?.close();
    };
  }

  on(type: string, handler: HandlerFn) {
    this.handlers.set(type, handler);
  }

  off(type: string) {
    this.handlers.delete(type);
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}