import {Query} from "./Database";

export const defaultTableTemplates : Query[] = [
    `
    CREATE TABLE IF NOT EXISTS guilds(
    id varchar PRIMARY KEY,
    name varchar,
    prefix char DEFAULT '.',
    allows_invites boolean DEFAULT FALSE,
    default_channel varchar DEFAULT '',
    lockdown boolean DEFAULT false)
    `,

    `
    CREATE TABLE IF NOT EXISTS users(
    id varchar,
    name varchar,
    guild_id varchar,
    invite_strikes int DEFAULT 0,
    ignoring boolean DEFAULT FALSE)
    `,

    `
    CREATE TABLE IF NOT EXISTS blacklisted_links(
    guild_id varchar,
    link varchar)
    `,

    `
    CREATE TABLE IF NOT EXISTS whitelisted_invites(
    guild_id varchar,
    invite varchar)
    `,

    `
    CREATE TABLE IF NOT EXISTS tracked_users(
    id varchar,
    guild_id varchar,
    join_date date,
    security security)
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
    reason varchar)`

];

export const getPrefixes : Query =
    "SELECT id, prefix FROM guilds";

export const testQuery : Query =
    'SELECT * from guilds';