import {GuildMember} from "discord.js";
import {capitalize, random} from "../utility/Util";
import {welcomeMessages} from "../interfaces/Replies";

export default function parseEmbedPlaceholders(member: GuildMember, message?: string){
    if (!message){
        return;
    }
    return message
        .replace(/{mention}/g, `<@${member.id}>`)
        .replace(/{id}/g, member.id)
        .replace(/{username}/g, member.user.username)
        .replace(/{discrim}/g, member.user.discriminator)
        .replace(/{status}/g, capitalize(member.user.presence.status))
        .replace(/{greeting}/g, random(welcomeMessages(member)))
        .replace(/{avatar}/g, member.user.avatarURL)
        .replace(/{none}/g, '')
        .trim()
}
