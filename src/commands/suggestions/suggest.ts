import {Message} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import approveSuggestion from "./approveSuggestion";
import {Suggestion} from "../../database/models/suggestion";
import {LogManager} from "../../handlers/logging/logManager";

export default async function suggest(message: Message, input: [string]){
    const [suggestion] = input;

    gb.instance.database.addSuggestion(message, suggestion).then(async(r: Partial<Suggestion>) => {
        if (message.member.hasPermission('BAN_MEMBERS')){
            safeSendMessage(message.channel, `Alright sir, I'll get that straight past the review stage for you.`);
            approveSuggestion(message, [r.suggestion_id!])
        }
        else {
            safeSendMessage(message.channel, `Alright, I added your suggestion. It will be listed once a moderator approves it.`);
            LogManager.logNewSuggestion(message.member);
        }
    });
}
