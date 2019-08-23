import { Options } from './options';
import { SECOND } from './time.const';
import CallbackPool from './callback-pool';

interface Callback {
    fn: (...any: any) => any;
    context: any;
}

export default class Broadcastt {
    private _callbackPool: CallbackPool;

    private static defaultOptions: Options = {
        host: 'eu.broadcastt.xyz',
        port: 443,
        reconnectInterval: 3 * SECOND,
        activityTimeout: 120,
        pongTimeout: 30,
        authEndpoint: '/broadcasting/auth',
        csrf: null,
        useTLS: true,
        maximumReconnects: 8,
    };

    constructor(key: string, options: Options = {}) {
        if (!key) {
            throw new Error('Parameter key must be present');
        }

        this._callbackPool = new CallbackPool();
    }

    /**
     * Bind a callback to an event.
     *
     * @param event Name of the event.
     * @param callback The callback which will be called on the event.
     * @param context The object to be used as the this object.
     */
    public bind(event: string, callback: (...any: any) => any, context?: any): this {
        this._callbackPool.bind(event, callback, context);
        return this;
    }

    /**
     * Unbind callbacks from an event.
     *
     * @param event Name of the event.
     * @param callback The callback which will be used to filter out a specific callback.
     * @param context The object to be used as the this object.
     */
    public unbind(event?: string, callback?: (() => void), context?: any): this {
        this._callbackPool.unbind(event, callback, context);
        return this;
    }

    /**
     * Emit an event.
     *
     * @param event The name of the event.
     * @param data The parameter for the called closures.
     */
    public emit(event: string, data?: any): this {
        this._callbackPool.emit(event, data);
        return this;
    }
}
