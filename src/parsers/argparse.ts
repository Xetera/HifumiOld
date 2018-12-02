import { Channel, GuildMember, Message, MessageMentions } from "discord.js";
import { List, Map } from 'immutable';
import * as R from "ramda";
import { PREFIX } from "../command_handler";
import { ArgParseCategory, ArgType, ArgTypes, Arguments, ParsedCommandInput, ParserContext } from "../types/parser";
import { ArgumentError } from "../utils";

const underscore = (input: string) => input.replace(' ', '_');
const compareInsensitive = (first: string, second: string) =>
  R.toLower(first) === R.toLower(second);

const getChannel = (chunk: string | undefined, message: Message) => {
  if (!chunk) {
    return;
  }
  const channelMention = chunk.match(MessageMentions.CHANNELS_PATTERN);

  if (channelMention) {
    return message.guild.channels.get(channelMention.toString());
  }

  return message.guild.channels.find(chan =>
    compareInsensitive(chan.id, chunk) || compareInsensitive(chan.name, chunk)
  );
};

const getMember = (chunk: string | undefined, message: Message) => {
  if (!chunk) {
    return;
  }
  const memberMention = chunk.match(MessageMentions.USERS_PATTERN);

  if (memberMention) {
    return message.guild.members.get(memberMention.toString());
  }

  return message.guild.members.find(member =>
    compareInsensitive(member.id, chunk)
    || compareInsensitive(underscore(member.user.username), chunk)
    || compareInsensitive(underscore(member.nickname), chunk)
  );
};


const categories = Map<ArgType, ArgParseCategory<Arguments>>([
  [ArgType.Number, {
    is: ({ chunks, cursor }) => !isNaN(Number(chunks.get(cursor))),
    to: ({ chunks, cursor }): number => Number(chunks.get(cursor)),
    toString: () => `number`
  }],
  [ArgType.Word, {
    is: ({ chunks, cursor }) => true,
    to: ({ chunks, cursor }): string => chunks.get(cursor)!,
    toString: () => `word`
  }],
  [ArgType.Phrase, {
    is: ({ chunks, cursor }) => chunks.slice(cursor).size > 0,
    to: ({ chunks, cursor }): string => chunks.slice(cursor).join(' '),
    toString: () => `phrase`
  }],
  [ArgType.Channel, {
    is: ({ message, chunks, cursor }) => Boolean(getChannel(chunks.get(cursor), message)),
    to: ({ chunks, cursor, message }): Channel => {
      const chunk = chunks.get(cursor);
      const channel = getChannel(chunk, message);
      if (!channel) {
        throw new Error(`Expected ${chunk} to be a channel.`);
      }
      return channel;
    },
    toString: () => `channel`
  }],
  [ArgType.GuildMember, {
    is: ({ chunks, cursor, message }) => Boolean(getMember(chunks.get(cursor), message)),
    to: ({ chunks, cursor, message }): GuildMember => {
      const chunk = chunks.get(cursor);
      const member = getMember(chunk, message);
      if (!member) {
        throw new Error(`Expected ${chunk} to be a guild member.`);
      }
      return member;
    },
    toString: () => `guild member`
  }]
  // Sorting because we expect the key-value pairs to be in the
  // same order of the ArgType enum
]).sort();

const categoryStrings = categories
  .valueSeq()
  .map(category => category.toString());

export const processWords = (ctx: ParserContext, targetArray: List<ArgType | ArgTypes>): List<Arguments | undefined> => {
  if (ctx.cursor >= targetArray.size) {
    return ctx.output;
  }
  const out = {
    ...ctx,
    cursor: ctx.cursor + 1,
  };
  const temp = targetArray.get(ctx.cursor);
  const targets = List.isList(temp) ? temp : List([temp]);
  const optional = targets.size > 1;
  const word = ctx.chunks.get(ctx.cursor);
  const match = targets.find(target =>
    target && categories.get(target)!.is(ctx) || false
  );

  if (!match && optional) {
    // Still have to push undefined to make sure
    // arg indexes don't shift when optional
    return processWords({
      ...out,
      output: ctx.output.push(undefined)
    }, targetArray);
  } else if (!match) {
    const expected = targets.map(target =>
      target && categoryStrings.get(target)
    );
    throw new ArgumentError(`Expected ${word} to be a ${expected.join(' or ')}`);
  }

  const transformer = categories.get(match) as ArgParseCategory<ArgType>;
  const output = transformer.to(ctx);

  return processWords({
    ...out,
    output: ctx.output.push(output)
  }, targetArray);
};

const extractContent = (message: Message) => List(message.content
  .trim()
  .slice(PREFIX.length)
  .split(/\s+/));

export const processInput = (message: Message, targetArray: List<ArgType | ArgTypes>): ParsedCommandInput => {
  const [commandName, ...chunks] = extractContent(message);
  if (!chunks.length) {
    return { commandName, output: List() };
  }
  const seed = {
    message,
    cursor: 0,
    chunks: List(chunks),
    output: List()
  };
  const output = processWords(seed, targetArray);
  return { commandName, output };
};
