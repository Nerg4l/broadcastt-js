import Broadcastt from '../../src/broadcastt';
import { WebSocketClientAdapter } from '../../src/websocket/web-socket-client-adapter';

class WebSocketClientMock {
    public url: string = '';

    public oninit = (...any: any) => {
        return;
    };

    public onclose = (...any: any) => {
        return;
    };
    public onerror = (...any: any) => {
        return;
    };
    public onmessage = (...any: any) => {
        return;
    };
    public onopen = (...any: any) => {
        return;
    };

    public close = (code?: number, reason?: string): void => {
        return;
    };
    public send = (data: string | ArrayBufferLike | Blob | ArrayBufferView): void => {
        return;
    };

    public triggerConnectionEstablished(socket_id: string, activity_timeout = 30) {
        const data = JSON.stringify({socket_id, activity_timeout});

        this.onmessage({
            data: JSON.stringify({event: 'broadcastt:connection_established', data}),
        });
    }
}

let webSocketMock: WebSocketClientMock;

beforeEach(() => {
    webSocketMock = new WebSocketClientMock();

    WebSocketClientAdapter.provider = (url: string) => {
        webSocketMock.url = url;
        webSocketMock.oninit();
        return webSocketMock as unknown as WebSocket;
    };
});

test('missing key', () => {
    expect(() => {
        const broadcastt = new Broadcastt('');
    }).toThrow(Error);
});

test('bind to channel', (done) => {
    const broadcastt = new Broadcastt('TEST_KEY');

    broadcastt.bind('TEST_EVENT', (data) => {
        expect(data).toEqual('TEST_DATA');
        done();
    });

    broadcastt.emit('TEST_EVENT', 'TEST_DATA');
});

afterEach(() => {
    // @ts-ignore
    WebSocketClientAdapter.provider = null;
});
