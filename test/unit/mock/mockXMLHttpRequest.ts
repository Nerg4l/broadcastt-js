/**
 * From RxJS test with modifications for TypeScript compatibility
 */
export class MockXMLHttpRequest {
    public static requests: MockXMLHttpRequest[] = [];
    public static recentRequest: MockXMLHttpRequest | null;

    public responseType: string;
    public eventHandlers: Array<{name: string, handler: any}>;
    public readyState: number;
    public async: boolean;
    public requestHeaders: any;
    public withCredentials: boolean;
    public upload: any;
    public previousRequest: MockXMLHttpRequest | null;

    public method?: string;
    public url?: string;
    public user?: string;
    public password?: string;
    public response?: string;
    public responseText?: string;
    public responseHeaders?: any;
    public status?: number;

    public data: any;

    constructor() {
        this.responseType = '';
        this.eventHandlers = [];
        this.readyState = 0;
        this.async = true;
        this.requestHeaders = {};
        this.withCredentials = false;
        this.upload = {};
        this.previousRequest = MockXMLHttpRequest.recentRequest;
        MockXMLHttpRequest.recentRequest = this;
        MockXMLHttpRequest.requests.push(this);
    }

    public static get mostRecent(): MockXMLHttpRequest | null {
        return MockXMLHttpRequest.recentRequest;
    }

    public static get allRequests(): MockXMLHttpRequest[] {
        return MockXMLHttpRequest.requests;
    }

    public static clearRequest(): void {
        MockXMLHttpRequest.requests.length = 0;
        MockXMLHttpRequest.recentRequest = null;
    }

    public send(data: any): void {
        this.data = data;
    }

    public open(method: string, url: string, async: boolean, user: string, password: string): void {
        this.method = method;
        this.url = url;
        this.async = async;
        this.user = user;
        this.password = password;
        this.readyState = 1;
        this.triggerEvent('readyStateChange');
        const originalProgressHandler = this.upload.onprogress;
        Object.defineProperty(this.upload, 'progress', {
            get: () => {
                return originalProgressHandler;
            },
        });
    }

    public setRequestHeader(key: any, value: any): void {
        this.requestHeaders[key] = value;
    }

    public addEventListener(name: any, handler: any): void {
        this.eventHandlers.push({name: name, handler: handler});
    }

    public removeEventListener(name: any, handler: any): void {
        for (let i = this.eventHandlers.length - 1; i--;) {
            const eh = this.eventHandlers[i];
            if (eh.name === name && eh.handler === handler) {
                this.eventHandlers.splice(i, 1);
            }
        }
    }

    public throwError(err: any): void {
        this.triggerEvent('error', err);
    }

    public jsonResponseValue(response: any): void {
        try {
            this.response = JSON.parse(response.responseText);
        } catch (err) {
            throw new Error('unable to JSON.parse: \n' + response.responseText);
        }
    }

    public defaultResponseValue(): void {
        if (this.async === false) {
            this.response = this.responseText;
        } else {
            throw new Error('unhandled type "' + this.responseType + '"');
        }
    }

    public respondWith(response: any, progressTimes: any): void {
        if (progressTimes) {
            for (let i = 1; i <= progressTimes; ++i) {
                this.triggerUploadEvent('progress', {type: 'ProgressEvent', total: progressTimes, loaded: i});
            }
        }
        this.readyState = 4;
        this.responseHeaders = {
            'Content-Type': response.contentType || 'text/plain',
        };
        this.status = response.status || 200;
        this.responseText = response.responseText;
        if (!('response' in response)) {
            switch (this.responseType) {
                case 'json':
                    this.jsonResponseValue(response);
                    break;
                case 'text':
                    this.response = response.responseText;
                    break;
                default:
                    this.defaultResponseValue();
            }
        }
        this.triggerEvent('load');
        this.triggerEvent('readystatechange');
    }

    public triggerEvent(name: any, eventObj?: any): void {
        const e = eventObj || {};
        // @ts-ignore
        if (this['on' + name]) {
            // @ts-ignore
            this['on' + name](e);
        }
        this.eventHandlers.forEach((eh: any) => {
            if (eh.name === name) {
                eh.handler.call(this, e);
            }
        });
    }

    public triggerUploadEvent(name: any, eventObj: any): void {
        const e = eventObj || {};
        if (this.upload['on' + name]) {
            this.upload['on' + name](e);
        }
    }
}
