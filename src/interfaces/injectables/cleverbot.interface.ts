import {Cleverbot as Clevertype} from "clevertype";
import TokenBucket from "../../moderation/TokenBucket";
import {Client, Message} from "discord.js";

export interface Ignores {
    ignoreUntil: Date | undefined;
    ignoring: boolean;
}

export interface ICleverbot {
    cleverbot: Clevertype;
    identifier: RegExp;
    users: {[id: string]: {warnings: number, ignores: Ignores}};
    tokenBucket: TokenBucket;
    setEmotion(mood: number): void ;
    checkMessage(message : Message, bot: Client) : Promise<void>;
    isUserRepeating(message: Message): boolean;
    say(message: Message, phrase: string, id: string, replaceKeyword: boolean) : Promise<string>;
    isRateLimited(id: string, message: Message): boolean;
}
