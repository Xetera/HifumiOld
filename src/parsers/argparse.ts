import { Channel, GuildMember, Message, MessageMentions } from "discord.js";
import { Map } from 'immutable';
import * as R from "ramda";
import { PREFIX } from "../command_handler";
import { ArgParseCategory, ArgType, ArgTypes, Arguments, ParsedCommandInput, ParserContext } from "../types/parser";
import { ArgumentError } from "../utils";

const underscore = (input: string) => input.replace(' ', '_');
const compareInsensitive = (first: string, second: string) =>
  R.toLower(first) === R.toLower(second);

const getChannel = (chunk: string, message: Message) => {
  const channelMention = chunk.match(MessageMentions.CHANNELS_PATTERN);

  if (channelMention) {
    return message.guild.channels.get(channelMention.toString());
  }

  return message.guild.channels.find(chan =>
    compareInsensitive(chan.id, chunk) || compareInsensitive(chan.name, chunk)
  );
};

const getMember = (chunk: string, message: Message) => {
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
    is: ({ chunks, cursor }) => !isNaN(Number(chunks[cursor])),
    to: ({ chunks, cursor }): number => Number(chunks[cursor]),
    toString: () => `number`
  }],
  [ArgType.Word, {
    is: ({ chunks, cursor }) => true,
    to: ({ chunks, cursor }): string => chunks[cursor],
    toString: () => `word`
  }],
  [ArgType.Phrase, {
    is: ({ chunks, cursor }) => chunks.slice(cursor).length > 0,
    to: ({ chunks, cursor }): string => chunks.slice(cursor).join(' '),
    toString: () => `phrase`
  }],
  [ArgType.Channel, {
    is: ({ message, chunks, cursor }) => Boolean(getChannel(chunks[cursor], message)),
    to: ({ chunks, cursor, message }): Channel => {
      const chunk = chunks[cursor];
      const channel = getChannel(chunk, message);
      if (!channel) {
        throw new Error(`Expected ${chunk} to be a channel.`);
      }
      return channel;
    },
    toString: () => `channel`
  }],
  [ArgType.GuildMember, {
    is: ({ chunks, cursor, message }) => Boolean(getMember(chunks[cursor], message)),
    to: ({ chunks, cursor, message }): GuildMember => {
      const chunk = chunks[cursor];
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
  .map(category => category.toString())
  .toArray();

export const processWords = (ctx: ParserContext, targetArray: Array<ArgType | ArgTypes>): Array<Arguments | undefined> => {
  if (ctx.cursor >= targetArray.length) {
    return ctx.output;
  }
  const out = {
    ...ctx,
    cursor: ctx.cursor + 1,
  };
  const temp = targetArray[ctx.cursor];
  const targets: ArgTypes = Array.isArray(temp) ? temp : [temp];
  const optional = targets.length > 1;
  const word = ctx.chunks[ctx.cursor];
  const match = targets.find((target: ArgType) => categories.get(target)!.is(ctx));

  if (!match && optional) {
    // Still have to push undefined to make sure
    // arg indexes don't shift when optional
    return processWords({
      ...out,
      output: [...ctx.output, undefined]
    }, targetArray);
  } else if (!match) {
    const expected = targets.map(target => categoryStrings[target]);
    throw new ArgumentError(`Expected ${word} to be a ${expected.join(' or ')}`);
  }

  const transformer = categories.get(match) as ArgParseCategory<ArgType>;
  const output = transformer.to(ctx);

  return processWords({
    ...out,
    output: [...ctx.output, output]
  }, targetArray);
};

const extractContent = (message: Message) => message.content
  .trim()
  .slice(PREFIX.length)
  .split(/\s+/);

export const processInput = (message: Message, targetArray: Array<ArgType | ArgTypes>): ParsedCommandInput => {
  const [commandName, ...chunks] = extractContent(message);
  if (!chunks.length) {
    return { commandName, output: [] };
  }
  const seed = {
    message,
    cursor: 0,
    chunks,
    output: []
  };
  const output = processWords(seed, targetArray);
  return { commandName, output };
};
