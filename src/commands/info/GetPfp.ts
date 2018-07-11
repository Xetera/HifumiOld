import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {GuildMember, RichEmbed} from "discord.js";
import pfpEmbed from "../../embeds/commands/pfpEmbed";
import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

function getPfp(user: GuildMember): string | RichEmbed {
    let url = user.user.avatarURL;

    if (url == null){
        return `${user.user.username} does not have a profile picture.`;
    }
    return pfpEmbed(user);
}

async function run(message: Message, input: [(GuildMember | undefined)]): Promise<any> {
    const [user] = input;
    let out;
    if (!user){
        out = getPfp(message.member);
    }
    else {
        out = getPfp(user);
    }

    safeSendMessage(message.channel, out);
}

export const command: Command = new Command(
    {
        names: ['avatar', 'profilepic', 'pfp'],
        info: "Gets a users's avatar",
        usage: '{{prefix}}avatar { user }',
        examples: [
            '{{prefix}}avatar @Xetera',
            '{{prefix}}avatar Xetera',
            '{{prefix}}avatar 140862798832861184'
        ],
        category: 'Info',
        expects: [{type: ArgType.Member, options: {optional: true}}],
        run: run
    }
);

