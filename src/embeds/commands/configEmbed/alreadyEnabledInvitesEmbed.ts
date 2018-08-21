import {Guild, RichEmbed} from "discord.js";
import {canSendReactions, weary} from "../../../handlers/internal/reactions/reactionManager";

export default async function alreadyEnabledInvitesEmbed(guild: Guild){
    const embed = new RichEmbed()
        .setDescription(`It's fine, I'm already allowing invites here...\nfor some reason...`)
        .setColor('#a7ffec');
    await canSendReactions(guild.id) ? embed.setThumbnail(weary) : '';
    return embed;
}
