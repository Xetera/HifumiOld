import {Message} from "discord.js";
import {handleInvalidParameters} from "../../handlers/commands/invalidCommandHandler";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {DeleteResult} from "typeorm";

export default async function deleteNote(message: Message, args: [number]){
    const [noteId] = args;

    gb.instance.database.deleteNote(message.guild, noteId.toString()).then((res: DeleteResult) => {
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
