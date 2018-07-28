import {
    CategoryChannel,
    Channel, Collection,
    GuildMember, Invite,
    Message, PermissionOverwrites,
    PermissionResolvable,
    Permissions, Role, TextChannel
} from "discord.js";
import { emojiRegex, urlRegex} from "../listeners/Regex";


/**
 * Returns a random selection from a range of numbers.
 *
 * @param {number} [min=0] - Optional start range.
 * @param {number} range - Max range.
 * @returns {number} - Rando
 * m choice within range
 */
export function random<T>(min: T[]): T;
export function random(min: number, range?: number): number;
export function random(min : number | any[] = 0, range ?: number) : number | any {
    if (typeof min === 'number' && range){
        if (!min){
            return Math.floor(Math.random() * range);
        }
        return Math.floor(Math.random() * (min - range + 1)) + min
    }
    else if (min instanceof Array){
        return min[Math.floor(Math.random() * min.length)];
    }
}

export function capitalize(word: string){
    return word.replace(/^./, word => word[0].toUpperCase() + word.slice(1));
}

export function normalizeString(input: string, titleCase?: boolean){
    const words = input.replace(/_/, ' ');
    const wordArray = words.split(' ');
    const formatted = wordArray.map((w: string, index: number)=> {
        let firstLetter = w.substring(0, 1);
        if (index === 0 || titleCase) {
            firstLetter = firstLetter.toUpperCase();
        }
        const rest = w.substring(1).toLowerCase();
        return firstLetter + rest;
    });
    return formatted.join(' ');
}

export function HtmltoMarkdown(input: string){
    return input
        .replace(/<\/?i>/g, '_')
        .replace(/<\/?b>/g, '**')
        .replace(/<br>/g, '')
        .replace(/&bull;/g, '->')
}

export function randBool() : boolean{
    return Math.random () >= 0.5;
}

export function isMissingMessagingPermissions(member: GuildMember, channel: Channel): undefined | PermissionResolvable[] {
    const userPermissions: Permissions = member.permissionsIn(channel);
    const requirements: PermissionResolvable[] = ['SEND_MESSAGES', 'EMBED_LINKS'];
    if (userPermissions.has(requirements)){
        return;
    }
    else {
        return userPermissions.missing(requirements)
    }
}

export function channelOverrideDeniesRolePermission(channel: Channel, role: Role, permission: PermissionResolvable): boolean {
    const resolvedPerm = Permissions.resolve(permission);
    if (!(channel instanceof CategoryChannel)){
        throw new Error(`${channel} is not a text channel`);
    }
    return Boolean(channel.permissionOverwrites.find(
        (permission: PermissionOverwrites) => permission.id === role.id && ((permission.deny & resolvedPerm) === resolvedPerm)
        )
    );
}
export const pluralize = (word : string, number: number) : string => number != 1 ? `${word}s` : word;


export interface ITime {
    s: number;
    m: number;
    h: number;
    d: number;
    w?: number;
}


export function formatTime(seconds : number) : ITime {
    let moduloSeconds: number = Math.floor(seconds % 60);
    let minutes: number = Math.floor(seconds / 60);
    let moduloMinutes: number = Math.floor(minutes % 60);
    let hours: number = Math.floor(minutes / 60);
    let moduloHours: number = Math.floor(hours % 24);
    let days: number = Math.floor(hours / 24);

    // I know this is disgusting but it's 7 am and I just wanna
    // commit some updates ok don't judge me
    if (seconds < 60)
        return  {
            s: seconds,
            m: 0,
            h: 0,
            d: 0
        };
    else if (minutes < 60) {
        return {
            s: moduloSeconds,
            m: minutes,
            h: 0,
            d: 0
        };
    }
    else if (hours < 24) {
        return {
            s: moduloSeconds,
            m: moduloMinutes,
            h: hours,
            d: 0
        };
    }
    else {
        return {
            s: moduloSeconds,
            m: moduloMinutes,
            h: moduloHours,
            d: days
        };
    }
}

