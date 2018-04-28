import {Channel, GuildMember, RichEmbed, TextChannel, VoiceChannel} from "discord.js";
import ReactionManager from "../../handlers/reactions/reactionManager";

export default async function conflictOnChannelResolveEmbed(channels: TextChannel[] & VoiceChannel[], identifier: string){
    const channelArray = channels.map(c => `**Channel:** ${c.name}${c.parent ? '\n   **Category:** ' + c.parent.name : ''}\n`);
    let channelString: string = '';
    for (let i in channelArray){
        if (Number(i) > 9){
            channelString += `Why in the world do you have so many channels with the name ${identifier}? Use the channel ID if you can't find the right one here`;
            break;
        }
        channelString += `__**${Number(i) + 1}**__ ${channelArray[i]}\n`;
    }

    channelString += '\nRespond with the number that corresponds to the correct member.';

    const embed = new RichEmbed()
        .setTitle(`Multiple channels found`)
        .setDescription(`I found multiple channels with the name **${identifier}** but I don't know which one you want!\n\n${channelString}`)
        .setFooter(`This message expires in 20 seconds.`);
    await ReactionManager.canSendReactions(channels[0].guild.id) ? embed.setThumbnail(ReactionManager.getInstance().sorry[1]) : '';
    return embed;
}
