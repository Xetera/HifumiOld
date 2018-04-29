import {CommandParameters} from "../handlers/commands/CommandHandler";
import {ArgOptions, ArgType} from "../decorators/expect";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {resolveMember} from "./memberResolver";
import {handleInvalidParameters} from "../handlers/commands/invalidCommandHandler";
import {Channel, GuildMember, MessageMentions} from "discord.js";
import {getOnOff} from "../utility/Util";
import {isBoolean} from "util";
import {channelResolver} from "./channelResolver";

export default async function argParse(params: CommandParameters){
    // Only Expect.None is given, passing all test regardless
    if (params.expect.length === 1 && params.expect[0].type === ArgType.None){
        return true;
    }

    // filtering out the commands that are optional to check against the length
    const nonOptionalArgs = params.expect.reduce((arr: ArgOptions[], e: ArgOptions)=> {
        if (!e.options || !e.options.optional){
            arr.push(e);
        }
        return arr;
    }, <ArgOptions[]>[]);

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
        switch(decorator.type){
        case ArgType.Member:
            let member = await resolveMember(input!, params.message);
            if (!member)
                // responses for resolveMember are already handled
                // in the implementation of the function
                return;
            params.input.push(member);
            break;
        case ArgType.Number:
            const num = Number(input);
            if (!num || !Number.isInteger(num)){
                let detail: string = '';
                if (decorator.options && !decorator.options.minRange && decorator.options.maxRange){
                    detail = `between 0 and ${decorator.options.maxRange}`;
                }
                else if (decorator.options && decorator.options.minRange && decorator.options.maxRange){
                    detail = `between ${decorator.options.minRange} and ${decorator.options.maxRange}`;
                }

                return void handleFailedCommand(
                    params.message.channel,
                    `Expected **${input}** to be a number ${detail}`
                );
            }
            params.input.push(num);
            break;
        case ArgType.String:
            params.input.push(input);
            break;
        case ArgType.Message:
            const minWords = decorator.options ? decorator.options.minWords : undefined;
            if (decorator.options && minWords && params.args.length < minWords){
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
            const rest = params.args.join(' ');
            const joined = rest ? input! + ' ' + rest : input;
            params.input.push(joined);
            // resetting the args passed to make sure
            // misplacing the decorator throws an error
            params.args = [];
            break;
        case ArgType.Boolean:
            const bool: boolean | undefined = getOnOff(input!);
            if (!isBoolean(bool)){
                return void handleFailedCommand(
                    params.message.channel, `Expected **${input}** to be 'on' or 'off'`
                );
            }
            params.input.push(bool);
            break;
        case ArgType.Channel:
            const searchOpts = !options ? 'BOTH' : !options.channelType ? 'BOTH' : options.channelType ;
            const channel: Channel | undefined = await channelResolver(input!, params.message, searchOpts);
            if (!channel)
                return;
            params.input.push(channel);
            break;
        }
    }
    return true;
}
