import {Guild, RichEmbed} from "discord.js";
import {canSendReactions, stare} from "../../../handlers/internal/reactions/reactionManager";

export default async function disableInvitesEmbed(guild: Guild){
    const embed = new RichEmbed()
        .setTitle(`Invite No Longer Allowed`)
        .setColor('#a7ffec')
        .setDescription(`Invites for non-mods are now off, don't you dare send one.`);
    await canSendReactions(guild.id) ?  embed.setThumbnail(stare) : '';
    return embed;
}
