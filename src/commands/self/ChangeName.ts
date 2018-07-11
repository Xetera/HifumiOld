import * as Discord from 'discord.js'
import {debug} from '../../utility/Logging'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message : Discord.Message, input: [string]): Promise<any> {
    const me : Discord.ClientUser = message.client.user;
    const oldName = me.username;
    const [name] = input;
    return me.setUsername(name).then(response => {
        debug.info(`Changed my name from ${oldName} to ${response.username}.`);
        return safeSendMessage(message.channel, `Changed my name from ${oldName} to ${response.username}.`)
    }).catch (err => {
        if (err instanceof Discord.DiscordAPIError) {
            return debug.error("API error when trying to change my own username.", err.stack);
        }
    })
}

export const command: Command = new Command(
    {
        names: ['setname', 'changename'],
        info: "Changes the bot's username.",
        usage: '{{prefix}}setname { name }',
        examples: ['{{prefix}}setname Hifumi'],
        category: 'Utility',
        expects: [{type: ArgType.Message}],
        run: run,
        userPermissions: UserPermissions.BotOwner,
        ownerOnly: true
    }
);
