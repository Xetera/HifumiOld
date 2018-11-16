import * as Discord from 'discord.js'
import {Cleverbot as Clevertype, Config} from 'clevertype'
import {debug} from '../utility/Logging'
import {gb} from "../misc/Globals";
import { Message, TextChannel} from "discord.js";
import moment = require("moment");
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import {formattedTimeString,  StringUtils} from "../utility/Util";
import TokenBucket from "../moderation/TokenBucket";

interface Ignores {
    ignoreUntil: Date | undefined;
    ignoring: boolean;
}

export class Cleverbot {
    cleverbot : Clevertype;
    identifier : RegExp = /hifumi/i;
    users: {[id: string]: {warnings: number, ignores: Ignores}} = {};
    tokenBucket: TokenBucket;
    available: boolean = false;
    constructor(){
        this.tokenBucket = new TokenBucket();
        let apiKey;
        if (process.env['CLEVERBOT_TOKEN']){
            apiKey = process.env['CLEVERBOT_TOKEN'];
        } else {
            this.available = false;
            debug.warning(`CLEVERBOT_TOKEN environment variable not found, Cleverbot module is OFF`);
            return;
        }
        const configuration: Config = {
            apiKey: apiKey!,
            mood: {
                regard: 30,
                emotion: 70,
                engagement: 20
            }
        };
        this.cleverbot = new Clevertype(configuration, true);
        debug.info(`Cleverbot module is ready`);
        this.available = true;
    }

    private replaceKeyword(phrase : string) : string {
        return phrase.replace(this.identifier, 'cleverbot');
    }

    public async checkMessage(message : Message, bot :Discord.Client) : Promise<void> {
        if (message.system
            || !this.available
            || message.attachments.size
            || !(message.channel instanceof TextChannel)
            || StringUtils.isUrl(message.content)
            || StringUtils.isEmoji(message.content)
            || await gb.database.isUserIgnored(message.member)){
            return;
        }
        return;
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
            debug.error(err);
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
            gb.database.incrementCleverbotCalls(message.guild.id);
            if (!response) {
                debug.warning(`Couldn't get a response...`);
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

        const limited = this.tokenBucket.isCleverbotRateLimited(id);
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
                debug.warning(`Rate limited ${message.author.username} in ${message.guild.name}`);
            }

            else {
                debug.info(`Warned a user in ${message.guild.name} about rate limiting`);
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
