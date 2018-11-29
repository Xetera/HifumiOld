import { createCommand } from "../command";
import { Command, Context } from "../types/types";
import { CommandError, quote, random } from "../utils";
import { List } from "immutable";

const owo: Command = createCommand({
  names: ['owo'],
  description: 'Owoifies your message',
  run: (ctx: Context) => {
    const input = ctx.args.join(' ');
    if (!input) {
      throw new CommandError('What am I supposed to owo? Dummy...');
    }
    return ctx.message.channel.send(input.replace(/[rl]/g, 'w'));
  },
  dmDisabled: false,
  // debounce: 5
});

const responses = List([
  "Yes.",
  "No one could say for sure...",
  "Definitely not.",
  "No.",
  "You can count on it.",
  "Probably not."
]);

const eightball: Command = createCommand({
  names: ['8ball', '8b'],
  description: 'Predicts your future',
  run: (ctx: Context, [age]: [number]) => {
    const choice = random(responses);
    return void ctx.message.channel.send(
      `🎱 | I have received your answer, ${ctx.message.author.username}: ${quote(choice)}`
    );
  }
});

export default { owo };
