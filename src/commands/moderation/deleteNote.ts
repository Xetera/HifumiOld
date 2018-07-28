import {Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import {DeleteResult} from "typeorm"
import {Command} from "../../handlers/commands/Command";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import {IClient} from "../../interfaces/injectables/client.interface";

async function run(message: Message, args: [number]): Promise<any> {
    const database: IDatabase = Container.get(IDatabase)
    const bot: IClient = Container.get(IClient)
    const [noteId] = args;

    database.deleteNote(message.guild, noteId.toString()).then((res: DeleteResult) => {
        if (res == null){
            return void handleFailedCommand(
                message.channel,
                `${bot.getEmoji('hifumi_think')} That note doesn't exist in this server.`
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

