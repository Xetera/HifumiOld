import {Collection, Guild, GuildMember, Message, User} from "discord.js";
import gb from "../misc/Globals";
import conflictOnNameResolveEmbed from "../embeds/resolvers/conflictOnNameResolveEmbed";
import {debug} from "../utility/Logging";
import {handleFailedCommand} from "../embeds/commands/commandExceptionEmbed";
import {userResolvedEmbed} from "../embeds/resolvers/userResolvedEmbed";
import resolveNumberedUncertainty from "./resolveNumberedUncertainty";
import resolveBooleanUncertainty from "./resolveBooleanUncertainty";
import {UserUtils} from "../utility/Util";
export function resolveMember(arg: string, message: Message, global: boolean, fail: boolean): Promise<GuildMember | undefined>;
export function  resolveMember(arg: string, message: Message, global: boolean): Promise<GuildMember | User | undefined>;

export async function resolveMember(arg: string, message: Message, global: any = false, fail: boolean = true): Promise<GuildMember | User | undefined> {
    const numberArg: number = Number(arg);
    const userId = Number.isInteger(numberArg);
    // userIDs have a length of 18
    if (userId && arg.length === 18){
        const attempt = message.guild.members.get(arg);
        if (!attempt && global){
            return gb.instance.bot.fetchUser(arg);
        }
        return attempt;
    }
    else if (message.mentions.members.array().length){
        return message.mentions.members.first();
    }

    const resolvedNick: GuildMember[] = message.guild.members.array().reduce((arr: GuildMember[], m: GuildMember) => {
        if (UserUtils.lazyMatchesNickOrUsername(arg, m)){
            arr.push(m);
        }
        return arr;
    }, []);

    // finding a single user with the given nickname
    if (!resolvedNick.length && fail){
        return void await handleFailedCommand(
            message.channel, `I couldn't find that user anywhere, sorry.`
        );
    }
    if ((resolvedNick.length === 1)){
        const target = resolvedNick[0];
        // if we have a perfect match, send it off automatically
        // case insensitive is ok since any more matching nicks would
        // mean that this block doesn't get called
        if (UserUtils.matchesNickOrUsername(arg, target)){
            return target;
        }
        const embed = userResolvedEmbed(target, arg);
        const choice = await resolveBooleanUncertainty(message, embed, 30000);

        if (!choice)
            return;
        return target;
    }
    // multiple combinations of names found

    // guaranteed that all User objects will have a corresponding member object
    const results: GuildMember[] = resolvedNick;
    let out = await conflictOnNameResolveEmbed(results, arg);

    return resolveNumberedUncertainty(message, out, results, 30000, 'user');
}
