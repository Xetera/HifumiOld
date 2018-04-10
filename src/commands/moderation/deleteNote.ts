import {Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {INote} from "../../database/TableTypes";

export default function deleteNote(message: Message, args: string[]){
    if (!args.length){
        return void handleInvalidParameters(message.channel, 'deletenote');
    }
    let idInput = args.shift()!;
    if (!Number.isSafeInteger(Number(idInput))){
        return void handleFailedCommand(
            message.channel, `I was expecting ${idInput} to be a valid number.`
        );
    }

    gb.instance.database.deleteNoteFromGuild(idInput, message.guild.id).then((res: INote) => {
        if (res == null){
            return void handleFailedCommand(
                message.channel,
                `${gb.emojis.get('alexa_think')} That note doesn't exist in this server.`
            )
        }
        message.channel.send(`👌 Deleted that note by ${res.staff_name}`);
    }).catch(err => {
        message.channel.send(`Um, I couldn't delete that note. I'm not sure why.`);
        debug.error(err.stack, 'deleteNote');
    })
}
