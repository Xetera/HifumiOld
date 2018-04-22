import {GuildMember, RichEmbed} from "discord.js";
import {Offense} from "../../moderation/interfaces";
import {formattedTimeString} from "../../utility/Util";
import {getMuteTime} from "../../utility/Settings";

export default function muteDMEmbed(member: GuildMember, reason: string | Offense, duration?: number): RichEmbed{
    let reasonMessage;
    if (reason === Offense.Spam){
        reasonMessage = 'Spamming messages.';
    }
    else {
        reasonMessage = reason;
    }
    return new RichEmbed()
        .setTitle(`Muted 🔇`)
        .setThumbnail(member.guild.iconURL)
        .setColor('#ff0000')
        // TODO: add strikes here later
        .setDescription(
            `You were muted in **${member.guild}**, while muted you are forbidden from interacting with users in the guild in any way.`)
        .addField(`Duration`, formattedTimeString(duration ? duration : getMuteTime()), true)
        .addField(`Reason`, reasonMessage, true)
        // if we don't have a given duration then we know that it's just the default mute action duration
        .setFooter('Hifumi')
        .setTimestamp()
}
