import {
    Collection, Guild,
    GuildChannel,
    Message,
    PermissionOverwrites,
    Permissions,
    Role,
    TextChannel
} from "discord.js";
import {
    missingMuteRoleEmbed,
    missingMuteOverwritesEmbed,
    noMissingMuteOverwritesEmbed
} from "../../embeds/commands/configEmbed/channelPermissionsCalculatorEmbed";
import {debug} from "../../utility/Logging";
import gb from "../../misc/Globals";

interface IRoleCoverage{
    override: Map<Role, TextChannel[]>;
    missing: TextChannel[];
}
export default function identifyMuteRole(message: Message){
    const chnls: Collection<string, GuildChannel> = message.guild.channels;

    // @ts-ignore| we're specifically filtering out the text channels
    const channels: TextChannel[] = chnls.array().filter(channel => channel.type === 'text');

    const sendMessagePerms = Permissions.resolve('SEND_MESSAGES'); // 2048
    let missingPermissions: TextChannel[] = [];

    const total = channels.reduce((obj:{override: Map<Role, TextChannel[]>, missing: TextChannel[]}, channel: TextChannel ) => {
        const permissionArray =  channel.permissionOverwrites.array();
        // get all the messages that
        const overriddenPerms: PermissionOverwrites[] = permissionArray.filter(perm => (perm.deny & sendMessagePerms) === sendMessagePerms);
        // if there's no permission override for not being able to send messages
        if (!overriddenPerms.length){
            obj.missing.push(channel);
        }
        for ( let permission of overriddenPerms){
            const role: Role | undefined = channel.guild.roles.get(permission.id);
            if (!role) {
                debug.error(`Cannot find role with id ${permission.id} in guild ${channel.guild.name}`, 'checkChannelPerms');
                return obj;
            }
            let tally = obj.override.get(role);
            !tally ? obj.override.set(role, [channel]) : tally.push(channel);
        }
        return obj;
    }, {override: new Map<Role, TextChannel[]>(), missing: []});

    let muteRole = <{role: Role, count: number}> {};

    total.override.forEach((value, key) => {
        if (!muteRole.role || muteRole.count > value.length){
            muteRole.role = key;
            muteRole.count = 1;
        }
    });
    //console.log(total.missing.map(channel => channel.name));
    return {total: total, tally: muteRole};
    /*
    let embed;
    const prefix = gb.instance.database.getPrefix(message.guild.id);
    if (!total.missing.length) {
        embed = noMissingMuteOverwritesEmbed(muteRole.role.name);
    }
    // if the the amount of restricted roles only spans less than 50% of the guild channels then
    // chances are it's not an actual muted role
    else if (!muteRole.role || muteRole.count < (channels.length * 0.5)){
        embed = missingMuteRoleEmbed(prefix);
    }
    else {
        embed = missingMuteOverwritesEmbed(total.missing.map(channel => channel.name), muteRole.role.name);
    }

    message.channel.send(embed);
    //message.channel.send(embed)
    */
}

export function checkMuteRoleExisting(target: Message | Guild){
    const chnls: Collection<string, GuildChannel> = target instanceof Guild ? target.channels : target.guild.channels;

    // @ts-ignore| we're specifically filtering out the text channels
    const channels: TextChannel[] = chnls.array().filter(channel => channel.type === 'text');

    const sendMessagePerms = Permissions.resolve('SEND_MESSAGES'); // 2048

    const total = channels.reduce((obj:{override: Map<Role, TextChannel[]>, missing: TextChannel[]}, channel: TextChannel ) => {
        const permissionArray =  channel.permissionOverwrites.array();
        // get all the messages that
        const overriddenPerms: PermissionOverwrites[] = permissionArray.filter(perm => (perm.deny & sendMessagePerms) === sendMessagePerms);
        for ( let permission of overriddenPerms){
            const role: Role | undefined = channel.guild.roles.get(permission.id);
            if (!role) {
                debug.error(`Cannot find role with id ${permission.id} in guild ${channel.guild.name}`, 'checkChannelPerms');
                return obj;
            }
            let tally = obj.override.get(role);
            !tally ? obj.override.set(role, [channel]) : tally.push(channel);
        }
        return obj;
    }, {override: new Map<Role, TextChannel[]>(), missing: []});

    let muteRole = <{role: Role, count: number}> {};

    total.override.forEach((value, key) => {
        if (!muteRole.role || muteRole.count > value.length){
            muteRole.role = key;
            muteRole.count = 1;
        }
    });

    if (muteRole.role && muteRole.count > (channels.length * 0.5)){
        return muteRole.role;
    }

    return undefined;
}

export function checkMuteCoverage(message: Message): 'all' | 'partial' | 'none' {
    const input = identifyMuteRole(message);
    const total = input.total;
    const tally = input.tally;
    const channels = <TextChannel[]> message.guild.channels.array().filter(channel => channel.type === 'text');
    console.log(total.missing.map(c => c.name) );
    if (!total.missing.length) {
        return 'all';
    }
    // if the the amount of restricted roles only spans less than 50% of the guild channels then
    // chances are it's not an actual muted role
    else if (!tally.role || tally.count < (channels.length * 0.5)){
        return 'none';
    }
    else {
        return 'partial';

    }
}


export function muteCoverage(message: Message){
    const chnls: Collection<string, GuildChannel> = message.guild.channels;

    // @ts-ignore| we're specifically filtering out the text channels
    const channels: TextChannel[] = chnls.array().filter(channel => channel.type === 'text');

    const sendMessagePerms = Permissions.resolve('SEND_MESSAGES'); // 2048
    let missingPermissions: TextChannel[] = [];

    const total = channels.reduce((obj:{override: Map<Role, TextChannel[]>, missing: TextChannel[]}, channel: TextChannel ) => {
        const permissionArray =  channel.permissionOverwrites.array();
        // get all the messages that
        const overriddenPerms: PermissionOverwrites[] = permissionArray.filter(perm => (perm.deny & sendMessagePerms) === sendMessagePerms);
        // if there's no permission override for not being able to send messages
        if (!overriddenPerms.length){
            obj.missing.push(channel);
        }
        for ( let permission of overriddenPerms){
            const role: Role | undefined = channel.guild.roles.get(permission.id);
            if (!role) {
                debug.error(`Cannot find role with id ${permission.id} in guild ${channel.guild.name}`, 'checkChannelPerms');
                return obj;
            }
            let tally = obj.override.get(role);
            !tally ? obj.override.set(role, [channel]) : tally.push(channel);
        }
        return obj;
    }, {override: new Map<Role, TextChannel[]>(), missing: []});

    let muteRole = <{role: Role, count: number}> {};

    total.override.forEach((value, key) => {
        if (!muteRole.role || muteRole.count > value.length){
            muteRole.role = key;
            muteRole.count = 1;
        }
    });
    console.log(total.missing.map(channel => channel.name));

    let embed;
    const prefix = gb.instance.database.getPrefix(message.guild.id);
    if (!total.missing.length) {
        embed = noMissingMuteOverwritesEmbed(muteRole.role.name);
    }
    // if the the amount of restricted roles only spans less than 50% of the guild channels then
    // chances are it's not an actual muted role
    else if (!muteRole.role || muteRole.count < (channels.length * 0.5)){
        embed = missingMuteRoleEmbed(prefix);
    }
    else {
        embed = missingMuteOverwritesEmbed(total.missing.map(channel => channel.name), muteRole.role.name);
    }

    message.channel.send(embed);
    //message.channel.send(embed)
}
