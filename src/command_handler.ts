import { Message } from "discord.js";
import * as glob from 'glob';
import { Collection, List, Stack } from "immutable";
import * as R from "ramda";
import { from, Observable, of, pipe, ReplaySubject } from "rxjs";
import {
  filter,
  map, mapTo,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { promisify } from "util";
import { logger } from "./loggers";
import { processInput } from "./parsers/argparse";
import { isUserRateLimited, rateLimitForCommand, removeRateLimit } from "./redis";
import { contextStream$ } from "./streams";
import { Command, Commands, Context, SemiContext } from "./types/types";
import { CommandError } from "./utils";
import { converge, filterAndHandle } from "./rxjs";

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

export const commandCanRun = async (ctx: Context) => {
  if (!ctx.command || !ctx.command.canRun) {
    return true;
  }
  return ctx.command.canRun(ctx);
};

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
    const [commandWithPrefix] = message.content.split(/\s+/);
    const input = commandWithPrefix.slice(1);
    const command = findCommand(input, commands);
    const out = { ...ctx, input, command };
    if (command) {
      const { output } = processInput(message, command.expects || List());
      return { ...out, args: output };
    }
    return { ...out, args: List() };
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
    logger.error(e);
    return ctx.message.channel.send(`Oh no... Something unexpected happened while trying to do that`);
  };

  try {
    await command.run(ctx, ctx.args);
  } catch (e) {
    handleError(e);
  }
};

export const handleValidCommandRequest = async (ctx: Context) => {
  if (ctx.command && ctx.command.pre) {
    await ctx.command.pre(ctx);
  }

  await runCommand(ctx, ctx.command!);

  if (ctx.command && ctx.command.post) {
    await ctx.command.post(ctx);
  }
};

export const handleInvalidCommandRequest = (ctx: Context) => {
  if (ctx.command && ctx.command.onFail) {
    return ctx.command.onFail(ctx);
  }
};

const separateInvalidRequest = (handler: (ctx: Context) => any) => (obs: Observable<Context>) => obs.pipe(
  switchMap((ctx: Context) => converge(commandCanRun(ctx)).pipe(
    filterAndHandle(Boolean, () => handler(ctx)),
    mapTo(ctx)
  ))
);

contextStream$.pipe(
  transformMessageContext$,
  filter(contextHasValidCommand),
  separateInvalidRequest(handleInvalidCommandRequest),
  rateLimitCommand$,
).subscribe(handleValidCommandRequest);
