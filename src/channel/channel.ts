import {EventCallbackManager} from '../event/eventCallbackManager';
import {Subject, Unsubscribable} from 'rxjs';
import {BroadcastEvent} from '../event/broadcastEvent';
import {filter} from 'rxjs/operators';
import {EventName} from '../event/eventName';

export class Channel {

    private _name: string;

    private callbackManager: EventCallbackManager = new EventCallbackManager();

    private subject: Subject<BroadcastEvent>;
    private unsubscribable?: Unsubscribable;

    constructor(name: string, observable: Subject<BroadcastEvent>) {
        if (!name) {
            throw new Error('Parameter key must be present');
        }

        this._name = name;
        this.subject = observable;
    }

    /**
     * Return the name of the class.
     */
    get name(): string {
        return this._name;
    }

    /**
     * Subscribe to the channel.
     */
    public subscribe(): this {
        if (!this.unsubscribable) {
            this.unsubscribable = this.subject.pipe(filter((v) => {
                return v.channel === this.name;
            })).subscribe((v) => {
                this.callbackManager.emit(v.event, v.data);
            });
            this.subject.next({
                event: EventName.Subscribe,
                data: {channel: this.name},
            });
        }
        return this;
    }

    /**
     * Unsubscribe from channel.
     */
    public unsubscribe(): void {
        if (!this.unsubscribable) {
            return;
        }
        this.unsubscribable.unsubscribe();
        this.unsubscribable = undefined;
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
}
