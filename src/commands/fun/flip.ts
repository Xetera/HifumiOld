import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";
import {random} from "../../utility/Util";
import safeSendMessage from "../../handlers/safe/SafeSendMessage";

async function run(message: Message): Promise<any> {
    const choices = ['Heads', 'Tails'];
    const choice = random(choices);
    safeSendMessage(message.channel, choice);
}

export const command: Command = new Command(
    {
        names: ['flip'],
        info: "Flips a coin fair and square.",
        usage: '{{prefix}}flip',
        examples: ['{{prefix}}flip'],
        category: 'Fun',
        expects: [{type: ArgType.None}],
        run: run,
    }
);
