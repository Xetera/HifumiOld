import {Guild, GuildMember} from "discord.js";

export interface PreparedStatement {
    name : string;
    text : string;
    values : any[];
}

// guild_id
const getWhitelistedInvitesStatement : PreparedStatement = {
    name:
        'get-whitelisted-invites',
    text:
        'SELECT link FROM whitelisted_invites ' +
        "WHERE guild_id = $1",
    values: []
};


// default_channel, guild_id
const updateDefaultChannelStatement : PreparedStatement = {
    name:
        'set-default-channel',
    text:
        'UPDATE guilds ' +
        'SET default_channel = $1 ' +
        'WHERE id = $2 ' +
        'RETURNING default_channel',
    values: []
};

const getDefaultChannelStatement : PreparedStatement = {
    name:
        'get-default-channel',
    text:
        'SELECT default_channel FROM guilds ' +
        'WHERE id = $1',
    values:[]
};

const insertUserStatement : PreparedStatement = {
    name:
        'insert-user',
    text:
        'INSERT INTO users (id, name, guild_id) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING *',
    values: []
};

const getMemberInviteStrikesStatement : PreparedStatement = {
    name:
        'get-user-strikes',
    text:
        'SELECT invite_strikes FROM guilds ' +
        'WHERE id = $1 AND guild_id = $2',
    values: []
};

const incrementMemberInviteStrikesStatement : PreparedStatement = {
    name:
        'increment-user-strikes',
    text:
    'UPDATE users ' +
    'SET invite_strikes = invite_strikes + 1 ' +
    'WHERE id = $1 AND guild_id = $2 ' +
    'RETURNING invite_strikes',
    values: []
};


function getStatement(statement : PreparedStatement) : PreparedStatement{
    return JSON.parse(JSON.stringify(statement));
}

export function upsertPrefix(guild  : Guild, prefix : string) : string {
    return`
        INSERT INTO guilds (id, prefix)
        VALUES ('${guild.id}', '${prefix}') 
        ON CONFLICT (id) DO UPDATE 
        SET prefix = '${prefix}' 
        RETURNING *
        `
}

export function insertGuild(guild : Guild){
    return `
        INSERT INTO guilds (id, name)
        VALUES ('${guild.id}', '${guild.name}')
        ON CONFLICT (id) DO UPDATE
        SET name = '${guild.name}'
        RETURNING *
        `
}

export function cleanAllGuildMembers(guild : Guild){
    return `
        DELETE FROM users 
        WHERE guild_id = '${guild.id}'`;
}

export function getWhiltelistedInvites(guild : Guild) : string{
    return `
        SELECT link FROM whitelisted_invites
        WHERE guild_id = '${guild.id}'
        `
}

export function changeLockdownStatus(guild : Guild, status : boolean){
    return `
        UPDATE guilds 
        SET lockdown = ${status}
        WHERE id = ${guild.id}
        RETURNING *
        `
}
export function getWhitelistedInvites(guildId : string) : PreparedStatement{
    const statement = getStatement(getWhitelistedInvitesStatement);
    statement.values.push(guildId);
    return statement;
}

export function updateDefaultChannel(guildId : string, channelId : string) : PreparedStatement {
    const stmt = getStatement(updateDefaultChannelStatement);
    stmt.values.push(channelId, guildId);
    return stmt;
}

export function getDefaultChannel(guildId: string): PreparedStatement {
    const stmt = getStatement(getDefaultChannelStatement);
    stmt.values.push(guildId);
    return stmt;
}

export function insertMember(member : GuildMember){
    const stmt = getStatement(insertUserStatement);
    stmt.values.push(member.user.id,member.user.username, member.guild.id);
    return stmt;
}

export function getMemberInviteStrikes(member : GuildMember) : PreparedStatement{
    const stmt = getStatement(getMemberInviteStrikesStatement);
    stmt.values.push(member.id, member.guild.id);
    return stmt;
}

export function incrementMemberInviteStrikes(member : GuildMember) : PreparedStatement{
    const stmt = getStatement(incrementMemberInviteStrikesStatement);
    stmt.values.push(member.id, member.guild.id);
    return stmt;
}