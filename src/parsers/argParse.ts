import {CommandParameters} from "../handlers/commands/CommandHandler";
import {ArgOptions, ArgType} from "../decorators/expects";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {resolveMember} from "../resolvers/memberResolver";
import {handleInvalidParameters} from "../handlers/commands/invalidCommandHandler";
import {Channel, GuildMember, MessageMentions} from "discord.js";
import {getOnOff} from "../utility/Util";
import {isBoolean} from "util";
import {channelResolver} from "../resolvers/channelResolver";

export default async function argParse(params: CommandParameters){
    // Only Expect.None is given, passing all test regardless
    if (params.expect.length === 1 && params.expect[0].type === ArgType.None){
        return true;
    }

    // filtering out the commands that are optional to check against the length
    const nonOptionalArgs = params.expect.reduce((arr: (ArgOptions | ArgOptions[])[], e: (ArgOptions | ArgOptions[]))=> {
        if (!Array.isArray(e) && (!e.options || !e.options.optional)){
            arr.push(e);
        }
        else if (Array.isArray(e)){
            if (!e[0].options){
                arr.push(e);
            }
        }
        return arr;
    }, <(ArgOptions | ArgOptions[])[]>[]);

    if (nonOptionalArgs.length > params.args.length){
        return void handleInvalidParameters(
            params.message.channel, params.name
        );
    }
    // For some reason, decorators added to the array in reverse
    // so we traverse it in reverse
    for (let i=params.expect.length - 1; i >= 0; --i){
        let decorator = params.expect[i];

        const input = params.args.shift();
        const options = params.expect[i].options;
        const optional = !options ? false : options.optional;
        if (!input && !optional){
            return void handleInvalidParameters(
                params.message.channel, params.name
            );
        }

        else if (!input && optional){
            if (Number(i) <= params.args.length)
                continue;
            else
                break;
        }

        else if (!params.input){
            params.input = [];
        }

        // OPTIONAL ARGUMENTS
        // yes I know this is a disgusting way to do it
        // but I don't want to add inner return statements
        // to every single one of these calls

        // maybe later
        if (Array.isArray(decorator.type)){
            let buffer: any[] = [];
            for (let i in decorator.type){
                const check = buffer.filter(b => b !== undefined);

                if (check.length)
                    break;

                switch(decorator.type[i]){
                    case ArgType.Member:
                        const strict = options ? options.strict : false;

                        const member = await _resolveMember(params, input, false, strict);
                        buffer.push(member);
                        break;
                    case ArgType.Number:
                        const num = await _resolveNumber(params, input, decorator, false);
                        buffer.push(num);
                        break;
                    case ArgType.String:
                        buffer.push(input);
                        break;
                    case ArgType.Message:
                        const raw = await _resolveMessage(params, input, decorator, false);
                        buffer.push(raw);
                        // resetting the args passed to make sure
                        // misplacing the decorator throws an error
                        params.args = [];
                        break;
                    case ArgType.Boolean:
                        const bool = await _resolveBoolean(params, input, false);
                        buffer.push(bool);
                        break;
                    case ArgType.Channel:
                        const channel = await _resolveChannel(params, input, options, false);
                        buffer.push(channel);
                        break;
                }
            }

            buffer = buffer.filter(b => b !== undefined);
            if (buffer.length)
                params.input.push(...buffer);
            else {
                return void handleFailedCommand(
                    params.message.channel, `I was expecting **${input}** to be a ${decorator.type.join(' or ')}`
                )
            }
        }
        else {
            // SINGLE VARIABLE
            switch(decorator.type){
                case ArgType.Member:
                    const strict = options ? options.strict : false;
                    const member = await _resolveMember(params, input, true, strict);
                    if (!member)
                    // responses for resolveMember are already handled
                    // in the implementation of the function
                        return;
                    params.input.push(member);
                    break;
                case ArgType.Number:
                    const num = await _resolveNumber(params, input, decorator);
                    if (!num)
                        return;
                    params.input.push(num);
                    break;
                case ArgType.String:
                    params.input.push(input);
                    break;
                case ArgType.Message:
                    const raw = await _resolveMessage(params, input, decorator);
                    if (!raw)
                        return;
                    params.input.push(raw);
                    // resetting the args passed to make sure
                    // misplacing the decorator throws an error
                    params.args = [];
                    break;
                case ArgType.Boolean:
                    const bool = await _resolveBoolean(params, input);
                    if (bool === undefined)
                        return;
                    params.input.push(bool);
                    break;
                case ArgType.Channel:
                    const channel = await _resolveChannel(params, input, options);
                    if (!channel)
                        return;
                    params.input.push(channel);
                    break;
            }
        }
    }
    return true;
}

async function _resolveMember(params: any, input: any, fail: boolean = true, strict: boolean = true): Promise<GuildMember | undefined>{
    return await resolveMember(input!, params.message, {fail: fail, strict: strict, global: false});
}

async function _resolveNumber(params: any, input: any, decorator: any, fail: boolean = true): Promise<number | void>{
    const num = Number(input);
    if (!num || !Number.isInteger(num)){
        let detail: string = '';
        if (decorator.options && !decorator.options.minRange && decorator.options.maxRange){
            detail = `between 0 and ${decorator.options.maxRange}`;
        }
        else if (decorator.options && decorator.options.minRange && decorator.options.maxRange){
            detail = `between ${decorator.options.minRange} and ${decorator.options.maxRange}`;
        }
        if (fail){
            return void handleFailedCommand(
                params.message.channel,
                `Expected **${input}** to be a number ${detail}`
            );
        }
    }
    return num;
}

async function _resolveMessage(params: any, input: any, decorator: any, fail: boolean = true): Promise<string | string []| void>{
    const minWords = decorator.options ? decorator.options.minWords : undefined;
    const raw = decorator.options ? decorator.options.raw : false;
    if ((decorator.options && minWords && params.args.length < minWords) && fail){
        if (params.name === 'strike' || params.name === 'warn'){
            return void handleFailedCommand(
                params.message.channel, `That ${params.name} message is too short, I don't want to run errands just for a meme.`
            )
        }
        else {
            return void handleFailedCommand(
                params.message.channel, `That message there was a little shorter than I was expecting, try again.`
            )
        }
    }
    if (raw){
        return params.args.length ? [input].concat(params.args): [input];
    }
    else {
        const rest = params.args.join(' ');
        return rest ? input! + ' ' + rest : input;
    }
}

async function _resolveBoolean(params: any, input: any, fail: boolean = true): Promise<boolean | void>{
    const bool: boolean | undefined = getOnOff(input!);
    if (!isBoolean(bool) && fail){
        return void handleFailedCommand(
            params.message.channel, `Expected **${input}** to be 'on' or 'off'`
        );
    }
    return bool;
}

async function _resolveChannel(params: any, input: any, options: any, fail: boolean = true){
    const searchOpts = !options ? 'BOTH' : !options.channelType ? 'BOTH' : options.channelType;
    return await channelResolver(input, params.message, {channelType: searchOpts, fail: true, onlyMention: true});
}
