import {gb} from "../../misc/Globals";
import {Environments} from "../../events/systemStartup";
export default function uncaughtException(){
    process.on('uncaughtException', err => {
        console.error(err);
        console.error('This should be looked into and the bot should preferably be restarted');
        if (gb.ENV === Environments.Production)
            gb.heroku.delete('apps/discord-hifumi/dynos').then(console.log);
    });
}
