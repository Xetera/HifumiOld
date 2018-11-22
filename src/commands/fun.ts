import { Command, Context } from "../types";

const owo: Command = {
  names: ['owo'],
  run: (ctx: Context) => {
    const input = ctx.args.join(' ');
    if (!input) {
      return 'owo?';
    }
    return input.replace(/[rl]/g, 'w');
  },
  dmDisabled: false
};

export default [owo];
