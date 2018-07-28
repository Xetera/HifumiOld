import {IClient} from "../../interfaces/injectables/client.interface";
import {Container} from "typescript-ioc";
import {debug} from "../../utility/Logging";

export function handleFatalErrorGracefully(err: Error){
    debug.error(`Received fatal error signal from a module, switching to sleep mode.`);
    debug.error(err);
    const bot: IClient = Container.get(IClient);
    try {
        bot.user.setActivity('Sleeping...');
    } catch (e) {}
    bot.sleeping = true;
}
