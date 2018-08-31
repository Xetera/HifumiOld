import * as Discord from "discord.js";
import { debug } from "../utility/Logging";
import { gb } from "../misc/Globals";
import { Message, MessageMentions, TextChannel } from "discord.js";
import * as CleverbotIO from "cleverbot.io";
// import moment = require("moment");
// import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../handlers/safe/SafeSendMessage";
import TokenBucket from "../moderation/TokenBucket";
import prefixReminderEmbed from "../embeds/misc/prefixReminderEmbed";
import * as Redis from "redis";
import { promisify } from "util";

export const redis = Redis.createClient();

const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
const delAsync = promisify(redis.del).bind(redis);

export class Cleverbot {
    cleverbot: CleverbotIO;
    session: any;
    identifier: RegExp = /hifumi/i;
    tokenBucket: TokenBucket;
    available: boolean = false;

    constructor() {
        this.tokenBucket = new TokenBucket();
        if (!process.env["CLEVERBOT_TOKEN"] || !process.env["CLEVERBOT_USER"]) {
            this.available = false;
            debug.warn(
                `CLEVERBOT_TOKEN or CLEVERBOT_USER environment variable not found, Cleverbot module is OFF`
            );
            return;
        }
        this.cleverbot = new CleverbotIO(
            process.env["CLEVERBOT_USER"],
            process.env["CLEVERBOT_TOKEN"]
        );
        this.cleverbot.setNick("IZBiVgD9");
        debug.info(`Cleverbot module is ready`);
        this.available = true;
    }

    private replaceKeyword(phrase: string): string {
        return phrase.replace(this.identifier, "cleverbot");
    }

    public async checkMessage(
        message: Message,
        bot: Discord.Client
    ): Promise<void> {
        if (
            message.system ||
            !this.available ||
            message.attachments.size ||
            !(message.channel instanceof TextChannel) ||
            (await gb.database.isUserIgnored(message.member))
        ) {
            return;
        }
        let cleverbotCall = message.isMentioned(bot.user);
        if (
            cleverbotCall &&
            !message.content.replace(MessageMentions.USERS_PATTERN, "")
        ) {
            return void safeSendMessage(
                message.channel,
                prefixReminderEmbed(
                    await gb.database.getPrefix(message.guild.id)
                ),
                30000
            );
        }

        const chatChannelId = await gb.database.getChatChannel(
            message.guild.id
        );

        if (
            message.channel.id === chatChannelId ||
            cleverbotCall ||
            message.isMentioned(bot.user)
        ) {
            if (!gb.database.ready) {
                safeSendMessage(
                    message.channel,
                    `😰 give me some time to get set up first.`
                );
                return void debug.info(
                    `Got message from ${
                        message.guild.name
                    } but the DB hasn't finished caching.`
                );
            }

            // don't respond to messages not meant for me
            if (
                message.mentions.users.size !== 0 &&
                !message.isMentioned(bot.user)
            )
                return;
            else if (
                message.content.startsWith("-") ||
                message.content.startsWith(
                    await gb.database.getPrefix(message.guild.id)
                )
            )
                return;
            // else if (this.isRateLimited(message.member.id, message)){
            //     return;
            // }
            const redisKey = `cleverbot:throttles:${message.author.id}`;
            const onHold = await getAsync(redisKey);

            if (onHold) {
                /**
                 * Only responds to one message at a time per user
                 */
                return;
            }

            message.react("👀");
            /**
             * Key expires in 60 seconds in case something goes wrong
             */
            await setAsync(redisKey, true, "EX", 60);

            // debug.info(`[${message.member.guild}]::${message.channel.name}::<${message.author.username}> cleverbot call`);
            await message.channel.startTyping();
            this.say(message, message.content, message.member.id).then(
                async (resp: string) => {
                    // sometimes randomly the messages are empty for no reason
                    await message.channel.stopTyping(true);
                    await message.reply(resp);
                    await delAsync(redisKey);
                }
            );
        }
    }

    public isUserRepeating(message: Message): boolean {
        let userHistory;
        try {
            const user = this.cleverbot.users.find(
                user => user.id === message.member.id
            );
            if (!user) {
                return false;
            }
            userHistory = user.history;
        } catch (err) {
            debug.error(err);
            return false;
        }
        const last = userHistory[userHistory.length - 1];
        const beforeLast = userHistory[userHistory.length - 2];

        if (!last || !beforeLast) {
            return false;
        }

        return (
            last.input === this.replaceKeyword(message.content) &&
            beforeLast.input === this.replaceKeyword(message.content)
        );
    }

    public say(
        message: Message,
        phrase: string,
        id: string,
        replaceKeyword: boolean = true
    ): Promise<string> {
        let parsedArg: string;
        if (replaceKeyword) parsedArg = this.replaceKeyword(phrase);
        else parsedArg = phrase;
        console.log(parsedArg);
        return new Promise((res, rej) => {
            this.cleverbot.ask(parsedArg, (err: Error, response: string) => {
                gb.database.incrementCleverbotCalls(message.guild.id);
                if (!response || err) {
                    debug.warn(`Couldn't get a response from cleverbot `);
                    debug.error(err);
                    return rej(err);
                }
                return res(response);
            });
        });
    }

    // public isRateLimited(id: string, message: Message): boolean {
    // if (this.users[id] && this.users[id].ignores.ignoring) {
    //     if (this.users[id].ignores.ignoreUntil! < new Date()) {
    //         this.users[id].ignores.ignoring = false;
    //         this.users[id].ignores.ignoreUntil = undefined;
    //         return false;
    //     }
    //     else {
    //         return true;
    //     }
    // }
    //
    // const limited = this.tokenBucket.isCleverbotRateLimited(id);
    // if (limited) {
    //     const user = this.users[id];
    //     if (!user) {
    //         this.users[id] = {
    //             ignores: {
    //                 ignoreUntil: undefined,
    //                 ignoring: false
    //             },
    //             warnings: 1
    //         };
    //     }
    //     else {
    //         this.users[id].warnings += 1;
    //     }
    //
    //     // Mutes every 3rd violation, mute time increases per 3rd mute
    //     if (this.users[id].warnings % 3 === 0) {
    //         const user = this.users[id];
    //         this.users[id].ignores.ignoring = true;
    //         this.users[id].ignores.ignoreUntil = moment(new Date()).add(30 * this.users[id].warnings, 'm').toDate();
    //         safeSendMessage(message.channel, `Ignoring ${message.member} for ${formattedTimeString(user.warnings * 30 * 60)}`);
    //         debug.warn(`Rate limited ${message.author.username} in ${message.guild.name}`);
    //     }
    //
    //     else {
    //         debug.info(`Warned a user in ${message.guild.name} about rate limiting`);
    //         handleFailedCommand(
    //             message.channel, `You are rate limited, please stop spamming me.`, `Warning #${this.users[id].warnings}/3`);
    //     }
    // }
    // return limited;
    // }
}
