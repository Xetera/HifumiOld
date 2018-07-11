import {GuildMember, Message, Permissions} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import gb from "../../misc/Globals";
import InfractionHandler from "../../handlers/internal/infractions/InfractionHandler";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import successEmbed from "../../embeds/commands/successEmbed";

export async function strike(message: Message, input: [GuildMember, number, string]) {
    const [target, weight, reason] = input;

    if (target.id === target.guild.me.id) {
        return safeSendMessage(
            message.channel, {file: 'assets/misc/counterspell.png'}
        );
    }

    else if (target.id === gb.ownerID) {
        return handleFailedCommand(
            message.channel, `${weight ? 'strike' : 'warn'} senpai? But I don't want him to spank me again...`
        );
    }

    const banned = InfractionHandler.getInstance().addInfraction(message, message.member, target, reason, weight);

    let output: string;

    if (banned) {
        output = `Banned ${target.user.username}.`;
    } else {
        output = `Infracted ${target.user.username} for that.`;
    }
    
    const embed = successEmbed(message.member, output);
    return safeSendMessage(message.channel, embed);
}

async function run(message: Message, input: [GuildMember, number, string]): Promise<any> {
    strike(message, input);
}

export const command: Command = new Command(
    {
        names: ['strike'],
        info: 'Warns or strikes a user, incrementing their strike count ',
        usage: '',
        examples: ["{{prefix}}strike @Xetera 1 Don't "],
        category: 'Moderation',
        expects: [
            {type: ArgType.Member},
            [{type: ArgType.Number}, {type: ArgType.Message}],
            {type: ArgType.Message, options: {optional: true}}
        ],
        run: run,
        userPermissions: UserPermissions.Moderator
    }
);
