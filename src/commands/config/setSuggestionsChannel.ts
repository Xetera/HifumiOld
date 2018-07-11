import {Message, TextChannel} from "discord.js";
import gb from "../../misc/Globals";
import setConfigChannelEmbed from "../../embeds/commands/configEmbed/setConfigChannelEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {debug} from "../../utility/Logging";
import setConfigChannelFailEmbed from "../../embeds/commands/configEmbed/setConfigChannelFailEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

async function setSuggestionsChannel(message: Message, channel: string | undefined){
    try{
        await gb.instance.database.setSuggestionsChannel(message.guild.id, channel);
        const embed = setConfigChannelEmbed(message.channel, 'suggestions');
        safeSendMessage(message.channel, embed);
    }
    catch(err) {
        debug.error(err.stack, `setSuggestionsChannel`);
        safeSendMessage(message.channel, setConfigChannelFailEmbed(message.channel, 'suggestions'));
    }
}
async function run(message: Message, input: [(TextChannel | boolean | undefined)]): Promise<any> {
    const [channel] = input;
    if (channel instanceof TextChannel){
        setSuggestionsChannel(message, channel.id);
    }
    else if (channel === false){
        setSuggestionsChannel(message, undefined);
    }
    else {
        setSuggestionsChannel(message, message.channel.id);
    }
}

export const command: Command = new Command(
    {
        names: ['suggestionchannel', 'schannel'],
        info: 'Changes the channel I send suggestions to',
        usage: "{{prefix}}suggestionchannel { #channel | 'off' }",
        examples: ['{{prefix}}suggestionchannel #suggestions'],
        category: 'Settings',
        expects: [[{type: ArgType.Channel, options: {channelType: 'text', optional: true}}, {type: ArgType.Boolean}]],
        run: run,
        userPermissions: UserPermissions.Moderator
    }
);
