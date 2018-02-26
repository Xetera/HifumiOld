import {GuildMember} from "discord.js";
import gb from "../../Misc/Globals";

export default function systemsEval(req : string, member : GuildMember){
    if (member.id !== gb.ownerID) return;
    return eval(req);
}