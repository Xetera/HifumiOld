import { List } from "immutable";
import { createCommand } from "../command";
import { Command, Context } from "../types/types";
import { CommandError, quote, random } from "../utils";

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
  run: async (ctx: Context) => {
    const choice = random(responses);
    // return void ctx.message.channel.send(
    //   `🎱 | I have received your answer, ${ctx.message.author.username}: ${quote(choice)}`
    // );

    const message = await ctx.message.channel.fetchMessage('myboysid');
    const msg = {
      ...ctx.message,
      channel: {
        ...ctx.message.channel,
        send: message.edit.bind(message)
      }
    };
    // ctx.message.channel.send()
  }
});

export default { owo, eightball };
