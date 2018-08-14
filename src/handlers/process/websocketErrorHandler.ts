import {debug} from "../../utility/Logging";


export default function websocketErrorHandler(err: any){
    debug.error(err);
    debug.error('Got an error from discord websocket');
}
