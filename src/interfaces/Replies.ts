import {random} from "../utility/Util";
import getInvite from "../commands/DM/getInvite";

export const adminOnlyCommand : string = 'This command is only available to admins.';

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

export function randomRuntimeError() : string {
    return random(runtimeErrorResponses);
}

export function advertiseOnBan(): string {
    return `Want to protect your own server from people like yourself? **Invite me!**\n${getInvite()}`;
}

export const runtimeErrorResponses : string[] = [
    "Holy... I almost crashed while trying to do that, there was an error somewhere.",
    "I really tried my best to do that but something wen't wrong so I couldn't...",
    "This is a little bit awkward but I basically almost broke trying to do that, something's wrong.",
    "Uh oh, something wen't wrong and I don't know what. Someone will look into this."
];