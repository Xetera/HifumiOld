import {Query} from "../Database";
//language=POSTGRES-PSQL
export const setIgnored : Query =
    `
    UPDATE users
    SET ignoring = $1 
    WHERE guild_id = $2 AND id = $3
    RETURNING ignoring
    `;
//language=POSTGRES-PSQL
export const getAllMembers : Query =
    `
    SELECT * FROM users
    WHERE guild_id = $1
    `;
//language=POSTGRES-PSQL
export const getLeftMembers : Query =
    `
    SELECT * from users 
    WHERE NOT EXISTS(
        SELECT 1 FROM users
        WHERE  
    `;

/**
 *
 * id, name, guild_id
 *///language=POSTGRES-PSQL
export const saveMember : Query =
    `
    INSERT INTO users(id, name, guild_id)
    SELECT $1, $2, $3
    WHERE NOT
     EXISTS(
        SELECT 1 FROM users 
        WHERE id = $1 AND guild_id = $3
    )`;
//language=POSTGRES-PSQL
export const cleanAllGuildMembers : Query =
    `
    DELETE FROM users 
    WHERE guild_id = $1
    `;
//language=POSTGRES-PSQL
export const incrementMemberInviteStrikes : Query =
    `
    UPDATE users
    SET invite_strikes = invite_strikes + 1 
    WHERE id = $1 AND guild_id = $2 
    RETURNING invite_strikes
    `;
//language=POSTGRES-PSQL
export const insertMember : Query =
    `
    INSERT INTO users (id, name, guild_id) 
    VALUES ($1, $2, $3)
    RETURNING *
    `;

export const getAllUsers : Query =
    `SELECT id, guild_id FROM users`;
