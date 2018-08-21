import {Guild, RichEmbed} from "discord.js";
import {random} from "../../../utility/Util";
import {blink, canSendReactions} from "../../../handlers/internal/reactions/reactionManager";

export default async function enableInvitesEmbed(guild: Guild) {
    const embed =  new RichEmbed()
        .setTitle(`Invite Now Allowed`)
        .setDescription(`O ... ok sure I guess I'll let people send invites now.`)
        .setColor('#a7ffec');
    await canSendReactions(guild.id) ? embed.setThumbnail(random(blink)) : '';
    return embed;
}
