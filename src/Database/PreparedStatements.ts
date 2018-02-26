export interface PreparedStatement {
    name : string;
    text : string;
    values : any[];
}


const upsertPrefixStatement : PreparedStatement = {
    name: 'upsert-prefix',
    text:
        'INSERT INTO guilds (id, prefix) ' +
        'VALUES ($1, $2) ' +
        'ON CONFLICT (id) DO UPDATE ' +
        'SET prefix = $2 ' +
        'RETURNING *',
    values: []
};

const insertNewGuildStatement : PreparedStatement = {
    name: 'insert-guild',
    text:
        'INERT INTO guilds (id, name) ' +
        'VALUES ($1, $2) ' +
        'RETURNING *',
    values: []
};

// guild_id
const getWhitelistedInvitesStatement : PreparedStatement = {
    name: 'get-whitelisted-invites',
    text:
        'SELECT link FROM whitelisted_invites ' +
        "WHERE guild_id = $1",
    values: []
};


// default_channel, guild_id
const updateDefaultChannelStatement : PreparedStatement = {
    name: 'set-default-channel',
    text:
        'UPDATE guilds ' +
        'SET default_channel = $1 ' +
        'WHERE id = $2 ' +
        'RETURNING default_channel',
    values: []
};

const getDefaultChannelStatement : PreparedStatement = {
    name: 'get-defailt-channel',
    text:
        'SELECT default_channel FROM guilds ' +
        'WHERE id = $1',
    values:[]
};

function getStatement(statement : PreparedStatement) : PreparedStatement{
    return JSON.parse(JSON.stringify(statement));
}

export function upsertPrefix(guildId : string, prefix : string) : PreparedStatement {
    const statement = getStatement(upsertPrefixStatement);
    statement.values.push(guildId, prefix);
    return statement;
}

export function insertGuild(guildId: string, guildName : string) : PreparedStatement {
    const statement = getStatement(upsertPrefixStatement);
    statement.values.push(guildId, guildName);
    return statement;
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