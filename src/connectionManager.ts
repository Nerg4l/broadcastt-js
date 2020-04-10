import {ConnectionState} from './status.const';
import {asapScheduler, Subject} from 'rxjs';
import {EventCallbackManager} from './event/eventCallbackManager';
import {BroadcastEvent} from './event/broadcastEvent';
import {EventName} from './event/eventName';
import {SECOND} from './time.const';

export class ConnectionManager {
    private static TIMEOUT_FOR_UNAVAILABLE = 15 * SECOND;
    private static TIMEOUT_FOR_CONNECTING = 10 * SECOND;
    private numberOfReconnects = 0;

    private latestState: ConnectionState = ConnectionState.Initialized;
    private callbackManager: EventCallbackManager = new EventCallbackManager();
    private stateSubject: Subject<ConnectionState> = new Subject<ConnectionState>();

    private reconnects: number = 0;

    constructor(subject: Subject<BroadcastEvent>) {
        this.stateSubject.subscribe((v) => {
            if (v === this.latestState) {
                return;
            }
            const previousState = this.state;
            this.latestState = v;
            this.callbackManager.emit('state_change', {previous: previousState, current: v});
            this.callbackManager.emit(v);
        });

        this.connect(subject);
    }

    public get state(): ConnectionState {
        return this.latestState;
    }

    public bind(event: string, callback: (...any: any) => any, context?: any): this {
        this.callbackManager.bind(event, callback, context);
        return this;
    }

    private connect(subject: Subject<BroadcastEvent>) {
        const reconnectSubject = new Subject();
        reconnectSubject.subscribe(() => {
            asapScheduler.schedule(() => {
                if (this.state !== ConnectionState.Unavailable) {
                    this.stateSubject.next(ConnectionState.Connecting);
                }

                subject.subscribe((v) => {
                    this.numberOfReconnects = 0;
                    if (this.state !== ConnectionState.Connected) {
                        if (v.event === EventName.ConnectionEstablished) {
                            this.reconnects = 0;
                            this.stateSubject.next(ConnectionState.Connected);
                        }
                    }
                    this.callbackManager.emit(v.event, v.data);
                }, (e) => {
                    console.log(1, e);
                    if (this.state === ConnectionState.Connecting || this.state === ConnectionState.Unavailable) {
                        this.onClose(reconnectSubject);
                        return;
                    }
                    this.stateSubject.next(ConnectionState.Failed);
                }, () => {
                    console.log(1, 'complete');
                    // this.onClose(reconnectSubject);
                });
            });
        });
        reconnectSubject.next();
    }

    private onClose(reconnectSubject: Subject<any>): void {
        if (this.numberOfReconnects > 3) {
            this.stateSubject.next(ConnectionState.Unavailable);
        }

        let timeout: number;
        if (this.numberOfReconnects === 0) {
            timeout = 0;
        } else if (this.state === ConnectionState.Connecting) {
            timeout = ConnectionManager.TIMEOUT_FOR_CONNECTING;
        } else {
            timeout = ConnectionManager.TIMEOUT_FOR_UNAVAILABLE;
        }
        this.numberOfReconnects++;
        setTimeout(() => {
            reconnectSubject.next();
        }, timeout);
    }
}
