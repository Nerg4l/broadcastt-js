
interface Callback {
    fn: (...any: any) => any;
    context: any;
}

export default class CallbackPool {
    private map: Map<string, Callback[]>;

    constructor() {
        this.map = new Map<string, Callback[]>();
    }

    /**
     * Bind a callback to an event.
     *
     * @param event Name of the event.
     * @param callback The callback which will be called on the event.
     * @param context The object to be used as the this object.
     */
    public bind(event: string, callback: (...any: any) => any, context?: any): this {
        if (!this.map.has(event)) {
            this.map.set(event, []);
        }

        // @ts-ignore
        this.map.get(event).push({fn: callback, context});
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
        if (event === undefined && callback === undefined && context === undefined) {
            this.unbindAll();
            return this;
        }

        if (event === undefined) {
            return this;
        }

        if (callback === undefined && context === undefined) {
            this.unbindEvent(event);
            return this;
        }

        this.unbindEventConditionally(event, callback, context);
        return this;
    }

    private unbindEventConditionally(event: string, callback?: (() => void), context?: any): void {
        let pool = this.map.get(event);

        if (pool === undefined) {
            return;
        }

        pool = pool.filter((o) => {
            return (callback && callback !== o.fn) || (context && context !== o.context);
        });

        if (pool.length === 0) {
            this.map.delete(event);
        } else {
            this.map.set(event, pool);
        }
    }

    private unbindEvent(event: string) {
        this.map.delete(event);
    }

    private unbindAll() {
        this.map = new Map<string, Callback[]>();
    }

    /**
     * Emit an event.
     *
     * @param event The name of the event.
     * @param data The parameter for the called closures.
     */
    public emit(event: string, data?: any): this {
        const pool = this.map.get(event);

        if (pool === undefined || pool.length === 0) {
            return this;
        }

        pool.forEach((callback) => {
            callback.fn.apply(callback.context || global, [data]);
        });

        return this;
    }
}
