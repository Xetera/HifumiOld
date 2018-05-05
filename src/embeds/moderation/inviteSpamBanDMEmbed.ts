import {Guild, RichEmbed} from "discord.js";
import {advertiseOnBan} from "../../interfaces/Replies";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";

export default function inviteSpamBanEmbed(guild: Guild): RichEmbed{
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    return new RichEmbed()
        .setTitle(`Banned ⛔`)
        .setColor('#FF0000')
        .setThumbnail(guild.iconURL)
        .setDescription(`You were banned from **${guild.name}** for posting 5 invites, advertising is not allowed, sorry.\n\n${advertiseOnBan()}`)
        .setImage(ReactionManager.getInstance().turn)
        .setTimestamp()
}
