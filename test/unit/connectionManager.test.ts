import {ConnectionManager} from '../../src/connectionManager';
import {ConnectionState} from '../../src/status.const';
import {asapScheduler, Subject} from 'rxjs';
import {MockWebSocket} from './mock/mockWebSocket';
import {BroadcastEvent} from '../../src/event/broadcastEvent';
import {webSocket} from 'rxjs/webSocket';

let windowWebsocket: any;

beforeEach(() => {
    jest.useFakeTimers();
    // @ts-ignore
    windowWebsocket = window.WebSocket;
    // @ts-ignore
    window.WebSocket = MockWebSocket;
});

afterEach(() => {
    jest.useRealTimers();
    MockWebSocket.clearSockets();
    // @ts-ignore
    window.WebSocket = windowWebsocket;
});

test('initial state', () => {
    const connection = new ConnectionManager(new Subject());

    expect(connection.state).toBe(ConnectionState.Initialized);
});

test('status changes to connecting', (done) => {
    const subject = new Subject<BroadcastEvent>();
    const connection = new ConnectionManager(subject);
    expect(connection.state).toBe(ConnectionState.Initialized);
    let i = 0;
    connection.bind('state_change', (state) => {
        switch (i) {
            case 0:
                expect(state).toStrictEqual({
                    previous: ConnectionState.Initialized,
                    current: ConnectionState.Connecting,
                });
                expect(connection.state).toBe(ConnectionState.Connecting);
                done();
                break;
            default:
                throw new Error();
        }
        i++;
    });
});

test('status changes to connected', (done) => {
    const subject = new Subject<BroadcastEvent>();
    const connection = new ConnectionManager(subject);
    let i = 0;
    connection.bind('state_change', (state) => {
        switch (i) {
            case 0:
                break;
            case 1:
                expect(state).toStrictEqual({
                    previous: ConnectionState.Connecting,
                    current: ConnectionState.Connected,
                });
                expect(connection.state).toBe(ConnectionState.Connected);
                done();
                break;
            default:
                throw new Error();
        }
        i++;
    });

    asapScheduler.schedule(() => {
        subject.next({
            event: 'pusher:connection_established',
            data: '{"socket_id":"1.1","activity_timeout":120}',
        });
    });
});

test('close without error triggers reconnect', (done) => {
    const connection = new ConnectionManager(webSocket<BroadcastEvent>('wss://example.com'));

    const n = 2;
    let i = 1;
    connection.bind('connected', () => {
        try {
            expect(MockWebSocket.sockets.length).toBe(i);

            const socket = MockWebSocket.lastSocket as MockWebSocket;
            expect(socket).toBeTruthy();

            if (i < (n + 1)) {
                socket.trigger('error', new CloseEvent('error'));

                expect(setTimeout).toHaveBeenCalledTimes(i);
                expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
                jest.runAllTimers();
            }
            if (i > n) {
                done();
            }
            i++;
        } catch (e) {
            // RxJS rethrows error from setTimeout
            jest.useRealTimers();
            throw e;
        }
    });

    MockWebSocket.onConnect.subscribe((socket) => {
        socket.open();
        socket.triggerMessage(JSON.stringify({
            event: 'pusher:connection_established',
            data: '{"socket_id":"1.1","activity_timeout":120}',
        }));

        const ev = new Event('error');
        socket.triggerError(ev);
    });
});
