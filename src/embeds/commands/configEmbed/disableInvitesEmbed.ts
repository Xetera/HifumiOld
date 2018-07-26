import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";

export default async function disableInvitesEmbed(guild: Guild){
    const rm = ReactionManager.getInstance();
    const embed = new RichEmbed()
        .setTitle(`Invite No Longer Allowed`)
        .setColor('#a7ffec')
        .setDescription(`Invites for non-mods are now off, don't you dare send one.`);
    await ReactionManager.canSendReactions(guild.id) ?  embed.setThumbnail(rm.stare) : '';
    return embed;
}
