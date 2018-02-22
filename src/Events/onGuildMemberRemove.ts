import * as Discord from "discord.js";
import * as dbg from "debug";

export const debug = {
    silly: dbg('Bot:onGuildMemberRemove:Silly'),
    info: dbg('Bot:onGuildMemberRemove:Info'),
    warning: dbg('Bot:onGuildMemberRemove:Warning'),
    error: dbg('Bot:onGuildMemberRemove:Error')
};

export default function onGuildMemberRemove(member : Discord.GuildMember) : void {
    // we will change this later to fetch from a database instead of using a preset name
    const welcomeChannel : Discord.Channel | undefined = member.guild.channels.find('name', 'welcome');
    const identifier     : string = member.user.bot ? 'A bot' : 'A human';
    if (welcomeChannel === undefined) {
        return debug.info(`Could not send a member leave message to ${member.guild.name} `+
            `because a welcome channel was missing.`);
    }
    else if (welcomeChannel instanceof Discord.TextChannel){
        let embed = new Discord.RichEmbed()
            .setAuthor(member.displayName, member.user.displayAvatarURL)
            .setTimestamp()
            .setColor("RED")
            .setTitle(`${identifier} just left the server.`);
        welcomeChannel.send(embed);
    }
}