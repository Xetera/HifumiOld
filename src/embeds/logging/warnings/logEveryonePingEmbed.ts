import {Channel, GuildMember, RichEmbed} from "discord.js";
import {sanitizeUserInput} from "../../../utility/Util";

export default function logEveryonePingEmbed(member: GuildMember, channel: Channel, content: string){
    return new RichEmbed()
        .setTitle(`Ping Warning`)
        .setThumbnail(member.user.avatarURL)
        .setDescription(`${member} tried to mention \`@\`everyone in ${channel}`)
        .addField(`Message Content`, sanitizeUserInput(content))
        .setColor('#ffc42a')
        .setTimestamp()
}
