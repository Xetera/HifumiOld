import {Guild} from "discord.js";

export function bannedForSpammingInvites(guild : Guild) : string {
    return `I went ahead and banned you for spamming invites in `+
    `'${guild.name}', advertising isn't allowed, sorry.`;
}
export const welcomeMessages = [
    'You must be new around here kid...',
    "Interesting, I haven't seen you around before.",
    'A new challenger approaches!'
];