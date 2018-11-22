import { Message } from "discord.js";
import * as glob from 'glob';
import { List } from "immutable";
import * as R from "ramda";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { filter, flatMap, map } from "rxjs/operators";
import { promisify } from "util";
import { contextStream$ } from "./streams";
import { Command, CommandReturn, Context, SemiContext } from "./types";

const globAsync = promisify(glob);

export const handleUnavailableDmCommand = (msg: Message) =>
  msg.reply(`That command is not available in DMs`);

/**
 * Finds a matching command in a command array
 * @param input
 * @param commands
 */
export const findCommand = (input: string, commands: List<Command>) => commands.find(
  command => command.names.includes(input)
);

export const transformMessageContext$ = (message$: Observable<SemiContext>): Observable<Context> => message$.pipe(
  map(({ message, bot }) => {
    const [command, ...args] = message.content.split(/\s+/);
    const input = command.slice(1);
    return { bot, message, args, input };
  })
);

export const commandRegistry = new BehaviorSubject(List()).pipe(
  flatMap(() => globAsync(
    `${__dirname}/commands/**/*.js`,
    { absolute: true }
  )),
  flatMap(R.pipe(
    R.map(require),
    R.pluck('default'),
    List
  ))
) as Observable<List<Command>>;

export const handleCommand = async (ctx: Context, command: Command) => {
  try {
    const out = await command.run(ctx);
    if (out) {
      return ctx.message.channel.send(out, { disableEveryone: true });
    }
  } catch (e) {
    return ctx.message.channel.send(e, { disableEveryone: true });
  }
};

export const handleCommandRequest = (ctx: Context) => commandRegistry.pipe(
  map(command => findCommand(ctx.input, command)),
  filter(Boolean)
).subscribe(command => handleCommand(ctx, command));


contextStream$.pipe(transformMessageContext$).subscribe(handleCommandRequest);
