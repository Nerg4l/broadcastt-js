export interface EventCallback {
    fn: (...any: any) => any;
    context: any;
}
