import {EventCallback} from './eventCallback';

export class EventCallbackManager {
    private map: Map<string, EventCallback[]> = new Map<string, EventCallback[]>();

    /**
     * Bind a callback to an event.
     *
     * @param event Name of the event.
     * @param callback The callback which will be called on the event.
     * @param context? The object to be used as the this object.
     */
    public bind(event: string, callback: (...any: any) => any, context?: any): void {
        if (!this.map.has(event)) {
            this.map.set(event, []);
        }

        // @ts-ignore
        this.map.get(event).push({fn: callback, context});
    }

    /**
     * Unbind callbacks from an event.
     *
     * @param event? Name of the event.
     * @param callback? The callback which will be used to filter out a specific callback.
     * @param context? The object to be used as the this object.
     */
    public unbind(event?: string, callback?: (...any: any) => any, context?: any): void {
        if (!event && !callback && !context) {
            this.unbindAll();
            return;
        }

        if (!event) {
            return;
        }

        if (!callback && !context) {
            this.unbindEventByName(event);
            return;
        }

        this.unbindEventByCondition(event, callback, context);
    }

    private unbindAll(): void {
        this.map = new Map<string, EventCallback[]>();
    }

    private unbindEventByName(event: string): void {
        this.map.delete(event);
    }

    private unbindEventByCondition(event: string, callback?: (...any: any) => any, context?: any): void {
        let pool = this.map.get(event);

        if (!pool) {
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

    /**
     * Emit an event.
     *
     * @param event The name of the event.
     * @param data? The parameter for the called closures.
     */
    public emit(event: string, data?: any): void {
        const pool = this.map.get(event);

        if (!pool || pool.length === 0) {
            return;
        }

        pool.forEach((callback) => {
            callback.fn.apply(callback.context || window, [data]);
        });
    }
}
