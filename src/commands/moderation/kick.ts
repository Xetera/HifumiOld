import {GuildMember, Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import {PermissionUtils} from "../../utility/permissionUtils";
import {UserPermissions} from "../../handlers/commands/command.interface";
import successEmbed from "../../embeds/commands/successEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message, input: [GuildMember, (string | undefined)]): Promise<any> {
    const [member, reason] = input;

    if (member.id === member.guild.me.id){
        return void handleFailedCommand(message.channel,
            `Wow ok, if you want me gone just do it yourself.`
        );
    }

    else if (member.id === message.member.id){
        return handleFailedCommand(message.channel,
            `Don't be silly now...`
        )
    }

    else if (!PermissionUtils.canModerate(message.member, member)) {
        return handleFailedCommand(message.channel,
            `You may not kick members that have a higher rank than you`
        );
    }

    else if (!member.kickable){
        return void handleFailedCommand(message.channel,
            `I cannot kick this person.`
        );
    }
    try {
        await member.kick(reason);
    }
    catch (err){
        return handleFailedCommand(message.channel,
            `Something went wrong, I should be able to kick that person but I couldn't...`
        )
    }

    const embed = successEmbed(message.member, `Kicked ${member.user.username}#${member.user.discriminator}`);
    return safeSendMessage(message.channel, embed);
}

export const command: Command = new Command(
    {
        names: ['kick'],
        info: 'Kicks a member from the server.',
        usage: '{{prefix}}kick { member } { reason? }',
        examples: [
            '{{prefix}}kick @Xetera big noob',
            "{{prefix}}kick xetera-kun",
            "{{prefix}}kick 140862798832861184 posting nsfw"
        ],
        category: 'Moderation',
        expects: [{type: ArgType.Member, options: {strict: true}}, {type: ArgType.Message, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['KICK_MEMBERS']
    }
);
