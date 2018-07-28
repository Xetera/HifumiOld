import {Message, RichEmbed} from "discord.js";
import {gb} from "../../misc/Globals";

export default async function logInviteMessageEmbed(message: Message) {
    const currentStrikes = await gb.database.getInviteStrikes(message.guild.id, message.author.id);
    const strikeLimit = await gb.database.getInviteBanThreshold(message.guild.id);
    return new RichEmbed()
        .setTitle(`Invite Deleted`)
        .setColor(`#ff4d4c`)
        .setDescription(`Deleted an invite from ${message.author} in ${message.channel}`)
        .addField(`Content`, message.content)
        .setFooter(
            `${message.author.username} is at ${currentStrikes}/${strikeLimit} total invite strikes.`);
}
