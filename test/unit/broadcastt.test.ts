import Broadcastt from '../../src/broadcastt';
import {MockWebSocket} from './mock/mockWebSocket';
import {ConnectionState} from '../../src/status.const';
import {SECOND} from '../../src/time.const';

let windowWebsocket: any;

beforeEach(() => {
    // @ts-ignore
    windowWebsocket = window.WebSocket;
    // @ts-ignore
    window.WebSocket = MockWebSocket;
});

afterEach(() => {
    MockWebSocket.clearSockets();
    // @ts-ignore
    window.WebSocket = windowWebsocket;
});

test('missing key', () => {
    expect(() => {
        const broadcastt = new Broadcastt('');
    }).toThrow(Error);
});

test('initial state', () => {
    const broadcastt = new Broadcastt('TEST_KEY');

    expect(broadcastt.key).toBe('TEST_KEY');
    expect(broadcastt.connection.state).toBe(ConnectionState.Initialized);

    expect(broadcastt.options).toStrictEqual({
        host: 'eu.broadcastt.xyz',
        port: 443,
        reconnectInterval: 3 * SECOND,
        activityTimeout: 120,
        pongTimeout: 30,
        authEndpoint: '/broadcasting/auth',
        csrf: undefined,
        useTLS: true,
    });
});

test('options', () => {
    const broadcastt = new Broadcastt('TEST_KEY', {
        host: 'example.com',
        port: 9999,
        reconnectInterval: 99 * SECOND,
        activityTimeout: 999,
        pongTimeout: 99,
        authEndpoint: '/test-path',
        csrf: 'TEST_CSRF',
        useTLS: false,
    });

    expect(broadcastt.options).toStrictEqual({
        host: 'example.com',
        port: 9999,
        reconnectInterval: 99 * SECOND,
        activityTimeout: 999,
        pongTimeout: 99,
        authEndpoint: '/test-path',
        csrf: 'TEST_CSRF',
        useTLS: false,
    });
});

test('ws url', (done) => {
    const broadcastt = new Broadcastt('TEST_KEY');

    setTimeout(() => {
        const socket = MockWebSocket.lastSocket as MockWebSocket;
        expect(socket).toBeTruthy();

        expect(socket.url).toBe('wss://eu.broadcastt.xyz:443/app/TEST_KEY?protocol=7&client=js&version=0.3.0');
        done();
    });
});

test('bind to event', (done) => {
    const broadcastt = new Broadcastt('TEST_KEY');

    setTimeout(() => {
        const socket = MockWebSocket.lastSocket as MockWebSocket;
        expect(socket).toBeTruthy();

        broadcastt.bind('TEST_EVENT', (data) => {
            expect(data).toBe('TEST_DATA');
            done();
        });

        socket.open();
        socket.triggerMessage(JSON.stringify({
            event: 'TEST_EVENT',
            data: 'TEST_DATA',
        }));
    });
});

test('bind to connection established', (done) => {
    const broadcastt = new Broadcastt('TEST_KEY');

    setTimeout(() => {
        const socket = MockWebSocket.lastSocket as MockWebSocket;
        expect(socket).toBeTruthy();

        broadcastt.bind('pusher:connection_established', () => {
            done();
        });

        socket.open();
        socket.triggerMessage(JSON.stringify({
            event: 'pusher:connection_established',
            data: '{"socket_id":"1.1","activity_timeout":120}',
        }));
    });
});

test('subscribe to channel', () => {
    const broadcastt = new Broadcastt('TEST_KEY');

    const ch = broadcastt.subscribe('TEST_CHANNEL');
    expect(ch).toBeTruthy();
    expect(ch.name).toBe('TEST_CHANNEL');
});
