import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {random} from "../../../utility/Util";

export default async function alreadyDisabledInvitesEmbed(guild: Guild) {
    const rm = ReactionManager.getInstance();
    const embed = new RichEmbed()
        .setDescription(`I'm already not letting people send invites\nhere, don't worry!`)
        .setColor('#a7ffec');
    await ReactionManager.canSendReactions(guild.id) ? embed.setThumbnail(ReactionManager.getInstance().smile[0]) : '';
    return embed;
}
