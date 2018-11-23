import { List } from "immutable";
import { createCommand } from "../command";
import { Command, Context } from "../types";
import { CommandError } from "../utils";

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

export default { owo };
