import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {SuggestionResponse, _respondToSuggestion} from "./_respondToSuggestion";
import {UserPermissions} from "../../handlers/commands/command.interface";
import {Message} from "discord.js";


export const command: Command = new Command(
    {
        names: ['accept'],
        info: "Accepts a suggestion that's posted on the suggestion board.",
        usage: '{{prefix}}accept { suggestion ID } { reason }',
        examples: ['{{prefix}}accept 24 Good suggestion, we made the meme channel.'],
        category: 'Suggestions',
        expects: [{type: ArgType.Number}, {type: ArgType.Message}],
        run: (message: Message, input: any) => _respondToSuggestion(message, input, SuggestionResponse.ACCEPTED),
        userPermissions: UserPermissions.Administrator
    }
);
