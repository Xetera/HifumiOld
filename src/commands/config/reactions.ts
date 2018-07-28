import {Message} from "discord.js";
import {ArgType} from "../../interfaces/arg.interface";
import {UserPermissions} from "../../interfaces/command.interface";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";
import setReactionsEmbed from "../../embeds/commands/configEmbed/setReactionsEmbed";
import {Command} from "../../handlers/commands/Command";

export async function reactions(message: Message, input: [boolean]){
    const [state] = input;
    const db: IDatabase = Container.get(IDatabase);
    await db.setGuildColumn(message.guild.id,'reactions', state);
    // we're setting reactions when we're upserting so it gets reflected
    // back to us for sure
    safeSendMessage(message.channel, setReactionsEmbed(state));
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
