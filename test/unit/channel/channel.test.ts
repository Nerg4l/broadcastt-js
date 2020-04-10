import {Channel} from '../../../src/channel/channel';
import {Subject} from 'rxjs';
import {BroadcastEvent} from '../../../src/event/broadcastEvent';
import {MockXMLHttpRequest} from '../mock/mockXMLHttpRequest';

let windowXHR: any;

beforeEach(() => {
    // @ts-ignore
    windowXHR = window.XMLHttpRequest;
    // @ts-ignore
    window.XMLHttpRequest = MockXMLHttpRequest;
});

afterEach(() => {
    MockXMLHttpRequest.clearRequest();
    // @ts-ignore
    window.XMLHttpRequest = windowXHR;
});

test('missing name', () => {
    expect(() => {
        const channel = new Channel('', new Subject<BroadcastEvent>());
    }).toThrow(Error);
});

test('create channel with name', () => {
    const channel = new Channel('TEST_NAME', new Subject<BroadcastEvent>());

    expect(channel.name).toBe('TEST_NAME');
});

test('bind to event', (done) => {
    const subject = new Subject<BroadcastEvent>();

    const channel = new Channel('TEST_NAME', subject);

    channel.subscribe();
    channel.bind('TEST_EVENT', (data) => {
        expect(data).toBe('TEST_DATA');
        done();
    });

    // @ts-ignore
    subject.next({
        event: 'TEST_EVENT',
        data: 'TEST_DATA',
        channel: 'TEST_NAME',
    });
});
