import {Guild} from "discord.js";

export function bannedForSpammingInvites(guild : Guild) : string {
    return `I went ahead and banned for spamming invites in `+
    `'${guild.name}', advertising isn't allowed, sorry.`;
}