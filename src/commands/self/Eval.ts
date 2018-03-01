import {Channel, GuildMember, Message, TextChannel} from "discord.js";
import gb from "../../misc/Globals";

export default function systemsEval(message : Message, req : string){
    const member  : GuildMember= message.member;
    const channel : Channel = message.channel;
    if (member.id !== gb.ownerID) return;
    if (channel instanceof TextChannel){
        try{
            channel.send(eval(req));
        }
        catch (err) {
            channel.send('\`\`\`\n' + err + '\`\`\`');
        }
    }
}