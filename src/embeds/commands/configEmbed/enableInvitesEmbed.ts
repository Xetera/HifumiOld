import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/reactions/reactionManager";

export default function enableInvitesEmbed(guild: Guild) {
    const embed =  new RichEmbed()
        .setTitle(`Invite Filter Off`)
        .setDescription(`Oh um... I don't think this is a good idea but I\nguess I'll let everyone send invites now.`)
        .setColor('#a7ffec');
    ReactionManager.canSendReactions(guild.id) ? embed.setImage(ReactionManager.getInstance().peek) : '';
    return embed;
}
