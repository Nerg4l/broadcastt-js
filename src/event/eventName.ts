export enum EventName {
    ConnectionEstablished = 'pusher:connection_established',
    Ping = 'pusher:ping',
    Pong = 'pusher:pong',

    Subscribe = 'pusher:subscribe',
    InternalSubscriptionSucceeded = 'pusher_internal:subscription_succeeded',
    SubscriptionSucceeded = 'pusher:subscription_succeeded',
    SubscriptionError = 'pusher:subscription_error',
}
