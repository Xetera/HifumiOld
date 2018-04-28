import {GuildMember, Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {resolveMember} from "../../resolvers/memberResolver";


export default async function setNote(message: Message, input: [GuildMember, string]){
    const [member, note] = input;
    gb.instance.database.addNote(message.guild, message.member, member, note).then(res => {
        message.channel.send(`Alright, I added that note`);
    }).catch(err => {
        message.channel.send(
            handleFailedCommand(message.channel, `I couldn't`));
        debug.error(err.stack)
    })
}
