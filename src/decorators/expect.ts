import commandThrottleEmbed from "../embeds/commands/commandThrottleEmbed";
import {CommandParameters} from "../handlers/commands/CommandHandler";
import gb from "../misc/Globals";
import {resolveMember} from "../resolvers/memberResolver";
import {handleInvalidParameters} from "../handlers/commands/invalidCommandHandler";
import {capitalize} from "../utility/Util";
import {GuildMember, TextChannel, VoiceChannel} from "discord.js";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {register} from "../handlers/commands/registry";

export enum ArgType {
    String = 'string',
    Number = 'number',
    Member = 'member',
    Message = 'message',
    Boolean = 'boolean',
    Channel = 'channel',
    None = 'none'
}

export interface ArgOptions {
    type: ArgType;
    options?: {
        minRange?: number;
        maxRange?: number;
        optional?: boolean;
        maxLength?: number;
        channelType?: AllChannelTypes;
        minWords?: number;
        raw?: boolean;
        strict?: boolean;
    }
}

type DecoratorReturnSignature = (t: any, name: string, descriptor: any) => void;
export type AllChannelTypes = 'text' | 'voice' | 'BOTH';
export function expect(type: ArgType.Number, options?: {optional?: boolean, minRange?: number, maxRange?: number}): DecoratorReturnSignature;
export function expect(type: ArgType.Member, options?: {optional?: boolean, global?: boolean}): DecoratorReturnSignature;
export function expect(type: ArgType.String, options?: {optional?: boolean, maxLength?: number}): DecoratorReturnSignature;
export function expect(type: ArgType.Channel, options?: {optional?: boolean, channelType?: AllChannelTypes}): DecoratorReturnSignature;
export function expect(type: ArgType.Boolean, options?: {optional?: boolean}): DecoratorReturnSignature;
export function expect(type: ArgType.Message, options?: {optional?: boolean, minWords?: number, raw?: boolean}): DecoratorReturnSignature;
export function expect(type: ArgType.None): DecoratorReturnSignature;
export function expect(type: ArgType[], options?: {optional?: boolean}): DecoratorReturnSignature;

export function expect(type: ArgType | ArgType[], options?: any): DecoratorReturnSignature{
    return function decorator(t: any, name: string){
        const argOptions = <ArgOptions> {
            type: type
        };
        if (options){
            argOptions.options = {};
            if (options.minRange){
                argOptions.options.minRange = options.minRange;
            }
            if (options.maxLength){
                argOptions.options.maxLength = options.maxLength;
            }
            if (options.maxLength){
                argOptions.options.maxLength = options.maxLength;
            }
            if (options.optional){
                argOptions.options.optional = options.optional;
            }
            if (options.channelType){
                argOptions.options.channelType = options.channelType;
            }
        }

        register(t.constructor.name, name, argOptions);
    };
}
