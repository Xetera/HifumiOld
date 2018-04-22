import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/reactions/reactionManager";

export default async function alreadyEnabledInvitesEmbed(guild: Guild){
    const rm = ReactionManager.getInstance();
    const embed = new RichEmbed()
        .setDescription(`It's fine, I'm already allowing invites here...\nfor some reason...`)
        .setColor('#a7ffec');
    await ReactionManager.canSendReactions(guild.id) ? embed.setImage(rm.weary) : '';
    return embed;
}
