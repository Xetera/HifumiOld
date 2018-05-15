export default function websocketWarningHandler(error: any){
    console.warn(`A warning was received from the websocket`);
    console.warn(error);
}
