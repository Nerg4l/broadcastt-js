export interface WebSocketClient {
    onClose: ((ev: CloseEvent) => any) | null;
    onError: ((ev: Event) => any) | null;
    onMessage: ((ev: MessageEvent) => any) | null;
    onOpen: ((ev: Event) => any) | null;

    close(code?: number, reason?: string): void;

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
}
