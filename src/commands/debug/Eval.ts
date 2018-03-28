import {Channel, DiscordAPIError, GuildMember, Message, TextChannel, User} from "discord.js";
import gb from "../../misc/Globals";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";
import {codeBlock} from "../../utility/Markdown";
import safeMessageUser from "../../handlers/safe/SafeMessageUser";
import {debug} from "../../utility/Logging";

export default function systemsEval(message : Message, req : string[]){
    if (message.author.id !== gb.ownerID)
        return;
    let isCodeBlock: boolean = true;
    let isDMResponse: boolean = false;
    if (req.includes('--debug')){
        isDMResponse = false;
        const index = req.findIndex((item: string) => item === '--debug');
        req.splice(index, 1);
        return message.channel.send(req.join(' '));
    }
    if (req.includes('--raw')){
        isCodeBlock = false;
        const index = req.findIndex((item: string)=> item === '--raw');
        req.splice(index, 1);
    }
    if (req.includes('--dm')){
        isDMResponse = true;
        const index = req.findIndex((item: string) => item === '--dm');
        req.splice(index, 1);
    }


    let response;

    try {
        response = gb.instance.eval(message, req.join(' '));
    }
    catch (err) {
        response = err.toString();
    }
    response = response ? response.toString() : 'undefined';
    response = isCodeBlock ? codeBlock(response) : response;
    if (!isDMResponse)
        safeSendMessage(message.channel, response).catch(err => {
            if (!(err instanceof DiscordAPIError)){
                return void safeSendMessage(message.channel, err);
            }
        });
    else {
        // we're only using message.member here because I don't want to change safeMessageUser to also
        // be able to take in a User argument which would limit our ability to check our permissions on the guild.
        // Just counting on the fact that our njkl
        safeMessageUser(message.member, response, 'Sending eval response').catch(err => {
            return void safeMessageUser(message.member, err.toString());
        }).then(() => safeSendMessage(message.channel, `📬 Sent you the results`))
    }
}