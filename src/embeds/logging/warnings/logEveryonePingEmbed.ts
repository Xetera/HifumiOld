import {Channel, GuildMember, RichEmbed} from "discord.js";

export default function logEveryonePingEmbed(member: GuildMember, channel: Channel){
    return new RichEmbed()
        .setTitle(`Ping Warning`)
        .setThumbnail(member.user.avatarURL)
        .setDescription(`${member} tried to mention \`@\`everyone in ${channel}`)
        .setColor('#ffc42a')
        .setTimestamp()
}
