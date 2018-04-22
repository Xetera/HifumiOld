import {Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {INote} from "../../database/TableTypes";
import {DeleteResult} from "typeorm";

export default async function deleteNote(message: Message, args: string[]){
    if (!args.length){
        return void await handleInvalidParameters(message.channel, 'deletenote');
    }
    let idInput = args.shift()!;
    if (!Number.isSafeInteger(Number(idInput))){
        return void handleFailedCommand(
            message.channel, `I was expecting ${idInput} to be a valid number.`
        );
    }

    gb.instance.database.deleteNote(message.guild, idInput).then((res: DeleteResult) => {
        if (res == null){
            return void handleFailedCommand(
                message.channel,
                `${gb.emojis.get('alexa_think')} That note doesn't exist in this server.`
            );
        }
        message.channel.send(`👌 Deleted that note`);
    }).catch(err => {
        message.channel.send(`Um, I couldn't delete that note. I'm not sure why.`);
        debug.error(err.stack, 'deleteNote');
    })
}
