import {Guild, RichEmbed} from "discord.js";

export default function inviteWarningDMEmbed(guild: Guild): RichEmbed{
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    return new RichEmbed()
        .setTitle(`⚠ Warning ⚠`)
        .setDescription(`You've sent 4 invites in ${guild.name}, the next one will get you banned, you've been warned.`)
        .setTimestamp()
}