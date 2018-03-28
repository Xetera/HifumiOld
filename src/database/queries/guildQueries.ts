import {Query} from "../Database";
//language=POSTGRES-PSQL
export const changeInviteSetting: Query =
    `
    UPDATE guilds
    SET allows_invites = $1
    WHERE guild_id = $2
    RETURNING allows_invites
    `;

// id, status
//language=POSTGRES-PSQL
export const changeLockdownStatus : Query =
    `
    UPDATE guilds 
    SET lockdown = $2
    WHERE id = $1
    RETURNING *
    `;
//language=POSTGRES-PSQL
export const getGuild : Query  =
    `
    SELECT * from guilds
    WHERE id = $1
    `;


// welcome_channel, guild_id
//language=POSTGRES-PSQL
export const updateWelcomeChannel : Query =
    `
    UPDATE guilds
    SET welcome_channel = $1
    WHERE id = $2 
    RETURNING welcome_channel
    `;
//language=POSTGRES-PSQL
export const getWelcomeChannel : Query =
    `
    SELECT welcome_channel FROM guilds
    WHERE id = $1
    `;

//language=POSTGRES-PSQL
export const updateLogsChannel : Query =
    `
    UPDATE guilds
    SET logs_channel = $1
    WHERE id = $2
    RETURNING logs_channel
    `;


//language=POSTGRES-PSQL
export const getMemberInviteStrikes : Query =
    `
    SELECT invite_strikes FROM guilds
    WHERE id = $1 AND guild_id = $2
    `;


//language=POSTGRES-PSQL
export const upsertPrefix: Query =
    `
    INSERT INTO guilds (id, prefix)
    VALUES ($1, $2) 
    ON CONFLICT (id) DO UPDATE 
    SET prefix = $2 
    RETURNING *
    `;

//language=POSTGRES-PSQL
export const  saveGuild : Query =
    `
    INSERT INTO guilds (id, name)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE
    SET name = $2
    RETURNING *
    `;