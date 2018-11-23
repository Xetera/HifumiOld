import { Client, Message } from "discord.js";
import * as R from 'ramda';
import { fromEvent, merge, Observable } from "rxjs";
import { filter, flatMap, map, partition, share, tap } from "rxjs/operators";
import { commandRegistry$, handleUnavailableDmCommand, PREFIX } from "./command_handler";
import { logger } from "./loggers";
import { contextStream$ } from "./streams";
import { SemiContext } from "./types";

export const handleEvents = (bot: Client) => {
  const ctx = {
    bot,
  };
  const ready$ = fromEvent(bot, 'ready');
  handleReady(ready$, bot);

  const message$: Observable<Message> = fromEvent(bot, 'message');
  filterMessage(message$).pipe(
    map(message => ({ ...ctx, message })),
  ).subscribe((context: SemiContext) => contextStream$.next(context));
};

export const isGuildMessage = (message: Message) => Boolean(message.guild);

// TODO: implement
export const canHandleAsGuildMessage = (message: Message) => true;

export const splitMessageTypes = partition(isGuildMessage);
export const splitGuildSpecific = partition(canHandleAsGuildMessage);

const handleReady = (obs$: Observable<{}>, bot: Client) => obs$.pipe(
  tap(() => logger.info('Client is ready')),
  flatMap(() => bot.generateInvite()),
).subscribe(logger.info);

const isMessageValid = R.allPass([
  (m: Message) => !m.author.bot,
  (m: Message) => m.content.startsWith(PREFIX)
]);

const filterMessage = (message$: Observable<Message>) => {
  const validMessage$ = message$.pipe(filter(isMessageValid));

  const [guildMessage$, dmMessage$] = splitMessageTypes(validMessage$);

  const loggedGuildMessages$ = guildMessage$.pipe(
    tap(msg => logger.info(`[${msg.guild.name}]: ${msg.author.username}: ${msg.content}`)),
  );

  const loggedDmMessages$ = dmMessage$.pipe(
    tap(msg => logger.info(`[DM]: ${msg.author.username}: ${msg.content}`)),
    share()
  );

  const [nonGuildSpecificDm$, unavailableCommand$] = splitGuildSpecific(loggedDmMessages$);
  unavailableCommand$.subscribe(msg => handleUnavailableDmCommand(msg));

  return merge(loggedGuildMessages$, nonGuildSpecificDm$);
};





