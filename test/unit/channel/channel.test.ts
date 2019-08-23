import { Channel } from '../../../src/channel/channel';

test('missing name', () => {
    expect(() => {
        const channel = new Channel('');
    }).toThrow(Error);
});

test('create channel with name', () => {
    const channel = new Channel('TEST_NAME');

    expect(channel.name).toEqual('TEST_NAME');
});

test('bind to channel', (done) => {
    const channel = new Channel('TEST_NAME');

    channel.bind('TEST_EVENT', (data) => {
        expect(data).toEqual('TEST_DATA');
        done();
    });

    channel.emit('TEST_EVENT', 'TEST_DATA');
});
