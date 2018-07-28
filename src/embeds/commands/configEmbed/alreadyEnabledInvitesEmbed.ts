import {Guild, RichEmbed} from "discord.js";
import {IReactionManager} from "../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default async function alreadyEnabledInvitesEmbed(guild: Guild){
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed = new RichEmbed()
        .setDescription(`It's fine, I'm already allowing invites here...\nfor some reason...`)
        .setColor('#a7ffec');
    await rm.canSendReactions(guild.id) ? embed.setThumbnail(rm.weary) : '';
    return embed;
}
