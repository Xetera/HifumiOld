import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {UserPermissions} from "../../interfaces/command.interface";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {ArgType} from "../../interfaces/arg.interface";

async function run(message: Message, input: [(boolean | undefined)]): Promise<any> {
    const [state] = input;

    if (state === undefined){
        const state = await gb.instance.database.getSpamFilter(message.guild.id);
        return safeSendMessage(message.channel, `**Spam Filter:** ${state ? 'on' : 'off'}`);
    }

    await gb.instance.database.setSpamFilter(message.guild.id, state);
    return safeSendMessage(message.channel, `My spam filter is now ${state ? 'on' : 'off'}`);
}

export const command: Command = new Command(
    {
        names: ['spamfilter'],
        info: 'Toggles my settings for checking for and deleting spam',
        usage: "{{prefix}}spamfilter { 'on' | 'off'? }",
        examples: ['{{prefix}}spamfilter', '{{prefix}}spamfilter'],
        category: 'Settings',
        expects: [{type: ArgType.Boolean, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['MANAGE_MESSAGES']
    }
);

