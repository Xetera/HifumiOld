import {Message, TextChannel} from "discord.js";
import {handleFailedCommand} from "../../../embeds/commands/commandExceptionEmbed";
import {LoggingChannelType} from "../../../database/models/guild";
import safeSendMessage from "../../../handlers/safe/SafeSendMessage";
import {Command} from "../../../handlers/commands/Command";
import {UserPermissions} from "../../../interfaces/command.interface";
import {ArgType} from "../../../interfaces/arg.interface";
import {IDatabase} from "../../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

export default function logs(message: Message, input: [string, (TextChannel | boolean)]){
    const [setting, choice] = input;

    const database: IDatabase = Container.get(IDatabase);
    let destination: string | null;
    if (choice instanceof TextChannel){
        if (!message.guild.me.permissionsIn(choice).has('SEND_MESSAGES')){
            return void handleFailedCommand(
                message.channel, `How do you expect me to log things in a channel I can't talk in?`
            );
        }
        destination = choice.id;
    }
    else if (choice === false){
        destination = null;
    }
    else {
        return void handleFailedCommand(
            message.channel, `**${choice === true ? 'on' : choice}** has to be a #channel or 'off'`
        );
    }
    const warnings = [
        LoggingChannelType.MUTES,
        LoggingChannelType.INVITES,
        LoggingChannelType.BANS,
        LoggingChannelType.PINGS,
        LoggingChannelType.SPAM,
        LoggingChannelType.UNBANS
    ];

    const logs = [
        LoggingChannelType.JOINS,
        LoggingChannelType.LEAVES,
        LoggingChannelType.SUGGESTIONS,
        LoggingChannelType.COMMANDS,
        LoggingChannelType.CHANNEL_MANAGENT
    ];

    const args = [];
    args.push(message.guild);
    if (setting === 'warnings'){
        args.push(warnings);
    }
    else if (setting === 'logs'){
        args.push(logs);
    }
    else if (setting === 'all' || setting === 'everything'){
        args.push(logs.concat(warnings));
    }
    else if (setting === 'joins'){
        args.push(LoggingChannelType.JOINS);
    }
    else if (setting === 'leaves' || setting === 'leave'){
        args.push(LoggingChannelType.LEAVES);
    }
    else if (setting === 'mutes' || setting === 'mute'){
        args.push(LoggingChannelType.MUTES);
    }
    else if (setting === 'invites' || setting === 'invite'){
        args.push(LoggingChannelType.INVITES);
    }
    else if (setting === 'channels'){
        args.push(LoggingChannelType.CHANNEL_MANAGENT);
    }
    else if (setting === 'bans' || setting === 'ban'){
        args.push(LoggingChannelType.BANS);
    }
    else if (setting === 'unban' || setting === 'unbans'){
        args.push(LoggingChannelType.UNBANS);
    }
    else if (setting === 'suggestions' || setting === 'suggestion'){
        args.push(LoggingChannelType.SUGGESTIONS);
    }
    else if (setting === 'pings' || setting === 'ping'){
        args.push(LoggingChannelType.PINGS);
    }
    else if (setting === 'spam'){
        args.push(LoggingChannelType.SPAM);
    }
    else if (setting === 'commands' || setting === 'command'){
        args.push(LoggingChannelType.COMMANDS);
    }
    else
        return handleFailedCommand(
            message.channel, `**${setting}** is not a valid option.`
        );


    args.push(destination);

    // @ts-ignore
    // Typescript isn't a big fan of spread used in arguments
    database.changeSpecificLoggingChannel(...args).then(() => {
        safeSendMessage(message.channel, `Changed ${setting} settings.`)
    })

}


export const command: Command = new Command(
    {
        names: ['log'],
        info: 'Changes my logging settings',
        usage: "{{prefix}}log { setting } { channel | 'off' }",
        examples: [
            '{{prefix}}log bans #bans',
            '{{prefix}}log warnings #warnings',
            '{{prefix}}log everything #logs',
            '{{prefix}}log unbans off'
        ],
        category: 'Settings',
        expects: [
            {type: ArgType.String},
            [{type: ArgType.Boolean}, {type: ArgType.Channel}]
        ],
        run: logs,
        userPermissions: UserPermissions.Moderator,
    }
);
