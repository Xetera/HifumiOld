import {Message, RichEmbed} from "discord.js";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function logInviteMessageEmbed(message: Message) {
    const database: IDatabase = Container.get(IDatabase)
    const currentStrikes = await database.getInviteStrikes(message.guild.id, message.author.id);
    const strikeLimit = await database.getGuildColumn(message.guild.id, 'invite_ban_threshold');
    return new RichEmbed()
        .setTitle(`Invite Deleted`)
        .setColor(`#ff4d4c`)
        .setDescription(`Deleted an invite from ${message.author} in ${message.channel}`)
        .addField(`Content`, message.content)
        .setFooter(
            `${message.author.username} is at ${currentStrikes}/${strikeLimit} total invite strikes.`);
}
