export default function websocketErrorHandler(err: any){
    console.error(err);
    console.error('Got an error from discord websocket, attempting to restart dyno...');
}
