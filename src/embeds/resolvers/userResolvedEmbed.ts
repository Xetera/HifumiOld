import {GuildMember, RichEmbed, User} from "discord.js";

export function userResolvedEmbed(target: GuildMember | User, search: string) {
    let username;
    let discrim;
    let nick;
    let avatar;
    if (target instanceof GuildMember){
        username = target.user.username;
        discrim = target.user.discriminator;
        nick = target.nickname;
        avatar = target.user.avatarURL;
    }
    else {
        username = target.username;
        discrim = target.discriminator;
        avatar = target.avatarURL;
    }
    return new RichEmbed()
        .setTitle(`Did I get that right?`)
        .setDescription(`You entered **${search}** but I found someone else, is this the right person?\n\n\t\t` +
            `${username}#${discrim}${nick ? nick + nick : ''}\n\n` +
            `Respond with **y** or **n**, this message expires in 30 seconds`)
        .setThumbnail(avatar)
}
