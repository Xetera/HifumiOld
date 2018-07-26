import {GuildMember, Message} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import {debug} from "../../utility/Logging";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import successEmbed from "../../embeds/commands/successEmbed";

async function run(message: Message, input: [GuildMember, string]): Promise<any> {
    const [member, note] = input;
    try {
        await gb.instance.database.addNote(message.guild, message.member, member, note);
    } catch (e) {
        debug.error(e);
        return handleFailedCommand(message.channel, `I couldn't add that note!`);
    }
    const embed = successEmbed(message.member, `Alright, I added that note`);
    return safeSendMessage(message.channel, embed);
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
