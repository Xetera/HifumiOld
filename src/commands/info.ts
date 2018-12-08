import {
  Message,
  MessageReaction, ReactionCollector, RichEmbedOptions,
  User
} from "discord.js";
import { Set } from 'immutable';
import { fromEvent, Observable } from "rxjs";
import { distinctUntilChanged, map, scan } from "rxjs/operators";
import { createCommand } from "../command";
import { commandRegistry$ } from "../command_handler";
import { Command, Commands, Context } from "../types/types";

const HELP_SUCCESS = '**Help is on the way, check your DMs for the help message!**\n' +
  'Others can react to this message to get a DM as well.';

const HELP_FAIL = "**I couldn't DM you! Maybe your DMs are off?**\n" +
  'Others can still react to this message to get a DM.';

const createEmbed = (commands: Commands): RichEmbedOptions => ({
  title: 'Hifumi 2.0',
  description: "I'm still in alpha! Don't be too harsh on me",
  fields: [{
    name: 'Commands',
    value: commands.map(command => command.names.first()).join(', ')
  }]
});

const dmHelp = async (user: User) => commandRegistry$.subscribe(commands => {
  const embed = createEmbed(commands);
  user.send({ embed });
});

const filterDuplicateReactions$ = (reactions$: Observable<[MessageReaction]>) => reactions$.pipe(
  scan((users: Set<User>, [reaction]: [MessageReaction]) => {
    const user = reaction.users.last();
    return users.add(user);
  }, Set<User>()),
  distinctUntilChanged((set1, set2) => {
    const getUser = (user: User) => user.id;
    return set1.map(getUser).equals(set2.map(getUser));
  }),
  map(set => set.last() as User),
);

const help: Command = createCommand({
  names: ['help', 'h'],
  description: 'Dms you a help message',
  run: async (ctx: Context) => {
    const message = await dmHelp(ctx.message.author).then(
      () => ctx.message.channel.send(HELP_SUCCESS) as Promise<Message>
      , () => ctx.message.channel.send(HELP_FAIL) as Promise<Message>
    ).then((out) => {
      out.react('📬');
      return out;
    });

    const filterMessageAuthors = (reaction: MessageReaction, user: User) =>
      reaction.emoji.name === '📬' && ![
        message.author.id,
        ctx.message.author.id
      ].some(id => id === user.id);

    const sink = new ReactionCollector(message, filterMessageAuthors, { time: 30000 });
    /*
     * Not entirely sure why the message reactions come in a tuple with
     * this method, it's not fired as a tuple from the ReactionCollector
     */
    const collect$: Observable<[MessageReaction]> = fromEvent(sink, 'collect');

    collect$.pipe(filterDuplicateReactions$).subscribe(dmHelp);
  }
});

const test = createCommand({
  names: ['test'],
  description: 'tests',
  run: (ctx: Context) => {
    return ctx.message.channel.send('h');
  }
});

const ping = createCommand({
  names: ['ping'],
  description: 'shows my ping',
  run: ctx => ctx.message.channel.send('...Checking ping')
    .then(msg => {
      const sent = msg as Message;
      return sent.edit(
        `Pong! 🏓 That took me ${sent.createdTimestamp - ctx.message.createdTimestamp}ms`
      );
    })
});

export default { help, test, ping };
