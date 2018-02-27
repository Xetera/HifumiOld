import {Query} from "./Database";

export const defaultTableTemplates : Query[] = [
    'CREATE TABLE IF NOT EXISTS guilds(' +
    'id varchar PRIMARY KEY,' +
    'name varchar,' +
    "prefix char DEFAULT '.'," +
    'allowsinvites boolean DEFAULT FALSE,' +
    "default_channel varchar DEFAULT '')",

    `
    CREATE TABLE IF NOT EXISTS users(
    id varchar,
    name varchar,
    guild_id varchar,
    invite_strikes int DEFAULT 0,
    ignoring boolean DEFAULT FALSE)
    `,

    'CREATE TABLE IF NOT EXISTS blacklisted_links(' +
    'guild_id varchar,' +
    'link varchar)',

    'CREATE TABLE IF NOT EXISTS whitelisted_invites(' +
    'guild_id varchar,' +
    'link varchar)',
];

export const getPrefixes : Query =
    "SELECT id, prefix FROM guilds";

export const testQuery : Query =
    'SELECT * from guilds';