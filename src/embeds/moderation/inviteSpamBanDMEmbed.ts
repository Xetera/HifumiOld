import {Guild, RichEmbed} from "discord.js";
import {advertiseOnBan} from "../../interfaces/Replies";

export default function inviteSpamBanEmbed(guild: Guild): RichEmbed{
    // for now we don't need this to be a variable amount but maybe
    // later some guilds may want to ban on different amount of invites
    return new RichEmbed()
        .setTitle(`Banned ⛔`)
        .setColor('#FF0000')
        .setDescription(`You were banned from \`${guild.name}\` for posting 5 invites, advertising is not allowed, sorry.\n\n${advertiseOnBan()}`)
        .setImage('https://github.com/ilocereal/Alexa/blob/master/alexanoinvite.png?raw=true')
        .setTimestamp()
}