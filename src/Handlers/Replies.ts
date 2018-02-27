import {Guild} from "discord.js";

export function bannedForSpammingInvites(guild : Guild) : string {
    return `I went ahead and banned you for spamming invites in `+
    `'${guild.name}', advertising isn't allowed, sorry.`;
}
export const welcomeMessages = [
    'You must be new around here kid...',
    "Interesting, I haven't seen you around before.",
    'A new challenger approaches!',
    "What do you think you're some sort of a tough guy huh?",
    'Wow, according to my calculations you had a 100% chance of joining!',
    '+1 guild size!',
    "I've heard prophecies of your forthcoming, stranger.",
    'You pressed that join button like a champ.',
    'Why hello, what brings you here, friend?'
];