import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {debug} from "../../utility/Logging";
import guildMemberAddEmbed from "../../embeds/events/onGuildMemberAddEmbed";
import templateParser from "../../parsers/templateParser";
import {TemplatedMessage} from "../../parsers/parsers.interface";

export default function setGreeting(message: Message, input: [string[]]){
    const [welcome] = input;
    if (welcome.length > 600){
        return void handleFailedCommand(
            message.channel, `That message is WAY too long, my welcomes will become really annoying`
        );
    }
    const x = message.content.split(' ');
    let final;
    if (x[0].includes('\n')){
        const firstArg = x[0].split('\n');
        firstArg.shift();
        final = firstArg.concat(x.splice(1)).join(' ');
        console.log(final);
    }
    else {
        final = x.join(' ');
    }

    const fields: TemplatedMessage | string = templateParser(['title', 'description', 'footer'], final);
    if (typeof fields === 'string'){
        return handleFailedCommand(
            message.channel, `**${fields}** is not a valid placeholder for this command.`
        );
    }

    const description = fields._default.concat(fields['description']);
    const title = fields['title'];
    const footer = fields['footer'];

    gb.instance.database.setWelcomeMessage(message.guild.id, final).then(() => {
        return safeSendMessage(message.channel, guildMemberAddEmbed(message.member, description, title, footer));
    }).catch((err: any) => {
        debug.error(err, `setWelcomeMessage`);
    })
}
