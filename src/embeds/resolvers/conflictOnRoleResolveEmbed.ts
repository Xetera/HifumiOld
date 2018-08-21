import {RichEmbed, Role} from "discord.js";
import {canSendReactions, sorry} from "../../handlers/internal/reactions/reactionManager";

export default async function conflictOnRoleResolveEmbed(channels: Role[], identifier: string){
    const channelArray = channels.map(c => `**Role:** ${c.name}${c.name ? '\n   **Position:** ' + c.position : ''}\n`);
    let channelString: string = '';
    for (let i in channelArray){
        if (Number(i) > 9){
            channelString += `Why in the world do you have so many roles with the name ${identifier}? Use the role ID if you can't find the right one here`;
            break;
        }
        channelString += `__**${Number(i) + 1}**__ ${channelArray[i]}\n`;
    }

    channelString += '\nRespond with the number that corresponds to the correct member.';

    const embed = new RichEmbed()
        .setTitle(`Multiple channels found`)
        .setDescription(`I found multiple roles with the name **${identifier}** but I don't know which one you want!\n\n${channelString}`)
        .setFooter(`This message expires in 20 seconds. `);
    await canSendReactions(channels[0].guild.id) ? embed.setThumbnail(sorry[1]) : '';
    return embed;
}
