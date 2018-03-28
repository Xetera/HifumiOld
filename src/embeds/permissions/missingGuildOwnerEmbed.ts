import {Guild, RichEmbed} from "discord.js";

export default function missingGuildOwnerEmbed(guild: Guild): RichEmbed {
    return new RichEmbed()
        .setTitle(`Nice try`)
        .setDescription(`This command is only available to ${guild.owner}.`)
        .setColor('#ff0000');
}