import { Message } from "discord.js";
import * as glob from 'glob';
import { Collection, List, Stack } from "immutable";
import * as R from "ramda";
import { from, Observable, of, ReplaySubject } from "rxjs";
import {
  filter,
  map, mapTo,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { promisify } from "util";
import { logger } from "./loggers";
import { isUserRateLimited, rateLimitForCommand, removeRateLimit } from "./redis";
import { contextStream$ } from "./streams";
import { Command, Commands, Context, SemiContext } from "./types/types";
import { CommandError } from "./utils";

const globAsync = promisify(glob);

const COMMANDS_LOCATION = `${__dirname}/commands/**/*.js`;
export const PREFIX = process.env.PREFIX || '$';

export const handleUnavailableDmCommand = (msg: Message) =>
  msg.reply(`That command is not available in DMs`);

/**
 * Finds a matching command in a command array
 * @param input
 * @param commands
 */
export const findCommand = (input: string, commands: Commands) => commands.find(
  (command: Command) => command.names.includes(input)
);

export const contextHasValidCommand = (ctx: Context) => Boolean(ctx.command);

/**
 * Checks and sets the rate limiting for commands if it needs one
 * @param message$
 */
export const rateLimitCommand$ = (message$: Observable<Context>) => message$.pipe(
  switchMap((ctx: Context) => from(isUserRateLimited(ctx.message.author.id, ctx.command!)).pipe(
    filter(isRateLimited => !isRateLimited),
    mapTo(ctx)
  )),
  tap(() => console.log('not rate limited')),
  tap((ctx: Context) => rateLimitForCommand(ctx.message.author.id, ctx.command!)),
) as Observable<Context>;

// tap((ctx: Context) => rateLimitForCommand(ctx.message.author.id, ctx.command!))
export const transformMessageContext$ = (message$: Observable<SemiContext>): Observable<Context> => message$.pipe(
  withLatestFrom(commandRegistry$),
  map(([ctx, commands]: [SemiContext, Commands]) => {
    const { message } = ctx;
    const [commandWithPrefix, ...leftover] = message.content.split(/\s+/);
    const args = List(leftover);
    const input = commandWithPrefix.slice(1);
    const command = findCommand(input, commands);
    return { ...ctx, args, input, command };
  })
);

// R.chain = flatMap
const commandRegistry = globAsync(COMMANDS_LOCATION, { absolute: true })
  .then(
    R.chain((path: string) => Object.values(require(path).default))
  ).then(List) as Promise<Commands>;

export const commandRegistry$ = from(commandRegistry) as Observable<Commands>;

export const runCommand = async (ctx: Context, command: Command) => {
  const handleError = (e: Error) => {
    if (e instanceof CommandError) {
      logger.info('Invalid command usage');
      removeRateLimit(ctx.message.author.id, command);
      return ctx.message.channel.send(`🚫 ${e.message}`, { disableEveryone: true });
    }
    logger.error(`Something went wrong with the function ${ctx.input}`);
    return ctx.message.channel.send(`Oh no... Something unexpected happened while trying to do that`);
  };

  try {
    await command.run(ctx);
  } catch (e) {
    handleError(e);
  }
};

export const handleValidCommandRequest = (ctx: Context) => {
  console.log('handling command!');
  return runCommand(ctx, ctx.command!);
};


contextStream$.pipe(
  transformMessageContext$,
  filter(contextHasValidCommand),
  rateLimitCommand$
).subscribe(handleValidCommandRequest);
