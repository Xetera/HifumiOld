import {Message} from "discord.js";
import {gb} from "../../misc/Globals";
import {Guild} from "../../database/models/guild";
import setReactionsEmbed from "../../embeds/commands/configEmbed/setReactionsEmbed";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {UserPermissions} from "../../handlers/commands/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

export async function reactions(message: Message, input: [boolean]){
    const [state] = input;
    gb.database.setReactions(message.guild.id, state).then((r: Partial<Guild>) =>{
        // we're setting reactions when we're upserting so it gets reflected
        // back to us for sure
        safeSendMessage(message.channel, setReactionsEmbed(state));
    });
}

export const command: Command = new Command(
    {
        names: ['reactions'],
        info: 'Toggles the reactions I add to some of my responses.',
        usage: "{{prefix}}reactions { 'on' | 'off' }",
        examples: ['{{prefix}}reactions off'],
        category: 'Settings',
        expects: [{type: ArgType.Boolean}],
        run: reactions,
        userPermissions: UserPermissions.Moderator,
    }
);
