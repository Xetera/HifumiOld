import {Message} from "discord.js";
import gb from "../../misc/Globals";

export default function setMuteRole(message: Message, muteRole: string){
    return gb.instance.database.setMuteRole(message.guild.id, muteRole);
}