export function formattedTimeString(sec: number): string{
    const currentUptime = formatTime(sec);
    const seconds = currentUptime.s;
    const minutes = currentUptime.m;
    const hours = currentUptime.h;
    const days= currentUptime.d;
    return `${days 
        ?    days.toFixed(0) + 'd' : ''} ${hours 
        ?   hours.toFixed(0) + 'h' : ''} ${minutes 
        ? minutes.toFixed(0) + 'm' : ''} ${seconds 
        ? seconds.toFixed(0) + 's' : ''}`.replace(/  +/g, ' ').trim();
}

export function sanitizeUserInput(input: string){
    return input.replace('@', '`@`').trim();
}

export function subtractArrays(first: any[], second: any[]): any[] | undefined {
    let differences: any = [];
    first.forEach((value: any)=> {
        const target: any[] = second.filter((secondVal: any) => {
            return secondVal === value;
        });
        if (!target.length)
            differences.concat(value);
    });
    return differences;
}

export function getOnOff(input: string): boolean | undefined {
    if (input === 'on')
        return true;
    else if (input === 'off')
        return false;
    return undefined;
}
// This should totally be a nested ternary but whateeever
export function getYesNo(input: string){
    input  = input.toLowerCase();
    if (input === 'y' || input === 'yes')
        return true;
    else if (input === 'n' || input === 'no')
        return false;
    return undefined;
}

export namespace UserUtils {
    export function lazyMatchesNickOrUsername(input: string, user: GuildMember){
        const flexInput = input.toLowerCase();
        return (user.nickname && user.nickname.toLowerCase().includes(flexInput)) || user.user.username.toLowerCase().includes(flexInput);
    }
    export function matchesNickOrUsername(input: string, user: GuildMember) {
        const flexInput = input.toLowerCase();
        return (user.nickname && user.nickname.toLowerCase() === flexInput) || user.user.username.toLowerCase() === flexInput;
    }


}

export namespace InviteUtils {
    export async function isGuildInvite(message: Message, link: string): Promise<boolean>{
        return message.guild.fetchInvites().then((r: Collection<string, Invite>) => {
            return Boolean(r.find(i => {
                const url = i.url.split('/');
                const inviteCode = url[url.length - 1];
                return inviteCode === link;
            }));
        });
    }
}

export namespace StringUtils {
    export function isUrl(input: string){
        return urlRegex.test(input)
    }
    export function isEmoji(input: string){
        return emojiRegex.test(input);
    }
    export function shortenString(content: string, amount: number = 300): string {
        if (content.length < amount){
            return content;
        }
        const beginning = content.substring(0, amount);
        return `${beginning}...`;
    }
    export function shortenByNewlines(input: string, maxLength: number){
        const sections = input.split('\n');
        return sections.reduce((aggregate: string[], line:string) => {
            const currentCount = aggregate.reduce((a, b) => a + b.length, 0);

            if (currentCount + line.length < maxLength){
                aggregate.push(line);
            }
            return aggregate;
        }, <string[]> []).join('\n') + '...';
    }
}

export function arrayFromValues(obj: {[id: string]: any}){
    return Object.keys(obj).map(k => obj[k]);
}

export function safeGetArgs(input: any[] | undefined, defaultValue: any){
    return Array.isArray(input) ? input.shift() : defaultValue;
}

export const emptySpace: string = '\u200b';

export function stringify(...items: string[]){
    return items.map(i => i != null ? i : '').join(' ')
}
export function randRange(min: number, max?: number) {
    if (!max){
        max = min;
        min = 0;
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function formatAndJoin(array: string[], surrounder: string = '`', spacer: string = ', '){
    return array.map(a => surrounder + a + surrounder).join(spacer);
}

export function randomObjectValue<T>(object: {[key: string]: T }): T  {
    const keys: string[] = Object.keys(object);
    return object[random(keys)];
}

export async function getPastMessagesReverse(channel: TextChannel, amount: number){
    const messages = await channel.fetchMessages({limit: amount});
    return messages.array().reverse();
}

export function getUrlExtension(url: string){
    const sections = url.split('.');
    if (!sections.length){
        return;
    }
    return sections.pop()
}
