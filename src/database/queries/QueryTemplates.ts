import {Query} from "../Database";


// language=POSTGRES-PSQL
export const defaultTableTemplates : Query[] = [
    `
    CREATE TABLE IF NOT EXISTS guilds(
        id varchar PRIMARY KEY,
        name varchar,
        prefix char DEFAULT '.',
        allows_invites boolean DEFAULT FALSE,
        logs_channel varchar,
        welcome_channel varchar,
        warnings_channel varchar,
        command_hints boolean DEFAULT TRUE,
        lockdown boolean DEFAULT false
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS users(
        id varchar,
        name varchar,
        guild_id varchar,
        invite_strikes int DEFAULT 0,
        ignoring boolean DEFAULT FALSE,
        cleverbot_calls int DEFAULT 0,
        PRIMARY KEY (id, guild_id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS blacklisted_links(
        guild_id varchar,
        link varchar
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS whitelisted_invites(
        guild_id varchar,
        invite varchar
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS tracked_users(
        id varchar,
        guild_id varchar,
        join_date date,
        security security
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS stats(
        guilds int,
        users_banned int,
        users_muted int,
        spam_deleted int,
        lockdowns int
    )`,
    `
    CREATE TABLE IF NOT EXISTS watch_list(
        id varchar,
        bans int,
        reason varchar
    )`,
    `
    CREATE TABLE IF NOT EXISTS muted_users(
        start_date Date,
        end_date Date,
        id varchar,
        guild_id varchar
    )`,
    `
    CREATE TABLE IF NOT EXISTS cleverbot(
        guild_id varchar,
        premium boolean DEFAULT false,
        calls int DEFAULT 0
    )`
];

// language=POSTGRES-PSQL
export const getPrefixes : Query =
    'SELECT id, prefix FROM guilds';

// language=POSTGRES-PSQL
export const testQuery : Query =
    'SELECT * from guilds';

