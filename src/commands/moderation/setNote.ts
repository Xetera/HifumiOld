import {GuildMember, Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";


export default function setNote(message: Message, args: string[]){
    if (args.length < 2){
        return void handleInvalidParameters(message.channel, 'note');
    }
    let targetMember: GuildMember | undefined;
    const userInput = args.shift()!;
    const mentions = message.mentions.members.first();
    if (mentions){
        targetMember = mentions;
    }
    else {
        targetMember = message.guild.members.get(userInput);
    }
    if (!targetMember){
        return void handleFailedCommand(
            message.channel, `I couldn't find any users with the ID ${userInput}`
        )
    }
    const note = args.join(' ');
    gb.instance.database.addNote(message.guild, message.member, targetMember, note).then(res => {
        message.channel.send(`Alright, I added that note`);
    }).catch(err => {
        message.channel.send(
            handleFailedCommand(message.channel, `I couldn't`))
        debug.error(err.stack)
    })
}
