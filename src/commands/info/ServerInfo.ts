import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import serverInfoEmbed from "../../embeds/commands/info/serverInfoEmbed";

async function run(message: Message): Promise<any> {
    if (!message.guild.available) return;
    const guild = message.guild;
    const voiceChannelCount = guild.channels.filter(channel =>
        channel.type === 'voice'
    ).size;

    const textChannelCount = guild.channels.filter(channel =>
        channel.type === 'text'
    ).size;

    const onlineUsers = guild.members.filter(member => {
        return member.presence.status  === 'online' || member.presence.status === 'idle'
    }).size;

    safeSendMessage(message.channel, serverInfoEmbed(message.guild, onlineUsers, textChannelCount, voiceChannelCount))
        .catch(err => {
            console.log(err);
        });
}

export const command: Command = new Command(
    {
        names: ['serverinfo', 'sinfo'],
        info: 'Gets information about the current server.',
        usage: '{{prefix}}serverinfo',
        examples: ['{{prefix}}serverinfo'],
        category: 'Info',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
