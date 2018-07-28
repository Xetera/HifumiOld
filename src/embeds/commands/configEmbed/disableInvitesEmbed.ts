import {Guild, RichEmbed} from "discord.js";
import {IReactionManager} from "../../../interfaces/injectables/reactionManager.interface";
import {Container} from "typescript-ioc";

export default async function disableInvitesEmbed(guild: Guild){
    const rm: IReactionManager = Container.get(IReactionManager);
    const embed = new RichEmbed()
        .setTitle(`Invite No Longer Allowed`)
        .setColor('#a7ffec')
        .setDescription(`Invites for non-mods are now off, don't you dare send one.`);
    await rm.canSendReactions(guild.id) ?  embed.setThumbnail(rm.stare) : '';
    return embed;
}
