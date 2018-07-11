import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {SuggestionResponse, _respondToSuggestion} from "./_respondToSuggestion";
import {UserPermissions} from "../../handlers/commands/command.interface";
import {Message} from "discord.js";


export const command: Command = new Command(
    {
        names: ['reject'],
        info: "Rejects a suggestion that's posted on the suggestion board.",
        usage: '{{prefix}}reject { suggestion ID } { reason }',
        examples: ["{{prefix}}reject 24 We're never gonna add a my little pony channel..."],
        category: 'Suggestions',
        expects: [{type: ArgType.Number}, {type: ArgType.Message}],
        run: (message: Message, input: any) => _respondToSuggestion(message, input, SuggestionResponse.REJECTED),
        userPermissions: UserPermissions.Administrator
    }
);
