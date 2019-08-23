import CallbackPool from '../callback-pool';

export class Channel {

    private _name: string;
    private _callbackPool: CallbackPool;

    constructor(name: string) {
        if (!name) {
            throw new Error('Parameter key must be present');
        }

        this._name = name;
        this._callbackPool = new CallbackPool();
    }

    get name(): string {
        return this._name;
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
