import { Client, Message } from "discord.js";
import { Node } from 'lavalink';
import * as R from 'ramda';
import { fromEvent, merge, Observable, pipe } from "rxjs";
import { filter, flatMap, map, partition, share, tap } from "rxjs/operators";
import { Connection } from "typeorm";
import { commandRegistry$, handleUnavailableDmCommand, PREFIX } from "./command_handler";
import { conn } from "./db";
import { logger } from "./loggers";
import { redis } from "./redis";
import { contextStream$ } from "./streams";
import { SemiContext } from "./types/types";

export const handleEvents = async (bot: Client) => {
  const db = await conn;
  const voice = new Node({
    password: 'youshallnotpass',
    userID: '381033323851415552',
    shardCount: 0,
    hosts: {
      rest: 'http://localhost:8080',
      ws: 'http://localhost:8080'
    },
    send: (guildID: string, packet: any) => {
      if (!bot.guilds.has(guildID)) {
        throw new Error('Cannot send a packet to this shard');
      }
      // @ts-ignore
      return bot.ws.send(packet);
    }
  });
  const ctx = { bot, db, voice };

  const ready$ = fromEvent(bot, 'ready');
  handleReady(ready$, bot);

  const message$: Observable<Message> = fromEvent(bot, 'message');
  filterMessage(message$).pipe(
    map(message => ({ ...ctx, message })),
  ).subscribe((context: SemiContext) => contextStream$.next(context));

  const edit$: Observable<[Message, Message]> = fromEvent(bot, 'messageUpdate');

  const raw$ = fromEvent(bot, 'raw');
  raw$.subscribe((pk: any) => {
    if (pk.t === 'VOICE_STATE_UPDATE') { voice.voiceStateUpdate(pk.d); }
    if (pk.t === 'VOICE_SERVER_UPDATE') { voice.voiceServerUpdate(pk.d); }
  });
  // edit$.pipe(map(([first]) => filterMessage(first))).subscribe()
};

export const isGuildMessage = (message: Message) => Boolean(message.guild);

// TODO: implement
export const canHandleAsGuildMessage = (message: Message) => true;

export const splitMessageTypes = partition(isGuildMessage);
export const splitGuildSpecific = partition(canHandleAsGuildMessage);

const handleReady = (obs$: Observable<{}>, bot: Client) => obs$.pipe(
  tap(() => logger.info('Client is ready')),
  flatMap(() => bot.generateInvite()),
).subscribe((url) => {
  // loadGuilds(bot);
  logger.info(url);
});

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
