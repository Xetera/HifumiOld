import {Message} from 'discord.js'
import {Command} from "../../handlers/commands/Command";
import {ArgType} from "../../decorators/expects";

async function run(message: Message, input: [string]): Promise<any> {
	const out = message.content.replace(/[rl]/g, 'w');
	return message.channel.send(out, { disableEveryone: true });
}

export const command: Command = new Command(
	{
		names: ['uwu'],
		info: 'Uwuifies your message',
		usage: '{{prefix}}uwu { message }',
		examples: ['{{prefix}}uwu Im running out of message to write.'],
		category: 'Fun',
		expects: [{type: ArgType.Message}],
		run
	}
);
