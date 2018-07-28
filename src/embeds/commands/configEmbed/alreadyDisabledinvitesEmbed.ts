import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";

export default async function alreadyDisabledInvitesEmbed(guild: Guild) {
    const embed = new RichEmbed()
        .setDescription(`I'm already not letting people send invites\nhere, don't worry!`)
        .setColor('#a7ffec');
    await ReactionManager.canSendReactions(guild.id) ? embed.setThumbnail(ReactionManager.getInstance().smile[0]) : '';
    return embed;
}
