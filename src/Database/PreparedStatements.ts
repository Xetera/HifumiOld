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

function getStatement(statement : PreparedStatement) : PreparedStatement{
    return JSON.parse(JSON.stringify(statement));
}

export function upsertPrefix(guildId : string, prefix : string) : PreparedStatement {
    const statement = getStatement(upsertPrefixStatement);
    statement.values.push(guildId, prefix);
    return statement;
}

export function insertGuild(guildId: string, guildName : string){
    const statement = getStatement(upsertPrefixStatement);
    statement.values.push(guildId, guildName);
    return statement;
}