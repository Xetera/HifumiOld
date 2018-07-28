import {Guild, RichEmbed} from "discord.js";
import {IReactionManager} from "../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default async function alreadyDisabledInvitesEmbed(guild: Guild) {
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed = new RichEmbed()
        .setDescription(`I'm already not letting people send invites\nhere, don't worry!`)
        .setColor('#a7ffec');
    await rm.canSendReactions(guild.id) ? embed.setThumbnail(rm.smile[0]) : '';
    return embed;
}
