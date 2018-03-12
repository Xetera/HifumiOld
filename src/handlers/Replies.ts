import {Guild} from "discord.js";
import {random} from "../utility/Util";
import getInvite from "../commands/DM/getInvite";
import gb from "../misc/Globals";
import {errors} from "pg-promise";
import {underline} from "../utility/Markdown";

export const adminOnlyCommand : string = 'This command is only available to admins.';

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

export const onNewGuildJoin =
    'I\'m here to help with baddies on your server and keep things nice and tidy.\n' +
    'You can also talk to me when you\'re bored by just calling my name! That\'s how you humans normally do it... right?';

export const lackingOwnerPermissions =
    '_Laughing hysterically_ oh god, I can\'t believe you thought I\'d let you do that.';

export function randomRuntimeError() : string {
    return random(runtimeErrorResponses);
}

export function advertiseOnRaidBan() : string {
    return `Want to protect your own server from people like yourself? Invite me!\n${getInvite()}`;
}

export const runtimeErrorResponses : string[] = [
    "Holy... I almost crashed while trying to do that, there was an error somewhere.",
    "I really tried my best to do that but something wen't wrong so I couldn't...",
    "This is a little bit awkward but I basically almost broke trying to do that, something's wrong.",
    "Uh oh, something wen't wrong and I don't know what.",
    "So I got an unexpected error trying to do that but on the bright side, I would have crashed if not for this message."
];