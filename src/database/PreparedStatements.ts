import {Guild, GuildMember} from "discord.js";
import {Query} from "./Database";

//
// guild_id
export const getWhitelistedInvites : Query =
    `
    SELECT link FROM whitelisted_invites 
    WHERE guild_id = $1
    `;


// welcome_channel, guild_id
export const updateWelcomeChannel : Query =
    `
    UPDATE guilds
    SET welcome_channel = $1
    WHERE id = $2 
    RETURNING welcome_channel
    `;

export const getWelcomeChannel : Query =
    `
    SELECT welcome_channel FROM guilds
    WHERE id = $1
    `;


export const updateLogsChannel : Query =
    `
    UPDATE guilds
    SET logs_channel = $1
    WHERE id = $2
    RETURNING logs_channel
    `;

export const insertMember : Query =
    `
    INSERT INTO users (id, name, guild_id) 
    VALUES ($1, $2, $3)
    RETURNING *
    `;


//id, guild_id
export const getMemberInviteStrikes : Query =
    `
    SELECT invite_strikes FROM guilds
    WHERE id = $1 AND guild_id = $2
    `;


export const incrementMemberInviteStrikes : Query =
    `
    UPDATE users
    SET invite_strikes = invite_strikes + 1 
    WHERE id = $1 AND guild_id = $2 
    RETURNING invite_strikes
    `;


// id, prefix
export const upsertPrefix: Query =
    `
    INSERT INTO guilds (id, prefix)
    VALUES ($1, $2) 
    ON CONFLICT (id) DO UPDATE 
    SET prefix = $2 
    RETURNING *
    `;


export const  saveGuild : Query =
    `
    INSERT INTO guilds (id, name)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE
    SET name = $2
    RETURNING *
    `;

export const cleanAllGuildMembers : Query =
    `
    DELETE FROM users 
    WHERE guild_id = $1
    `;


export const  getWhiltelistedInvites : Query =
    `
    SELECT link FROM whitelisted_invites
    WHERE guild_id = $1
    `;


// id, status
export const changeLockdownStatus : Query =
    `
    UPDATE guilds 
    SET lockdown = $2
    WHERE id = $1
    RETURNING *
    `;


/**
 *
 * id, name, guild_id
 */
export const saveMember : Query =
    `
    INSERT INTO users(id, name, guild_id)
    SELECT $1, $2, $3
    WHERE NOT EXISTS(
        SELECT 1 FROM users 
        WHERE id = $1 AND guild_id = $3
    )`;

export const getLeftMembers : Query =
    `
    SELECT * from users 
    WHERE NOT EXISTS(
        SELECT 1 FROM users
        WHERE  
    `;

export const getAllUsers : Query =
    `SELECT id, guild_id FROM users`;

export const getAllMembers : Query =
    `
    SELECT * FROM users
    WHERE guild_id = $1
    `;

export const getGuild : Query  =
    `
    SELECT * from guilds
    WHERE id = $1
    `;

export const setIgnored : Query =
    `
    UPDATE users
    SET ignoring = $1 
    WHERE guild_id = $2 AND id = $3
    RETURNING ignoring
    `;