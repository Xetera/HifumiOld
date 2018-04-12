import {Query} from "../Database";


// language=POSTGRES-PSQL
export const defaultTableTemplates : Query[] = [
    `
    CREATE TABLE IF NOT EXISTS guilds(
        id varchar PRIMARY KEY,
        name varchar,
        prefix char DEFAULT '.' NOT NULL,
        allows_invites boolean DEFAULT FALSE,
        logs_channel varchar,
        welcome_channel varchar,
        warnings_channel varchar,
        command_hints boolean DEFAULT TRUE,
        lockdown boolean DEFAULT false,
        visible boolean DEFAULT true
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS users(
        id varchar NOT NULL,
        name varchar,
        guild_id varchar NOT NULL,
        invite_strikes int DEFAULT 0,
        ignoring boolean DEFAULT FALSE,
        cleverbot_calls int DEFAULT 0,
        PRIMARY KEY (id, guild_id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS blacklisted_links(
        guild_id varchar NOT NULL,
        link varchar NOT NULL
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
        id varchar NOT NULL,
        guild_id varchar NOT NULL,
        join_date date NOT NULL,
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
    )`,
    `
    CREATE TABLE IF NOT EXISTS notes(
        note_id SERIAL PRIMARY KEY,
        guild_id varchar,
        user_id varchar,
        staff_id varchar,
        staff_name varchar,
        note_date date,
        note_content varchar
    )`, // staff_name is fallback for when we can't use staff_id to resolve members
    `
    CREATE TABLE IF NOT EXISTS watchlist(
        user_id varchar NOT NULL,
        guild_id varchar,
        guild_name varchar,
        ban_reason varchar NOT NULL,
        certainty integer NOT NULL,
        join_date date,
        ban_date date,
        PRIMARY KEY (user_id, guild_id)
    )`,
    `
    CREATE TABLE IF NOT EXISTS macros(
        creator_id varchar NOT NULL,
        guild_id varchar NOT NULL, 
        macro_name varchar NOT NULL,
        macro_content varchar NOT NULL,
        date_created date NOT NULL,
        PRIMARY KEY (guild_id, macro_name)
    )
    `
];

// language=POSTGRES-PSQL
export const getPrefixes : Query =
    'SELECT id, prefix FROM guilds';

// language=POSTGRES-PSQL
export const testQuery : Query =
    'SELECT * from guilds';

