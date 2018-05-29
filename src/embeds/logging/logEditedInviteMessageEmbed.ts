import {GuildMember, Message, RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../utility/Settings";
import gb from "../../misc/Globals";
import moment = require("moment");

export default async function logEditedInviteMessageEmbed(message: Message, oldMessage: Message, newContent: string){
    const currentStrikes = await gb.instance.database.getInviteStrikes(message.guild.id, message.author.id);
    const maxStrikes = await gb.instance.database.getInviteBanThreshold(message.guild.id);
    return new RichEmbed()
        .setTitle(`Invite Deleted`)
        .setColor(`#ff4d4c`)
        .setDescription(`${message.author} tried to sneak an invite into one of their old messages in which they sent at ${message.channel}\n${moment(oldMessage.createdAt).calendar()}`)
        .addField(`Before Edit`, `${oldMessage.content}`)
        .addField(`After Edit`, newContent)
        .setFooter(`${message.author.username} is at ${currentStrikes}/${maxStrikes} total invite strikes.`)
}
