import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import guildMemberAddEmbed from "../../embeds/events/onGuildMemberAddEmbed";
import templateParser from "../../parsers/templateParser";
import {TemplatedMessage} from "../../parsers/parsers.interface";

export default function setGreeting(message: Message, input: [string[]]) {
    const [welcome] = input;
    // to handle database spam
    if (welcome.length > 800) {
        return void handleFailedCommand(
            message.channel, `That is **WAY** too long, my welcomes will become really annoying.`
        );
    }
    // wtf is going on here though
    const x = message.content.split(' ');
    let final: string;
    if (x[0].includes('\n')) {
        const firstArg = x[0].split('\n');
        firstArg.shift();
        final = firstArg.concat(x.splice(1)).join(' ');
    }
    else {
        x.shift();
        final = x.join(' ');
    }

    const fields: TemplatedMessage | string = templateParser(
        ['title', 'description', 'footer', 'thumbnail', 'color'], final);
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

    return safeSendMessage(message.channel, guildMemberAddEmbed(message.member, description, title, footer, color, thumbnail)).then(() => {
        gb.instance.database.setWelcomeMessage(message.guild.id, final).then(() => {
        }).catch((err: any) => {
            console.log('STACK ERROR')
            console.log(err.stack);
            debug.error(err, `setWelcomeMessage`);
        })
    })
}
