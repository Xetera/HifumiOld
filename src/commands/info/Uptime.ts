import {formattedTimeString, formatTime} from "../../utility/Util";
import uptimeEmbed from "../../embeds/commands/uptimeEmbed";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message): Promise<any> {
    const currentUptime = message.client.uptime/1000;
    const out = formattedTimeString(currentUptime);
    safeSendMessage(message.channel, uptimeEmbed(out));
}

export const command: Command = new Command(
    {
        names: ['uptime'],
        info: "Shows how long I've been online for.",
        usage: '{{prefix}}uptime',
        examples: ['{{prefix}}uptime'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
