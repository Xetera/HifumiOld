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
        .setTitle(`Unmuted`)
        .setThumbnail(member.user.avatarURL)
        .setColor('#ff0000')
        // TODO: add strikes here later
        .setDescription(
            `You are now unmuted in ${member.guild}. Make sure to read over the server's` +
            `rules to avoid further action.`)
        .addField(`Reason`, reasonMessage, true)
        // if we don't have a given duration then we know that it's just the default mute action duration
        .addField(`Duration`, duration ? duration : formattedTimeString(getMuteTime()), true)
        .setTimestamp()
        .setFooter('Alexa')
}