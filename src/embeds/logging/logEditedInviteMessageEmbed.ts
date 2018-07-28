import { Message, RichEmbed} from "discord.js";
import moment = require("moment");
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default async function logEditedInviteMessageEmbed(message: Message, oldMessage: Message, newContent: string){
    const database: IDatabase = Container.get(IDatabase)
    const currentStrikes = await database.getInviteStrikes(message.guild.id, message.author.id);
    const maxStrikes = await database.getGuildColumn(message.guild.id, 'invite_ban_threshold');
    return new RichEmbed()
        .setTitle(`Invite Deleted`)
        .setColor(`#ff4d4c`)
        .setDescription(`${message.author} tried to sneak an invite into one of their old messages in which they sent at ${message.channel}\n${moment(oldMessage.createdAt).calendar()}`)
        .addField(`Before Edit`, `${oldMessage.content}`)
        .addField(`After Edit`, newContent)
        .setFooter(`${message.author.username} is at ${currentStrikes}/${maxStrikes} total invite strikes.`)
}
