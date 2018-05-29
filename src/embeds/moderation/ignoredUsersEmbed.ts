import {User} from "../../database/models/user";
import {Guild, RichEmbed} from "discord.js";
import gb from "../../misc/Globals";

export default function ignoredUsersEmbed(users: User[], guild: Guild){
    const embed = new RichEmbed()
        .setTitle(`Currently ignored users`);
    if (!users.length){
        embed.setDescription(`I'm not ignoring anyone here, hurray!`);
        return embed;
    }

    let lostMembers = 0;
    let description = [];
    for (let user of users){
        const memberName = guild.members.get(user.id);
        if (!memberName){
            lostMembers++;
            continue;
        }
        description.push(memberName);
    }
    embed.setDescription(description.join(', '));
    if (lostMembers){
        embed.setFooter(`I'm also ignoring ${lostMembers} members that are no longer in the server.`);
    }
    return embed;


}
