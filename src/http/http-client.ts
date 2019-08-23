export class HttpClient {
    public timeout: number = 0;

    public static requestProvider: () => XMLHttpRequest;

    public post(path: string, contentType: string, data: Document | BodyInit | null, headers?: Map<string, string>): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let xhr: XMLHttpRequest;

            if (HttpClient.requestProvider) {
                xhr = HttpClient.requestProvider();
            } else {
                xhr = new XMLHttpRequest();
            }

            xhr.timeout = this.timeout;
            xhr.open('POST', path, true);
            xhr.setRequestHeader('Content-Type', contentType);

            if (headers) {
                headers.forEach((value, key) => {
                    xhr.setRequestHeader(value, key);
                });
            }

            xhr.onload = () => {
                if (200 > xhr.status || xhr.status >= 300) {
                    reject({status: xhr.status, desc: `${xhr.status} response code`});
                    return;
                }

                resolve(xhr.responseText);
            };
            xhr.onerror = () => {
                reject({status: 0, desc: 'Unexpected error'});
            };
            xhr.ontimeout = () => {
                reject({status: 0, desc: 'Request timed out'});
            };
            xhr.send(data);
        });
    }
}
