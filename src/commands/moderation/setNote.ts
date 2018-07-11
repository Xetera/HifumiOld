import {GuildMember, Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message, input: [GuildMember, string]): Promise<any> {
    const [member, note] = input;
    gb.instance.database.addNote(message.guild, message.member, member, note).then(res => {
        safeSendMessage(message.channel, `Alright, I added that note`);
    }).catch(err => {
        debug.error(err);
        handleFailedCommand(message.channel, `I couldn't add that note!`);
    })
}

export const command: Command = new Command(
    {
        names: ['note'],
        info: 'Sets a note for a user.',
        usage: '{{prefix}}note { user } { note }',
        examples: ['{{prefix}}note @Xetera avid shitposter'],
        category: 'Moderation',
        expects: [{type: ArgType.Member}, {type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.Moderator,
    }
);
