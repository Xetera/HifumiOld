import {GuildMember, RichEmbed} from "discord.js";
import {Offense} from "../../moderation/interfaces";
import {formattedTimeString} from "../../utility/Util";
import {getMuteTime} from "../../utility/Settings";
import {apology} from "../../handlers/internal/reactions/reactionManager";

export default function unmuteDMEmbed(member: GuildMember, reason: string | Offense, duration?: number | string): RichEmbed{
    let reasonMessage;
    if (reason === Offense.Spam){
        reasonMessage = 'Spamming messages.';
    }
    else {
        reasonMessage = reason;
    }
    return new RichEmbed()
        .setTitle(`Unmuted 💬`)
        .setThumbnail(member.guild.iconURL)
        .setColor('#9acaff')
        // TODO: add strikes here later
        .setDescription(
            `You are now unmuted in **${member.guild}**. Make sure to read over the server's ` +
            `rules to avoid further action from me or the server moderators.`)
        .addField(`Total Duration`, duration ? duration : formattedTimeString(getMuteTime()), true)
        .addField(`Mute Reason`, reasonMessage, true)
        // if we don't have a given duration then we know that it's just the default mute action duration
        .setTimestamp()
        .setImage(apology)
        .setFooter('Hifumi')
}
