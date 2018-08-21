import {Guild, RichEmbed} from "discord.js";
import {gb} from "../../misc/Globals";
import {warningEmbedColor} from "../../utility/Settings";
import {canSendReactions, stare} from "../../handlers/internal/reactions/reactionManager";

export default async function inviteWarningDMEmbed(guild: Guild): Promise<RichEmbed> {
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    // Done ^

    const current = await  gb.database.getInviteWarnThreshold(guild.id);
    const max = await gb.database.getInviteBanThreshold(guild.id)
    const embed = new RichEmbed()
        .setTitle(`Invite Warning`)
        .setColor(warningEmbedColor)
        .setThumbnail(guild.iconURL)
        .setDescription(`You've sent ${current} invites in **${guild.name}** where advertising is __not__ allowed, you will get banned at ${max} invites. This is your one and only warning.`)
        .setTimestamp();

    if (await canSendReactions(guild.id)){
        embed.setImage(stare);
    }
    return embed;
}
