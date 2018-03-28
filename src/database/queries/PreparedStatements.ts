import {Guild, GuildMember} from "discord.js";
import {Query} from "../Database";

//
// guild_id
export const getWhitelistedInvites : Query =
    `
    SELECT link FROM whitelisted_invites 
    WHERE guild_id = $1
    `;


export const  getWhiltelistedInvites : Query =
    `
    SELECT link FROM whitelisted_invites
    WHERE guild_id = $1
    `;




