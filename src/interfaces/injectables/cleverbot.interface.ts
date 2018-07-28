import {Cleverbot as Clevertype} from "clevertype";
import {Message} from "discord.js";
import {ITokenBucket} from "./tokenBucket.interface";

export interface Ignores {
    ignoreUntil: Date | undefined;
    ignoring: boolean;
}

export abstract class ICleverbot {
    cleverbot: Clevertype;
    identifier: RegExp;
    users: {[id: string]: {warnings: number, ignores: Ignores}};
    tokenBucket: ITokenBucket;
    available: boolean;
    abstract setEmotion(mood: number): void ;
    abstract checkMessage(message : Message) : Promise<void>;
    abstract isUserRepeating(message: Message): boolean;
    abstract say(message: Message, phrase: string, id: string, replaceKeyword: boolean) : Promise<string>;
    abstract isRateLimited(id: string, message: Message): boolean;
}
