import * as Discord from "discord.js";
import {GuildMember} from "discord.js";
import {capitalize, random} from "../../utility/Util";
import {welcomeMessages} from "../../interfaces/Replies";
import parseEmbedPlaceholders from "../../parsers/parseEmbedPlaceholders";
export default function guildMemberAddEmbed(member: GuildMember, message?: string, title?: string, footer?: string){
    if (message){
        message = parseEmbedPlaceholders(member, message);
    } else {
        message = random(welcomeMessages(member));
    }

    const embed = new Discord.RichEmbed()
        .setThumbnail(member.user.displayAvatarURL)
        .setTitle(title)
        .setDescription(message)
        .setColor("GREEN")
        .setTimestamp();

    if (title){
        title = parseEmbedPlaceholders(member, title);
        embed.setTitle(title);
    }
    if (footer){
        footer = parseEmbedPlaceholders(member, footer);
        embed.setFooter(footer);
    }
    return embed;
}
