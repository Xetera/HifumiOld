//language=POSTGRES-PSQL
import {Query} from "../Database";

export const incrementCleverbotGuildCall: Query =
    `
    UPDATE cleverbot
    SET calls = calls + 1 
    WHERE guild_id = $1 
    RETURNING calls
    `;
//language=POSTGRES-PSQL
export const inserCleverbotGuild : Query =
    `
    INSERT INTO cleverbot (guild_id, premium, calls) 
    VALUES ($1, $2, $3)
    RETURNING *
    `;
