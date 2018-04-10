
import {Query} from "../Database";

//language=POSTGRES-PSQL
export const addNote : Query =
    `
    INSERT INTO notes(
        guild_id,
        user_id,
        staff_id,
        staff_name,
        note_date,
        note_content
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING note_content
    `;

//language=POSTGRES-PSQL
export const getNotes: Query =
        `
    SELECT * FROM notes
    WHERE guild_id = $1 AND user_id = $2
    `;

//language=POSTGRES-PSQL
export const safeDeleteNote: Query =
    `
    DELETE FROM notes
    WHERE note_id = $1 AND guild_id = $2
    RETURNING *
    `;


//language=POSTGRES-PSQL
export const deleteNote: Query =
        `
    DELETE FROM notes
    WHERE note_id = $1
    `;
