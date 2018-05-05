import {Guild, RichEmbed} from "discord.js";
import ReactionManager from "../../../handlers/internal/reactions/reactionManager";
import {random} from "../../../utility/Util";

export default async function disableInvitesEmbed(guild: Guild){
    const rm = ReactionManager.getInstance();
    const embed = new RichEmbed()
        .setTitle(`Invite Filter On`)
        .setColor('#a7ffec')
        .setDescription(`Okie, I turned it on- WAIT Why was this thing\neven off in the first place???!.`);
    await ReactionManager.canSendReactions(guild.id) ?  embed.setImage(rm.shocked[1]) : '';
    return embed;
}
