import {gb} from "../../misc/Globals";
import {debug} from "../../utility/Logging";

export function handleFatalErrorGracefully(err: Error){
    debug.error(`Received fatal error signal from a module, switching to sleep mode.`);
    debug.error(err);
    const bot = gb.bot;
    bot.user.setActivity('Sleeping...');
    gb.sleeping = true;
}
