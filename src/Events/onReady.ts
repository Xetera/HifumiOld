import * as Discord from'discord.js'
import * as dbg from 'debug'

const log = dbg('Bot: Ready');

export default function onReady(bot : Discord.Client){

    log(`${bot.user.username} is ready!`);
    bot.generateInvite().then(link => {
        log(`Invite link: ${link}`);

        let guilds = bot.guilds.array();
        let guildMessage = `Guilds: ${guilds.length}\n-----------------------------\n`;
        for (let guild of guilds){
            guildMessage += `${guild.name}: ${guild.members.array().length} members\n`;
        }

        log(guildMessage);
    });

}