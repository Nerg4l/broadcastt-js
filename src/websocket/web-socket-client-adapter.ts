import { CLIENT, PROTOCOL, VERSION } from '../info.const';
import { WebSocketClient } from './web-socket-client';

export class WebSocketClientAdapter implements WebSocketClient {
    public static provider: (url: string) => WebSocket;

    private socket: WebSocket;

    public onClose: ((ev: CloseEvent) => any) | null;
    public onError: ((ev: Event) => any) | null;
    public onMessage: ((ev: MessageEvent) => any) | null;
    public onOpen: ((ev: Event) => any) | null;

    constructor(url: string) {
        url = url + '?protocol=' + PROTOCOL + '&client=' + CLIENT + '&version=' + VERSION;

        if (WebSocketClientAdapter.provider) {
            this.socket = WebSocketClientAdapter.provider(url);
        } else {
            this.socket = new WebSocket(url);
        }

        this.onClose = null;
        this.onError = null;
        this.onMessage = null;
        this.onOpen = null;

        this.socket.onclose = (ev) => {
            if (this.onClose) {
                this.onClose(ev);
            }
        };
        this.socket.onerror = (ev) => {
            if (this.onError) {
                this.onError(ev);
            }
        };
        this.socket.onmessage = (ev) => {
            if (this.onMessage) {
                this.onMessage(ev);
            }
        };
        this.socket.onopen = (ev) => {
            if (this.onOpen) {
                this.onOpen(ev);
            }
        };
    }

    public close(code?: number, reason?: string): void {
        this.socket.close(code, reason);
    }

    public send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
        this.socket.send(data);
    }
}
