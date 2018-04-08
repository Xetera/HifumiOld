import {debug} from "../../utility/Logging";
import gb from "../../misc/Globals";
import {User} from "discord.js";
import Signals = NodeJS.Signals;
import {createWarningEmbed} from "./processWarningEmbed";

export function catchSigterm(){
    process.once('SIGTERM', (signal : Signals) => {
        debug.warning(`SIGTERM RECEIVED, RESTARTING...`);
        debug.warning('received signal: ' + signal);

        const owner : User | undefined = gb.instance.bot.users.get(gb.ownerID);
        if (!owner)
            return debug.error('Could not fetch bot owner.');
        gb.instance.bot.user.setActivity('Restarting...');

        const embed = createWarningEmbed(`SIGTERM\nSignal: ${signal}`, `Received a sigterm signal, shutting down in 10s`);
        owner.send(embed);
    });
}