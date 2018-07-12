import * as Discord from "discord.js";
import {GuildMember} from "discord.js";
import {capitalize, random, StringUtils} from "../../utility/Util";
import parseTemplatePlaceholders from "../../parsers/parseTemplatePlaceholders";
import isUrl = StringUtils.isUrl;

export default function guildMemberAddEmbed(member: GuildMember, message?: string, title?: string, footer?: string, color?: string, thumbnail?: string, image?: string) {
    const embed = new Discord.RichEmbed();

    if (message) {
        message = parseTemplatePlaceholders(member, message);
        embed.setDescription(message)
    }

    if (title) {
        title = parseTemplatePlaceholders(member, title);
        embed.setTitle(title);
    }

    if (!thumbnail) {
        embed.setThumbnail(member.user.displayAvatarURL);
    }
    else if (thumbnail && isUrl(thumbnail)) {
        embed.setThumbnail(thumbnail)
    }

    if (image){
        embed.setImage(image);
    }

    if (footer) {
        footer = parseTemplatePlaceholders(member, footer);
        embed.setFooter(footer);
    }

    if (color) {
        color.replace('#', '');
        embed.setColor(color.toUpperCase());
    }
    return embed;
}
