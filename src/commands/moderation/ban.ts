import {GuildMember, Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import successEmbed from "../../embeds/commands/successEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {PermissionUtils} from "../../utility/permissionUtils";
import resolveBooleanUncertainty from "../../resolvers/resolveBooleanUncertainty";
import gb from "../../misc/Globals";

async function run(message: Message, input: [GuildMember, (string | undefined)]): Promise<any> {
    const [member, reason] = input;

    if (member.id === member.guild.me.id) {
        return void handleFailedCommand(message.channel,
            `Wow ok, if you want me gone just do it yourself.`
        );
    }

    else if (member.id === message.member.id) {
        return handleFailedCommand(message.channel,
            `Don't be silly now...`
        )
    }

    else if (!PermissionUtils.canModerate(message.member, member)) {
        return handleFailedCommand(message.channel,
            `You may not ban members that have a higher rank than you`
        );
    }

    else if (!member.bannable) {
        return void handleFailedCommand(message.channel,
            `I cannot ban this person.`
        );
    }
    const infractions = await gb.instance.database.getInfractions(message.guild.id, message.member.id);

    const yes = await resolveBooleanUncertainty(message, `This member has **${infractions.length}** warnings on record.`, 15);

    if (!yes){
        return;
    }

    await message.channel.startTyping();
    let info = `Banned ${member.user.username}#${member.user.discriminator}`;
    if (!reason) {
        return member.ban(`User banned by ${message.author.username}`)
    }
    else {
        const words = reason.split(' ');
        const wipingIndex = words.indexOf('--wipe');

        let amount: number = 0;
        if (wipingIndex > 0) {
            amount = Number(words[wipingIndex + 1]);
            words.splice(wipingIndex, 1);
            if (amount) {
                words.splice(wipingIndex + 1, 1);
            } else {
                amount = 1;
            }
        }
        await member.ban({reason: words.join(' '), days: amount});
        if (wipingIndex !== 0 && amount) {
            info += ` and cleared their last ${amount} days of messaging history.`;
        }
    }
    await message.channel.stopTyping();
    safeSendMessage(message.channel, successEmbed(message.member, info));
}

export const command: Command = new Command(
    {
        names: ['ban'],
        info:
        'Bans a member, clearing recent messages or setting a ban reason as needed. ' +
        'Messages are wiped by day count ',
        usage: '{{prefix}}ban { user } { reason? } { wipe? (0-7 days) }',
        examples: [
            '{{prefix}}ban Xetera',
            '{{prefix}}ban 140862798832861184 spamming constantly --wipe 1',
            '{{prefix}}ban @Xetera --wipe 7'
        ],
        category: 'Moderation',
        expects: [{type: ArgType.Member, options: {strict: true}}, {type: ArgType.Message, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['BAN_MEMBERS']
    }
);
