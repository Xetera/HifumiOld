import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export default async function setNewMemberTracking(message: Message, input: [boolean]){
    const [choice] = input;
    const r = await gb.instance.database.setTrackNewMembers(message.guild.id, choice);
    if (!choice)
        safeSendMessage(message.channel, `No longer tracking new members in this server.`);
    else
        safeSendMessage(message.channel, `Now tracking members and banning on first offense`);
}
