import {debug} from "../../utility/Logging";
import {User} from "discord.js";
import {createWarningEmbed} from "./processWarningEmbed";
import {Container} from "typescript-ioc";
import {IClient} from "../../interfaces/injectables/client.interface";

export function catchSigterm(notifyOwner: boolean){
    const bot: IClient = Container.get(IClient);
    process.once('SIGTERM', () => {
        debug.warning(`SIGTERM RECEIVED, RESTARTING...`);
        const owner : User | undefined = bot.users.get(bot.owner);
        if (!owner || !notifyOwner) {
            debug.error('Could not fetch bot owner to send sigterm embed.');
            return process.exit(0);
        }
        bot.user.setActivity('Restarting...').then(() => {
            const embed = createWarningEmbed(`SIGTERM`, `Received a sigterm (likely a heroku cycle). Shutting down now`);
            owner.send(embed);
            process.exit(0);
        })
    });
}
