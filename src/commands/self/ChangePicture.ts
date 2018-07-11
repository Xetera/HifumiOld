import * as Discord from 'discord.js'
import {debug} from '../../utility/Logging'
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message, input: [string]): Promise<any> {
    const me: Discord.ClientUser = message.client.user;
    const [URL] = input;

    me.setAvatar(URL).then(response => {
        debug.info(`${response.username} avatar successfully changed!.`);
        safeSendMessage(message.channel, 'New avatar, new me.');
    }).catch(err => {
        if (err instanceof Discord.DiscordAPIError) {
            debug.error("API error when trying to change my own avatar picture.", err.stack);
        }
        safeSendMessage(message.channel, "Hmm, Discord wasn't a big fan of that URL you gave me there, go check the log.");
    })
}

export const command: Command = new Command(
    {
        names: ['setpfp', 'setavatar'],
        info: 'Changes my avatar to something different.',
        usage: '{{prefix}}setpfp { url }',
        examples: ['{{prefix}}setpfp https://cdn.hifumi.io/hifumi_avatar.png'],
        category: 'Utility',
        expects: [{type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.BotOwner,
        ownerOnly: true
    }
);

