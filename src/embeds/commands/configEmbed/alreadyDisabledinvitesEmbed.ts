import {Guild, RichEmbed} from "discord.js";
import {canSendReactions, smile} from "../../../handlers/internal/reactions/reactionManager";

export default async function alreadyDisabledInvitesEmbed(guild: Guild) {
    const embed = new RichEmbed()
        .setDescription(`I'm already not letting people send invites\nhere, don't worry!`)
        .setColor('#a7ffec');
    await canSendReactions(guild.id) ? embed.setThumbnail(smile[0]) : '';
    return embed;
}
