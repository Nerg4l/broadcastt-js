export interface Options {
    /**
     * The library tries to connect to the given host. By design this used by our development team, but you can change this any time.
     *
     * Default value: `eu.broadcastt.xyz`
     */
    host?: string;
    /**
     * The library tries to connect to the given port. By design this used by our development team, but you can change this any time.
     *
     * Default value: `443` or `80` depending on the value of `encrypted` option
     */
    port?: number;
    /**
     * If anything goes wrong and the client disconnects, the library will try to reconnect. The delay between the reconnection attempts is determined by this and the number of retries.
     *
     * Calculated `this * <number of retries>`. Which means the delay is incremented linearly.
     */
    reconnectInterval?: number;
    /**
     * Can only be used by our development team, because the value given by you will be overridden after connection with the value sent by the server.
     *
     * Default value: `120`
     */
    activityTimeout?: number;
    /**
     * Determines the acceptable timeout for the pong message sent by the server for a ping message.
     *
     * May become deprecated in later versions because RFC 6455 has Control Frames for ping and pong messages.
     *
     * Default value: `30`
     */
    pongTimeout?: number;
    /**
     * Relative or absolute url to be called by this library for private and presence channel authentication.
     *
     * Default value: `/broadcasting/auth`
     */
    authEndpoint?: string;
    /**
     * Cross-site request forgery token which will be set in the header as `X-CSRF-TOKEN` when calling the auth endpoint.
     *
     * Default value: `undefined`
     */
    csrf?: string;
    /**
     * Determines if `ws` or `wss` protocol should be called.
     *
     * Default value: `true`
     */
    useTLS?: boolean;
}
