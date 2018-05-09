import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {random} from "../../../utility/Util";

export default async function enableInvitesEmbed(guild: Guild) {
    const embed =  new RichEmbed()
        .setTitle(`Invite Now Allowed`)
        .setDescription(`O ... ok sure I guess I'll let people send invites now.`)
        .setColor('#a7ffec');
    await ReactionManager.canSendReactions(guild.id) ? embed.setThumbnail(random(ReactionManager.getInstance().blink)) : '';
    return embed;
}
