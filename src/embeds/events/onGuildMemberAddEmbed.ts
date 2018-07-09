import * as Discord from "discord.js";
import {GuildMember} from "discord.js";
import {capitalize, random, StringUtils} from "../../utility/Util";
import {welcomeMessages} from "../../interfaces/Replies";
import parseEmbedPlaceholders from "../../parsers/parseEmbedPlaceholders";
import isUrl = StringUtils.isUrl;

export default function guildMemberAddEmbed(member: GuildMember, message?: string, title?: string, footer?: string, color?: string, thumbnail?: string) {
    const embed = new Discord.RichEmbed()

    if (message) {
        message = parseEmbedPlaceholders(member, message);
        embed.setDescription(message)
    }

    if (title) {
        title = parseEmbedPlaceholders(member, title);
        embed.setTitle(title);
    }

    if (!thumbnail) {
        embed.setThumbnail(member.user.avatarURL);
    }
    else if (thumbnail && isUrl(thumbnail)) {
        embed.setThumbnail(thumbnail)
    }

    if (footer) {
        footer = parseEmbedPlaceholders(member, footer);
        embed.setFooter(footer);
    }

    if (color) {
        color.replace('#', '');
        embed.setColor(color.toUpperCase());
    }
    return embed;
}
