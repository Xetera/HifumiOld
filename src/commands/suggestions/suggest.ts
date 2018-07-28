import {Message} from "discord.js";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import approveSuggestion from "./_approveSuggestion";
import {Suggestion} from "../../database/models/suggestion";
import {LogManager} from "../../handlers/logging/logManager";
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../interfaces/arg.interface";
import {IDatabase} from "../../interfaces/injectables/datbase.interface";
import {Container} from "typescript-ioc";

async function run(message: Message, input: [string]): Promise<any> {
    const [suggestion] = input;

    const database: IDatabase = Container.get(IDatabase)
    const r: Partial<Suggestion> = await database.addSuggestion(message, suggestion);

    if (message.member.hasPermission('BAN_MEMBERS')){
        safeSendMessage(message.channel, `Alright sir, I'll get that straight past the review stage for you.`);
        approveSuggestion(message, [r.suggestion_id!])
    }
    else {
        safeSendMessage(message.channel, `Alright, I added your suggestion. It will be listed once a moderator approves it.`);
        LogManager.logNewSuggestion(message.member);
    }

}

export const command: Command = new Command(
    {
        names: ['suggest'],
        info: 'Submits a new suggestion for the server ',
        usage: '{{prefix}}suggest { suggestion }',
        examples: ['{{prefix}}suggest Add a channel for memes'],
        category: 'Suggestions',
        expects: [{type: ArgType.Message}],
        run: run,
    }
);
