export const defaultTableTemplates : string[] = [
    'CREATE TABLE IF NOT EXISTS guilds(' +
    'id varchar PRIMARY KEY,' +
    'name varchar,' +
    "prefix char DEFAULT '.'," +
    'allowsinvites boolean DEFAULT FALSE)',

    'CREATE TABLE IF NOT EXISTS users(' +
    'id varchar,' +
    'name varchar,' +
    'guild_id int,' +
    'invitestrikes int DEFAULT 0)',

    'CREATE TABLE IF NOT EXISTS blacklisted_links(' +
    'guild_id varchar,' +
    'link varchar)',

    'CREATE TABLE IF NOT EXISTS whitelisted_invites(' +
    'guild_id varchar,' +
    'link varchar)',
];

export const getPrefixes : string = "SELECT id, prefix FROM guilds";