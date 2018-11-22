import { Message } from "discord.js";
import * as glob from 'glob';
import * as R from "ramda";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, flatMap, map } from "rxjs/operators";
import { promisify } from "util";
import { contextStream$ } from "./streams";
import { Command, Context, SemiContext } from "./types";

const globAsync = promisify(glob);

export const handleUnavailableDmCommand = (msg: Message) =>
  msg.reply(`This command is not available in DMs`);

export const findCommand = (input: string, commands: Command[]) => commands.find(
  command => command.names.includes(input)
);

export const transformMessage$ = (message$: Observable<SemiContext>): Observable<Context> => message$.pipe(
  map(({ message, bot }) => {
    const sections = message.content.split(/\s+/);
    const input = sections[0].slice(1);
    const args = sections.slice(1);
    return { bot, message, args, input };
  })
);


export const registry = new BehaviorSubject<Command[]>([]).pipe(
  flatMap(() => globAsync(
    `${__dirname}/commands/**/*.js`,
    { absolute: true }
  )),
  flatMap(R.pipe(
    R.map(require),
    R.pluck('default'),
  ))
) as Observable<Command[]>;

export const handleCommand = (ctx: Context, command: Command) => {
  ctx.message.reply('You entered a valid command');
  console.log(command);
};

export const handleCommandRequest = (ctx: Context) => registry.pipe(
  map(command => findCommand(ctx.input, command)),
  filter(Boolean)
).subscribe(command => handleCommand(ctx, command));


contextStream$.pipe(transformMessage$).subscribe(handleCommandRequest);
