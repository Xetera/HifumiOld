import {Query} from "../Database";

//language=POSTGRES-PSQL
export const addMacro: Query =
    `
    INSERT INTO macros(
        creator_id,
        guild_id,
        macro_name,
        macro_content,
        date_created
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;

//language=POSTGRES-PSQL
export const getMacroCount: Query =
    `
    SELECT COUNT(*) FROM macros 
    WHERE guild_id = $1
    `;
//language=POSTGRES-PSQL
export const getMacros: Query =
    `
    SELECT * FROM macros
    WHERE guild_id = $1
    `;

//language=POSTGRES-PSQL
export const getMacro: Query =
    `
    SELECT * FROM macros
    WHERE guild_id = $1 AND macro_name = $2
    `;

//language=POSTGRES-PSQL
export const deleteMacro: Query =
    `
    DELETE FROM macros
    WHERE guild_id = $1 AND macro_name = $2
    RETURNING *
    `;
