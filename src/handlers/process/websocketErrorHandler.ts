import {Environments} from "../../events/systemStartup";
import gb from "../../misc/Globals";

export default function websocketErrorHandler(err: any){
    console.error(err);
    console.error('Got an error from discord websocket, attempting to restart dyno...');
    if (gb.ENV === Environments.Live)
        gb.instance.heroku.delete('apps/discord-alexa/dynos').then(console.log);
}
