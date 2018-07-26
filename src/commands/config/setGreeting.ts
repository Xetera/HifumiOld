import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import guildMemberAddEmbed from "../../embeds/events/onGuildMemberAddEmbed";
import templateParser from "../../parsers/templateParser";
import {TemplatedMessage} from "../../parsers/parsers.interface";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import parseTemplatePlaceholders from "../../parsers/parseTemplatePlaceholders";

async function run(message: Message, input: [string]): Promise<any> {
    // wtf is going on here though
    const cleanContent = message.content.trim();
    const x = cleanContent.split(' ');
    if (x.length > 200) {
        return void handleFailedCommand(
            message.channel, `That is **WAY** too long, my welcomes will become really annoying.`
        );
    }
    // message is not an embed
    if (!(/%(.*)%/).test(message.content)) {
        const [content] = input;
        await safeSendMessage(message.channel, parseTemplatePlaceholders(message.member, content));
        try {
            await gb.instance.database.setWelcomeMessage(message.guild.id, content)
        } catch (err){
            debug.error('STACK ERROR');
            debug.error(err.stack);
            debug.error(err, `setWelcomeMessage`);
        }
        return;
    }

    let final: string;
    if (x[0].includes('\n')) {
        const firstArg = x[0].split('\n');
        firstArg.shift();
        final = firstArg.concat(x.splice(1)).join(' ');
    }
    else {
        x.shift();
        // shifting $addmacro
        final = x.join(' ');
    }

    const fields: TemplatedMessage | string = templateParser(
        ['title', 'description', 'footer', 'thumbnail', 'color', 'image'], final);
    if (typeof fields === 'string') {
        // string is returned when a template field is invalid
        return handleFailedCommand(
            message.channel, `**${fields}** is not a valid placeholder for this command.`
        );
    }

    if (fields['title'].length > 256) {
        return void handleFailedCommand(
            message.channel, `The title field cannot be more than 256 characters long.`
        )
    }

    const description = fields['description'];
    const title = fields['title'];
    const footer = fields['footer'];
    const color = fields['color'];
    const thumbnail = fields['thumbnail'];
    const image = fields['image'];

    return safeSendMessage(message.channel, guildMemberAddEmbed(message.member, description, title, footer, color, thumbnail, image)).then(() => {
        gb.instance.database.setWelcomeMessage(message.guild.id, final).then(() => {
        }).catch((err: any) => {
            console.log('STACK ERROR');
            debug.error(err, `setWelcomeMessage`);
        })
    })
}

export const command: Command = new Command(
    {
        names: ['setgreeting'],
        info:
        'Changes my greeting message when new people join.\n\n' +
        '__Placeholders__\n' +
        '%title%, %description%, %footer%, %color%, %thumbnail%',
        usage: '{{prefix}}setgreeting {template}',
        examples: [
            '{{prefix}}setgreeting\n' +
            '%title% hey {username} welcome to the server!\n' +
            '%description% check out #rules first\n' +
            '%footer% remember, be a good boi\n' +
            '%color% red'
        ],
        category: 'Settings',
        expects: [{type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.Moderator
    }
);

