import {GuildMember, RichEmbed} from "discord.js";
import {canSendReactions, sorry} from "../../handlers/internal/reactions/reactionManager";

export default async function conflictOnNameResolveEmbed(members: GuildMember[], identifier: string){
    const memberArray = members.map(m => `${m.user.username}#${m.user.discriminator} ${m.nickname != null ? `**Nick:** ${m.nickname}` : ''}`);
    let memberString: string = '';
    for (let i in memberArray){
        if (Number(i) > 9){
            memberString += `Those are _a lot_ of resuts, try to make your search more specific or search by ID instead.`;
            break;
        }
        memberString += `**${Number(i) + 1}** -> ${memberArray[i]}\n`;
    }
    memberString += '\nRespond with the number that corresponds to the correct member.';

    const embed = new RichEmbed()
        .setTitle(`Multiple users found`)
        .setDescription(`I found multiple users with the name **${identifier}** but I don't know which one you want!\n\n${memberString}`)
        .setFooter(`This message expires in 20 seconds.`);
    await canSendReactions(members[0].guild.id) ? embed.setThumbnail(sorry[1]) : '';
    return embed;
}
