import * as Discord from "discord.js";
import {GuildMember} from "discord.js";
import {capitalize, random} from "../../utility/Util";
import {welcomeMessages} from "../../interfaces/Replies";
export default function guildMemberAddEmbed(member: GuildMember, welcomeMessage?: string){

    if (welcomeMessage){
        welcomeMessage = welcomeMessage
            .replace(/{mention}/g, `<@${member.id}>`)
            .replace(/{id}/g, member.id)
            .replace(/{username}/g, member.user.username)
            .replace(/{discrim}/g, member.user.discriminator)
            .replace(/{status}/g, capitalize(member.user.presence.status))
            .replace(/{greeting}/g, random(welcomeMessages(member))).trim()
    } else {
        welcomeMessage = random(welcomeMessages(member));
    }

    return new Discord.RichEmbed()
        .setThumbnail(member.user.displayAvatarURL)
        .setColor("GREEN")
        .addField(`${member.user.username} has joined ${member.guild.name}!`, welcomeMessage)
        .setTimestamp()
}
