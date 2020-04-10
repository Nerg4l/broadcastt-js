/**
 * Connection states
 *
 *
 * Example state changes:
 *
 * Given a supported browser and functioning internet connection, the following
 * states are expected
 * > initialized -> connecting -> connected
 *
 * Temporary failure of the Channels connection will cause
 * > connected -> connecting -> connected
 *
 * If an internet connection disappears
 * > connected -> connecting -> unavailable (after ~ 30s)
 *
 * When the internet connection becomes available again
 * > unavailable -> connected
 *
 * In the case that Channels is not supported
 * > initialized -> failed
 */
export enum ConnectionState {
    /**
     * Initial state. No event is emitted in this state.
     */
    Initialized = 'initialized',
    /**
     * All dependencies have been loaded and Channels is trying to connect. The
     * connection will also enter this state when it is trying to reconnect
     * after a connection failure.
     */
    Connecting = 'connecting',
    /**
     * The connection to Channels is open and authenticated with your app.
     */
    Connected = 'connected',
    /**
     * The connection is temporarily unavailable. In most cases this means that
     * there is no internet connection. It could also mean that Channels is
     * down, or some intermediary is blocking the connection. In this state,
     * pusher-js will automatically retry the connection every 15 seconds.
     */
    Unavailable = 'unavailable',
    /**
     * Channels is not supported by the browser. This implies that WebSockets
     * are not natively available and an HTTP-based transport could not be
     * found.
     */
    Failed = 'failed',
    /**
     * The Channels connection was previously connected and has now
     * intentionally been closed.
     */
    Disconnected = 'disconnected',
}
