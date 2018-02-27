import * as Discord from'discord.js'
import {debug} from '../Utility/Logging'
import {Database} from "../Database/Database";
import {Instance} from "../Misc/Globals";


// returning owner id at the end
export default function onReady(instance : Instance) : Promise<string> {
    const bot = instance.bot;
    const database = instance.database;
    debug.info(`${bot.user.username} is fully online.`);
    bot.generateInvite().then(link => {
        debug.info(`Invite link: ${link}`);

        let guilds = bot.guilds.array();
        let guildMessage = `Guilds: ${guilds.length}\n-----------------------------\n`;
        for (let guild of guilds){
            guildMessage += `[${guild.name}]: ${guild.members.array().length} members\n`;
        }

        debug.info(guildMessage);
    });

    //database.insertNewGuild(bot.guilds.find('id', '414334929002823680'));

    return bot.fetchApplication().then(app => {
        return app.owner.id;
    });

}