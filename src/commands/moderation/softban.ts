import {GuildMember, Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import {PermissionUtils} from "../../utility/permissionUtils";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import successEmbed from "../../embeds/commands/successEmbed";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message, input: [GuildMember, (string | undefined)]): Promise<any> {
    const [target, reason] = input;

    if (target.id === target.guild.me.id){
        return void handleFailedCommand(message.channel,
            `Wow ok, if you want me gone just do it yourself.`
        );
    }

    else if (target.id === message.member.id){
        return handleFailedCommand(message.channel,
            `Don't be silly now...`
        )
    }

    else if (!PermissionUtils.canModerate(message.member, target)){
        return void handleFailedCommand(message.channel,
            `You may not softban members that are higher rank than you.`
        );
    }

    else if (!target.bannable){
        return void handleFailedCommand(message.channel,
            `I cannot softban this person.`
        );
    }

    await target.ban({reason: reason || `User softbanned by ${message.author.username}`, days: 7});
    const embed = successEmbed(message.member, `Softbanned ${target.user.username}#${target.user.discriminator}`);

    await safeSendMessage(message.channel, embed);
    /**
     * Ok hear me out here, I realize that there's no reason to have a setTimeout here but
     * the last time I tested out this command I fucking got IP banned from my own server
     * after I tested the command on my alt... I have no idea why this happens but I don't
     * have time to delete and remake servers constantly so this is how we're gonna do it
     */
    setTimeout(() => {
        return void target.guild.unban(
            target.user,
            `Automatic unban by 'softban' command, issued by ${message.member.user.username}`
        );
    }, 3000);
}

export const command: Command = new Command(
    {
        names: ['softban'],
        info: 'Bans a user and immediately unbans then to remove max amount of previous messages (7 days).',
        usage: '{{prefix}}softban { Member } { reason? }',
        examples: [
            '{{prefix}}softban @Xetera big noob',
            "{{prefix}}softban xetera-kun",
            "{{prefix}}softban 140862798832861184 posting nsfw"
        ],
        category: 'Moderation',
        expects: [{type: ArgType.Member, options: {strict: true}}, {type: ArgType.Message, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['BAN_MEMBERS']
    }
);

