import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {gb} from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {DeleteResult} from "typeorm"
import {Command} from "../../handlers/commands/Command";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function run(message: Message, args: [number]): Promise<any> {
    const [noteId] = args;

    gb.database.deleteNote(message.guild, noteId.toString()).then((res: DeleteResult) => {
        if (res == null){
            return void handleFailedCommand(
                message.channel,
                `${gb.emojis.get('hifumi_think')} That note doesn't exist in this server.`
            );
        }
        safeSendMessage(message.channel, successEmbed(message.member, `Deleted note **#${noteId}**`));
    }).catch(err => {
        safeSendMessage(message.channel,`Um, I couldn't delete that note. I'm not sure why.`);
        debug.error(err.stack, 'deleteNote');
    })
}

export const command: Command = new Command(
    {
        names: ['deletenote', 'delnote', 'deln'],
        info: "Deletes a user's note.",
        usage: '{{prefix}}deletenote { note id }',
        examples: ['{{prefix}}deletenote 12'],
        category: 'Moderation',
        expects: [{type: ArgType.Number}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);

