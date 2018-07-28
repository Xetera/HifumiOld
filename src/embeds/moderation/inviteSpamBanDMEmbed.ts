import {Guild, RichEmbed} from "discord.js";
import {advertiseOnBan} from "../../interfaces/Replies";
import ReactionManager from "../../handlers/internal/reactions/reactionManager";
import {gb} from "../../misc/Globals";

export default async function inviteSpamBanEmbed(guild: Guild): Promise<RichEmbed>{
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    return new RichEmbed()
        .setTitle(`Banned ⛔`)
        .setColor('#FF0000')
        .setThumbnail(guild.iconURL)
        .setDescription(`You were banned from **${guild.name}** for posting ${await gb.database.getInviteBanThreshold(guild.id)} invites, advertising is not allowed, sorry.\n\n${advertiseOnBan()}`)
        .setImage(ReactionManager.getInstance().turn)
        .setTimestamp()
}
