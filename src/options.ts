export interface Options {
    host?: string;
    port?: number;
    reconnectInterval?: number;
    activityTimeout?: number;
    pongTimeout?: number;
    authEndpoint?: string;
    csrf?: string | null;
    useTLS?: boolean;
    maximumReconnects?: number;
}
