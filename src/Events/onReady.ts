import * as Discord from'discord.js'
import {debug} from '../Utility/Logging'



export default function onReady(bot : Discord.Client){

    debug.info(`${bot.user.username} is fully online.`);
    bot.generateInvite().then(link => {
        debug.info(`Invite link: ${link}`);

        let guilds = bot.guilds.array();
        let guildMessage = `Guilds: ${guilds.length}\n-----------------------------\n`;
        for (let guild of guilds){
            guildMessage += `${guild.name}: ${guild.members.array().length} members\n`;
        }

        debug.info(guildMessage);
    });

}