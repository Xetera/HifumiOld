import * as Discord from 'discord.js'
import {Cleverbot as Clevertype, Config, Mood, User} from 'clevertype'
import {debug} from '../utility/Logging'
import gb from "../misc/Globals";
import {Channel, Message} from "discord.js";
import moment = require("moment");
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import TokenBucket from "../moderation/TokenBucket";
import ignore from "../commands/self/Ignore";
import {UpdateResult} from "typeorm";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import {formattedTimeString} from "../utility/Util";

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

    public async checkMessage(message : Discord.Message, bot :Discord.Client) : Promise<void> {
        if (message.system
            || message.attachments.array().length
            || await gb.instance.database.isUserIgnored(message.member)
            || !(message.channel instanceof Discord.TextChannel)){
            return;
        }
        let cleverbotCall = message.content.match(this.identifier);
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

            debug.info(`[${message.member.guild}]::${message.channel.name}::<${message.author.username}> cleverbot call`, "Cleverbot");
            message.react('👀');

            this.say(message.content, message.member.id).then((resp : string) => {
                gb.instance.database.incrementCleverbotCalls(message.guild.id);
                message.channel.send(resp);
            });

        }
    }

    public say(phrase : string, id: string, replaceKeyword : boolean = true) : Promise<string>{
        return new Promise<string>( (resolve, reject) => {
            let parsedArg :string;
            if (replaceKeyword)
                parsedArg = this.replaceKeyword(phrase);
            else
                parsedArg = phrase;
            this.cleverbot.say(parsedArg, id).then((response : string) => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
        });
    }

    public isRateLimited(id: string, message: Message): boolean {
        if (this.users[id] && this.users[id].ignores.ignoring){
            console.log(this.users[id].ignores.ignoreUntil! < new Date())
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

            if (this.users[id].warnings % 3 === 0){
                const user = this.users[id];
                this.users[id].ignores.ignoring = true;
                this.users[id].ignores.ignoreUntil = moment(new Date()).add(30 * this.users[id].warnings, 'm').toDate();
                safeSendMessage(message.channel, `Ignoring ${message.member} for ${formattedTimeString(user.warnings * 30 * 60)}`);
                debug.warning(`Rate limited ${message.author.username} in ${message.guild.name}`, `Cleverbot`)
            }

            else {
                debug.info(`Warned a user in ${message.guild.name} about rate limiting`, `Cleverbot`)
                handleFailedCommand(
                    message.channel, `You are rate limited, please stop spamming me.`, `Warning #${this.users[id].warnings}/3`                );
            }
        }
        return limited;
        /*
        //TODO: we're gonna fix this later when we patch clevertype
        const user = this.rate[id];
        if (!user){
            this.rate[id] = {
                queries: [],
                warnings: 0
            };
            return false;
        }
        const date = new Date();
        const delays = user.queries.reduce((total, q ) => total + moment(date).diff(q), 0);
        console.log(delays / 5);
        user.queries.push(date);
        if (user.queries.length > 5){
            user.queries.shift();
        }
        return true;
        */

    }
    public getMood(){
        return this.cleverbot.mood;
    }
}
