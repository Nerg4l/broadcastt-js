export default interface Listener {
    event: string;
    callback: (...any: any) => any;
}
