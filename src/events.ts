import { Client, Message } from "discord.js";
import * as R from 'ramda';
import { fromEvent, merge, Observable, Subject } from "rxjs";
import { filter, flatMap, partition, share, tap } from "rxjs/operators";
import { handleCommand, handleUnavailableDmCommand } from "./command_handler";
import { logger, logMessage } from "./loggers";

export const msgStream$ = new Subject<Message>();

export const handleEvents = (bot: Client) => {
  const ready$ = fromEvent(bot, 'ready');
  handleReady(ready$, bot);

  const message$: Observable<Message> = fromEvent(bot, 'message');
  handleMessage(message$).subscribe(handleCommand);
};


export const isGuildMessage = (message: Message) => Boolean(message.guild);
export const canHandleAsGuildMessage = (message: Message) => message.content === 'test';

export const splitMessageTypes = partition(isGuildMessage);
export const splitGuildSpecific = partition(canHandleAsGuildMessage);


const handleReady = (obs$: Observable<{}>, bot: Client) => obs$.pipe(
  tap(() => logger.info('Client is ready')),
  flatMap(() => bot.generateInvite()),
).subscribe(inv => {
  logger.info(inv);
});

const isMessageValid = R.allPass([
  (m: Message) => !m.author.bot,
  (m: Message) => m.content.startsWith('$')
]);

const handleMessage = (message$: Observable<Message>) => {
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

  const availableCommand$ = merge(loggedGuildMessages$, nonGuildSpecificDm$);

  return availableCommand$.pipe(
    tap(() => console.log('in last pipe')),
    tap(msg => msgStream$.next(msg))
  );
};





