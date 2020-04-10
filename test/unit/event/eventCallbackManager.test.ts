import {EventCallbackManager} from '../../../src/event/eventCallbackManager';

test('bind to event', () => {
    const manager = new EventCallbackManager();

    const mockFn = jest.fn((data) => {
        expect(data).toBe('TEST_DATA');
    });

    manager.bind('TEST_EVENT', mockFn);

    manager.emit('TEST_EVENT', 'TEST_DATA');

    expect(mockFn.mock.calls.length).toBe(1);
});

test('multiple bind to event', () => {
    const manager = new EventCallbackManager();

    const mockFn1 = jest.fn((data) => {
        expect(data).toBe('TEST_DATA');
    });
    const mockFn2 = jest.fn((data) => {
        expect(data).toBe('TEST_DATA');
    });

    manager.bind('TEST_EVENT', mockFn1);
    manager.bind('TEST_EVENT', mockFn2);

    manager.emit('TEST_EVENT', 'TEST_DATA');

    expect(mockFn1.mock.calls.length).toBe(1);
    expect(mockFn2.mock.calls.length).toBe(1);
});

test('unbind all from event', () => {
    const manager = new EventCallbackManager();

    const mockFn = jest.fn((data) => {
        expect(data).toBe('TEST_DATA');
    });

    manager.bind('TEST_EVENT', mockFn);
    manager.unbind('TEST_EVENT');

    manager.emit('TEST_EVENT', 'TEST_DATA');

    expect(mockFn.mock.calls.length).toBe(0);
});

test('unbind one from event', () => {
    const manager = new EventCallbackManager();

    const mockFn1 = jest.fn((data) => {
        expect(data).toBe('TEST_DATA');
    });
    const mockFn2 = jest.fn((data) => {
        expect(data).toBe('TEST_DATA');
    });

    manager.bind('TEST_EVENT', mockFn1);
    manager.bind('TEST_EVENT', mockFn2);

    manager.unbind('TEST_EVENT', mockFn1);

    manager.emit('TEST_EVENT', 'TEST_DATA');

    expect(mockFn1.mock.calls.length).toBe(0);
    expect(mockFn2.mock.calls.length).toBe(1);
});
