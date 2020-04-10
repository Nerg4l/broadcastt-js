/**
 * From RxJS test with modifications for compatibility with tests.
 */
import {Subject} from 'rxjs';

export class MockWebSocket {
    public static sockets: MockWebSocket[] = [];
    /**
     * Custom event
     */
    public static onConnect = new Subject<MockWebSocket>();

    public url: string;
    public protocol?: string | string[];
    public sent: Array<string | ArrayBufferLike | Blob | ArrayBufferView>;
    public handlers: any;
    public readyState: number;

    public closeCode: any;
    public closeReason: any;

    constructor(url: string, protocol?: string | string[]) {
        this.url = url;
        this.protocol = protocol;
        this.sent = [];
        this.handlers = {};
        this.readyState = 0;
        MockWebSocket.sockets.push(this);
        // Let connection finish
        setImmediate(() => {
            MockWebSocket.onConnect.next(this);
        });
    }

    public static get lastSocket(): MockWebSocket | undefined {
        const socket = MockWebSocket.sockets;
        const length = socket.length;
        return length > 0 ? socket[length - 1] : undefined;
    }

    public static clearSockets(): void {
        MockWebSocket.sockets.length = 0;
    }

    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        this.sent.push(data);
    }

    public get lastMessageSent(): any | undefined {
        const sent = this.sent;
        const length = sent.length;
        return length > 0 ? sent[length - 1] : undefined;
    }

    public triggerClose(e: {wasClean: boolean}) {
        this.readyState = 3;
        this.trigger('close', e);
    }

    public triggerMessage(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        const messageEvent = {
            data: data,
            origin: 'mockorigin',
            ports: undefined,
            source: MockWebSocket,
        };
        this.trigger('message', messageEvent);
    }

    public triggerError(ev: Event) {
        this.trigger('error', ev);
    }

    public open() {
        this.readyState = 1;
        this.trigger('open', {});
    }

    public close(code: any, reason?: any) {
        if (this.readyState < 2) {
            this.readyState = 2;
            this.closeCode = code;
            this.closeReason = reason;
            this.triggerClose({wasClean: true});
        }
    }

    public trigger(name: string, e: any) {
        // @ts-ignore
        if (this['on' + name]) {
            // @ts-ignore
            this['on' + name](e);
        }
        const lookup = this.handlers[name];
        if (lookup) {
            for (let i = 0; i < lookup.length; i++) {
                lookup[i](e);
            }
        }
    }
}
