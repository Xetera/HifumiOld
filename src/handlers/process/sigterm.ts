import {debug} from "../../utility/Logging";
import gb from "../../misc/Globals";
import {User} from "discord.js";
import {createWarningEmbed} from "./processWarningEmbed";

export function catchSigterm(notifyOwner: boolean){
    process.once('SIGTERM', () => {
        debug.warning(`SIGTERM RECEIVED, RESTARTING...`);
        const owner : User | undefined = gb.instance.bot.users.get(gb.ownerID);
        if (!owner || !notifyOwner) {
            debug.error('Could not fetch bot owner to send sigterm embed.');
            return process.exit(0);
        }
        gb.instance.bot.user.setActivity('Restarting...').then(() => {
            const embed = createWarningEmbed(`SIGTERM`, `Received a sigterm (likely a heroku cycle). Shutting down now`);
            owner.send(embed);
            process.exit(0);
        })
    });
}
