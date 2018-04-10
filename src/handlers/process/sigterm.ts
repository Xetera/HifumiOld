import {debug} from "../../utility/Logging";
import gb from "../../misc/Globals";
import {User} from "discord.js";
import {createWarningEmbed} from "./processWarningEmbed";

export function catchSigterm(notifyOwner: boolean){
    process.once('SIGTERM', () => {
        debug.warning(`SIGTERM RECEIVED, RESTARTING...`);
        if (!notifyOwner)
            return;

        const owner : User | undefined = gb.instance.bot.users.get(gb.ownerID);
        if (!owner)
            return debug.error('Could not fetch bot owner.');
        gb.instance.bot.user.setActivity('Restarting...');

        const embed = createWarningEmbed(`SIGTERM`, `Received a sigterm (likely a heroku cycle). Shutting down in 10s`);
        owner.send(embed);
    });
}
