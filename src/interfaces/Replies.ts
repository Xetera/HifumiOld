import {random} from "../utility/Util";
import getInvite from "../commands/DM/getInvite";
import {GuildMember} from "discord.js";
import {gb} from "../misc/Globals";

export const adminOnlyCommand : string = 'This command is only available to admins.';

export function welcomeMessages(member: GuildMember) {
    return [
        `You must be new around here kid...`,
        `Interesting, I haven't seen you around before.`,
        `A new challenger approaches!`,
        `Do I remember you from somewhere? 🤔`,
        `Wow ${member}, according to my calculations you had a 100% chance of joining!`,
        `+1 server size!`,
        `I've heard prophecies of your forthcoming, stranger.`,
        `Wait... are you the _real_ ${member}?? OMG`,
        `It's a bird, it's a plane, it's!... oh wait it's just ${member}`,
        `You pressed that join button like a champ.`,
        `Why hello ${member}, what brings you here?`,
        `Hands in the air ${member}! Oh sorry it just felt like you stole my heart there... my bad.`,
        `Christmas came early, it's ${member}!`,
        `Oh hello, what's this I'm reading about you being a cool duderoni? What do you have to say for yourself ${member}?`,
        `Baby ${member} you got a kid? Cuz you look like OOO MAMA!`,
        `I got excited for a second but turns out it's just ${member} ${gb.emojis.get('hifumi_feels_bad_man')}`
    ];
}

export function randomRuntimeError() : string {
    return random(runtimeErrorResponses);
}

export function advertiseOnBan(): string {
    return `Want to protect your own server from people like yourself? [Invite me!](${getInvite()})`;
}

export const runtimeErrorResponses : string[] = [
    "Holy... I almost crashed while trying to do that, there was an error somewhere.",
    "I really tried my best to do that but something wen't wrong so I couldn't...",
    "This is a little bit awkward but I basically almost broke trying to do that, something's wrong.",
    "Uh oh, something wen't wrong and I don't know what. Someone will look into this."
];
