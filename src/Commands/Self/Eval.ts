import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import gb from "../../Misc/Globals";

export default function systemsEval(req : string, message : Message){
    const member  : GuildMember= message.member;
    const channel : Channel = message.channel;
    if (member.id !== gb.ownerID) return;
    if (channel instanceof TextChannel){
        channel.send(eval(req));
    }
}