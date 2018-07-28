import {Channel, GuildMember, RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../../utility/Settings";

export default function logMentionSpamEmbed(member: GuildMember, channel: Channel, content: string, mentioned: GuildMember[]) {
    return new RichEmbed()
        .setColor(warningEmbedColor)
        .addField(`Ping Warning`, `${member} tried to mention ${mentioned.length} users at once in ${channel}.`)
        .addField(`Message Content`, content)
        .setThumbnail(member.user.avatarURL)
        .setTimestamp();
}
