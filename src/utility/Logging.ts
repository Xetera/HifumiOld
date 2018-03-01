import * as dbg from 'debug'
import * as Discord from'discord.js'

export let debug = {
    silly  : dbg('Bot:Silly'),
    info   : dbg("Bot:Info"),
    warning: dbg('Bot:Warning'),
    error  : dbg("Bot:Error")
};

export function log(guild: Discord.Guild, message : String) : void {
    const logsChannel : Discord.GuildChannel = guild.channels.find('name', 'logs');
    if (!logsChannel){
        return debug.info(`Tried to log a message in ${guild.name} but a logs channel was not found.`);
    }
   if (logsChannel instanceof Discord.TextChannel){
        logsChannel.send('\`\`\`\n' + message + '\`\`\`');
        return debug.info(`Logged a message in ${guild.name}`);
   }
}
