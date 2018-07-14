import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";

export async function setMemberTracking(message: Message, input: [(boolean | undefined)]){
    const [choice] = input;
    // could also be false, can't check with !
    if (choice === undefined){
        const status = await gb.instance.database.getTrackNewMembers(message.guild.id);
        if (status){
            safeSendMessage(message.channel, `My tracking setting is currently on.`);
        } else {
            safeSendMessage(message.channel, `Currently not tracking new members.`);
        }
        return;
    }

    await gb.instance.database.setTrackNewMembers(message.guild.id, choice);
    if (!choice)
        safeSendMessage(message.channel, `No longer tracking new members in this server.`);
    else
        safeSendMessage(message.channel, `Now tracking members and banning on first offense`);
}

async function run(message: Message, input: [boolean]): Promise<any> {
    setMemberTracking(message, input);
}

export const command: Command = new Command(
    {
        names: ['tracking'],
        info:
            "Toggles my user tracking option. If enabled, users are " +
            "tracked for the first 5 minutes of joining. While tracked, " +
            "if new members are found spamming they get banned instead of muted " +
            "and get banned for 2 server invites instead of the custom amount.",
        usage: "{{prefix}}tracking { 'on' | 'off' }",
        examples: ['{{prefix}}tracking on'],
        category: 'Settings',
        expects: [{type: ArgType.Boolean, options: {optional: true}}],
        run: run,
        userPermissions: UserPermissions.Moderator,
        clientPermissions: ['BAN_MEMBERS']
    }
);
