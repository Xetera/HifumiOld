import {Message, RichEmbed} from "discord.js";
import commandNotFoundEmbed from "../../../embeds/commands/commandNotFoundEmbed";
import { random} from "../../../utility/Util";
import {commandEmbedColor} from "../../../utility/Settings";
import {gb} from "../../../misc/Globals";
import helpMacroEmbed from "../../../embeds/commands/info/helpMacroEmbed";
import {ArgType} from "../../../decorators/expects";
import {Command} from "../../../handlers/commands/Command";
import safeSendMessage from "../../../handlers/safe/SafeSendMessage";
import commandHelpEmbed from "../../../embeds/commands/info/commandHelpEmbed";
import CommandHandler from "../../../handlers/commands/CommandHandler";
async function run(message: Message, input: [string | undefined]): Promise<any> {
    const [choice] = input;
    const prefix: string = await gb.database.getPrefix(message.guild.id);

    if (choice){
        return getSpecificHelp(message, choice, prefix);
    }

    let embed = new RichEmbed();
    const commands = gb.commandHandler.commands;
    let sortedCommands: {[type:string]: Command[]} = commands.reduce((obj: {[type:string]: Command[]}, command: Command) => {
        // we don't want to send ALL the settings commands in help
        if (command.hidden)
            return obj;
        if (!obj[command.category]) {
            obj[command.category] = [];
        }
        obj[command.category].push(command);
        return obj;
    }, {});

    let hasMissingCommands = false;

    for(let key in sortedCommands){
        // sorting alphabetically
        sortedCommands[key] = sortedCommands[key].sort((a, b) => {
            if(a.names[0] < b.names[0]) return -1;
            if(a.names[0] > b.names[0]) return 1;
            return 0;
        });

        const command = sortedCommands[key].map((cmd: Command) => {
            if (!cmd.hasClientPermissions(message.guild) || CommandHandler.getMissingUserPermission(message.member, cmd)){
                hasMissingCommands = true;
                return `~~${prefix}${cmd.names[0]}~~`
            }
            return `${prefix}${cmd.names[0]}`;

        }).join(', ');
        embed.addField('⇨ ' + sortedCommands[key][0].category + ' ⇦', command);
    }

    const randomCategory = sortedCommands[random(Object.keys(sortedCommands))];
    let description = `I auto delete messages starting with 2 of your prefixes like so **${prefix + prefix}${random(randomCategory).names[0]}**\n`
    if (hasMissingCommands){
        description += `~~These~~ are commands that can not be run due to missing permissions.`;
    }
    embed.setTitle(`__Commands__`)
        .setDescription(description)
        .setColor(commandEmbedColor)
        .setFooter(`${prefix}help {command} for more info`);
    safeSendMessage(message.channel, embed);
    return;
}

export const command: Command = new Command(
    {
        names: ['help', 'h'],
        info: 'Sends info on all my commands or a specific command.',
        usage: '{{prefix}}help [command?]',
        examples: ['{{prefix}}help', '{{prefix}}help setgreeting'],
        category: 'Info',
        expects: [{ type: ArgType.Message, options: { optional: true } }],
        run: run
    }
);

async function getSpecificHelp(message: Message, arg: string, prefix: string){
    const command: Command | undefined = gb.commandHandler.commands.find(cmd => cmd.names.includes(arg));
    if (!command) {
        const macro = await gb.database.getMacro(message.guild.id, arg);
        if (macro){
            return safeSendMessage(message.channel, helpMacroEmbed(message.guild, macro));
        }
        return safeSendMessage(message.channel, await commandNotFoundEmbed(message.channel, arg));
    }
    return safeSendMessage(message.channel, commandHelpEmbed(command, prefix, message.guild));
}
