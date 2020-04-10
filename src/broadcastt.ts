import {Options} from './options';
import {SECOND} from './time.const';
import {EventCallbackManager} from './event/eventCallbackManager';
import {Channel} from './channel/channel';
import {Subject} from 'rxjs';
import {BroadcastEvent} from './event/broadcastEvent';
import {CLIENT, PROTOCOL, VERSION} from './info.const';
import {ConnectionManager} from './connectionManager';
import {webSocket} from 'rxjs/webSocket';

export default class Broadcastt {

    private readonly _key: string;

    private channels: Map<string, Channel> = new Map<string, Channel>();
    private webSocketSubject: Subject<BroadcastEvent>;
    private callbackManager: EventCallbackManager = new EventCallbackManager();

    public readonly options: Options;
    public readonly connection: ConnectionManager;

    private defaultOptions: Options = {
        host: 'eu.broadcastt.xyz',
        port: 443,
        reconnectInterval: 3 * SECOND,
        activityTimeout: 120,
        pongTimeout: 30,
        authEndpoint: '/broadcasting/auth',
        csrf: undefined,
        useTLS: true,
    };

    constructor(key: string, options: Options = {}) {
        if (!key) {
            throw new Error('Parameter key must be present');
        }
        this.options = {...this.defaultOptions, ...options};

        this._key = key;
        const webSocketSubject = webSocket<BroadcastEvent>(this.buildURL());
        webSocketSubject.subscribe((v) => this.callbackManager.emit(v.event, v.data));
        this.webSocketSubject = webSocketSubject;
        this.connection = new ConnectionManager(webSocketSubject);
        this.connection.bind('connected', () => {
            this.channels.forEach((v) => {
                v.subscribe();
            });
        });
    }

    /**
     * Return the key of the object
     */
    public get key() {
        return this._key;
    }

    private buildURL(): string {
        const scheme = this.options.useTLS ? 'wss' : 'ws';
        const path = '/app/' + this._key;
        const params = ['protocol=' + PROTOCOL, 'client=' + CLIENT, 'version=' + VERSION].join('&');

        return scheme + '://' + this.options.host + ':' + this.options.port + path + '?' + params;
    }

    /**
     * Bind a callback to an event.
     *
     * @param event Name of the event.
     * @param callback The callback which will be called on the event.
     * @param context The object to be used as the this object.
     */
    public bind(event: string, callback: (...any: any) => any, context?: any): this {
        this.callbackManager.bind(event, callback, context);
        return this;
    }

    /**
     * Unbind callbacks from an event.
     *
     * @param event Name of the event.
     * @param callback The callback which will be used to filter out a specific callback.
     * @param context The object to be used as the this object.
     */
    public unbind(event?: string, callback?: (...any: any) => any, context?: any): this {
        this.callbackManager.unbind(event, callback, context);
        return this;
    }

    /**
     * Subscribe to a channel.
     *
     * @param channel name of the target channel.
     */
    public subscribe(channel: string): Channel {
        if (!this.channels.has(channel)) {
            this.channels.set(channel, new Channel(channel, this.webSocketSubject));
        }
        const ch = this.channels.get(channel) as Channel;
        return ch.subscribe();
    }

    /**
     * Disconnect from connection.
     *
     * Connections automatically close when a user navigates to another web page or closes their web browser so there is no need to do this manually.
     */
    public disconnect(): void {
        // TODO
    }
}
