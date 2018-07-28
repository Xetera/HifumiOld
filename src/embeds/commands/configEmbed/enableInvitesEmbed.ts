import {Guild, RichEmbed} from "discord.js";
import {random} from "../../../utility/Util";
import {IReactionManager} from "../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default async function enableInvitesEmbed(guild: Guild) {
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed =  new RichEmbed()
        .setTitle(`Invite Now Allowed`)
        .setDescription(`O ... ok sure I guess I'll let people send invites now.`)
        .setColor('#a7ffec');
    await rm.canSendReactions(guild.id) ? embed.setThumbnail(random(rm.blink)) : '';
    return embed;
}
