import * as Discord from 'discord.js'
import {Cleverbot as Clevertype} from 'clevertype'
import {debug} from '../utility/Logging'
import gb from "../misc/Globals";
import {Channel, Message, MessageMentions, TextChannel} from "discord.js";
import moment = require("moment");
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import TokenBucket from "../moderation/TokenBucket";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import {formattedTimeString, randRange, sanitizeUserInput, StringUtils} from "../utility/Util";
import prefixReminderEmbed from "../embeds/misc/prefixReminderEmbed";

interface Ignores {
    ignoreUntil: Date | undefined;
    ignoring: boolean;
}


export class Cleverbot {
    cleverbot : Clevertype;
    identifier : RegExp = /hifumi/i;
    users: {[id: string]: {warnings: number, ignores: Ignores}} = {};
    constructor(apiKey : string){
        this.cleverbot = new Clevertype(apiKey, true);
        debug.info('Cleverbot module is ready', "Cleverbot");
    }

    private replaceKeyword(phrase : string) : string {
        return phrase.replace(this.identifier, 'cleverbot');
    }

    public setEmotion(mood : number){
        this.cleverbot.setEmotion(mood);
    }

    public setEngagement(mood : number ) : void {
        this.cleverbot.setEngagement(mood);
    }

    public setRegard(mood : number ) : void {
        this.cleverbot.setRegard(mood);
    }

    public async checkMessage(message : Message, bot :Discord.Client) : Promise<void> {
        if (message.system
            || message.attachments.size
            || !(message.channel instanceof TextChannel)
            || StringUtils.isUrl(message.content)
            || StringUtils.isEmoji(message.content)
            || await gb.instance.database.isUserIgnored(message.member)){
            return;
        }

        let cleverbotCall = message.isMentioned(bot.user);
        if (cleverbotCall && !message.content.replace(MessageMentions.USERS_PATTERN, '')){
            return void safeSendMessage(message.channel, prefixReminderEmbed(await gb.instance.database.getPrefix(message.guild.id)), 30000);
        }

        const chatChannelId = await gb.instance.database.getChatChannel(message.guild.id);

        if (message.channel.id === chatChannelId || cleverbotCall || message.isMentioned(bot.user)) {

            if (!gb.instance.database.ready) {
                message.channel.send(`😰 give me some time to get set up first.`);
                return void debug.info(`Got message from ${message.guild.name} but the DB hasn't finished caching.`);
            }

            // don't respond to messages not meant for me
            if (message.mentions.users.array().length !== 0 && !message.isMentioned(bot.user))
                return;
            else if (message.content.startsWith('-') || message.content.startsWith(await gb.instance.database.getPrefix(message.guild.id)))
                return;

            else if (this.isRateLimited(message.member.id, message)){
                return;
            }

            message.react('👀');
            if (this.isUserRepeating(message)){
                // to make it feel like it's still cleverbot
                setTimeout(() => {
                    return void safeSendMessage(message.channel, sanitizeUserInput(message.content));
                }, randRange(1500, 3000));
                return;
            }

            debug.info(`[${message.member.guild}]::${message.channel.name}::<${message.author.username}> cleverbot call`, "Cleverbot");

            this.say(message, message.content, message.member.id).then(async(resp : string) => {
                // sometimes randomly the messages are empty for no reason
                message.channel.send(resp);
            });

        }
    }

    public isUserRepeating(message: Message): boolean {
        let userHistory;
        try {
            const user = this.cleverbot.users.find(user => user.id === message.member.id);
            if (!user){
                return false;
            }
            userHistory = user.history;
        }
        catch (err){
            console.log(err);
            return false;
        }
        const last = userHistory[userHistory.length - 1];
        const beforeLast = userHistory[userHistory.length - 2];

        if (!last || !beforeLast){
            return false;
        }

        return (
            last.input === this.replaceKeyword(message.content) &&
            beforeLast.input === this.replaceKeyword(message.content)
        );
    }



    public say(message: Message, phrase: string, id: string, replaceKeyword: boolean = true) : Promise<string>{
        let parsedArg :string;
        if (replaceKeyword)
            parsedArg = this.replaceKeyword(phrase);
        else
            parsedArg = phrase;

        return this.cleverbot.say(parsedArg, id).then((response: string) => {
            gb.instance.database.incrementCleverbotCalls(message.guild.id);
            if (!response) {
                debug.warning(`Couldn't get a response...`, `Cleverbot`);
                return this.say(message, phrase, id, replaceKeyword);
            }
            return response;
        }).catch(err => {
            return (err);
        });
    }

    public isRateLimited(id: string, message: Message): boolean {
        if (this.users[id] && this.users[id].ignores.ignoring){
            if (this.users[id].ignores.ignoreUntil! < new Date()){
                this.users[id].ignores.ignoring = false;
                this.users[id].ignores.ignoreUntil = undefined;
                return false;
            }
            else {
                return true;
            }
        }

        const limited = TokenBucket.getInstance().isCleverbotRateLimited(id);
        if (limited){
            const user = this.users[id];
            if (!user){
                this.users[id] = {
                    ignores: {
                        ignoreUntil: undefined,
                        ignoring: false
                    },
                    warnings: 1
                };
            }
            else {
                this.users[id].warnings += 1;
            }

            // Mutes every 3rd violation, mute time increases per 3rd mute
            if (this.users[id].warnings % 3 === 0){
                const user = this.users[id];
                this.users[id].ignores.ignoring = true;
                this.users[id].ignores.ignoreUntil = moment(new Date()).add(30 * this.users[id].warnings, 'm').toDate();
                safeSendMessage(message.channel, `Ignoring ${message.member} for ${formattedTimeString(user.warnings * 30 * 60)}`);
                debug.warning(`Rate limited ${message.author.username} in ${message.guild.name}`, `Cleverbot`)
            }

            else {
                debug.info(`Warned a user in ${message.guild.name} about rate limiting`, `Cleverbot`);
                handleFailedCommand(
                    message.channel, `You are rate limited, please stop spamming me.`, `Warning #${this.users[id].warnings}/3`                );
            }
        }
        return limited;
    }
    public getMood(){
        return this.cleverbot.mood;
    }
}
